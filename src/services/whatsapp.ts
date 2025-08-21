interface WhatsAppMessage {
  to: string;
  message: string;
  type: 'text' | 'template';
  template_name?: string;
  template_data?: Record<string, string>;
}

interface WhatsAppResponse {
  success: boolean;
  message_id?: string;
  error?: string;
}

interface WAHAResponse {
  id: string;
  timestamp: number;
  from: string;
  to: string;
  body: string;
}

interface WAHAErrorResponse {
  error: string;
  message: string;
  statusCode: number;
}

class WhatsAppService {
  private wahaUrl: string;
  private wahaApiKey: string;
  private sessionName: string;

  constructor() {
    // WAHA configuration - these should be environment variables
    this.wahaUrl = import.meta.env.VITE_WAHA_URL || 'http://34.83.178.21:3000';
    this.wahaApiKey = import.meta.env.VITE_WAHA_API_KEY || 'admin';
    this.sessionName = import.meta.env.VITE_WAHA_SESSION || 'default';
  }

  private async sendRequest(endpoint: string, data: any): Promise<WhatsAppResponse> {
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      // Add API key to headers if provided
      if (this.wahaApiKey) {
        headers['X-API-Key'] = this.wahaApiKey;
      }

      const response = await fetch(`${this.wahaUrl}${endpoint}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        const errorResult = result as WAHAErrorResponse;
        throw new Error(errorResult.message || errorResult.error || 'WAHA API error');
      }

      const wahaResult = result as WAHAResponse;
      return {
        success: true,
        message_id: wahaResult.id,
      };
    } catch (error) {
      console.error('WAHA API error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async sendTextMessage(phoneNumber: string, message: string): Promise<WhatsAppResponse> {
    // Format phone number for WAHA (should include country code without + sign)
    const formattedPhoneNumber = this.formatPhoneNumber(phoneNumber);
    
    const data = {
      session: this.sessionName,
      chatId: `${formattedPhoneNumber}@c.us`,
      text: message,
    };

    return this.sendRequest(`/api/sendText`, data);
  }

  async sendTemplateMessage(
    phoneNumber: string,
    templateName: string,
    templateData: Record<string, string>
  ): Promise<WhatsAppResponse> {
    // WAHA doesn't support template messages in the same way as official API
    // We'll send a formatted text message instead
    const formattedPhoneNumber = this.formatPhoneNumber(phoneNumber);
    
    // Create a formatted message from template data
    let message = `Template: ${templateName}\n\n`;
    Object.entries(templateData).forEach(([key, value]) => {
      message += `${key}: ${value}\n`;
    });

    return this.sendTextMessage(phoneNumber, message);
  }

  private formatPhoneNumber(phoneNumber: string): string {
    // Remove any non-digit characters
    let cleaned = phoneNumber.replace(/\D/g, '');
    
    // If it starts with 0, replace with 62 (Indonesia country code)
    if (cleaned.startsWith('0')) {
      cleaned = '62' + cleaned.substring(1);
    }
    
    // If it doesn't start with 62, add it
    if (!cleaned.startsWith('62')) {
      cleaned = '62' + cleaned;
    }
    
    return cleaned;
  }

  async sendStatusUpdateNotification(
    phoneNumber: string,
    requestNumber: string,
    serviceType: string,
    status: string,
    operatorNotes?: string
  ): Promise<WhatsAppResponse> {
    const statusMessages = {
      pending: 'Menunggu diproses',
      on_process: 'Sedang diproses',
      completed: 'Selesai dan siap diambil',
      cancelled: 'Dibatalkan',
    };

    const message = `🔔 *Update Status Permohonan*

📋 Nomor Permohonan: *${requestNumber}*
📄 Jenis Layanan: *${serviceType}*
📊 Status: *${statusMessages[status as keyof typeof statusMessages]}*

${operatorNotes ? `📝 Catatan: ${operatorNotes}\n` : ''}
${status === 'completed' ? '✅ Silakan datang ke kantor desa untuk mengambil dokumen dengan membawa KTP asli.' : ''}
${status === 'cancelled' ? '❌ Silakan hubungi kantor desa untuk informasi lebih lanjut.' : ''}

Terima kasih telah menggunakan layanan kami.
Kantor Desa Tempursari`;

    return this.sendTextMessage(phoneNumber, message);
  }

  // WAHA-specific methods
  async getSessionStatus(): Promise<{ success: boolean; status?: string; error?: string }> {
    try {
      const headers: Record<string, string> = {};
      if (this.wahaApiKey) {
        headers['X-API-Key'] = this.wahaApiKey;
      }

      const response = await fetch(`${this.wahaUrl}/api/sessions/${this.sessionName}`, {
        method: 'GET',
        headers,
      });

      const result = await response.json();

      if (!response.ok) {
        return { success: false, error: result.message || 'Session status check failed' };
      }

      return { success: true, status: result.status };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  async startSession(): Promise<{ success: boolean; error?: string }> {
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (this.wahaApiKey) {
        headers['X-API-Key'] = this.wahaApiKey;
      }

      const response = await fetch(`${this.wahaUrl}/api/sessions/start`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          name: this.sessionName,
          config: {
            webhooks: [],
            debug: false,
          },
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        return { success: false, error: result.message || 'Failed to start session' };
      }

      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  async sendImage(phoneNumber: string, imageUrl: string, caption?: string): Promise<WhatsAppResponse> {
    const formattedPhoneNumber = this.formatPhoneNumber(phoneNumber);
    
    const data = {
      session: this.sessionName,
      chatId: `${formattedPhoneNumber}@c.us`,
      file: {
        url: imageUrl,
      },
      caption: caption || '',
    };

    return this.sendRequest('/api/sendImage', data);
  }

  async sendDocument(phoneNumber: string, documentUrl: string, filename?: string): Promise<WhatsAppResponse> {
    const formattedPhoneNumber = this.formatPhoneNumber(phoneNumber);
    
    const data = {
      session: this.sessionName,
      chatId: `${formattedPhoneNumber}@c.us`,
      file: {
        url: documentUrl,
        filename: filename || 'document.pdf',
      },
    };

    return this.sendRequest('/api/sendFile', data);
  }

  // Utility method to check if WAHA server is accessible
  async checkServerHealth(): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(`${this.wahaUrl}/api/sessions`, {
        method: 'GET',
        headers: this.wahaApiKey ? { 'X-API-Key': this.wahaApiKey } : {},
      });

      if (!response.ok) {
        return { success: false, error: `Server responded with status ${response.status}` };
      }

      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Cannot connect to WAHA server' 
      };
    }
  }
}

export const whatsappService = new WhatsAppService();

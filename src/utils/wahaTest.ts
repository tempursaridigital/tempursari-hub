import { whatsappService } from '@/services/whatsapp';

export class WAHATestUtility {
  
  /**
   * Test WAHA server connectivity and session status
   */
  static async testConnection(): Promise<void> {
    console.log('🔍 Testing WAHA Connection...');
    
    // Test server health
    const health = await whatsappService.checkServerHealth();
    if (health.success) {
      console.log('✅ WAHA Server is accessible');
    } else {
      console.error('❌ WAHA Server connection failed:', health.error);
      return;
    }

    // Test session status
    const sessionStatus = await whatsappService.getSessionStatus();
    if (sessionStatus.success) {
      console.log(`✅ Session status: ${sessionStatus.status}`);
      
      if (sessionStatus.status !== 'WORKING') {
        console.warn('⚠️ Session is not in WORKING state. You may need to scan QR code.');
      }
    } else {
      console.error('❌ Session status check failed:', sessionStatus.error);
    }
  }

  /**
   * Send a test message to verify WhatsApp integration
   * @param phoneNumber - Indonesian phone number (e.g., "081234567890" or "6281234567890")
   */
  static async sendTestMessage(phoneNumber: string): Promise<void> {
    console.log(`📱 Sending test message to ${phoneNumber}...`);
    
    const testMessage = `🧪 *Test Message from Tempursari Hub*

Halo! Ini adalah pesan test dari sistem notifikasi WhatsApp Tempursari Hub.

✅ Jika Anda menerima pesan ini, artinya integrasi WAHA berhasil!

Waktu: ${new Date().toLocaleString('id-ID')}
Server: WAHA (WhatsApp HTTP API)

Terima kasih! 🙏`;

    const result = await whatsappService.sendTextMessage(phoneNumber, testMessage);
    
    if (result.success) {
      console.log('✅ Test message sent successfully!');
      console.log('Message ID:', result.message_id);
    } else {
      console.error('❌ Failed to send test message:', result.error);
    }
  }

  /**
   * Send a test status notification
   */
  static async sendTestStatusNotification(phoneNumber: string): Promise<void> {
    console.log(`📋 Sending test status notification to ${phoneNumber}...`);
    
    const result = await whatsappService.sendStatusUpdateNotification(
      phoneNumber,
      'TEST-001',
      'Surat Keterangan Domisili',
      'completed',
      'Dokumen telah selesai diproses dan siap untuk diambil.'
    );
    
    if (result.success) {
      console.log('✅ Test status notification sent successfully!');
      console.log('Message ID:', result.message_id);
    } else {
      console.error('❌ Failed to send test status notification:', result.error);
    }
  }

  /**
   * Complete integration test
   */
  static async runCompleteTest(phoneNumber: string): Promise<void> {
    console.log('🚀 Starting complete WAHA integration test...\n');
    
    try {
      // Test 1: Connection
      await this.testConnection();
      console.log('');
      
      // Test 2: Simple message
      await this.sendTestMessage(phoneNumber);
      console.log('');
      
      // Test 3: Status notification
      await this.sendTestStatusNotification(phoneNumber);
      console.log('');
      
      console.log('🎉 All tests completed! Check your WhatsApp for messages.');
      
    } catch (error) {
      console.error('💥 Test failed with error:', error);
    }
  }
}

// Example usage (uncomment to test):
// WAHATestUtility.runCompleteTest('081234567890');


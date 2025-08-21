import { supabase } from "@/integrations/supabase/client";
import { whatsappService } from "./whatsapp";
import { Database } from "@/integrations/supabase/types";

export type ServiceType = Database['public']['Enums']['service_type'];
export type RequestStatus = Database['public']['Enums']['request_status'];
export type UserRole = Database['public']['Enums']['user_role'];

export interface ServiceRequest {
  id: string;
  request_number: string;
  user_id: string | null;
  service_type: ServiceType;
  full_name: string;
  nik: string;
  phone_number: string;
  status: RequestStatus;
  operator_notes: string | null;
  operator_id: string | null;
  documents: any;
  created_at: string;
  updated_at: string;
  completed_at: string | null;
}

export interface OperatorNote {
  id: string;
  request_id: string;
  operator_id: string;
  note: string;
  old_status: RequestStatus | null;
  new_status: RequestStatus | null;
  created_at: string;
}

export interface CreateRequestData {
  service_type: ServiceType;
  full_name: string;
  nik: string;
  phone_number: string;
  documents?: File[];
}

export interface UpdateRequestData {
  status?: RequestStatus;
  operator_notes?: string;
  completed_at?: string | null;
}

export interface RequestFilters {
  nik?: string;
  service_type?: ServiceType;
  status?: RequestStatus;
  date_from?: string;
  date_to?: string;
  search?: string;
}

export interface DashboardStats {
  total_requests: number;
  pending_requests: number;
  on_process_requests: number;
  completed_requests: number;
  cancelled_requests: number;
  requests_by_service: Record<ServiceType, number>;
  requests_by_date: Array<{ date: string; count: number }>;
}

class LayananApiService {
  // Generate unique request number
  private async generateRequestNumber(): Promise<string> {
    const today = new Date();
    const todayStr = today.toISOString().slice(0, 10).replace(/-/g, ''); // YYYYMMDD
    
    // Get existing request numbers for today
    const { data: existingRequests, error } = await supabase
      .from('service_requests')
      .select('request_number')
      .like('request_number', `REQ-${todayStr}-%`)
      .order('request_number', { ascending: false })
      .limit(1);

    if (error) {
      console.error('Error fetching existing requests:', error);
      // Fallback to timestamp-based number
      return `REQ-${todayStr}-${Date.now().toString().slice(-4)}`;
    }

    let nextNumber = 1;
    if (existingRequests && existingRequests.length > 0) {
      const lastNumber = existingRequests[0].request_number;
      const numberPart = lastNumber.split('-')[2];
      nextNumber = parseInt(numberPart) + 1;
    }

    return `REQ-${todayStr}-${nextNumber.toString().padStart(4, '0')}`;
  }

  // Create new service request
  async createRequest(data: CreateRequestData): Promise<ServiceRequest> {
    console.log('Creating request with data:', data);
    
    // Generate unique request number before inserting
    const requestNumber = await this.generateRequestNumber();
    console.log('Generated request number:', requestNumber);
    
    // For public service requests, we don't require authentication
    // Create the service request without user_id for anonymous submissions
    const { data: request, error: requestError } = await supabase
      .from('service_requests')
      .insert({
        user_id: null, // Allow anonymous submissions
        service_type: data.service_type,
        full_name: data.full_name,
        nik: data.nik,
        phone_number: data.phone_number,
        request_number: requestNumber, // Use generated number
        status: 'pending'
      })
      .select('*')
      .single();

    console.log('Request created:', request);
    console.log('Request error:', requestError);

    if (requestError) {
      // If we get a duplicate key error, try with a timestamp-based number
      if (requestError.code === '23505') {
        console.log('Duplicate request number, retrying with timestamp...');
        const today = new Date();
        const todayStr = today.toISOString().slice(0, 10).replace(/-/g, '');
        const timestampNumber = `REQ-${todayStr}-${Date.now().toString().slice(-6)}`;
        
        const { data: retryRequest, error: retryError } = await supabase
          .from('service_requests')
          .insert({
            user_id: null,
            service_type: data.service_type,
            full_name: data.full_name,
            nik: data.nik,
            phone_number: data.phone_number,
            request_number: timestampNumber,
            status: 'pending'
          })
          .select('*')
          .single();
          
        if (retryError) throw retryError;
        console.log('Retry successful with number:', timestampNumber);
        
        // Continue with the retry request
        const finalRequest = retryRequest;
        
        // Upload documents if any
        if (data.documents && data.documents.length > 0) {
          const tempUserId = `anonymous_${Date.now()}`;
          const documentPaths = await this.uploadDocuments(tempUserId, finalRequest.id, data.documents);
          
          const { error: updateError } = await supabase
            .from('service_requests')
            .update({ documents: { files: documentPaths } })
            .eq('id', finalRequest.id);

          if (updateError) throw updateError;
        }

        return finalRequest;
      }
      throw requestError;
    }

    // Upload documents if any
    if (data.documents && data.documents.length > 0) {
      // For anonymous submissions, use a temporary user ID
      const tempUserId = `anonymous_${Date.now()}`;
      const documentPaths = await this.uploadDocuments(tempUserId, request.id, data.documents);
      
      // Update request with document paths
      const { error: updateError } = await supabase
        .from('service_requests')
        .update({ documents: { files: documentPaths } })
        .eq('id', request.id);

      if (updateError) throw updateError;
    }

    return request;
  }

  // Upload documents to storage
  private async uploadDocuments(userId: string, requestId: string, files: File[]): Promise<string[]> {
    const uploadPromises = files.map(async (file, index) => {
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}/${requestId}/document_${index}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from('service-documents')
        .upload(fileName, file);
      
      if (error) throw error;
      return data.path;
    });

    return await Promise.all(uploadPromises);
  }

  // Get request by NIK (for status checking)
  async getRequestByNIK(nik: string): Promise<ServiceRequest | null> {
    const { data, error } = await supabase
      .from('service_requests')
      .select('*')
      .eq('nik', nik)
      .order('created_at', { ascending: false })
      .limit(1);

    if (error) throw error;
    return data?.[0] || null;
  }

  // Get all requests (for operators)
  async getRequests(filters: RequestFilters = {}): Promise<ServiceRequest[]> {
    console.log('getRequests called with filters:', filters);
    
    try {
      let query = supabase
        .from('service_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (filters.nik) {
        query = query.ilike('nik', `%${filters.nik}%`);
      }

      if (filters.service_type) {
        query = query.eq('service_type', filters.service_type);
      }

      if (filters.status) {
        query = query.eq('status', filters.status);
      }

      if (filters.date_from) {
        query = query.gte('created_at', filters.date_from);
      }

      if (filters.date_to) {
        query = query.lte('created_at', filters.date_to);
      }

      if (filters.search) {
        query = query.or(`full_name.ilike.%${filters.search}%,request_number.ilike.%${filters.search}%`);
      }

      console.log('Executing query...');
      const { data, error } = await query;
      console.log('Query result:', { data, error });
      
      if (error) {
        console.error('Database error:', error);
        throw error;
      }
      
      console.log('Returning data:', data);
      console.log('Data length:', data?.length || 0);
      return data || [];
    } catch (error) {
      console.error('getRequests error:', error);
      throw error;
    }
  }

  // Get request by ID
  async getRequestById(id: string): Promise<ServiceRequest | null> {
    const { data, error } = await supabase
      .from('service_requests')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  // Update request status (for operators)
  async updateRequest(id: string, updateData: UpdateRequestData): Promise<ServiceRequest> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Get current request data
    const currentRequest = await this.getRequestById(id);
    if (!currentRequest) {
      throw new Error('Request not found');
    }

    // Prepare update data
    const updatePayload: any = {
      operator_id: user.id,
      updated_at: new Date().toISOString()
    };

    if (updateData.status !== undefined) {
      updatePayload.status = updateData.status;
    }

    if (updateData.operator_notes !== undefined) {
      updatePayload.operator_notes = updateData.operator_notes;
    }

    if (updateData.completed_at !== undefined) {
      updatePayload.completed_at = updateData.completed_at;
    }

    // Update the request
    const { data: updatedRequest, error: updateError } = await supabase
      .from('service_requests')
      .update(updatePayload)
      .eq('id', id)
      .select('*')
      .single();

    if (updateError) throw updateError;

    // Add operator note
    if (updateData.status !== currentRequest.status || updateData.operator_notes) {
      await this.addOperatorNote(id, {
        note: updateData.operator_notes || `Status diubah dari ${currentRequest.status} ke ${updateData.status}`,
        old_status: currentRequest.status,
        new_status: updateData.status || currentRequest.status
      });
    }

    // Send WhatsApp notification if status changed
    if (updateData.status && updateData.status !== currentRequest.status) {
      try {
        await whatsappService.sendStatusUpdateNotification(
          currentRequest.phone_number,
          currentRequest.request_number,
          this.getServiceTypeName(currentRequest.service_type),
          updateData.status,
          updateData.operator_notes
        );
      } catch (error) {
        console.error('Failed to send WhatsApp notification:', error);
        // Don't throw error here as the main operation succeeded
      }
    }

    return updatedRequest;
  }

  // Add operator note
  async addOperatorNote(requestId: string, noteData: {
    note: string;
    old_status?: RequestStatus;
    new_status?: RequestStatus;
  }): Promise<OperatorNote> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('operator_notes')
      .insert({
        request_id: requestId,
        operator_id: user.id,
        note: noteData.note,
        old_status: noteData.old_status,
        new_status: noteData.new_status
      })
      .select('*')
      .single();

    if (error) throw error;
    return data;
  }

  // Get operator notes for a request
  async getOperatorNotes(requestId: string): Promise<OperatorNote[]> {
    const { data, error } = await supabase
      .from('operator_notes')
      .select('*')
      .eq('request_id', requestId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  // Get dashboard statistics
  async getDashboardStats(dateRange?: { from: string; to: string }): Promise<DashboardStats> {
    let query = supabase
      .from('service_requests')
      .select('*');

    if (dateRange) {
      query = query.gte('created_at', dateRange.from).lte('created_at', dateRange.to);
    }

    const { data: requests, error } = await query;
    if (error) throw error;

    const total_requests = requests?.length || 0;
    const pending_requests = requests?.filter(r => r.status === 'pending').length || 0;
    const on_process_requests = requests?.filter(r => r.status === 'on_process').length || 0;
    const completed_requests = requests?.filter(r => r.status === 'completed').length || 0;
    const cancelled_requests = requests?.filter(r => r.status === 'cancelled').length || 0;

    // Count by service type
    const requests_by_service = requests?.reduce((acc, request) => {
      acc[request.service_type] = (acc[request.service_type] || 0) + 1;
      return acc;
    }, {} as Record<ServiceType, number>) || {} as Record<ServiceType, number>;

    // Count by date
    const requests_by_date = requests?.reduce((acc, request) => {
      const date = new Date(request.created_at).toISOString().split('T')[0];
      const existing = acc.find(item => item.date === date);
      if (existing) {
        existing.count++;
      } else {
        acc.push({ date, count: 1 });
      }
      return acc;
    }, [] as Array<{ date: string; count: number }>) || [];

    return {
      total_requests,
      pending_requests,
      on_process_requests,
      completed_requests,
      cancelled_requests,
      requests_by_service,
      requests_by_date: requests_by_date.sort((a, b) => a.date.localeCompare(b.date))
    };
  }

  // Export requests to CSV
  async exportRequestsToCSV(filters: RequestFilters = {}): Promise<string> {
    const requests = await this.getRequests(filters);
    
    const headers = [
      'Nomor Permohonan',
      'Jenis Layanan',
      'Nama Pemohon',
      'NIK',
      'Nomor HP',
      'Status',
      'Tanggal Pengajuan',
      'Catatan Operator'
    ];

    const rows = requests.map(request => [
      request.request_number,
      this.getServiceTypeName(request.service_type),
      request.full_name,
      request.nik,
      request.phone_number,
      this.getStatusName(request.status),
      new Date(request.created_at).toLocaleDateString('id-ID'),
      request.operator_notes || ''
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    return csvContent;
  }

  // Helper methods
  getServiceTypeName(serviceType: ServiceType): string {
    const names = {
      surat_pengantar_ktp: 'Surat Pengantar KTP',
      surat_keterangan_domisili: 'Surat Keterangan Domisili',
      surat_keterangan_usaha: 'Surat Keterangan Usaha',
      surat_keterangan_tidak_mampu: 'Surat Keterangan Tidak Mampu',
      surat_keterangan_belum_menikah: 'Surat Keterangan Belum Menikah',
      surat_pengantar_nikah: 'Surat Pengantar Nikah',
      surat_keterangan_kematian: 'Surat Keterangan Kematian',
      surat_keterangan_kelahiran: 'Surat Keterangan Kelahiran'
    };
    return names[serviceType] || serviceType;
  }

  getStatusName(status: RequestStatus): string {
    const names = {
      pending: 'Menunggu',
      on_process: 'Diproses',
      completed: 'Selesai',
      cancelled: 'Dibatalkan'
    };
    return names[status] || status;
  }

  // Check if user is operator
  async isOperator(): Promise<boolean> {
    try {
      console.log('Starting isOperator check...');
      
      // Add timeout to prevent hanging
      const timeoutPromise = new Promise<boolean>((_, reject) => 
        setTimeout(() => reject(new Error('isOperator timeout')), 5000)
      );
      
      const checkPromise = (async () => {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        console.log('isOperator - User:', user?.email, 'Error:', userError?.message);
        
        if (!user || userError) {
          console.log('isOperator - No user or error, returning false');
          return false;
        }

        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('user_id', user.id)
          .single();

        console.log('isOperator - Profile:', profile, 'Error:', profileError?.message);
        
        if (profileError) {
          console.log('isOperator - Profile error, returning false');
          return false;
        }
        
        const isOperator = profile?.role === 'operator' || profile?.role === 'admin';
        console.log('isOperator - Result:', isOperator);
        
        return isOperator;
      })();
      
      return await Promise.race([checkPromise, timeoutPromise]);
      
    } catch (error) {
      console.error('isOperator - Error:', error);
      return false;
    }
  }
}

export const layananApi = new LayananApiService();

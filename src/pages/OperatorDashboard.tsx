import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { 
  Search, 
  Filter, 
  Download, 
  Plus, 
  Eye, 
  Edit, 
  LogOut,
  Users,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  RefreshCw,
  BarChart3,
  Calendar,
  Phone,
  User,
  Hash,
  MessageSquare,
  ArrowLeft
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  layananApi, 
  ServiceRequest, 
  RequestStatus, 
  ServiceType, 
  RequestFilters,
  DashboardStats,
  OperatorNote
} from "@/services/layananApi";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

type ViewState = 'login' | 'dashboard' | 'requests' | 'request-detail' | 'reports';

interface LoginData {
  email: string;
  password: string;
}

export default function OperatorDashboard() {
  const [currentView, setCurrentView] = useState<ViewState>('login');
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [loginData, setLoginData] = useState<LoginData>({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [filters, setFilters] = useState<RequestFilters>({});
  const [operatorNotes, setOperatorNotes] = useState<OperatorNote[]>([]);
  const [updateData, setUpdateData] = useState({
    status: undefined as RequestStatus | undefined,
    notes: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    console.log('Component mounted, starting initial auth check');
    checkAuth();
    
    // Listen for auth state changes (simplified)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, !!session);
        
        if (event === 'SIGNED_OUT') {
          // User signed out - clear state and show login
          console.log('User signed out, clearing state');
          setCurrentView('login');
          setRequests([]);
          setStats(null);
          setIsAuthLoading(false);
        }
        // Don't handle SIGNED_IN here to avoid conflicts with checkAuth
      }
    );

    // Cleanup subscription on unmount
    return () => {
      console.log('Component unmounting, cleaning up auth listener');
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    console.log('Current view changed to:', currentView);
    if (currentView === 'dashboard') {
      loadDashboardStats();
    } else if (currentView === 'requests') {
      console.log('Loading requests when entering requests tab...');
      // Always load requests when entering the requests tab
      handleLoadRequests();
    }
  }, [currentView]);

  // Separate effect for filters to avoid infinite loops
  useEffect(() => {
    if (currentView === 'requests') {
      console.log('Filters changed, reloading requests...', filters);
      loadRequests(filters);
    }
  }, [filters]);

  // Debug effect to track state changes
  useEffect(() => {
    console.log('State changed:', {
      currentView,
      filtersCount: Object.keys(filters).length,
      requestsCount: requests.length
    });
  }, [currentView, filters, requests]);

  const checkAuth = async () => {
    console.log('Starting auth check...');
    setIsAuthLoading(true);
    
    try {
      // Add timeout to prevent infinite loading
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Auth check timeout')), 10000)
      );
      
      const authCheckPromise = (async () => {
        // Check if we have a valid session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        console.log('Session check - Session exists:', !!session, 'Error:', sessionError?.message);
        
        if (session && !sessionError) {
          console.log('Valid session found, checking operator status...');
          // We have a valid session, check if user is operator
          const isOperator = await layananApi.isOperator();
          console.log('Is operator check result:', isOperator);
          
          if (isOperator) {
            console.log('Valid operator session - redirecting to dashboard');
            setCurrentView('dashboard');
            return;
          } else {
            console.log('User is not operator - signing out');
            await supabase.auth.signOut();
            setCurrentView('login');
            return;
          }
        }
        
        console.log('No valid session found - showing login');
        setCurrentView('login');
      })();
      
      // Race between auth check and timeout
      await Promise.race([authCheckPromise, timeoutPromise]);
      
    } catch (error) {
      console.error('Auth check error:', error);
      setCurrentView('login');
    } finally {
      console.log('Auth check completed');
      setIsAuthLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log('Attempting login with:', loginData.email);
      
      // Validate input
      if (!loginData.email || !loginData.password) {
        throw new Error('Email dan password harus diisi');
      }
      
      if (loginData.email.trim().length < 3) {
        throw new Error('Email tidak valid');
      }
      
      if (loginData.password.length < 3) {
        throw new Error('Password terlalu pendek');
      }
      
      // Attempt to sign in
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginData.email.trim(),
        password: loginData.password
      });
      
      console.log('Login response:', { user: data?.user?.email, error: error?.message });
      
      if (error) {
        console.error('Supabase auth error:', error);
        throw new Error('Email atau password salah');
      }

      if (!data?.user) {
        throw new Error('Login gagal - tidak ada data user');
      }

      console.log('Login successful, checking operator role...');
      
      // Wait a bit for the session to be established
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const isOperator = await layananApi.isOperator();
      console.log('Is operator:', isOperator);
      
      if (isOperator) {
        setCurrentView('dashboard');
        toast({
          title: "Login Berhasil",
          description: `Selamat datang, ${data.user.email}`,
        });
      } else {
        console.log('User is not operator, logging out');
        await supabase.auth.signOut();
        toast({
          title: "Akses Ditolak",
          description: "Akun Anda tidak memiliki akses operator",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login Gagal",
        description: error instanceof Error ? error.message : "Terjadi kesalahan saat login",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setCurrentView('login');
    setRequests([]);
    setSelectedRequest(null);
    setStats(null);
  };

  const loadDashboardStats = async () => {
    try {
      const dashboardStats = await layananApi.getDashboardStats();
      setStats(dashboardStats);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const loadRequests = async (customFilters?: RequestFilters) => {
    try {
      const filtersToUse = customFilters || filters;
      console.log('Loading requests with filters:', filtersToUse);
      const requestsData = await layananApi.getRequests(filtersToUse);
      console.log('Requests loaded:', requestsData);
      console.log('Number of requests:', requestsData.length);
      setRequests(requestsData);
    } catch (error) {
      console.error('Error loading requests:', error);
      toast({
        title: "Error",
        description: "Gagal memuat data permohonan",
        variant: "destructive"
      });
    }
  };

  const handleLoadRequests = () => {
    console.log('Manual load requests clicked');
    loadRequests(filters);
  };

  const handleStatsClick = (status?: RequestStatus) => {
    console.log('Stats clicked with status:', status);
    
    // Set filters based on the clicked stat
    const newFilters = status ? { status } : {};
    setFilters(newFilters);
    
    // Switch to requests tab
    setCurrentView('requests');
    
    // Add a small delay to ensure the tab switch happens, then load data
    setTimeout(() => {
      console.log('Loading requests after stats click with filters:', newFilters);
      loadRequests(newFilters);
    }, 100);
    
    toast({
      title: "Filter Diterapkan",
      description: status 
        ? `Menampilkan permohonan dengan status: ${status === 'pending' ? 'Menunggu' : status === 'on_process' ? 'Diproses' : status === 'completed' ? 'Selesai' : 'Dibatalkan'}`
        : "Menampilkan semua permohonan",
    });
  };

  const clearFilters = () => {
    setFilters({});
    toast({
      title: "Filter Dihapus",
      description: "Semua filter telah dihapus",
    });
  };

  const handleRequestDetail = async (request: ServiceRequest) => {
    setSelectedRequest(request);
    try {
      const notes = await layananApi.getOperatorNotes(request.id);
      setOperatorNotes(notes);
    } catch (error) {
      console.error('Error loading notes:', error);
    }
    setCurrentView('request-detail');
  };

  const handleUpdateRequest = async () => {
    if (!selectedRequest) return;

    setIsLoading(true);
    try {
      const updatePayload: any = {};
      if (updateData.status) updatePayload.status = updateData.status;
      if (updateData.notes) updatePayload.operator_notes = updateData.notes;

      await layananApi.updateRequest(selectedRequest.id, updatePayload);
      
      toast({
        title: "Berhasil",
        description: "Status permohonan berhasil diperbarui",
      });

      // Reload data
      const updatedRequest = await layananApi.getRequestById(selectedRequest.id);
      if (updatedRequest) {
        setSelectedRequest(updatedRequest);
        const notes = await layananApi.getOperatorNotes(selectedRequest.id);
        setOperatorNotes(notes);
      }

      setUpdateData({ status: undefined, notes: '' });
    } catch (error) {
      console.error('Error updating request:', error);
      toast({
        title: "Error",
        description: "Gagal memperbarui status",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportCSV = async () => {
    try {
      const csvContent = await layananApi.exportRequestsToCSV(filters);
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `permohonan_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      
      toast({
        title: "Export Berhasil",
        description: "File CSV berhasil diunduh",
      });
    } catch (error) {
      console.error('Error exporting CSV:', error);
      toast({
        title: "Error",
        description: "Gagal mengekspor data",
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = (status: RequestStatus) => {
    const config = {
      pending: { label: 'Menunggu', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      on_process: { label: 'Diproses', color: 'bg-blue-100 text-blue-800', icon: RefreshCw },
      completed: { label: 'Selesai', color: 'bg-green-100 text-green-800', icon: CheckCircle },
      cancelled: { label: 'Dibatalkan', color: 'bg-red-100 text-red-800', icon: XCircle }
    };

    const statusConfig = config[status];
    const Icon = statusConfig.icon;
    
    return (
      <Badge variant="secondary" className={statusConfig.color}>
        <Icon className="h-3 w-3 mr-1" />
        {statusConfig.label}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="w-full max-w-md p-8">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="text-sm text-muted-foreground">Memeriksa autentikasi...</p>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                console.log('Manual skip auth loading');
                setIsAuthLoading(false);
                setCurrentView('login');
              }}
              className="mt-4"
            >
              Skip ke Login
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (currentView === 'login') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-6">
          <div className="text-center mb-6">
            <Users className="h-12 w-12 text-primary mx-auto mb-4" />
            <h1 className="text-2xl font-bold">Operator Login</h1>
            <p className="text-muted-foreground">Masuk ke dashboard operator</p>
          </div>

                     <form onSubmit={handleLogin} className="space-y-4">
             <div>
               <Label htmlFor="email">Email</Label>
               <Input
                 id="email"
                 type="email"
                 value={loginData.email}
                 onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                 onKeyDown={(e) => {
                   if (e.key === 'Enter' && !loginData.password) {
                     e.preventDefault();
                   }
                 }}
                 required
                 placeholder="operator@desa.com"
                 disabled={isLoading}
               />
             </div>

             <div>
               <Label htmlFor="password">Password</Label>
               <Input
                 id="password"
                 type="password"
                 value={loginData.password}
                 onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                 required
                 placeholder="Masukkan password"
                 disabled={isLoading}
               />
             </div>

             <Button 
               type="submit" 
               className="w-full" 
               disabled={isLoading || !loginData.email || !loginData.password}
             >
               {isLoading ? "Memproses..." : "Masuk"}
             </Button>
           </form>
        </Card>
      </div>
    );
  }

  if (currentView === 'request-detail' && selectedRequest) {
    return (
      <div className="min-h-screen bg-background">
        <div className="border-b bg-card">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => setCurrentView('requests')}>
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                  <h1 className="text-xl font-semibold">{selectedRequest.request_number}</h1>
                  <p className="text-sm text-muted-foreground">
                    {layananApi.getServiceTypeName(selectedRequest.service_type)}
                  </p>
                </div>
              </div>
              {getStatusBadge(selectedRequest.status)}
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Request Details */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Detail Permohonan</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Nama Pemohon</p>
                    <p className="font-medium">{selectedRequest.full_name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">NIK</p>
                    <p className="font-medium">{selectedRequest.nik}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Nomor HP</p>
                    <p className="font-medium">{selectedRequest.phone_number}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Tanggal Pengajuan</p>
                    <p className="font-medium">{formatDate(selectedRequest.created_at)}</p>
                  </div>
                </div>

                {selectedRequest.documents && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Dokumen</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedRequest.documents.files?.map((file: string, index: number) => {
                        const publicUrl = supabase.storage
                          .from('service-documents')
                          .getPublicUrl(file).data.publicUrl;
                        
                        const isImage = file.toLowerCase().match(/\.(jpg|jpeg|png|gif|webp)$/);
                        const fileName = file.split('/').pop() || `Document ${index + 1}`;
                        
                        return (
                          <div key={index} className="border rounded-lg p-4 bg-white">
                            {isImage ? (
                              <div className="space-y-2">
                                <img
                                  src={publicUrl}
                                  alt={`Document ${index + 1}`}
                                  className="w-full h-48 object-cover rounded-lg border"
                                  onError={(e) => {
                                    e.currentTarget.src = '/placeholder.svg';
                                  }}
                                />
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <FileText className="h-4 w-4" />
                                  <span>{fileName}</span>
                                </div>
                                <a
                                  href={publicUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                                >
                                  <Eye className="h-4 w-4" />
                                  Lihat Ukuran Penuh
                                </a>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2 text-sm">
                                <FileText className="h-4 w-4" />
                                <div className="flex-1">
                                  <p className="font-medium">{fileName}</p>
                                  <a
                                    href={publicUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary hover:underline"
                                  >
                                    Download
                                  </a>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Update Status */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Update Status</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={updateData.status || ''}
                    onValueChange={(value) => setUpdateData(prev => ({ ...prev, status: value as RequestStatus }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Menunggu</SelectItem>
                      <SelectItem value="on_process">Diproses</SelectItem>
                      <SelectItem value="completed">Selesai</SelectItem>
                      <SelectItem value="cancelled">Dibatalkan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="notes">Catatan</Label>
                  <Textarea
                    id="notes"
                    value={updateData.notes}
                    onChange={(e) => setUpdateData(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Tambahkan catatan untuk pemohon..."
                    rows={3}
                  />
                </div>

                <Button 
                  onClick={handleUpdateRequest} 
                  className="w-full" 
                  disabled={isLoading || (!updateData.status && !updateData.notes)}
                >
                  {isLoading ? "Memperbarui..." : "Update Status"}
                </Button>
              </div>
            </Card>
          </div>

          {/* Operator Notes */}
          <Card className="mt-6 p-6">
            <h2 className="text-lg font-semibold mb-4">Riwayat Catatan</h2>
            <div className="space-y-4">
              {operatorNotes.length > 0 ? (
                operatorNotes.map((note) => (
                  <div key={note.id} className="border-l-4 border-primary pl-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-muted-foreground">
                        {formatDate(note.created_at)}
                      </p>
                      {note.old_status && note.new_status && (
                        <Badge variant="outline">
                          {layananApi.getStatusName(note.old_status)} → {layananApi.getStatusName(note.new_status)}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm">{note.note}</p>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-center py-4">Belum ada catatan</p>
              )}
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Users className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-xl font-semibold">Dashboard Operator</h1>
                <p className="text-sm text-muted-foreground">Kelola permohonan layanan mandiri</p>
              </div>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Keluar
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <Tabs 
          value={currentView === 'dashboard' ? 'dashboard' : currentView === 'requests' ? 'requests' : currentView === 'request-detail' ? 'requests' : 'reports'} 
          onValueChange={(value) => {
            console.log('Tab changed to:', value);
            if (value === 'dashboard') {
              setCurrentView('dashboard');
            } else if (value === 'requests') {
              setCurrentView('requests');
            } else if (value === 'reports') {
              setCurrentView('reports');
            }
          }}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="requests">Permohonan</TabsTrigger>
            <TabsTrigger value="reports">Laporan</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            {stats && (
              <>
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  <Card 
                    className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => handleStatsClick()}
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">Total</span>
                    </div>
                    <p className="text-2xl font-bold">{stats.total_requests}</p>
                    <p className="text-xs text-gray-500 mt-1">Klik untuk lihat semua</p>
                  </Card>
                  <Card 
                    className="p-4 cursor-pointer hover:bg-yellow-50 transition-colors"
                    onClick={() => handleStatsClick('pending')}
                  >
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-yellow-600" />
                      <span className="text-sm font-medium">Menunggu</span>
                    </div>
                    <p className="text-2xl font-bold text-yellow-600">{stats.pending_requests}</p>
                    <p className="text-xs text-gray-500 mt-1">Klik untuk filter</p>
                  </Card>
                  <Card 
                    className="p-4 cursor-pointer hover:bg-blue-50 transition-colors"
                    onClick={() => handleStatsClick('on_process')}
                  >
                    <div className="flex items-center gap-2">
                      <RefreshCw className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium">Diproses</span>
                    </div>
                    <p className="text-2xl font-bold text-blue-600">{stats.on_process_requests}</p>
                    <p className="text-xs text-gray-500 mt-1">Klik untuk filter</p>
                  </Card>
                  <Card 
                    className="p-4 cursor-pointer hover:bg-green-50 transition-colors"
                    onClick={() => handleStatsClick('completed')}
                  >
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium">Selesai</span>
                    </div>
                    <p className="text-2xl font-bold text-green-600">{stats.completed_requests}</p>
                    <p className="text-xs text-gray-500 mt-1">Klik untuk filter</p>
                  </Card>
                  <Card 
                    className="p-4 cursor-pointer hover:bg-red-50 transition-colors"
                    onClick={() => handleStatsClick('cancelled')}
                  >
                    <div className="flex items-center gap-2">
                      <XCircle className="h-4 w-4 text-red-600" />
                      <span className="text-sm font-medium">Dibatalkan</span>
                    </div>
                    <p className="text-2xl font-bold text-red-600">{stats.cancelled_requests}</p>
                    <p className="text-xs text-gray-500 mt-1">Klik untuk filter</p>
                  </Card>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Permohonan per Tanggal</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={stats.requests_by_date}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </Card>

                  <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Permohonan per Jenis Layanan</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={Object.entries(stats.requests_by_service).map(([key, value]) => ({
                        service: layananApi.getServiceTypeName(key as ServiceType),
                        count: value
                      }))}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="service" angle={-45} textAnchor="end" height={80} />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="count" fill="#3b82f6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </Card>
                </div>
              </>
            )}
          </TabsContent>

                     <TabsContent value="requests" className="space-y-6">
             {/* Load Button */}
             <Card className="p-6">
               <div className="flex items-center justify-between">
                 <div>
                   <h3 className="text-lg font-semibold">Daftar Permohonan</h3>
                   <p className="text-sm text-muted-foreground">
                     {requests.length} permohonan ditemukan
                   </p>
                 </div>
                 <Button onClick={handleLoadRequests} disabled={isLoading}>
                   <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                   {isLoading ? "Memuat..." : "Muat Ulang"}
                 </Button>
               </div>
             </Card>

             {/* Filters */}
             <Card className="p-6">
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                 <div>
                   <Label htmlFor="search">Cari</Label>
                   <Input
                     id="search"
                     placeholder="Nama atau nomor permohonan"
                     value={filters.search || ''}
                     onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                   />
                 </div>
                 <div>
                   <Label htmlFor="service-type">Jenis Layanan</Label>
                   <Select
                     value={filters.service_type || 'all'}
                     onValueChange={(value) => setFilters(prev => ({ 
                       ...prev, 
                       service_type: value === 'all' ? undefined : value as ServiceType 
                     }))}
                   >
                     <SelectTrigger>
                       <SelectValue placeholder="Semua layanan" />
                     </SelectTrigger>
                     <SelectContent>
                       <SelectItem value="all">Semua layanan</SelectItem>
                       <SelectItem value="surat_pengantar_ktp">Surat Pengantar KTP</SelectItem>
                       <SelectItem value="surat_keterangan_domisili">Surat Keterangan Domisili</SelectItem>
                       <SelectItem value="surat_keterangan_usaha">Surat Keterangan Usaha</SelectItem>
                       <SelectItem value="surat_keterangan_tidak_mampu">Surat Keterangan Tidak Mampu</SelectItem>
                       <SelectItem value="surat_keterangan_belum_menikah">Surat Keterangan Belum Menikah</SelectItem>
                       <SelectItem value="surat_pengantar_nikah">Surat Pengantar Nikah</SelectItem>
                       <SelectItem value="surat_keterangan_kematian">Surat Keterangan Kematian</SelectItem>
                       <SelectItem value="surat_keterangan_kelahiran">Surat Keterangan Kelahiran</SelectItem>
                     </SelectContent>
                   </Select>
                 </div>
                 <div>
                   <Label htmlFor="status">Status</Label>
                   <Select
                     value={filters.status || 'all'}
                     onValueChange={(value) => setFilters(prev => ({ 
                       ...prev, 
                       status: value === 'all' ? undefined : value as RequestStatus 
                     }))}
                   >
                     <SelectTrigger>
                       <SelectValue placeholder="Semua status" />
                     </SelectTrigger>
                     <SelectContent>
                       <SelectItem value="all">Semua status</SelectItem>
                       <SelectItem value="pending">Menunggu</SelectItem>
                       <SelectItem value="on_process">Diproses</SelectItem>
                       <SelectItem value="completed">Selesai</SelectItem>
                       <SelectItem value="cancelled">Dibatalkan</SelectItem>
                     </SelectContent>
                   </Select>
                 </div>
                                    <div className="flex items-end gap-2">
                     <Button onClick={handleLoadRequests} className="flex-1">
                       <Search className="h-4 w-4 mr-2" />
                       Cari
                     </Button>
                   <Button variant="outline" onClick={clearFilters} className="flex-1">
                     <Filter className="h-4 w-4 mr-2" />
                     Reset
                   </Button>
                 </div>
                 <div className="flex items-end">
                   <Button onClick={handleExportCSV} className="w-full">
                     <Download className="h-4 w-4 mr-2" />
                     Export CSV
                   </Button>
                 </div>
               </div>
             </Card>

            {/* Requests List */}
            <Card className="p-6">
              <div className="space-y-4">
                {requests.map((request) => (
                  <div key={request.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors hover:shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-2">
                          <h3 
                            className="font-semibold text-primary hover:text-primary/80 cursor-pointer hover:underline transition-colors flex items-center gap-1"
                            onClick={() => handleRequestDetail(request)}
                            title="Klik untuk melihat detail"
                          >
                            {request.request_number}
                            <Eye className="h-3 w-3 opacity-60" />
                          </h3>
                          {getStatusBadge(request.status)}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {layananApi.getServiceTypeName(request.service_type)}
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            <span>{request.full_name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Hash className="h-4 w-4" />
                            <span>{request.nik}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4" />
                            <span>{request.phone_number}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>{formatDate(request.created_at)}</span>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRequestDetail(request)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Detail
                      </Button>
                    </div>
                  </div>
                ))}

                {requests.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Tidak ada permohonan ditemukan</p>
                  </div>
                )}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Laporan dan Statistik</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-2">Export Data</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Unduh data permohonan dalam format CSV untuk analisis lebih lanjut.
                  </p>
                  <Button onClick={handleExportCSV}>
                    <Download className="h-4 w-4 mr-2" />
                    Export Semua Data
                  </Button>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Statistik Real-time</h4>
                  <p className="text-sm text-muted-foreground">
                    Dashboard menampilkan statistik real-time dari semua permohonan yang masuk.
                  </p>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

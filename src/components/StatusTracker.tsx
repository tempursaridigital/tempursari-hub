import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Search, Clock, CheckCircle, XCircle, RefreshCw, ArrowLeft, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { layananApi } from "@/services/layananApi";

interface StatusTrackerProps {
  onBack: () => void;
}

interface RequestData {
  id: string;
  request_number: string;
  service_type: string;
  full_name: string;
  nik: string;
  phone_number: string;
  status: string;
  created_at: string;
  updated_at: string;
  operator_notes?: string;
}



const statusConfig = {
  pending: {
    label: 'Menunggu',
    color: 'bg-yellow-100 text-yellow-800',
    icon: Clock
  },
  on_process: {
    label: 'Diproses',
    color: 'bg-blue-100 text-blue-800',
    icon: RefreshCw
  },
  completed: {
    label: 'Selesai',
    color: 'bg-green-100 text-green-800',
    icon: CheckCircle
  },
  cancelled: {
    label: 'Dibatalkan',
    color: 'bg-red-100 text-red-800',
    icon: XCircle
  }
};

export const StatusTracker = ({ onBack }: StatusTrackerProps) => {
  const [nik, setNik] = useState('');
  const [requestData, setRequestData] = useState<RequestData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nik.trim()) {
      toast({
        title: "Error",
        description: "Masukkan NIK untuk melacak status",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const request = await layananApi.getRequestByNIK(nik.trim());

      if (request) {
        setRequestData(request);
      } else {
        setRequestData(null);
        toast({
          title: "Data Tidak Ditemukan",
          description: "Tidak ada permohonan dengan NIK tersebut",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error searching request:', error);
      toast({
        title: "Error",
        description: "Gagal mencari data. Silakan coba lagi.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
    const config = statusConfig[status as keyof typeof statusConfig];
    if (!config) return null;

    const Icon = config.icon;
    return (
      <Badge variant="secondary" className={config.color}>
        <Icon className="h-3 w-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h2 className="text-lg font-semibold">Cek Status Permohonan</h2>
          <p className="text-sm text-muted-foreground">Masukkan NIK untuk melacak status permohonan</p>
        </div>
      </div>

      <Card className="p-4">
        <form onSubmit={handleSearch} className="space-y-4">
          <div>
            <Label htmlFor="nik">NIK (Nomor Induk Kependudukan)</Label>
            <Input
              id="nik"
              value={nik}
              onChange={(e) => setNik(e.target.value)}
              placeholder="Masukkan NIK (16 digit)"
              maxLength={16}
              required
            />
          </div>
          
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Mencari...
              </>
            ) : (
              <>
                <Search className="h-4 w-4 mr-2" />
                Cek Status
              </>
            )}
          </Button>
        </form>
      </Card>

      {requestData && (
        <Card className="p-4">
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-lg">{requestData.request_number}</h3>
                <p className="text-sm text-muted-foreground">
                  {layananApi.getServiceTypeName(requestData.service_type)}
                </p>
              </div>
              {getStatusBadge(requestData.status)}
            </div>

            <Separator />

            <div className="grid grid-cols-1 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Nama Pemohon</p>
                <p className="font-medium">{requestData.full_name}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground">NIK</p>
                <p className="font-medium">{requestData.nik}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground">Nomor HP</p>
                <p className="font-medium">{requestData.phone_number}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground">Tanggal Pengajuan</p>
                <p className="font-medium">{formatDate(requestData.created_at)}</p>
              </div>

              {requestData.updated_at !== requestData.created_at && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Terakhir Diperbarui</p>
                  <p className="font-medium">{formatDate(requestData.updated_at)}</p>
                </div>
              )}

              {requestData.operator_notes && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Catatan Petugas</p>
                  <p className="text-sm bg-muted p-3 rounded">{requestData.operator_notes}</p>
                </div>
              )}
            </div>

            {requestData.status === 'completed' && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-green-800 mb-2">
                  <CheckCircle className="h-4 w-4" />
                  <p className="font-medium">Permohonan Selesai</p>
                </div>
                <p className="text-sm text-green-700">
                  Dokumen sudah siap. Silakan datang ke kantor desa untuk mengambil dokumen dengan membawa:
                </p>
                <ul className="text-sm text-green-700 mt-2 space-y-1">
                  <li>• KTP asli</li>
                  <li>• Nomor permohonan: {requestData.request_number}</li>
                </ul>
              </div>
            )}

            {requestData.status === 'cancelled' && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-red-800 mb-2">
                  <XCircle className="h-4 w-4" />
                  <p className="font-medium">Permohonan Dibatalkan</p>
                </div>
                <p className="text-sm text-red-700">
                  Silakan hubungi kantor desa untuk informasi lebih lanjut atau ajukan permohonan baru.
                </p>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};
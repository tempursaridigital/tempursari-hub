import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ServiceCard } from "@/components/ServiceCard";
import { 
  FileText, 
  Home, 
  Building, 
  Heart,
  Users,
  Baby,
  ArrowLeft
} from "lucide-react";

interface Service {
  id: string;
  type: string;
  title: string;
  description: string;
  icon: any;
  category: string;
  requirements: string[];
  processingTime: string;
}

interface ServiceSelectionProps {
  onServiceSelect: (serviceType: string) => void;
  onBack: () => void;
}

const services: Service[] = [
  {
    id: 'surat_pengantar_ktp',
    type: 'surat_pengantar_ktp',
    title: 'Surat Pengantar KTP',
    description: 'Surat pengantar untuk pembuatan KTP baru atau penggantian',
    icon: FileText,
    category: 'Kependudukan',
    requirements: ['KTP lama (jika ada)', 'Kartu Keluarga', 'Pas foto 3x4'],
    processingTime: '1-2 hari kerja'
  },
  {
    id: 'surat_keterangan_domisili',
    type: 'surat_keterangan_domisili', 
    title: 'Surat Keterangan Domisili',
    description: 'Surat keterangan tempat tinggal/domisili',
    icon: Home,
    category: 'Kependudukan',
    requirements: ['KTP', 'Kartu Keluarga', 'Bukti tempat tinggal'],
    processingTime: '1 hari kerja'
  },
  {
    id: 'surat_keterangan_usaha',
    type: 'surat_keterangan_usaha',
    title: 'Surat Keterangan Usaha',
    description: 'Surat keterangan untuk keperluan usaha/bisnis',
    icon: Building,
    category: 'Ekonomi',
    requirements: ['KTP', 'Foto tempat usaha', 'Izin usaha (jika ada)'],
    processingTime: '2-3 hari kerja'
  },
  {
    id: 'surat_keterangan_tidak_mampu',
    type: 'surat_keterangan_tidak_mampu',
    title: 'Surat Keterangan Tidak Mampu',
    description: 'Surat keterangan untuk keperluan beasiswa atau bantuan',
    icon: Heart,
    category: 'Sosial',
    requirements: ['KTP', 'Kartu Keluarga', 'Bukti penghasilan'],
    processingTime: '2-3 hari kerja'
  },
  {
    id: 'surat_keterangan_belum_menikah',
    type: 'surat_keterangan_belum_menikah',
    title: 'Surat Keterangan Belum Menikah',
    description: 'Surat keterangan status belum menikah',
    icon: Users,
    category: 'Kependudukan',
    requirements: ['KTP', 'Kartu Keluarga'],
    processingTime: '1 hari kerja'
  },
  {
    id: 'surat_pengantar_nikah',
    type: 'surat_pengantar_nikah',
    title: 'Surat Pengantar Nikah',
    description: 'Surat pengantar untuk keperluan pernikahan',
    icon: Heart,
    category: 'Kependudukan',
    requirements: ['KTP', 'Kartu Keluarga', 'Pas foto berdua'],
    processingTime: '2-3 hari kerja'
  },
  {
    id: 'surat_keterangan_kematian',
    type: 'surat_keterangan_kematian',
    title: 'Surat Keterangan Kematian',
    description: 'Surat keterangan kematian untuk keperluan administrasi',
    icon: FileText,
    category: 'Kependudukan',
    requirements: ['KTP pelapor', 'KTP almarhum', 'Surat keterangan dokter'],
    processingTime: '1 hari kerja'
  },
  {
    id: 'surat_keterangan_kelahiran',
    type: 'surat_keterangan_kelahiran',
    title: 'Surat Keterangan Kelahiran',
    description: 'Surat keterangan kelahiran untuk pembuatan akta kelahiran',
    icon: Baby,
    category: 'Kependudukan',
    requirements: ['KTP orangtua', 'Kartu Keluarga', 'Surat keterangan dokter'],
    processingTime: '1-2 hari kerja'
  }
];

export const ServiceSelection = ({ onServiceSelect, onBack }: ServiceSelectionProps) => {
  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h2 className="text-lg font-semibold">Pilih Layanan</h2>
          <p className="text-sm text-muted-foreground">Pilih jenis layanan yang diperlukan</p>
        </div>
      </div>

      <div className="space-y-3">
        {services.map((service) => (
          <Card key={service.id} className="p-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-primary/10 text-primary flex-shrink-0">
                <service.icon className="h-5 w-5" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-semibold">{service.title}</h3>
                  <Badge variant="secondary" className="text-xs">
                    {service.category}
                  </Badge>
                </div>
                
                <p className="text-sm text-muted-foreground mb-3">
                  {service.description}
                </p>
                
                <div className="space-y-2 mb-4">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">Dokumen diperlukan:</p>
                    <div className="flex flex-wrap gap-1">
                      {service.requirements.slice(0, 2).map((req, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {req}
                        </Badge>
                      ))}
                      {service.requirements.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{service.requirements.length - 2} lainnya
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-xs text-muted-foreground">
                    <strong>Waktu proses:</strong> {service.processingTime}
                  </p>
                </div>
                
                <Button 
                  onClick={() => onServiceSelect(service.type)}
                  className="w-full"
                  size="sm"
                >
                  Pilih Layanan
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
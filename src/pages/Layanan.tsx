import { MobileLayout, MobileHeader, MobileContent } from "@/components/MobileLayout";
import { BottomNavigation } from "@/components/BottomNavigation";
import { ServiceCard } from "@/components/ServiceCard";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Users, 
  MapPin, 
  Calendar,
  Heart,
  GraduationCap,
  Building,
  Search,
  Clock,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { useState } from "react";

export default function Layanan() {
  const [searchTerm, setSearchTerm] = useState("");

  const services = [
    {
      title: "Surat Pengantar KTP",
      description: "Buat surat pengantar untuk pembuatan KTP baru atau perpanjangan",
      icon: FileText,
      category: "Kependudukan",
      status: "available"
    },
    {
      title: "Surat Keterangan Domisili",
      description: "Surat keterangan tempat tinggal untuk berbagai keperluan",
      icon: MapPin,
      category: "Kependudukan", 
      status: "available"
    },
    {
      title: "Surat Keterangan Usaha",
      description: "Legalisasi usaha dan UMKM di wilayah desa",
      icon: Building,
      category: "Ekonomi",
      status: "available"
    },
    {
      title: "Surat Keterangan Sehat",
      description: "Surat keterangan kesehatan dari puskesmas desa",
      icon: Heart,
      category: "Kesehatan",
      status: "maintenance"
    },
    {
      title: "Data Penduduk",
      description: "Lihat dan cetak data kependudukan desa",
      icon: Users,
      category: "Kependudukan",
      status: "available"
    },
    {
      title: "Beasiswa Pendidikan",
      description: "Informasi dan pendaftaran beasiswa untuk warga",
      icon: GraduationCap,
      category: "Pendidikan",
      status: "available"
    },
    {
      title: "Jadwal Posyandu",
      description: "Lihat jadwal dan daftar posyandu terdekat",
      icon: Calendar,
      category: "Kesehatan",
      status: "available"
    },
    {
      title: "Pengaduan Masyarakat",
      description: "Sampaikan keluhan dan saran untuk perbaikan desa",
      icon: AlertCircle,
      category: "Pelayanan",
      status: "available"
    },
  ];

  const categories = ["Semua", "Kependudukan", "Kesehatan", "Ekonomi", "Pendidikan", "Pelayanan"];
  const [selectedCategory, setSelectedCategory] = useState("Semua");

  const filteredServices = services.filter(service => {
    const matchesSearch = service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "Semua" || service.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "available":
        return <Badge variant="secondary" className="text-green-600 bg-green-50"><CheckCircle className="h-3 w-3 mr-1" />Tersedia</Badge>;
      case "maintenance":
        return <Badge variant="secondary" className="text-orange-600 bg-orange-50"><Clock className="h-3 w-3 mr-1" />Maintenance</Badge>;
      default:
        return null;
    }
  };

  return (
    <MobileLayout>
      <MobileHeader title="Layanan Mandiri" subtitle="Akses semua layanan desa dengan mudah" />
      
      <MobileContent>
        <div className="p-4 space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari layanan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Categories */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <Badge
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                className="cursor-pointer whitespace-nowrap"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Badge>
            ))}
          </div>

          {/* Service Instructions */}
          <Card className="p-4 bg-primary/5 border-primary/20">
            <h3 className="font-semibold text-primary mb-2 flex items-center">
              <AlertCircle className="h-4 w-4 mr-2" />
              Cara Menggunakan Layanan
            </h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Pilih layanan yang diperlukan</li>
              <li>• Isi formulir dengan lengkap</li>
              <li>• Upload dokumen pendukung</li>
              <li>• Tunggu notifikasi persetujuan</li>
              <li>• Ambil dokumen di kantor desa</li>
            </ul>
          </Card>

          {/* Services List */}
          <div className="space-y-3">
            {filteredServices.map((service, index) => (
              <div key={index} className="relative">
                <ServiceCard
                  title={service.title}
                  description={service.description}
                  icon={service.icon}
                  onClick={() => {
                    if (service.status === "available") {
                      // Navigate to service detail or form
                      console.log("Opening service:", service.title);
                    }
                  }}
                  className={service.status === "maintenance" ? "opacity-60" : ""}
                />
                <div className="absolute top-3 right-3">
                  {getStatusBadge(service.status)}
                </div>
              </div>
            ))}
          </div>

          {filteredServices.length === 0 && (
            <Card className="p-8 text-center">
              <Search className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">Tidak ada layanan yang ditemukan</p>
            </Card>
          )}
        </div>
      </MobileContent>
      
      <BottomNavigation />
    </MobileLayout>
  );
}
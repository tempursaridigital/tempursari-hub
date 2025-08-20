import { MobileLayout, MobileHeader, MobileContent } from "@/components/MobileLayout";
import { BottomNavigation } from "@/components/BottomNavigation";
import { ServiceCard } from "@/components/ServiceCard";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { usePeriodicData } from "@/hooks/usePeriodicData";
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
  AlertCircle,
  RefreshCw
} from "lucide-react";
import { useState } from "react";

export default function Layanan() {
  const [searchTerm, setSearchTerm] = useState("");
  
  const { services, isLoading, error, refreshData } = usePeriodicData();

  const getServiceIcon = (iconName: string) => {
    const icons = {
      FileText,
      MapPin,
      Building,
      Heart,
      Users,
      GraduationCap,
      Calendar,
      AlertCircle
    };
    return icons[iconName as keyof typeof icons] || FileText;
  };

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
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari layanan..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button 
              variant="outline" 
              size="icon"
              onClick={refreshData}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
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

          {/* Error State */}
          {error && (
            <Card className="p-4 border-destructive">
              <p className="text-destructive">Error: {error}</p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={refreshData}
                className="mt-2"
              >
                Coba Lagi
              </Button>
            </Card>
          )}

          {/* Services List */}
          <div className="space-y-3">
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <Card key={i} className="p-4 animate-pulse">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-muted rounded"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-muted rounded mb-2"></div>
                        <div className="h-3 bg-muted rounded w-3/4"></div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              filteredServices.map((service) => (
                <div key={service.id} className="relative">
                  <ServiceCard
                    title={service.title}
                    description={service.description}
                    icon={getServiceIcon(service.icon)}
                    onClick={() => {
                      if (service.status === "available") {
                        console.log("Opening service:", service.title);
                      }
                    }}
                    className={service.status === "maintenance" ? "opacity-60" : ""}
                  />
                  <div className="absolute top-3 right-3">
                    {getStatusBadge(service.status)}
                  </div>
                </div>
              ))
            )}
          </div>

          {!isLoading && filteredServices.length === 0 && (
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
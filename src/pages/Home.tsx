import { MobileLayout, MobileHeader, MobileContent } from "@/components/MobileLayout";
import { BottomNavigation } from "@/components/BottomNavigation";
import { NewsCard } from "@/components/NewsCard";
import { ServiceCard } from "@/components/ServiceCard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Users, 
  MapPin, 
  Calendar,
  TrendingUp,
  Bell,
  ChevronRight,
  Activity,
  BarChart3
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  const quickServices = [
    {
      title: "Surat Pengantar",
      description: "Buat surat pengantar online dengan mudah",
      icon: FileText,
    },
    {
      title: "Data Penduduk",
      description: "Lihat informasi data kependudukan",
      icon: Users,
    },
    {
      title: "Peta Desa",
      description: "Jelajahi peta wilayah desa",
      icon: MapPin,
    },
    {
      title: "Jadwal Kegiatan",
      description: "Lihat agenda kegiatan desa",
      icon: Calendar,
    },
  ];

  const recentNews = [
    {
      title: "Pelatihan ILP Desa Tempursari: Meningkatkan Kualitas Pelayanan Kesehatan Masyarakat",
      excerpt: "Desa Tempursari menggelar pelatihan Integrasi Layanan Primer untuk meningkatkan kualitas pelayanan kesehatan masyarakat.",
      image: "https://tempursari.id/desa/upload/artikel/sedang_1748236594_ilp%201.jpg",
      date: "26 Mei 2025",
      category: "Kesehatan"
    },
    {
      title: "Kopdes Merah Putih Tempursari Resmi Dibentuk",
      excerpt: "Musyawarah Desa Khusus memutuskan pembentukan Koperasi Desa untuk mendorong kemandiran ekonomi warga.",
      image: "https://tempursari.id/desa/upload/artikel/sedang_1746674616_1a008833-c409-4920-8216-3e8b0745e1ad.jpg", 
      date: "8 Mei 2025",
      category: "Ekonomi"
    }
  ];

  const stats = [
    { label: "Penduduk", value: "3,311", icon: Users },
    { label: "KK", value: "1,145", icon: Activity },
    { label: "Laki-laki", value: "1,643", icon: TrendingUp },
    { label: "Perempuan", value: "1,668", icon: BarChart3 },
  ];

  return (
    <MobileLayout>
      <MobileHeader 
        title="Desa Tempursari"
        subtitle="Ngawen, Klaten, Jawa Tengah"
        action={
          <Button size="sm" variant="secondary" className="bg-primary-foreground/20 text-primary-foreground border-0 hover:bg-primary-foreground/30">
            <Bell className="h-4 w-4" />
          </Button>
        }
      />
      
      <MobileContent>
        <div className="p-4 space-y-6">
          {/* Welcome Section */}
          <Card className="p-4 bg-gradient-surface">
            <div className="text-center">
              <h2 className="text-lg font-bold text-foreground mb-2">
                Selamat Datang di Portal Desa
              </h2>
              <p className="text-sm text-muted-foreground mb-4">
                Akses semua layanan desa dengan mudah melalui aplikasi mobile
              </p>
              <Button 
                onClick={() => navigate("/layanan")}
                className="w-full"
              >
                Mulai Layanan
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </Card>

          {/* Statistics */}
          <div>
            <h3 className="font-semibold text-foreground mb-3 flex items-center">
              <BarChart3 className="h-5 w-5 mr-2 text-primary" />
              Statistik Penduduk
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <Card key={index} className="p-3 text-center">
                    <Icon className="h-5 w-5 text-primary mx-auto mb-2" />
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Quick Services */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-foreground flex items-center">
                <Activity className="h-5 w-5 mr-2 text-primary" />
                Layanan Cepat
              </h3>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate("/layanan")}
                className="text-primary"
              >
                Lihat Semua
                <ChevronRight className="h-3 w-3 ml-1" />
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {quickServices.map((service, index) => (
                <ServiceCard
                  key={index}
                  title={service.title}
                  description={service.description}
                  icon={service.icon}
                  onClick={() => navigate("/layanan")}
                />
              ))}
            </div>
          </div>

          {/* Recent News */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-foreground flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-primary" />
                Berita Terkini
              </h3>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate("/informasi")}
                className="text-primary"
              >
                Lihat Semua
                <ChevronRight className="h-3 w-3 ml-1" />
              </Button>
            </div>
            <div className="space-y-3">
              {recentNews.map((news, index) => (
                <NewsCard
                  key={index}
                  title={news.title}
                  excerpt={news.excerpt}
                  image={news.image}
                  date={news.date}
                  category={news.category}
                />
              ))}
            </div>
          </div>
        </div>
      </MobileContent>
      
      <BottomNavigation />
    </MobileLayout>
  );
}
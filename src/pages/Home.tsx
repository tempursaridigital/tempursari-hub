import { MobileLayout, MobileHeader, MobileContent } from "@/components/MobileLayout";
import { BottomNavigation } from "@/components/BottomNavigation";
import { NewsCard } from "@/components/NewsCard";
import { ServiceCard } from "@/components/ServiceCard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { usePeriodicData } from "@/hooks/usePeriodicData";
import { formatDate } from "@/services/api";
import { 
  FileText, 
  Users, 
  MapPin, 
  Calendar,
  TrendingUp,
  Bell,
  ChevronRight,
  Activity,
  BarChart3,
  RefreshCw,
  ExternalLink
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  const { news, services, isLoading, error, lastUpdated, refreshData } = usePeriodicData();

  const recentNews = news.slice(0, 2);
  const quickServices = services.slice(0, 4);

  const getServiceIcon = (iconName: string) => {
    const icons = { FileText, MapPin, Users, Calendar };
    return icons[iconName as keyof typeof icons] || FileText;
  };

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
                Data terintegrasi langsung dari tempursari.id
              </p>
              <div className="flex gap-2 justify-center mb-4">
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={refreshData}
                  disabled={isLoading}
                >
                  <RefreshCw className={`h-4 w-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
                  Refresh Data
                </Button>
                <Button onClick={() => navigate("/layanan")}>
                  Mulai Layanan
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
              {lastUpdated && (
                <p className="text-xs text-muted-foreground">
                  Update: {formatDate(lastUpdated.toLocaleDateString())}
                </p>
              )}
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
              {isLoading ? (
                [1,2,3,4].map(i => (
                  <Card key={i} className="p-3 animate-pulse">
                    <div className="h-8 bg-muted rounded mb-2"></div>
                    <div className="h-3 bg-muted rounded"></div>
                  </Card>
                ))
              ) : (
                quickServices.map((service) => (
                  <ServiceCard
                    key={service.id}
                    title={service.title}
                    description={service.description}
                    icon={getServiceIcon(service.icon)}
                    onClick={() => navigate("/layanan")}
                  />
                ))
              )}
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
              {isLoading ? (
                [1,2].map(i => (
                  <Card key={i} className="p-4 animate-pulse">
                    <div className="h-4 bg-muted rounded mb-2"></div>
                    <div className="h-3 bg-muted rounded w-3/4"></div>
                  </Card>
                ))
              ) : (
                recentNews.map((news) => (
                  <NewsCard
                    key={news.id}
                    title={news.title}
                    excerpt={news.excerpt}
                    image={news.image}
                    date={news.date}
                    category={news.category}
                    onClick={() => window.open(news.url, '_blank')}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </MobileContent>
      
      <BottomNavigation />
    </MobileLayout>
  );
}
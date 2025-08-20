import { MobileLayout, MobileHeader, MobileContent } from "@/components/MobileLayout";
import { BottomNavigation } from "@/components/BottomNavigation";
import { NewsCard } from "@/components/NewsCard";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { usePeriodicData } from "@/hooks/usePeriodicData";
import { Search, RefreshCw, TrendingUp } from "lucide-react";
import { useState } from "react";

export default function Informasi() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  
  const { news, isLoading, error, refreshData } = usePeriodicData();
  const categories = ["Semua", "Kesehatan", "Ekonomi", "Pendidikan", "Pelayanan"];

  const filteredNews = news.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "Semua" || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <MobileLayout>
      <MobileHeader title="Informasi & Berita" subtitle="Update langsung dari tempursari.id" />
      
      <MobileContent>
        <div className="p-4 space-y-4">
          {/* Search */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari berita..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" size="icon" onClick={refreshData} disabled={isLoading}>
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

          {error && (
            <Card className="p-4 border-destructive">
              <p className="text-destructive">Error: {error}</p>
              <Button variant="outline" size="sm" onClick={refreshData} className="mt-2">
                Coba Lagi
              </Button>
            </Card>
          )}

          {/* News List */}
          <div className="space-y-4">
            {isLoading ? (
              [1,2,3,4].map(i => (
                <Card key={i} className="p-4 animate-pulse">
                  <div className="aspect-video bg-muted rounded mb-3"></div>
                  <div className="h-4 bg-muted rounded mb-2"></div>
                  <div className="h-3 bg-muted rounded w-3/4"></div>
                </Card>
              ))
            ) : (
              filteredNews.map((article) => (
                <NewsCard
                  key={article.id}
                  title={article.title}
                  excerpt={article.excerpt}
                  image={article.image}
                  date={article.date}
                  author={article.author}
                  category={article.category}
                  onClick={() => window.open(article.url, '_blank')}
                />
              ))
            )}
          </div>

          {!isLoading && filteredNews.length === 0 && (
            <Card className="p-8 text-center">
              <Search className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">Tidak ada artikel yang ditemukan</p>
            </Card>
          )}
        </div>
      </MobileContent>
      
      <BottomNavigation />
    </MobileLayout>
  );
}
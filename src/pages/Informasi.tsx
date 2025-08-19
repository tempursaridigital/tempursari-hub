import { MobileLayout, MobileHeader, MobileContent } from "@/components/MobileLayout";
import { BottomNavigation } from "@/components/BottomNavigation";
import { NewsCard } from "@/components/NewsCard";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Search,
  TrendingUp,
  Calendar,
  Users,
  Heart,
  GraduationCap,
  Building,
  Filter
} from "lucide-react";
import { useState } from "react";

export default function Informasi() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");

  const newsArticles = [
    {
      title: "Desa Tempursari Siap Implementasikan Integrasi Layanan Primer (ILP) untuk Peningkatan Kesehatan Masyarakat",
      excerpt: "Program ILP bertujuan meningkatkan kualitas pelayanan kesehatan primer di tingkat desa dengan mengintegrasikan berbagai layanan kesehatan dalam satu sistem yang komprehensif.",
      image: "https://tempursari.id/desa/upload/artikel/sedang_1748236594_ilp%201.jpg",
      date: "26 Mei 2025",
      author: "Admin Desa",
      category: "Kesehatan"
    },
    {
      title: "Langkah Nyata Menuju Masyarakat Sehat: Desa Tempursari, Kecamatan Ngawen, Kabupaten Klaten",
      excerpt: "Upaya berkelanjutan Desa Tempursari dalam mewujudkan masyarakat yang sehat melalui berbagai program kesehatan dan pemberdayaan masyarakat.",
      image: "https://tempursari.id/desa/upload/artikel/sedang_1748233532_RDS%203.jpg",
      date: "26 Mei 2025",
      author: "Tim Kesehatan",
      category: "Kesehatan"
    },
    {
      title: "Musyawarah Desa Khusus Pembentukan Koperasi \"Desa Merah Putih\" Tempursari",
      excerpt: "Pembentukan koperasi desa sebagai langkah strategis untuk mendorong perekonomian warga dan meningkatkan kesejahteraan masyarakat Tempursari.",
      image: "https://tempursari.id/desa/upload/artikel/sedang_1746674616_1a008833-c409-4920-8216-3e8b0745e1ad.jpg",
      date: "8 Mei 2025",
      author: "Sekretaris Desa",
      category: "Ekonomi"
    },
    {
      title: "Survei Status Gizi oleh Sekolah Sukarelawan Gizi Indonesia (SSGI) di Dusun Mlandang",
      excerpt: "Kegiatan survei status gizi masyarakat untuk memantau dan meningkatkan kualitas gizi anak-anak dan ibu hamil di wilayah desa.",
      image: "https://tempursari.id/desa/upload/artikel/sedang_1734319935_SSGI.jpeg",
      date: "16 Desember 2024",
      author: "SSGI Team",
      category: "Kesehatan"
    },
    {
      title: "Meningkatkan Kualitas Administrasi Dasawisma melalui Pelatihan oleh PKK Desa Tempursari",
      excerpt: "Program pelatihan administrasi untuk pengurus Dasawisma guna meningkatkan tata kelola organisasi di tingkat RT/RW.",
      image: "https://tempursari.id/desa/upload/artikel/sedang_1734314533_pkk%20dasawisma.jpg",
      date: "16 Desember 2024",
      author: "PKK Desa",
      category: "Pemberdayaan"
    },
    {
      title: "Kopdes Merah Putih Tempursari Dorong Kemandiran Ekonomi Warga",
      excerpt: "Koperasi desa yang baru dibentuk mulai beroperasi dengan fokus pada pengembangan UMKM dan peningkatan ekonomi lokal.",
      date: "1 Mei 2025",
      author: "Pengurus Kopdes",
      category: "Ekonomi"
    },
    {
      title: "Program Posyandu Balita Raih Prestasi Terbaik Tingkat Kecamatan",
      excerpt: "Dedikasi kader posyandu dan partisipasi masyarakat berhasil mengantarkan program kesehatan anak meraih penghargaan.",
      date: "20 April 2025",
      author: "Kader Posyandu",
      category: "Kesehatan"
    },
    {
      title: "Pelatihan Budidaya Tanaman Organik untuk Petani Muda",
      excerpt: "Inisiatif pemberdayaan generasi muda di sektor pertanian dengan teknologi ramah lingkungan dan berkelanjutan.",
      date: "15 April 2025",
      author: "Gapoktan",
      category: "Pertanian"
    }
  ];

  const categories = ["Semua", "Kesehatan", "Ekonomi", "Pemberdayaan", "Pertanian", "Pendidikan"];

  const filteredNews = newsArticles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "Semua" || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Kesehatan": return Heart;
      case "Ekonomi": return TrendingUp;
      case "Pemberdayaan": return Users;
      case "Pertanian": return Building;
      case "Pendidikan": return GraduationCap;
      default: return Calendar;
    }
  };

  return (
    <MobileLayout>
      <MobileHeader title="Informasi & Berita" subtitle="Tetap update dengan info terkini" />
      
      <MobileContent>
        <div className="p-4 space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari berita atau informasi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Categories */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((category) => {
              const Icon = getCategoryIcon(category);
              return (
                <Badge
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  className="cursor-pointer whitespace-nowrap flex items-center gap-1"
                  onClick={() => setSelectedCategory(category)}
                >
                  <Icon className="h-3 w-3" />
                  {category}
                </Badge>
              );
            })}
          </div>

          {/* Featured News */}
          {selectedCategory === "Semua" && searchTerm === "" && (
            <Card className="p-4 bg-gradient-primary text-primary-foreground">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4" />
                <span className="text-sm font-medium">Berita Utama</span>
              </div>
              <h3 className="font-bold mb-1">
                Desa Tempursari Raih Penghargaan Desa Sehat Terbaik
              </h3>
              <p className="text-sm text-primary-foreground/80">
                Prestasi membanggakan atas komitmen dalam program kesehatan masyarakat.
              </p>
            </Card>
          )}

          {/* News List */}
          <div className="space-y-4">
            {filteredNews.map((article, index) => (
              <NewsCard
                key={index}
                title={article.title}
                excerpt={article.excerpt}
                image={article.image}
                date={article.date}
                author={article.author}
                category={article.category}
                onClick={() => {
                  // Navigate to full article
                  console.log("Opening article:", article.title);
                }}
              />
            ))}
          </div>

          {filteredNews.length === 0 && (
            <Card className="p-8 text-center">
              <Search className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground mb-2">Tidak ada berita yang ditemukan</p>
              <p className="text-sm text-muted-foreground">
                Coba ubah kata kunci pencarian atau kategori
              </p>
            </Card>
          )}

          {/* Load More */}
          {filteredNews.length > 0 && (
            <div className="text-center pt-4">
              <Button variant="outline" className="w-full">
                Muat Lebih Banyak
              </Button>
            </div>
          )}
        </div>
      </MobileContent>
      
      <BottomNavigation />
    </MobileLayout>
  );
}
import { MobileLayout, MobileHeader, MobileContent } from "@/components/MobileLayout";
import { BottomNavigation } from "@/components/BottomNavigation";
import { ProductCard } from "@/components/ProductCard";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Search,
  ShoppingCart,
  Star,
  Filter,
  ExternalLink,
  Truck,
  Shield,
  Clock
} from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function Toko() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [cartCount, setCartCount] = useState(0);
  const { toast } = useToast();

  const products = [
    {
      name: "Beras Organik Premium Tempursari",
      price: "Rp 25.000",
      originalPrice: "Rp 30.000",
      image: "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400&h=400&fit=crop",
      rating: 4.8,
      reviewCount: 24,
      discount: "-17%",
      category: "Beras"
    },
    {
      name: "Madu Hutan Asli Klaten",
      price: "Rp 45.000",
      image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&h=400&fit=crop",
      rating: 4.9,
      reviewCount: 15,
      category: "Madu"
    },
    {
      name: "Telur Ayam Kampung Segar",
      price: "Rp 35.000",
      originalPrice: "Rp 40.000",
      image: "https://images.unsplash.com/photo-1518492104633-130d0cc84637?w=400&h=400&fit=crop",
      rating: 4.7,
      reviewCount: 31,
      discount: "-13%",
      category: "Telur"
    },
    {
      name: "Sayuran Hidroponik Mix",
      price: "Rp 20.000",
      image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=400&fit=crop",
      rating: 4.6,
      reviewCount: 18,
      category: "Sayuran"
    },
    {
      name: "Kerupuk Udang Homemade",
      price: "Rp 15.000",
      image: "https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=400&h=400&fit=crop",
      rating: 4.5,
      reviewCount: 22,
      category: "Makanan"
    },
    {
      name: "Kopi Robusta Lokal Premium",
      price: "Rp 35.000",
      originalPrice: "Rp 42.000",
      image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=400&fit=crop",
      rating: 4.8,
      reviewCount: 27,
      discount: "-17%",
      category: "Minuman"
    },
    {
      name: "Tempe Segar Tradisional",
      price: "Rp 8.000",
      image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=400&fit=crop",
      rating: 4.4,
      reviewCount: 19,
      category: "Makanan"
    },
    {
      name: "Hasil Panen Cabai Merah",
      price: "Rp 28.000",
      image: "https://images.unsplash.com/photo-1583258292688-d0213dc5252a?w=400&h=400&fit=crop",
      rating: 4.6,
      reviewCount: 14,
      category: "Sayuran"
    }
  ];

  const categories = ["Semua", "Beras", "Sayuran", "Makanan", "Minuman", "Madu", "Telur"];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "Semua" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddToCart = (productName: string) => {
    setCartCount(prev => prev + 1);
    toast({
      title: "Ditambahkan ke keranjang",
      description: `${productName} berhasil ditambahkan`,
    });
  };

  const handleCheckout = () => {
    window.open('https://shop.tempursari.id', '_blank');
  };

  return (
    <MobileLayout>
      <MobileHeader 
        title="Toko Desa" 
        subtitle="Produk lokal berkualitas"
        action={
          <Button 
            size="sm" 
            variant="secondary" 
            className="bg-primary-foreground/20 text-primary-foreground border-0 hover:bg-primary-foreground/30 relative"
            onClick={handleCheckout}
          >
            <ShoppingCart className="h-4 w-4" />
            {cartCount > 0 && (
              <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs bg-destructive text-destructive-foreground">
                {cartCount}
              </Badge>
            )}
          </Button>
        }
      />
      
      <MobileContent>
        <div className="p-4 space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari produk..."
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

          {/* Features */}
          <div className="grid grid-cols-3 gap-2">
            <Card className="p-3 text-center">
              <Truck className="h-4 w-4 text-primary mx-auto mb-1" />
              <p className="text-xs text-muted-foreground">Gratis Ongkir</p>
            </Card>
            <Card className="p-3 text-center">
              <Shield className="h-4 w-4 text-primary mx-auto mb-1" />
              <p className="text-xs text-muted-foreground">Produk Asli</p>
            </Card>
            <Card className="p-3 text-center">
              <Clock className="h-4 w-4 text-primary mx-auto mb-1" />
              <p className="text-xs text-muted-foreground">Segar Hari Ini</p>
            </Card>
          </div>

          {/* Featured Product */}
          {selectedCategory === "Semua" && searchTerm === "" && (
            <Card className="p-4 bg-gradient-primary text-primary-foreground">
              <div className="flex items-center gap-2 mb-2">
                <Star className="h-4 w-4 fill-current" />
                <span className="text-sm font-medium">Produk Unggulan</span>
              </div>
              <h3 className="font-bold mb-1">Paket Beras + Sayuran Organik</h3>
              <p className="text-sm text-primary-foreground/80 mb-2">
                Hemat 20% untuk pembelian paket lengkap
              </p>
              <Button 
                size="sm" 
                variant="secondary"
                className="bg-primary-foreground text-primary"
                onClick={handleCheckout}
              >
                <ExternalLink className="h-3 w-3 mr-1" />
                Lihat Paket
              </Button>
            </Card>
          )}

          {/* Products Grid */}
          <div className="grid grid-cols-2 gap-3">
            {filteredProducts.map((product, index) => (
              <ProductCard
                key={index}
                name={product.name}
                price={product.price}
                originalPrice={product.originalPrice}
                image={product.image}
                rating={product.rating}
                reviewCount={product.reviewCount}
                discount={product.discount}
                onAddToCart={() => handleAddToCart(product.name)}
                onClick={handleCheckout}
              />
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <Card className="p-8 text-center">
              <Search className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground mb-2">Produk tidak ditemukan</p>
              <p className="text-sm text-muted-foreground">
                Coba ubah kata kunci pencarian atau kategori
              </p>
            </Card>
          )}

          {/* Checkout Button */}
          {cartCount > 0 && (
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">{cartCount} item di keranjang</p>
                  <p className="text-sm text-muted-foreground">Lanjutkan ke checkout</p>
                </div>
                <Button onClick={handleCheckout}>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Checkout
                </Button>
              </div>
            </Card>
          )}

          {/* Shop Info */}
          <Card className="p-4 text-center border-primary/20 bg-primary/5">
            <h3 className="font-semibold text-primary mb-2">Toko Online Lengkap</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Kunjungi website toko untuk melihat produk lengkap dan melakukan pemesanan
            </p>
            <Button variant="outline" onClick={handleCheckout} className="w-full">
              <ExternalLink className="h-4 w-4 mr-2" />
              Buka shop.tempursari.id
            </Button>
          </Card>
        </div>
      </MobileContent>
      
      <BottomNavigation />
    </MobileLayout>
  );
}
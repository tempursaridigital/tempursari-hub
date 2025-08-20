import { MobileLayout, MobileHeader, MobileContent } from "@/components/MobileLayout";
import { BottomNavigation } from "@/components/BottomNavigation";
import { ProductCard } from "@/components/ProductCard";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { usePeriodicData } from "@/hooks/usePeriodicData";
import { formatPrice } from "@/services/api";
import { Search, ShoppingCart, RefreshCw, ExternalLink } from "lucide-react";
import { useState } from "react";

export default function Toko() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [cartItems, setCartItems] = useState<string[]>([]);

  const { products, isLoading, error, refreshData } = usePeriodicData();
  const categories = ["Semua", "Fashion", "Makanan", "Kerajinan"];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <MobileLayout>
      <MobileHeader 
        title="Toko Desa" 
        subtitle="Produk langsung dari shop.tempursari.id"
        action={
          <Button size="sm" variant="secondary" className="bg-primary-foreground/20 text-primary-foreground border-0 relative">
            <ShoppingCart className="h-4 w-4" />
            {cartItems.length > 0 && (
              <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs">
                {cartItems.length}
              </Badge>
            )}
          </Button>
        }
      />
      
      <MobileContent>
        <div className="p-4 space-y-4">
          {/* Search */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari produk..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" size="icon" onClick={refreshData} disabled={isLoading}>
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          </div>

          {/* Shop CTA */}
          <Card className="p-4 bg-gradient-to-r from-primary/10 to-primary-glow/10 border-primary/20">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-primary mb-1">Kunjungi Toko Online</h3>
                <p className="text-sm text-muted-foreground">Lihat koleksi lengkap di website resmi</p>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="border-primary text-primary"
                onClick={() => window.open('https://shop.tempursari.id', '_blank')}
              >
                <ExternalLink className="h-4 w-4 mr-1" />
                Buka
              </Button>
            </div>
          </Card>

          {error && (
            <Card className="p-4 border-destructive">
              <p className="text-destructive">Error: {error}</p>
              <Button variant="outline" size="sm" onClick={refreshData} className="mt-2">
                Coba Lagi
              </Button>
            </Card>
          )}

          {/* Products Grid */}
          <div className="grid grid-cols-2 gap-3">
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="p-3 animate-pulse">
                  <div className="aspect-square bg-muted rounded mb-2"></div>
                  <div className="h-3 bg-muted rounded mb-1"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </Card>
              ))
            ) : (
              filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  name={product.name}
                  price={product.price}
                  originalPrice={product.originalPrice}
                  discount={product.discount}
                  image={product.image}
                  rating={product.rating}
                  reviewCount={product.reviewCount}
                  onAddToCart={() => {
                    setCartItems(prev => [...prev, product.id]);
                  }}
                  onClick={() => window.open(product.url, '_blank')}
                />
              ))
            )}
          </div>

          {!isLoading && filteredProducts.length === 0 && (
            <Card className="p-8 text-center">
              <Search className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">Tidak ada produk yang ditemukan</p>
            </Card>
          )}
        </div>
      </MobileContent>
      
      <BottomNavigation />
    </MobileLayout>
  );
}
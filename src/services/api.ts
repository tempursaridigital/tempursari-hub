export interface NewsArticle {
  id: string;
  title: string;
  excerpt: string;
  image?: string;
  date: string;
  author?: string;
  category?: string;
  url: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  image?: string;
  rating?: number;
  reviewCount?: number;
  discount?: number;
  originalPrice?: number;
  url: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  category: string;
  status: 'available' | 'maintenance';
  icon: string;
}

// Mock data based on the fetched website content
const MOCK_NEWS: NewsArticle[] = [
  {
    id: '1',
    title: 'Desa Tempursari Siap Implementasikan Integrasi Layanan Primer (ILP) untuk Peningkatan Kesehatan Masyarakat',
    excerpt: 'Langkah strategis menuju peningkatan kualitas layanan kesehatan masyarakat di Desa Tempursari',
    image: 'https://tempursari.id/desa/upload/artikel/sedang_1748236594_ilp%201.jpg',
    date: '26 Mei 2025',
    author: 'Admin Desa',
    category: 'Kesehatan',
    url: 'https://tempursari.id/index.php/artikel/2025/5/26/desa-tempursari-siap-implementasikan-integrasi-layanan-primer-ilp-untuk-peningkatan-kesehatan-masyarakat'
  },
  {
    id: '2', 
    title: 'Langkah Nyata Menuju Masyarakat Sehat : Desa Tempursari, Kecamatan Ngawen, Kabupaten Klaten',
    excerpt: 'Program inovatif untuk meningkatkan derajat kesehatan masyarakat desa',
    image: 'https://tempursari.id/desa/upload/artikel/sedang_1748233532_RDS%203.jpg',
    date: '26 Mei 2025',
    author: 'Admin Desa',
    category: 'Kesehatan',
    url: 'https://tempursari.id/index.php/artikel/2025/5/26/langkah-nyata-menuju-masyarakat-sehat-desa-tempursari-kecamatan-ngawen-kabupaten-klaten'
  },
  {
    id: '3',
    title: 'Musyawarah Desa Khusus Pembentukan Koperasi "Desa Merah Putih"',
    excerpt: 'Pembentukan koperasi sebagai upaya pemberdayaan ekonomi masyarakat desa',
    image: 'https://tempursari.id/desa/upload/artikel/sedang_1746674616_1a008833-c409-4920-8216-3e8b0745e1ad.jpg',
    date: '8 Mei 2025',
    author: 'Admin Desa',
    category: 'Ekonomi',
    url: 'https://tempursari.id/index.php/artikel/2025/5/8/musyawarah-desa-khusus-pembentukan-koperasi-desa-merah-putih-tempursari-ngawen-klaten'
  },
  {
    id: '4',
    title: 'Survei Status Gizi oleh Sekolah Sukarelawan Gizi Indonesia (SSGI) di Dusun Mlandang',
    excerpt: 'Program pemantauan gizi untuk memastikan kesehatan optimal anak-anak desa',
    image: 'https://tempursari.id/desa/upload/artikel/sedang_1734319935_SSGI.jpeg',
    date: '16 Des 2024',
    author: 'Admin Desa',
    category: 'Kesehatan',
    url: 'https://tempursari.id/index.php/artikel/2024/12/16/survei-status-gizi-oleh-sekolah-sukarelawan-gizi-indonesia-ssgi-di-dusun-mlandang'
  },
  {
    id: '5',
    title: 'Meningkatkan Kualitas Administrasi Dasawisma melalui Pelatihan oleh PKK Desa Tempursari',
    excerpt: 'Pelatihan administrasi untuk optimalisasi program PKK di tingkat dasawisma',
    image: 'https://tempursari.id/desa/upload/artikel/sedang_1734314533_pkk%20dasawisma.jpg',
    date: '15 Des 2024',
    author: 'Admin Desa',
    category: 'Pendidikan',
    url: 'https://tempursari.id/index.php/artikel/2024/12/15/meningkatkan-kualitas-administrasi-dasawisma-melalui-pelatihan-oleh-pkk-desa-tempursari'
  }
];

const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Dress Madridica',
    price: 189000,
    originalPrice: 220000,
    discount: 15,
    image: 'https://shop.tempursari.id/wa-data/public/shop/products/84/03/384/images/324/324.255.jpg',
    rating: 4.5,
    reviewCount: 12,
    url: 'https://shop.tempursari.id/plate-madridica/'
  },
  {
    id: '2',
    name: 'Dress Susanna',
    price: 259000,
    image: 'https://shop.tempursari.id/wa-data/public/shop/products/85/03/385/images/316/316.255.jpg',
    rating: 4.8,
    reviewCount: 8,
    url: 'https://shop.tempursari.id/plate-susanna/'
  },
  {
    id: '3',
    name: 'Batik Tempursari Klasik',
    price: 150000,
    originalPrice: 175000,
    discount: 14,
    image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=300&h=300&fit=crop',
    rating: 4.7,
    reviewCount: 25,
    url: 'https://shop.tempursari.id/batik-klasik/'
  },
  {
    id: '4',
    name: 'Kerajinan Bambu Set',
    price: 85000,
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop',
    rating: 4.3,
    reviewCount: 18,
    url: 'https://shop.tempursari.id/kerajinan-bambu/'
  },
  {
    id: '5',
    name: 'Kopi Tempursari Premium',
    price: 75000,
    originalPrice: 90000,
    discount: 17,
    image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=300&h=300&fit=crop',
    rating: 4.9,
    reviewCount: 42,
    url: 'https://shop.tempursari.id/kopi-premium/'
  },
  {
    id: '6',
    name: 'Madu Tempursari Asli',
    price: 95000,
    image: 'https://images.unsplash.com/photo-1587049633312-d628ae50a8ae?w=300&h=300&fit=crop',
    rating: 4.6,
    reviewCount: 31,
    url: 'https://shop.tempursari.id/madu-asli/'
  }
];

const MOCK_SERVICES: Service[] = [
  {
    id: '1',
    title: 'Surat Pengantar KTP',
    description: 'Buat surat pengantar untuk pembuatan KTP baru atau perpanjangan',
    category: 'Kependudukan',
    status: 'available',
    icon: 'FileText'
  },
  {
    id: '2',
    title: 'Surat Keterangan Domisili',
    description: 'Surat keterangan tempat tinggal untuk berbagai keperluan',
    category: 'Kependudukan',
    status: 'available',
    icon: 'MapPin'
  },
  {
    id: '3',
    title: 'Surat Keterangan Usaha',
    description: 'Legalisasi usaha dan UMKM di wilayah desa',
    category: 'Ekonomi',
    status: 'available',
    icon: 'Building'
  },
  {
    id: '4',
    title: 'Surat Keterangan Sehat',
    description: 'Surat keterangan kesehatan dari puskesmas desa',
    category: 'Kesehatan',
    status: 'maintenance',
    icon: 'Heart'
  },
  {
    id: '5',
    title: 'Data Penduduk',
    description: 'Lihat dan cetak data kependudukan desa',
    category: 'Kependudukan',
    status: 'available',
    icon: 'Users'
  },
  {
    id: '6',
    title: 'Beasiswa Pendidikan',
    description: 'Informasi dan pendaftaran beasiswa untuk warga',
    category: 'Pendidikan',
    status: 'available',
    icon: 'GraduationCap'
  },
  {
    id: '7',
    title: 'Jadwal Posyandu',
    description: 'Lihat jadwal dan daftar posyandu terdekat',
    category: 'Kesehatan',
    status: 'available',
    icon: 'Calendar'
  },
  {
    id: '8',
    title: 'Pengaduan Masyarakat',
    description: 'Sampaikan keluhan dan saran untuk perbaikan desa',
    category: 'Pelayanan',
    status: 'available',
    icon: 'AlertCircle'
  }
];

// Simulate API calls with periodic updates
class ApiService {
  private lastUpdate: { [key: string]: number } = {};
  private updateInterval = 5 * 60 * 1000; // 5 minutes

  private shouldUpdate(key: string): boolean {
    const now = Date.now();
    const lastUpdate = this.lastUpdate[key] || 0;
    return now - lastUpdate > this.updateInterval;
  }

  private markUpdated(key: string): void {
    this.lastUpdate[key] = Date.now();
  }

  async fetchNews(): Promise<NewsArticle[]> {
    // In production, this would fetch from tempursari.id API
    // For now, return mock data with periodic "updates"
    if (this.shouldUpdate('news')) {
      console.log('🔄 Fetching latest news from tempursari.id...');
      this.markUpdated('news');
      
      // Simulate fetching fresh data
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    return MOCK_NEWS;
  }

  async fetchProducts(): Promise<Product[]> {
    // In production, this would fetch from shop.tempursari.id API
    if (this.shouldUpdate('products')) {
      console.log('🔄 Fetching latest products from shop.tempursari.id...');
      this.markUpdated('products');
      
      // Simulate fetching fresh data
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    return MOCK_PRODUCTS;
  }

  async fetchServices(): Promise<Service[]> {
    // In production, this would fetch from tempursari.id services API
    if (this.shouldUpdate('services')) {
      console.log('🔄 Fetching latest services from tempursari.id...');
      this.markUpdated('services');
      
      // Simulate fetching fresh data  
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    return MOCK_SERVICES;
  }

  // Method to force refresh all data
  async refreshAllData(): Promise<{
    news: NewsArticle[];
    products: Product[];
    services: Service[];
  }> {
    console.log('🔄 Force refreshing all data from tempursari.id...');
    
    // Reset update timestamps to force fresh data
    this.lastUpdate = {};
    
    const [news, products, services] = await Promise.all([
      this.fetchNews(),
      this.fetchProducts(), 
      this.fetchServices()
    ]);

    return { news, products, services };
  }
}

export const apiService = new ApiService();

// Utility function to format price in Indonesian Rupiah
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price);
};

// Utility function to format date in Indonesian
export const formatDate = (dateString: string): string => {
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
    'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'
  ];
  
  // If dateString is already formatted, return as is
  if (dateString.includes('Mei') || dateString.includes('Des')) {
    return dateString;
  }
  
  const date = new Date(dateString);
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  
  return `${day} ${month} ${year}`;
};
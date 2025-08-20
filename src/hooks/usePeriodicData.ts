import { useState, useEffect, useCallback } from 'react';
import { apiService, NewsArticle, Product, Service } from '@/services/api';

interface UsePeriodicDataResult {
  news: NewsArticle[];
  products: Product[];
  services: Service[];
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  refreshData: () => Promise<void>;
}

export const usePeriodicData = (): UsePeriodicDataResult => {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const loadData = useCallback(async (force = false) => {
    try {
      setIsLoading(true);
      setError(null);

      let data;
      if (force) {
        data = await apiService.refreshAllData();
      } else {
        const [newsData, productsData, servicesData] = await Promise.all([
          apiService.fetchNews(),
          apiService.fetchProducts(),
          apiService.fetchServices()
        ]);
        data = {
          news: newsData,
          products: productsData,
          services: servicesData
        };
      }

      setNews(data.news);
      setProducts(data.products);
      setServices(data.services);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
      console.error('Error loading data:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshData = useCallback(() => loadData(true), [loadData]);

  useEffect(() => {
    // Initial data load
    loadData();

    // Set up periodic updates every 5 minutes
    const interval = setInterval(() => {
      loadData();
    }, 5 * 60 * 1000);

    // Refresh data when the app becomes visible again
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        loadData();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup
    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [loadData]);

  return {
    news,
    products,
    services,
    isLoading,
    error,
    lastUpdated,
    refreshData
  };
};
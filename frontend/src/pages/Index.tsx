import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Search } from 'lucide-react';
import { ProductList } from '@/components/ProductList';
import type { Product } from '@/types';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FilterPanel, FilterState } from '@/components/filters/FilterPanel';
import { QuickViewModal } from '@/components/modals/QuickViewModal';
import { FeaturedCategories } from '@/components/FeaturedCategories';
import { fetchProducts } from '@/lib/api';

const Index = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter State
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 200000],
    categories: [],
    sortBy: 'newest',
  });

  // Quick View State
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  const handleQuickView = (product: Product) => {
    setQuickViewProduct(product);
    setIsQuickViewOpen(true);
  };

  const handleCategorySelect = (category: string) => {
    setFilters((prev) => ({
      ...prev,
      categories: [category],
    }));
    const productsSection = document.getElementById('products-section');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Fetch real data from Backend API
        const response = await fetchProducts();
        if (response.error || !response.data) {
          throw new Error(response.error || 'Failed to fetch products');
        }
        setProducts(response.data);
      } catch (err) {
        console.error("Failed to load products:", err);
        setError("Failed to load products. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, []);

  // Compute derived data for filters
  const { categories, minPrice, maxPrice } = useMemo(() => {
    if (products.length === 0) return { categories: [], minPrice: 0, maxPrice: 10000 };

    const cats = Array.from(new Set(products.map(p => p.category).filter(Boolean))) as string[];
    const prices = products.map(p => p.price);
    const min = Math.min(...prices);
    const max = Math.max(...prices);

    return { categories: cats.sort(), minPrice: min, maxPrice: max };
  }, [products]);

  // Update price range when products load
  useEffect(() => {
    if (products.length > 0 && filters.priceRange[1] === 200000) {
      setFilters(prev => ({
        ...prev,
        priceRange: [minPrice, maxPrice]
      }));
    }
  }, [products, minPrice, maxPrice]);

  // Filter and Sort Logic
  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase())) {
          return false;
        }
        if (filters.categories.length > 0 && (!product.category || !filters.categories.includes(product.category))) {
          return false;
        }
        if (product.price < filters.priceRange[0] || product.price > filters.priceRange[1]) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        switch (filters.sortBy) {
          case 'price-asc':
            return a.price - b.price;
          case 'price-desc':
            return b.price - a.price;
          case 'name-asc':
            return a.name.localeCompare(b.name);
          case 'newest':
          default:
            return b.id - a.id;
        }
      });
  }, [products, filters, searchQuery]);

  if (isLoading) {
    return (
      <div className="container py-8">
        <LoadingSpinner message="Loading curated products..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Re-using the Hero Section but keeping it inline if Component doesn't exist yet, 
          or properly importing it. The previous code had it inline. 
          I will keep the inline hero for safety but wrap it cleanly. */}

      <div className="relative overflow-hidden mb-12 min-h-[600px] flex items-center isolate">
        {/* Hero Background Poster */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center w-full h-full" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />

        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/20 rounded-full blur-3xl mix-blend-screen" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl mix-blend-screen" />

        <div className="container py-20 md:py-32 relative z-10 text-center">
          <div className="flex flex-col items-center max-w-4xl mx-auto space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/30 text-foreground text-sm font-semibold backdrop-blur-md hover:scale-105 hover:border-primary/50 transition-all duration-300 cursor-default group">
              <TrendingUp className="h-4 w-4 text-primary animate-bounce" />
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Next-Gen Commerce Platform</span>
              <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            </div>

            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60">
              Future of <br />
              <span className="text-primary">Shopping</span>
            </h1>

            <p className="text-lg text-muted-foreground max-w-lg mx-auto leading-relaxed">
              Experience the speed of microservices. Browse our curated collection of premium tech.
            </p>

            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <button className="px-8 py-4 rounded-full bg-primary text-primary-foreground font-semibold shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all hover:-translate-y-1">
                Shop Now
              </button>
              <Link
                to="/system-status"
                className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-background border border-white/10 text-foreground font-semibold hover:bg-white/5 transition-all backdrop-blur-sm"
              >
                View Setup
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container pb-20">
        <FeaturedCategories onCategorySelect={handleCategorySelect} />

        <div className="flex flex-col md:flex-row gap-8 items-start" id="products-section">
          {/* Sidebar Filters */}
          <aside className="w-full md:w-64 flex-shrink-0">
            <FilterPanel
              filters={filters}
              setFilters={setFilters}
              categories={categories}
              minPrice={minPrice}
              maxPrice={maxPrice}
            />
          </aside>

          {/* Main Content */}
          <main className="flex-1 w-full">
            <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
              <div className="space-y-1">
                <h2 className="text-3xl font-bold tracking-tight">Trending Now</h2>
                <p className="text-muted-foreground">Fresh arrivals from our inventory</p>
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="text-center py-20 bg-background/50 rounded-xl border border-border/50">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
                  <Search className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold">No products found</h3>
                <p className="text-muted-foreground mt-2">
                  Try adjusting your filters or search query.
                </p>
                <Button
                  variant="link"
                  onClick={() => setFilters({
                    priceRange: [minPrice, maxPrice],
                    categories: [],
                    sortBy: 'newest'
                  })}
                  className="mt-4"
                >
                  Clear Filters
                </Button>
              </div>
            ) : (
              <ProductList
                products={filteredProducts}
                isLoading={false}
                error={null}
                onQuickView={handleQuickView}
              />
            )}
          </main>
        </div>
      </div>

      <QuickViewModal
        product={quickViewProduct}
        open={isQuickViewOpen}
        onOpenChange={setIsQuickViewOpen}
      />
    </div>
  );
};


export default Index;

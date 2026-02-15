import { Package, AlertCircle } from 'lucide-react';
import { ProductCard } from '@/components/ProductCard';
import type { Product } from '@/types';

interface ProductListProps {
  products: Product[];
  isLoading?: boolean;
  error?: string | null;
  onQuickView?: (product: Product) => void;
}

export function ProductList({ products, isLoading, error, onQuickView }: ProductListProps) {

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in">
        <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
          <AlertCircle className="h-8 w-8 text-destructive" />
        </div>
        <h3 className="text-lg font-semibold mb-2">Unable to load products</h3>
        <p className="text-muted-foreground max-w-md">
          {error}. Please check that the API Gateway is running and try again.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Search skeleton */}
        <div className="h-11 bg-secondary rounded-lg animate-pulse" />

        {/* Grid skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-3 animate-pulse">
              <div className="aspect-square bg-secondary rounded-lg" />
              <div className="h-5 bg-secondary rounded w-3/4" />
              <div className="h-4 bg-secondary rounded w-full" />
              <div className="h-4 bg-secondary rounded w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Product grid */}
      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={onQuickView}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in">
          <div className="h-16 w-16 rounded-full bg-secondary flex items-center justify-center mb-4">
            <Package className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No products found</h3>
          <p className="text-muted-foreground">
            No products are currently available
          </p>
        </div>
      )}
    </>
  );
}

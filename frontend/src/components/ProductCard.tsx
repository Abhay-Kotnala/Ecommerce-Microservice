import { Link } from 'react-router-dom';
import { ShoppingCart, Package, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { Product } from '@/types';
import { useCart } from '@/contexts/CartContext';
import { toast } from '@/hooks/use-toast';

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

export function ProductCard({ product, onQuickView }: ProductCardProps) {
  const { addItem, getItemQuantity } = useCart();
  const cartQuantity = getItemQuantity(product.id);
  const isOutOfStock = product.stockQuantity === 0;
  const remainingStock = product.stockQuantity - cartQuantity;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (remainingStock <= 0) {
      toast({
        title: 'Stock limit reached',
        description: `You already have the maximum available quantity in your cart.`,
        variant: 'destructive',
      });
      return;
    }

    addItem(product, 1);
    toast({
      title: 'Added to cart',
      description: `${product.name} has been added to your cart.`,
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Link to={`/product/${product.id}`}>
      <Card className="group h-full overflow-hidden border border-white/10 bg-card/40 backdrop-blur-sm hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300">
        {/* Product Image */}
        <div className="aspect-square bg-secondary/50 flex items-center justify-center relative overflow-hidden group-hover:bg-secondary/30 transition-colors">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
              onError={(e) => {
                // Fallback to placeholder icon if image fails to load
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent && !parent.querySelector('.fallback-icon')) {
                  const icon = document.createElement('div');
                  icon.className = 'fallback-icon h-16 w-16 text-muted-foreground/40';
                  icon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.29 7 12 12 20.71 7"></polyline><line x1="12" y1="22" x2="12" y2="12"></line></svg>';
                  parent.appendChild(icon);
                }
              }}
            />
          ) : (
            <Package className="h-16 w-16 text-muted-foreground/40 group-hover:scale-110 transition-transform duration-300" />
          )}

          {/* Stock badge */}
          {isOutOfStock ? (
            <div className="absolute top-3 right-3 px-2.5 py-1 rounded-md bg-destructive text-destructive-foreground text-xs font-semibold">
              Out of Stock
            </div>
          ) : product.stockQuantity <= 5 ? (
            <div className="absolute top-3 right-3 px-2.5 py-1 rounded-md bg-warning text-warning-foreground text-xs font-semibold">
              Low Stock: {product.stockQuantity}
            </div>
          ) : null}
          {/* Quick View Overlay */}
          {onQuickView && (
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <Button
                variant="secondary"
                size="sm"
                className="translate-y-4 group-hover:translate-y-0 transition-transform duration-300 gap-2 shadow-lg hover:scale-105"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onQuickView(product);
                }}
              >
                <Eye className="h-4 w-4" />
                Quick View
              </Button>
            </div>
          )}
        </div>

        <CardContent className="p-4 space-y-3">
          {/* Product name */}
          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
            {product.name}
          </h3>

          {/* Description */}
          <p className="text-sm text-muted-foreground line-clamp-2 min-h-[2.5rem]">
            {product.description || 'No description available'}
          </p>

          {/* Price and cart */}
          <div className="flex items-center justify-between pt-2">
            <div className="space-y-0.5">
              <p className="text-lg font-bold text-foreground">
                {formatPrice(product.price)}
              </p>
              {!isOutOfStock && (
                <p className="text-xs text-muted-foreground">
                  {product.stockQuantity} in stock
                </p>
              )}
            </div>

            <Button
              variant={isOutOfStock ? 'outline' : 'accent'}
              size="sm"
              onClick={handleAddToCart}
              disabled={isOutOfStock || remainingStock <= 0}
              className="gap-1.5"
            >
              <ShoppingCart className="h-4 w-4" />
              {isOutOfStock ? 'Unavailable' : 'Add'}
            </Button>
          </div>

          {/* Cart indicator */}
          {cartQuantity > 0 && (
            <div className="text-xs text-primary font-medium animate-fade-in">
              {cartQuantity} in cart
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}

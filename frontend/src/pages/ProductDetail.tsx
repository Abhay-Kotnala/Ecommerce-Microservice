import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Package, Minus, Plus, AlertCircle, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { fetchProductById } from '@/lib/api';
import { useCart } from '@/contexts/CartContext';
import { toast } from '@/hooks/use-toast';
import type { Product } from '@/types';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem, getItemQuantity } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  const cartQuantity = product ? getItemQuantity(product.id) : 0;
  const maxQuantity = product ? product.stockQuantity - cartQuantity : 0;
  const isOutOfStock = product?.stockQuantity === 0;

  useEffect(() => {
    const loadProduct = async () => {
      if (!id) return;

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetchProductById(parseInt(id));
        if (response.error || !response.data) {
          setError(response.error || 'Product not found');
        } else {
          setProduct(response.data);
        }
      } catch (err) {
        setError('Failed to load product details');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  useEffect(() => {
    // Reset quantity when product changes
    setQuantity(1);
  }, [product]);

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= maxQuantity) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    if (!product || quantity > maxQuantity) return;

    addItem(product, quantity);
    toast({
      title: 'Added to cart',
      description: `${quantity}x ${product.name} added to your cart.`,
    });
    setQuantity(1);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (isLoading) {
    return (
      <div className="container py-8">
        <LoadingSpinner message="Loading product details..." />
      </div>
    );
  }

  if (error && !product) {
    return (
      <div className="container py-8">
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
            <AlertCircle className="h-8 w-8 text-destructive" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Product not found</h3>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={() => navigate('/')}>Back to Products</Button>
        </div>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="container py-8">
      {/* Back button */}
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Products
      </Link>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        {/* Product Image */}
        <Card className="overflow-hidden">
          <div className="aspect-square bg-secondary flex items-center justify-center relative">
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <Package className="h-32 w-32 text-muted-foreground/40" />
            )}

            {isOutOfStock && (
              <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                <div className="px-4 py-2 rounded-lg bg-destructive text-destructive-foreground font-semibold">
                  Out of Stock
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">{product.name}</h1>
            {product.skuCode && (
              <p className="text-sm text-muted-foreground">SKU: {product.skuCode}</p>
            )}
          </div>

          <div className="text-3xl font-bold text-primary">
            {formatPrice(product.price)}
          </div>

          <p className="text-muted-foreground leading-relaxed">
            {product.description || 'No description available for this product.'}
          </p>

          {/* Stock status */}
          <Card className={isOutOfStock ? 'border-destructive/50' : 'border-success/50'}>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                {isOutOfStock ? (
                  <>
                    <AlertCircle className="h-5 w-5 text-destructive" />
                    <span className="font-medium text-destructive">Out of Stock</span>
                  </>
                ) : (
                  <>
                    <Check className="h-5 w-5 text-success" />
                    <span className="font-medium text-success">In Stock</span>
                    ({product.stockQuantity} available)
                  </>
                )}
              </div>
              {cartQuantity > 0 && (
                <p className="text-sm text-primary mt-2">
                  You have {cartQuantity} in your cart
                </p>
              )}
            </CardContent>
          </Card>

          {/* Quantity selector and add to cart */}
          {!isOutOfStock && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium">Quantity:</span>
                <div className="flex items-center border border-border rounded-lg">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="rounded-r-none"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= maxQuantity}
                    className="rounded-l-none"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {maxQuantity < product.stockQuantity && (
                  <span className="text-sm text-muted-foreground">
                    (max {maxQuantity} more)
                  </span>
                )}
              </div>

              <div className="flex gap-3">
                <Button
                  variant="accent"
                  size="lg"
                  onClick={handleAddToCart}
                  disabled={maxQuantity <= 0}
                  className="flex-1"
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Add to Cart
                  <span className="ml-2 text-accent-foreground/80">
                    {formatPrice(product.price * quantity)}
                  </span>
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


// Mock product removed


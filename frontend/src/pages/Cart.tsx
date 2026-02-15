import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Trash2, Minus, Plus, ArrowRight, Package, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { createOrder } from '@/lib/api';
import { toast } from '@/hooks/use-toast';
import type { CartItem } from '@/types';

export default function Cart() {
  const navigate = useNavigate();
  const { items, updateQuantity, removeItem, clearCart, subtotal, itemCount } = useCart();
  const { userId, isAuthenticated, login } = useAuth();
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<string | null>(null);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleQuantityChange = (item: CartItem, delta: number) => {
    const newQuantity = item.quantity + delta;
    updateQuantity(item.product.id, newQuantity);
  };

  const handleProceedToCheckout = () => {
    if (!isAuthenticated) {
      login();
      return;
    }
    navigate('/checkout');
  };

  if (orderSuccess) {
    return (
      <div className="container py-8">
        <Card className="max-w-lg mx-auto text-center animate-slide-up">
          <CardContent className="py-12 space-y-6">
            <div className="h-20 w-20 rounded-full bg-success/10 flex items-center justify-center mx-auto">
              <CheckCircle className="h-10 w-10 text-success" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">Order Confirmed!</h2>
              <p className="text-muted-foreground">
                Your order <span className="font-mono font-medium text-foreground">{orderSuccess}</span> has been placed successfully.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-secondary/50">
              <p className="text-sm text-muted-foreground">
                📧 An order confirmation email will be sent via our notification service (event-driven via Kafka).
              </p>
            </div>
            <div className="flex gap-3 justify-center">
              <Button variant="outline" onClick={() => navigate('/orders')}>
                View Orders
              </Button>
              <Button onClick={() => {
                setOrderSuccess(null);
                navigate('/');
              }}>
                Continue Shopping
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container py-8">
        <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in">
          <div className="h-20 w-20 rounded-full bg-secondary flex items-center justify-center mb-6">
            <ShoppingCart className="h-10 w-10 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
          <p className="text-muted-foreground mb-6 max-w-md">
            Looks like you haven't added any products yet. Start shopping to fill up your cart!
          </p>
          <Button size="lg" onClick={() => navigate('/')}>
            <Package className="h-5 w-5 mr-2" />
            Browse Products
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">Shopping Cart</h1>
        <p className="text-muted-foreground">{itemCount} item{itemCount !== 1 ? 's' : ''} in your cart</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <Card key={item.product.id} className="animate-fade-in">
              <CardContent className="p-4">
                <div className="flex gap-4">
                  {/* Product image */}
                  <Link to={`/product/${item.product.id}`} className="shrink-0">
                    <div className="h-24 w-24 rounded-lg bg-secondary flex items-center justify-center overflow-hidden">
                      {item.product.imageUrl ? (
                        <img
                          src={item.product.imageUrl}
                          alt={item.product.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <Package className="h-8 w-8 text-muted-foreground/40" />
                      )}
                    </div>
                  </Link>

                  {/* Product info */}
                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/product/${item.product.id}`}
                      className="font-semibold hover:text-primary transition-colors line-clamp-1"
                    >
                      {item.product.name}
                    </Link>
                    <p className="text-sm text-muted-foreground mt-1">
                      {formatPrice(item.product.price)} each
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {item.product.stockQuantity} in stock
                    </p>
                  </div>

                  {/* Quantity and actions */}
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center border border-border rounded-lg">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-r-none"
                        onClick={() => handleQuantityChange(item, -1)}
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-l-none"
                        onClick={() => handleQuantityChange(item, 1)}
                        disabled={item.quantity >= item.product.stockQuantity}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>

                    <p className="font-semibold">
                      {formatPrice(item.product.price * item.quantity)}
                    </p>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => removeItem(item.product.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Remove
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Order summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {items.map((item) => (
                  <div key={item.product.id} className="flex justify-between text-sm">
                    <span className="text-muted-foreground truncate max-w-[60%]">
                      {item.product.name} × {item.quantity}
                    </span>
                    <span>{formatPrice(item.product.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <Separator />

              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>{formatPrice(subtotal)}</span>
              </div>

              {!isAuthenticated && (
                <div className="p-3 rounded-lg bg-warning/10 border border-warning/20">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-warning mt-0.5" />
                    <p className="text-sm text-warning">
                      Please log in to place an order
                    </p>
                  </div>
                </div>
              )}

              <Button
                variant="accent"
                size="lg"
                className="w-full"
                onClick={handleProceedToCheckout}
                disabled={items.length === 0}
              >
                {isAuthenticated ? 'Proceed to Checkout' : 'Log in to Checkout'}
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                Orders are processed via the Order Service and notifications are sent via Kafka events.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

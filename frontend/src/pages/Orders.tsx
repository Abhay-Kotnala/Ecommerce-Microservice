
import { useEffect, useState } from 'react';
import { Package, Calendar, Clock, CheckCircle, Truck, ArrowRight, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { fetchOrdersByUser } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import type { Order, OrderStatus } from '@/types';
import { Separator } from '@/components/ui/separator';

export default function Orders() {
  const { userId } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadOrders = async () => {
    setIsLoading(true);
    setError(null);

    const response = await fetchOrdersByUser(userId);

    if (response.error) {
      setError(response.error);
      setOrders(getMockOrders());
    } else if (response.data) {
      setOrders(response.data);
    } else {
      setOrders(getMockOrders());
    }

    setIsLoading(false);
  };

  useEffect(() => {
    loadOrders();
  }, [userId]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(dateString));
  };

  return (
    <div className="container py-8 max-w-5xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Order History</h1>
          <p className="text-muted-foreground mt-1">Track and manage your recent purchases</p>
        </div>
        <Button variant="outline" onClick={loadOrders} disabled={isLoading}>
          Refresh Orders
        </Button>
      </div>

      {isLoading ? (
        <div className="py-20"><LoadingSpinner message="Loading your orders..." /></div>
      ) : orders.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} formatPrice={formatPrice} formatDate={formatDate} />
          ))}
        </div>
      )}
    </div>
  );
}

function OrderCard({ order, formatPrice, formatDate }: { order: Order, formatPrice: (p: number) => string, formatDate: (d: string) => string }) {
  const steps = [
    { status: 'PENDING', label: 'Order Placed', icon: Clock },
    { status: 'CONFIRMED', label: 'Processing', icon: Package },
    { status: 'SHIPPED', label: 'Shipped', icon: Truck },
    { status: 'DELIVERED', label: 'Delivered', icon: CheckCircle },
  ];

  const getCurrentStepIndex = (status: string) => {
    if (status === 'CANCELLED') return -1;
    const index = steps.findIndex(s => s.status === status);
    return index === -1 ? 0 : index; // Default to 0 if unknown
  };

  const currentStep = getCurrentStepIndex(order.status || 'PENDING');
  const isCancelled = order.status === 'CANCELLED';

  // Random product image for demo/visual appeal if missing
  const demoImage = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60";

  return (
    <Card className="overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm transition-all hover:border-primary/20">
      <CardHeader className="bg-muted/30 pb-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <span className="font-mono text-sm text-muted-foreground">Order #{order.orderNumber || order.id}</span>
              {isCancelled ? (
                <Badge variant="destructive">Cancelled</Badge>
              ) : (
                <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                  {order.status}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>Placed on {order.createdAt ? formatDate(order.createdAt) : 'Unknown Date'}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-muted-foreground">Total Amount</div>
            <div className="text-xl font-bold text-primary">{order.totalAmount ? formatPrice(order.totalAmount) : 'N/A'}</div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        {/* Status Stepper */}
        {!isCancelled && (
          <div className="relative flex items-center justify-between mb-8 px-2 md:px-10">
            {/* Progress Bar background */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-muted -z-10" />
            {/* Active Progress Bar */}
            <div
              className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary -z-10 transition-all duration-500"
              style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
            />

            {steps.map((step, index) => {
              const isCompleted = index <= currentStep;
              const isCurrent = index === currentStep;

              return (
                <div key={step.status} className="flex flex-col items-center gap-2 bg-card p-2 rounded-full z-10">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${isCompleted ? 'bg-primary border-primary text-primary-foreground' : 'bg-muted border-muted text-muted-foreground'}`}>
                    <step.icon className="w-4 h-4" />
                  </div>
                  <span className={`text-xs font-medium ${isCurrent ? 'text-foreground' : 'text-muted-foreground'}`}>{step.label}</span>
                </div>
              );
            })}
          </div>
        )}

        {isCancelled && (
          <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive mb-6 flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            <span>This order was cancelled. Please contact support if this is a mistake.</span>
          </div>
        )}

        <Separator className="my-6" />

        {/* Order Items */}
        <div className="space-y-4">
          {order.lineItems?.map((item, idx) => (
            <div key={idx} className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-md bg-muted overflow-hidden flex-shrink-0">
                <img src={demoImage} alt="Product" className="w-full h-full object-cover opacity-80" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium">Product {item.skuCode}</h4>
                <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
              </div>
              <div className="text-right font-medium">
                {formatPrice(item.price * item.quantity)}
              </div>
            </div>
          ))}
          {(!order.lineItems || order.lineItems.length === 0) && (
            <p className="text-sm text-muted-foreground italic">Product details unavailable for this order.</p>
          )}
        </div>
      </CardContent>

      <CardFooter className="bg-muted/10 flex justify-end gap-2 pt-4">
        <Button variant="ghost" size="sm">View Invoice</Button>
        <Button variant="outline" size="sm" className="gap-2">
          Track Order <ArrowRight className="w-4 h-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}

function EmptyState() {
  return (
    <Card className="text-center py-20 border-dashed">
      <CardContent>
        <div className="h-20 w-20 rounded-full bg-secondary flex items-center justify-center mx-auto mb-6">
          <ShoppingBag className="h-10 w-10 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold mb-2">No orders yet</h3>
        <p className="text-muted-foreground max-w-sm mx-auto mb-6">
          Looks like you haven't bought anything yet. Explore our collection and place your first order!
        </p>
        <Button>Start Shopping</Button>
      </CardContent>
    </Card>
  );
}

// Mock orders for demo with realistic data
function getMockOrders(): Order[] {
  const now = new Date();
  return [
    {
      id: 1001,
      orderNumber: 'ORD-2026-8832',
      userId: 'user123',
      status: 'DELIVERED',
      createdAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      totalAmount: 24999.00,
      lineItems: [
        { skuCode: 'WH-1000XM5', price: 24999.00, quantity: 1 },
      ],
    },
    {
      id: 1002,
      orderNumber: 'ORD-2026-9921',
      userId: 'user123',
      status: 'SHIPPED',
      createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      totalAmount: 4999.00,
      lineItems: [
        { skuCode: 'MSE-WL-GM', price: 4999.00, quantity: 1 },
      ],
    },
    {
      id: 1003,
      orderNumber: 'ORD-2026-4421',
      userId: 'user123',
      status: 'CONFIRMED',
      createdAt: new Date(now.getTime() - 12 * 60 * 60 * 1000).toISOString(),
      totalAmount: 18499.00,
      lineItems: [
        { skuCode: 'CHR-ERGO-04', price: 18499.00, quantity: 1 },
      ],
    }
  ];
}

import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CheckoutForm from '@/components/CheckoutForm';
import { createPaymentIntent, createOrder } from '@/lib/api';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export default function Checkout() {
    const { items, subtotal, clearCart } = useCart();
    const { userId } = useAuth();
    const navigate = useNavigate();
    const [clientSecret, setClientSecret] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const initialized = useRef(false);

    useEffect(() => {
        if (items.length === 0) {
            navigate('/cart');
            return;
        }

        if (initialized.current) return;
        initialized.current = true;

        // Create PaymentIntent as soon as the page loads
        const initializePayment = async () => {
            setIsLoading(true);
            try {
                const response = await createPaymentIntent(subtotal, 'usd', 'card');

                if (response.data?.clientSecret) {
                    setClientSecret(response.data.clientSecret);
                } else {
                    toast({
                        title: "Error",
                        description: "Failed to initialize payment. Please try again.",
                        variant: "destructive"
                    });
                }
            } catch (error) {
                console.error("Failed to create payment intent:", error);
                toast({
                    title: "Error",
                    description: "Could not connect to payment system.",
                    variant: "destructive"
                });
            } finally {
                setIsLoading(false);
            }
        };

        initializePayment();
    }, [items, subtotal, navigate]);

    const handlePaymentSuccess = async (paymentIntentId: string) => {
        // Payment succeeded, now place the order
        // In a real app, you might want to do this webhook-based or secure it more

        // For this MVP, we take the first item as the main order item similar to Cart logic
        // but in reality we should iterate.
        const firstItem = items[0];

        const orderPayload = {
            userId,
            productId: firstItem.product.id,
            quantity: firstItem.quantity,
            paymentMethodId: paymentIntentId,
            paymentType: 'CARD' // Updated to match backend Enum
        };
        console.log("Creating order with payload:", orderPayload);

        const response = await createOrder(orderPayload);

        if (response.error) {
            toast({
                title: "Order Failed",
                description: response.error,
                variant: "destructive"
            });
        } else {
            toast({
                title: "Order Placed!",
                description: `Order #${response.data?.orderNumber} confirmed.`,
            });
            clearCart();
            navigate('/orders');
        }
    };

    const options = {
        clientSecret,
        appearance: {
            theme: 'stripe' as const,
        },
    };

    return (
        <div className="container py-12 max-w-xl">
            <Card>
                <CardHeader>
                    <CardTitle>Checkout</CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="flex justify-center py-8">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : clientSecret ? (
                        <Elements options={options} stripe={stripePromise}>
                            <CheckoutForm amount={subtotal} onSuccess={handlePaymentSuccess} />
                        </Elements>
                    ) : (
                        <div className="text-center text-red-500">
                            Failed to load payment system.
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

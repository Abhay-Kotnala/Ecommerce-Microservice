import { useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface CheckoutFormProps {
    amount: number;
    onSuccess: (paymentIntentId: string) => void;
}

export default function CheckoutForm({ amount, onSuccess }: CheckoutFormProps) {
    const stripe = useStripe();
    const elements = useElements();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!stripe || !elements) {
            // Stripe.js has not yet loaded.
            // Make sure to disable form submission until Stripe.js has loaded.
            return;
        }

        setIsProcessing(true);

        const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                // Make sure to change this to your payment completion page
                return_url: `${window.location.origin}/orders`,
            },
            redirect: 'if_required',
        });

        if (error) {
            console.error("Stripe confirmPayment error:", error);
            // This point will only be reached if there is an immediate error when
            // confirming the payment. Show error to your customer (e.g., payment
            // details incomplete)
            setErrorMessage(error.message || 'An unexpected error occurred.');
            toast({
                title: 'Payment failed',
                description: error.message || 'Please check your payment details.',
                variant: 'destructive',
            });
            setIsProcessing(false);
        } else if (paymentIntent && paymentIntent.status === 'succeeded') {
            // Your customer will be redirected to your `return_url`. For some payment
            // methods like iDEAL, your customer will be redirected to an intermediate
            // site first to authorize the payment, then redirected to the `return_url`.
            onSuccess(paymentIntent.id);
            setIsProcessing(false);
        } else {
            setIsProcessing(false);
            setErrorMessage('Payment verification failed. Please try again.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <PaymentElement />
            {errorMessage && <div className="text-red-500 text-sm">{errorMessage}</div>}
            <Button
                type="submit"
                disabled={!stripe || isProcessing}
                className="w-full"
                size="lg"
            >
                {isProcessing ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                    </>
                ) : (
                    `Pay $${amount.toFixed(2)}`
                )}
            </Button>
        </form>
    );
}

package com.ecommerce.payment.service;

import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import java.math.BigDecimal;

@Service
public class StripeService {

    @Value("${stripe.api.key}")
    private String stripeApiKey;

    @PostConstruct
    public void init() {
        Stripe.apiKey = stripeApiKey;
    }

    public PaymentIntent createPaymentIntent(BigDecimal amount, String currency, String paymentMethodType) throws StripeException {
        PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                .setAmount(amount.multiply(BigDecimal.valueOf(100)).longValue()) // Convert to cents
                .setCurrency(currency)
                .addPaymentMethodType(paymentMethodType) // card, upi
                .build();

        return PaymentIntent.create(params);
    }
    
    public PaymentIntent confirmPayment(String paymentIntentId, String paymentMethodId) throws StripeException {
        PaymentIntent paymentIntent = PaymentIntent.retrieve(paymentIntentId);
        // For testing, we might assume the intent is confirmed client-side or we confirm here if using SetupIntent flow.
        // Simplified: Retieve status.
        return paymentIntent;
    }
}

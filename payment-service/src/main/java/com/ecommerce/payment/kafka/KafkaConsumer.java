package com.ecommerce.payment.kafka;

import com.ecommerce.common.events.OrderPlacedEvent;
import com.ecommerce.common.events.PaymentCompletedEvent;
import com.ecommerce.common.events.PaymentFailedEvent;
import com.ecommerce.common.events.PaymentType;
import com.ecommerce.payment.repository.Payment;
import com.ecommerce.payment.repository.PaymentRepository;
import com.ecommerce.payment.service.StripeService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class KafkaConsumer {

    private final PaymentRepository paymentRepository;
    private final KafkaProducer kafkaProducer;
    private final StripeService stripeService;
    private final ObjectMapper objectMapper;

    @KafkaListener(topics = "order-placed-topic", groupId = "payment-group")
    public void handleOrderPlaced(String message) {
        try {
            OrderPlacedEvent event = objectMapper.readValue(message, OrderPlacedEvent.class);
            log.info("Received OrderPlacedEvent for Order ID: {}", event.getOrderId());

            Payment payment = Payment.builder()
                    .orderId(event.getOrderId())
                    .email(event.getEmail())
                    .amount(event.getTotalPrice())
                    .paymentDate(LocalDateTime.now())
                    .build();

            if (event.getPaymentType() == com.ecommerce.common.events.PaymentType.COD) {
                handleCOD(payment);
            } else {
                handleOnlinePayment(payment, event);
            }

        } catch (Exception e) {
            log.error("Payment processing failed", e);
            // We can't easily publish failed event if we couldn't parse the orderId, 
            // but log.error is a start. 
        }
    }

    private void handleCOD(Payment payment) {
        log.info("Processing COD for Order ID: {}", payment.getOrderId());
        payment.setPaymentMode("COD");
        payment.setStatus("PENDING_COLLECTION");
        paymentRepository.save(payment);
        
        // COD orders are confirmed immediately
        kafkaProducer.publishPaymentCompleted(new PaymentCompletedEvent(payment.getOrderId(), "COD-" + payment.getOrderId(), "PENDING_COLLECTION"));
    }

    private void handleOnlinePayment(Payment payment, OrderPlacedEvent event) {
        log.info("Processing Online Payment ({}) for Order ID: {}", event.getPaymentType(), event.getOrderId());
        payment.setPaymentMode(event.getPaymentType().toString());

        // In a real flow, we would confirm the Stripe PaymentIntent here.
        // For this test proof-of-concept, we assume the frontend sent a valid PaymentMethodId 
        // and we are just validating it or creating a charge.
        // Simplified Logic: If paymentMethodId is present, we consider it successful.
        
        if (event.getPaymentMethodId() != null && !event.getPaymentMethodId().isEmpty()) {
            payment.setReferenceNumber(event.getPaymentMethodId());
            payment.setStatus("SUCCESS");
            paymentRepository.save(payment);
            kafkaProducer.publishPaymentCompleted(new PaymentCompletedEvent(payment.getOrderId(), event.getPaymentMethodId(), "SUCCESS"));
        } else {
            throw new RuntimeException("Missing Payment Method ID for Online Payment");
        }
    }
}

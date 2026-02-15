package com.ecommerce.payment.kafka;

import com.ecommerce.common.events.PaymentCompletedEvent;
import com.ecommerce.common.events.PaymentFailedEvent;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class KafkaProducer {

    private final KafkaTemplate<String, String> kafkaTemplate;
    private final ObjectMapper objectMapper;

    public void publishPaymentCompleted(PaymentCompletedEvent event) {
        try {
            String message = objectMapper.writeValueAsString(event);
            log.info("Publishing PaymentCompletedEvent for Order ID: {}", event.getOrderId());
            kafkaTemplate.send("payment-completed", message);
        } catch (JsonProcessingException e) {
            log.error("Failed to serialize PaymentCompletedEvent", e);
        }
    }

    public void publishPaymentFailed(PaymentFailedEvent event) {
        try {
            String message = objectMapper.writeValueAsString(event);
            log.info("Publishing PaymentFailedEvent for Order ID: {}", event.getOrderId());
            kafkaTemplate.send("payment-failed", message);
        } catch (JsonProcessingException e) {
            log.error("Failed to serialize PaymentFailedEvent", e);
        }
    }
}

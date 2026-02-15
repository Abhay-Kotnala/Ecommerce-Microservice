package com.ecommerce.notification.service;

import com.ecommerce.common.events.OrderPlacedEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class NotificationListener {

    private final com.fasterxml.jackson.databind.ObjectMapper objectMapper;
    private final EmailService emailService;

    @KafkaListener(topics = "order-placed-topic", groupId = "notification-service-group")
    public void handleOrderPlaced(String eventJson) {
        try {
            OrderPlacedEvent event = objectMapper.readValue(eventJson, OrderPlacedEvent.class);
            log.info("📧 Received OrderPlacedEvent for Order ID: {}", event.getOrderId());
            emailService.sendOrderConfirmation(event);
        } catch (Exception e) {
            log.error("Error processing OrderPlacedEvent", e);
        }
    }
}

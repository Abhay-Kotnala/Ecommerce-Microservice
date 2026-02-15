package com.ecommerce.order.kafka;

import com.ecommerce.common.events.PaymentCompletedEvent;
import com.ecommerce.common.events.PaymentFailedEvent;
import com.ecommerce.order.entity.Order.OrderStatus;
import com.ecommerce.order.service.OrderService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class OrderPaymentConsumer {

    private final OrderService orderService;
    private final com.fasterxml.jackson.databind.ObjectMapper objectMapper;

    @KafkaListener(topics = "payment-completed", groupId = "order-group")
    public void handlePaymentCompleted(String message) {
        try {
            PaymentCompletedEvent event = objectMapper.readValue(message, PaymentCompletedEvent.class);
            log.info("Received PaymentCompletedEvent for Order ID: {}", event.getOrderId());
            if ("PENDING_COLLECTION".equals(event.getStatus())) {
                // For COD, we might keep it as CONFIRMED or a specific COD status.
                orderService.updateOrderStatus(event.getOrderId(), OrderStatus.CONFIRMED);
            } else {
                orderService.updateOrderStatus(event.getOrderId(), OrderStatus.PAID);
            }
        } catch (Exception e) {
            log.error("Failed to process PaymentCompletedEvent", e);
        }
    }

    @KafkaListener(topics = "payment-failed", groupId = "order-group")
    public void handlePaymentFailed(String message) {
        try {
            PaymentFailedEvent event = objectMapper.readValue(message, PaymentFailedEvent.class);
            log.error("Received PaymentFailedEvent for Order ID: {}. Reason: {}", event.getOrderId(),
                    event.getReason());
            orderService.updateOrderStatus(event.getOrderId(), OrderStatus.CANCELLED);
        } catch (Exception e) {
            log.error("Failed to process PaymentFailedEvent", e);
        }
    }
}

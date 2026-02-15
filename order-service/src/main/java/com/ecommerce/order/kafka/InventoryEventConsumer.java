package com.ecommerce.order.kafka;

import com.ecommerce.common.events.StockFailedEvent;
import com.ecommerce.common.events.StockReservedEvent;
import com.ecommerce.order.service.OrderService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
public class InventoryEventConsumer {

    private static final Logger logger = LoggerFactory.getLogger(InventoryEventConsumer.class);

    private final OrderService orderService;
    private final ObjectMapper objectMapper;

    public InventoryEventConsumer(OrderService orderService, ObjectMapper objectMapper) {
        this.orderService = orderService;
        this.objectMapper = objectMapper;
    }

    @KafkaListener(topics = "stock-reserved-topic", groupId = "order-service-group")
    public void handleStockReservedEvent(String message) {
        try {
            StockReservedEvent event = objectMapper.readValue(message, StockReservedEvent.class);
            logger.info("Received StockReservedEvent for order: {}", event.getOrderId());
            orderService.confirmOrder(event.getOrderId());
        } catch (JsonProcessingException e) {
            logger.error("Failed to deserialize StockReservedEvent", e);
        }
    }

    @KafkaListener(topics = "stock-failed-topic", groupId = "order-service-group")
    public void handleStockFailedEvent(String message) {
        try {
            StockFailedEvent event = objectMapper.readValue(message, StockFailedEvent.class);
            logger.info("Received StockFailedEvent for order: {} - Reason: {}",
                    event.getOrderId(), event.getReason());
            orderService.failOrder(event.getOrderId(), event.getReason());
        } catch (JsonProcessingException e) {
            logger.error("Failed to deserialize StockFailedEvent", e);
        }
    }
}

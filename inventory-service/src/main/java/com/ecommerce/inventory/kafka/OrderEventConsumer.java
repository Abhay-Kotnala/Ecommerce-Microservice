package com.ecommerce.inventory.kafka;

import com.ecommerce.common.events.OrderPlacedEvent;
import com.ecommerce.inventory.service.InventoryService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
public class OrderEventConsumer {

    private static final Logger logger = LoggerFactory.getLogger(OrderEventConsumer.class);

    private final InventoryService inventoryService;
    private final ObjectMapper objectMapper;

    public OrderEventConsumer(InventoryService inventoryService, ObjectMapper objectMapper) {
        this.inventoryService = inventoryService;
        this.objectMapper = objectMapper;
    }

    @KafkaListener(topics = "order-placed-topic", groupId = "inventory-service-group")
    public void handleOrderPlacedEvent(String message) {
        try {
            OrderPlacedEvent event = objectMapper.readValue(message, OrderPlacedEvent.class);
            logger.info("Received OrderPlacedEvent: {}", event);

            // Process the order and reserve stock
            inventoryService.processOrder(event);

        } catch (JsonProcessingException e) {
            logger.error("Failed to deserialize OrderPlacedEvent", e);
        } catch (Exception e) {
            logger.error("Error processing OrderPlacedEvent", e);
        }
    }
}

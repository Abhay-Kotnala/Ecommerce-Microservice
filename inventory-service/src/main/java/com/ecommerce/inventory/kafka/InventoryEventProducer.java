package com.ecommerce.inventory.kafka;

import com.ecommerce.common.events.StockFailedEvent;
import com.ecommerce.common.events.StockReservedEvent;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Component
public class InventoryEventProducer {

    private static final Logger logger = LoggerFactory.getLogger(InventoryEventProducer.class);
    private static final String STOCK_RESERVED_TOPIC = "stock-reserved-topic";
    private static final String STOCK_FAILED_TOPIC = "stock-failed-topic";

    private final KafkaTemplate<String, String> kafkaTemplate;
    private final ObjectMapper objectMapper;

    public InventoryEventProducer(KafkaTemplate<String, String> kafkaTemplate, ObjectMapper objectMapper) {
        this.kafkaTemplate = kafkaTemplate;
        this.objectMapper = objectMapper;
    }

    public void publishStockReservedEvent(StockReservedEvent event) {
        try {
            String eventJson = objectMapper.writeValueAsString(event);
            kafkaTemplate.send(STOCK_RESERVED_TOPIC, event.getOrderId().toString(), eventJson);
            logger.info("Published StockReservedEvent for order: {}", event.getOrderId());
        } catch (JsonProcessingException e) {
            logger.error("Failed to serialize StockReservedEvent", e);
            throw new RuntimeException("Failed to publish stock reserved event", e);
        }
    }

    public void publishStockFailedEvent(StockFailedEvent event) {
        try {
            String eventJson = objectMapper.writeValueAsString(event);
            kafkaTemplate.send(STOCK_FAILED_TOPIC, event.getOrderId().toString(), eventJson);
            logger.info("Published StockFailedEvent for order: {} - Reason: {}",
                    event.getOrderId(), event.getReason());
        } catch (JsonProcessingException e) {
            logger.error("Failed to serialize StockFailedEvent", e);
            throw new RuntimeException("Failed to publish stock failed event", e);
        }
    }
}

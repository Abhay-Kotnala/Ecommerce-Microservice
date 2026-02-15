package com.ecommerce.order.kafka;

import com.ecommerce.common.events.OrderPlacedEvent;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Component
public class OrderEventProducer {

    private static final Logger logger = LoggerFactory.getLogger(OrderEventProducer.class);
    private static final String ORDER_PLACED_TOPIC = "order-placed-topic";

    private final KafkaTemplate<String, String> kafkaTemplate;
    private final ObjectMapper objectMapper;

    public OrderEventProducer(KafkaTemplate<String, String> kafkaTemplate, ObjectMapper objectMapper) {
        this.kafkaTemplate = kafkaTemplate;
        this.objectMapper = objectMapper;
    }

    public void publishOrderPlacedEvent(OrderPlacedEvent event) {
        try {
            String eventJson = objectMapper.writeValueAsString(event);
            kafkaTemplate.send(ORDER_PLACED_TOPIC, event.getOrderId().toString(), eventJson);
            logger.info("Published OrderPlacedEvent for order: {}", event.getOrderId());
        } catch (JsonProcessingException e) {
            logger.error("Failed to serialize OrderPlacedEvent", e);
            throw new RuntimeException("Failed to publish order placed event", e);
        }
    }
}

package com.ecommerce.order.service;

import com.ecommerce.common.events.OrderPlacedEvent;
import com.ecommerce.order.dto.CreateOrderRequest;
import com.ecommerce.order.entity.Order;
import com.ecommerce.order.kafka.OrderEventProducer;
import com.ecommerce.order.repository.OrderRepository;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import io.github.resilience4j.retry.annotation.Retry;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
public class OrderService {

    private static final Logger logger = LoggerFactory.getLogger(OrderService.class);

    private final OrderRepository orderRepository;
    private final OrderEventProducer orderEventProducer;

    public OrderService(OrderRepository orderRepository, OrderEventProducer orderEventProducer) {
        this.orderRepository = orderRepository;
        this.orderEventProducer = orderEventProducer;
    }

    @Transactional
    @CircuitBreaker(name = "inventory", fallbackMethod = "createOrderFallback")
    public Order createOrder(CreateOrderRequest request) {
        // Call Inventory Service to check stock
        // In a real scenario, this would be a Feign Client call
        // inventoryClient.checkStock(request.getProductId(), request.getQuantity());

        // Simulating Inventory Call
        if (request.getQuantity() > 100) {
            throw new RuntimeException("Inventory Service Unavailable");
        }

        BigDecimal price = BigDecimal.valueOf(100.00);
        BigDecimal totalPrice = price.multiply(BigDecimal.valueOf(request.getQuantity()));

        Order order = new Order(
                request.getUserId(),
                request.getProductId(),
                request.getQuantity(),
                totalPrice);

        order.setPaymentType(request.getPaymentType());

        order = orderRepository.save(order);
        logger.info("Order created with ID: {}", order.getId());

        // Publish OrderPlacedEvent to Kafka
        OrderPlacedEvent event = new OrderPlacedEvent(
                order.getId(),
                order.getUserId(),
                order.getProductId(),
                order.getQuantity(),
                order.getTotalPrice(),
                request.getEmail() != null ? request.getEmail() : "test@example.com",
                request.getPaymentMethodId(),
                request.getPaymentType());
        orderEventProducer.publishOrderPlacedEvent(event);

        return order;
    }

    @Retry(name = "orderService")
    public Order getOrderById(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found with ID: " + id));
    }

    public List<Order> getOrdersByUserId(String userId) {
        return orderRepository.findByUserId(userId);
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    @Transactional
    public void updateOrderStatus(Long orderId, Order.OrderStatus status) {
        Order order = getOrderById(orderId);

        // Prevent downgrading status
        if (order.getStatus() == Order.OrderStatus.PAID && status == Order.OrderStatus.CONFIRMED) {
            logger.info("Order {} is already PAID, skipping update to CONFIRMED", orderId);
            return;
        }

        order.setStatus(status);
        orderRepository.save(order);
        logger.info("Order {} status updated to {}", orderId, status);
    }

    @Transactional
    public void confirmOrder(Long orderId) {
        Order order = getOrderById(orderId);
        if (order.getStatus() == Order.OrderStatus.PENDING) {
            updateOrderStatus(orderId, Order.OrderStatus.CONFIRMED);
        } else if (order.getStatus() == Order.OrderStatus.PAID) {
            logger.info("Order {} already PAID, status remains PAID after stock reservation", orderId);
        }
        // TODO: Publish OrderConfirmedEvent for Email Service
    }

    @Transactional
    public void failOrder(Long orderId, String reason) {
        Order order = getOrderById(orderId);
        // Only fail if not already completed/paid?
        // Actually if stock fails, order should fail regardless of payment (needs
        // refund logic later)
        order.setStatus(Order.OrderStatus.FAILED);
        orderRepository.save(order);
        logger.warn("Order {} failed. Reason: {}", orderId, reason);
    }

    /**
     * Fallback method for createOrder when circuit breaker is open
     * This provides graceful degradation when event publishing fails
     */
    private Order createOrderFallback(CreateOrderRequest request, Exception e) {
        logger.error("Circuit breaker activated for createOrder. Reason: {}", e.getMessage());

        // Save order in PENDING state without publishing event
        BigDecimal price = BigDecimal.valueOf(100.00);
        BigDecimal totalPrice = price.multiply(BigDecimal.valueOf(request.getQuantity()));

        Order order = new Order(
                request.getUserId(),
                request.getProductId(),
                request.getQuantity(),
                totalPrice);

        order = orderRepository.save(order);
        logger.warn("⚠️ Order {} created in degraded mode (event publishing failed)", order.getId());

        return order;
    }
}

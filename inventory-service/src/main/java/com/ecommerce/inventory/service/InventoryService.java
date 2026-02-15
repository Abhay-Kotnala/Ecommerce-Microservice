package com.ecommerce.inventory.service;

import com.ecommerce.common.events.OrderPlacedEvent;
import com.ecommerce.common.events.StockFailedEvent;
import com.ecommerce.common.events.StockReservedEvent;
import com.ecommerce.inventory.dto.CreateProductRequest;
import com.ecommerce.inventory.entity.Product;
import com.ecommerce.inventory.kafka.InventoryEventProducer;
import com.ecommerce.inventory.repository.ProductRepository;
import io.github.resilience4j.retry.annotation.Retry;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class InventoryService {

    private static final Logger logger = LoggerFactory.getLogger(InventoryService.class);

    private final ProductRepository productRepository;
    private final InventoryEventProducer inventoryEventProducer;

    public InventoryService(ProductRepository productRepository, InventoryEventProducer inventoryEventProducer) {
        this.productRepository = productRepository;
        this.inventoryEventProducer = inventoryEventProducer;
    }

    public Product createProduct(CreateProductRequest request) {
        Product product = new Product(
                request.getName(),
                request.getDescription(),
                request.getPrice(),
                request.getStockQuantity(),
                request.getSkuCode(),
                request.getImageUrl(),
                request.getCategory());
        product = productRepository.save(product);
        logger.info("Product created with ID: {}", product.getId());
        return product;
    }

    @Retry(name = "inventoryService")
    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with ID: " + id));
    }

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    @Transactional
    public void updateStock(Long productId, Integer newStock) {
        Product product = getProductById(productId);
        product.setStockQuantity(newStock);
        productRepository.save(product);
        logger.info("Updated stock for product {} to {}", productId, newStock);
    }

    @Transactional
    @Retry(name = "inventoryService")
    public void processOrder(OrderPlacedEvent orderEvent) {
        Long productId = orderEvent.getProductId();
        Integer quantity = orderEvent.getQuantity();
        Long orderId = orderEvent.getOrderId();

        logger.info("Processing order {} for product {} with quantity {}", orderId, productId, quantity);

        try {
            // Lock the product row for update
            Product product = productRepository.findByIdForUpdate(productId)
                    .orElseThrow(() -> new RuntimeException("Product not found with ID: " + productId));

            // Check stock availability
            if (product.getStockQuantity() < quantity) {
                logger.warn("Insufficient stock for product {}. Available: {}, Requested: {}",
                        productId, product.getStockQuantity(), quantity);

                // Publish StockFailedEvent
                StockFailedEvent failedEvent = new StockFailedEvent(
                        orderId,
                        productId,
                        "Insufficient stock. Available: " + product.getStockQuantity() + ", Requested: " + quantity);
                inventoryEventProducer.publishStockFailedEvent(failedEvent);
                return;
            }

            // Reserve stock (decrement)
            product.setStockQuantity(product.getStockQuantity() - quantity);
            productRepository.save(product);

            logger.info("Successfully reserved {} units of product {} for order {}",
                    quantity, productId, orderId);

            // Publish StockReservedEvent
            StockReservedEvent reservedEvent = new StockReservedEvent(orderId, productId, quantity);
            inventoryEventProducer.publishStockReservedEvent(reservedEvent);

        } catch (Exception e) {
            logger.error("Error processing order {}", orderId, e);

            // Publish StockFailedEvent
            StockFailedEvent failedEvent = new StockFailedEvent(
                    orderId,
                    productId,
                    "Error processing order: " + e.getMessage());
            inventoryEventProducer.publishStockFailedEvent(failedEvent);
        }
    }
}

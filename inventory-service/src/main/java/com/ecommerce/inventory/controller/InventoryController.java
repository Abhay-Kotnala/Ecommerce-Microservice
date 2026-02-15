package com.ecommerce.inventory.controller;

import com.ecommerce.inventory.dto.CreateProductRequest;
import com.ecommerce.inventory.dto.ProductResponse;
import com.ecommerce.inventory.entity.Product;
import com.ecommerce.inventory.service.InventoryService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/inventory")
public class InventoryController {

    private final InventoryService inventoryService;

    public InventoryController(InventoryService inventoryService) {
        this.inventoryService = inventoryService;
    }

    @PostMapping
    public ResponseEntity<ProductResponse> createProduct(@Valid @RequestBody CreateProductRequest request) {
        Product product = inventoryService.createProduct(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ProductResponse.fromEntity(product));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductResponse> getProductById(@PathVariable Long id) {
        Product product = inventoryService.getProductById(id);
        return ResponseEntity.ok(ProductResponse.fromEntity(product));
    }

    @GetMapping
    public ResponseEntity<List<ProductResponse>> getAllProducts() {
        List<ProductResponse> products = inventoryService.getAllProducts()
                .stream()
                .map(ProductResponse::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(products);
    }

    @PutMapping("/{id}/stock")
    public ResponseEntity<String> updateStock(@PathVariable Long id,
            @RequestBody Map<String, Integer> request) {
        Integer newStock = request.get("stockQuantity");
        if (newStock == null || newStock < 0) {
            return ResponseEntity.badRequest().body("Invalid stock quantity");
        }
        inventoryService.updateStock(id, newStock);
        return ResponseEntity.ok("Stock updated successfully");
    }
}

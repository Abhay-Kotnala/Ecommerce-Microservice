package com.ecommerce.order.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class CreateOrderRequest {

    @NotBlank(message = "User ID is required")
    private String userId;

    @NotNull(message = "Product ID is required")
    @Min(value = 1, message = "Product ID must be greater than 0")
    private Long productId;

    @NotNull(message = "Quantity is required")
    @Min(value = 1, message = "Quantity must be at least 1")
    private Integer quantity;

    private String email;

    private String paymentMethodId;

    @NotNull(message = "Payment Type is required")
    private com.ecommerce.common.events.PaymentType paymentType;

    // Constructors
    public CreateOrderRequest() {
    }

    public CreateOrderRequest(String userId, Long productId, Integer quantity, String email, String paymentMethodId,
            com.ecommerce.common.events.PaymentType paymentType) {
        this.userId = userId;
        this.productId = productId;
        this.quantity = quantity;
        this.email = email;
        this.paymentMethodId = paymentMethodId;
        this.paymentType = paymentType;
    }

    // Getters and Setters
    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPaymentMethodId() {
        return paymentMethodId;
    }

    public void setPaymentMethodId(String paymentMethodId) {
        this.paymentMethodId = paymentMethodId;
    }

    public com.ecommerce.common.events.PaymentType getPaymentType() {
        return paymentType;
    }

    public void setPaymentType(com.ecommerce.common.events.PaymentType paymentType) {
        this.paymentType = paymentType;
    }
}

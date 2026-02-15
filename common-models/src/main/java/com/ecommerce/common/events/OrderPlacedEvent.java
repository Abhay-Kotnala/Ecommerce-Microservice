package com.ecommerce.common.events;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.io.Serializable;
import java.math.BigDecimal;

/**
 * Event published when an order is successfully placed
 */
public class OrderPlacedEvent implements Serializable {

    @JsonProperty("orderId")
    private Long orderId;

    @JsonProperty("userId")
    private String userId;

    @JsonProperty("productId")
    private Long productId;

    @JsonProperty("quantity")
    private Integer quantity;

    @JsonProperty("totalPrice")
    private BigDecimal totalPrice;

    @JsonProperty("email")
    private String email;

    @JsonProperty("paymentMethodId")
    private String paymentMethodId;

    @JsonProperty("paymentType")
    private PaymentType paymentType;

    // Default constructor for Jackson
    public OrderPlacedEvent() {
    }

    public OrderPlacedEvent(Long orderId, String userId, Long productId, Integer quantity, BigDecimal totalPrice,
            String email, String paymentMethodId, PaymentType paymentType) {
        this.orderId = orderId;
        this.userId = userId;
        this.productId = productId;
        this.quantity = quantity;
        this.totalPrice = totalPrice;
        this.email = email;
        this.paymentMethodId = paymentMethodId;
        this.paymentType = paymentType;
    }

    // Getters and Setters
    public String getPaymentMethodId() {
        return paymentMethodId;
    }

    public void setPaymentMethodId(String paymentMethodId) {
        this.paymentMethodId = paymentMethodId;
    }

    public PaymentType getPaymentType() {
        return paymentType;
    }

    public void setPaymentType(PaymentType paymentType) {
        this.paymentType = paymentType;
    }

    // Getters and Setters
    public Long getOrderId() {
        return orderId;
    }

    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }

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

    public BigDecimal getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(BigDecimal totalPrice) {
        this.totalPrice = totalPrice;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    @Override
    public String toString() {
        return "OrderPlacedEvent{" +
                "orderId=" + orderId +
                ", userId='" + userId + '\'' +
                ", productId=" + productId +
                ", quantity=" + quantity +
                ", totalPrice=" + totalPrice +
                ", email='" + email + '\'' +
                '}';
    }
}

package com.ecommerce.common.events;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.io.Serializable;
import java.math.BigDecimal;

/**
 * Event published when an order is confirmed (for email notification)
 */
public class OrderConfirmedEvent implements Serializable {

    @JsonProperty("orderId")
    private Long orderId;

    @JsonProperty("userId")
    private String userId;

    @JsonProperty("userEmail")
    private String userEmail;

    @JsonProperty("productName")
    private String productName;

    @JsonProperty("quantity")
    private Integer quantity;

    @JsonProperty("totalPrice")
    private BigDecimal totalPrice;

    public OrderConfirmedEvent() {
    }

    public OrderConfirmedEvent(Long orderId, String userId, String userEmail, String productName,
            Integer quantity, BigDecimal totalPrice) {
        this.orderId = orderId;
        this.userId = userId;
        this.userEmail = userEmail;
        this.productName = productName;
        this.quantity = quantity;
        this.totalPrice = totalPrice;
    }

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

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
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

    @Override
    public String toString() {
        return "OrderConfirmedEvent{" +
                "orderId=" + orderId +
                ", userId='" + userId + '\'' +
                ", userEmail='" + userEmail + '\'' +
                ", productName='" + productName + '\'' +
                ", quantity=" + quantity +
                ", totalPrice=" + totalPrice +
                '}';
    }
}

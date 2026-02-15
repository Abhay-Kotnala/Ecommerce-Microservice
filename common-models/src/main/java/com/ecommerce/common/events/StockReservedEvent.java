package com.ecommerce.common.events;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.io.Serializable;

/**
 * Event published when stock is successfully reserved for an order
 */
public class StockReservedEvent implements Serializable {

    @JsonProperty("orderId")
    private Long orderId;

    @JsonProperty("productId")
    private Long productId;

    @JsonProperty("quantity")
    private Integer quantity;

    public StockReservedEvent() {
    }

    public StockReservedEvent(Long orderId, Long productId, Integer quantity) {
        this.orderId = orderId;
        this.productId = productId;
        this.quantity = quantity;
    }

    public Long getOrderId() {
        return orderId;
    }

    public void setOrderId(Long orderId) {
        this.orderId = orderId;
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

    @Override
    public String toString() {
        return "StockReservedEvent{" +
                "orderId=" + orderId +
                ", productId=" + productId +
                ", quantity=" + quantity +
                '}';
    }
}

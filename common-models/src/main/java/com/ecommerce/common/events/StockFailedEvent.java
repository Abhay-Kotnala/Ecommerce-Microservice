package com.ecommerce.common.events;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.io.Serializable;

/**
 * Event published when stock reservation fails (insufficient stock)
 */
public class StockFailedEvent implements Serializable {

    @JsonProperty("orderId")
    private Long orderId;

    @JsonProperty("productId")
    private Long productId;

    @JsonProperty("reason")
    private String reason;

    public StockFailedEvent() {
    }

    public StockFailedEvent(Long orderId, Long productId, String reason) {
        this.orderId = orderId;
        this.productId = productId;
        this.reason = reason;
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

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    @Override
    public String toString() {
        return "StockFailedEvent{" +
                "orderId=" + orderId +
                ", productId=" + productId +
                ", reason='" + reason + '\'' +
                '}';
    }
}

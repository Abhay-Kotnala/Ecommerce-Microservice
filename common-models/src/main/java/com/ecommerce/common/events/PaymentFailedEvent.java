package com.ecommerce.common.events;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.io.Serializable;

public class PaymentFailedEvent implements Serializable {

    @JsonProperty("orderId")
    private Long orderId;

    @JsonProperty("reason")
    private String reason;

    public PaymentFailedEvent() {
    }

    public PaymentFailedEvent(Long orderId, String reason) {
        this.orderId = orderId;
        this.reason = reason;
    }

    public Long getOrderId() {
        return orderId;
    }

    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }
}

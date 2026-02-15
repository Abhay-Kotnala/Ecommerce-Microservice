package com.ecommerce.common.events;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.io.Serializable;

public class PaymentCompletedEvent implements Serializable {

    @JsonProperty("orderId")
    private Long orderId;

    @JsonProperty("paymentId")
    private String paymentId;

    @JsonProperty("status")
    private String status;

    public PaymentCompletedEvent() {
    }

    public PaymentCompletedEvent(Long orderId, String paymentId, String status) {
        this.orderId = orderId;
        this.paymentId = paymentId;
        this.status = status;
    }

    public Long getOrderId() {
        return orderId;
    }

    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }

    public String getPaymentId() {
        return paymentId;
    }

    public void setPaymentId(String paymentId) {
        this.paymentId = paymentId;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}

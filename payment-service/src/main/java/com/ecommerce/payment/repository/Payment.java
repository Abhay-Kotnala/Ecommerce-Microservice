package com.ecommerce.payment.repository;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "t_payments")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long orderId;
    private String paymentMode; // CARD, UPI, COD
    private String referenceNumber; // Stripe PaymentIntent ID
    private BigDecimal amount;
    private String status; // SUCCESS, FAILED, PENDING
    private String email;
    private LocalDateTime paymentDate;
}

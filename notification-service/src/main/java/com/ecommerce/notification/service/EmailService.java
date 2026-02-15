package com.ecommerce.notification.service;

import com.ecommerce.common.events.OrderPlacedEvent;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender javaMailSender;

    public void sendOrderConfirmation(OrderPlacedEvent event) {
        log.info("Preparing email for Order ID: {}", event.getOrderId());

        try {
            MimeMessage message = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(event.getEmail()); // Assuming event has email, otherwise use a default/test one
            helper.setSubject("Order Confirmation - Order #" + event.getOrderId());
            helper.setText(buildEmailContent(event), true);

            javaMailSender.send(message);
            log.info("✅ Email sent successfully for Order ID: {}", event.getOrderId());
        } catch (MessagingException e) {
            log.error("❌ Failed to send email for Order ID: {}", event.getOrderId(), e);
        }
    }

    private String buildEmailContent(OrderPlacedEvent event) {
        return String.format("""
                <html>
                    <body>
                        <h1>Thank you for your order!</h1>
                        <p>Order ID: <strong>%s</strong></p>
                        <p>We have received your order and are processing it.</p>
                    </body>
                </html>
                """, event.getOrderId());
    }
}

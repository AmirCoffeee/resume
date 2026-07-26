package com.shop.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Entity
@Table(name = "orders")
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
    private List<OrderItem> items;

    private BigDecimal totalAmount;
    private BigDecimal discountAmount = BigDecimal.ZERO;
    private BigDecimal finalAmount;

    private String shippingAddress;
    private String receiverName;
    private String receiverPhone;

    @Enumerated(EnumType.STRING)
    private OrderStatus status = OrderStatus.PENDING;

    private String paymentRefId;
    private String paymentGateway;

    @Column(updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    private LocalDateTime updatedAt;

    public enum OrderStatus {
        PENDING, PAID, PROCESSING, SHIPPED, DELIVERED, CANCELLED, REFUNDED
    }
}

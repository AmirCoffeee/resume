package com.shop.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "otp_codes")
public class OtpCode {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String phone;

    @Column(nullable = false)
    private String code;

    private LocalDateTime expiresAt;
    private boolean used = false;

    @Column(updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}

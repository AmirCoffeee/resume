package com.shop.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "site_settings")
public class SiteSettings {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Site Info
    private String siteNameFA = "فروشگاه من";
    private String siteNameEN = "My Shop";
    private String logo;
    private String favicon;

    // Theme
    private String primaryColor = "#FF6B35";
    private String secondaryColor = "#FFFFFF";
    private String accentColor = "#FF8C61";

    // Contact
    private String phone;
    private String email;
    private String address;
    private String telegram;
    private String instagram;

    // Payment Gateway
    private String paymentGateway = "zarinpal";
    private String zarinpalMerchantId;
    private String idpayApiKey;
    private boolean paymentSandbox = true;

    // SMS (for OTP)
    private String smsProvider = "kavenegar";
    private String smsApiKey;
    private String smsSender;

    // Shipping
    private boolean freeShipping = false;
    private Long freeShippingThreshold = 500000L;
    private Long shippingCost = 50000L;

    // SEO
    private String metaDescription;
    private String metaKeywords;

    @Column(columnDefinition = "TEXT")
    private String headerScript;

    @Column(columnDefinition = "TEXT")
    private String footerScript;
}

package com.shop.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Entity
@Table(name = "products")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nameFA;

    private String nameEN;

    @Column(columnDefinition = "TEXT")
    private String descriptionFA;

    @Column(columnDefinition = "TEXT")
    private String descriptionEN;

    @Column(nullable = false)
    private BigDecimal price;

    private BigDecimal discountPrice;

    private int stock = 0;

    @ElementCollection
    @CollectionTable(name = "product_images", joinColumns = @JoinColumn(name = "product_id"))
    @Column(name = "image_url")
    private List<String> images;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;

    private boolean active = true;
    private boolean featured = false;

    private double rating = 0;
    private int reviewCount = 0;

    @Column(updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}

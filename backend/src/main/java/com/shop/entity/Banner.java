package com.shop.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "banners")
public class Banner {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String titleFA;
    private String titleEN;
    private String subtitleFA;
    private String subtitleEN;
    private String imageUrl;
    private String linkUrl;
    private int sortOrder = 0;
    private boolean active = true;
}

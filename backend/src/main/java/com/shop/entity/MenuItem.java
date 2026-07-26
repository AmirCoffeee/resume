package com.shop.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.util.List;

@Data
@Entity
@Table(name = "menu_items")
public class MenuItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String titleFA;
    private String titleEN;
    private String url;
    private String icon;
    private int sortOrder = 0;
    private boolean active = true;

    @Enumerated(EnumType.STRING)
    private MenuLocation location = MenuLocation.HEADER;

    @ManyToOne
    @JoinColumn(name = "parent_id")
    private MenuItem parent;

    @OneToMany(mappedBy = "parent")
    private List<MenuItem> children;

    public enum MenuLocation { HEADER, FOOTER, SIDEBAR }
}

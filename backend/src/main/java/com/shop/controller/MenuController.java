package com.shop.controller;

import com.shop.entity.MenuItem;
import com.shop.repository.MenuItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/menu")
@RequiredArgsConstructor
public class MenuController {

    private final MenuItemRepository menuItemRepository;

    @GetMapping("/header")
    public ResponseEntity<List<MenuItem>> getHeader() {
        return ResponseEntity.ok(menuItemRepository
                .findByLocationAndParentIsNullAndActiveTrueOrderBySortOrder(
                        MenuItem.MenuLocation.HEADER));
    }

    @GetMapping("/footer")
    public ResponseEntity<List<MenuItem>> getFooter() {
        return ResponseEntity.ok(menuItemRepository
                .findByLocationAndParentIsNullAndActiveTrueOrderBySortOrder(
                        MenuItem.MenuLocation.FOOTER));
    }
}

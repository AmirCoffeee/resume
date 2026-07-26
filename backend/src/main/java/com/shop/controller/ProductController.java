package com.shop.controller;

import com.shop.entity.Product;
import com.shop.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @GetMapping
    public ResponseEntity<Page<Product>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(defaultValue = "newest") String sort,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String q) {

        if (q != null && !q.isBlank()) {
            return ResponseEntity.ok(productService.search(q, page, size));
        }
        if (categoryId != null) {
            return ResponseEntity.ok(productService.getByCategory(categoryId, page, size));
        }
        return ResponseEntity.ok(productService.getAll(page, size, sort));
    }

    @GetMapping("/featured")
    public ResponseEntity<List<Product>> getFeatured() {
        return ResponseEntity.ok(productService.getFeatured());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getById(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getById(id));
    }
}

package com.shop.controller;

import com.shop.entity.Category;
import com.shop.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryRepository categoryRepository;

    @GetMapping
    public ResponseEntity<List<Category>> getAll() {
        return ResponseEntity.ok(categoryRepository.findByActiveTrueOrderBySortOrder());
    }

    @GetMapping("/tree")
    public ResponseEntity<List<Category>> getTree() {
        return ResponseEntity.ok(categoryRepository
                .findByParentIsNullAndActiveTrueOrderBySortOrder());
    }
}

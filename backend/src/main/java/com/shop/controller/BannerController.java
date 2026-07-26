package com.shop.controller;

import com.shop.entity.Banner;
import com.shop.repository.BannerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/banners")
@RequiredArgsConstructor
public class BannerController {

    private final BannerRepository bannerRepository;

    @GetMapping
    public ResponseEntity<List<Banner>> getAll() {
        return ResponseEntity.ok(bannerRepository.findByActiveTrueOrderBySortOrder());
    }
}

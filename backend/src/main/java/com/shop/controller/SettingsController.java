package com.shop.controller;

import com.shop.entity.SiteSettings;
import com.shop.service.SiteSettingsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/settings")
@RequiredArgsConstructor
public class SettingsController {

    private final SiteSettingsService settingsService;

    @GetMapping("/public")
    public ResponseEntity<?> getPublic() {
        SiteSettings s = settingsService.get();
        // Return only safe public settings (no API keys)
        return ResponseEntity.ok(Map.of(
                "siteNameFA", s.getSiteNameFA(),
                "siteNameEN", s.getSiteNameEN(),
                "logo", s.getLogo() != null ? s.getLogo() : "",
                "primaryColor", s.getPrimaryColor(),
                "secondaryColor", s.getSecondaryColor(),
                "accentColor", s.getAccentColor(),
                "phone", s.getPhone() != null ? s.getPhone() : "",
                "email", s.getEmail() != null ? s.getEmail() : "",
                "telegram", s.getTelegram() != null ? s.getTelegram() : "",
                "instagram", s.getInstagram() != null ? s.getInstagram() : "",
                "freeShipping", s.isFreeShipping(),
                "freeShippingThreshold", s.getFreeShippingThreshold(),
                "shippingCost", s.getShippingCost(),
                "metaDescription", s.getMetaDescription() != null ? s.getMetaDescription() : "",
                "metaKeywords", s.getMetaKeywords() != null ? s.getMetaKeywords() : ""
        ));
    }
}

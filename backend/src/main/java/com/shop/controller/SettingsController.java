package com.shop.controller;

import com.shop.entity.SiteSettings;
import com.shop.service.SiteSettingsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Objects;

@RestController
@RequestMapping("/api/settings")
@RequiredArgsConstructor
public class SettingsController {

    private final SiteSettingsService settingsService;

    @GetMapping("/public")
    public ResponseEntity<Map<String, Object>> getPublic() {
        SiteSettings s = settingsService.get();

        // Use LinkedHashMap — supports any number of entries and never throws on safe values
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("siteNameFA",           orEmpty(s.getSiteNameFA()));
        result.put("siteNameEN",           orEmpty(s.getSiteNameEN()));
        result.put("logo",                 orEmpty(s.getLogo()));
        result.put("primaryColor",         orEmpty(s.getPrimaryColor()));
        result.put("secondaryColor",       orEmpty(s.getSecondaryColor()));
        result.put("accentColor",          orEmpty(s.getAccentColor()));
        result.put("phone",                orEmpty(s.getPhone()));
        result.put("email",                orEmpty(s.getEmail()));
        result.put("address",              orEmpty(s.getAddress()));
        result.put("telegram",             orEmpty(s.getTelegram()));
        result.put("instagram",            orEmpty(s.getInstagram()));
        result.put("freeShipping",         s.isFreeShipping());
        result.put("freeShippingThreshold", Objects.requireNonNullElse(s.getFreeShippingThreshold(), 500000L));
        result.put("shippingCost",         Objects.requireNonNullElse(s.getShippingCost(), 50000L));
        result.put("metaDescription",      orEmpty(s.getMetaDescription()));
        result.put("metaKeywords",         orEmpty(s.getMetaKeywords()));

        return ResponseEntity.ok(result);
    }

    /** Returns the value if non-null, otherwise an empty string. Never returns null. */
    private static String orEmpty(String value) {
        return value != null ? value : "";
    }
}

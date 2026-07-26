package com.shop.service;

import com.shop.entity.SiteSettings;
import com.shop.repository.SiteSettingsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SiteSettingsService {

    private final SiteSettingsRepository repository;

    public SiteSettings get() {
        return repository.findAll().stream().findFirst()
                .orElseGet(() -> repository.save(new SiteSettings()));
    }

    public SiteSettings update(SiteSettings settings) {
        SiteSettings existing = get();
        settings.setId(existing.getId());
        return repository.save(settings);
    }
}

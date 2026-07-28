package com.shop.config;

import com.shop.entity.SiteSettings;
import com.shop.entity.User;
import com.shop.repository.SiteSettingsRepository;
import com.shop.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.stereotype.Component;

import java.security.SecureRandom;

@Component
@RequiredArgsConstructor
@Slf4j
public class AppInitializer implements ApplicationRunner {

    private final UserRepository userRepository;
    private final SiteSettingsRepository siteSettingsRepository;

    private static final String ALPHANUMERIC =
            "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    private static final String PASSWORD_CHARS =
            "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%";

    @Override
    public void run(ApplicationArguments args) {
        initSiteSettings();
        initAdminUser();
    }

    // ─── Site Settings (admin login path) ────────────────────────────────────

    private void initSiteSettings() {
        SiteSettings settings = siteSettingsRepository.findAll()
                .stream().findFirst().orElse(null);

        if (settings == null) {
            settings = new SiteSettings();
        }

        // Only generate the admin login path once
        if (settings.getAdminLoginPath() == null || settings.getAdminLoginPath().isBlank()) {
            String adminPath = randomString(20, ALPHANUMERIC);
            settings.setAdminLoginPath(adminPath);
            siteSettingsRepository.save(settings);

            log.info("╔══════════════════════════════════════════════════╗");
            log.info("║         ADMIN LOGIN PATH GENERATED               ║");
            log.info("╠══════════════════════════════════════════════════╣");
            log.info("║  URL : http://<host>:<port>/{}  ║", padRight(adminPath, 18));
            log.info("╚══════════════════════════════════════════════════╝");
        }
    }

    // ─── Admin User ───────────────────────────────────────────────────────────

    private void initAdminUser() {
        // Check if any admin user already exists
        boolean adminExists = userRepository.findAll().stream()
                .anyMatch(u -> u.getRole() == User.Role.ADMIN && u.getUsername() != null);

        if (adminExists) {
            return;
        }

        String username = "admin";
        String rawPassword = randomString(16, PASSWORD_CHARS);
        String hashedPassword = BCrypt.hashpw(rawPassword, BCrypt.gensalt(12));

        // Use a placeholder phone that won't collide with real users
        String placeholderPhone = "00000000000";

        User admin = userRepository.findByPhone(placeholderPhone)
                .orElse(new User());

        admin.setPhone(placeholderPhone);
        admin.setUsername(username);
        admin.setPasswordHash(hashedPassword);
        admin.setRole(User.Role.ADMIN);
        admin.setFirstName("مدیر");
        admin.setLastName("سیستم");
        userRepository.save(admin);

        log.info("╔══════════════════════════════════════════════════╗");
        log.info("║         ADMIN CREDENTIALS GENERATED              ║");
        log.info("╠══════════════════════════════════════════════════╣");
        log.info("║  Username : {}                      ║", padRight(username, 37));
        log.info("║  Password : {}  ║", padRight(rawPassword, 37));
        log.info("║                                                  ║");
        log.info("║  Save these — password is NOT shown again!       ║");
        log.info("╚══════════════════════════════════════════════════╝");
    }

    // ─── Helpers ──────────────────────────────────────────────────────────────

    private String randomString(int length, String charset) {
        SecureRandom rng = new SecureRandom();
        StringBuilder sb = new StringBuilder(length);
        for (int i = 0; i < length; i++) {
            sb.append(charset.charAt(rng.nextInt(charset.length())));
        }
        return sb.toString();
    }

    private String padRight(String s, int n) {
        return String.format("%-" + n + "s", s);
    }
}

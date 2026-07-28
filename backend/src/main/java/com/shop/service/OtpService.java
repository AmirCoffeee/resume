package com.shop.service;

import com.shop.entity.OtpCode;
import com.shop.entity.SiteSettings;
import com.shop.repository.OtpRepository;
import com.shop.repository.SiteSettingsRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;

@Service
@RequiredArgsConstructor
@Slf4j
public class OtpService {

    private final OtpRepository otpRepository;
    private final SiteSettingsRepository settingsRepository;

    @Value("${app.otp.expiration}")
    private int expirationSeconds;

    @Value("${app.otp.length}")
    private int otpLength;

    // ─── Generate & Send ─────────────────────────────────────────────────────

    public String generateAndSend(String phone) {
        otpRepository.invalidateAllByPhone(phone);

        String code = generateCode();
        OtpCode otp = new OtpCode();
        otp.setPhone(phone);
        otp.setCode(code);
        otp.setExpiresAt(LocalDateTime.now().plusSeconds(expirationSeconds));
        otpRepository.save(otp);

        SiteSettings settings = settingsRepository.findAll().stream().findFirst().orElse(null);

        if (settings != null && settings.isOtpEnabled()) {
            if ("TELEGRAM".equalsIgnoreCase(settings.getOtpProvider())) {
                sendViaTelegram(code, phone, settings);
            } else {
                sendViaSms(code, phone, settings);
            }
        } else {
            // Dev/fallback: just log
            log.info("📨 OTP for {} → {}", phone, code);
        }

        return code; // Remove in production
    }

    // ─── Verify ──────────────────────────────────────────────────────────────

    public boolean verify(String phone, String code) {
        Optional<OtpCode> otpOpt = otpRepository
                .findTopByPhoneAndUsedFalseAndExpiresAtAfterOrderByCreatedAtDesc(
                        phone, LocalDateTime.now());

        if (otpOpt.isEmpty()) return false;

        OtpCode otp = otpOpt.get();
        if (!otp.getCode().equals(code)) return false;

        otp.setUsed(true);
        otpRepository.save(otp);
        return true;
    }

    // ─── Telegram ────────────────────────────────────────────────────────────

    private void sendViaTelegram(String code, String phone, SiteSettings settings) {
        String botToken = settings.getTelegramBotToken();
        String chatId   = settings.getTelegramChatId();

        if (botToken == null || botToken.isBlank() || chatId == null || chatId.isBlank()) {
            log.warn("⚠️ Telegram OTP not configured (botToken or chatId missing). Falling back to log.");
            log.info("📨 OTP for {} → {}", phone, code);
            return;
        }

        try {
            String message = String.format("🔐 کد تأیید شما: *%s*\n\n📱 شماره: %s\n⏱ اعتبار: %d ثانیه",
                    code, phone, expirationSeconds);

            String url = String.format(
                    "https://api.telegram.org/bot%s/sendMessage?chat_id=%s&text=%s&parse_mode=Markdown",
                    botToken,
                    chatId,
                    java.net.URLEncoder.encode(message, java.nio.charset.StandardCharsets.UTF_8)
            );

            RestTemplate restTemplate = new RestTemplate();
            restTemplate.getForObject(url, String.class);
            log.info("✅ Telegram OTP sent for {}", phone);
        } catch (Exception e) {
            log.error("❌ Failed to send Telegram OTP for {}: {}", phone, e.getMessage());
            // Fallback: log code so dev can still test
            log.info("📨 Fallback OTP for {} → {}", phone, code);
        }
    }

    // ─── SMS (Kavenegar stub) ─────────────────────────────────────────────────

    private void sendViaSms(String code, String phone, SiteSettings settings) {
        // TODO: integrate with Kavenegar or other provider using settings.getSmsApiKey()
        log.info("📨 [SMS] OTP for {} → {}", phone, code);
    }

    // ─── Helper ──────────────────────────────────────────────────────────────

    private String generateCode() {
        Random rand = new Random();
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < otpLength; i++) {
            sb.append(rand.nextInt(10));
        }
        return sb.toString();
    }
}

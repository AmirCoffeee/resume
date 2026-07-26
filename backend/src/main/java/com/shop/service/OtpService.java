package com.shop.service;

import com.shop.entity.OtpCode;
import com.shop.repository.OtpRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;

@Service
@RequiredArgsConstructor
@Slf4j
public class OtpService {

    private final OtpRepository otpRepository;

    @Value("${app.otp.expiration}")
    private int expirationSeconds;

    @Value("${app.otp.length}")
    private int otpLength;

    public String generateAndSend(String phone) {
        // Invalidate previous OTPs
        otpRepository.invalidateAllByPhone(phone);

        String code = generateCode();
        OtpCode otp = new OtpCode();
        otp.setPhone(phone);
        otp.setCode(code);
        otp.setExpiresAt(LocalDateTime.now().plusSeconds(expirationSeconds));
        otpRepository.save(otp);

        // TODO: Integrate with Kavenegar or other SMS provider
        // For now, log to console (dev mode)
        log.info("OTP for {}: {}", phone, code);

        return code; // Remove this in production
    }

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

    private String generateCode() {
        Random rand = new Random();
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < otpLength; i++) {
            sb.append(rand.nextInt(10));
        }
        return sb.toString();
    }
}

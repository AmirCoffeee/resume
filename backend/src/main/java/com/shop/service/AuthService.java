package com.shop.service;

import com.shop.entity.SiteSettings;
import com.shop.entity.User;
import com.shop.repository.SiteSettingsRepository;
import com.shop.repository.UserRepository;
import com.shop.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final SiteSettingsRepository settingsRepository;
    private final OtpService otpService;
    private final JwtUtil jwtUtil;

    // ─── OTP Auth (regular users) ─────────────────────────────────────────────

    public String sendOtp(String phone) {
        return otpService.generateAndSend(phone);
    }

    public String verifyOtp(String phone, String code) {
        if (!otpService.verify(phone, code)) {
            throw new RuntimeException("کد OTP نادرست یا منقضی شده است");
        }

        User user = userRepository.findByPhone(phone)
                .orElseGet(() -> {
                    User newUser = new User();
                    newUser.setPhone(phone);
                    return userRepository.save(newUser);
                });

        return jwtUtil.generateToken(phone, user.getRole().name());
    }

    // ─── Admin Login (username + password + secret path) ─────────────────────

    /**
     * Validates the secret path, then checks username+password against the stored admin.
     * Throws RuntimeException (which the controller maps to 401) on any failure.
     */
    public String adminLogin(String path, String username, String password) {
        // 1. Validate secret path
        SiteSettings settings = settingsRepository.findAll().stream()
                .findFirst()
                .orElseThrow(() -> new RuntimeException("تنظیمات یافت نشد"));

        if (settings.getAdminLoginPath() == null
                || !settings.getAdminLoginPath().equals(path)) {
            throw new RuntimeException("مسیر نادرست");
        }

        // 2. Find admin by username
        User admin = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("کاربر یافت نشد"));

        if (admin.getRole() != User.Role.ADMIN) {
            throw new RuntimeException("دسترسی ندارید");
        }

        if (!admin.isActive()) {
            throw new RuntimeException("حساب غیرفعال است");
        }

        // 3. Check password
        if (admin.getPasswordHash() == null
                || !BCrypt.checkpw(password, admin.getPasswordHash())) {
            throw new RuntimeException("رمز عبور نادرست");
        }

        return jwtUtil.generateToken(admin.getPhone(), admin.getRole().name());
    }

    // ─── Profile ─────────────────────────────────────────────────────────────

    public User getCurrentUser(String phone) {
        return userRepository.findByPhone(phone)
                .orElseThrow(() -> new RuntimeException("کاربر یافت نشد"));
    }

    public User updateProfile(String phone, User.Role role, String firstName,
                               String lastName, String email, String address) {
        User user = getCurrentUser(phone);
        if (firstName != null) user.setFirstName(firstName);
        if (lastName != null) user.setLastName(lastName);
        if (email != null) user.setEmail(email);
        if (address != null) user.setAddress(address);
        return userRepository.save(user);
    }
}

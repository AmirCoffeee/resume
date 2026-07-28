package com.shop.controller;

import com.shop.entity.User;
import com.shop.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    // ─── OTP (regular users) ─────────────────────────────────────────────────

    @PostMapping("/send-otp")
    public ResponseEntity<?> sendOtp(@RequestBody Map<String, String> body) {
        String phone = body.get("phone");
        if (phone == null || !phone.matches("^09[0-9]{9}$")) {
            return ResponseEntity.badRequest().body(Map.of("message", "شماره موبایل نادرست است"));
        }
        authService.sendOtp(phone);
        return ResponseEntity.ok(Map.of("message", "کد OTP ارسال شد"));
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody Map<String, String> body) {
        try {
            String token = authService.verifyOtp(body.get("phone"), body.get("code"));
            return ResponseEntity.ok(Map.of("token", token));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    // ─── Admin Login (username + password + secret path) ─────────────────────

    /**
     * POST /api/auth/admin/{path}
     * The {path} must match the 20-char random adminLoginPath stored in SiteSettings.
     * Body: { "username": "...", "password": "..." }
     */
    @PostMapping("/admin/{path}")
    public ResponseEntity<?> adminLogin(
            @PathVariable String path,
            @RequestBody Map<String, String> body) {
        try {
            String token = authService.adminLogin(path, body.get("username"), body.get("password"));
            return ResponseEntity.ok(Map.of("token", token));
        } catch (RuntimeException e) {
            // Return 401 for any failure — don't leak info about what went wrong
            return ResponseEntity.status(401).body(Map.of("message", "اطلاعات ورود نادرست است"));
        }
    }

    // ─── Profile ─────────────────────────────────────────────────────────────

    @GetMapping("/me")
    public ResponseEntity<?> me(Authentication auth) {
        User user = authService.getCurrentUser(auth.getName());
        return ResponseEntity.ok(user);
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(Authentication auth,
                                            @RequestBody Map<String, String> body) {
        User user = authService.updateProfile(
                auth.getName(), null,
                body.get("firstName"), body.get("lastName"),
                body.get("email"), body.get("address"));
        return ResponseEntity.ok(user);
    }
}

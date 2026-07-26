package com.shop.service;

import com.shop.entity.User;
import com.shop.repository.UserRepository;
import com.shop.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final OtpService otpService;
    private final JwtUtil jwtUtil;

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

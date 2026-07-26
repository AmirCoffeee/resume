package com.shop.repository;

import com.shop.entity.OtpCode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.Optional;

public interface OtpRepository extends JpaRepository<OtpCode, Long> {
    Optional<OtpCode> findTopByPhoneAndUsedFalseAndExpiresAtAfterOrderByCreatedAtDesc(
            String phone, LocalDateTime now);

    @Modifying
    @Transactional
    @Query("UPDATE OtpCode o SET o.used = true WHERE o.phone = :phone")
    void invalidateAllByPhone(String phone);
}

package com.shop.repository;

import com.shop.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {
    Page<Product> findByActiveTrue(Pageable pageable);
    Page<Product> findByCategoryIdAndActiveTrue(Long categoryId, Pageable pageable);
    List<Product> findByFeaturedTrueAndActiveTrue();

    @Query("SELECT p FROM Product p WHERE p.active = true AND " +
           "(LOWER(p.nameFA) LIKE LOWER(CONCAT('%', :q, '%')) OR " +
           "LOWER(p.nameEN) LIKE LOWER(CONCAT('%', :q, '%')))")
    Page<Product> search(@Param("q") String query, Pageable pageable);
}

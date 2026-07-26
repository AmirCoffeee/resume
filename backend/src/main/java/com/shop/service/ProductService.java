package com.shop.service;

import com.shop.entity.Product;
import com.shop.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;

    public Page<Product> getAll(int page, int size, String sort) {
        Sort s = sort.equals("price_asc") ? Sort.by("price").ascending()
                : sort.equals("price_desc") ? Sort.by("price").descending()
                : Sort.by("createdAt").descending();
        return productRepository.findByActiveTrue(PageRequest.of(page, size, s));
    }

    public Page<Product> getByCategory(Long categoryId, int page, int size) {
        return productRepository.findByCategoryIdAndActiveTrue(
                categoryId, PageRequest.of(page, size, Sort.by("createdAt").descending()));
    }

    public List<Product> getFeatured() {
        return productRepository.findByFeaturedTrueAndActiveTrue();
    }

    public Page<Product> search(String query, int page, int size) {
        return productRepository.search(query, PageRequest.of(page, size));
    }

    public Product getById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("محصول یافت نشد"));
    }

    public Product save(Product product) {
        return productRepository.save(product);
    }

    public void delete(Long id) {
        Product p = getById(id);
        p.setActive(false);
        productRepository.save(p);
    }

    public Page<Product> getAllAdmin(int page, int size) {
        return productRepository.findAll(PageRequest.of(page, size, Sort.by("createdAt").descending()));
    }
}

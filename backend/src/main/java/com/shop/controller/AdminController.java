package com.shop.controller;

import com.shop.entity.*;
import com.shop.repository.*;
import com.shop.service.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final ProductService productService;
    private final OrderService orderService;
    private final SiteSettingsService settingsService;
    private final CategoryRepository categoryRepository;
    private final MenuItemRepository menuItemRepository;
    private final BannerRepository bannerRepository;
    private final UserRepository userRepository;
    private final FileUploadService fileUploadService;

    // ===== DASHBOARD =====
    @GetMapping("/dashboard")
    public ResponseEntity<?> dashboard() {
        long totalProducts = productService.getAllAdmin(0, 1).getTotalElements();
        long totalOrders = orderService.getAllAdmin(0, 1).getTotalElements();
        long totalUsers = userRepository.count();
        long pendingOrders = orderService.getAllAdmin(0, 1000).getContent()
                .stream().filter(o -> o.getStatus() == Order.OrderStatus.PENDING).count();

        return ResponseEntity.ok(Map.of(
                "totalProducts", totalProducts,
                "totalOrders", totalOrders,
                "totalUsers", totalUsers,
                "pendingOrders", pendingOrders
        ));
    }

    // ===== PRODUCTS =====
    @GetMapping("/products")
    public ResponseEntity<Page<Product>> getProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(productService.getAllAdmin(page, size));
    }

    @PostMapping("/products")
    public ResponseEntity<Product> createProduct(@RequestBody Product product) {
        return ResponseEntity.ok(productService.save(product));
    }

    @PutMapping("/products/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable Long id,
                                                   @RequestBody Product product) {
        product.setId(id);
        return ResponseEntity.ok(productService.save(product));
    }

    @DeleteMapping("/products/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id) {
        productService.delete(id);
        return ResponseEntity.ok(Map.of("message", "محصول حذف شد"));
    }

    // ===== CATEGORIES =====
    @GetMapping("/categories")
    public ResponseEntity<List<Category>> getCategories() {
        return ResponseEntity.ok(categoryRepository.findByActiveTrueOrderBySortOrder());
    }

    @PostMapping("/categories")
    public ResponseEntity<Category> createCategory(@RequestBody Category category) {
        return ResponseEntity.ok(categoryRepository.save(category));
    }

    @PutMapping("/categories/{id}")
    public ResponseEntity<Category> updateCategory(@PathVariable Long id,
                                                     @RequestBody Category category) {
        category.setId(id);
        return ResponseEntity.ok(categoryRepository.save(category));
    }

    @DeleteMapping("/categories/{id}")
    public ResponseEntity<?> deleteCategory(@PathVariable Long id) {
        categoryRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "دسته‌بندی حذف شد"));
    }

    // ===== ORDERS =====
    @GetMapping("/orders")
    public ResponseEntity<Page<Order>> getOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(orderService.getAllAdmin(page, size));
    }

    @PutMapping("/orders/{id}/status")
    public ResponseEntity<Order> updateOrderStatus(@PathVariable Long id,
                                                     @RequestBody Map<String, String> body) {
        Order.OrderStatus status = Order.OrderStatus.valueOf(body.get("status"));
        return ResponseEntity.ok(orderService.updateStatus(id, status));
    }

    // ===== USERS =====
    @GetMapping("/users")
    public ResponseEntity<Page<User>> getUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(userRepository.findAll(
                PageRequest.of(page, size, Sort.by("createdAt").descending())));
    }

    @PutMapping("/users/{id}/role")
    public ResponseEntity<User> updateUserRole(@PathVariable Long id,
                                                 @RequestBody Map<String, String> body) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("کاربر یافت نشد"));
        user.setRole(User.Role.valueOf(body.get("role")));
        return ResponseEntity.ok(userRepository.save(user));
    }

    // ===== SETTINGS =====
    @GetMapping("/settings")
    public ResponseEntity<SiteSettings> getSettings() {
        return ResponseEntity.ok(settingsService.get());
    }

    @PutMapping("/settings")
    public ResponseEntity<SiteSettings> updateSettings(@RequestBody SiteSettings settings) {
        return ResponseEntity.ok(settingsService.update(settings));
    }

    // ===== MENU =====
    @GetMapping("/menu")
    public ResponseEntity<List<MenuItem>> getMenu() {
        return ResponseEntity.ok(menuItemRepository.findAll());
    }

    @PostMapping("/menu")
    public ResponseEntity<MenuItem> createMenuItem(@RequestBody MenuItem item) {
        return ResponseEntity.ok(menuItemRepository.save(item));
    }

    @PutMapping("/menu/{id}")
    public ResponseEntity<MenuItem> updateMenuItem(@PathVariable Long id,
                                                     @RequestBody MenuItem item) {
        item.setId(id);
        return ResponseEntity.ok(menuItemRepository.save(item));
    }

    @DeleteMapping("/menu/{id}")
    public ResponseEntity<?> deleteMenuItem(@PathVariable Long id) {
        menuItemRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "آیتم منو حذف شد"));
    }

    // ===== BANNERS =====
    @GetMapping("/banners")
    public ResponseEntity<List<Banner>> getBanners() {
        return ResponseEntity.ok(bannerRepository.findAll());
    }

    @PostMapping("/banners")
    public ResponseEntity<Banner> createBanner(@RequestBody Banner banner) {
        return ResponseEntity.ok(bannerRepository.save(banner));
    }

    @PutMapping("/banners/{id}")
    public ResponseEntity<Banner> updateBanner(@PathVariable Long id,
                                                 @RequestBody Banner banner) {
        banner.setId(id);
        return ResponseEntity.ok(bannerRepository.save(banner));
    }

    @DeleteMapping("/banners/{id}")
    public ResponseEntity<?> deleteBanner(@PathVariable Long id) {
        bannerRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "بنر حذف شد"));
    }

    // ===== FILE UPLOAD =====
    @PostMapping("/upload")
    public ResponseEntity<?> upload(@RequestParam("file") MultipartFile file) throws IOException {
        String url = fileUploadService.upload(file);
        return ResponseEntity.ok(Map.of("url", url));
    }
}

package com.shop.service;

import com.shop.entity.*;
import com.shop.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    @Transactional
    public Order createOrder(String userPhone, List<Map<String, Object>> cartItems,
                              String address, String receiverName, String receiverPhone) {
        User user = userRepository.findByPhone(userPhone)
                .orElseThrow(() -> new RuntimeException("کاربر یافت نشد"));

        Order order = new Order();
        order.setUser(user);
        order.setShippingAddress(address);
        order.setReceiverName(receiverName);
        order.setReceiverPhone(receiverPhone);

        BigDecimal total = BigDecimal.ZERO;
        Order savedOrder = orderRepository.save(order);

        for (Map<String, Object> item : cartItems) {
            Long productId = Long.valueOf(item.get("productId").toString());
            int qty = Integer.parseInt(item.get("quantity").toString());

            Product product = productRepository.findById(productId)
                    .orElseThrow(() -> new RuntimeException("محصول یافت نشد"));

            if (product.getStock() < qty) {
                throw new RuntimeException("موجودی کافی نیست: " + product.getNameFA());
            }

            BigDecimal price = product.getDiscountPrice() != null
                    ? product.getDiscountPrice() : product.getPrice();

            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(savedOrder);
            orderItem.setProduct(product);
            orderItem.setQuantity(qty);
            orderItem.setUnitPrice(price);
            orderItem.setTotalPrice(price.multiply(BigDecimal.valueOf(qty)));
            total = total.add(orderItem.getTotalPrice());

            product.setStock(product.getStock() - qty);
            productRepository.save(product);
        }

        savedOrder.setTotalAmount(total);
        savedOrder.setFinalAmount(total);
        return orderRepository.save(savedOrder);
    }

    public Order getById(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("سفارش یافت نشد"));
    }

    public List<Order> getUserOrders(Long userId) {
        return orderRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public Page<Order> getAllAdmin(int page, int size) {
        return orderRepository.findAllByOrderByCreatedAtDesc(PageRequest.of(page, size));
    }

    public Order updateStatus(Long orderId, Order.OrderStatus status) {
        Order order = getById(orderId);
        order.setStatus(status);
        order.setUpdatedAt(LocalDateTime.now());
        return orderRepository.save(order);
    }

    public Order confirmPayment(Long orderId, String refId, String gateway) {
        Order order = getById(orderId);
        order.setStatus(Order.OrderStatus.PAID);
        order.setPaymentRefId(refId);
        order.setPaymentGateway(gateway);
        order.setUpdatedAt(LocalDateTime.now());
        return orderRepository.save(order);
    }
}

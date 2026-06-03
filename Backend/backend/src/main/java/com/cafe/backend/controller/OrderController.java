package com.cafe.backend.controller;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cafe.backend.entity.Order;
import com.cafe.backend.entity.OrderItem;
import com.cafe.backend.entity.Product;
import com.cafe.backend.entity.User;
import com.cafe.backend.repository.OrderRepository;
import com.cafe.backend.repository.ProductRepository;
import com.cafe.backend.repository.UserRepository;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    // Temporary fix - get first user (since auth is disabled)
    private User getCurrentUser() {
        List<User> users = userRepository.findAll();
        if (users.isEmpty()) {
            return null;
        }
        return users.get(0);
    }

    @PostMapping("/create")
    public ResponseEntity<?> createOrder(@RequestBody Map<String, Object> request) {
        try {
            User user = getCurrentUser();
            if (user == null) {
                return ResponseEntity.status(401).body("No user found. Please register first.");
            }

            Order order = new Order();
            order.setUserId(user.getId());
            order.setStatus("PENDING");
            order.setOrderTime(LocalDateTime.now());

            @SuppressWarnings("unchecked")
            List<Map<String, Integer>> itemsList = (List<Map<String, Integer>>) request.get("items");
            
            if (itemsList == null || itemsList.isEmpty()) {
                return ResponseEntity.badRequest().body("No items in order");
            }
            
            BigDecimal total = BigDecimal.ZERO;

            for (Map<String, Integer> itemMap : itemsList) {
                Long productId = itemMap.get("productId").longValue();
                Integer quantity = itemMap.get("quantity");

                Optional<Product> productOpt = productRepository.findById(productId);
                if (productOpt.isEmpty()) {
                    return ResponseEntity.badRequest().body("Product not found: " + productId);
                }
                
                Product product = productOpt.get();

                OrderItem orderItem = new OrderItem();
                orderItem.setProductName(product.getName());
                orderItem.setQuantity(quantity);
                orderItem.setUnitPrice(product.getPrice());
                orderItem.setSubtotal(product.getPrice().multiply(BigDecimal.valueOf(quantity)));
                orderItem.setOrder(order);

                order.getItems().add(orderItem);
                total = total.add(orderItem.getSubtotal());
            }

            order.setTotalAmount(total);
            Order savedOrder = orderRepository.save(order);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("orderId", savedOrder.getId());
            response.put("orderNumber", savedOrder.getOrderNumber());
            response.put("totalAmount", savedOrder.getTotalAmount());
            
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/my-orders")
    public ResponseEntity<?> getMyOrders() {
        try {
            User user = getCurrentUser();
            if (user == null) {
                return ResponseEntity.ok(new ArrayList<>());
            }
            
            List<Order> orders = orderRepository.findByUserId(user.getId());
            
            List<Map<String, Object>> result = new ArrayList<>();
            for (Order order : orders) {
                Map<String, Object> orderMap = new HashMap<>();
                orderMap.put("id", order.getId());
                orderMap.put("orderNumber", order.getOrderNumber());
                orderMap.put("totalAmount", order.getTotalAmount());
                orderMap.put("status", order.getStatus());
                orderMap.put("orderTime", order.getOrderTime());
                
                List<Map<String, Object>> itemsList = new ArrayList<>();
                for (OrderItem item : order.getItems()) {
                    Map<String, Object> itemMap = new HashMap<>();
                    itemMap.put("productName", item.getProductName());
                    itemMap.put("quantity", item.getQuantity());
                    itemMap.put("price", item.getUnitPrice());
                    itemMap.put("subtotal", item.getSubtotal());
                    itemsList.add(itemMap);
                }
                orderMap.put("items", itemsList);
                result.add(orderMap);
            }
            
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.ok(new ArrayList<>());
        }
    }
}
package com.cafe.backend.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cafe.backend.entity.User;
import com.cafe.backend.repository.UserRepository;
import com.cafe.backend.service.JwtService;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            if (userRepository.existsByEmail(user.getEmail())) {
                response.put("error", "Email already exists");
                return ResponseEntity.badRequest().body(response);
            }
            
            user.setPassword(passwordEncoder.encode(user.getPassword()));
            if (user.getRole() == null) {
                user.setRole("USER");
            }
            user.setIsActive(true);
            
            User savedUser = userRepository.save(user);
            
            response.put("message", "User registered successfully");
            response.put("userId", savedUser.getId());
            response.put("role", savedUser.getRole());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("error", e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            String email = request.get("email");
            String password = request.get("password");
            
            User user = userRepository.findByEmail(email).orElse(null);
            
            if (user == null) {
                response.put("error", "Invalid email or password");
                return ResponseEntity.status(401).body(response);
            }
            
            if (!passwordEncoder.matches(password, user.getPassword())) {
                response.put("error", "Invalid email or password");
                return ResponseEntity.status(401).body(response);
            }
            
            String token = jwtService.generateToken(user.getEmail());
            
            response.put("token", token);
            response.put("email", user.getEmail());
            response.put("role", user.getRole());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("error", e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
}
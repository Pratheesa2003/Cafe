package com.cafe.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class BackendApplication {
    public static void main(String[] args) {
        SpringApplication.run(BackendApplication.class, args);
        System.out.println("=========================================");
        System.out.println("☕ Cafe Management System Started!");
        System.out.println("📱 API: http://localhost:8081");
        System.out.println("=========================================");
    }
}
package com.cafe.backend.repository;

import com.cafe.backend.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByCategory(String category);
    List<Product> findByIsAvailableTrue();
    List<Product> findByStockQuantityLessThan(Integer threshold);
}
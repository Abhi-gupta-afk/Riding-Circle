package com.ridecircle.repository;

import com.ridecircle.entity.Food;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FoodRepository extends JpaRepository<Food, Long> {
    
    List<Food> findByIsActiveTrue();
    
    List<Food> findByCategoryAndIsActiveTrue(String category);
    
    List<Food> findByCuisineAndIsActiveTrue(String cuisine);
    
    List<Food> findByIsVegetarianTrueAndIsActiveTrue();
    
    List<Food> findByIsVeganTrueAndIsActiveTrue();
    
    @Query("SELECT f FROM Food f WHERE f.name LIKE %:name% AND f.isActive = true")
    List<Food> findByNameContainingIgnoreCaseAndIsActiveTrue(@Param("name") String name);
    
    @Query("SELECT DISTINCT f.category FROM Food f WHERE f.isActive = true ORDER BY f.category")
    List<String> findDistinctCategories();
    
    @Query("SELECT DISTINCT f.cuisine FROM Food f WHERE f.isActive = true ORDER BY f.cuisine")
    List<String> findDistinctCuisines();
}

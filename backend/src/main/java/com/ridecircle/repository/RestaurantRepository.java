package com.ridecircle.repository;

import com.ridecircle.entity.Restaurant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RestaurantRepository extends JpaRepository<Restaurant, Long> {
    
    List<Restaurant> findByIsActiveTrue();
    
    List<Restaurant> findByCityAndIsActiveTrue(String city);
    
    List<Restaurant> findByCuisineAndIsActiveTrue(String cuisine);
    
    List<Restaurant> findByIsVegetarianFriendlyTrueAndIsActiveTrue();
    
    List<Restaurant> findByIsVeganFriendlyTrueAndIsActiveTrue();
    
    List<Restaurant> findByAcceptsReservationsTrueAndIsActiveTrue();
    
    @Query("SELECT r FROM Restaurant r WHERE r.name LIKE %:name% AND r.isActive = true")
    List<Restaurant> findByNameContainingIgnoreCaseAndIsActiveTrue(@Param("name") String name);
    
    @Query("SELECT r FROM Restaurant r WHERE r.rating >= :minRating AND r.isActive = true ORDER BY r.rating DESC")
    List<Restaurant> findByRatingGreaterThanEqualAndIsActiveTrueOrderByRatingDesc(@Param("minRating") Double minRating);
    
    @Query("SELECT DISTINCT r.city FROM Restaurant r WHERE r.isActive = true ORDER BY r.city")
    List<String> findDistinctCities();
    
    @Query("SELECT DISTINCT r.cuisine FROM Restaurant r WHERE r.isActive = true ORDER BY r.cuisine")
    List<String> findDistinctCuisines();
}

package com.ridecircle.repository;

import com.ridecircle.entity.SubscriptionPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository interface for SubscriptionPlan entity
 * Provides database operations for subscription plans
 */
@Repository
public interface SubscriptionPlanRepository extends JpaRepository<SubscriptionPlan, Long> {
    
    /**
     * Find subscription plan by name (FREE, PREMIUM, ENTERPRISE)
     */
    Optional<SubscriptionPlan> findByName(String name);
    
    /**
     * Find subscription plan by display name
     */
    Optional<SubscriptionPlan> findByDisplayName(String displayName);
    
    /**
     * Get all active subscription plans
     */
    List<SubscriptionPlan> findByIsActiveTrue();
    
    /**
     * Get all plans ordered by price ascending
     */
    @Query("SELECT sp FROM SubscriptionPlan sp WHERE sp.isActive = true ORDER BY sp.price ASC")
    List<SubscriptionPlan> findAllActivePlansOrderByPrice();
    
    /**
     * Check if a plan exists by name
     */
    boolean existsByName(String name);
}

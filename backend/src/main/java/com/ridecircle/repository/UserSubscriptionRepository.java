package com.ridecircle.repository;

import com.ridecircle.entity.UserSubscription;
import com.ridecircle.entity.UserSubscription.SubscriptionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Repository interface for UserSubscription entity
 * Provides database operations for user subscriptions
 */
@Repository
public interface UserSubscriptionRepository extends JpaRepository<UserSubscription, Long> {
    
    /**
     * Find current active subscription for a user
     */
    @Query("SELECT us FROM UserSubscription us WHERE us.userId = :userId " +
           "AND us.status = 'ACTIVE' AND us.endDate > :currentDate " +
           "ORDER BY us.endDate DESC")
    Optional<UserSubscription> findActiveSubscriptionByUserId(@Param("userId") Long userId, 
                                                              @Param("currentDate") LocalDateTime currentDate);
    
    /**
     * Find the latest subscription for a user (active or expired)
     */
    @Query("SELECT us FROM UserSubscription us WHERE us.userId = :userId " +
           "ORDER BY us.createdAt DESC")
    Optional<UserSubscription> findLatestSubscriptionByUserId(@Param("userId") Long userId);
    
    /**
     * Find all subscriptions for a user
     */
    List<UserSubscription> findByUserIdOrderByCreatedAtDesc(Long userId);
    
    /**
     * Find subscriptions by status
     */
    List<UserSubscription> findByStatus(SubscriptionStatus status);
    
    /**
     * Find expired subscriptions that need status update
     */
    @Query("SELECT us FROM UserSubscription us WHERE us.status = 'ACTIVE' " +
           "AND us.endDate < :currentDate")
    List<UserSubscription> findExpiredActiveSubscriptions(@Param("currentDate") LocalDateTime currentDate);
    
    /**
     * Check if user has any active subscription
     */
    @Query("SELECT COUNT(us) > 0 FROM UserSubscription us WHERE us.userId = :userId " +
           "AND us.status = 'ACTIVE' AND us.endDate > :currentDate")
    boolean hasActiveSubscription(@Param("userId") Long userId, 
                                  @Param("currentDate") LocalDateTime currentDate);
    
    /**
     * Find subscription by payment ID
     */
    Optional<UserSubscription> findByPaymentId(String paymentId);
    
    /**
     * Find subscription by transaction ID
     */
    Optional<UserSubscription> findByTransactionId(String transactionId);
}

package com.ridecircle.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

/**
 * Entity to track user's current subscription plan and status
 * Links users to their active subscription plan with expiry tracking
 */
@Entity
@Table(name = "user_subscriptions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserSubscription {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private Long userId; // Reference to User entity
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "plan_id", nullable = false)
    private SubscriptionPlan plan;
    
    @Column(nullable = false)
    private LocalDateTime startDate; // When subscription started
    
    @Column(nullable = false)
    private LocalDateTime endDate; // When subscription expires
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SubscriptionStatus status; // ACTIVE, EXPIRED, CANCELLED
    
    @Column
    private String paymentId; // Mock payment reference ID
    
    @Column
    private String transactionId; // Transaction reference from payment gateway
    
    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @Column(nullable = false)
    private LocalDateTime updatedAt = LocalDateTime.now();
    
    // Subscription status enum
    public enum SubscriptionStatus {
        ACTIVE,
        EXPIRED,
        CANCELLED,
        PENDING
    }
    
    public UserSubscription(Long userId, SubscriptionPlan plan, LocalDateTime startDate, LocalDateTime endDate) {
        this.userId = userId;
        this.plan = plan;
        this.startDate = startDate;
        this.endDate = endDate;
        this.status = SubscriptionStatus.ACTIVE;
    }
    
    // Helper method to check if subscription is currently active
    public boolean isActive() {
        return status == SubscriptionStatus.ACTIVE && 
               LocalDateTime.now().isBefore(endDate);
    }
    
    // Helper method to check if subscription is expired
    public boolean isExpired() {
        return LocalDateTime.now().isAfter(endDate) || 
               status == SubscriptionStatus.EXPIRED;
    }
    
    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}

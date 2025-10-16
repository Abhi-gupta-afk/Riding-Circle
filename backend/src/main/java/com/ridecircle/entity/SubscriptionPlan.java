package com.ridecircle.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

/**
 * Entity representing subscription plans (Free, Premium, Enterprise)
 * Stores plan details including pricing, features, and duration
 */
@Entity
@Table(name = "subscription_plans")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SubscriptionPlan {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true)
    private String name; // FREE, PREMIUM, ENTERPRISE
    
    @Column(nullable = false)
    private String displayName; // "Free Plan", "Premium Plan", "Enterprise Plan"
    
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price; // Monthly price
    
    @Column(nullable = false)
    private Integer durationDays; // Plan duration in days
    
    @Column(columnDefinition = "TEXT")
    private String description; // Plan description
    
    // Plan features stored as JSON array or separate entity
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "plan_features", joinColumns = @JoinColumn(name = "plan_id"))
    @Column(name = "feature")
    private List<String> features;
    
    // Limitations for each plan
    @Column(nullable = false)
    private Integer maxTrips; // Maximum trips user can create
    
    @Column(nullable = false)
    private Integer maxClubs; // Maximum clubs user can join
    
    @Column(nullable = false)
    private Boolean hasAnalytics; // Analytics dashboard access
    
    @Column(nullable = false)
    private Boolean hasPrioritySupport; // Priority customer support
    
    @Column(nullable = false)
    private Boolean hasAdvancedFilters; // Advanced search filters
    
    @Column(nullable = false)
    private Boolean isActive; // Plan is currently available
    
    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @Column(nullable = false)
    private LocalDateTime updatedAt = LocalDateTime.now();
    
    public SubscriptionPlan(String name, String displayName, BigDecimal price, 
                           Integer durationDays, String description) {
        this.name = name;
        this.displayName = displayName;
        this.price = price;
        this.durationDays = durationDays;
        this.description = description;
    }
    
    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}

package com.ridecircle.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Entity representing subscription plans (Free, Premium, Enterprise)
 * Stores plan details including pricing, features, and duration
 */
@Entity
@Table(name = "subscription_plans")
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
    private LocalDateTime createdAt;
    
    @Column(nullable = false)
    private LocalDateTime updatedAt;
    
    // Constructors
    public SubscriptionPlan() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
    
    public SubscriptionPlan(String name, String displayName, BigDecimal price, 
                           Integer durationDays, String description) {
        this();
        this.name = name;
        this.displayName = displayName;
        this.price = price;
        this.durationDays = durationDays;
        this.description = description;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getDisplayName() { return displayName; }
    public void setDisplayName(String displayName) { this.displayName = displayName; }
    
    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }
    
    public Integer getDurationDays() { return durationDays; }
    public void setDurationDays(Integer durationDays) { this.durationDays = durationDays; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public List<String> getFeatures() { return features; }
    public void setFeatures(List<String> features) { this.features = features; }
    
    public Integer getMaxTrips() { return maxTrips; }
    public void setMaxTrips(Integer maxTrips) { this.maxTrips = maxTrips; }
    
    public Integer getMaxClubs() { return maxClubs; }
    public void setMaxClubs(Integer maxClubs) { this.maxClubs = maxClubs; }
    
    public Boolean getHasAnalytics() { return hasAnalytics; }
    public void setHasAnalytics(Boolean hasAnalytics) { this.hasAnalytics = hasAnalytics; }
    
    public Boolean getHasPrioritySupport() { return hasPrioritySupport; }
    public void setHasPrioritySupport(Boolean hasPrioritySupport) { this.hasPrioritySupport = hasPrioritySupport; }
    
    public Boolean getHasAdvancedFilters() { return hasAdvancedFilters; }
    public void setHasAdvancedFilters(Boolean hasAdvancedFilters) { this.hasAdvancedFilters = hasAdvancedFilters; }
    
    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    
    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}

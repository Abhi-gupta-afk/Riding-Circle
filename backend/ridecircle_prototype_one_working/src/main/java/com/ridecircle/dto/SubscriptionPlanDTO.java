package com.ridecircle.dto;

import java.math.BigDecimal;
import java.util.List;

/**
 * DTO for subscription plan information
 * Used for API responses when sending plan details to frontend
 */
public class SubscriptionPlanDTO {
    
    private Long id;
    private String name;
    private String displayName;
    private BigDecimal price;
    private Integer durationDays;
    private String description;
    private List<String> features;
    private Integer maxTrips;
    private Integer maxClubs;
    private Boolean hasAnalytics;
    private Boolean hasPrioritySupport;
    private Boolean hasAdvancedFilters;
    private Boolean isActive;
    private Boolean isPopular; // Highlight popular plans
    private String badge; // "Most Popular", "Best Value", etc.
    
    // Constructors
    public SubscriptionPlanDTO() {}
    
    public SubscriptionPlanDTO(Long id, String name, String displayName, BigDecimal price,
                              Integer durationDays, String description, List<String> features) {
        this.id = id;
        this.name = name;
        this.displayName = displayName;
        this.price = price;
        this.durationDays = durationDays;
        this.description = description;
        this.features = features;
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
    
    public Boolean getIsPopular() { return isPopular; }
    public void setIsPopular(Boolean isPopular) { this.isPopular = isPopular; }
    
    public String getBadge() { return badge; }
    public void setBadge(String badge) { this.badge = badge; }
}

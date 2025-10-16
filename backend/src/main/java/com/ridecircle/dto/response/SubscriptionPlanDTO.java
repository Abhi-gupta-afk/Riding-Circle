package com.ridecircle.dto.response;

import java.math.BigDecimal;
import java.util.List;
import lombok.Getter;
import lombok.Setter;

/**
 * DTO for subscription plan information
 * Used for API responses when sending plan details to frontend
 */
@Getter
@Setter
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
    
}

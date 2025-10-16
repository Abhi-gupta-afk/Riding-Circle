package com.ridecircle.dto.response;

import com.ridecircle.entity.UserSubscription.SubscriptionStatus;
import java.time.LocalDateTime;
import lombok.Getter;
import lombok.Setter;

/**
 * DTO for user subscription information
 * Used for API responses when sending user's current subscription details
 */
@Getter
@Setter
public class UserSubscriptionDTO {
    
    private Long id;
    private Long userId;
    private SubscriptionPlanDTO plan;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private SubscriptionStatus status;
    private String paymentId;
    private String transactionId;
    private Boolean isActive;
    private Long daysRemaining;
    
    // Constructors
    public UserSubscriptionDTO() {}
    
    public UserSubscriptionDTO(Long id, Long userId, SubscriptionPlanDTO plan,
                              LocalDateTime startDate, LocalDateTime endDate,
                              SubscriptionStatus status) {
        this.id = id;
        this.userId = userId;
        this.plan = plan;
        this.startDate = startDate;
        this.endDate = endDate;
        this.status = status;
        this.isActive = LocalDateTime.now().isBefore(endDate) && status == SubscriptionStatus.ACTIVE;
        this.daysRemaining = calculateDaysRemaining();
    }
    
    // Helper method to calculate days remaining
    private Long calculateDaysRemaining() {
        if (endDate == null || LocalDateTime.now().isAfter(endDate)) {
            return 0L;
        }
        return java.time.temporal.ChronoUnit.DAYS.between(LocalDateTime.now(), endDate);
    }
    
    // Custom setter to keep daysRemaining in sync when endDate changes
    public void setEndDate(LocalDateTime endDate) {
        this.endDate = endDate;
        this.daysRemaining = calculateDaysRemaining();
    }
}

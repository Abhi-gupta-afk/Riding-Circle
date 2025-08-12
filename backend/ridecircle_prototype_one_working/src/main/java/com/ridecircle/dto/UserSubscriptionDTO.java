package com.ridecircle.dto;

import com.ridecircle.entity.UserSubscription.SubscriptionStatus;
import java.time.LocalDateTime;

/**
 * DTO for user subscription information
 * Used for API responses when sending user's current subscription details
 */
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
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    
    public SubscriptionPlanDTO getPlan() { return plan; }
    public void setPlan(SubscriptionPlanDTO plan) { this.plan = plan; }
    
    public LocalDateTime getStartDate() { return startDate; }
    public void setStartDate(LocalDateTime startDate) { this.startDate = startDate; }
    
    public LocalDateTime getEndDate() { return endDate; }
    public void setEndDate(LocalDateTime endDate) { 
        this.endDate = endDate;
        this.daysRemaining = calculateDaysRemaining();
    }
    
    public SubscriptionStatus getStatus() { return status; }
    public void setStatus(SubscriptionStatus status) { this.status = status; }
    
    public String getPaymentId() { return paymentId; }
    public void setPaymentId(String paymentId) { this.paymentId = paymentId; }
    
    public String getTransactionId() { return transactionId; }
    public void setTransactionId(String transactionId) { this.transactionId = transactionId; }
    
    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }
    
    public Long getDaysRemaining() { return daysRemaining; }
    public void setDaysRemaining(Long daysRemaining) { this.daysRemaining = daysRemaining; }
}

package com.ridecircle.dto;

/**
 * DTO for subscription purchase request
 * Used when user wants to subscribe to a plan
 */
public class SubscriptionRequestDTO {
    
    private Long planId;
    private String paymentMethod; // "RAZORPAY", "STRIPE", "MOCK"
    private String paymentToken; // Payment gateway token
    
    // Constructors
    public SubscriptionRequestDTO() {}
    
    public SubscriptionRequestDTO(Long planId, String paymentMethod, String paymentToken) {
        this.planId = planId;
        this.paymentMethod = paymentMethod;
        this.paymentToken = paymentToken;
    }
    
    // Getters and Setters
    public Long getPlanId() { return planId; }
    public void setPlanId(Long planId) { this.planId = planId; }
    
    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }
    
    public String getPaymentToken() { return paymentToken; }
    public void setPaymentToken(String paymentToken) { this.paymentToken = paymentToken; }
}

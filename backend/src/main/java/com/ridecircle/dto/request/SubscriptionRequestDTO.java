package com.ridecircle.dto.request;

import lombok.Getter;
import lombok.Setter;

/**
 * DTO for subscription purchase request
 * Used when user wants to subscribe to a plan
 */
@Getter
@Setter
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
    
}

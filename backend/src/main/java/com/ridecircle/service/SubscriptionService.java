package com.ridecircle.service;

import com.ridecircle.dto.response.SubscriptionPlanDTO;
import com.ridecircle.dto.request.SubscriptionRequestDTO;
import com.ridecircle.dto.response.UserSubscriptionDTO;
import com.ridecircle.entity.SubscriptionPlan;
import com.ridecircle.entity.UserSubscription;
import com.ridecircle.entity.UserSubscription.SubscriptionStatus;
import com.ridecircle.repository.SubscriptionPlanRepository;
import com.ridecircle.repository.UserSubscriptionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Service class for managing subscription plans and user subscriptions
 * Handles business logic for subscription operations
 */
@Service
@Transactional
public class SubscriptionService {
    
    @Autowired
    private SubscriptionPlanRepository planRepository;
    
    @Autowired
    private UserSubscriptionRepository subscriptionRepository;
    
    @Autowired
    private PaymentService paymentService;
    
    /**
     * Get all available subscription plans
     */
    public List<SubscriptionPlanDTO> getAllPlans() {
        List<SubscriptionPlan> plans = planRepository.findAllActivePlansOrderByPrice();
        return plans.stream()
                   .map(this::convertToDTO)
                   .collect(Collectors.toList());
    }
    
    /**
     * Get subscription plan by ID
     */
    public Optional<SubscriptionPlanDTO> getPlanById(Long planId) {
        return planRepository.findById(planId)
                           .map(this::convertToDTO);
    }
    
    /**
     * Get user's current subscription status
     */
    public UserSubscriptionDTO getUserSubscription(Long userId) {
        // First check for active subscription
        Optional<UserSubscription> activeSubscription = subscriptionRepository
            .findActiveSubscriptionByUserId(userId, LocalDateTime.now());
        
        if (activeSubscription.isPresent()) {
            return convertToSubscriptionDTO(activeSubscription.get());
        }
        
        // If no active subscription, return free plan
        SubscriptionPlan freePlan = getOrCreateFreePlan();
        return createFreeSubscriptionDTO(userId, freePlan);
    }
    
    /**
     * Subscribe user to a plan
     */
    public UserSubscriptionDTO subscribeToPlan(Long userId, SubscriptionRequestDTO request) {
        // Validate plan exists
        SubscriptionPlan plan = planRepository.findById(request.getPlanId())
            .orElseThrow(() -> new RuntimeException("Subscription plan not found"));
        
        // Cancel any existing active subscriptions
        cancelActiveSubscriptions(userId);
        
        // Process payment (mock implementation)
        String paymentId = paymentService.processPayment(plan.getPrice(), request.getPaymentMethod(), request.getPaymentToken());
        
        // Create new subscription
        LocalDateTime startDate = LocalDateTime.now();
        LocalDateTime endDate = startDate.plusDays(plan.getDurationDays());
        
        UserSubscription subscription = new UserSubscription(userId, plan, startDate, endDate);
        subscription.setPaymentId(paymentId);
        subscription.setTransactionId(UUID.randomUUID().toString());
        subscription.setStatus(SubscriptionStatus.ACTIVE);
        
        subscription = subscriptionRepository.save(subscription);
        
        return convertToSubscriptionDTO(subscription);
    }
    
    /**
     * Cancel user's current subscription
     */
    public void cancelSubscription(Long userId) {
        Optional<UserSubscription> activeSubscription = subscriptionRepository
            .findActiveSubscriptionByUserId(userId, LocalDateTime.now());
        
        if (activeSubscription.isPresent()) {
            UserSubscription subscription = activeSubscription.get();
            subscription.setStatus(SubscriptionStatus.CANCELLED);
            subscription.setEndDate(LocalDateTime.now());
            subscriptionRepository.save(subscription);
        }
    }
    
    /**
     * Check if user has access to premium features
     */
    public boolean hasFeatureAccess(Long userId, String feature) {
        UserSubscriptionDTO subscription = getUserSubscription(userId);
        SubscriptionPlanDTO plan = subscription.getPlan();
        
        switch (feature.toUpperCase()) {
            case "ANALYTICS":
                return plan.getHasAnalytics();
            case "PRIORITY_SUPPORT":
                return plan.getHasPrioritySupport();
            case "ADVANCED_FILTERS":
                return plan.getHasAdvancedFilters();
            default:
                return true; // Basic features available to all
        }
    }
    
    /**
     * Check if user can create more trips
     */
    public boolean canCreateTrip(Long userId, int currentTripCount) {
        UserSubscriptionDTO subscription = getUserSubscription(userId);
        return currentTripCount < subscription.getPlan().getMaxTrips();
    }
    
    /**
     * Check if user can join more clubs
     */
    public boolean canJoinClub(Long userId, int currentClubCount) {
        UserSubscriptionDTO subscription = getUserSubscription(userId);
        return currentClubCount < subscription.getPlan().getMaxClubs();
    }
    
    /**
     * Update expired subscriptions (scheduled task)
     */
    public void updateExpiredSubscriptions() {
        List<UserSubscription> expired = subscriptionRepository
            .findExpiredActiveSubscriptions(LocalDateTime.now());
        
        for (UserSubscription subscription : expired) {
            subscription.setStatus(SubscriptionStatus.EXPIRED);
            subscriptionRepository.save(subscription);
        }
    }
    
    // Private helper methods
    
    private void cancelActiveSubscriptions(Long userId) {
        Optional<UserSubscription> activeSubscription = subscriptionRepository
            .findActiveSubscriptionByUserId(userId, LocalDateTime.now());
        
        if (activeSubscription.isPresent()) {
            UserSubscription subscription = activeSubscription.get();
            subscription.setStatus(SubscriptionStatus.CANCELLED);
            subscriptionRepository.save(subscription);
        }
    }
    
    private SubscriptionPlan getOrCreateFreePlan() {
        return planRepository.findByName("FREE")
            .orElseThrow(() -> new RuntimeException("Free plan not found"));
    }
    
    private UserSubscriptionDTO createFreeSubscriptionDTO(Long userId, SubscriptionPlan freePlan) {
        UserSubscriptionDTO dto = new UserSubscriptionDTO();
        dto.setUserId(userId);
        dto.setPlan(convertToDTO(freePlan));
        dto.setStatus(SubscriptionStatus.ACTIVE);
        dto.setIsActive(true);
        dto.setDaysRemaining(999L); // Free plan never expires
        return dto;
    }
    
    private SubscriptionPlanDTO convertToDTO(SubscriptionPlan plan) {
        SubscriptionPlanDTO dto = new SubscriptionPlanDTO();
        dto.setId(plan.getId());
        dto.setName(plan.getName());
        dto.setDisplayName(plan.getDisplayName());
        dto.setPrice(plan.getPrice());
        dto.setDurationDays(plan.getDurationDays());
        dto.setDescription(plan.getDescription());
        dto.setFeatures(plan.getFeatures());
        dto.setMaxTrips(plan.getMaxTrips());
        dto.setMaxClubs(plan.getMaxClubs());
        dto.setHasAnalytics(plan.getHasAnalytics());
        dto.setHasPrioritySupport(plan.getHasPrioritySupport());
        dto.setHasAdvancedFilters(plan.getHasAdvancedFilters());
        dto.setIsActive(plan.getIsActive());
        
        // Set badges for popular plans
        if ("PREMIUM".equals(plan.getName())) {
            dto.setIsPopular(true);
            dto.setBadge("Most Popular");
        } else if ("ENTERPRISE".equals(plan.getName())) {
            dto.setBadge("Best Value");
        }
        
        return dto;
    }
    
    private UserSubscriptionDTO convertToSubscriptionDTO(UserSubscription subscription) {
        UserSubscriptionDTO dto = new UserSubscriptionDTO();
        dto.setId(subscription.getId());
        dto.setUserId(subscription.getUserId());
        dto.setPlan(convertToDTO(subscription.getPlan()));
        dto.setStartDate(subscription.getStartDate());
        dto.setEndDate(subscription.getEndDate());
        dto.setStatus(subscription.getStatus());
        dto.setPaymentId(subscription.getPaymentId());
        dto.setTransactionId(subscription.getTransactionId());
        dto.setIsActive(subscription.isActive());
        return dto;
    }
}

package com.ridecircle.controller;

import com.ridecircle.dto.SubscriptionPlanDTO;
import com.ridecircle.dto.SubscriptionRequestDTO;
import com.ridecircle.dto.UserSubscriptionDTO;
import com.ridecircle.service.SubscriptionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * REST Controller for subscription management
 * Handles all subscription-related API endpoints
 */
@RestController
@RequestMapping("/api/subscriptions")
public class SubscriptionController {
    
    @Autowired
    private SubscriptionService subscriptionService;
    
    /**
     * Get all available subscription plans
     * GET /api/subscriptions/plans
     */
    @GetMapping("/plans")
    public ResponseEntity<List<SubscriptionPlanDTO>> getAllPlans() {
        try {
            List<SubscriptionPlanDTO> plans = subscriptionService.getAllPlans();
            return ResponseEntity.ok(plans);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    /**
     * Get specific plan by ID
     * GET /api/subscriptions/plans/{planId}
     */
    @GetMapping("/plans/{planId}")
    public ResponseEntity<SubscriptionPlanDTO> getPlanById(@PathVariable Long planId) {
        try {
            return subscriptionService.getPlanById(planId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    /**
     * Get current user's subscription status
     * GET /api/subscriptions/my-subscription
     */
    @GetMapping("/my-subscription")
    public ResponseEntity<UserSubscriptionDTO> getMySubscription(Authentication authentication) {
        try {
            // Extract user ID from JWT token
            String username = authentication.getName();
            Long userId = extractUserIdFromToken(username);
            
            UserSubscriptionDTO subscription = subscriptionService.getUserSubscription(userId);
            return ResponseEntity.ok(subscription);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    /**
     * Subscribe to a plan
     * POST /api/subscriptions/subscribe
     */
    @PostMapping("/subscribe")
    public ResponseEntity<?> subscribeToPlan(@RequestBody SubscriptionRequestDTO request,
                                           Authentication authentication) {
        try {
            // Extract user ID from JWT token
            String username = authentication.getName();
            Long userId = extractUserIdFromToken(username);
            
            UserSubscriptionDTO subscription = subscriptionService.subscribeToPlan(userId, request);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Successfully subscribed to plan",
                "subscription", subscription
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", e.getMessage()
            ));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of(
                "success", false,
                "message", "Internal server error occurred"
            ));
        }
    }
    
    /**
     * Cancel current subscription
     * POST /api/subscriptions/cancel
     */
    @PostMapping("/cancel")
    public ResponseEntity<?> cancelSubscription(Authentication authentication) {
        try {
            // Extract user ID from JWT token
            String username = authentication.getName();
            Long userId = extractUserIdFromToken(username);
            
            subscriptionService.cancelSubscription(userId);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Subscription cancelled successfully"
            ));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of(
                "success", false,
                "message", "Failed to cancel subscription"
            ));
        }
    }
    
    /**
     * Check feature access for current user
     * GET /api/subscriptions/feature-access/{feature}
     */
    @GetMapping("/feature-access/{feature}")
    public ResponseEntity<Map<String, Object>> checkFeatureAccess(@PathVariable String feature,
                                                                  Authentication authentication) {
        try {
            // Extract user ID from JWT token
            String username = authentication.getName();
            Long userId = extractUserIdFromToken(username);
            
            boolean hasAccess = subscriptionService.hasFeatureAccess(userId, feature);
            
            return ResponseEntity.ok(Map.of(
                "hasAccess", hasAccess,
                "feature", feature
            ));
        } catch (Exception e) {
            return ResponseEntity.ok(Map.of("hasAccess", false));
        }
    }
    
    /**
     * Check if user can create more trips
     * GET /api/subscriptions/can-create-trip
     */
    @GetMapping("/can-create-trip")
    public ResponseEntity<Map<String, Object>> canCreateTrip(@RequestParam int currentCount,
                                                           Authentication authentication) {
        try {
            // Extract user ID from JWT token
            String username = authentication.getName();
            Long userId = extractUserIdFromToken(username);
            
            boolean canCreate = subscriptionService.canCreateTrip(userId, currentCount);
            UserSubscriptionDTO subscription = subscriptionService.getUserSubscription(userId);
            
            return ResponseEntity.ok(Map.of(
                "canCreate", canCreate,
                "currentCount", currentCount,
                "maxAllowed", subscription.getPlan().getMaxTrips()
            ));
        } catch (Exception e) {
            return ResponseEntity.ok(Map.of("canCreate", false));
        }
    }
    
    /**
     * Check if user can join more clubs
     * GET /api/subscriptions/can-join-club
     */
    @GetMapping("/can-join-club")
    public ResponseEntity<Map<String, Object>> canJoinClub(@RequestParam int currentCount,
                                                         Authentication authentication) {
        try {
            // Extract user ID from JWT token
            String username = authentication.getName();
            Long userId = extractUserIdFromToken(username);
            
            boolean canJoin = subscriptionService.canJoinClub(userId, currentCount);
            UserSubscriptionDTO subscription = subscriptionService.getUserSubscription(userId);
            
            return ResponseEntity.ok(Map.of(
                "canJoin", canJoin,
                "currentCount", currentCount,
                "maxAllowed", subscription.getPlan().getMaxClubs()
            ));
        } catch (Exception e) {
            return ResponseEntity.ok(Map.of("canJoin", false));
        }
    }
    
    /**
     * Helper method to extract user ID from JWT token
     * This is a simplified implementation - adjust based on your JWT structure
     */
    private Long extractUserIdFromToken(String username) {
        // This is a placeholder implementation
        // In your actual implementation, you should extract the user ID from the JWT token
        // or fetch it from the database using the username
        
        // For now, returning a mock user ID
        // You'll need to replace this with your actual JWT parsing logic
        try {
            return Long.parseLong(username);
        } catch (NumberFormatException e) {
            // If username is not a number, you might need to query the database
            // to get the user ID based on username/email
            return 1L; // Default user ID for testing
        }
    }
}

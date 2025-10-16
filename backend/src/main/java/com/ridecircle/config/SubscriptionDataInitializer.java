package com.ridecircle.config;

import com.ridecircle.entity.SubscriptionPlan;
import com.ridecircle.repository.SubscriptionPlanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Component
public class SubscriptionDataInitializer implements CommandLineRunner {

    @Autowired
    private SubscriptionPlanRepository subscriptionPlanRepository;

    @Override
    public void run(String... args) throws Exception {
        // Initialize default subscription plans if they don't exist
        if (subscriptionPlanRepository.count() == 0) {
            initializeDefaultPlans();
        }
    }

    private void initializeDefaultPlans() {
        // Free Plan
        SubscriptionPlan freePlan = new SubscriptionPlan();
        freePlan.setName("FREE");
        freePlan.setDisplayName("Free Plan");
        freePlan.setPrice(BigDecimal.ZERO);
        freePlan.setDurationDays(365);
        freePlan.setDescription("Perfect for getting started with basic ride planning");
        freePlan.setMaxTrips(5);
        freePlan.setMaxClubs(2);
        freePlan.setHasAnalytics(false);
        freePlan.setHasPrioritySupport(false);
        freePlan.setHasAdvancedFilters(false);
        freePlan.setIsActive(true);
        freePlan.setCreatedAt(LocalDateTime.now());
        freePlan.setUpdatedAt(LocalDateTime.now());

        // Premium Plan
        SubscriptionPlan premiumPlan = new SubscriptionPlan();
        premiumPlan.setName("PREMIUM");
        premiumPlan.setDisplayName("Premium Plan");
        premiumPlan.setPrice(new BigDecimal("9.99"));
        premiumPlan.setDurationDays(30);
        premiumPlan.setDescription("Ideal for regular riders with enhanced features");
        premiumPlan.setMaxTrips(25);
        premiumPlan.setMaxClubs(10);
        premiumPlan.setHasAnalytics(true);
        premiumPlan.setHasPrioritySupport(true);
        premiumPlan.setHasAdvancedFilters(true);
        premiumPlan.setIsActive(true);
        premiumPlan.setCreatedAt(LocalDateTime.now());
        premiumPlan.setUpdatedAt(LocalDateTime.now());

        // Enterprise Plan
        SubscriptionPlan enterprisePlan = new SubscriptionPlan();
        enterprisePlan.setName("ENTERPRISE");
        enterprisePlan.setDisplayName("Enterprise Plan");
        enterprisePlan.setPrice(new BigDecimal("19.99"));
        enterprisePlan.setDurationDays(30);
        enterprisePlan.setDescription("Complete solution for riding clubs and organizations");
        enterprisePlan.setMaxTrips(100);
        enterprisePlan.setMaxClubs(50);
        enterprisePlan.setHasAnalytics(true);
        enterprisePlan.setHasPrioritySupport(true);
        enterprisePlan.setHasAdvancedFilters(true);
        enterprisePlan.setIsActive(true);
        enterprisePlan.setCreatedAt(LocalDateTime.now());
        enterprisePlan.setUpdatedAt(LocalDateTime.now());

        // Save all plans
        subscriptionPlanRepository.save(freePlan);
        subscriptionPlanRepository.save(premiumPlan);
        subscriptionPlanRepository.save(enterprisePlan);

        System.out.println("✅ Default subscription plans initialized successfully!");
    }
}

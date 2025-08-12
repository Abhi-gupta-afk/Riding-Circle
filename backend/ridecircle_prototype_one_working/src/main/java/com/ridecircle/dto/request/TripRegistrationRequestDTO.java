package com.ridecircle.dto.request;

import com.ridecircle.enums.RegistrationPlan;
import jakarta.validation.constraints.NotNull;

public class TripRegistrationRequestDTO {
    @NotNull
    private Long tripId;

    @NotNull
    private Long userId;

    @NotNull
    private RegistrationPlan plan;

    // Getters and Setters
    public Long getTripId() { return tripId; }
    public void setTripId(Long tripId) { this.tripId = tripId; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public RegistrationPlan getPlan() { return plan; }
    public void setPlan(RegistrationPlan plan) { this.plan = plan; }
}
package com.ridecircle.dto.response;

import com.ridecircle.enums.RegistrationPlan;
import java.time.LocalDateTime;

public class TripRegistrationResponseDTO {
    private Long registrationId;
    private String tripTitle;
    private String username;
    private RegistrationPlan plan;
    private LocalDateTime registrationDate;

    // Getters and Setters
    public Long getRegistrationId() { return registrationId; }
    public void setRegistrationId(Long registrationId) { this.registrationId = registrationId; }
    public String getTripTitle() { return tripTitle; }
    public void setTripTitle(String tripTitle) { this.tripTitle = tripTitle; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public RegistrationPlan getPlan() { return plan; }
    public void setPlan(RegistrationPlan plan) { this.plan = plan; }
    public LocalDateTime getRegistrationDate() { return registrationDate; }
    public void setRegistrationDate(LocalDateTime registrationDate) { this.registrationDate = registrationDate; }
}
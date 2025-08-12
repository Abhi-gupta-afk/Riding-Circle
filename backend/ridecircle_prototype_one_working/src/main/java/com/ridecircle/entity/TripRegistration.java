package com.ridecircle.entity;

import com.ridecircle.enums.RegistrationPlan;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "trip_registrations")
public class TripRegistration {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "trip_id", nullable = false)
    private Trip trip;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RegistrationPlan plan; // Captures the NORMAL or PREMIUM plan choice.

    private LocalDateTime registrationDate;
    
    @PrePersist
    protected void onCreate() {
        registrationDate = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public Trip getTrip() { return trip; }
    public void setTrip(Trip trip) { this.trip = trip; }
    public RegistrationPlan getPlan() { return plan; }
    public void setPlan(RegistrationPlan plan) { this.plan = plan; }
    public LocalDateTime getRegistrationDate() { return registrationDate; }
    public void setRegistrationDate(LocalDateTime registrationDate) { this.registrationDate = registrationDate; }
}
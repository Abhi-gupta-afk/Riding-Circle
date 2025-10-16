package com.ridecircle.entity;

import com.ridecircle.enums.RegistrationPlan;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "trip_registrations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
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

}
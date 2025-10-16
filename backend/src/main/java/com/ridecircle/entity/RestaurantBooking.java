package com.ridecircle.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

/**
 * Entity representing a restaurant booking/reservation
 */
@Entity
@Table(name = "restaurant_bookings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RestaurantBooking {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    // Many-to-One relationship with User
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    // Many-to-One relationship with Restaurant
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "restaurant_id", nullable = false)
    private Restaurant restaurant;
    
    @Column(nullable = false)
    private LocalDateTime reservationDateTime;
    
    @Column(nullable = false)
    private Integer numberOfGuests = 1;
    
    @Column(length = 500)
    private String specialRequests;
    
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private BookingStatus status = BookingStatus.PENDING;
    
    private String confirmationCode;
    
    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @Column(nullable = false)
    private LocalDateTime updatedAt = LocalDateTime.now();
    
    // Enum for booking status
    public enum BookingStatus {
        PENDING,
        CONFIRMED,
        CANCELLED,
        COMPLETED,
        NO_SHOW
    }
    
    // Constructor with required fields
    public RestaurantBooking(User user, Restaurant restaurant, LocalDateTime reservationDateTime, Integer numberOfGuests) {
        this.user = user;
        this.restaurant = restaurant;
        this.reservationDateTime = reservationDateTime;
        this.numberOfGuests = numberOfGuests;
        this.confirmationCode = generateConfirmationCode();
    }
    
    // Generate a random confirmation code
    private String generateConfirmationCode() {
        return "RC" + System.currentTimeMillis() % 1000000;
    }
    
    // Keep custom logic to update timestamp when status changes
    public void setStatus(BookingStatus status) {
        this.status = status;
        this.updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}

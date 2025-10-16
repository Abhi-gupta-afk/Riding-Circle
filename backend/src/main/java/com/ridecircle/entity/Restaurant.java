package com.ridecircle.entity;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.time.LocalDateTime;
import java.util.Set;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

/**
 * Entity representing a restaurant
 */
@Entity
@Table(name = "restaurants")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Restaurant {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String name;
    
    @Column(length = 1000)
    private String description;
    
    @Column(nullable = false)
    private String address;
    
    private String city;
    
    private String state;
    
    private String zipCode;
    
    private String phoneNumber;
    
    private String email;
    
    private String website;
    
    @Column(nullable = false)
    private String cuisine; // e.g., "Indian", "Chinese", "Italian", "Multi-Cuisine"
    
    @Column(nullable = false)
    private Double rating = 0.0; // Average rating
    
    @Column(nullable = false)
    private Integer reviewCount = 0;
    
    private String imageUrl;
    
    @Column(nullable = false)
    private Boolean isVegetarianFriendly = false;
    
    @Column(nullable = false)
    private Boolean isVeganFriendly = false;
    
    @Column(nullable = false)
    private Boolean hasDelivery = false;
    
    @Column(nullable = false)
    private Boolean hasTakeout = false;
    
    @Column(nullable = false)
    private Boolean acceptsReservations = false;
    
    @Column(nullable = false)
    private Boolean isActive = true;
    
    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @Column(nullable = false)
    private LocalDateTime updatedAt = LocalDateTime.now();
    
    // One-to-Many relationship with RestaurantBooking
    @OneToMany(mappedBy = "restaurant", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private Set<RestaurantBooking> bookings;
    
    // Constructor with required fields
    public Restaurant(String name, String address, String cuisine) {
        this.name = name;
        this.address = address;
        this.cuisine = cuisine;
    }
    
    // Lombok generates getters and setters; keep custom timestamp updates via lifecycle or explicit setters below
    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
        this.updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}

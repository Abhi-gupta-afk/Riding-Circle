package com.ridecircle.entity;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.time.LocalDateTime;
import java.util.Set;

/**
 * Entity representing a restaurant
 */
@Entity
@Table(name = "restaurants")
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
    private LocalDateTime createdAt;
    
    @Column(nullable = false)
    private LocalDateTime updatedAt;
    
    // One-to-Many relationship with RestaurantBooking
    @OneToMany(mappedBy = "restaurant", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private Set<RestaurantBooking> bookings;
    
    // Default constructor
    public Restaurant() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
    
    // Constructor with required fields
    public Restaurant(String name, String address, String cuisine) {
        this();
        this.name = name;
        this.address = address;
        this.cuisine = cuisine;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public String getAddress() {
        return address;
    }
    
    public void setAddress(String address) {
        this.address = address;
    }
    
    public String getCity() {
        return city;
    }
    
    public void setCity(String city) {
        this.city = city;
    }
    
    public String getState() {
        return state;
    }
    
    public void setState(String state) {
        this.state = state;
    }
    
    public String getZipCode() {
        return zipCode;
    }
    
    public void setZipCode(String zipCode) {
        this.zipCode = zipCode;
    }
    
    public String getPhoneNumber() {
        return phoneNumber;
    }
    
    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public String getWebsite() {
        return website;
    }
    
    public void setWebsite(String website) {
        this.website = website;
    }
    
    public String getCuisine() {
        return cuisine;
    }
    
    public void setCuisine(String cuisine) {
        this.cuisine = cuisine;
    }
    
    public Double getRating() {
        return rating;
    }
    
    public void setRating(Double rating) {
        this.rating = rating;
    }
    
    public Integer getReviewCount() {
        return reviewCount;
    }
    
    public void setReviewCount(Integer reviewCount) {
        this.reviewCount = reviewCount;
    }
    
    public String getImageUrl() {
        return imageUrl;
    }
    
    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }
    
    public Boolean getIsVegetarianFriendly() {
        return isVegetarianFriendly;
    }
    
    public void setIsVegetarianFriendly(Boolean isVegetarianFriendly) {
        this.isVegetarianFriendly = isVegetarianFriendly;
    }
    
    public Boolean getIsVeganFriendly() {
        return isVeganFriendly;
    }
    
    public void setIsVeganFriendly(Boolean isVeganFriendly) {
        this.isVeganFriendly = isVeganFriendly;
    }
    
    public Boolean getHasDelivery() {
        return hasDelivery;
    }
    
    public void setHasDelivery(Boolean hasDelivery) {
        this.hasDelivery = hasDelivery;
    }
    
    public Boolean getHasTakeout() {
        return hasTakeout;
    }
    
    public void setHasTakeout(Boolean hasTakeout) {
        this.hasTakeout = hasTakeout;
    }
    
    public Boolean getAcceptsReservations() {
        return acceptsReservations;
    }
    
    public void setAcceptsReservations(Boolean acceptsReservations) {
        this.acceptsReservations = acceptsReservations;
    }
    
    public Boolean getIsActive() {
        return isActive;
    }
    
    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
        this.updatedAt = LocalDateTime.now();
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
    
    public Set<RestaurantBooking> getBookings() {
        return bookings;
    }
    
    public void setBookings(Set<RestaurantBooking> bookings) {
        this.bookings = bookings;
    }
    
    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}

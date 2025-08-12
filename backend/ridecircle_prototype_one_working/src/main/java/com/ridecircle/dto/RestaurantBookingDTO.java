package com.ridecircle.dto;

import java.time.LocalDateTime;

/**
 * DTO for RestaurantBooking entity
 */
public class RestaurantBookingDTO {
    private Long id;
    private Long userId;
    private String username;
    private Long restaurantId;
    private String restaurantName;
    private String restaurantAddress;
    private String restaurantCuisine;
    private String restaurantImageUrl;
    private LocalDateTime reservationDateTime;
    private Integer numberOfGuests;
    private String specialRequests;
    private String status;
    private String confirmationCode;
    private LocalDateTime createdAt;
    
    // Default constructor
    public RestaurantBookingDTO() {}
    
    // Constructor with essential fields
    public RestaurantBookingDTO(Long id, String restaurantName, String restaurantAddress, 
                               LocalDateTime reservationDateTime, Integer numberOfGuests, 
                               String status, String confirmationCode) {
        this.id = id;
        this.restaurantName = restaurantName;
        this.restaurantAddress = restaurantAddress;
        this.reservationDateTime = reservationDateTime;
        this.numberOfGuests = numberOfGuests;
        this.status = status;
        this.confirmationCode = confirmationCode;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public Long getUserId() {
        return userId;
    }
    
    public void setUserId(Long userId) {
        this.userId = userId;
    }
    
    public String getUsername() {
        return username;
    }
    
    public void setUsername(String username) {
        this.username = username;
    }
    
    public Long getRestaurantId() {
        return restaurantId;
    }
    
    public void setRestaurantId(Long restaurantId) {
        this.restaurantId = restaurantId;
    }
    
    public String getRestaurantName() {
        return restaurantName;
    }
    
    public void setRestaurantName(String restaurantName) {
        this.restaurantName = restaurantName;
    }
    
    public String getRestaurantAddress() {
        return restaurantAddress;
    }
    
    public void setRestaurantAddress(String restaurantAddress) {
        this.restaurantAddress = restaurantAddress;
    }
    
    public String getRestaurantCuisine() {
        return restaurantCuisine;
    }
    
    public void setRestaurantCuisine(String restaurantCuisine) {
        this.restaurantCuisine = restaurantCuisine;
    }
    
    public String getRestaurantImageUrl() {
        return restaurantImageUrl;
    }
    
    public void setRestaurantImageUrl(String restaurantImageUrl) {
        this.restaurantImageUrl = restaurantImageUrl;
    }
    
    public LocalDateTime getReservationDateTime() {
        return reservationDateTime;
    }
    
    public void setReservationDateTime(LocalDateTime reservationDateTime) {
        this.reservationDateTime = reservationDateTime;
    }
    
    public Integer getNumberOfGuests() {
        return numberOfGuests;
    }
    
    public void setNumberOfGuests(Integer numberOfGuests) {
        this.numberOfGuests = numberOfGuests;
    }
    
    public String getSpecialRequests() {
        return specialRequests;
    }
    
    public void setSpecialRequests(String specialRequests) {
        this.specialRequests = specialRequests;
    }
    
    public String getStatus() {
        return status;
    }
    
    public void setStatus(String status) {
        this.status = status;
    }
    
    public String getConfirmationCode() {
        return confirmationCode;
    }
    
    public void setConfirmationCode(String confirmationCode) {
        this.confirmationCode = confirmationCode;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}

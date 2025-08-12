package com.ridecircle.dto;

import jakarta.validation.constraints.*;
import java.time.LocalDateTime;

/**
 * DTO for restaurant booking requests
 */
public class RestaurantBookingRequest {
    
    @NotNull(message = "Restaurant ID is required")
    private Long restaurantId;
    
    @NotNull(message = "Reservation date and time is required")
    private LocalDateTime reservationDateTime;
    
    @Min(value = 1, message = "Number of guests must be at least 1")
    @Max(value = 20, message = "Number of guests cannot exceed 20")
    private int numberOfGuests;
    
    private String specialRequests;
    
    // Default constructor
    public RestaurantBookingRequest() {}
    
    // Constructor with parameters
    public RestaurantBookingRequest(Long restaurantId, LocalDateTime reservationDateTime, 
                                  int numberOfGuests, String specialRequests) {
        this.restaurantId = restaurantId;
        this.reservationDateTime = reservationDateTime;
        this.numberOfGuests = numberOfGuests;
        this.specialRequests = specialRequests;
    }
    
    // Getters and Setters
    public Long getRestaurantId() {
        return restaurantId;
    }
    
    public void setRestaurantId(Long restaurantId) {
        this.restaurantId = restaurantId;
    }
    
    public LocalDateTime getReservationDateTime() {
        return reservationDateTime;
    }
    
    public void setReservationDateTime(LocalDateTime reservationDateTime) {
        this.reservationDateTime = reservationDateTime;
    }
    
    public int getNumberOfGuests() {
        return numberOfGuests;
    }
    
    public void setNumberOfGuests(int numberOfGuests) {
        this.numberOfGuests = numberOfGuests;
    }
    
    public String getSpecialRequests() {
        return specialRequests;
    }
    
    public void setSpecialRequests(String specialRequests) {
        this.specialRequests = specialRequests;
    }
}

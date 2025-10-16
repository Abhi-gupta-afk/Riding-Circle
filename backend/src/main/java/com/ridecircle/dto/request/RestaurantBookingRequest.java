package com.ridecircle.dto.request;

import jakarta.validation.constraints.*;
import java.time.LocalDateTime;
import lombok.Getter;
import lombok.Setter;

/**
 * DTO for restaurant booking requests
 */
@Getter
@Setter
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
    
}

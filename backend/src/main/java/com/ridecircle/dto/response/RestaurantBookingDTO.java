package com.ridecircle.dto.response;

import java.time.LocalDateTime;
import lombok.Getter;
import lombok.Setter;

/**
 * DTO for RestaurantBooking entity
 */
@Getter
@Setter
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
    
}

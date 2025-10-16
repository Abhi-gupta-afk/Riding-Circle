package com.ridecircle.dto.response;

import lombok.Getter;
import lombok.Setter;

/**
 * DTO for Restaurant entity
 */
@Getter
@Setter
public class RestaurantDTO {
    private Long id;
    private String name;
    private String description;
    private String address;
    private String city;
    private String state;
    private String zipCode;
    private String phoneNumber;
    private String email;
    private String website;
    private String cuisine;
    private Double rating;
    private Integer reviewCount;
    private String imageUrl;
    private Boolean isVegetarianFriendly;
    private Boolean isVeganFriendly;
    private Boolean hasDelivery;
    private Boolean hasTakeout;
    private Boolean acceptsReservations;
    
    // Default constructor
    public RestaurantDTO() {}
    
    // Constructor with essential fields
    public RestaurantDTO(Long id, String name, String address, String cuisine, Double rating, 
                        Boolean acceptsReservations, String imageUrl) {
        this.id = id;
        this.name = name;
        this.address = address;
        this.cuisine = cuisine;
        this.rating = rating;
        this.acceptsReservations = acceptsReservations;
        this.imageUrl = imageUrl;
    }
    
}

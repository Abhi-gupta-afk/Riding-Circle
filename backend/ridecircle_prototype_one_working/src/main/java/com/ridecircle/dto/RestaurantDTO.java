package com.ridecircle.dto;

/**
 * DTO for Restaurant entity
 */
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
}

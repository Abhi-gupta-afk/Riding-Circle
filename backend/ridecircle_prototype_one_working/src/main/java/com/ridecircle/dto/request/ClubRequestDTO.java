package com.ridecircle.dto.request;

import jakarta.validation.constraints.NotBlank;

public class ClubRequestDTO {
    @NotBlank(message = "Club name cannot be blank")
    private String name;

    @NotBlank(message = "Brand cannot be blank")
    private String brand;

    private String description;
    
    @NotBlank(message = "City cannot be blank")
    private String city;

    // Getters and Setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getBrand() { return brand; }
    public void setBrand(String brand) { this.brand = brand; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
}
package com.ridecircle.dto.response;

import lombok.Getter;
import lombok.Setter;

/**
 * DTO for Food entity
 */
@Getter
@Setter
public class FoodDTO {
    private Long id;
    private String name;
    private String description;
    private String category;
    private String cuisine;
    private String imageUrl;
    private Boolean isVegetarian;
    private Boolean isVegan;
    private Boolean isSpicy;
    private Boolean isSelected; // Whether the current user has selected this food
    
    // Default constructor
    public FoodDTO() {}
    
    // Constructor with all fields
    public FoodDTO(Long id, String name, String description, String category, String cuisine, 
                   String imageUrl, Boolean isVegetarian, Boolean isVegan, Boolean isSpicy) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.category = category;
        this.cuisine = cuisine;
        this.imageUrl = imageUrl;
        this.isVegetarian = isVegetarian;
        this.isVegan = isVegan;
        this.isSpicy = isSpicy;
        this.isSelected = false;
    }
    
}

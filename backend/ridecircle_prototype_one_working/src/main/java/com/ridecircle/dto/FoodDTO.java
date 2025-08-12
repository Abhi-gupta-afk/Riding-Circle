package com.ridecircle.dto;

/**
 * DTO for Food entity
 */
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
    
    public String getCategory() {
        return category;
    }
    
    public void setCategory(String category) {
        this.category = category;
    }
    
    public String getCuisine() {
        return cuisine;
    }
    
    public void setCuisine(String cuisine) {
        this.cuisine = cuisine;
    }
    
    public String getImageUrl() {
        return imageUrl;
    }
    
    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }
    
    public Boolean getIsVegetarian() {
        return isVegetarian;
    }
    
    public void setIsVegetarian(Boolean isVegetarian) {
        this.isVegetarian = isVegetarian;
    }
    
    public Boolean getIsVegan() {
        return isVegan;
    }
    
    public void setIsVegan(Boolean isVegan) {
        this.isVegan = isVegan;
    }
    
    public Boolean getIsSpicy() {
        return isSpicy;
    }
    
    public void setIsSpicy(Boolean isSpicy) {
        this.isSpicy = isSpicy;
    }
    
    public Boolean getIsSelected() {
        return isSelected;
    }
    
    public void setIsSelected(Boolean isSelected) {
        this.isSelected = isSelected;
    }
}

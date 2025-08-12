package com.ridecircle.entity;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Set;

/**
 * Entity representing a food item
 */
@Entity
@Table(name = "foods")
public class Food {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String name;
    
    @Column(length = 1000)
    private String description;
    
    @Column(nullable = false)
    private String category; // e.g., "Vegetarian", "Non-Vegetarian", "Vegan", "Dessert", "Beverage"
    
    @Column(nullable = false)
    private String cuisine; // e.g., "Indian", "Chinese", "Italian", "Continental"
    
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price; // Price of the food item
    
    private String imageUrl;
    
    @Column(nullable = false)
    private Boolean isVegetarian = false;
    
    @Column(nullable = false)
    private Boolean isVegan = false;
    
    @Column(nullable = false)
    private Boolean isSpicy = false;
    
    @Column(nullable = false)
    private Boolean isActive = true;
    
    @Column(nullable = false)
    private LocalDateTime createdAt;
    
    @Column(nullable = false)
    private LocalDateTime updatedAt;
    
    // Many-to-Many relationship with User (food preferences)
    @ManyToMany(mappedBy = "foodPreferences")
    @JsonIgnore
    private Set<User> users;
    
    // Default constructor
    public Food() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
    
    // Constructor with required fields
    public Food(String name, String category, String cuisine) {
        this();
        this.name = name;
        this.category = category;
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
    
    public BigDecimal getPrice() {
        return price;
    }
    
    public void setPrice(BigDecimal price) {
        this.price = price;
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
    
    public Boolean getIsActive() {
        return isActive;
    }
    
    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
        this.updatedAt = LocalDateTime.now();
    }
    
    // Convenience methods for admin interface
    public Boolean getAvailable() {
        return isActive;
    }
    
    public void setAvailable(Boolean available) {
        this.isActive = available;
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
    
    public Set<User> getUsers() {
        return users;
    }
    
    public void setUsers(Set<User> users) {
        this.users = users;
    }
    
    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}

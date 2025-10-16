package com.ridecircle.entity;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Set;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

/**
 * Entity representing a food item
 */
@Entity
@Table(name = "foods")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
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
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @Column(nullable = false)
    private LocalDateTime updatedAt = LocalDateTime.now();
    
    // Many-to-Many relationship with User (food preferences)
    @ManyToMany(mappedBy = "foodPreferences")
    @JsonIgnore
    private Set<User> users;
    
    // Constructor with required fields
    public Food(String name, String category, String cuisine) {
        this.name = name;
        this.category = category;
        this.cuisine = cuisine;
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
    
    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}

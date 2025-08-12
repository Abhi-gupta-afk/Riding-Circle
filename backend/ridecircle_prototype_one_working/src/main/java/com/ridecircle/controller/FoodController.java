package com.ridecircle.controller;

import com.ridecircle.dto.FoodDTO;
import com.ridecircle.service.FoodService;
import com.ridecircle.security.jwt.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Map;

/**
 * REST Controller for food management
 * Handles all food-related API endpoints
 */
@RestController
@RequestMapping("/api/foods")
@CrossOrigin(origins = "http://localhost:5173")
public class FoodController {
    
    @Autowired
    private FoodService foodService;
    
    @Autowired
    private JwtUtils jwtUtils;
    
    /**
     * Get all foods
     * GET /api/foods
     */
    @GetMapping
    public ResponseEntity<List<FoodDTO>> getAllFoods(HttpServletRequest request) {
        try {
            String token = parseJwt(request);
            if (token != null && jwtUtils.validateJwtToken(token)) {
                String username = jwtUtils.getUserNameFromJwtToken(token);
                Long userId = getUserIdFromUsername(username);
                return ResponseEntity.ok(foodService.getAllFoodsForUser(userId));
            } else {
                return ResponseEntity.ok(foodService.getAllFoods());
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    /**
     * Get user's food preferences
     * GET /api/foods/preferences
     */
    @GetMapping("/preferences")
    public ResponseEntity<List<FoodDTO>> getUserFoodPreferences(HttpServletRequest request) {
        try {
            String token = parseJwt(request);
            if (token == null || !jwtUtils.validateJwtToken(token)) {
                return ResponseEntity.status(401).build();
            }
            
            String username = jwtUtils.getUserNameFromJwtToken(token);
            Long userId = getUserIdFromUsername(username);
            
            List<FoodDTO> preferences = foodService.getUserFoodPreferences(userId);
            return ResponseEntity.ok(preferences);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    /**
     * Add food preference
     * POST /api/foods/{foodId}/prefer
     */
    @PostMapping("/{foodId}/prefer")
    public ResponseEntity<?> addFoodPreference(@PathVariable Long foodId, HttpServletRequest request) {
        try {
            String token = parseJwt(request);
            if (token == null || !jwtUtils.validateJwtToken(token)) {
                return ResponseEntity.status(401).body(Map.of("message", "Unauthorized"));
            }
            
            String username = jwtUtils.getUserNameFromJwtToken(token);
            Long userId = getUserIdFromUsername(username);
            
            foodService.addFoodPreference(userId, foodId);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Food preference added successfully"
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", e.getMessage()
            ));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of(
                "success", false,
                "message", "Internal server error"
            ));
        }
    }
    
    /**
     * Remove food preference
     * DELETE /api/foods/{foodId}/prefer
     */
    @DeleteMapping("/{foodId}/prefer")
    public ResponseEntity<?> removeFoodPreference(@PathVariable Long foodId, HttpServletRequest request) {
        try {
            String token = parseJwt(request);
            if (token == null || !jwtUtils.validateJwtToken(token)) {
                return ResponseEntity.status(401).body(Map.of("message", "Unauthorized"));
            }
            
            String username = jwtUtils.getUserNameFromJwtToken(token);
            Long userId = getUserIdFromUsername(username);
            
            foodService.removeFoodPreference(userId, foodId);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Food preference removed successfully"
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", e.getMessage()
            ));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of(
                "success", false,
                "message", "Internal server error"
            ));
        }
    }
    
    /**
     * Get foods by category
     * GET /api/foods/category/{category}
     */
    @GetMapping("/category/{category}")
    public ResponseEntity<List<FoodDTO>> getFoodsByCategory(@PathVariable String category) {
        try {
            List<FoodDTO> foods = foodService.getFoodsByCategory(category);
            return ResponseEntity.ok(foods);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    /**
     * Get foods by cuisine
     * GET /api/foods/cuisine/{cuisine}
     */
    @GetMapping("/cuisine/{cuisine}")
    public ResponseEntity<List<FoodDTO>> getFoodsByCuisine(@PathVariable String cuisine) {
        try {
            List<FoodDTO> foods = foodService.getFoodsByCuisine(cuisine);
            return ResponseEntity.ok(foods);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    /**
     * Search foods by name
     * GET /api/foods/search?name={name}
     */
    @GetMapping("/search")
    public ResponseEntity<List<FoodDTO>> searchFoods(@RequestParam String name) {
        try {
            List<FoodDTO> foods = foodService.searchFoodsByName(name);
            return ResponseEntity.ok(foods);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    /**
     * Get all food categories
     * GET /api/foods/categories
     */
    @GetMapping("/categories")
    public ResponseEntity<List<String>> getFoodCategories() {
        try {
            List<String> categories = foodService.getFoodCategories();
            return ResponseEntity.ok(categories);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    /**
     * Get all food cuisines
     * GET /api/foods/cuisines
     */
    @GetMapping("/cuisines")
    public ResponseEntity<List<String>> getFoodCuisines() {
        try {
            List<String> cuisines = foodService.getFoodCuisines();
            return ResponseEntity.ok(cuisines);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    /**
     * Get vegetarian foods
     * GET /api/foods/vegetarian
     */
    @GetMapping("/vegetarian")
    public ResponseEntity<List<FoodDTO>> getVegetarianFoods() {
        try {
            List<FoodDTO> foods = foodService.getVegetarianFoods();
            return ResponseEntity.ok(foods);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    /**
     * Get vegan foods
     * GET /api/foods/vegan
     */
    @GetMapping("/vegan")
    public ResponseEntity<List<FoodDTO>> getVeganFoods() {
        try {
            List<FoodDTO> foods = foodService.getVeganFoods();
            return ResponseEntity.ok(foods);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    /**
     * Helper method to get user ID from username
     * TODO: This should be moved to a utility service
     */
    private Long getUserIdFromUsername(String username) {
        // This is a placeholder - you should implement proper user lookup
        // For now, returning 1L as a default
        return 1L;
    }
    
    /**
     * Parse JWT token from Authorization header
     */
    private String parseJwt(HttpServletRequest request) {
        String headerAuth = request.getHeader("Authorization");
        
        if (headerAuth != null && headerAuth.startsWith("Bearer ")) {
            return headerAuth.substring(7);
        }
        
        return null;
    }
}

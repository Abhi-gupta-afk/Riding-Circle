package com.ridecircle.controller;

import com.ridecircle.entity.Food;
import com.ridecircle.entity.User;
import com.ridecircle.enums.RoleEnum;
import com.ridecircle.service.FoodService;
import com.ridecircle.servicelayer.service.UserService;
import com.ridecircle.security.jwt.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin/foods")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminFoodController {

    @Autowired
    private FoodService foodService;

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtils jwtUtils;

    private String extractTokenFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }

    private boolean isAdmin(HttpServletRequest request) {
        try {
            String token = extractTokenFromRequest(request);
            if (token == null || !jwtUtils.validateJwtToken(token)) {
                return false;
            }

            String username = jwtUtils.getUserNameFromJwtToken(token);
            Optional<User> userOpt = userService.getUserByUsername(username);
            if (userOpt.isEmpty()) {
                return false;
            }

            User user = userOpt.get();
            return user.getRoles().stream().anyMatch(role -> RoleEnum.ADMIN.equals(role.getName()));
        } catch (Exception e) {
            return false;
        }
    }

    @GetMapping
    public ResponseEntity<?> getAllFoods(HttpServletRequest request) {
        if (!isAdmin(request)) {
            return ResponseEntity.status(403).body("Access denied. Admin role required.");
        }

        try {
            List<Food> foods = foodService.getAllFoodsForAdmin();
            return ResponseEntity.ok(foods);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error fetching foods: " + e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getFoodById(@PathVariable Long id, HttpServletRequest request) {
        if (!isAdmin(request)) {
            return ResponseEntity.status(403).body("Access denied. Admin role required.");
        }

        try {
            Optional<Food> foodOpt = foodService.getFoodEntityById(id);
            if (foodOpt.isEmpty()) {
                return ResponseEntity.status(404).body("Food not found");
            }
            return ResponseEntity.ok(foodOpt.get());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error fetching food: " + e.getMessage());
        }
    }

    @PostMapping
    public ResponseEntity<?> createFood(@Valid @RequestBody Food food, HttpServletRequest request) {
        if (!isAdmin(request)) {
            return ResponseEntity.status(403).body("Access denied. Admin role required.");
        }

        try {
            Food savedFood = foodService.saveFood(food);
            return ResponseEntity.ok(savedFood);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error creating food: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateFood(@PathVariable Long id, @Valid @RequestBody Food food, HttpServletRequest request) {
        if (!isAdmin(request)) {
            return ResponseEntity.status(403).body("Access denied. Admin role required.");
        }

        try {
            Optional<Food> existingFoodOpt = foodService.getFoodEntityById(id);
            if (existingFoodOpt.isEmpty()) {
                return ResponseEntity.status(404).body("Food not found");
            }

            food.setId(id);
            Food updatedFood = foodService.saveFood(food);
            return ResponseEntity.ok(updatedFood);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error updating food: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteFood(@PathVariable Long id, HttpServletRequest request) {
        if (!isAdmin(request)) {
            return ResponseEntity.status(403).body("Access denied. Admin role required.");
        }

        try {
            Optional<Food> existingFoodOpt = foodService.getFoodEntityById(id);
            if (existingFoodOpt.isEmpty()) {
                return ResponseEntity.status(404).body("Food not found");
            }

            foodService.deleteFood(id);
            return ResponseEntity.ok("Food deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error deleting food: " + e.getMessage());
        }
    }
}

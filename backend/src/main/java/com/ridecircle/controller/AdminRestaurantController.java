package com.ridecircle.controller;

import com.ridecircle.entity.Restaurant;
import com.ridecircle.entity.User;
import com.ridecircle.service.RestaurantService;
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
@RequestMapping("/api/admin/restaurants")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminRestaurantController {

    @Autowired
    private RestaurantService restaurantService;

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
            return user.getRoles().stream().anyMatch(role -> "ADMIN".equals(role.getName().toString()));
        } catch (Exception e) {
            return false;
        }
    }

    @GetMapping
    public ResponseEntity<?> getAllRestaurants(HttpServletRequest request) {
        if (!isAdmin(request)) {
            return ResponseEntity.status(403).body("Access denied. Admin role required.");
        }

        try {
            List<Restaurant> restaurants = restaurantService.getAllRestaurants();
            return ResponseEntity.ok(restaurants);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error fetching restaurants: " + e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getRestaurantById(@PathVariable Long id, HttpServletRequest request) {
        if (!isAdmin(request)) {
            return ResponseEntity.status(403).body("Access denied. Admin role required.");
        }

        try {
            Restaurant restaurant = restaurantService.getRestaurantById(id);
            if (restaurant == null) {
                return ResponseEntity.status(404).body("Restaurant not found");
            }
            return ResponseEntity.ok(restaurant);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error fetching restaurant: " + e.getMessage());
        }
    }

    @PostMapping
    public ResponseEntity<?> createRestaurant(@Valid @RequestBody Restaurant restaurant, HttpServletRequest request) {
        if (!isAdmin(request)) {
            return ResponseEntity.status(403).body("Access denied. Admin role required.");
        }

        try {
            Restaurant savedRestaurant = restaurantService.saveRestaurant(restaurant);
            return ResponseEntity.ok(savedRestaurant);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error creating restaurant: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateRestaurant(@PathVariable Long id, @Valid @RequestBody Restaurant restaurant, HttpServletRequest request) {
        if (!isAdmin(request)) {
            return ResponseEntity.status(403).body("Access denied. Admin role required.");
        }

        try {
            Restaurant existingRestaurant = restaurantService.getRestaurantById(id);
            if (existingRestaurant == null) {
                return ResponseEntity.status(404).body("Restaurant not found");
            }

            restaurant.setId(id);
            Restaurant updatedRestaurant = restaurantService.saveRestaurant(restaurant);
            return ResponseEntity.ok(updatedRestaurant);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error updating restaurant: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteRestaurant(@PathVariable Long id, HttpServletRequest request) {
        if (!isAdmin(request)) {
            return ResponseEntity.status(403).body("Access denied. Admin role required.");
        }

        try {
            Restaurant existingRestaurant = restaurantService.getRestaurantById(id);
            if (existingRestaurant == null) {
                return ResponseEntity.status(404).body("Restaurant not found");
            }

            restaurantService.deleteRestaurant(id);
            return ResponseEntity.ok("Restaurant deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error deleting restaurant: " + e.getMessage());
        }
    }
}

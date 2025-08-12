package com.ridecircle.controller;

import com.ridecircle.entity.RestaurantBooking;
import com.ridecircle.entity.User;
import com.ridecircle.entity.Restaurant;
import com.ridecircle.dto.RestaurantBookingRequest;
import com.ridecircle.service.RestaurantBookingService;
import com.ridecircle.servicelayer.service.UserService;
import com.ridecircle.service.RestaurantService;
import com.ridecircle.security.jwt.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/restaurant-bookings")
@CrossOrigin(origins = "http://localhost:5173")
public class RestaurantBookingController {

    @Autowired
    private RestaurantBookingService bookingService;

    @Autowired
    private UserService userService;

    @Autowired
    private RestaurantService restaurantService;

    @Autowired
    private JwtUtils jwtUtils;

    @PostMapping
    public ResponseEntity<?> createBooking(@Valid @RequestBody RestaurantBookingRequest bookingRequest, HttpServletRequest request) {
        try {
            String token = extractTokenFromRequest(request);
            if (token == null || !jwtUtils.validateJwtToken(token)) {
                return ResponseEntity.status(401).body("Invalid or missing token");
            }

            String username = jwtUtils.getUserNameFromJwtToken(token);
            Optional<User> userOpt = userService.getUserByUsername(username);
            if (userOpt.isEmpty()) {
                return ResponseEntity.status(404).body("User not found");
            }
            User user = userOpt.get();

            // Find the restaurant
            Optional<Restaurant> restaurantOpt = restaurantService.findById(bookingRequest.getRestaurantId());
            if (restaurantOpt.isEmpty()) {
                return ResponseEntity.status(404).body("Restaurant not found");
            }
            
            // Create RestaurantBooking entity
            RestaurantBooking booking = new RestaurantBooking();
            booking.setUser(user);
            booking.setRestaurant(restaurantOpt.get());
            booking.setReservationDateTime(bookingRequest.getReservationDateTime());
            booking.setNumberOfGuests(bookingRequest.getNumberOfGuests());
            booking.setSpecialRequests(bookingRequest.getSpecialRequests());

            RestaurantBooking savedBooking = bookingService.createBooking(booking);
            return ResponseEntity.ok(savedBooking);

        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error creating booking: " + e.getMessage());
        }
    }

    @GetMapping("/my-bookings")
    public ResponseEntity<?> getUserBookings(HttpServletRequest request) {
        try {
            String token = extractTokenFromRequest(request);
            if (token == null || !jwtUtils.validateJwtToken(token)) {
                return ResponseEntity.status(401).body("Invalid or missing token");
            }

            String username = jwtUtils.getUserNameFromJwtToken(token);
            Optional<User> userOpt = userService.getUserByUsername(username);
            if (userOpt.isEmpty()) {
                return ResponseEntity.status(404).body("User not found");
            }
            User user = userOpt.get();

            List<RestaurantBooking> bookings = bookingService.getUserBookings(user.getId());
            return ResponseEntity.ok(bookings);

        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error fetching bookings: " + e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getBookingById(@PathVariable Long id, HttpServletRequest request) {
        try {
            String token = extractTokenFromRequest(request);
            if (token == null || !jwtUtils.validateJwtToken(token)) {
                return ResponseEntity.status(401).body("Invalid or missing token");
            }

            String username = jwtUtils.getUserNameFromJwtToken(token);
            Optional<User> userOpt = userService.getUserByUsername(username);
            if (userOpt.isEmpty()) {
                return ResponseEntity.status(404).body("User not found");
            }
            User user = userOpt.get();

            RestaurantBooking booking = bookingService.getBookingById(id);
            if (booking == null) {
                return ResponseEntity.notFound().build();
            }

            // Check if user owns this booking
            if (!booking.getUser().getId().equals(user.getId())) {
                return ResponseEntity.status(403).body("Access denied");
            }

            return ResponseEntity.ok(booking);

        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error fetching booking: " + e.getMessage());
        }
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<?> cancelBooking(@PathVariable Long id, HttpServletRequest request) {
        try {
            String token = extractTokenFromRequest(request);
            if (token == null || !jwtUtils.validateJwtToken(token)) {
                return ResponseEntity.status(401).body("Invalid or missing token");
            }

            String username = jwtUtils.getUserNameFromJwtToken(token);
            Optional<User> userOpt = userService.getUserByUsername(username);
            if (userOpt.isEmpty()) {
                return ResponseEntity.status(404).body("User not found");
            }
            User user = userOpt.get();

            RestaurantBooking booking = bookingService.getBookingById(id);
            if (booking == null) {
                return ResponseEntity.notFound().build();
            }

            // Check if user owns this booking
            if (!booking.getUser().getId().equals(user.getId())) {
                return ResponseEntity.status(403).body("Access denied");
            }

            RestaurantBooking cancelledBooking = bookingService.cancelBooking(id);
            return ResponseEntity.ok(cancelledBooking);

        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error cancelling booking: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBooking(@PathVariable Long id, HttpServletRequest request) {
        try {
            String token = extractTokenFromRequest(request);
            if (token == null || !jwtUtils.validateJwtToken(token)) {
                return ResponseEntity.status(401).body("Invalid or missing token");
            }

            String username = jwtUtils.getUserNameFromJwtToken(token);
            Optional<User> userOpt = userService.getUserByUsername(username);
            if (userOpt.isEmpty()) {
                return ResponseEntity.status(404).body("User not found");
            }
            User user = userOpt.get();

            RestaurantBooking booking = bookingService.getBookingById(id);
            if (booking == null) {
                return ResponseEntity.notFound().build();
            }

            // Check if user owns this booking
            if (!booking.getUser().getId().equals(user.getId())) {
                return ResponseEntity.status(403).body("Access denied");
            }

            bookingService.deleteBooking(id);
            return ResponseEntity.ok().build();

        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error deleting booking: " + e.getMessage());
        }
    }

    private String extractTokenFromRequest(HttpServletRequest request) {
        String headerAuth = request.getHeader("Authorization");
        if (headerAuth != null && headerAuth.startsWith("Bearer ")) {
            return headerAuth.substring(7);
        }
        return null;
    }
}

package com.ridecircle.controller;

import com.ridecircle.dto.request.TripRequestDTO;
import com.ridecircle.dto.response.TripResponseDTO;
import com.ridecircle.enums.RegistrationPlan;
import com.ridecircle.servicelayer.service.TripService;
import com.ridecircle.security.jwt.JwtUtils;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173,http://localhost:5174")
public class TripController {
    @Autowired
    private TripService tripService;
    
    @Autowired
    private JwtUtils jwtUtils;

    @PostMapping("/clubs/{clubId}/trips")
    public ResponseEntity<TripResponseDTO> createTrip(@PathVariable Long clubId, 
                                                     @Valid @RequestBody TripRequestDTO tripRequestDTO,
                                                     @RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.substring(7);
            String username = jwtUtils.getUserNameFromJwtToken(token);
            TripResponseDTO createdTrip = tripService.createTripForClub(clubId, tripRequestDTO, username);
            return new ResponseEntity<>(createdTrip, HttpStatus.CREATED);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/trips")
    public ResponseEntity<List<TripResponseDTO>> getAllTrips() {
        return ResponseEntity.ok(tripService.getAllTrips());
    }

    @GetMapping("/trips/{id}")
    public ResponseEntity<TripResponseDTO> getTripById(@PathVariable Long id) {
        return ResponseEntity.ok(tripService.getTripById(id));
    }

    @PutMapping("/trips/{id}")
    @PreAuthorize("hasRole('ADMIN') or @tripService.isOwnerOfTrip(#id, authentication.name)")
    public ResponseEntity<TripResponseDTO> updateTrip(@PathVariable Long id, @Valid @RequestBody TripRequestDTO tripRequestDTO) {
        TripResponseDTO updatedTrip = tripService.updateTrip(id, tripRequestDTO);
        return ResponseEntity.ok(updatedTrip);
    }

    @DeleteMapping("/trips/{id}")
    @PreAuthorize("hasRole('ADMIN') or @tripService.isOwnerOfTrip(#id, authentication.name)")
    public ResponseEntity<Void> deleteTrip(@PathVariable Long id) {
        tripService.deleteTrip(id);
        return ResponseEntity.noContent().build();
    }
    
    // User trip registration endpoints
    @PostMapping("/trips/{tripId}/register")
    public ResponseEntity<String> registerForTrip(@PathVariable Long tripId, 
                                                 @RequestParam(defaultValue = "NORMAL") String plan,
                                                 @RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.substring(7);
            String username = jwtUtils.getUserNameFromJwtToken(token);
            RegistrationPlan registrationPlan = RegistrationPlan.valueOf(plan.toUpperCase());
            tripService.registerUserForTrip(username, tripId, registrationPlan);
            return ResponseEntity.ok("Successfully registered for the trip!");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to register for trip: " + e.getMessage());
        }
    }
    
    @DeleteMapping("/trips/{tripId}/unregister")
    public ResponseEntity<String> unregisterFromTrip(@PathVariable Long tripId, @RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.substring(7);
            String username = jwtUtils.getUserNameFromJwtToken(token);
            tripService.unregisterUserFromTrip(username, tripId);
            return ResponseEntity.ok("Successfully unregistered from the trip!");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to unregister from trip: " + e.getMessage());
        }
    }
    
    @GetMapping("/trips/my-trips")
    public ResponseEntity<List<TripResponseDTO>> getUserTrips(@RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.substring(7);
            String username = jwtUtils.getUserNameFromJwtToken(token);
            List<TripResponseDTO> userTrips = tripService.getUserTrips(username);
            return ResponseEntity.ok(userTrips);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/trips/{tripId}/is-registered")
    public ResponseEntity<Boolean> isUserRegistered(@PathVariable Long tripId, @RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.substring(7);
            String username = jwtUtils.getUserNameFromJwtToken(token);
            Boolean isRegistered = tripService.isUserRegistered(username, tripId);
            return ResponseEntity.ok(isRegistered);
        } catch (Exception e) {
            return ResponseEntity.ok(false);
        }
    }
    
    @GetMapping("/trips/{tripId}/registration-count")
    public ResponseEntity<Long> getTripRegistrationCount(@PathVariable Long tripId) {
        Long count = tripService.getTripRegistrationCount(tripId);
        return ResponseEntity.ok(count);
    }
}
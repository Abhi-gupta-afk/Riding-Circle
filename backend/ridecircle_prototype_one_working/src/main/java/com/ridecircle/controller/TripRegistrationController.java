
package com.ridecircle.controller;
import org.springframework.security.access.prepost.PreAuthorize;

import com.ridecircle.dto.request.TripRegistrationRequestDTO;
import com.ridecircle.dto.response.TripRegistrationResponseDTO;
import com.ridecircle.entity.TripRegistration;
import com.ridecircle.entity.User; // Import the User class
import com.ridecircle.entity.Trip; // Import the Trip class
import com.ridecircle.mapper.TripRegistrationMapper;
import com.ridecircle.servicelayer.service.TripRegistrationService;
import com.ridecircle.servicelayer.service.TripService;
import com.ridecircle.servicelayer.service.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/registrations")
public class TripRegistrationController {
    @Autowired
    private TripRegistrationService tripRegistrationService;

    @Autowired
    private UserService userService; // Service to fetch User

    @Autowired
    private TripService tripService; // Service to fetch Trip

    @GetMapping
    public ResponseEntity<List<TripRegistrationResponseDTO>> getAllRegistrations() {
        List<TripRegistration> registrations = tripRegistrationService.getAllRegistrations();
        List<TripRegistrationResponseDTO> response = registrations.stream()
                .map(TripRegistrationMapper::toResponseDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    @PostMapping
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<TripRegistrationResponseDTO> createRegistration(@RequestBody TripRegistrationRequestDTO registrationRequest) {
        // Fetch User and Trip entities based on IDs from the request
        Optional<User> optionalUser  = userService.getUserById(registrationRequest.getUserId());
        Optional<Trip> optionalTrip = tripService.getTripEntityById(registrationRequest.getTripId());

        if (optionalUser .isPresent() && optionalTrip.isPresent()) {
            User user = optionalUser .get(); // Get the User object
            Trip trip = optionalTrip.get(); // Get the Trip object

            // Create TripRegistration entity
            TripRegistration registration = TripRegistrationMapper.toEntity(registrationRequest, user, trip);
            TripRegistration createdRegistration = tripRegistrationService.createRegistration(registration);
            return ResponseEntity.ok(TripRegistrationMapper.toResponseDTO(createdRegistration));
        } else {
            // Handle the case where User or Trip is not found
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<Void> deleteRegistration(@PathVariable Long id) {
        tripRegistrationService.deleteRegistration(id);
        return ResponseEntity.noContent().build();
    }
}

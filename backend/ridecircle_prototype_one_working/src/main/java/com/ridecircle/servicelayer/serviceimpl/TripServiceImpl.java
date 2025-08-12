   
package com.ridecircle.servicelayer.serviceimpl;

import com.ridecircle.dto.request.TripRequestDTO;
import com.ridecircle.dto.response.TripResponseDTO;
import com.ridecircle.entity.Club;
import com.ridecircle.entity.Trip;
import com.ridecircle.entity.TripRegistration;
import com.ridecircle.entity.User;
import com.ridecircle.enums.RegistrationPlan;
import com.ridecircle.exception.ResourceNotFoundException;
import com.ridecircle.mapper.TripMapper;
import com.ridecircle.repository.ClubRepository;
import com.ridecircle.repository.TripRepository;
import com.ridecircle.repository.TripRegistrationRepository;
import com.ridecircle.repository.UserRepository;
import com.ridecircle.servicelayer.service.TripService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class TripServiceImpl implements TripService {

    @Autowired
    private TripRepository tripRepository;
    @Autowired
    private ClubRepository clubRepository;
    @Autowired
    private TripRegistrationRepository tripRegistrationRepository;
    @Autowired
    private UserRepository userRepository;

    @Override
    @Transactional
    public TripResponseDTO createTripForClub(Long clubId, TripRequestDTO tripRequestDTO, String username) {
        Club club = clubRepository.findById(clubId)
                .orElseThrow(() -> new ResourceNotFoundException("Club not found with id: " + clubId));
        
        // Get the requesting user
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));
        
        // Check if user is admin or club owner
        boolean isAdmin = user.getRoles().stream()
                .anyMatch(role -> com.ridecircle.enums.RoleEnum.ADMIN.equals(role.getName()));
        boolean isClubOwner = club.getOwner().getId().equals(user.getId());
        
        if (!isAdmin && !isClubOwner) {
            throw new RuntimeException("Access denied. Only administrators or club owners can create trips.");
        }

        Trip trip = TripMapper.toEntity(tripRequestDTO);
        trip.setOrganizingClub(club);
        Trip savedTrip = tripRepository.save(trip);
        return TripMapper.toResponseDTO(savedTrip);
    }

    @Override
    @Transactional(readOnly = true)
    public TripResponseDTO getTripById(Long tripId) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new ResourceNotFoundException("Trip not found with id: " + tripId));
        return TripMapper.toResponseDTO(trip);
    }

    @Override
    @Transactional(readOnly = true)
    public List<TripResponseDTO> getAllTrips() {
        return tripRepository.findAll().stream()
                .map(TripMapper::toResponseDTO)
                .collect(Collectors.toList());
    }
     @Override
    @Transactional(readOnly = true)
    public java.util.Optional<Trip> getTripEntityById(Long id) {
        return tripRepository.findById(id);
    }

    @Override
    @Transactional
    public TripResponseDTO updateTrip(Long tripId, TripRequestDTO tripRequestDTO) {
        Trip existingTrip = tripRepository.findById(tripId)
                .orElseThrow(() -> new ResourceNotFoundException("Trip not found with id: " + tripId));
        
        // Update trip fields
        existingTrip.setTitle(tripRequestDTO.getTitle());
        existingTrip.setDescription(tripRequestDTO.getDescription());
        existingTrip.setStartLocation(tripRequestDTO.getStartLocation());
        existingTrip.setEndLocation(tripRequestDTO.getEndLocation());
        existingTrip.setStartTime(tripRequestDTO.getStartTime());
        existingTrip.setTripType(tripRequestDTO.getTripType());
        
        Trip updatedTrip = tripRepository.save(existingTrip);
        return TripMapper.toResponseDTO(updatedTrip);
    }

    @Override
    public boolean isOwnerOfTrip(Long tripId, String username) {
        Trip trip = tripRepository.findById(tripId).orElse(null);
        if (trip == null) {
            return false;
        }
        
        // Check if the username matches the club owner's username
        return trip.getOrganizingClub() != null 
               && trip.getOrganizingClub().getOwner() != null 
               && username.equals(trip.getOrganizingClub().getOwner().getUsername());
    }

    @Override
    @Transactional
    public void deleteTrip(Long tripId) {
        if (!tripRepository.existsById(tripId)) {
            throw new ResourceNotFoundException("Trip not found with id: " + tripId);
        }
        tripRepository.deleteById(tripId);
    }

    @Override
    @Transactional
    public void registerUserForTrip(String username, Long tripId, RegistrationPlan plan) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with username: " + username));
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new ResourceNotFoundException("Trip not found with id: " + tripId));
        
        // Check if user is already registered
        if (tripRegistrationRepository.existsByUserAndTrip(user, trip)) {
            throw new RuntimeException("User is already registered for this trip");
        }
        
        TripRegistration registration = new TripRegistration();
        registration.setUser(user);
        registration.setTrip(trip);
        registration.setPlan(plan);
        tripRegistrationRepository.save(registration);
    }

    @Override
    @Transactional
    public void unregisterUserFromTrip(String username, Long tripId) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with username: " + username));
        
        Optional<TripRegistration> registration = tripRegistrationRepository.findByUserAndTrip(user.getId(), tripId);
        if (registration.isPresent()) {
            tripRegistrationRepository.delete(registration.get());
        } else {
            throw new RuntimeException("User is not registered for this trip");
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<TripResponseDTO> getUserTrips(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with username: " + username));
        
        List<TripRegistration> registrations = tripRegistrationRepository.findByUserId(user.getId());
        return registrations.stream()
                .map(registration -> TripMapper.toResponseDTO(registration.getTrip()))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Boolean isUserRegistered(String username, Long tripId) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with username: " + username));
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new ResourceNotFoundException("Trip not found with id: " + tripId));
        
        return tripRegistrationRepository.existsByUserAndTrip(user, trip);
    }

    @Override
    @Transactional(readOnly = true)
    public Long getTripRegistrationCount(Long tripId) {
        return tripRegistrationRepository.countRegistrationsByTripId(tripId);
    }
}
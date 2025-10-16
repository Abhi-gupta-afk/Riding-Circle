package com.ridecircle.servicelayer.service;

import com.ridecircle.dto.request.TripRequestDTO;
import com.ridecircle.dto.response.TripResponseDTO;
import com.ridecircle.enums.RegistrationPlan;
import java.util.List;

import com.ridecircle.entity.Trip;
import java.util.Optional;

public interface TripService {
    TripResponseDTO createTripForClub(Long clubId, TripRequestDTO tripRequestDTO, String username);
    TripResponseDTO getTripById(Long tripId);
    List<TripResponseDTO> getAllTrips();
    Optional<Trip> getTripEntityById(Long id);
    TripResponseDTO updateTrip(Long tripId, TripRequestDTO tripRequestDTO);
    void deleteTrip(Long tripId);
    
    // Authorization helper method
    boolean isOwnerOfTrip(Long tripId, String username);
    
    // Trip registration methods
    void registerUserForTrip(String username, Long tripId, RegistrationPlan plan);
    void unregisterUserFromTrip(String username, Long tripId);
    List<TripResponseDTO> getUserTrips(String username);
    Boolean isUserRegistered(String username, Long tripId);
    Long getTripRegistrationCount(Long tripId);
}
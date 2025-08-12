package com.ridecircle.mapper;

import com.ridecircle.dto.request.TripRequestDTO;
import com.ridecircle.dto.response.TripResponseDTO;
import com.ridecircle.entity.Trip;
import org.springframework.stereotype.Component;

@Component
public class TripMapper {

    public static Trip toEntity(TripRequestDTO tripRequestDTO) {
        if (tripRequestDTO == null) {
            return null;
        }

        Trip trip = new Trip();
        trip.setTitle(tripRequestDTO.getTitle());
        trip.setDescription(tripRequestDTO.getDescription());
        trip.setStartLocation(tripRequestDTO.getStartLocation());
        trip.setEndLocation(tripRequestDTO.getEndLocation());
        trip.setStartTime(tripRequestDTO.getStartTime());
        trip.setTripType(tripRequestDTO.getTripType());
        // Note: id, organizingClub, registrations, reviews are handled by the service layer
        return trip;
    }

    public static TripResponseDTO toResponseDTO(Trip trip) {
        if (trip == null) {
            return null;
        }

        TripResponseDTO tripResponseDTO = new TripResponseDTO();
        tripResponseDTO.setId(trip.getId());
        tripResponseDTO.setTitle(trip.getTitle());
        tripResponseDTO.setDescription(trip.getDescription());
        tripResponseDTO.setStartLocation(trip.getStartLocation());
        tripResponseDTO.setEndLocation(trip.getEndLocation());
        tripResponseDTO.setStartTime(trip.getStartTime());
        tripResponseDTO.setTripType(trip.getTripType());
        
        if (trip.getOrganizingClub() != null) {
            tripResponseDTO.setOrganizingClub(ClubMapper.toResponseDTO(trip.getOrganizingClub()));
        }

        return tripResponseDTO;
    }
}
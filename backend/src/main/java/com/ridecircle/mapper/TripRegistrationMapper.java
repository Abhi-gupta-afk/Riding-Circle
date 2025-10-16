package com.ridecircle.mapper;

import com.ridecircle.dto.request.TripRegistrationRequestDTO;
import com.ridecircle.dto.response.TripRegistrationResponseDTO;
import com.ridecircle.entity.TripRegistration;
import com.ridecircle.entity.User;
import com.ridecircle.entity.Trip;
import org.springframework.stereotype.Component;

@Component
public class TripRegistrationMapper {

    public static TripRegistration toEntity(TripRegistrationRequestDTO dto, User user, Trip trip) {
        if (dto == null) {
            return null;
        }
        
        TripRegistration entity = new TripRegistration();
        entity.setUser(user);
        entity.setTrip(trip);
        entity.setPlan(dto.getPlan());
        return entity;
    }

    public static TripRegistrationResponseDTO toResponseDTO(TripRegistration tripRegistration) {
        if (tripRegistration == null) {
            return null;
        }

        TripRegistrationResponseDTO responseDTO = new TripRegistrationResponseDTO();
        responseDTO.setRegistrationId(tripRegistration.getId());
        responseDTO.setPlan(tripRegistration.getPlan());
        responseDTO.setRegistrationDate(tripRegistration.getRegistrationDate());
        
        if (tripRegistration.getTrip() != null) {
            responseDTO.setTripTitle(tripRegistration.getTrip().getTitle());
        }
        
        if (tripRegistration.getUser() != null) {
            responseDTO.setUsername(tripRegistration.getUser().getUsername());
        }

        return responseDTO;
    }
}
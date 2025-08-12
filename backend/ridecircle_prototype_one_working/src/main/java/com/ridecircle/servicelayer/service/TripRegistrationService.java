package com.ridecircle.servicelayer.service;

import com.ridecircle.dto.request.TripRegistrationRequestDTO;
import com.ridecircle.dto.response.TripRegistrationResponseDTO;

import com.ridecircle.entity.TripRegistration;
import java.util.List;

public interface TripRegistrationService {
    TripRegistrationResponseDTO registerForTrip(TripRegistrationRequestDTO registrationRequest);
    List<TripRegistration> getAllRegistrations();
    TripRegistration createRegistration(TripRegistration registration);
	void deleteRegistration(Long id);
}
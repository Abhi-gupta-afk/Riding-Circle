package com.ridecircle.servicelayer.serviceimpl;

import com.ridecircle.dto.request.TripRegistrationRequestDTO;
import com.ridecircle.dto.response.TripRegistrationResponseDTO;
import com.ridecircle.entity.Trip;
import com.ridecircle.entity.TripRegistration;
import com.ridecircle.entity.User;
import com.ridecircle.exception.CustomException;
import com.ridecircle.exception.ResourceNotFoundException;
import com.ridecircle.mapper.TripRegistrationMapper;
import com.ridecircle.repository.TripRegistrationRepository;
import com.ridecircle.repository.TripRepository;
import com.ridecircle.repository.UserRepository;
import com.ridecircle.servicelayer.service.TripRegistrationService;
import com.ridecircle.util.SecurityUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class TripRegistrationServiceImpl implements TripRegistrationService {

    @Autowired
    private TripRegistrationRepository registrationRepository;

    @Autowired
    private TripRepository tripRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TripRegistrationMapper registrationMapper;

    @Override
    @Transactional
    public TripRegistrationResponseDTO registerForTrip(TripRegistrationRequestDTO request) {
        User user = SecurityUtils.getCurrentUser(userRepository);

        Trip trip = tripRepository.findById(request.getTripId())
                .orElseThrow(() -> new ResourceNotFoundException("Trip not found with id: " + request.getTripId()));

        if (registrationRepository.existsByUserAndTrip(user, trip)) {
            throw new CustomException("You are already registered for this trip.", HttpStatus.BAD_REQUEST);
        }

        TripRegistration newRegistration = new TripRegistration();
        newRegistration.setUser(user);
        newRegistration.setTrip(trip);
        newRegistration.setPlan(request.getPlan());

        TripRegistration saved = registrationRepository.save(newRegistration);
        return registrationMapper.toResponseDTO(saved);
    }

    @Override
    public List<TripRegistration> getAllRegistrations() {
        return registrationRepository.findAll();
    }

    @Override
    public TripRegistration createRegistration(TripRegistration registration) {
        return registrationRepository.save(registration);
    }

    @Override
    public void deleteRegistration(Long id) {
        TripRegistration registration = registrationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Registration not found with id: " + id));
        registrationRepository.delete(registration);
    }
}

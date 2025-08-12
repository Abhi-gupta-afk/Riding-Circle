package com.ridecircle.repository;

import com.ridecircle.entity.Trip;
import com.ridecircle.entity.TripRegistration;
import com.ridecircle.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TripRegistrationRepository extends JpaRepository<TripRegistration, Long> {

    /** Checks if a registration record exists for a specific user and trip. */
    boolean existsByUserAndTrip(User user, Trip trip);

    /** Finds a specific registration by the user and the trip's ID. Used for secure cancellation. */
    Optional<TripRegistration> findByUserAndTripId(User user, Long tripId);

    /** Finds all registrations for a given trip. Useful for admins or trip organizers. */
    List<TripRegistration> findAllByTrip(Trip trip);

    /** Finds all registrations made by a specific user. */
    List<TripRegistration> findAllByUser(User user);
    
    /** Finds all registrations for a specific user by user ID. */
    @Query("SELECT tr FROM TripRegistration tr WHERE tr.user.id = :userId")
    List<TripRegistration> findByUserId(@Param("userId") Long userId);
    
    /** Finds all registrations for a specific trip by trip ID. */
    @Query("SELECT tr FROM TripRegistration tr WHERE tr.trip.id = :tripId")
    List<TripRegistration> findByTripId(@Param("tripId") Long tripId);
    
    /** Finds a specific registration by user ID and trip ID. */
    @Query("SELECT tr FROM TripRegistration tr WHERE tr.user.id = :userId AND tr.trip.id = :tripId")
    Optional<TripRegistration> findByUserAndTrip(@Param("userId") Long userId, @Param("tripId") Long tripId);
    
    /** Counts total registrations for a specific trip. */
    @Query("SELECT COUNT(tr) FROM TripRegistration tr WHERE tr.trip.id = :tripId")
    Long countRegistrationsByTripId(@Param("tripId") Long tripId);
}
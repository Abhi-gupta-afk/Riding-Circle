package com.ridecircle.repository;

import com.ridecircle.entity.Trip;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TripRepository extends JpaRepository<Trip, Long> {
    // Inherits all necessary CRUD operations from JpaRepository.
    // We could later add methods like: List<Trip> findByTripType(TripType type);
}
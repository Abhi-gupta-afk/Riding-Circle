package com.ridecircle.repository;

import com.ridecircle.entity.Club;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ClubRepository extends JpaRepository<Club, Long> {
    // By extending JpaRepository, we inherit methods like:
    // save(), findById(), findAll(), deleteById(), etc.
    // No custom methods are needed for the initial requirements.
}
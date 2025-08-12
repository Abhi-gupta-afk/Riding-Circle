package com.ridecircle.repository;

import com.ridecircle.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    // Inherits all necessary CRUD operations from JpaRepository.
}
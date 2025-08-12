package com.ridecircle.servicelayer.service;

import com.ridecircle.dto.request.ReviewRequestDTO;
import com.ridecircle.dto.response.ReviewResponseDTO;

import com.ridecircle.entity.Review;
import java.util.List;
import java.util.Optional;

public interface ReviewService {
    ReviewResponseDTO postReviewForTrip(ReviewRequestDTO reviewRequestDTO, String username);
    List<Review> getAllReviews();
    Optional<Review> getReviewById(Long id);
    Review createReview(Review review);
    Review updateReview(Long id, Review reviewDetails);
    void deleteReview(Long id);
}
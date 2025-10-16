package com.ridecircle.mapper;

import com.ridecircle.dto.request.ReviewRequestDTO;
import com.ridecircle.dto.response.ReviewResponseDTO;
import com.ridecircle.entity.Review;
import org.springframework.stereotype.Component;

@Component
public class ReviewMapper {

    public static Review toEntity(ReviewRequestDTO reviewRequestDTO) {
        if (reviewRequestDTO == null) {
            return null;
        }

        Review review = new Review();
        review.setRating(reviewRequestDTO.getRating());
        review.setComment(reviewRequestDTO.getComment());
        // Note: id, user, trip, reviewDate are handled by the service layer
        return review;
    }

    public static ReviewResponseDTO toResponseDTO(Review review) {
        if (review == null) {
            return null;
        }

        ReviewResponseDTO reviewResponseDTO = new ReviewResponseDTO();
        reviewResponseDTO.setId(review.getId());
        reviewResponseDTO.setRating(review.getRating());
        reviewResponseDTO.setComment(review.getComment());
        reviewResponseDTO.setReviewDate(review.getReviewDate());
        
        if (review.getUser() != null) {
            reviewResponseDTO.setUsername(review.getUser().getUsername());
        } else {
            reviewResponseDTO.setUsername("Anonymous"); // Set default for null users
        }
        
        if (review.getTrip() != null) {
            reviewResponseDTO.setTripId(review.getTrip().getId());
        }

        return reviewResponseDTO;
    }
}
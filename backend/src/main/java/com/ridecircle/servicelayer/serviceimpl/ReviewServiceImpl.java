
package com.ridecircle.servicelayer.serviceimpl;

import com.ridecircle.dto.request.ReviewRequestDTO;
import com.ridecircle.dto.response.ReviewResponseDTO;
import com.ridecircle.entity.Review;
import com.ridecircle.entity.Trip;
import com.ridecircle.entity.User;
import com.ridecircle.exception.ResourceNotFoundException;
import com.ridecircle.mapper.ReviewMapper;
import com.ridecircle.repository.ReviewRepository;
import com.ridecircle.repository.TripRepository;
import com.ridecircle.repository.UserRepository;
import com.ridecircle.servicelayer.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ReviewServiceImpl implements ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;
    @Autowired
    private TripRepository tripRepository;
    @Autowired
    private UserRepository userRepository;

    @Override
    @Transactional
    public ReviewResponseDTO postReviewForTrip(ReviewRequestDTO reviewRequestDTO, String username) {
        try {
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new ResourceNotFoundException("User not found with username: " + username));
            System.out.println("Creating review for user: " + user.getUsername());
            
            Trip trip = tripRepository.findById(reviewRequestDTO.getTripId())
                    .orElseThrow(() -> new ResourceNotFoundException("Trip not found with id: " + reviewRequestDTO.getTripId()));

            // Optional: Add logic here to check if the user was registered for the trip

            Review review = ReviewMapper.toEntity(reviewRequestDTO);
            review.setUser(user);
            review.setTrip(trip);

            Review savedReview = reviewRepository.save(review);
            System.out.println("Saved review with user: " + (savedReview.getUser() != null ? savedReview.getUser().getUsername() : "NULL"));
            
            return ReviewMapper.toResponseDTO(savedReview);
        } catch (Exception e) {
            System.err.println("Error creating review: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    
    @Override
    public java.util.List<Review> getAllReviews() {
        return reviewRepository.findAll();
    }

    @Override
    public java.util.Optional<Review> getReviewById(Long id) {
        return reviewRepository.findById(id);
    }

    @Override
    public Review createReview(Review review) {
        return reviewRepository.save(review);
    }

    @Override
    public Review updateReview(Long id, Review reviewDetails) {
        Review review = reviewRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Review not found with id: " + id));
        review.setRating(reviewDetails.getRating());
        review.setComment(reviewDetails.getComment());
        return reviewRepository.save(review);
    }

    @Override
    public void deleteReview(Long id) {
        reviewRepository.deleteById(id);
    }
}
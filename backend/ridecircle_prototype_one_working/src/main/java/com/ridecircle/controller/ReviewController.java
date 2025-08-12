
package com.ridecircle.controller;
import org.springframework.security.access.prepost.PreAuthorize;

import com.ridecircle.dto.request.ReviewRequestDTO;
import com.ridecircle.dto.response.ReviewResponseDTO;
import com.ridecircle.servicelayer.service.ReviewService;
import com.ridecircle.mapper.ReviewMapper;
import com.ridecircle.security.jwt.JwtUtils;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;
    
    @Autowired
    private JwtUtils jwtUtils;

    @GetMapping
    public ResponseEntity<List<ReviewResponseDTO>> getAllReviews() {
        List<ReviewResponseDTO> reviews = reviewService.getAllReviews().stream()
                .map(ReviewMapper::toResponseDTO)
                .toList();
        return ResponseEntity.ok(reviews);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReviewResponseDTO> getReviewById(@PathVariable Long id) {
        return reviewService.getReviewById(id)
                .map(ReviewMapper::toResponseDTO)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }


    @PostMapping
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<ReviewResponseDTO> createReview(@RequestBody ReviewRequestDTO reviewRequestDTO,
                                                         @RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.substring(7); // Remove "Bearer " prefix
            String username = jwtUtils.getUserNameFromJwtToken(token);
            ReviewResponseDTO createdReview = reviewService.postReviewForTrip(reviewRequestDTO, username);
            return ResponseEntity.ok(createdReview);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }


    // Optionally implement updateReview with DTOs if needed
    // @PutMapping("/{id}")
    // public ResponseEntity<ReviewResponseDTO> updateReview(@PathVariable Long id, @RequestBody ReviewRequestDTO reviewRequestDTO) {
    //     ReviewResponseDTO updatedReview = reviewService.updateReview(id, reviewRequestDTO);
    //     return ResponseEntity.ok(updatedReview);
    // }


    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<Void> deleteReview(@PathVariable Long id) {
        reviewService.deleteReview(id);
        return ResponseEntity.noContent().build();
    }
}


package com.ridecircle.service;

import com.ridecircle.entity.User;
import com.ridecircle.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Optional;

/**
 * Utility service for user operations
 */
@Service
public class UserService {
    
    @Autowired
    private UserRepository userRepository;
    
    /**
     * Get current authenticated user
     */
    public Optional<User> getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated() && !authentication.getName().equals("anonymousUser")) {
            return userRepository.findByUsername(authentication.getName());
        }
        return Optional.empty();
    }
    
    /**
     * Get user ID from username
     */
    public Long getUserIdFromUsername(String username) {
        return userRepository.findByUsername(username)
                .map(User::getId)
                .orElse(null);
    }
    
    /**
     * Get current user ID
     */
    public Long getCurrentUserId() {
        return getCurrentUser()
                .map(User::getId)
                .orElse(null);
    }
    
    /**
     * Check if user exists by username
     */
    public boolean existsByUsername(String username) {
        return userRepository.existsByUsername(username);
    }
    
    /**
     * Check if user exists by email
     */
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }
    
    /**
     * Get user by ID
     */
    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }
    
    /**
     * Get user by username
     */
    public Optional<User> getUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }
}

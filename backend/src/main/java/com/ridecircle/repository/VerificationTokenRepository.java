package com.ridecircle.repository;

import com.ridecircle.entity.VerificationToken;
import com.ridecircle.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface VerificationTokenRepository extends JpaRepository<VerificationToken, Long> {
    
    /**
     * Find verification token by token string
     */
    Optional<VerificationToken> findByToken(String token);
    
    /**
     * Find verification token by user
     */
    Optional<VerificationToken> findByUser(User user);
    
    /**
     * Delete expired tokens
     */
    void deleteByExpiryDateBefore(LocalDateTime date);
    
    /**
     * Delete token by user
     */
    void deleteByUser(User user);
}
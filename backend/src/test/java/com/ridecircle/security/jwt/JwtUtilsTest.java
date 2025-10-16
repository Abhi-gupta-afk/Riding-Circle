package com.ridecircle.security.jwt;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.Authentication;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Arrays;

import static org.assertj.core.api.Assertions.*;

class JwtUtilsTest {

    private JwtUtils jwtUtils;

    @BeforeEach
    void setUp() {
        jwtUtils = new JwtUtils();
        // Set test JWT secret and expiration
        ReflectionTestUtils.setField(jwtUtils, "jwtSecret", 
            "bXlTZWNyZXRLZXkxMjM0NTY3ODkwMTIzNDU2Nzg5MDEyMzQ1Njc4OTAxMjM0NTY3ODkwMTIzNDU2Nzg5MA==");
        ReflectionTestUtils.setField(jwtUtils, "jwtExpirationMs", 86400000); // 24 hours
    }

    @Test
    void generateJwtToken_ShouldCreateValidToken_WhenAuthenticationProvided() {
        // Given - Mock authentication
        Authentication authentication = new UsernamePasswordAuthenticationToken(
            "testuser", 
            null, 
            Arrays.asList(new SimpleGrantedAuthority("ROLE_USER"))
        );

        // When - Generate JWT token
        String token = jwtUtils.generateJwtToken(authentication);

        // Then - Token should be created and valid
        assertThat(token).isNotNull();
        assertThat(token).isNotEmpty();
        assertThat(jwtUtils.validateJwtToken(token)).isTrue();
    }

    @Test
    void getUserNameFromJwtToken_ShouldReturnUsername_WhenValidToken() {
        // Given - Create authentication and generate token
        Authentication authentication = new UsernamePasswordAuthenticationToken("testuser", null);
        String token = jwtUtils.generateJwtToken(authentication);

        // When - Extract username from token
        String username = jwtUtils.getUserNameFromJwtToken(token);

        // Then - Should return correct username
        assertThat(username).isEqualTo("testuser");
    }

    @Test
    void validateJwtToken_ShouldReturnFalse_WhenTokenIsInvalid() {
        // Given - Invalid token
        String invalidToken = "invalid.jwt.token";

        // When & Then - Should return false for invalid token
        assertThat(jwtUtils.validateJwtToken(invalidToken)).isFalse();
    }

    @Test
    void validateJwtToken_ShouldReturnFalse_WhenTokenIsEmpty() {
        // Given - Empty token
        String emptyToken = "";

        // When & Then - Should return false for empty token
        assertThat(jwtUtils.validateJwtToken(emptyToken)).isFalse();
    }
}

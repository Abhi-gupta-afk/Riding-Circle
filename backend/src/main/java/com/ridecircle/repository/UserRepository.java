package com.ridecircle.repository;

import com.ridecircle.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    /**
     * Finds a user by their unique username. This is the primary method used by
     * Spring Security to load user details for authentication.
     *
     * @param username The user's username.
     * @return An Optional containing the User if found.
     */
    Optional<User> findByUsername(String username);

    /**
     * Checks if a user with the given username already exists in the database.
     * Used to validate new user signups and prevent duplicate usernames.
     *
     * @param username The username to check for existence.
     * @return true if a user with this username exists, false otherwise.
     */
    Boolean existsByUsername(String username);

    /**
     * Checks if a user with the given email already exists in the database.
     * Used to validate new user signups and prevent duplicate emails.
     *
     * @param email The email address to check for existence.
     * @return true if a user with this email exists, false otherwise.
     */
    Boolean existsByEmail(String email);
}
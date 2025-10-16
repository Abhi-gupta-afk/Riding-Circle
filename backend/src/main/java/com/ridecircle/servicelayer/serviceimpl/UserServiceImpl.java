package com.ridecircle.servicelayer.serviceimpl;


import com.ridecircle.entity.User;
import com.ridecircle.repository.UserRepository;
import com.ridecircle.servicelayer.service.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {
    @Autowired
    private UserRepository userRepository;

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    @Override
    public Optional<User> getUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    @Override

    public User createUser(User user) {
        // Check for duplicate username/email
        if (userRepository.existsByUsername(user.getUsername())) {
            throw new RuntimeException("Username already exists");
        }
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        // Set default enabled to false (or true if you want)
        user.setEnabled(true);
        return userRepository.save(user);
    }

    @Override

    public User updateUser(Long id, User userDetails) {
        User user = userRepository.findById(id).orElseThrow();
        // Only update allowed fields
        user.setUsername(userDetails.getUsername());
        user.setEmail(userDetails.getEmail());
        if (userDetails.getPassword() != null && !userDetails.getPassword().isEmpty()) {
            user.setPassword(userDetails.getPassword());
        }
        // Do not update roles or enabled status here for security
        return userRepository.save(user);
    }

    @Override
    public void deleteUser (Long id) {
        userRepository.deleteById(id);
    }
}

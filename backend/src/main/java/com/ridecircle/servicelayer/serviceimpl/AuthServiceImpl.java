
// ...removed invalid code above package statement...
package com.ridecircle.servicelayer.serviceimpl;

import com.ridecircle.dto.request.LoginRequest;
import com.ridecircle.dto.request.ResetPasswordRequest;
import com.ridecircle.dto.request.SignupRequest;
import com.ridecircle.dto.response.JwtResponse;
import com.ridecircle.dto.response.MessageResponse;
import com.ridecircle.entity.Role;
import com.ridecircle.entity.User;
import com.ridecircle.enums.RoleEnum;
import com.ridecircle.exception.CustomException;
import com.ridecircle.repository.RoleRepository;
import com.ridecircle.repository.UserRepository;
import com.ridecircle.security.jwt.JwtUtils;
import com.ridecircle.security.services.UserDetailsImpl;
import com.ridecircle.servicelayer.service.AuthService;
import com.ridecircle.servicelayer.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class AuthServiceImpl implements AuthService {

    @Autowired
    AuthenticationManager authenticationManager;
    @Autowired
    UserRepository userRepository;
    @Autowired
    RoleRepository roleRepository;
    @Autowired
    PasswordEncoder encoder;
    @Autowired
    JwtUtils jwtUtils;
    @Autowired
    EmailService emailService;

    @Override
    @Transactional
    public MessageResponse registerUser(SignupRequest signupRequest) {
        System.out.println("Registration attempt for username: " + signupRequest.getUsername() + ", email: " + signupRequest.getEmail());
        
        if (userRepository.existsByUsername(signupRequest.getUsername())) {
            System.out.println("Username already exists: " + signupRequest.getUsername());
            throw new CustomException("Error: Username is already taken!", org.springframework.http.HttpStatus.BAD_REQUEST);
        }
        if (userRepository.existsByEmail(signupRequest.getEmail())) {
            System.out.println("Email already exists: " + signupRequest.getEmail());
            throw new CustomException("Error: Email is already in use!", org.springframework.http.HttpStatus.BAD_REQUEST);
        }

        try {
            User user = new User(signupRequest.getUsername(), signupRequest.getEmail(), encoder.encode(signupRequest.getPassword()));
            user.setEnabled(true); // Enable user by default
            Set<Role> roles = new HashSet<>();
            Set<String> strRoles = signupRequest.getRoles();
            if (strRoles == null || strRoles.isEmpty()) {
                // Default to USER role
                Role userRole = roleRepository.findByName(RoleEnum.USER)
                    .orElseThrow(() -> new RuntimeException("Error: Role USER is not found."));
                roles.add(userRole);
            } else {
                for (String roleStr : strRoles) {
                    RoleEnum roleEnum;
                    try {
                        roleEnum = RoleEnum.valueOf(roleStr.toUpperCase());
                    } catch (IllegalArgumentException e) {
                        throw new RuntimeException("Error: Role " + roleStr + " is not valid.");
                    }
                    Role foundRole = roleRepository.findByName(roleEnum)
                        .orElseThrow(() -> new RuntimeException("Error: Role " + roleStr + " is not found."));
                    roles.add(foundRole);
                }
            }
            user.setRoles(roles);
            User savedUser = userRepository.save(user);
            System.out.println("User saved successfully with ID: " + savedUser.getId());
            // Fire-and-forget registration email (console in dev unless mail enabled)
            try { emailService.sendRegistrationEmail(savedUser); } catch (Exception mailEx) {
                System.err.println("Failed to dispatch registration email: " + mailEx.getMessage());
            }
            return new MessageResponse("User registered successfully!");
        } catch (Exception e) {
            System.err.println("Error during registration: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    @Override
    public JwtResponse authenticateUser(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);


        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        if (!userDetails.isEnabled()) {
            throw new CustomException("Error: Account is not enabled. Please verify your email.", org.springframework.http.HttpStatus.UNAUTHORIZED);
        }
        List<String> roles = userDetails.getAuthorities().stream()
                .map(item -> item.getAuthority())
                .collect(Collectors.toList());

        return new JwtResponse(jwt, userDetails.getId(), userDetails.getUsername(), userDetails.getEmail(), roles);
    }

    @Override
    @Transactional
    public MessageResponse resetPassword(ResetPasswordRequest request) {
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new CustomException("User not found", org.springframework.http.HttpStatus.NOT_FOUND));
        if (!encoder.matches(request.getOldPassword(), user.getPassword())) {
            throw new CustomException("Old password is incorrect", org.springframework.http.HttpStatus.BAD_REQUEST);
        }
        user.setPassword(encoder.encode(request.getNewPassword()));
        userRepository.save(user);
        return new MessageResponse("Password reset successful");
    }

    @Override
    @Transactional
    public MessageResponse confirmUserAccount(String token) {
        // For production use, implement email verification
        // For now, returning success message since users are enabled by default
        return new MessageResponse("Email verification is currently disabled. Users are auto-enabled upon registration.");
    }

    
    
}
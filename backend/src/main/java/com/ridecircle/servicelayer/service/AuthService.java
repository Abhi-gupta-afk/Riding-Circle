package com.ridecircle.servicelayer.service;

import com.ridecircle.dto.request.LoginRequest;
import com.ridecircle.dto.request.SignupRequest;
import com.ridecircle.dto.response.JwtResponse;
import com.ridecircle.dto.response.MessageResponse;

import com.ridecircle.dto.request.ResetPasswordRequest;

public interface AuthService {
    MessageResponse registerUser(SignupRequest signupRequest);
    JwtResponse authenticateUser(LoginRequest loginRequest);
    MessageResponse confirmUserAccount(String token);
    MessageResponse resetPassword(ResetPasswordRequest request);
}
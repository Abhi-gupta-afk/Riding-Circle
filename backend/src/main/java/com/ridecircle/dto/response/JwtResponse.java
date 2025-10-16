package com.ridecircle.dto.response;

import java.util.List;
import lombok.Getter;

@Getter
public class JwtResponse {
    private final String token;
    private final String type = "Bearer";
    private final Long id;
    private final String username;
    private final String email;
    private final List<String> roles;

    public JwtResponse(String accessToken, Long id, String username, String email, List<String> roles) {
        this.token = accessToken;
        this.id = id;
        this.username = username;
        this.email = email;
        this.roles = roles;
    }
}

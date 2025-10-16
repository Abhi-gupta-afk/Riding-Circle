package com.ridecircle.dto.response;

import lombok.Data;
import java.util.Set;

/**
 * Data Transfer Object for sending user profile information to the client.
 * It excludes sensitive information like passwords.
 */
@Data
public class UserResponseDTO {

    private Long id;
    private String username;
    private String email;
    private boolean enabled;
    private Set<String> roles;

}
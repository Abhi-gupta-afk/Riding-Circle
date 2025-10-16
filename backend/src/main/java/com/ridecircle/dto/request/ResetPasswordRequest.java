package com.ridecircle.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

public class ResetPasswordRequest {
    @Getter
    @Setter
    @NotBlank(message = "Username is required")
    private String username;

    @Getter
    @Setter
    @NotBlank(message = "Old password is required")
    private String oldPassword;

    @Getter
    @Setter
    @NotBlank(message = "New password is required")
    private String newPassword;
}

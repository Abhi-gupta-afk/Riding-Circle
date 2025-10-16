package com.ridecircle.dto.request;

import com.ridecircle.enums.TripType;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TripRequestDTO {
    @NotBlank
    private String title;

    private String description;

    @NotBlank
    private String startLocation;

    @NotBlank
    private String endLocation;

    @NotNull
    @Future(message = "Start time must be in the future")
    private LocalDateTime startTime;

    @NotNull
    private TripType tripType;
}
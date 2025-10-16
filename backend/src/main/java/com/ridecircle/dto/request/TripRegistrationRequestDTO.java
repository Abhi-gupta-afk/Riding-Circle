package com.ridecircle.dto.request;

import com.ridecircle.enums.RegistrationPlan;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TripRegistrationRequestDTO {
    @NotNull
    private Long tripId;

    @NotNull
    private Long userId;

    @NotNull
    private RegistrationPlan plan;
}
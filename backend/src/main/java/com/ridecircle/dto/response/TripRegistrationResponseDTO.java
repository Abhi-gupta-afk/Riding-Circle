package com.ridecircle.dto.response;

import com.ridecircle.enums.RegistrationPlan;
import java.time.LocalDateTime;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TripRegistrationResponseDTO {
    private Long registrationId;
    private String tripTitle;
    private String username;
    private RegistrationPlan plan;
    private LocalDateTime registrationDate;

}
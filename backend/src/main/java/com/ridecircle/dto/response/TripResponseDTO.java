package com.ridecircle.dto.response;

import com.ridecircle.enums.TripType;
import java.time.LocalDateTime;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TripResponseDTO {
    private Long id;
    private String title;
    private String description;
    private String startLocation;
    private String endLocation;
    private LocalDateTime startTime;
    private TripType tripType;
    private ClubResponseDTO organizingClub;

}
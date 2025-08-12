package com.ridecircle.dto.response;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ReviewResponseDTO {
    private Long id;
    private int rating;
    private String comment;
    private LocalDateTime reviewDate;
    private String username;
    private Long tripId;
}
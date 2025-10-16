package com.ridecircle.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ClubRequestDTO {
    @NotBlank(message = "Club name cannot be blank")
    private String name;

    @NotBlank(message = "Brand cannot be blank")
    private String brand;

    private String description;
    
    @NotBlank(message = "City cannot be blank")
    private String city;
}
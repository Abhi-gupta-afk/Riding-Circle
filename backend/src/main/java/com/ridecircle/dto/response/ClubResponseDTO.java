package com.ridecircle.dto.response;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ClubResponseDTO {
    private Long id;
    private String name;
    private String brand;
    private String description;
    private String city;
    private String ownerUsername;

}
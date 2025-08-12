package com.ridecircle.mapper;

import com.ridecircle.dto.request.ClubRequestDTO;
import com.ridecircle.dto.response.ClubResponseDTO;
import com.ridecircle.entity.Club;
import org.springframework.stereotype.Component;

@Component
public class ClubMapper {

    public static Club toEntity(ClubRequestDTO clubRequestDTO) {
        if (clubRequestDTO == null) {
            return null;
        }

        Club club = new Club();
        club.setName(clubRequestDTO.getName());
        club.setBrand(clubRequestDTO.getBrand());
        club.setDescription(clubRequestDTO.getDescription());
        club.setCity(clubRequestDTO.getCity());
        // Note: id, owner, trips are handled by the service layer
        return club;
    }

    public static ClubResponseDTO toResponseDTO(Club club) {
        if (club == null) {
            return null;
        }

        ClubResponseDTO clubResponseDTO = new ClubResponseDTO();
        clubResponseDTO.setId(club.getId());
        clubResponseDTO.setName(club.getName());
        clubResponseDTO.setBrand(club.getBrand());
        clubResponseDTO.setDescription(club.getDescription());
        clubResponseDTO.setCity(club.getCity());
        
        if (club.getOwner() != null) {
            clubResponseDTO.setOwnerUsername(club.getOwner().getUsername());
        }

        return clubResponseDTO;
    }
}
package com.ridecircle.servicelayer.service;

import com.ridecircle.dto.request.ClubRequestDTO;
import com.ridecircle.dto.response.ClubResponseDTO;
import java.util.List;

public interface ClubService {
    ClubResponseDTO createClub(ClubRequestDTO clubRequestDTO);
    ClubResponseDTO getClubById(Long clubId);
    List<ClubResponseDTO> getAllClubs();
    ClubResponseDTO updateClub(Long clubId, ClubRequestDTO clubRequestDTO);
    void deleteClub(Long clubId);
    
    // Club membership methods
    void joinClub(String username, Long clubId);
    void leaveClub(String username, Long clubId);
    List<ClubResponseDTO> getUserClubs(String username);
    Boolean isUserMember(String username, Long clubId);
}
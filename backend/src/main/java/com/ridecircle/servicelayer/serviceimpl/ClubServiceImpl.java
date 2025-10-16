package com.ridecircle.servicelayer.serviceimpl;

import com.ridecircle.dto.request.ClubRequestDTO;
import com.ridecircle.dto.response.ClubResponseDTO;
import com.ridecircle.entity.Club;
import com.ridecircle.entity.ClubMembership;
import com.ridecircle.entity.User;
import com.ridecircle.exception.ResourceNotFoundException;
import com.ridecircle.mapper.ClubMapper;
import com.ridecircle.repository.ClubRepository;
import com.ridecircle.repository.ClubMembershipRepository;
import com.ridecircle.repository.UserRepository;
import com.ridecircle.servicelayer.service.ClubService;
import com.ridecircle.util.SecurityUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ClubServiceImpl implements ClubService {

    @Autowired
    private ClubRepository clubRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ClubMembershipRepository clubMembershipRepository;

    @Override
    @Transactional
    public ClubResponseDTO createClub(ClubRequestDTO clubRequestDTO) {
        User owner = SecurityUtils.getCurrentUser(userRepository);
        Club club = ClubMapper.toEntity(clubRequestDTO);
        club.setOwner(owner);
        Club savedClub = clubRepository.save(club);
        return ClubMapper.toResponseDTO(savedClub);
    }

    @Override
    @Transactional(readOnly = true)
    public ClubResponseDTO getClubById(Long clubId) {
        Club club = clubRepository.findById(clubId)
                .orElseThrow(() -> new ResourceNotFoundException("Club not found with id: " + clubId));
        return ClubMapper.toResponseDTO(club);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ClubResponseDTO> getAllClubs() {
        return clubRepository.findAll().stream()
                .map(ClubMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public ClubResponseDTO updateClub(Long clubId, ClubRequestDTO clubRequestDTO) {
        Club existingClub = clubRepository.findById(clubId)
                .orElseThrow(() -> new ResourceNotFoundException("Club not found with id: " + clubId));
        
        // Update club fields
        existingClub.setName(clubRequestDTO.getName());
        existingClub.setDescription(clubRequestDTO.getDescription());
        existingClub.setBrand(clubRequestDTO.getBrand());
        existingClub.setCity(clubRequestDTO.getCity());
        
        Club updatedClub = clubRepository.save(existingClub);
        return ClubMapper.toResponseDTO(updatedClub);
    }

    @Override
    @Transactional
    public void deleteClub(Long clubId) {
        if (!clubRepository.existsById(clubId)) {
            throw new ResourceNotFoundException("Club not found with id: " + clubId);
        }
        
        // First delete all club memberships to avoid foreign key constraint violation
        clubMembershipRepository.deleteByClubId(clubId);
        
        // Then delete the club
        clubRepository.deleteById(clubId);
    }

    @Override
    @Transactional
    public void joinClub(String username, Long clubId) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with username: " + username));
        Club club = clubRepository.findById(clubId)
                .orElseThrow(() -> new ResourceNotFoundException("Club not found with id: " + clubId));
        
        // Check if user is already a member
        if (clubMembershipRepository.existsByUserAndClubAndIsActive(user, club, true)) {
            throw new RuntimeException("User is already a member of this club");
        }
        
        ClubMembership membership = new ClubMembership();
        membership.setUser(user);
        membership.setClub(club);
        membership.setIsActive(true);
        clubMembershipRepository.save(membership);
    }

    @Override
    @Transactional
    public void leaveClub(String username, Long clubId) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with username: " + username));
        Club club = clubRepository.findById(clubId)
                .orElseThrow(() -> new ResourceNotFoundException("Club not found with id: " + clubId));
        
        Optional<ClubMembership> membership = clubMembershipRepository.findActiveByUserAndClub(user.getId(), clubId);
        if (membership.isPresent()) {
            membership.get().setIsActive(false);
            clubMembershipRepository.save(membership.get());
        } else {
            throw new RuntimeException("User is not a member of this club");
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<ClubResponseDTO> getUserClubs(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with username: " + username));
        
        List<ClubMembership> memberships = clubMembershipRepository.findActiveClubsByUserId(user.getId());
        return memberships.stream()
                .map(membership -> ClubMapper.toResponseDTO(membership.getClub()))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Boolean isUserMember(String username, Long clubId) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with username: " + username));
        Club club = clubRepository.findById(clubId)
                .orElseThrow(() -> new ResourceNotFoundException("Club not found with id: " + clubId));
        
        return clubMembershipRepository.existsByUserAndClubAndIsActive(user, club, true);
    }
}
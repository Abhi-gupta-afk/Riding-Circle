package com.ridecircle.controller;

import com.ridecircle.dto.request.ClubRequestDTO;
import com.ridecircle.dto.response.ClubResponseDTO;
import com.ridecircle.servicelayer.service.ClubService;
import com.ridecircle.security.jwt.JwtUtils;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/clubs")
@CrossOrigin(origins = "http://localhost:5173,http://localhost:5174")
public class ClubController {
    @Autowired
    private ClubService clubService;
    
    @Autowired
    private JwtUtils jwtUtils;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ClubResponseDTO> createClub(@Valid @RequestBody ClubRequestDTO clubRequestDTO) {
        ClubResponseDTO createdClub = clubService.createClub(clubRequestDTO);
        return new ResponseEntity<>(createdClub, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<ClubResponseDTO>> getAllClubs() {
        return ResponseEntity.ok(clubService.getAllClubs());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ClubResponseDTO> getClubById(@PathVariable Long id) {
        return ResponseEntity.ok(clubService.getClubById(id));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ClubResponseDTO> updateClub(@PathVariable Long id, @Valid @RequestBody ClubRequestDTO clubRequestDTO) {
        ClubResponseDTO updatedClub = clubService.updateClub(id, clubRequestDTO);
        return ResponseEntity.ok(updatedClub);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteClub(@PathVariable Long id) {
        clubService.deleteClub(id);
        return ResponseEntity.noContent().build();
    }
    
    // User club membership endpoints
    @PostMapping("/{clubId}/join")
    public ResponseEntity<String> joinClub(@PathVariable Long clubId, @RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.substring(7);
            String username = jwtUtils.getUserNameFromJwtToken(token);
            clubService.joinClub(username, clubId);
            return ResponseEntity.ok("Successfully joined the club!");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to join club: " + e.getMessage());
        }
    }
    
    @DeleteMapping("/{clubId}/leave")
    public ResponseEntity<String> leaveClub(@PathVariable Long clubId, @RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.substring(7);
            String username = jwtUtils.getUserNameFromJwtToken(token);
            clubService.leaveClub(username, clubId);
            return ResponseEntity.ok("Successfully left the club!");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to leave club: " + e.getMessage());
        }
    }
    
    @GetMapping("/my-clubs")
    public ResponseEntity<List<ClubResponseDTO>> getUserClubs(@RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.substring(7);
            String username = jwtUtils.getUserNameFromJwtToken(token);
            List<ClubResponseDTO> userClubs = clubService.getUserClubs(username);
            return ResponseEntity.ok(userClubs);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/{clubId}/is-member")
    public ResponseEntity<Boolean> isClubMember(@PathVariable Long clubId, @RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.substring(7);
            String username = jwtUtils.getUserNameFromJwtToken(token);
            Boolean isMember = clubService.isUserMember(username, clubId);
            return ResponseEntity.ok(isMember);
        } catch (Exception e) {
            return ResponseEntity.ok(false);
        }
    }
}
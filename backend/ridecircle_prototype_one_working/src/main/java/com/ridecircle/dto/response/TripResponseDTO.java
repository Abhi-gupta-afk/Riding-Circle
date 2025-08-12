package com.ridecircle.dto.response;

import com.ridecircle.enums.TripType;
import java.time.LocalDateTime;

public class TripResponseDTO {
    private Long id;
    private String title;
    private String description;
    private String startLocation;
    private String endLocation;
    private LocalDateTime startTime;
    private TripType tripType;
    private ClubResponseDTO organizingClub;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getStartLocation() { return startLocation; }
    public void setStartLocation(String startLocation) { this.startLocation = startLocation; }
    public String getEndLocation() { return endLocation; }
    public void setEndLocation(String endLocation) { this.endLocation = endLocation; }
    public LocalDateTime getStartTime() { return startTime; }
    public void setStartTime(LocalDateTime startTime) { this.startTime = startTime; }
    public TripType getTripType() { return tripType; }
    public void setTripType(TripType tripType) { this.tripType = tripType; }
    public ClubResponseDTO getOrganizingClub() { return organizingClub; }
    public void setOrganizingClub(ClubResponseDTO organizingClub) { this.organizingClub = organizingClub; }
}
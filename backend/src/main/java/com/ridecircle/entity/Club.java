package com.ridecircle.entity;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.util.Set;
import java.util.HashSet;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "clubs") 
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Club {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String brand; // Key requirement: e.g., "Royal Enfield", "Harley Davidson"
    
    private String description;
    private String city;

    // A club has one owner (a User)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_user_id", nullable = false)
    private User owner;
    
    // A club organizes many trips
    @OneToMany(mappedBy = "organizingClub", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private Set<Trip> trips = new HashSet<>();

    // Lombok generates getters and setters
}
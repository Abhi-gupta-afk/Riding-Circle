package com.ridecircle.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "club_memberships")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ClubMembership {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "club_id", nullable = false)
    private Club club;
    
    @Column(nullable = false)
    private LocalDateTime joinedDate;
    
    @Column(nullable = false)
    private Boolean isActive = true;
    
    @PrePersist
    protected void onCreate() {
        joinedDate = LocalDateTime.now();
    }

    // Lombok generates getters and setters
}

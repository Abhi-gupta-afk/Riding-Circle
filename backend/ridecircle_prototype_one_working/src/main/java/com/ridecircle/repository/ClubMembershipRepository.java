package com.ridecircle.repository;

import com.ridecircle.entity.ClubMembership;
import com.ridecircle.entity.User;
import com.ridecircle.entity.Club;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ClubMembershipRepository extends JpaRepository<ClubMembership, Long> {
    
    @Query("SELECT cm FROM ClubMembership cm WHERE cm.user.id = :userId AND cm.isActive = true")
    List<ClubMembership> findActiveClubsByUserId(@Param("userId") Long userId);
    
    @Query("SELECT cm FROM ClubMembership cm WHERE cm.club.id = :clubId AND cm.isActive = true")
    List<ClubMembership> findActiveMembersByClubId(@Param("clubId") Long clubId);
    
    @Query("SELECT cm FROM ClubMembership cm WHERE cm.user.id = :userId AND cm.club.id = :clubId AND cm.isActive = true")
    Optional<ClubMembership> findActiveByUserAndClub(@Param("userId") Long userId, @Param("clubId") Long clubId);
    
    boolean existsByUserAndClubAndIsActive(User user, Club club, Boolean isActive);
}

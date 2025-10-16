package com.ridecircle.repository;

import com.ridecircle.entity.RestaurantBooking;
import com.ridecircle.entity.RestaurantBooking.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface RestaurantBookingRepository extends JpaRepository<RestaurantBooking, Long> {
    
    List<RestaurantBooking> findByUserIdOrderByCreatedAtDesc(Long userId);
    
    List<RestaurantBooking> findByRestaurantIdOrderByCreatedAtDesc(Long restaurantId);
    
    List<RestaurantBooking> findByUserIdAndStatusOrderByCreatedAtDesc(Long userId, BookingStatus status);
    
    List<RestaurantBooking> findByRestaurantIdAndStatusOrderByCreatedAtDesc(Long restaurantId, BookingStatus status);
    
    Optional<RestaurantBooking> findByConfirmationCode(String confirmationCode);
    
    @Query("SELECT rb FROM RestaurantBooking rb WHERE rb.user.id = :userId AND rb.reservationDateTime BETWEEN :startDate AND :endDate ORDER BY rb.reservationDateTime")
    List<RestaurantBooking> findByUserIdAndReservationDateTimeBetween(@Param("userId") Long userId, 
                                                                      @Param("startDate") LocalDateTime startDate, 
                                                                      @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT rb FROM RestaurantBooking rb WHERE rb.restaurant.id = :restaurantId AND rb.reservationDateTime BETWEEN :startDate AND :endDate ORDER BY rb.reservationDateTime")
    List<RestaurantBooking> findByRestaurantIdAndReservationDateTimeBetween(@Param("restaurantId") Long restaurantId, 
                                                                            @Param("startDate") LocalDateTime startDate, 
                                                                            @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT COUNT(rb) FROM RestaurantBooking rb WHERE rb.restaurant.id = :restaurantId AND rb.reservationDateTime BETWEEN :startDate AND :endDate AND rb.status IN ('CONFIRMED', 'PENDING')")
    Long countActiveBookingsForRestaurantInTimeRange(@Param("restaurantId") Long restaurantId, 
                                                    @Param("startDate") LocalDateTime startDate, 
                                                    @Param("endDate") LocalDateTime endDate);
}

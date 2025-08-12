package com.ridecircle.service;

import com.ridecircle.entity.RestaurantBooking;
import com.ridecircle.entity.RestaurantBooking.BookingStatus;
import com.ridecircle.repository.RestaurantBookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class RestaurantBookingService {

    @Autowired
    private RestaurantBookingRepository bookingRepository;

    public RestaurantBooking createBooking(RestaurantBooking booking) {
        booking.setStatus(BookingStatus.PENDING);
        booking.setCreatedAt(LocalDateTime.now());
        return bookingRepository.save(booking);
    }

    public List<RestaurantBooking> getUserBookings(Long userId) {
        return bookingRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public RestaurantBooking getBookingById(Long id) {
        Optional<RestaurantBooking> booking = bookingRepository.findById(id);
        return booking.orElse(null);
    }

    public RestaurantBooking updateBooking(RestaurantBooking booking) {
        return bookingRepository.save(booking);
    }

    public RestaurantBooking cancelBooking(Long id) {
        Optional<RestaurantBooking> bookingOpt = bookingRepository.findById(id);
        if (bookingOpt.isPresent()) {
            RestaurantBooking booking = bookingOpt.get();
            booking.setStatus(BookingStatus.CANCELLED);
            return bookingRepository.save(booking);
        }
        return null;
    }

    public void deleteBooking(Long id) {
        bookingRepository.deleteById(id);
    }

    public List<RestaurantBooking> getRestaurantBookings(Long restaurantId) {
        return bookingRepository.findByRestaurantIdOrderByCreatedAtDesc(restaurantId);
    }

    public List<RestaurantBooking> getBookingsByStatus(BookingStatus status) {
        return bookingRepository.findByUserIdAndStatusOrderByCreatedAtDesc(null, status);
    }

    public List<RestaurantBooking> getUpcomingBookings(Long userId) {
        return bookingRepository.findByUserIdAndStatusOrderByCreatedAtDesc(userId, BookingStatus.CONFIRMED);
    }
}

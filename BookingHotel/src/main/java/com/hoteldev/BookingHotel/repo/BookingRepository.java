package com.hoteldev.BookingHotel.repo;

import com.hoteldev.BookingHotel.entity.Bookings;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface BookingRepository extends JpaRepository<Bookings,Long> {
    Optional<Bookings> findByBookingConfirmationCode(String confirmationCode);
}

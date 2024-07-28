package com.hoteldev.BookingHotel.service.interfac;

import com.hoteldev.BookingHotel.dto.Response;
import com.hoteldev.BookingHotel.entity.Bookings;

import java.math.BigDecimal;

public interface IBookingService {
    Response saveBooking(Long roomId, Long userId, Bookings bookingRequest, BigDecimal totalAmount);

    Response findBookingByConfirmationCode(String confirmationCode);

    Response getAllBookings();

    Response cancelBooking(Long bookingId);
}

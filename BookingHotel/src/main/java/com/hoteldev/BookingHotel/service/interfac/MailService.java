package com.hoteldev.BookingHotel.service.interfac;

import com.hoteldev.BookingHotel.dto.BookingDTO;
import com.hoteldev.BookingHotel.entity.Bills;

public interface MailService {
    void sendMailTest();

    void sendMailBooking(BookingDTO booking, Bills bills);
}

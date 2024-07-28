package com.hoteldev.BookingHotel.service.interfac;

import com.hoteldev.BookingHotel.dto.LoginRequest;
import com.hoteldev.BookingHotel.dto.Response;
import com.hoteldev.BookingHotel.entity.Users;

public interface IUserService {
    Response register(Users user);

    Response login(LoginRequest loginRequest);

    Response getAllUsers();

    Response getUserBookingHistory(String userId);

    Response deleteUser(String userId);

    Response getUserById(String userId);

    Response getMyInfo(String email);

}

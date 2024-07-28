package com.hoteldev.BookingHotel.utils;

import com.hoteldev.BookingHotel.dto.BillDTO;
import com.hoteldev.BookingHotel.dto.BookingDTO;
import com.hoteldev.BookingHotel.dto.RoomDTO;
import com.hoteldev.BookingHotel.dto.UserDTO;
import com.hoteldev.BookingHotel.entity.Bills;
import com.hoteldev.BookingHotel.entity.Bookings;
import com.hoteldev.BookingHotel.entity.Rooms;
import com.hoteldev.BookingHotel.entity.Users;

import java.security.SecureRandom;
import java.util.List;
import java.util.stream.Collectors;

public class Utils {
    private static final String ALPHANUMERIC_STRING = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    private static final SecureRandom secureRandom = new SecureRandom();

    public static String generateRandomConfirmationCode(int length) {
        StringBuilder stringBuilder = new StringBuilder();
        for (int i = 0; i < length; i++) {
            int randomIndex = secureRandom.nextInt(ALPHANUMERIC_STRING.length());
            char randomChar = ALPHANUMERIC_STRING.charAt(randomIndex);
            stringBuilder.append(randomChar);
        }
        return stringBuilder.toString();
    }


    public static RoomDTO mapRoomEntityToRoomDTO(Rooms room) {
        RoomDTO roomDTO = new RoomDTO();

        roomDTO.setId(room.getId());
        roomDTO.setRoomCode(room.getRoomCode());
        roomDTO.setRoomType(room.getRoomType());
        roomDTO.setRoomPrice(room.getRoomPrice());
        roomDTO.setRoomPhotoUrl(room.getRoomPhotoUrl());
        roomDTO.setRoomDescription(room.getRoomDescription());
        return roomDTO;
    }
    public static UserDTO mapUserEntityToUserDTO(Users user) {
        UserDTO userDTO = new UserDTO();

        userDTO.setId(user.getId());
        userDTO.setName(user.getName());
        userDTO.setEmail(user.getEmail());
        userDTO.setPhoneNumber(user.getPhoneNumber());
        userDTO.setRole(user.getRole());
        return userDTO;
    }

    public static BookingDTO mapBookingEntityToBookingDTO(Bookings booking) {
        BookingDTO bookingDTO = new BookingDTO();
        // Map simple fields
        bookingDTO.setId(booking.getId());
        bookingDTO.setCheckInDate(booking.getCheckInDate());
        bookingDTO.setCheckOutDate(booking.getCheckOutDate());
        bookingDTO.setNumOfAdults(booking.getNumOfAdults());
        bookingDTO.setNumOfChildren(booking.getNumOfChildren());
        bookingDTO.setTotalNumOfGuest(booking.getTotalNumOfGuest());
        bookingDTO.setBookingConfirmationCode(booking.getBookingConfirmationCode());
        return bookingDTO;
    }

    public static BillDTO mapBillEntityToBillDTO(Bills bill) {
        BillDTO billDTO = new BillDTO();
        // Map simple fields
        billDTO.setId(bill.getId());
        billDTO.setPaymentDate(bill.getPaymentDate());
        billDTO.setNote(billDTO.getNote());
        billDTO.setPaymentMethod(bill.getPaymentMethod());
        billDTO.setTotalAmount(bill.getTotalAmount());
        return billDTO;
    }

    public static BillDTO mapBillEntityToBillDTOPlusBooking(Bills bill) {
        BillDTO billDTO = new BillDTO();
        // Map simple fields
        billDTO.setId(bill.getId());
        billDTO.setPaymentDate(bill.getPaymentDate());
        billDTO.setNote(billDTO.getNote());
        billDTO.setPaymentMethod(bill.getPaymentMethod());
        billDTO.setTotalAmount(bill.getTotalAmount());

        if(bill.getBooking() != null) {
            BookingDTO bookingDTO = new BookingDTO();
            // Map simple fields
            bookingDTO.setId(bill.getBooking().getId());
            bookingDTO.setCheckInDate(bill.getBooking().getCheckInDate());
            bookingDTO.setCheckOutDate(bill.getBooking().getCheckOutDate());
            bookingDTO.setNumOfAdults(bill.getBooking().getNumOfAdults());
            bookingDTO.setNumOfChildren(bill.getBooking().getNumOfChildren());
            bookingDTO.setTotalNumOfGuest(bill.getBooking().getTotalNumOfGuest());
            bookingDTO.setBookingConfirmationCode(bill.getBooking().getBookingConfirmationCode());
        }
        return billDTO;
    }


    public static RoomDTO mapRoomEntityToRoomDTOPlusBookings(Rooms room) {
        RoomDTO roomDTO = new RoomDTO();

        roomDTO.setId(room.getId());
        roomDTO.setRoomCode(room.getRoomCode());
        roomDTO.setRoomType(room.getRoomType());
        roomDTO.setRoomPrice(room.getRoomPrice());
        roomDTO.setRoomPhotoUrl(room.getRoomPhotoUrl());
        roomDTO.setRoomDescription(room.getRoomDescription());

        if (room.getBookings() != null) {
            roomDTO.setBookings(room.getBookings().stream().map(Utils::mapBookingEntityToBookingDTO).collect(Collectors.toList()));
        }
        return roomDTO;
    }



    public static BookingDTO mapBookingEntityToBookingDTOPlusBookedRooms(Bookings booking, boolean mapUser) {

        BookingDTO bookingDTO = new BookingDTO();
        // Map simple fields
        bookingDTO.setId(booking.getId());
        bookingDTO.setCheckInDate(booking.getCheckInDate());
        bookingDTO.setCheckOutDate(booking.getCheckOutDate());
        bookingDTO.setNumOfAdults(booking.getNumOfAdults());
        bookingDTO.setNumOfChildren(booking.getNumOfChildren());
        bookingDTO.setTotalNumOfGuest(booking.getTotalNumOfGuest());
        bookingDTO.setBookingConfirmationCode(booking.getBookingConfirmationCode());
        if (mapUser) {
            bookingDTO.setUser(Utils.mapUserEntityToUserDTO(booking.getUser()));
        }
        if (booking.getBills() != null) {
            bookingDTO.setBills(booking.getBills().stream().map(Utils::mapBillEntityToBillDTO).collect(Collectors.toList()));
        }
        if (booking.getRoom() != null) {
            RoomDTO roomDTO = new RoomDTO();

            roomDTO.setId(booking.getRoom().getId());
            roomDTO.setRoomType(booking.getRoom().getRoomType());
            roomDTO.setRoomCode(booking.getRoom().getRoomCode());
            roomDTO.setRoomPrice(booking.getRoom().getRoomPrice());
            roomDTO.setRoomPhotoUrl(booking.getRoom().getRoomPhotoUrl());
            roomDTO.setRoomDescription(booking.getRoom().getRoomDescription());
            bookingDTO.setRoom(roomDTO);
        }

        return bookingDTO;
    }

    public static BookingDTO mapBookingEntityToBookingDTOPlusBill(Bookings booking) {

        BookingDTO bookingDTO = new BookingDTO();
        // Map simple fields
        bookingDTO.setId(booking.getId());
        bookingDTO.setCheckInDate(booking.getCheckInDate());
        bookingDTO.setCheckOutDate(booking.getCheckOutDate());
        bookingDTO.setNumOfAdults(booking.getNumOfAdults());
        bookingDTO.setNumOfChildren(booking.getNumOfChildren());
        bookingDTO.setTotalNumOfGuest(booking.getTotalNumOfGuest());
        bookingDTO.setBookingConfirmationCode(booking.getBookingConfirmationCode());

        if (booking.getBills() != null) {
            bookingDTO.setBills(booking.getBills().stream().map(Utils::mapBillEntityToBillDTO).collect(Collectors.toList()));
        }
        return bookingDTO;
    }


    public static UserDTO mapUserEntityToUserDTOPlusUserBookingsAndRoom(Users user) {
        UserDTO userDTO = new UserDTO();

        userDTO.setId(user.getId());
        userDTO.setName(user.getName());
        userDTO.setEmail(user.getEmail());
        userDTO.setPhoneNumber(user.getPhoneNumber());
        userDTO.setRole(user.getRole());

        if (!user.getBookings().isEmpty()) {
            userDTO.setBookings(user.getBookings().stream().map(booking -> mapBookingEntityToBookingDTOPlusBookedRooms(booking, false)).collect(Collectors.toList()));
        }
        return userDTO;
    }

    public static List<UserDTO> mapUserListEntityToUserListDTO(List<Users> userList) {
        return userList.stream().map(Utils::mapUserEntityToUserDTO).collect(Collectors.toList());
    }

    public static List<RoomDTO> mapRoomListEntityToRoomListDTO(List<Rooms> roomList) {
        return roomList.stream().map(Utils::mapRoomEntityToRoomDTO).collect(Collectors.toList());
    }

    public static List<BookingDTO> mapBookingListEntityToBookingListDTO(List<Bookings> bookingList) {
        return bookingList.stream().map(Utils::mapBookingEntityToBookingDTO).collect(Collectors.toList());
    }

    public static List<BillDTO> mapBillListEntityToBillListDTO(List<Bills> billList) {
        return billList.stream().map(Utils::mapBillEntityToBillDTO).collect(Collectors.toList());
    }


}

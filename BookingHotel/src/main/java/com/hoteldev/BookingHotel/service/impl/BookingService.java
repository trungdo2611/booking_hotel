package com.hoteldev.BookingHotel.service.impl;

import com.hoteldev.BookingHotel.dto.BookingDTO;
import com.hoteldev.BookingHotel.dto.Response;
import com.hoteldev.BookingHotel.entity.Bills;
import com.hoteldev.BookingHotel.entity.Bookings;
import com.hoteldev.BookingHotel.entity.Rooms;
import com.hoteldev.BookingHotel.entity.Users;
import com.hoteldev.BookingHotel.exception.OurException;
import com.hoteldev.BookingHotel.repo.BillRepository;
import com.hoteldev.BookingHotel.repo.BookingRepository;
import com.hoteldev.BookingHotel.repo.RoomRepository;
import com.hoteldev.BookingHotel.repo.UserRepository;
import com.hoteldev.BookingHotel.service.interfac.IBookingService;
import com.hoteldev.BookingHotel.service.interfac.IRoomService;
import com.hoteldev.BookingHotel.service.interfac.MailService;
import com.hoteldev.BookingHotel.utils.Utils;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
public class BookingService implements IBookingService {
    @Autowired
    private BookingRepository bookingRepository;
    @Autowired
    private BillRepository billRepository;
    @Autowired
    private IRoomService roomService;
    @Autowired
    private RoomRepository roomRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private final MailService mailService;

    public BookingService(MailService mailService) {
        this.mailService = mailService;
    }

    @Override
    public Response saveBooking(Long roomId, Long userId, Bookings bookingRequest, BigDecimal totalAmount) {
        Response response = new Response();
        Bills bill = new Bills();
        LocalDate paymentDate = LocalDate.now();
        try {
            if(bookingRequest.getCheckOutDate().isBefore(bookingRequest.getCheckInDate())) {
                throw new IllegalArgumentException("Ngày checkin phải trước ngày checkout");
            }
            Rooms room = roomRepository.findById(roomId).orElseThrow(() -> new OurException("Room Not Found"));
            Users user = userRepository.findById(userId).orElseThrow(() -> new OurException("User Not Found"));

            List<Bookings> existingBookings = room.getBookings();

            if (!roomIsAvailable(bookingRequest, existingBookings)) {
                throw new OurException("Phòng đã được đặt trước trong khoảng thời gian này");
            }
            bookingRequest.setRoom(room);
            bookingRequest.setUser(user);
            String bookingConfirmationCode = Utils.generateRandomConfirmationCode(10);
            bookingRequest.setBookingConfirmationCode(bookingConfirmationCode);
            bill.setBooking(bookingRequest);
            bill.setTotalAmount(totalAmount);
            bill.setPaymentMethod("Online");
            bill.setPaymentDate(paymentDate);
            bookingRepository.save(bookingRequest);
            billRepository.save(bill);
            response.setStatusCode(200);
            response.setMessage("successful");
            response.setBookingConfirmationCode(bookingConfirmationCode);

            //send email
            BookingDTO bookingDTO = Utils.mapBookingEntityToBookingDTOPlusBookedRooms(bookingRequest, true);
            mailService.sendMailBooking(bookingDTO, bill);
        } catch (OurException e) {
            response.setStatusCode(404);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error Saving a booking: " + e.getMessage());
        }
        return response;
    }


    @Override
    public Response findBookingByConfirmationCode(String confirmationCode) {
        Response response = new Response();

        try {
            Bookings booking = bookingRepository.findByBookingConfirmationCode(confirmationCode).orElseThrow(() -> new OurException("Booking Not Found"));
            BookingDTO bookingDTO = Utils.mapBookingEntityToBookingDTOPlusBookedRooms(booking, true);
            response.setStatusCode(200);
            response.setMessage("successful");
            response.setBooking(bookingDTO);
        } catch (OurException e) {
            response.setStatusCode(404);
            response.setMessage(e.getMessage());

        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error Finding a booking: " + e.getMessage());

        }
        return response;
    }

    @Override
    public Response getAllBookings() {
        Response response = new Response();

        try {
            List<Bookings> bookingList = bookingRepository.findAll(Sort.by(Sort.Direction.DESC, "id"));
            List<BookingDTO> bookingDTOList = Utils.mapBookingListEntityToBookingListDTO(bookingList);
            response.setStatusCode(200);
            response.setMessage("successful");
            response.setBookingList(bookingDTOList);

        } catch (OurException e) {
            response.setStatusCode(404);
            response.setMessage(e.getMessage());

        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error Getting all bookings: " + e.getMessage());

        }
        return response;
    }

    @Override
    public Response cancelBooking(Long bookingId) {
        Response response = new Response();

        try {
            bookingRepository.findById(bookingId).orElseThrow(() -> new OurException("Booking Does Not Exist"));
            bookingRepository.deleteById(bookingId);
            response.setStatusCode(200);
            response.setMessage("successful");

        } catch (OurException e) {
            response.setStatusCode(404);
            response.setMessage(e.getMessage());

        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error Cancelling a booking: " + e.getMessage());

        }
        return response;
    }

    private boolean roomIsAvailable(Bookings bookingRequest, List<Bookings> existingBookings) {

        return existingBookings.stream()
                .noneMatch(existingBooking ->
                        bookingRequest.getCheckInDate().equals(existingBooking.getCheckInDate())
                                || bookingRequest.getCheckOutDate().isBefore(existingBooking.getCheckOutDate())
                                || (bookingRequest.getCheckInDate().isAfter(existingBooking.getCheckInDate())
                                && bookingRequest.getCheckInDate().isBefore(existingBooking.getCheckOutDate()))
                                || (bookingRequest.getCheckInDate().isBefore(existingBooking.getCheckInDate())

                                && bookingRequest.getCheckOutDate().equals(existingBooking.getCheckOutDate()))
                                || (bookingRequest.getCheckInDate().isBefore(existingBooking.getCheckInDate())

                                && bookingRequest.getCheckOutDate().isAfter(existingBooking.getCheckOutDate()))

                                || (bookingRequest.getCheckInDate().equals(existingBooking.getCheckOutDate())
                                && bookingRequest.getCheckOutDate().equals(existingBooking.getCheckInDate()))

                                || (bookingRequest.getCheckInDate().equals(existingBooking.getCheckOutDate())
                                && bookingRequest.getCheckOutDate().equals(bookingRequest.getCheckInDate()))
                );
    }
}

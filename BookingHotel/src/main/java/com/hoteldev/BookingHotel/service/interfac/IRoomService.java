package com.hoteldev.BookingHotel.service.interfac;

import com.hoteldev.BookingHotel.dto.Response;
import com.hoteldev.BookingHotel.dto.RoomDTO;
import org.springframework.web.multipart.MultipartFile;
import java.time.LocalDate;
import java.math.BigDecimal;
import java.util.List;

public interface IRoomService {
    Response addNewRoom(MultipartFile photo, String roomType,String roomCode ,BigDecimal roomPrice, String roomDescription);

    List<String> getAllRoomTypes();
    Response getAllRooms();

    Response deleteRoom(Long roomId);


    Response updateRoom(Long roomId, String description, String roomType,String roomCode, BigDecimal roomPrice, MultipartFile photo);

    Response getRoomById(Long roomId);

    Response getAvailableRoomsByDataAndType(LocalDate checkInDate, LocalDate checkOutDate, String roomType);

    Response getAllAvailableRooms();
    public List<RoomDTO> getAllRoomAPI();
    public List<RoomDTO> getAllRoomsByType(String type);
    public List<RoomDTO> getRoomsMinByPrice(int min);
}

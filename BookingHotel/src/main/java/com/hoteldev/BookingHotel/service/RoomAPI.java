package com.hoteldev.BookingHotel.service;

import com.hoteldev.BookingHotel.dto.Response;
import com.hoteldev.BookingHotel.dto.RoomDTO;
import com.hoteldev.BookingHotel.entity.Rooms;
import com.hoteldev.BookingHotel.service.impl.BookingService;
import com.hoteldev.BookingHotel.service.impl.RoomService;
import com.hoteldev.BookingHotel.service.interfac.IRoomService;
import dev.langchain4j.agent.tool.Tool;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Component
@RequiredArgsConstructor
public class RoomAPI {
    private final RoomService roomService;
    @Tool("Cung cấp tên các loại phòng")
    public List<String> getAllRoomTypesAPI(String api) {
        return roomService.getAllRoomTypes();
    }

    @Tool("Cung cấp thông tin về tất cả các phòng")
    public List<RoomDTO> getAllRoomAPI(String api) {
        return roomService.getAllRoomAPI();
    }


    @Tool("Cung cấp thông tin về các phòng dựa theo loại phòng")
    public List<RoomDTO> getAllRoomAPIByTypes(String type) {
        return roomService.getAllRoomsByType(type);
    }

    @Tool("Cung cấp thông tin về các phòng dựa theo giá phòng tối thiểu")
    public List<RoomDTO> getAllRoomAPIByPrice(int api) {

        return roomService.getRoomsMinByPrice(api);
    }
}

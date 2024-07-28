package com.hoteldev.BookingHotel.repo;

import com.hoteldev.BookingHotel.dto.RoomDTO;
import com.hoteldev.BookingHotel.entity.Rooms;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public interface RoomRepository extends JpaRepository<Rooms,Long> {

    @Query("SELECT DISTINCT r.roomType FROM Rooms r")
    List<String> findDistinctRoomTypes();
    @Query("SELECT r FROM Rooms r WHERE r.roomType LIKE %:roomType% AND r.id NOT IN (SELECT bk.room.id FROM Bookings bk WHERE" +
            "(bk.checkInDate <= :checkOutDate) AND (bk.checkOutDate >= :checkInDate))")
    List<Rooms> findAvailableRoomsByDatesAndTypes(LocalDate checkInDate, LocalDate checkOutDate, String roomType);
    @Query("SELECT r from Rooms  r where r.id not in (select b.room.id from Bookings b) ")
    List<Rooms> getAllAvailableRooms();

    @Query("select  r from Rooms r")
    List<Rooms> getAllRoomAPI();

    @Query("select  r from Rooms r where r.roomType = :type")
    List<Rooms> getAllRoomAPIByTypes(@Param("type") String type);

    @Query("select  r from Rooms r where r.roomPrice > :api")
    List<Rooms> getRoomAPIByMinPrice(@Param("api") int api);


}

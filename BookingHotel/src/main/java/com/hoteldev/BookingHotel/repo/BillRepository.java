package com.hoteldev.BookingHotel.repo;

import com.hoteldev.BookingHotel.entity.Bills;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BillRepository extends JpaRepository<Bills,Long> {
}

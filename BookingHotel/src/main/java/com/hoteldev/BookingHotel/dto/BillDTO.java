package com.hoteldev.BookingHotel.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class BillDTO {
    private Long id;
    private LocalDate paymentDate;
    private BigDecimal totalAmount;
    private String paymentMethod;
    private String note;
    private BookingDTO booking;
}

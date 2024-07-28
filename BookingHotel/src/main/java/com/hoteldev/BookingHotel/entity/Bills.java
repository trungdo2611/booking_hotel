package com.hoteldev.BookingHotel.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Entity
@Table(name = "bills")
public class Bills {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "payment date is required")
    private LocalDate paymentDate;

    private BigDecimal totalAmount;
    @NotNull(message = "payment method is required")
    private String paymentMethod;

    private String note;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id")
    private Bookings booking;

    @Override
    public String toString() {
        return "Bill{" +
                "id=" + id +
                ", paymentDate=" + paymentDate +
                ", totalAmount=" + totalAmount +
                ", paymentMethod=" + paymentMethod +
                ", note='" + note + '\'' +
                '}';
    }
}

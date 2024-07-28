package com.hoteldev.BookingHotel.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Data
@Entity
@Table(name = "rooms")
public class Rooms {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Rome Code is required")
    private String roomCode;

    @NotNull(message = "Rome Price is required")
    private BigDecimal roomPrice;

    @NotBlank(message = "Photo is required")
    private String roomPhotoUrl;

    @NotBlank(message = "Room description is required")
    @Lob
    @Column(name = "room_description", columnDefinition = "LONGTEXT")
    private String roomDescription;

    @NotBlank(message = "Rome type is required")
    private String roomType;

    @OneToMany(mappedBy = "room", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<Bookings> bookings = new ArrayList<>();

    @Override
    public String toString() {
        return "Room{" +
                "id=" + id +
                ", roomCode='" + roomCode + '\'' +
                ", roomType='" + roomType + '\'' +
                ", roomPrice=" + roomPrice +
                ", roomPhotoUrl='" + roomPhotoUrl + '\'' +
                ", roomDescription='" + roomDescription + '\'' +
                '}';
    }
}
package com.hoteldev.BookingHotel.service.impl;

import com.hoteldev.BookingHotel.dto.BillDTO;
import com.hoteldev.BookingHotel.dto.BookingDTO;
import com.hoteldev.BookingHotel.entity.Bills;
import com.hoteldev.BookingHotel.service.interfac.MailService;
import com.hoteldev.BookingHotel.service.interfac.ThymeleafService;
import com.hoteldev.BookingHotel.utils.Utils;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.Date;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class MailServiceImpl implements MailService {
    @Autowired
    JavaMailSender mailSender;

    @Autowired
    ThymeleafService thymeleafService;

    @Value("${spring.mail.username}")
    private String email;
    @Override
    public void sendMailTest() {
        try{
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(
                    message,
                    MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED,
                    StandardCharsets.UTF_8.name());
            String displayName = "TrungDo Hotel";
            helper.setFrom(String.format("%s <%s>", displayName, email));
            helper.setTo("dovanxuantrung2611@gmail.com");
            helper.setSubject("Mail test");
            helper.setText("hello this is a email send to test from xuan trung do");

            mailSender.send(message);
        } catch(Exception e) {
            e.printStackTrace();
        }
    }

    @Override
    public void sendMailBooking(BookingDTO booking, Bills bills) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(
                    message, MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED,
                    StandardCharsets.UTF_8.name()
            );
            BillDTO billDTO = Utils.mapBillEntityToBillDTO(bills);
            String displayName = "TrungDo Hotel";
            helper.setFrom(String.format("%s <%s>", displayName, email));
            helper.setSubject("TrungDo Hotel");
            Map<String, Object> variables = new HashMap<>();
            variables.put("name", booking.getUser().getName());
            variables.put("bookingConfirmationCode", booking.getBookingConfirmationCode());
            variables.put("paymentDate", billDTO.getPaymentDate());
            variables.put("totalAmount", billDTO.getTotalAmount());
            variables.put("roomType", booking.getRoom().getRoomType());
            variables.put("checkInDate", booking.getCheckInDate());
            variables.put("checkOutDate", booking.getCheckOutDate());
            variables.put("roomPrice", booking.getRoom().getRoomPrice());
            variables.put("email", booking.getUser().getEmail());
            variables.put("roomCode", booking.getRoom().getRoomCode());
            variables.put("phoneNumber", booking.getUser().getPhoneNumber());
            helper.setText(thymeleafService.createContent("send2.html", variables), true);
            helper.setTo(booking.getUser().getEmail());
            mailSender.send(message);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}

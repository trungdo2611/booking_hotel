package com.hoteldev.BookingHotel.controller;

import com.hoteldev.BookingHotel.config.paypal.PaypalService;
import com.paypal.api.payments.Payment;
import com.paypal.base.rest.PayPalRESTException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.reactive.result.view.RedirectView;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;



@RestController
@RequestMapping("/paypal")
@RequiredArgsConstructor
public class PaypalController {

    private final PaypalService paypalService;

    @PostMapping("/create-payment")
    public ResponseEntity<Map<String, String>> createPayment(@RequestParam BigDecimal total,
                                                             @RequestParam String currency,
                                                             @RequestParam String method,
                                                             @RequestParam String intent,
                                                             @RequestParam String description,
                                                             @RequestParam String cancelUrl,
                                                             @RequestParam String url
    ) {
        try {
//            String cancelUrl = "https://localhost:8080/cancel";
            Payment payment = paypalService.createPayment(
                    total,
                    currency,
                    method,
                    intent,
                    description,
                    cancelUrl,
                    url
            );
            Map<String, String> response = new HashMap<>();
            for (com.paypal.api.payments.Links link : payment.getLinks()) {
                if (link.getRel().equals("approval_url")) {
                    response.put("approval_url", link.getHref());
                    return ResponseEntity.ok(response);
                }
            }

        } catch (PayPalRESTException e) {
            throw new RuntimeException("Error while creating payment", e);
        }
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);

    }

    @GetMapping("/execute-payment")
    public ResponseEntity<String> paymentSuccess(@RequestParam("paymentId") String paymentId,
                                 @RequestParam("payerId") String payerId) {
        try {
            Payment payment = paypalService.executePayment(paymentId, payerId);
            if (payment.getState().equals("approved")) {
                return ResponseEntity.ok("Payment successful");
            }
        } catch (PayPalRESTException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Payment failed");
        }
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Payment failed");
    }



    @GetMapping("/success")
    public String paymentSuccess() {
                return "paymentSuccess";
    }

//    @PostMapping("/execute-payment")
//    public Payment executePayment(@RequestParam String paymentId, @RequestParam String payerId) {
//        try {
//            return paypalService.executePayment(paymentId, payerId);
//        } catch (PayPalRESTException e) {
//            throw new RuntimeException("Error while executing payment", e);
//        }
//    }

    @GetMapping("/cancel")
    public String paymentCancel() {
        return "cancel";
    }

    @GetMapping("/error")
    public String paymentError() {
        return "error";
    }
}

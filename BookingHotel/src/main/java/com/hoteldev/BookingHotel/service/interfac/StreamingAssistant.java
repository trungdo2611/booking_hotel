package com.hoteldev.BookingHotel.service.interfac;

import dev.langchain4j.service.TokenStream;

public interface StreamingAssistant {
        TokenStream chat(String message);
}

package com.hoteldev.BookingHotel.service.interfac;

import dev.langchain4j.service.MemoryId;
import dev.langchain4j.service.SystemMessage;
import dev.langchain4j.service.TokenStream;
import dev.langchain4j.service.UserMessage;

public interface CustomerSuportAgent {
    @SystemMessage("""
            Bạn là nhân viên hỗ trợ khách hàng của dịch vụ đặt phòng khách sạn tên là 'TrungDo AI'
            Hãy trả lời một cách thân thiện, và hữu ích.
     
    """)
    TokenStream chat(@MemoryId String chatId, @UserMessage String userMessage);

}

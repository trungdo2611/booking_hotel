package com.hoteldev.BookingHotel.controller;

import com.hoteldev.BookingHotel.dto.ChatRequest;
import com.hoteldev.BookingHotel.service.impl.ChatServiceImpl;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;

@RestController
@RequestMapping("/chat")
public class ChatAIController {
    private static final Logger logger = LoggerFactory.getLogger(ChatAIController.class);
    @Autowired
    private ChatServiceImpl chatService;
    @PostMapping("/stream")
    public Flux<String> chatStream(@RequestParam String chatId, @RequestBody ChatRequest chatRequest) {
        logger.info("Received chat stream request: {}", chatRequest.getMessage());
        return chatService.chatStream(chatId,chatRequest.getMessage());
    }
}

package com.hoteldev.BookingHotel.service.impl;

import com.hoteldev.BookingHotel.service.interfac.CustomerSuportAgent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Sinks;

@Service
public class ChatServiceImpl {
    private static final Logger logger = LoggerFactory.getLogger(ChatServiceImpl.class);
//    @Value("${openai.api.key}")
//    private String OPENAI_API_KEY;
//    private StreamingAssistant streamingAssistant;

//    @PostConstruct
//    public void init() {
//        logger.info("Initializing ChatService with OpenAI API key.");
//        if (OPENAI_API_KEY == null) {
//            System.err.println("ERROR: OPENAI_API_KEY environment variable is not set. Please set it to your OpenAI API key.");
//        }
//        var memory = TokenWindowChatMemory.withMaxTokens(2000, new OpenAiTokenizer("gpt-3.5-turbo"));
//
//        streamingAssistant = AiServices.builder(StreamingAssistant.class)
//                .streamingChatLanguageModel(OpenAiStreamingChatModel.withApiKey(OPENAI_API_KEY))
//                .chatMemory(memory)
//                .build();
//        logger.info("ChatService initialized successfully.");
//    }

    private final CustomerSuportAgent agent;

    public ChatServiceImpl(CustomerSuportAgent agent) {
        this.agent = agent;
    }




    public Flux<String> chatStream(String chatId,String message) {
        if (agent == null) {
            logger.error("StreamingAssistant is not initialized.");
            return Flux.error(new RuntimeException("StreamingAssistant is not initialized."));
        }
        Sinks.Many<String> sink = Sinks.many().unicast().onBackpressureBuffer();

        agent.chat(chatId,message)
                .onNext(sink::tryEmitNext)
                .onComplete(c -> sink.tryEmitComplete())
                .onError(sink::tryEmitError)
                .start();

        return sink.asFlux();
    }
}

package com.hoteldev.BookingHotel;

import com.hoteldev.BookingHotel.service.RoomAPI;
import com.hoteldev.BookingHotel.service.interfac.CustomerSuportAgent;
import dev.langchain4j.data.document.Document;
import dev.langchain4j.data.document.splitter.DocumentSplitters;
import dev.langchain4j.data.segment.TextSegment;
import dev.langchain4j.memory.chat.TokenWindowChatMemory;
import dev.langchain4j.model.Tokenizer;
import dev.langchain4j.model.chat.StreamingChatLanguageModel;
import dev.langchain4j.model.embedding.EmbeddingModel;
import dev.langchain4j.model.embedding.AllMiniLmL6V2EmbeddingModel;
import dev.langchain4j.model.openai.OpenAiStreamingChatModel;
import dev.langchain4j.model.openai.OpenAiTokenizer;
import dev.langchain4j.retriever.EmbeddingStoreRetriever;
import dev.langchain4j.retriever.Retriever;
import dev.langchain4j.service.AiServices;
import dev.langchain4j.store.embedding.EmbeddingStore;
import dev.langchain4j.store.embedding.EmbeddingStoreIngestor;
import dev.langchain4j.store.embedding.inmemory.InMemoryEmbeddingStore;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.core.io.ResourceLoader;

import java.util.List;

import static dev.langchain4j.data.document.FileSystemDocumentLoader.loadDocument;
import static dev.langchain4j.model.openai.OpenAiModelName.GPT_3_5_TURBO;


@SpringBootApplication
public class BookingHotelApplication  {

	@Bean
	StreamingChatLanguageModel streamingChatLanguageModel(@Value("${openai.api.key}") String apiKey) {
		return OpenAiStreamingChatModel.builder()
				.apiKey(apiKey)
				.modelName("gpt-3.5-turbo")
				.build();
	}

	@Bean
	Tokenizer tokenizer() {
		return new OpenAiTokenizer(GPT_3_5_TURBO);
	}

	@Bean
	EmbeddingModel embeddingModel() {
		return new AllMiniLmL6V2EmbeddingModel();
	}



	@Bean
	EmbeddingStore<TextSegment> embeddingStore() {
		return new InMemoryEmbeddingStore<>();
	}

	@Bean
	Retriever<TextSegment> retriever(
			EmbeddingModel embeddingModel,
			EmbeddingStore<TextSegment> embeddingStore
	) {
		return EmbeddingStoreRetriever.from(
				embeddingStore,
				embeddingModel,
				1,
				0.6

		);
	}

	@Bean
	CommandLineRunner docsToEmbeddings(
			EmbeddingModel embeddingModel,
			EmbeddingStore<TextSegment>	embeddingStore,
			Tokenizer tokenizer,
			ResourceLoader loader
	) {
		return args -> {
			var	resource = loader.getResource("classpath:term-of-service.txt");
			var doc = loadDocument(resource.getFile().toPath());
			var splitter = DocumentSplitters.recursive(100,0,tokenizer);
			var ingestor = EmbeddingStoreIngestor.builder()
					.embeddingModel(embeddingModel)
					.embeddingStore(embeddingStore)
					.documentSplitter(splitter)
					.build();
			ingestor.ingest(doc);

		};
	}


	@Bean
	CustomerSuportAgent customerSuportAgent(
			StreamingChatLanguageModel streamingChatLanguageModel,
			Tokenizer tokenizer,
			Retriever<TextSegment> retriever,
			RoomAPI roomAPI
	) {

		return AiServices.builder(CustomerSuportAgent.class)
				.streamingChatLanguageModel(streamingChatLanguageModel)
				.chatMemoryProvider(chatId -> TokenWindowChatMemory.builder()
						.id(chatId)
						.maxTokens(500, tokenizer)
						.build())
				.retriever(retriever)
				.tools(roomAPI)
				.build();
	}
	public static void main(String[] args) {
		SpringApplication.run(BookingHotelApplication.class, args);
	}

}

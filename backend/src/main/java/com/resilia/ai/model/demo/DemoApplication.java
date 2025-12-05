package com.resilia.ai.model.demo;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class DemoApplication {

	public static void main(String[] args) {
		SpringApplication.run(DemoApplication.class, args);
	}

	// --- TEMPORARY VERIFICATION CODE ---
	@Bean
	public CommandLineRunner verifyApiKey(@Value("${gemini.api.key}") String apiKey) {
		return args -> {
			System.out.println("==============================================");
			if (apiKey != null && !apiKey.isEmpty() && !apiKey.startsWith("${")) {
				// We only print the first 5 characters for security
				System.out.println("✅ SUCCESS! API Key Loaded: " + apiKey.substring(0, 5) + "......");
			} else {
				System.err.println("❌ ERROR: API Key not found or not parsed correctly.");
			}
			System.out.println("==============================================");
		};
	}
}
package com.resilia.ai.model.demo.services;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.util.Collections;
import java.util.List;
import java.util.Map;

@Service
public class AiService {

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final HttpClient httpClient = HttpClient.newHttpClient();

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    @Value("${gemini.api.url}")
    private String geminiApiUrl;

    private final String PYTHON_SERVICE_URL = "http://localhost:5000/analyze";

    /**
     * Connects to the local Python Flask service to detect emotion.
     * It sends the user message and waits for a JSON response like {"emotion": "happy"}.
     */
    public String analyzeEmotion(String userMessage) {
        try {
            // Prepare JSON Payload
            Map<String, String> requestBody = Map.of("message", userMessage);
            String jsonBody = objectMapper.writeValueAsString(requestBody);

            // Build HTTP POST Request
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(PYTHON_SERVICE_URL))
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(jsonBody))
                    .build();

            // Send Request and read Response
            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() == 200) {
                Map<String, String> responseMap = objectMapper.readValue(response.body(), Map.class);
                String emotion = responseMap.get("emotion");
                return emotion != null ? emotion.toUpperCase() : "NEUTRAL";
            } else {
                return "NEUTRAL";
            }

        } catch (Exception e) {
            System.err.println("PYTHON CONNECTION FAILED: Check if the Flask script is running on port 5000.");
            return "NEUTRAL";
        }
    }

    /**
     * Sends the user's message + detected emotion to Google Gemini API.
     * It instructs Gemini to act as a mental health companion.
     */
    public String generateAiResponse(String emotion, String contextHistory, String currentUserMessage) {

        // Construct the system prompt to guide the AI's behavior
        String systemPrompt = "You are Resilia Ai, a compassionate mental health companion. " +
                "The user is feeling: " + emotion + ". " +
                "Adjust your tone to match this emotion. " +
                "Keep your answer short (max 3 sentences). Always answer in English.";

        String finalPrompt = "System: " + systemPrompt + "\n\nUser: " + currentUserMessage;

        // Structure data for Gemini JSON API
        Map<String, Object> contents = Map.of(
                "contents", Collections.singletonList(Map.of(
                        "parts", Collections.singletonList(Map.of("text", finalPrompt))
                ))
        );

        try {
            String jsonBody = objectMapper.writeValueAsString(contents);
            String finalUrl = geminiApiUrl + "?key=" + geminiApiKey.trim();

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(finalUrl))
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(jsonBody, StandardCharsets.UTF_8))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() != 200) {
                System.err.println("GEMINI ERROR: " + response.statusCode() + " - " + response.body());
                return "I am having trouble processing that right now.";
            }

            return extractTextFromGeminiResponse(response.body());

        } catch (Exception e) {
            e.printStackTrace();
            return "Connection error.";
        }
    }

    /**
     * Helper method to parse the complex JSON structure returned by Google Gemini
     * and extract just the text of the answer.
     */
    private String extractTextFromGeminiResponse(String jsonResponse) throws Exception {
        Map<String, Object> result = objectMapper.readValue(jsonResponse, Map.class);
        List<Map<String, Object>> candidates = (List<Map<String, Object>>) result.get("candidates");
        if (candidates != null && !candidates.isEmpty()) {
            Map<String, Object> content = (Map<String, Object>) candidates.get(0).get("content");
            if (content != null) {
                List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");
                if (parts != null && !parts.isEmpty()) {
                    String text = (String) parts.get(0).get("text");
                    return text != null ? text.trim() : "";
                }
            }
        }
        return "";
    }
}
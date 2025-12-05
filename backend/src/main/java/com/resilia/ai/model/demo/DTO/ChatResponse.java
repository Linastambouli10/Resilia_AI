package com.resilia.ai.model.demo.DTO;

/**
 * Data Transfer Object (DTO) for the Chatbot's reply.
 *
 * This class defines the structure of the JSON response sent back to the Frontend
 * immediately after the user sends a message. It contains the AI's text answer,
 * the emotion the AI detected, and the ID of the conversation so the UI stays in sync.
 */
public class ChatResponse {

    private String aiResponse;
    private String detectedEmotion;
    private Long conversationId;

    /**
     * Default constructor.
     * Required by frameworks like Jackson to convert JSON into this Java object.
     */
    public ChatResponse() {
    }

    /**
     * Main constructor used by the ChatService to build the response.
     */
    public ChatResponse(String aiResponse, String detectedEmotion, Long conversationId) {
        this.aiResponse = aiResponse;
        this.detectedEmotion = detectedEmotion;
        this.conversationId = conversationId;
    }

    // --- Getters and Setters ---

    public String getAiResponse() {
        return aiResponse;
    }

    public void setAiResponse(String aiResponse) {
        this.aiResponse = aiResponse;
    }

    public String getDetectedEmotion() {
        return detectedEmotion;
    }

    public void setDetectedEmotion(String detectedEmotion) {
        this.detectedEmotion = detectedEmotion;
    }

    public Long getConversationId() {
        return conversationId;
    }

    public void setConversationId(Long conversationId) {
        this.conversationId = conversationId;
    }
}
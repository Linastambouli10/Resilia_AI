package com.resilia.ai.model.demo.DTO;

/**
 * Data Transfer Object (DTO) for the Emotion Analysis Service.
 *
 * This class is used to wrap the user's raw message into a structured object.
 * It is then converted into JSON (e.g., {"text": "I feel sad"}) so it can be
 * sent to the external Python Flask service for analysis.
 */
public class EmotionAnalysisRequest {

    private String text;

    /**
     * Default constructor.
     * Required by many JSON libraries (like Jackson) to create an instance
     * of the class before filling in the data.
     */
    public EmotionAnalysisRequest() {
    }

    /**
     * Convenience constructor.
     * Allows you to create the request object and set the text in a single line.
     * @param text The user's input message to be analyzed.
     */
    public EmotionAnalysisRequest(String text) {
        this.text = text;
    }

    // --- Getters and Setters ---

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }
}
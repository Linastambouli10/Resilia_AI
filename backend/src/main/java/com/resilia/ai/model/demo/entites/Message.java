package com.resilia.ai.model.demo.entites;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * Represents a single message in the database.
 * Stores content, sender type (user/bot), and the detected emotion.
 */
@Entity
public class Message {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String sender; // "user" or "bot"

    @Lob // Allows storing long text (more than 255 characters)
    @Column(columnDefinition = "TEXT")
    private String content;

    private LocalDateTime timestamp;
    @Column(nullable = true)
    private String emotion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "conversation_id")
    @JsonIgnore // Prevents infinite recursion (Message -> Conversation -> Message...)
    private Conversation conversation;

    public Message() {}

    // Getters and Setters...
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getSender() { return sender; }
    public void setSender(String sender) { this.sender = sender; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
    public String getEmotion() { return emotion; }
    public void setEmotion(String emotion) { this.emotion = emotion; }
    public Conversation getConversation() { return conversation; }
    public void setConversation(Conversation conversation) { this.conversation = conversation; }
}
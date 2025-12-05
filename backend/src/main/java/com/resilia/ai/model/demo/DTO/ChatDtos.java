package com.resilia.ai.model.demo.DTO;

import com.resilia.ai.model.demo.entites.Conversation;
import com.resilia.ai.model.demo.entites.Message;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Container class for DTOs related to Chat operations.
 * DTOs (Data Transfer Objects) are used to format data before sending it to the Frontend,
 * ensuring we only send what is necessary.
 */
public class ChatDtos {

    /** * Formats conversation history for the sidebar list.
     */
    public static class ConversationHistoryDto {
        private Long id;
        private String startTime;
        private List<MessageDto> messages;

        public ConversationHistoryDto(Conversation conversation) {
            this.id = conversation.getId();
            this.startTime = conversation.getStartTime().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
            this.messages = conversation.getMessages().stream()
                    .map(MessageDto::new)
                    .collect(Collectors.toList());
        }

        public ConversationHistoryDto(Long id, String title, String string, String unknown) {
        }

        // Getters and Setters...
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getStartTime() { return startTime; }
        public void setStartTime(String startTime) { this.startTime = startTime; }
        public List<MessageDto> getMessages() { return messages; }
        public void setMessages(List<MessageDto> messages) { this.messages = messages; }
    }

    /** * Formats a single message for the frontend.
     */
    public static class MessageDto {
        private Long id;
        private String content;
        private String sender;
        private String emotion;
        private String timestamp;

        public MessageDto(Message message) {
            this.id = message.getId();
            this.content = message.getContent();
            this.sender = message.getSender();
            this.emotion = message.getEmotion();
            this.timestamp = message.getTimestamp().format(DateTimeFormatter.ofPattern("HH:mm:ss"));
        }

        // Getters and Setters...
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getContent() { return content; }
        public void setContent(String content) { this.content = content; }
        public String getSender() { return sender; }
        public void setSender(String sender) { this.sender = sender; }
        public String getEmotion() { return emotion; }
        public void setEmotion(String emotion) { this.emotion = emotion; }
        public String getTimestamp() { return timestamp; }
        public void setTimestamp(String timestamp) { this.timestamp = timestamp; }
    }

    /** * Catches the JSON payload sent by the user when they type a message.
     */
    public static class UserMessageRequest {
        private String userMessage;
        private Long conversationId;

        public String getUserMessage() { return userMessage; }
        public void setUserMessage(String userMessage) { this.userMessage = userMessage; }
        public Long getConversationId() { return conversationId; }
        public void setConversationId(Long conversationId) { this.conversationId = conversationId; }
    }
}
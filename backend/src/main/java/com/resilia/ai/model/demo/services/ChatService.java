package com.resilia.ai.model.demo.services;

import com.resilia.ai.model.demo.DTO.ChatResponse;
import com.resilia.ai.model.demo.DTO.ChatDtos.ConversationHistoryDto;
import com.resilia.ai.model.demo.DTO.ChatDtos.UserMessageRequest;
import com.resilia.ai.model.demo.entites.Conversation;
import com.resilia.ai.model.demo.entites.Message;
import com.resilia.ai.model.demo.entites.User;
import com.resilia.ai.model.demo.repositories.ConversationRepository;
import com.resilia.ai.model.demo.repositories.MessageRepository;
import com.resilia.ai.model.demo.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class ChatService {

    @Autowired
    private ConversationRepository conversationRepository;

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AiService aiService;

    // --- Process Incoming Message ---
    public ChatResponse processUserMessage(UserMessageRequest request) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Get or Create Conversation
        Conversation conversation;
        if (request.getConversationId() != null) {
            conversation = conversationRepository.findById(request.getConversationId())
                    .orElseThrow(() -> new RuntimeException("Conversation not found"));
        } else {
            conversation = new Conversation();
            conversation.setUser(user);
            conversation.setStartTime(LocalDateTime.now());
            conversation = conversationRepository.save(conversation);
        }

        // Save User Message
        Message userMsg = new Message();
        userMsg.setConversation(conversation);
        userMsg.setContent(request.getUserMessage());
        userMsg.setSender("user");
        userMsg.setTimestamp(LocalDateTime.now());
        messageRepository.save(userMsg);

        // Call AI Service
        String aiResponseText;
        String emotion = "NEUTRAL";
        try {
            emotion = aiService.analyzeEmotion(request.getUserMessage());
            aiResponseText = aiService.generateAiResponse(emotion, "", request.getUserMessage());
        } catch (Exception e) {
            e.printStackTrace();
            aiResponseText = "I'm having trouble connecting right now, but I heard you.";
        }

        // Save AI Message
        Message aiMsg = new Message();
        aiMsg.setConversation(conversation);
        aiMsg.setContent(aiResponseText);
        aiMsg.setSender("bot");
        aiMsg.setTimestamp(LocalDateTime.now());
        aiMsg.setEmotion(emotion);
        messageRepository.save(aiMsg);

        return new ChatResponse(aiResponseText, emotion, conversation.getId());
    }

    // --- Retrieve History ---
    public List<ConversationHistoryDto> getHistory() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow();

        List<Conversation> conversations = conversationRepository.findByUserIdOrderByStartTimeDesc(user.getId());

        List<ConversationHistoryDto> history = new ArrayList<>();
        for (Conversation c : conversations) {
            String title = "New Conversation";
            if (!c.getMessages().isEmpty()) {
                String firstMsg = c.getMessages().get(0).getContent();
                title = firstMsg.length() > 20 ? firstMsg.substring(0, 20) + "..." : firstMsg;
            }
            history.add(new ConversationHistoryDto(c.getId(), title, c.getStartTime().toString(), "Unknown"));
        }
        return history;
    }
}
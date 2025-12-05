package com.resilia.ai.model.demo.controller;

import com.resilia.ai.model.demo.DTO.ChatDtos.UserMessageRequest;
import com.resilia.ai.model.demo.entites.Conversation;
import com.resilia.ai.model.demo.entites.Message;
import com.resilia.ai.model.demo.entites.User;
import com.resilia.ai.model.demo.repositories.ConversationRepository;
import com.resilia.ai.model.demo.repositories.MessageRepository;
import com.resilia.ai.model.demo.repositories.UserRepository;
import com.resilia.ai.model.demo.services.AiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    @Autowired
    private AiService aiService;
    @Autowired
    private MessageRepository messageRepository;
    @Autowired
    private ConversationRepository conversationRepository;
    @Autowired
    private UserRepository userRepository;

    /**
     * Main Chat Logic:
     * 1. Identifies the logged-in user.
     * 2. Finds the existing conversation OR creates a new one.
     * 3. Saves the User's message to the DB (initially without emotion).
     * 4. Calls the AI Service (Python for emotion, Gemini for text).
     * 5. Updates the User's message with the detected emotion.
     * 6. Saves the AI's response to the DB (This was missing before!).
     * 7. Returns everything to the frontend.
     */
    @PostMapping("/message")
    public ResponseEntity<Map<String, Object>> sendMessage(
            @RequestBody UserMessageRequest request,
            Authentication authentication
    ) {
        // Step 1: Get User from Security Context
        String email = authentication.getName();
        User currentUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Step 2: Handle Conversation (New vs Existing)
        Conversation conversation;
        if (request.getConversationId() != null) {
            conversation = conversationRepository.findById(request.getConversationId())
                    .orElseThrow(() -> new RuntimeException("Conversation not found"));
        } else {
            conversation = new Conversation();
            conversation.setUser(currentUser);
            conversation.setStartTime(LocalDateTime.now());
            conversation = conversationRepository.save(conversation);
        }

        // Step 3: Create and Save User Message
        // We save it now to ensure it exists in the DB even if the AI fails later.
        Message userMsg = new Message();
        userMsg.setSender("user");
        userMsg.setContent(request.getUserMessage());
        userMsg.setTimestamp(LocalDateTime.now());
        userMsg.setConversation(conversation);

        // We use saveAndFlush to force the DB to write this immediately.
        messageRepository.saveAndFlush(userMsg);

        // Step 4: Get AI Response
        String emotion = "NEUTRAL";
        String aiReplyText;

        try {
            // Get emotion from Python
            emotion = aiService.analyzeEmotion(request.getUserMessage());
            // Get text from Gemini
            aiReplyText = aiService.generateAiResponse(emotion, "", request.getUserMessage());
        } catch (Exception e) {
            e.printStackTrace();
            aiReplyText = "I'm having trouble connecting right now, but I saved your message.";
        }

        // Step 5: Update User Message with Emotion
        // We go back to the user message we saved in Step 3 and add the emotion.
        userMsg.setEmotion(emotion);
        messageRepository.saveAndFlush(userMsg);

        // Step 6: Create and Save AI Message (THIS WAS MISSING)
        // Now we create the bot's reply row in the database.
        Message aiMsg = new Message();
        aiMsg.setSender("bot");
        aiMsg.setContent(aiReplyText);
        // Add a small delay (1 second) to ensure it appears *after* the user message in the list
        aiMsg.setTimestamp(LocalDateTime.now().plusSeconds(1));
        aiMsg.setConversation(conversation);
        aiMsg.setEmotion(null); // The bot itself has no emotion

        messageRepository.saveAndFlush(aiMsg);

        // Step 7: Return JSON Response to Frontend
        Map<String, Object> response = new HashMap<>();
        response.put("aiResponse", aiReplyText);
        response.put("detectedEmotion", emotion);
        response.put("conversationId", conversation.getId());

        return ResponseEntity.ok(response);
    }

    /**
     * Returns a list of all conversations for the sidebar history.
     */
    @GetMapping("/conversations")
    public ResponseEntity<List<Conversation>> getUserConversations(Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email).orElseThrow();
        List<Conversation> conversations = conversationRepository.findByUserIdOrderByStartTimeDesc(user.getId());
        return ResponseEntity.ok(conversations);
    }

    /**
     * Returns all messages for a specific conversation ID.
     * Used when a user clicks a conversation in the sidebar.
     */
    @GetMapping("/conversations/{conversationId}/messages")
    public ResponseEntity<List<Message>> getConversationMessages(@PathVariable Long conversationId) {
        List<Message> messages = messageRepository.findByConversationIdOrderByTimestampAsc(conversationId);
        return ResponseEntity.ok(messages);
    }
}
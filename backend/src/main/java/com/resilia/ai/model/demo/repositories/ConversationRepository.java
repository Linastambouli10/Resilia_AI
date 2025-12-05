package com.resilia.ai.model.demo.repositories;

import com.resilia.ai.model.demo.entites.Conversation;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ConversationRepository extends JpaRepository<Conversation, Long> {

    // Finds all conversations for a specific user, sorted by newest first.
    List<Conversation> findByUserIdOrderByStartTimeDesc(Long userId);
}
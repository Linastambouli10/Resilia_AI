package com.resilia.ai.model.demo.repositories;

import com.resilia.ai.model.demo.entites.Message;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {

    // Custom query to find messages, can be used for pagination if needed.
    @Query("SELECT m FROM Message m WHERE m.conversation.id = :conversationId ORDER BY m.timestamp DESC")
    List<Message> findLastMessages(@Param("conversationId") Long conversationId, Pageable pageable);

    // Standard method to get all messages for a chat, sorted chronologically.
    List<Message> findByConversationIdOrderByTimestampAsc(Long conversationId);
}
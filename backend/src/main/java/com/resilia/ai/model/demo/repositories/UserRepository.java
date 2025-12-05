package com.resilia.ai.model.demo.repositories;

import com.resilia.ai.model.demo.entites.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    // Finds a user by email. 'Optional' handles cases where the user doesn't exist.
    Optional<User> findByEmail(String email);

    // Checks if an email is already registered (returns true/false).
    Boolean existsByEmail(String email);
}
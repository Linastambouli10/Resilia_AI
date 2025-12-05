package com.resilia.ai.model.demo.controller;

import com.resilia.ai.model.demo.DTO.JwtResponse;
import com.resilia.ai.model.demo.DTO.UserProfileDto;
import com.resilia.ai.model.demo.entites.User;
import com.resilia.ai.model.demo.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    /**
     * Updates user profile.
     * EXPECTS: JSON with fields like bio, goals, emergencyContact, profilePhoto.
     */
    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@RequestBody UserProfileDto request, Authentication authentication) {
        // 1. Find the user based on the JWT token (authentication.getName() returns the email)
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 2. Update fields ONLY if they are not null
        if (request.getUsername() != null) user.setUsername(request.getUsername());
        if (request.getName() != null) user.setName(request.getName());
        if (request.getSurname() != null) user.setSurname(request.getSurname());
        if (request.getAge() != null) user.setAge(request.getAge());
        if (request.getGender() != null) user.setGender(request.getGender());

        // 3. Update the specific fields you mentioned were missing
        if (request.getBio() != null) user.setBio(request.getBio());
        if (request.getGoals() != null) user.setGoals(request.getGoals());
        if (request.getEmergencyContact() != null) user.setEmergencyContact(request.getEmergencyContact());
        if (request.getProfilePhoto() != null) user.setProfilePhoto(request.getProfilePhoto());

        // 4. SAVE the changes to the database
        userRepository.save(user);

        // 5. Return the full updated user so the frontend can update its local storage
        return ResponseEntity.ok(new JwtResponse(null, user));
    }
}
package com.resilia.ai.model.demo.security;

import com.resilia.ai.model.demo.entites.User;
import com.resilia.ai.model.demo.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

/**
 * Bridges your Database 'User' entity with Spring Security's internal user handling.
 */
@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    /**
     * Spring calls this method to load a user from the DB when attempting to login.
     * It must return a 'UserDetails' object containing the username, password, and roles.
     */
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword(), // The hashed password from DB
                new ArrayList<>()   // List of authorities (roles) - empty for now
        );
    }
}
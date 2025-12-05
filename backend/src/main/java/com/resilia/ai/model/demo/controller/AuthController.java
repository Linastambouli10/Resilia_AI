package com.resilia.ai.model.demo.controller;

import com.resilia.ai.model.demo.DTO.JwtResponse;
import com.resilia.ai.model.demo.DTO.LoginRequest;
import com.resilia.ai.model.demo.DTO.RegisterRequest;
import com.resilia.ai.model.demo.entites.User;
import com.resilia.ai.model.demo.repositories.UserRepository;
import com.resilia.ai.model.demo.security.CustomUserDetailsService;
import com.resilia.ai.model.demo.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private JwtUtil jwtUtil;
    @Autowired
    private CustomUserDetailsService userDetailsService;

    /**
     * Registers a new user.
     * 1. Checks if the email is already taken.
     * 2. Encrypts the password.
     * 3. Saves the user to the database.
     * 4. Automatically logs them in by generating a token immediately.
     */
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody RegisterRequest registerRequest) {
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            return new ResponseEntity<>("Error: Email already in use!", HttpStatus.BAD_REQUEST);
        }

        User user = new User();
        user.setEmail(registerRequest.getEmail());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        user.setName(registerRequest.getName());
        user.setSurname(registerRequest.getSurname());
        user.setUsername(registerRequest.getUsername());
        user.setAge(registerRequest.getAge());
        user.setGender(registerRequest.getGender());

        userRepository.save(user);

        // Auto-login: Generate token immediately after saving
        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
        String jwt = jwtUtil.generateToken(userDetails);

        return ResponseEntity.ok(new JwtResponse(jwt, user));
    }

    /**
     * Authenticates an existing user.
     * 1. Validates email/password with AuthenticationManager.
     * 2. Generates a new JWT Token.
     * 3. Returns the token and user profile data to the frontend.
     */
    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword())
        );

        final UserDetails userDetails = userDetailsService.loadUserByUsername(loginRequest.getEmail());
        final String jwt = jwtUtil.generateToken(userDetails);

        User user = userRepository.findByEmail(loginRequest.getEmail()).get();

        return ResponseEntity.ok(new JwtResponse(jwt, user));
    }
}
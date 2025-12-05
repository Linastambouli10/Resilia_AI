package com.resilia.ai.model.demo.config;

import com.resilia.ai.model.demo.security.JwtRequestFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;

/**
 * Main Security Configuration.
 * This class sets up the rules for the application:
 * 1. Which URLs are public vs private.
 * 2. How passwords are encrypted.
 * 3. Configuring CORS (to allow React to talk to Spring).
 * 4. Injecting the JWT Filter.
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private JwtRequestFilter jwtRequestFilter;

    /**
     * Define the password encryption mechanism.
     * We use BCrypt, which is the industry standard for hashing passwords.
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * Exposes the AuthenticationManager as a Bean.
     * This is required by the AuthController to manually trigger user authentication (login).
     */
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    /**
     * The Security Filter Chain defines the specific HTTP security rules.
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // Disable CSRF because we use JWT tokens, not browser sessions.
                .csrf(AbstractHttpConfigurer::disable)

                // Configure CORS to allow your Frontend (React/localhost) to send requests.
                .cors(cors -> cors.configurationSource(request -> {
                    CorsConfiguration config = new CorsConfiguration();
                    config.addAllowedOrigin("*"); // In production, replace "*" with your domain.
                    config.addAllowedHeader("*");
                    config.addAllowedMethod("*");
                    return config;
                }))

                // Define URL access rules.
                .authorizeHttpRequests(authorize -> authorize
                        // Allow anyone to access login and register endpoints.
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers("/api/user/**").authenticated()
                        // All other endpoints require a valid JWT token.
                        .anyRequest().authenticated()
                )

                // Set session management to STATELESS because JWTs contain all user info.
                // The server does not store session data in memory.
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )

                // Add our custom JWT Filter before the standard Username/Password filter.
                // This checks the token before Spring tries to authenticate the user.
                .addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
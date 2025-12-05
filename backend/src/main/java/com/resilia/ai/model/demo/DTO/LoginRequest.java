package com.resilia.ai.model.demo.DTO;

/**
 * Captures the JSON sent to /api/auth/login
 */
public class LoginRequest {
    private String email;
    private String password;

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}
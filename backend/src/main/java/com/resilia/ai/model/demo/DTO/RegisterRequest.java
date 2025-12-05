package com.resilia.ai.model.demo.DTO;

/**
 * Captures the JSON sent to /api/auth/register
 */
public class RegisterRequest {
    private String email;
    private String password;
    private String name;
    private String surname;
    private String username;
    private Integer age;
    private String gender;

    // Getters and Setters...
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getSurname() { return surname; }
    public void setSurname(String surname) { this.surname = surname; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public Integer getAge() { return age; }
    public void setAge(Integer age) { this.age = age; }
    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }
}
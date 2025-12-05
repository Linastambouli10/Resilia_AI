package com.resilia.ai.model.demo.entites;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

/**
 * Represents the 'users' table in the database.
 */
@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    // Profile information
    private String name;
    private String surname;
    private String username;
    private Integer age;
    private String gender;

    @Column(length = 1000)
    private String bio;
    @Column(length = 1000)
    private String goals;
    private String emergencyContact;

    @Lob // Large Object - needed for storing Base64 image strings
    @Column(columnDefinition = "LONGTEXT")
    private String profilePhoto;

    // A User has many Conversations. If User is deleted, delete their conversations.
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Conversation> conversations = new ArrayList<>();

    public User() {}

    // Getters and Setters omitted for brevity, but keep them in your file...
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public List<Conversation> getConversations() { return conversations; }
    public void setConversations(List<Conversation> conversations) { this.conversations = conversations; }
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
    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }
    public String getGoals() { return goals; }
    public void setGoals(String goals) { this.goals = goals; }
    public String getEmergencyContact() { return emergencyContact; }
    public void setEmergencyContact(String emergencyContact) { this.emergencyContact = emergencyContact; }
    public String getProfilePhoto() { return profilePhoto; }
    public void setProfilePhoto(String profilePhoto) { this.profilePhoto = profilePhoto; }
}
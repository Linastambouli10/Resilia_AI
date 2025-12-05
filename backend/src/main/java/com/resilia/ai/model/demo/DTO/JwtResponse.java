package com.resilia.ai.model.demo.DTO;

import com.resilia.ai.model.demo.entites.User;

/**
 * Response sent after successful Login/Register.
 * Contains the JWT Token + User Profile Data.
 */
public class JwtResponse {
    private String jwt;
    private Long id;
    private String email;
    private String username;
    private String name;
    private String surname;
    private Integer age;
    private String gender;
    private String bio;
    private String goals;
    private String emergencyContact;
    private String profilePhoto;

    // Constructor to map User Entity to this Response
    public JwtResponse(String jwt, User user) {
        this.jwt = jwt;
        this.id = user.getId();
        this.email = user.getEmail();
        this.username = user.getUsername();
        this.name = user.getName();
        this.surname = user.getSurname();
        this.age = user.getAge();
        this.gender = user.getGender();
        this.bio = user.getBio();
        this.goals = user.getGoals();
        this.emergencyContact = user.getEmergencyContact();
        this.profilePhoto = user.getProfilePhoto();
    }

    // Getters...
    public String getJwt() { return jwt; }
    public Long getId() { return id; }
    public String getEmail() { return email; }
    public String getUsername() { return username; }
    public String getName() { return name; }
    public String getSurname() { return surname; }
    public Integer getAge() { return age; }
    public String getGender() { return gender; }
    public String getBio() { return bio; }
    public String getGoals() { return goals; }
    public String getEmergencyContact() { return emergencyContact; }
    public String getProfilePhoto() { return profilePhoto; }
}
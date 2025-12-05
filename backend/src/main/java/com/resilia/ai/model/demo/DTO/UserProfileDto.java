package com.resilia.ai.model.demo.DTO;

/**
 * Captures the JSON sent to /api/user/profile (Update Profile)
 */
public class UserProfileDto {
    private String username;
    private String name;
    private String surname;
    private Integer age;
    private String gender;
    private String bio;
    private String goals;
    private String emergencyContact;
    private String profilePhoto;

    // Getters and Setters...
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getSurname() { return surname; }
    public void setSurname(String surname) { this.surname = surname; }
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
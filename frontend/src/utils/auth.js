import api from './api';

// --- REGISTER ---
export const registerUser = async (userData) => {
  try {
    // 1. Send ALL data to the backend
    const response = await api.post("/auth/register", userData);
    
    // 2. The backend auto-logs in and returns the token + profile
    const data = response.data;

    // 3. Save to LocalStorage
    // Note: We use data.jwt because your backend sends "jwt"
    const userToSave = {
      token: data.jwt, 
      id: data.id,        // Backend sends "id" (not userId)
      email: data.email,
      username: data.username,
      name: data.name,
      surname: data.surname,
      age: data.age,
      gender: data.gender,
      // Save any other fields returned
      bio: data.bio,
      goals: data.goals,
      emergencyContact: data.emergencyContact,
      profilePhoto: data.profilePhoto
    };
    
    localStorage.setItem("resiliaUser", JSON.stringify(userToSave));

    return { success: true, message: "Registration successful!" };
  } catch (error) {
    return { 
      success: false, 
      message: error.response?.data || "Registration failed" 
    };
  }
};

// --- LOGIN ---
export const loginUser = async (credentials) => {
  try {
    // 1. Send credentials
    const response = await api.post("/auth/login", credentials);
    
    // 2. Backend returns full profile data in JwtResponse
    const data = response.data;

    // 3. Save EVERYTHING to LocalStorage
    const userToSave = {
      token: data.jwt,
      id: data.id,
      email: data.email,
      username: data.username,
      name: data.name,
      surname: data.surname,
      age: data.age,
      gender: data.gender,
      bio: data.bio,
      goals: data.goals,
      emergencyContact: data.emergencyContact,
      profilePhoto: data.profilePhoto
    };
    
    localStorage.setItem("resiliaUser", JSON.stringify(userToSave));
    return { success: true };

  } catch (error) {
    return { 
      success: false, 
      message: "Invalid email or password" 
    };
  }
};

// --- GET CURRENT USER ---
export const getCurrentUser = () => {
  const userStr = localStorage.getItem("resiliaUser");
  if (!userStr) return null;
  return JSON.parse(userStr);
};

// --- LOGOUT ---
export const logoutUser = () => {
  localStorage.removeItem("resiliaUser");
  localStorage.removeItem("chatHistory"); 
};

// --- UPDATE PROFILE (FIXED) ---
export const updateUserProfile = async (data) => {
  try {
    const currentUser = getCurrentUser();
    
    // Safety check: ensure we have a token before trying to update
    if (!currentUser || !currentUser.token) {
        return { success: false, message: "You are not logged in." };
    }

    // 1. Call the backend PUT endpoint
    // We manually add the header here to be 100% sure it works
    const response = await api.put("/user/profile", data, {
        headers: {
            Authorization: `Bearer ${currentUser.token}`
        }
    });
    
    // 2. Get the updated user data from backend (It returns a JwtResponse object)
    const updatedUserData = response.data;

    // 3. Update LocalStorage
    // We merge the old data (which has the token) with the new data from the server
    const newUserState = {
      ...currentUser,      // Keep existing token and ID
      ...updatedUserData,  // Overwrite bio, goals, photo, etc.
      token: currentUser.token // Explicitly ensure token stays
    };

    localStorage.setItem("resiliaUser", JSON.stringify(newUserState));
    
    return { success: true, message: "Profile updated successfully!" };
  } catch (error) {
    console.error("Update error:", error);
    return { 
      success: false, 
      message: "Failed to update profile." 
    };
  }
};
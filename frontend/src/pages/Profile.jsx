import React, { useState, useEffect } from "react";
import { ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
// Make sure this path matches where your auth.js is located
import { getCurrentUser, updateUserProfile } from "../utils/auth";

export default function Profile() {
  const navigate = useNavigate();
  // Form State
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState(13);
  const [gender, setGender] = useState("");
  const [bio, setBio] = useState("");
  const [goals, setGoals] = useState("");
  const [emergencyContact, setEmergencyContact] = useState("");

  // UI State
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load user data on component mount
  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      // Populate form fields if data exists, otherwise default to empty string
      setUsername(user.username || "");
      setName(user.name || "");
      setSurname(user.surname || "");
      setEmail(user.email || "");
      setAge(user.age || 13);
      setGender(user.gender || "");
      setBio(user.bio || "");
      setGoals(user.goals || "");
      setEmergencyContact(user.emergencyContact || "");
      setProfilePhoto(user.profilePhoto || null);
    } else {
      // If no user logged in, redirect to login
      navigate("/login");
    }
  }, [navigate]);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (e.g., limit to 2MB) to prevent DB issues
      if (file.size > 2 * 1024 * 1024) {
          setMessage({ type: "error", text: "Image is too large. Max 2MB." });
          return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePhoto(reader.result);
        setMessage(null); // Clear any previous errors
      };
      reader.readAsDataURL(file);
    }
  };

  // --- THE FIX IS HERE ---
  // We made this function 'async' so we can 'await' the backend response
  const handleSave = async () => {
    setIsLoading(true);
    setMessage(null);

    // Prepare the data object
    const userDataToSend = {
      username,
      name,
      surname,
      age,
      gender,
      bio,
      goals,
      emergencyContact,
      profilePhoto
    };

    // Await the actual result from the backend call
    const result = await updateUserProfile(userDataToSend);
    
    setIsLoading(false);

    if (result.success) {
      // Show success message
      setMessage({ type: "success", text: result.message });
      // Hide it automatically after 3 seconds
      setTimeout(() => setMessage(null), 3000);
    } else {
      // Show error message (don't auto-hide errors)
      setMessage({ type: "error", text: result.message || "An unknown error occurred." });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#c4f0ed] via-[#c9f4e4] to-[#bef4d5] p-6 sm:p-10">
      {/* Back Button */}
      <button
        onClick={() => navigate("/home")}
        className="flex items-center gap-2 text-gray-700 font-medium mb-6 hover:text-gray-900 transition"
      >
        <ArrowLeft className="w-5 h-5" /> Back to Home
      </button>

      {/* Profile Container */}
      <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-xl rounded-3xl p-8 sm:p-12 shadow-2xl border border-[#b2f2c3]/50">
        <h1 className="text-3xl font-bold text-[#66CDAA] mb-8 text-center">My Profile</h1>
        
        {/* Message Feedback Area (Improved UI) */}
        {message && (
          <div
            className={`mb-6 flex items-center justify-center gap-2 p-4 rounded-xl font-medium transition-all ${
              message.type === "error"
                ? "bg-red-100 text-red-700 border border-red-200"
                : "bg-green-100 text-green-800 border border-green-200"
            }`}
          >
            {message.type === "error" ? <AlertCircle className="w-5 h-5"/> : <CheckCircle className="w-5 h-5"/>}
            {message.text}
          </div>
        )}
        
        <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center">
          {/* Photo Upload */}
          <div className="flex flex-col items-center gap-4">
            <div className="w-32 h-32 md:w-40 md:h-40 bg-[#b2f2c3]/20 rounded-full overflow-hidden border-4 border-white shadow-lg relative group">
              {profilePhoto ? (
                <img src={profilePhoto} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="flex items-center justify-center w-full h-full text-[#66CDAA]/50 text-4xl bg-gray-50">
                  📷
                </div>
              )}
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-medium pointer-events-none">
                  Change
              </div>
            </div>
            <label className="cursor-pointer px-5 py-2.5 bg-white text-[#66CDAA] font-medium rounded-xl shadow-sm hover:shadow-md transition border border-[#b2f2c3]/50 active:scale-95">
              Upload Photo
              <input
                type="file"
                accept="image/png, image/jpeg"
                onChange={handlePhotoChange}
                className="hidden"
              />
            </label>
          </div>

          {/* Details Form */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1 ml-1">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200/80 focus:outline-none focus:ring-2 focus:ring-[#66CDAA] focus:border-transparent bg-white/60 text-gray-800 transition-all"
                placeholder="Choose a username"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1 ml-1">First Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200/80 focus:outline-none focus:ring-2 focus:ring-[#66CDAA] focus:border-transparent bg-white/60 text-gray-800 transition-all"
                placeholder="Your first name"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1 ml-1">Last Name</label>
              <input
                type="text"
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200/80 focus:outline-none focus:ring-2 focus:ring-[#66CDAA] focus:border-transparent bg-white/60 text-gray-800 transition-all"
                placeholder="Your last name"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1 ml-1">Email</label>
              <input
                type="email"
                value={email}
                disabled
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-100/80 text-gray-500 cursor-not-allowed select-none"
                title="Email cannot be changed"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1 ml-1">Age</label>
              <input
                type="number"
                min="13"
                max="120"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200/80 focus:outline-none focus:ring-2 focus:ring-[#66CDAA] focus:border-transparent bg-white/60 text-gray-800 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1 ml-1">Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200/80 focus:outline-none focus:ring-2 focus:ring-[#66CDAA] focus:border-transparent bg-white/60 text-gray-800 transition-all appearance-none"
                style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: `right 0.5rem center`, backgroundRepeat: `no-repeat`, backgroundSize: `1.5em 1.5em`, paddingRight: '2.5rem' }}
              >
                <option value="">Select Gender</option>
                <option value="female">Female</option>
                <option value="male">Male</option>
                <option value="non-binary">Non-binary</option>
                <option value="prefer-not-to-say">Prefer not to say</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1 ml-1">Bio</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows="3"
                className="w-full px-4 py-3 rounded-xl border border-gray-200/80 focus:outline-none focus:ring-2 focus:ring-[#66CDAA] focus:border-transparent bg-white/60 text-gray-800 transition-all resize-none"
                placeholder="Tell us a little bit about yourself..."
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1 ml-1">Mental Health Goals</label>
              <textarea
                value={goals}
                onChange={(e) => setGoals(e.target.value)}
                rows="3"
                className="w-full px-4 py-3 rounded-xl border border-gray-200/80 focus:outline-none focus:ring-2 focus:ring-[#66CDAA] focus:border-transparent bg-white/60 text-gray-800 transition-all resize-none"
                placeholder="What are you hoping to achieve?"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1 ml-1">Emergency Contact</label>
              <input
                type="text"
                value={emergencyContact}
                onChange={(e) => setEmergencyContact(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200/80 focus:outline-none focus:ring-2 focus:ring-[#66CDAA] focus:border-transparent bg-white/60 text-gray-800 transition-all"
                placeholder="Phone number or email of a trusted contact"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-10 flex justify-center">
          <button
            onClick={handleSave}
            disabled={isLoading}
            className={`px-10 py-3.5 text-lg font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl active:scale-95 flex items-center gap-2
              ${isLoading 
                ? "bg-gray-300 text-gray-500 cursor-not-allowed" 
                : "bg-gradient-to-r from-[#66CDAA] to-[#5cb897] hover:from-[#5cb897] hover:to-[#4ea685] text-white"
              }`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
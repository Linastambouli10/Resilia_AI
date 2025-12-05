import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../components/Input";
import { registerUser } from "../utils/auth";
import { motion } from "framer-motion";
import logo from '../assets/resilia-logo.png';

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    username: "",
    email: "",
    age: "",
    gender: "",
    password: "",
    confirm: ""
  });
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // FIX: Added 'async' here
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    // Validation
    if (!formData.name || !formData.surname || !formData.username || !formData.email || !formData.age || !formData.gender) {
      setMessage({ type: "error", text: "Please fill in all fields." });
      return;
    }
    if (!formData.email.includes("@")) {
      setMessage({ type: "error", text: "Please enter a valid email." });
      return;
    }
    if (formData.age < 13 || formData.age > 120) {
      setMessage({ type: "error", text: "Please enter a valid age." });
      return;
    }
    if (formData.password.length < 6) {
      setMessage({
        type: "error",
        text: "Password must be at least 6 characters.",
      });
      return;
    }
    if (formData.password !== formData.confirm) {
      setMessage({ type: "error", text: "Passwords do not match." });
      return;
    }

    setLoading(true);
    
    try {
      // FIX: Added 'await' here so we wait for the server response
      const res = await registerUser({
        name: formData.name,
        surname: formData.surname,
        username: formData.username,
        email: formData.email,
        age: formData.age,
        gender: formData.gender,
        password: formData.password
      });

      if (res.success) {
        setMessage({ type: "success", text: "Account created successfully!" });
        setTimeout(() => navigate("/home"), 1000); // Changed to /home since register now auto-logins
      } else {
        // If message is empty, provide a default error
        setMessage({ type: "error", text: res.message || "Registration failed. Please try again." });
      }
    } catch (err) {
       setMessage({ type: "error", text: "An unexpected error occurred." });
    } finally {
       setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#c4f0ed] via-[#c9f4e4] to-[#bef4d5] py-8">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white/70 backdrop-blur-md shadow-xl rounded-2xl p-8 w-full max-w-md border border-[#b2f2c3]/50"
      >
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <img 
            src={logo} 
            alt="Resilia Logo" 
            className="h-16 w-auto drop-shadow-lg"
          />
        </div>

        <h1 className="text-3xl font-bold text-[#66CDAA] text-center mb-2">
          Create your Resilia account
        </h1>
        <p className="text-center text-gray-600 mb-6">
          Start your journey towards emotional balance 🌤️
        </p>

        {message && (
          <div
            className={`mb-4 text-center p-3 rounded-md ${
              message.type === "error"
                ? "bg-red-100 text-red-700"
                : "bg-[#b2f2c3]/30 text-gray-700"
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Name and Surname Row */}
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="First Name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder=""
            />
            <Input
              label="Last Name"
              name="surname"
              type="text"
              value={formData.surname}
              onChange={handleChange}
              placeholder=""
            />
          </div>

          <Input
            label="Username"
            name="username"
            type="text"
            value={formData.username}
            onChange={handleChange}
            placeholder=""
          />

          <Input
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder=""
          />

          {/* Age and Gender Row */}
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Age"
              name="age"
              type="number"
              value={formData.age}
              onChange={handleChange}
              placeholder=""
              min="13"
              max="120"
            />
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Gender
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b2f2c3] focus:border-transparent bg-white"
              >
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="prefer-not-to-say">Prefer not to say</option>
              </select>
            </div>
          </div>

          <Input
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="At least 6 characters"
          />
          <Input
            label="Confirm Password"
            name="confirm"
            type="password"
            value={formData.confirm}
            onChange={handleChange}
            placeholder="Retype password"
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-gradient-to-r from-[#b2f2c3] to-[#bef4d5] hover:from-[#a0e5b1] hover:to-[#ace5c3] text-gray-800 font-semibold rounded-xl py-2 mt-2 transition shadow-md hover:shadow-lg disabled:opacity-50"
          >
            {loading ? "Creating..." : "Register"}
          </button>
        </form>

        <p className="text-sm text-center text-gray-600 mt-4">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-gray-800 font-semibold cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>
      </motion.div>
    </div>
  );
}
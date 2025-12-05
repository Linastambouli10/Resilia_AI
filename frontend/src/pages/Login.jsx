import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Input from "../components/Input";
import { loginUser } from "../utils/auth";
import { motion } from "framer-motion";
import logo from '../assets/resilia-logo.png';
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (!email || !password) {
      setMessage({ type: "error", text: "Please fill in all fields." });
      return;
    }

    setLoading(true);
    const res = await loginUser({ email, password });
    setLoading(false);

    if (res.success) {
      setMessage({ type: "success", text: "Login successful!" });
      setTimeout(() => navigate("/home"), 900);
    } else {
      setMessage({ type: "error", text: res.message });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#c4f0ed] via-[#c9f4e4] to-[#bef4d5]">
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
            alt="Resilia-logo.png"
            className="h-16 w-auto drop-shadow-lg"
          />
        </div>

        <h1 className="text-3xl font-bold text-[#66CDAA] text-center mb-2">
          Welcome back to Resilia AI
        </h1>
        <p className="text-center text-gray-600 mb-6">
          Reconnect with your calm mind 🌙
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
          <Input
            label="Email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />
          <Input
            label="Password"
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Your password"
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-gradient-to-r from-[#b2f2c3] to-[#bef4d5] hover:from-[#a0e5b1] hover:to-[#ace5c3] text-gray-800 font-semibold rounded-xl py-2 mt-2 transition shadow-md hover:shadow-lg"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-sm text-center text-gray-600 mt-4">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-gray-800 font-semibold hover:underline"
          >
            Register
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { History, User, BarChart3, LogOut } from "lucide-react";
import { motion } from "framer-motion";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("resiliaUser");
    navigate("/login");
  };

  return (
    <motion.nav
      initial={{ opacity: 0, y: -15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="
        fixed top-0 inset-x-0 w-screen 
        bg-white/60 backdrop-blur-md 
        shadow-sm border-b border-blue-100 
        z-50
      "
    >
      {/* FULL WIDTH INNER CONTAINER WITH NO LEFT/RIGHT PADDING */}
      <div className="w-full flex items-center justify-between px-4 py-3">

        {/* LEFT — LOGO */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => navigate("/home")}
        >
          <h1 className="text-2xl font-bold text-sky-600 drop-shadow-sm tracking-wide">
            Resilia
          </h1>
        </motion.div>

        {/* RIGHT — NAVIGATION LINKS */}
        <div className="flex items-center space-x-8 text-slate-700 font-medium">
          <Link
            to="/history"
            className="flex items-center gap-2 hover:text-sky-600 transition"
          >
            <History className="w-5 h-5" /> History
          </Link>

          <Link
            to="/profile"
            className="flex items-center gap-2 hover:text-sky-600 transition"
          >
            <User className="w-5 h-5" /> Profile
          </Link>

          <Link
            to="/mood-trends"
            className="flex items-center gap-2 hover:text-sky-600 transition"
          >
            <BarChart3 className="w-5 h-5" /> Mood Trends
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-rose-500 hover:text-rose-600 transition font-semibold"
          >
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </div>
      </div>

      {/* ANIMATED UNDERLINE */}
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: "100%" }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
        className="h-[2px] bg-gradient-to-r from-sky-300 via-blue-400 to-sky-300"
      ></motion.div>
    </motion.nav>
  );
}

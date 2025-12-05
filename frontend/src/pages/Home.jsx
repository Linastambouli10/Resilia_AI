import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate, useLocation } from "react-router-dom";
import api from "../utils/api";
import {
  MessageCircle,
  X,
  Send,
  Sparkles,
  Moon,
  Sun,
  Coffee,
  Wind,
  Menu,
  History,
  User,
  BarChart3,
  LogOut,
} from "lucide-react";
import { getCurrentUser, logoutUser } from "../utils/auth";
import logo from '../assets/resilia-logo.png';

// --- Components ---

const Logo = ({ className = "" }) => (
  <div className={`font-bold text-3xl flex items-center gap-3 ${className}`}>
    <div className="w-14 h-14 rounded-full bg-white/30 flex items-center justify-center overflow-hidden border border-white/40 shadow-sm">
      <img src={logo} alt="Resilia Logo" className="w-full h-full object-contain p-1" />
    </div>
    <span className="bg-gradient-to-r from-teal-600 via-emerald-600 to-cyan-600 bg-clip-text text-transparent">
      Resilia AI
    </span>
  </div>
);

const TypingIndicator = () => (
  <div className="flex gap-1 p-3 bg-white border-2 border-[#b2f2c3] rounded-2xl w-fit shadow-sm">
    {[0, 1, 2].map((dot) => (
      <motion.div
        key={dot}
        className="w-2 h-2 bg-[#66CDAA] rounded-full"
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 0.6, repeat: Infinity, delay: dot * 0.2 }}
      />
    ))}
  </div>
);

export default function Home() {
  const navigate = useNavigate();
  const location = useLocation();
  const messagesEndRef = useRef(null);

  const [currentUser, setCurrentUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [conversationId, setConversationId] = useState(null);

  // Chat State
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [selectedMood, setSelectedMood] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);

  const affirmations = [
    "You are stronger than your anxious thoughts 🌿",
    "Every breath is a fresh start 🌤️",
    "Healing takes time, and that's perfectly okay 💙",
    "You are doing better than you think 💫",
    "Peace begins with accepting how you feel 💧",
    "Your emotions matter — always 🌸",
  ];
  const [quote, setQuote] = useState(affirmations[0]);

  const moods = [
    { emoji: "😢", label: "Struggling", color: "from-[#d4edf6] to-[#c4f0ed]" },
    { emoji: "😕", label: "Low", color: "from-[#c4f0ed] to-[#c9f4e4]" },
    { emoji: "😐", label: "Okay", color: "from-[#c9f4e4] to-[#bef4d5]" },
    { emoji: "🙂", label: "Good", color: "from-[#bef4d5] to-[#b2f2c3]" },
    { emoji: "😊", label: "Great", color: "from-[#b2f2c3] to-[#bef4d5]" },
  ];

  const quickTips = [
    { icon: Wind, text: "Take 3 deep breaths", color: "text-teal-600", bg: "bg-[#c4f0ed]" },
    { icon: Coffee, text: "Stay hydrated", color: "text-teal-700", bg: "bg-[#c9f4e4]" },
    { icon: Sun, text: "Get some sunlight", color: "text-emerald-600", bg: "bg-[#bef4d5]" },
    { icon: Moon, text: "Practice gratitude", color: "text-cyan-700", bg: "bg-[#d4edf6]" },
  ];

  // --- 1. HELPER: LOAD CONVERSATION ---
  // This is the key fix. We moved the fetching logic here so we can reuse it.
  const loadConversation = async (id) => {
    try {
      setConversationId(id);
      setChatOpen(true);
      setMessages([]); // Clear messages briefly while loading to show transition

      const response = await api.get(`/chat/conversations/${id}/messages`);
      
      const loadedMessages = response.data.map(msg => ({
          id: msg.id,
          text: msg.content,
          sender: msg.sender,
          timestamp: new Date(msg.timestamp),
          emotion: msg.emotion
      }));
      setMessages(loadedMessages);
    } catch (error) {
      console.error("Failed to load conversation", error);
    }
  };

  // --- 2. AUTH CHECK ---
  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setCurrentUser(user);
      // Only set default if NO conversation is loaded
      if(messages.length === 0 && !conversationId) {
          setMessages([{
            id: 1,
            text: `Hi ${user.name || 'there'}! I'm Resilia, your mental health companion. How are you feeling today?`,
            sender: "bot",
            timestamp: new Date(),
          }]);
      }
    } else {
      navigate("/login");
    }
  }, [navigate]);

  // --- 3. LOAD SIDEBAR HISTORY ---
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await api.get("/chat/conversations");
        const processedHistory = response.data.map(conv => {
            const firstUserMsg = conv.messages && conv.messages.find(m => m.sender === 'user');
            let title = firstUserMsg ? firstUserMsg.content : `New Chat ${conv.id}`;
            if (title.length > 25) title = title.substring(0, 25) + "...";
            
            return {
                ...conv,
                displayTitle: title,
                date: new Date(conv.startTime).toLocaleDateString(),
                duration: new Date(conv.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
                mood: "📝"
            };
        });
        setChatHistory(processedHistory.slice(0, 3)); 
      } catch (error) {
        console.error("Could not load history", error);
      }
    };
    fetchHistory();
  }, []);

  // --- 4. HANDLE HISTORY NAVIGATION (FROM HISTORY PAGE) ---
  useEffect(() => {
      if (location.state && location.state.conversationId) {
          loadConversation(location.state.conversationId);
      }
  }, [location.state]);

  // --- 5. AUTO SCROLL ---
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping, chatOpen]);

  // --- 6. QUOTES & KEYS ---
  useEffect(() => {
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * affirmations.length);
      setQuote(affirmations[randomIndex]);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setChatOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // --- HANDLERS ---

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const newMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    const messageToSend = inputMessage;
    setInputMessage("");
    setIsTyping(true);

    try {
      const response = await api.post("/chat/message", {
        userMessage: messageToSend,
        conversationId: conversationId 
      });

      const data = response.data;

      // If new conversation started, update ID
      if (data.conversationId) setConversationId(data.conversationId);

      const botResponse = {
        id: Date.now() + 1,
        text: data.aiResponse, 
        sender: "bot",
        timestamp: new Date(),
        emotion: data.detectedEmotion 
      };
      setMessages((prev) => [...prev, botResponse]);

    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [...prev, {
        id: Date.now() + 2,
        text: "I'm having trouble connecting to the server.",
        sender: "bot",
        timestamp: new Date(),
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  const handleMoodSelect = (index) => {
    setSelectedMood(index);
  };

  if (!currentUser) return null;
  const displayName = currentUser.name || currentUser.username || "Friend";

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#c4f0ed] via-[#c9f4e4] to-[#bef4d5] relative overflow-hidden">
      
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0], opacity: [0.05, 0.08, 0.05] }} transition={{ duration: 20, repeat: Infinity }} className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-[#c4f0ed] to-[#bef4d5] rounded-full blur-3xl" />
        <motion.div animate={{ scale: [1.2, 1, 1.2], rotate: [90, 0, 90], opacity: [0.05, 0.08, 0.05] }} transition={{ duration: 25, repeat: Infinity }} className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-tr from-[#c4f0ed] to-[#c9f4e4] rounded-full blur-3xl" />
      </div>

      {/* Navbar */}
      <nav className="relative bg-white/70 backdrop-blur-xl border-b border-[#b2f2c3]/30 shadow-sm px-6 py-4 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <motion.div className="flex items-center gap-3" whileHover={{ scale: 1.05 }}>
            <Logo />
          </motion.div>
          <div className="hidden md:flex gap-6 items-center">
            <Link to="/history" className="text-gray-700 hover:text-gray-900 font-medium transition flex items-center gap-2"><History className="w-4 h-4" /> History</Link>
            <Link to="/mental-health-trends" className="text-gray-700 hover:text-gray-900 font-medium transition flex items-center gap-2"><BarChart3 className="w-4 h-4" /> Trends</Link>
            <Link to="/profile" className="text-gray-700 hover:text-gray-900 font-medium transition flex items-center gap-2"><User className="w-4 h-4" /> Profile</Link>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleLogout} className="bg-gradient-to-r from-[#bef4d5] to-[#b2f2c3] text-gray-800 px-4 py-2 rounded-xl font-medium flex items-center gap-2 shadow-sm hover:shadow-md transition"><LogOut className="w-4 h-4" /> Logout</motion.button>
          </div>
          <motion.button whileTap={{ scale: 0.9 }} onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden text-gray-700"><Menu className="w-6 h-6" /></motion.button>
        </div>
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="md:hidden mt-4 pb-4 space-y-3">
              <Link to="/history" className="w-full block text-gray-700 p-2">History</Link>
              <button onClick={handleLogout} className="w-full text-left text-gray-800 p-2">Logout</button>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}><span className="text-4xl sm:text-5xl">👋</span></motion.div>
            <h2 className="text-3xl sm:text-5xl font-bold text-[#008080] bg-clip-text ">Welcome back, {displayName}</h2>
          </div>
          <motion.div key={quote} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#c4f0ed] via-[#c9f4e4] to-[#bef4d5] rounded-3xl blur-lg opacity-60"></div>
            <p className="relative text-lg sm:text-xl text-gray-700 font-medium italic bg-white/90 backdrop-blur-sm px-6 sm:px-8 py-5 sm:py-6 rounded-3xl shadow-xl border border-white/50">
              <Sparkles className="inline w-5 h-5 text-[#b2f2c3] mr-2" />{quote}
            </p>
          </motion.div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-br from-[#bef4d5] to-[#b2f2c3] rounded-3xl p-6 sm:p-7 shadow-2xl border border-white/50">
              <div className="flex items-center justify-between mb-4"><h3 className="text-lg sm:text-xl font-bold text-gray-800 flex items-center gap-2"><BarChart3 className="w-5 h-5" /> Mental Health Insight</h3></div>
              <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-4 mb-4"><p className="text-3xl font-bold text-gray-800 mb-1">1 in 5</p><p className="text-sm text-gray-700 font-medium">Adults experience mental illness annually</p></div>
              <Link to="/mental-health-trends" className="block text-center bg-white text-gray-800 px-4 py-2 rounded-xl font-semibold hover:shadow-lg transition text-sm">Explore More Trends</Link>
            </motion.div>

            {/* --- FIX IS HERE: CLICKABLE HISTORY --- */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#b2f2c3]/50">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl sm:text-2xl font-bold text-[#66CDAA] bg-clip-text flex items-center gap-3"><MessageCircle className="w-6 h-6 sm:w-7 sm:h-7 text-[#b2f2c3]" /> Recent Conversations</h3>
                <Link to="/history" className="text-sm font-medium text-gray-700 hover:text-gray-900 transition">View All</Link>
              </div>
              <div className="space-y-4">
                {chatHistory.length > 0 ? chatHistory.map((chat, index) => (
                  <motion.div
                    key={chat.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02, x: 8 }}
                    // --- THIS IS THE FIX ---
                    onClick={() => loadConversation(chat.id)} 
                    // -----------------------
                    className="group relative bg-gradient-to-br from-[#c4f0ed] via-[#c9f4e4] to-[#bef4d5] rounded-2xl p-4 sm:p-5 cursor-pointer border-2 border-transparent hover:border-[#b2f2c3] transition-all overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/0 to-white/0 group-hover:from-white/10 group-hover:via-white/10 group-hover:to-white/10 transition-all"></div>
                    <div className="relative flex items-start gap-4">
                      <div className="text-3xl sm:text-4xl">{chat.mood}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-2 gap-2">
                          <h4 className="font-bold text-gray-800 text-base sm:text-lg group-hover:text-gray-900 transition truncate">{chat.displayTitle}</h4>
                          <div className="flex flex-col items-end gap-1 flex-shrink-0">
                            <span className="text-xs font-medium text-gray-600 bg-white/80 px-3 py-1 rounded-full">{chat.date}</span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-2">Click to resume chat...</p>
                      </div>
                    </div>
                  </motion.div>
                )) : (
                  <div className="text-center py-12 text-gray-500">No recent conversations found.</div>
                )}
              </div>
            </motion.div>
          </div>

          <div className="space-y-6">
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="relative bg-gradient-to-br from-[#b2f2c3] via-[#bef4d5] to-[#c9f4e4] rounded-3xl p-6 sm:p-7 text-gray-800 shadow-2xl overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-3xl"></div>
              <div className="relative">
                <div className="flex items-center gap-2 mb-4"><Sparkles className="w-6 h-6" /><h3 className="text-xl font-bold">Daily Check-in</h3></div>
                <div className="grid grid-cols-5 gap-2">
                  {moods.map((mood, i) => (
                    <motion.button key={i} whileHover={{ scale: 1.15, rotate: 5 }} whileTap={{ scale: 0.95 }} onClick={() => handleMoodSelect(i)} className={`relative bg-white/30 hover:bg-white/40 backdrop-blur-sm rounded-2xl p-2 sm:p-3 text-2xl sm:text-3xl transition-all border-2 ${selectedMood === i ? "border-white shadow-lg" : "border-transparent"}`}>{mood.emoji}</motion.button>
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 sm:p-7 shadow-2xl border border-[#b2f2c3]/50">
              <h3 className="text-lg sm:text-xl font-bold text-[#20B2AA] bg-clip-text mb-5 flex items-center gap-2"><Sparkles className="w-5 h-5 text-[#20B2AA]" /> Quick Wellness Tips</h3>
              <div className="space-y-3">
                {quickTips.map((tip, i) => (
                  <motion.div key={i} whileHover={{ x: 4 }} className={`flex items-center gap-4 ${tip.bg} rounded-2xl p-4 cursor-pointer border-2 border-transparent hover:border-[#b2f2c3]/50 transition-all group`}>
                    <div className={`p-3 rounded-xl bg-white shadow-sm group-hover:shadow-md transition`}><tip.icon className={`w-5 h-5 ${tip.color}`} /></div>
                    <span className="font-medium text-gray-700 group-hover:text-gray-900 transition text-sm sm:text-base">{tip.text}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Floating Button */}
      <AnimatePresence>
        {!chatOpen && (
          <motion.button initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} whileHover={{ scale: 1.15 }} onClick={() => setChatOpen(true)} className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 bg-gradient-to-br from-teal-500 via-emerald-500 to-cyan-600 text-white p-5 sm:p-6 rounded-full shadow-2xl hover:shadow-teal-500/50 transition-all z-50">
            <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {chatOpen && (
          <motion.div initial={{ opacity: 0, scale: 0.8, y: 40 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.8, y: 40 }} transition={{ type: "spring", stiffness: 300, damping: 30 }} className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 bg-white rounded-3xl shadow-2xl border-2 border-teal-200 z-50 flex flex-col overflow-hidden w-[90vw] sm:w-[420px] h-[80vh] sm:h-[650px]">
            <div className="bg-gradient-to-r from-teal-500 via-emerald-500 to-cyan-600 text-white p-5 flex justify-between items-center flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center"><MessageCircle className="w-6 h-6" /></div>
                <div><h3 className="font-bold text-lg">Resilia</h3><p className="text-xs opacity-90">Always here for you</p></div>
              </div>
              <button onClick={() => setChatOpen(false)}><X className="w-5 h-5" /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-gradient-to-b from-[#c4f0ed]/30 via-[#c9f4e4]/20 to-white scroll-smooth">
              {messages.map((msg, idx) => (
                <motion.div key={idx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] rounded-2xl px-5 py-3 shadow-md ${msg.sender === "user" ? "bg-gradient-to-br from-teal-500 to-emerald-600 text-white" : "bg-white border-2 border-teal-100 text-slate-700"}`}>
                    <p className="text-sm leading-relaxed">{msg.text}</p>
                    <p className={`text-xs mt-2 ${msg.sender === "user" ? "text-teal-100" : "text-slate-400"}`}>{msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
                  </div>
                </motion.div>
              ))}
              {isTyping && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                   <TypingIndicator />
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-5 bg-gradient-to-r from-[#d4edf6] to-[#c9f4e4] border-t-2 border-teal-100 flex-shrink-0">
              <div className="flex gap-3">
                <input type="text" value={inputMessage} onChange={(e) => setInputMessage(e.target.value)} onKeyPress={(e) => e.key === "Enter" && handleSendMessage()} placeholder="Share what's on your mind..." className="flex-1 px-5 py-3.5 rounded-2xl border-2 border-teal-200 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent bg-white shadow-sm text-sm" />
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleSendMessage} className="bg-gradient-to-r from-teal-500 to-emerald-600 text-white p-4 rounded-2xl hover:shadow-lg transition shadow-md"><Send className="w-5 h-5" /></motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
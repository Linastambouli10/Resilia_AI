import React, { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../utils/api";

export default function History() {
  const navigate = useNavigate();
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        // 1. Ensure this matches your Backend Endpoint ("/conversations" or "/history")
        const response = await api.get("/chat/conversations");
        
        const formattedHistory = response.data.map(conv => {
            // Safety check if messages exist
            const firstMsg = conv.messages && conv.messages.length > 0 
                ? conv.messages.find(m => m.sender === "user")?.content 
                : "New Conversation";
            
            const safeTitle = firstMsg ? firstMsg : "Conversation " + conv.id;
            const dateObj = new Date(conv.startTime);
            
            return {
                id: conv.id,
                title: safeTitle.substring(0, 30) + (safeTitle.length > 30 ? "..." : ""),
                preview: "View conversation",
                date: dateObj.toLocaleDateString(),
                duration: dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                mood: "📝" 
            };
        });

        setHistoryData(formattedHistory);
      } catch (error) {
        console.error("Error loading history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const handleClickConversation = (id) => {
      // Navigate to Home and pass the conversationId in the 'state'
      navigate("/home", { state: { conversationId: id } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#c4f0ed] via-[#c9f4e4] to-[#bef4d5] p-6 sm:p-10">
      <button onClick={() => navigate("/home")} className="flex items-center gap-2 text-gray-700 font-medium mb-6 hover:text-gray-900 transition">
        <ArrowLeft className="w-5 h-5" /> Back
      </button>

      <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-xl rounded-3xl p-8 sm:p-12 shadow-2xl border border-[#b2f2c3]/50">
        <h2 className="text-3xl font-bold mb-8 text-gray-800">Conversation History</h2>

        {loading ? (
           <p className="text-center">Loading...</p>
        ) : historyData.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-600 text-lg">No conversations found.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {historyData.map((entry) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/50 rounded-2xl p-5 border hover:border-[#b2f2c3] cursor-pointer shadow-sm hover:shadow-md transition"
                onClick={() => handleClickConversation(entry.id)}
              >
                <div className="flex justify-between items-center">
                    <div>
                        <h3 className="font-bold text-gray-800">{entry.title}</h3>
                        <p className="text-xs text-gray-500">{entry.preview}</p>
                    </div>
                    <div className="text-right">
                        <span className="text-xs text-gray-500 block">{entry.date}</span>
                        <span className="text-xs text-gray-400">{entry.duration}</span>
                    </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
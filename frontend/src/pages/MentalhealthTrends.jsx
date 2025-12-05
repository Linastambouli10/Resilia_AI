import React, { useState } from "react";
import { ArrowLeft, TrendingUp, Brain, Heart, Activity, Lightbulb, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function MentalHealthTrends() {
  const navigate = useNavigate();

  // You can easily edit these statistics
  const statistics = [
    {
      icon: Users,
      value: "1 in 5",
      label: "Adults experience mental illness",
      color: "from-[#c4f0ed] to-[#c9f4e4]",
      iconColor: "text-teal-600"
    },
    {
      icon: Brain,
      value: "50%",
      label: "Of mental illness begins by age 14",
      color: "from-[#c9f4e4] to-[#bef4d5]",
      iconColor: "text-emerald-600"
    },
    {
      icon: Heart,
      value: "70%",
      label: "Improvement rate with proper treatment",
      color: "from-[#bef4d5] to-[#b2f2c3]",
      iconColor: "text-green-600"
    },
    {
      icon: Activity,
      value: "10-20 min",
      label: "Daily meditation can reduce anxiety",
      color: "from-[#b2f2c3] to-[#bef4d5]",
      iconColor: "text-cyan-600"
    }
  ];

  // Latest trends and research - easily editable
  const trends = [
    {
      title: "Digital Mental Health Tools on the Rise",
      description: "AI-powered mental health apps have seen a 200% increase in usage since 2020, making mental health support more accessible.",
      date: "2024",
      icon: TrendingUp
    },
    {
      title: "Workplace Mental Health Focus",
      description: "Companies are increasingly prioritizing employee mental health, with 76% offering mental health resources and support programs.",
      date: "2024",
      icon: Users
    },
    {
      title: "Youth Mental Health Awareness",
      description: "Schools are implementing mental health education programs, with mental health literacy becoming part of standard curriculum.",
      date: "2024",
      icon: Brain
    },
    {
      title: "Mindfulness & Meditation Benefits",
      description: "Research shows regular mindfulness practice reduces stress by 30% and improves overall emotional wellbeing significantly.",
      date: "2024",
      icon: Heart
    }
  ];

  // Quick facts - easily editable
  const quickFacts = [
    "Exercise is as effective as medication for mild to moderate depression",
    "Getting 7-9 hours of sleep improves mental clarity and emotional regulation",
    "Social connections are one of the strongest predictors of happiness and longevity",
    "Spending time in nature reduces stress hormones by up to 16%",
    "Writing about emotions can improve mental and physical health",
    "Helping others boosts your own happiness and reduces stress"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#c4f0ed] via-[#c9f4e4] to-[#bef4d5] p-6 sm:p-10">
      {/* Back Button */}
      <button
        onClick={() => navigate("/home")}
        className="flex items-center gap-2 text-gray-700 font-medium mb-6 hover:text-gray-900 transition"
      >
        <ArrowLeft className="w-5 h-5" /> Back to Home
      </button>

      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <TrendingUp className="w-10 h-10 text-[#b2f2c3]" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-700 to-gray-800 bg-clip-text text-transparent">
              Mental Health Trends
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            Stay informed about the latest in mental health awareness and research
          </p>
        </motion.div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statistics.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-gradient-to-br from-white to-[#bef4d5] rounded-2xl p-6 shadow-lg border border-white/50 hover:shadow-xl transition-shadow`}
            >
              <stat.icon className={`w-10 h-10 ${stat.iconColor} mb-4`} />
              <h3 className="text-3xl font-bold text-gray-800 mb-2">{stat.value}</h3>
              <p className="text-gray-700 text-sm font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Latest Trends */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-[#b2f2c3]/50"
        >
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="w-7 h-7 text-[#b2f2c3]" />
            <h2 className="text-2xl font-bold text-gray-800">Latest Trends & Research</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {trends.map((trend, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="bg-gradient-to-br from-[#c4f0ed] to-[#c9f4e4] rounded-2xl p-6 hover:shadow-lg transition-shadow border border-[#b2f2c3]/30"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-white rounded-xl">
                    <trend.icon className="w-6 h-6 text-[#b2f2c3]" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-gray-800 text-lg">{trend.title}</h3>
                      <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded-full">
                        {trend.date}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">{trend.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Quick Facts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-[#b2f2c3]/50"
        >
          <div className="flex items-center gap-3 mb-6">
            <Lightbulb className="w-7 h-7 text-[#b2f2c3]" />
            <h2 className="text-2xl font-bold text-gray-800">Did You Know?</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickFacts.map((fact, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + index * 0.05 }}
                className="bg-gradient-to-br from-[#bef4d5] to-[#b2f2c3] rounded-xl p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-gray-700 mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700 text-sm leading-relaxed font-medium">{fact}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-gradient-to-r from-[#b2f2c3] via-[#bef4d5] to-[#c9f4e4] rounded-3xl p-8 text-center shadow-xl"
        >
          <h3 className="text-2xl font-bold text-gray-800 mb-3">
            Your Mental Health Matters
          </h3>
          <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
            Remember, seeking help is a sign of strength. If you're struggling, 
            reach out to a mental health professional or talk to someone you trust.
          </p>
          <button
            onClick={() => navigate("/home")}
            className="px-8 py-3 bg-white text-gray-800 rounded-xl font-semibold hover:shadow-lg transition"
          >
            Start a Conversation with Resilia
          </button>
        </motion.div>
      </div>
    </div>
  );
}
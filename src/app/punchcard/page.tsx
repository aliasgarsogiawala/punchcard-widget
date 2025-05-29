'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function PunchCardPage() {
  const [username, setUsername] = useState('aliasgarsogiawala');
  const [svgUrl, setSvgUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    handleSubmit();
  }, []);

  const handleSubmit = () => {
    setSvgUrl('');
    setLoading(true);
    setTimeout(() => {
      setSvgUrl(`/api/punchcard?user=${username}`);
      setLoading(false);
    }, 800);
  };

  return (
    <motion.main 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-[#e6f0ff] text-blue-900 px-6 py-10 font-sans"
    >
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <h1 className="text-5xl font-bold mb-2 text-blue-900">📊 GitHub Punch Card</h1>
          <div className="h-1 w-20 bg-blue-400 rounded mb-6"></div>
          <p className="mb-6 text-blue-800 leading-relaxed">
            Visualize the hours and days you commit the most. Enter any public GitHub username and see a punch card of your weekly coding habits.
          </p>
        </motion.div>

        <motion.div 
          className="flex flex-wrap items-center gap-4 mb-8"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="relative w-full sm:w-auto">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-white text-blue-900 px-4 py-3 rounded-lg border border-[#cfe0f5] w-full sm:w-80 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all duration-300"
              placeholder="GitHub username"
            />
            <div 
              className="absolute right-3 top-3 text-blue-500 cursor-pointer hover:text-blue-700 transition-colors duration-300"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            >
              ℹ️
              {showTooltip && (
                <div className="absolute right-0 w-48 p-2 mt-2 text-xs bg-white text-blue-800 rounded-md shadow-lg z-10 border border-[#cfe0f5]">
                  Enter any public GitHub username to see their commit patterns
                </div>
              )}
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSubmit}
            className="bg-gradient-to-r from-blue-400 to-indigo-400 px-6 py-3 rounded-lg text-white font-medium shadow-md transition-all duration-300"
          >
            Generate
          </motion.button>
        </motion.div>

        {loading && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="flex justify-center items-center py-10"
          >
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-400"></div>
            <p className="ml-4 text-blue-600">Analyzing commit patterns...</p>
          </motion.div>
        )}

        {svgUrl && !loading && (
          <motion.div 
            initial={{ y: 40, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="rounded-xl overflow-hidden shadow-xl"
          >
            <div className="bg-[#f9fbfd] p-3 border-b border-[#cfe0f5] flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-red-400 mr-2"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400 mr-2"></div>
                <div className="w-3 h-3 rounded-full bg-green-400 mr-2"></div>
                <span className="text-xs text-blue-600 ml-2">Commit Patterns</span>
              </div>
              <div className="text-xs text-blue-500">{username}</div>
            </div>
            <div className="overflow-auto bg-white p-6 border border-[#cfe0f5]">
              <img src={svgUrl} alt="Punch Card SVG" className="max-w-full mx-auto" />
            </div>
          </motion.div>
        )}

        {svgUrl && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm"
          >
            <div className="bg-[#e0f2fe] p-4 rounded-lg border border-[#bae6fd] hover:border-blue-400 transition-colors duration-300">
              <h3 className="font-semibold text-blue-700 mb-2">🌙 Night Owl or Early Bird?</h3>
              <p className="text-blue-800">See what time of day you&apos;re most productive based on your commit patterns.</p>
            </div>
            <div className="bg-[#ede9fe] p-4 rounded-lg border border-[#ddd6fe] hover:border-purple-400 transition-colors duration-300">
              <h3 className="font-semibold text-purple-700 mb-2">📅 Weekend Warrior?</h3>
              <p className="text-purple-800">Discover if you code more on weekdays or prefer weekend coding sessions.</p>
            </div>
            <div className="bg-[#dcfce7] p-4 rounded-lg border border-[#bbf7d0] hover:border-green-400 transition-colors duration-300">
              <h3 className="font-semibold text-green-700 mb-2">⏱️ Peak Hours</h3>
              <p className="text-green-800">Identify your most productive hours to optimize your coding schedule.</p>
            </div>
          </motion.div>
        )}
        {svgUrl && !loading && (
  <div className="mt-6 bg-white border border-blue-200 rounded-md p-4 shadow-sm">
    <h3 className="font-semibold text-blue-900 mb-2">📎 Embed in Your GitHub README</h3>
    <p className="text-sm text-gray-700 mb-2">Copy and paste this into your README.md:</p>
    <pre className="bg-blue-50 text-sm text-blue-900 p-3 rounded font-mono overflow-x-auto">
      <code>
        {`![GitHub Punch Card](https://yourdomain.com/api/punchcard?user=${username})`}
      </code>
    </pre>
  </div>
)}
      </div>
    </motion.main>
  );
}
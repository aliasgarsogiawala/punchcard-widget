'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function PunchCardPage() {
  const [username, setUsername] = useState('aliasgarsogiawala');
  const [svgUrl, setSvgUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    // Auto-generate on first load
    handleSubmit();
  }, []);

  const handleSubmit = () => {
    setSvgUrl('');
    setLoading(true);
    setTimeout(() => {
      setSvgUrl(`/api/punchcard?user=${username}`);
      setLoading(false);
    }, 800); // Increased timeout for better animation effect
  };

  return (
    <motion.main 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-b from-[#0d1117] to-[#161b22] text-white px-6 py-10 font-mono"
    >
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <h1 className="text-5xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">📊 GitHub Punch Card</h1>
          <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded mb-6"></div>
          <p className="mb-6 text-gray-400 leading-relaxed">
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
              className="bg-[#0d1117] text-white px-4 py-3 rounded-lg border border-gray-700 w-full sm:w-80 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              placeholder="GitHub username"
            />
            <div 
              className="absolute right-3 top-3 text-gray-400 cursor-pointer hover:text-blue-400 transition-colors duration-300"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            >
              ℹ️
              {showTooltip && (
                <div className="absolute right-0 w-48 p-2 mt-2 text-xs bg-gray-800 rounded-md shadow-lg z-10 border border-gray-700">
                  Enter any public GitHub username to see their commit patterns
                </div>
              )}
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSubmit}
            className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 rounded-lg hover:from-blue-500 hover:to-purple-500 font-medium shadow-lg shadow-blue-900/20 transition-all duration-300"
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
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            <p className="ml-4 text-gray-400">Analyzing commit patterns...</p>
          </motion.div>
        )}

        {svgUrl && !loading && (
          <motion.div 
            initial={{ y: 40, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="rounded-xl overflow-hidden shadow-2xl"
          >
            <div className="bg-[#161b22] p-3 border-b border-gray-800 flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                <span className="text-xs text-gray-400 ml-2">Commit Patterns</span>
              </div>
              <div className="text-xs text-gray-500">{username}</div>
            </div>
            <div className="overflow-auto bg-[#0d1117] p-6 border border-gray-800">
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
            <div className="bg-[#161b22] p-4 rounded-lg border border-gray-800 hover:border-blue-500 transition-colors duration-300">
              <h3 className="font-semibold text-blue-400 mb-2">🌙 Night Owl or Early Bird?</h3>
              <p className="text-gray-400">See what time of day you're most productive based on your commit patterns.</p>
            </div>
            <div className="bg-[#161b22] p-4 rounded-lg border border-gray-800 hover:border-purple-500 transition-colors duration-300">
              <h3 className="font-semibold text-purple-400 mb-2">📅 Weekend Warrior?</h3>
              <p className="text-gray-400">Discover if you code more on weekdays or prefer weekend coding sessions.</p>
            </div>
            <div className="bg-[#161b22] p-4 rounded-lg border border-gray-800 hover:border-green-500 transition-colors duration-300">
              <h3 className="font-semibold text-green-400 mb-2">⏱️ Peak Hours</h3>
              <p className="text-gray-400">Identify your most productive hours to optimize your coding schedule.</p>
            </div>
          </motion.div>
        )}
      </div>
    </motion.main>
  );
}

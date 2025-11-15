import React from 'react';
import { motion } from 'framer-motion';

const FloatingStats = ({ fuzzyDecision, currentPlayingBitrate }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
      
      className="fixed top-28 right-4 z-40"
    >
      <div className="glass-card p-4 space-y-3">
        <StatBox
          label="FUZZY DECISION"
          value={`${Math.round(fuzzyDecision)}p`}
          color="text-cyan-400"
        />
        <StatBox
          label="ACTUAL PLAYING"
          value={`${currentPlayingBitrate}p`}
          color="text-neon-green"
        />
      </div>
    </motion.div>
  );
};

const StatBox = ({ label, value, color }) => (
  <div className="text-center">
    <div className="text-xs font-medium text-gray-400">{label}</div>
    <div className={`text-2xl font-bold ${color}`}>{value}</div>
  </div>
);

export default FloatingStats;
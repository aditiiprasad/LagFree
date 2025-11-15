import React from 'react';
import { motion } from 'framer-motion';


const Card = ({ children, className = '' }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`glass-card p-4 ${className}`}
    >
      {children}
    </motion.div>
  );
};

export default Card;
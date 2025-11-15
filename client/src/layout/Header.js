import React from 'react';
import { FaGithub, FaLinkedin, FaCode } from 'react-icons/fa';
import { motion } from 'framer-motion';
import Loader from '../components/ui/Loader';


const SocialLink = ({ href, icon: Icon, label }) => (
  <motion.a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    whileHover={{ scale: 1.2, color: '#00ff41' }}
    className="text-gray-400 transition-colors"
    aria-label={label}
  >
    <Icon size={20} />
  </motion.a>
);

const Header = ({ isLoading }) => {
  return (
    <motion.header
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col md:flex-row justify-between items-center mb-8"
    >
      
      <div>
        <h1 className="text-4xl font-bold text-white">
          Lag<span className="text-neon-green">Free</span>
        </h1>
        <p className="text-sm text-gray-400">A Fuzzy Logic ABR Dashboard</p>
      </div>
      
      
      <div className="flex flex-col items-center md:items-end mt-4 md:mt-0">
        <div className="flex items-center space-x-6">
          <SocialLink href="https://github.com/aditiiprasad/LagFree" icon={FaGithub} label="GitHub" />
          <SocialLink href="https://www.linkedin.com/in/aditiiprasad/" icon={FaLinkedin} label="LinkedIn" />
          <SocialLink href="https://leetcode.com/u/aditiiprasad/" icon={FaCode} label="LeetCode" />
        </div>
        <div className="h-8 mt-2">
          
          {isLoading && <Loader />}
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
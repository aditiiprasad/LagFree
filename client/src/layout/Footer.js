import React from 'react';
import { FaGithub, FaLinkedin, FaCode } from 'react-icons/fa';
import { motion } from 'framer-motion';


const SocialLink = ({ href, icon: Icon, label }) => (
  <motion.a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    whileHover={{ scale: 1.2, color: '#00ff41' }}
    className="text-gray-400 transition-colors"
    aria-label={label}
  >
    <Icon size={24} />
  </motion.a>
);


const TechPill = ({ name }) => (
  <span className="inline-block bg-neon-green/10 text-neon-green text-xs font-medium px-3 py-1 rounded-full">
    {name}
  </span>
);

const Footer = () => {
  return (
    <footer className="w-full text-left p-8 md:p-12 mt-24 border-t border-neon-green/10 glass-card">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          
         
          <div className="md:col-span-1">
            <h3 className="text-2xl font-bold text-neon-green mb-4">
              LagFree StreamLink
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed mb-6">
              A full-stack web app demonstrating an intelligent Adaptive Bitrate (ABR) algorithm using a Fuzzy Logic Engine to maximize QoE and minimize rebuffering.
            </p>
            <div className="flex justify-start items-center space-x-6">
              <SocialLink href="https://github.com/aditiiprasad/lagfree" icon={FaGithub} label="GitHub" />
              <SocialLink href="https://linkedin.com/in/aditiiprasad" icon={FaLinkedin} label="LinkedIn" />
              <SocialLink href="https://leetcode.com/aditiiprasad/" icon={FaCode} label="LeetCode" />
            </div>
          </div>

          
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Key Features</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex items-start gap-2">
                <span className="text-neon-green mt-1">▶</span>
                <span><span className="font-bold text-gray-300">Fuzzy Logic ABR:</span> Python-based Mamdani system for real-time bitrate decisions.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-neon-green mt-1">▶</span>
                <span><span className="font-bold text-gray-300">Live Analytics:</span> Real-time QoE (MOS) score, avg. bitrate, and rebuffer tracking.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-neon-green mt-1">▶</span>
                <span><span className="font-bold text-gray-300">Multi-Mode Simulation:</span> Test with Random, Manual, or your Real network data.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-neon-green mt-1">▶</span>
                <span><span className="font-bold text-gray-300">HLS Video Player:</span> Uses `hls.js` to dynamically switch video quality.</span>
              </li>
            </ul>
          </div>

         
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Tech Stack</h3>
            <div className="flex flex-wrap gap-2 mb-6">
              <TechPill name="React" />
              <TechPill name="Python" />
              <TechPill name="Node.js" />
              <TechPill name="Flask" />
              <TechPill name="scikit-fuzzy" />
              <TechPill name="HLS.js" />
              <TechPill name="Tailwind CSS" />
              <TechPill name="Framer Motion" />
            </div>
            
            <h3 className="text-lg font-semibold text-white mb-4">Architecture</h3>
            <ul className="space-y-1 text-sm text-gray-400">
              <li><span className="text-neon-green font-medium">Client:</span> React Frontend</li>
              <li><span className="text-neon-green font-medium">Server:</span> Node.js (Express) Proxy</li>
              <li><span className="text-neon-green font-medium">Engine:</span> Python (Flask) API</li>
            </ul>
          </div>

        </div>

        
        <div className="mt-12 pt-6 border-t border-neon-green/10 text-center">
          <p className="text-xs text-gray-500">
            Implementation of a Fuzzy Inference System for adaptive video streaming optimization.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
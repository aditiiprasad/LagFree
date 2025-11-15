import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SimulationControls from '../components/SimulationControls';
import HelpModal from '../components/ui/HelpModal';
import { FaQuestionCircle, FaSitemap } from 'react-icons/fa'; 
import More from '../components/ui/More'; 

const Controls = ({ mode, setMode, manualInputs, setManualInputs }) => {
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false); 
  const [isMoreModalOpen, setIsMoreModalOpen] = useState(false); 
  const isManual = mode === 'manual';

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
       
        <div className="md:col-span-2 flex flex-col md:flex-row gap-4">
          <ToggleButton
            label="Random Sim"
            isActive={mode === 'random'}
            onClick={() => setMode('random')}
          />
          <ToggleButton
            label="Real Network"
            isActive={mode === 'real'}
            onClick={() => setMode('real')}
          />
          <ToggleButton
            label="Manual Sim"
            isActive={isManual}
            onClick={() => setMode('manual')}
          />
          
         
          <div className="flex items-center justify-center gap-6 mt-2 md:mt-0 md:ml-4">
            <motion.button
              whileHover={{ scale: 1.1, color: '#00ff41' }}
              onClick={() => setIsHelpModalOpen(true)}
              className="flex items-center justify-center gap-2 text-sm text-gray-400 transition-colors"
            >
              <FaQuestionCircle /> Help
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1, color: '#00ff41' }}
              onClick={() => setIsMoreModalOpen(true)} 
              className="flex items-center justify-center gap-2 text-sm text-gray-400 transition-colors"
            >
              <FaSitemap />  How to Run?
            </motion.button>
          </div>
        </div>

        
        <div className="md:col-span-1 row-start-1 md:row-start-auto">
          {isManual && (
            <SimulationControls
              manualInputs={manualInputs}
              setManualInputs={setManualInputs}
              isEnabled={isManual}
            />
          )}
        </div>
      </div>
      
      <HelpModal isOpen={isHelpModalOpen} onRequestClose={() => setIsHelpModalOpen(false)} />
      <More isOpen={isMoreModalOpen} onRequestClose={() => setIsMoreModalOpen(false)} /> 
    </>
  );
};


const ToggleButton = ({ label, isActive, onClick }) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    onClick={onClick}
    className={`btn-neon w-full ${isActive ? 'btn-neon-active' : ''}`}
  >
    {label}
  </motion.button>
);

export default Controls;
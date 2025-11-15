import React from 'react';
import Modal from 'react-modal';
import { motion } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';

Modal.setAppElement('#root');

const CodeBlock = ({ children }) => (
  <pre className="bg-dark-bg/50 p-3 rounded-md border border-neon-green/20 text-xs text-neon-green overflow-x-auto">
    <code>{children}</code>
  </pre>
);

const folderStructure = `
lagfree/
├── client/ (React)
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/
│   │   │   ├── AnalyticsDashboard.js
│   │   │   ├── Dashboard.js
│   │   │   ├── FloatingStats.js
│   │   │   ├── SimulationControls.js
│   │   │   └── VideoPlayer.js
│   │   ├── layout/
│   │   │   ├── Controls.js
│   │   │   ├── Footer.js
│   │   │   └── Header.js
│   │   └── App.js
├── server/ (Node.js)
│   └── index.js
├── fuzzy_engine/ (Python)
│   └── app.py
└── README.md
`;

const More = ({ isOpen, onRequestClose }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="absolute z-[100] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-11/12 max-w-lg"
      overlayClassName="ReactModal__Overlay"
      closeTimeoutMS={300}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.7 }}
        className="glass-card relative border-neon-green/80 p-6 max-h-[80vh] overflow-y-auto"
      >
        <button
          onClick={onRequestClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-neon-green transition-colors"
          aria-label="Close modal"
        >
          <FaTimes size={20} />
        </button>

        <h2 className="text-2xl font-bold text-neon-green mb-4">Project Structure & Run</h2>
        
        <h3 className="font-bold text-white mb-2">Folder Structure</h3>
        <CodeBlock>{folderStructure.trim()}</CodeBlock>

        <h3 className="font-bold text-white mt-4 mb-2">Clone Project</h3>
        <CodeBlock>
          git clone https://github.com/aditiiprasad/LagFree.git
        </CodeBlock>

        <h3 className="font-bold text-white mt-4 mb-2">How to Run</h3>
        <p className="text-sm text-gray-300 mb-3">Run each service in a separate terminal:</p>

        <div className="space-y-2">
          <CodeBlock>
            <span className="text-gray-400"># 1. Run the Python Fuzzy Engine</span><br />
            cd fuzzy_engine<br />
            pip install -r requirements.txt<br />
            python app.py
          </CodeBlock>

          <CodeBlock>
            <span className="text-gray-400"># 2. Run the Node.js Server</span><br />
            cd server<br />
            npm install<br />
            npm start
          </CodeBlock>

          <CodeBlock>
            <span className="text-gray-400"># 3. Run the React Client</span><br />
            cd client<br />
            npm install<br />
            npm start
          </CodeBlock>
        </div>

        <button onClick={onRequestClose} className="btn-neon mt-6 w-full">
          Close
        </button>
      </motion.div>
    </Modal>
  );
};

export default More;

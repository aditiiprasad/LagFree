import React from 'react';

const BackgroundGrid = () => {
  return (
    <div className="fixed inset-0 -z-10 h-full w-full bg-dark-bg">
      
      <div 
        className="absolute inset-0 h-full w-full" 
        style={{
          backgroundImage: 'linear-gradient(to right, #00ff411a 1px, transparent 1px), linear-gradient(to bottom, #00ff411a 1px, transparent 1px)',
          backgroundSize: '3rem 3rem', 
          opacity: 0.1,
        }}
      ></div>
     
      <div className="absolute left-0 top-0 h-96 w-96 bg-neon-green/10 blur-[100px] rounded-full"></div>
    </div>
  );
};

export default BackgroundGrid;
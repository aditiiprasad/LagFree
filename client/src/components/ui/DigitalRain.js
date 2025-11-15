import React, { useEffect, useRef } from 'react';

const DigitalRain = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    
    
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

  
    const chars = '0123456789ABCDEFHIJKLMNORSTUVWXYZ';
    const matrix = chars.split('');

    const fontSize = 14;
   
    const columns = Math.floor(width / fontSize);

   
    const drops = new Array(columns).fill(1);

    const draw = () => {
     
      ctx.fillStyle = 'rgba(10, 10, 10, 0.05)';
      ctx.fillRect(0, 0, width, height);

      
      ctx.fillStyle = '#00ff41';
      ctx.font = `${fontSize}px Share Tech Mono`;

     
      for (let i = 0; i < drops.length; i++) {
       
        const text = matrix[Math.floor(Math.random() * matrix.length)];
        
        
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

       
        drops[i]++;

        
        if (drops[i] * fontSize > height && Math.random() > 0.975) {
          drops[i] = 0;
        }
      }
    };

    
    const interval = setInterval(draw, 50);

    
    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
     
      const newColumns = Math.floor(width / fontSize);
      drops.length = 0; 
      drops.push(...new Array(newColumns).fill(1)); 
    };

    window.addEventListener('resize', handleResize);

   
    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed top-0 left-0 -z-10"
      style={{ opacity: 0.3 }}
    />
  );
};

export default DigitalRain;
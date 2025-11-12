import React, { useEffect, useRef, useState } from 'react';


const videoSources = {
  360: '/videos/sample_360p.mp4',
  480: '/videos/sample_480p.mp4',
  720: '/videos/sample_720p.mp4',
  1080: '/videos/sample_1080p.mp4',
};


const getClosestBitrate = (target) => {
  const availableBitrates = Object.keys(videoSources).map(Number); 
  return availableBitrates.reduce((prev, curr) => 
    (Math.abs(curr - target) < Math.abs(prev - target) ? curr : prev)
  );
};

const VideoPlayer = ({ selectedBitrate }) => {
  const videoRef = useRef(null);
  const [currentSource, setCurrentSource] = useState(videoSources[360]);

  useEffect(() => {
    if (selectedBitrate) {
      const bestQuality = getClosestBitrate(selectedBitrate);
      const newSource = videoSources[bestQuality];
      
      if (videoRef.current && newSource !== currentSource) {
        console.log(`Fuzzy Logic decided to switch to: ${bestQuality}p`);
        
        const currentTime = videoRef.current.currentTime;
        
        
        setCurrentSource(newSource);
        videoRef.current.load(); 
        videoRef.current.currentTime = currentTime;
        videoRef.current.play();
      }
    }
  }, [selectedBitrate, currentSource]);

  return (
    <div>
      <video ref={videoRef} width="100%" controls autoPlay muted>
        <source src={currentSource} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <h3>Current Selected Quality: {getClosestBitrate(selectedBitrate)}p</h3>
    </div>
  );
};

export default VideoPlayer;
import React, { useEffect, useState } from 'react';


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


const VideoPlayer = ({ videoRef, selectedBitrate, setRebuffers }) => {
  const [currentSource, setCurrentSource] = useState(videoSources[360]);

  useEffect(() => {
    if (selectedBitrate && videoRef.current) {
      const bestQuality = getClosestBitrate(selectedBitrate);
      const newSource = videoSources[bestQuality];
      
      if (newSource !== currentSource) {
        console.log(`Fuzzy Logic decided to switch to: ${bestQuality}p`);
        
        const currentTime = videoRef.current.currentTime;
        
        setCurrentSource(newSource);
        videoRef.current.load();
        videoRef.current.currentTime = currentTime;
        videoRef.current.play().catch(e => console.error("Play interrupted", e));
      }
    }
  }, [selectedBitrate, currentSource, videoRef]);

  return (
    <>
      <div className="video-player-wrapper">
        <video 
          ref={videoRef} 
          width="100%" 
          controls 
          autoPlay 
          muted
          
          onWaiting={() => setRebuffers(prevCount => prevCount + 1)}
        >
          <source src={currentSource} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      <h3>Current Selected Quality: {getClosestBitrate(selectedBitrate)}p</h3>
    </>
  );
};

export default VideoPlayer;
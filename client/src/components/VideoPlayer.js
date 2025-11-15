import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';

const hlsLevels = [
  { bitrate: 360, bandwidth: 800000 },
  { bitrate: 480, bandwidth: 1400000 },
  { bitrate: 720, bandwidth: 2800000 },
  { bitrate: 1080, bandwidth: 5000000 },
];

const HLS_SOURCE = '/videos/hls/master.m3u8';

const getClosestLevel = (fuzzyDecision) => {
  const availableBitrates = hlsLevels.map(l => l.bitrate);
  const closestBitrate = availableBitrates.reduce((prev, curr) =>
    (Math.abs(curr - fuzzyDecision) < Math.abs(prev - fuzzyDecision) ? curr : prev)
  );

  return availableBitrates.indexOf(closestBitrate);
};

const VideoPlayer = ({ videoRef, selectedBitrate, setRebuffers }) => {
  
  const hlsRef = useRef(null);
  
  const [currentPlayingBitrate, setCurrentPlayingBitrate] = useState(360);

 
  useEffect(() => {
    if (!videoRef.current) return;

    const video = videoRef.current;

    if (Hls.isSupported()) {
      console.log("HLS Supported. Initializing player...");
      const hls = new Hls();
      hlsRef.current = hls; 
      hls.loadSource(HLS_SOURCE);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        console.log("Manifest parsed. Ready to play.");
        video.play().catch(e => console.error("Autoplay failed", e));
      });

      
      hls.on(Hls.Events.LEVEL_SWITCHED, (event, data) => {
        const newBitrate = hlsLevels[data.level].bitrate;
        console.log(`HLS level switched to: ${newBitrate}p`);
        setCurrentPlayingBitrate(newBitrate);
      });

   
      hls.on(Hls.Events.ERROR, (event, data) => {
        if (data.fatal) {
          console.error('Fatal HLS Error:', data);
          hls.destroy(); 
        } else {
          console.warn('Non-fatal HLS Error:', data);
        }
      });

    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      
      video.src = HLS_SOURCE;
      video.addEventListener('loadedmetadata', () => {
        video.play().catch(e => console.error("Autoplay failed", e));
      });
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [videoRef]); 

  useEffect(() => {
    if (!hlsRef.current) {
      
      return;
    }

    const hls = hlsRef.current;
    
    
    const newLevelIndex = getClosestLevel(selectedBitrate);

    
    if (hls.nextLevel !== newLevelIndex) {
      console.log(`Fuzzy Logic decided on ${selectedBitrate}. Setting HLS nextLevel to: ${newLevelIndex} (${hlsLevels[newLevelIndex].bitrate}p)`);
      hls.nextLevel = newLevelIndex;
    }

  }, [selectedBitrate]); 

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
          
          Your browser does not support the video tag.
        </video>
      </div>
      <h3>Current Selected Quality: {currentPlayingBitrate}p</h3>
    </>
  );
};

export default VideoPlayer;
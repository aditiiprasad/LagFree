import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import VideoPlayer from './components/VideoPlayer';
import Dashboard from './components/Dashboard';
import './App.css';


const API_URL = 'https://lagfree-server.onrender.com/api/network-status';
// const API_URL = 'http://localhost:8000/api/network-status'; 

function App() {
  const [isSimulated, setIsSimulated] = useState(true);
  const [networkData, setNetworkData] = useState([]);
  const [currentBitrate, setCurrentBitrate] = useState(360);
  const [rebuffers, setRebuffers] =useState(0);
  const videoRef = useRef(null);

  const getBufferHealth = useCallback(() => {
    const video = videoRef.current;
   
    if (!video || video.readyState < 2) return 0; 

    const currentTime = video.currentTime;
    let bufferEnd = 0;

   
    for (let i = 0; i < video.buffered.length; i++) {
      if (video.buffered.start(i) <= currentTime && currentTime < video.buffered.end(i)) {
        bufferEnd = video.buffered.end(i);
        break;
      }
    }

  
    const bufferHealthInSeconds = bufferEnd - currentTime;

   
    const safeBufferHealth = Math.max(0, bufferHealthInSeconds);
   
    
    return parseFloat(safeBufferHealth.toFixed(2));
  }, [videoRef]);

  useEffect(() => {
    const postDataAndGetDecision = async () => {
      try {
        let bandwidth, buffer, delay;

        if (isSimulated) {
          
          bandwidth = Math.random() * 9 + 1; // 1-10 Mbps
          buffer = Math.random() * 10;      // 0-10s
          delay = Math.random() * 290 + 10; // 10-300ms
        } else {
          
          bandwidth = navigator.connection ? navigator.connection.downlink : 1.0;
          buffer = getBufferHealth();
          delay = navigator.connection ? navigator.connection.rtt : 50;

          
          console.log("REAL DATA:", { bandwidth, buffer, delay });
        }

        
        const newDataPoint = {
          time: new Date().toLocaleTimeString(),
          bandwidth: parseFloat(bandwidth.toFixed(2)),
          buffer: parseFloat(buffer.toFixed(2)),
          delay: parseFloat(delay.toFixed(2)),
        };
        setNetworkData(prevData => [...prevData.slice(-20), newDataPoint]);

      
        const response = await axios.post(API_URL, {
          bandwidth,
          buffer,
          delay,
        });
        
        const { fuzzyBitrateDecision } = response.data;
        
        if (fuzzyBitrateDecision) {
          setCurrentBitrate(fuzzyBitrateDecision);
        }

      } catch (error) {
        console.error("Error posting network data:", error);
      }
    };

    postDataAndGetDecision();
    const intervalId = setInterval(postDataAndGetDecision, 3000);
    return () => clearInterval(intervalId);
  }, [isSimulated, getBufferHealth, API_URL]);

  return (
    <div className="App" style={{ padding: '20px', maxWidth: '900px', margin: 'auto' }}>
      <header>
        <h1>LagFree StreamLink: Fuzzy ABR Optimizer</h1>
        <h2 style={{color: '#ff4d4d'}}>Total Rebuffer Events: {rebuffers}</h2>
        
        <div style={{ margin: '15px 0' }}>
          <button 
            onClick={() => setIsSimulated(prev => !prev)}
            style={{
              padding: '10px 15px',
              fontSize: '16px',
              cursor: 'pointer',
              backgroundColor: isSimulated ? '#ffc107' : '#28a745',
              color: 'black',
              border: 'none',
              borderRadius: '5px',
              fontWeight: 'bold'
            }}
          >
            {isSimulated ? "Mode: Simulation (Click to use Real Network)" : "Mode: Real Network (Click to Simulate)"}
          </button>
        </div>
      </header>
      <main>
        <VideoPlayer 
          videoRef={videoRef} 
          selectedBitrate={currentBitrate} 
          setRebuffers={setRebuffers}
        />
        <Dashboard data={networkData} />
      </main>
    </div>
  );
}

export default App;
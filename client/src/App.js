import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import VideoPlayer from './components/VideoPlayer';
import Dashboard from './components/Dashboard';
import SimulationControls from './components/SimulationControls';
import AnalyticsDashboard from './components/AnalyticsDashboard';

const API_URL = 'https://lagfree-server.onrender.com/api/network-status';
// const API_URL = 'http://localhost:8000/api/network-status';

const defaultAnalytics = {
  playbackTime: 0,
  rebufferCount: 0,
  totalBitrateSum: 0,
  totalBitrateSamples: 0,
};



const calculateQoE = (avgBitrate, rebufferCount, playbackTime) => {
  let bitrateScore = 0;
  if (avgBitrate > 1000) bitrateScore = 3;
  else if (avgBitrate > 700) bitrateScore = 2.5;
  else if (avgBitrate > 450) bitrateScore = 1.5;
  else if (avgBitrate > 300) bitrateScore = 1;

  const rebuffersPerMinute = playbackTime > 0 ? (rebufferCount / (playbackTime / 60)) : 0;
  let rebufferScore = 2 - (rebuffersPerMinute * 0.5);
  rebufferScore = Math.max(0, rebufferScore);

  return bitrateScore + rebufferScore;
};


function App() {
  const [mode, setMode] = useState('random');
  const [networkData, setNetworkData] = useState([]);
  const [fuzzyDecision, setFuzzyDecision] = useState(360);
  const [currentPlayingBitrate, setCurrentPlayingBitrate] = useState(360);
  const [lastEvent, setLastEvent] = useState(null); 
  const [isRebuffering, setIsRebuffering] = useState(false);
  const simStateRef = useRef({ bandwidth: 5, delay: 100 });

  const [manualInputs, setManualInputs] = useState({
    bandwidth: 5,
    buffer: 5,
    delay: 50,
  });

  
  const [analytics, setAnalytics] = useState(defaultAnalytics);
  const videoRef = useRef(null);
  
  const avgBitrate = analytics.totalBitrateSamples > 0 
    ? (analytics.totalBitrateSum / analytics.totalBitrateSamples) 
    : 0;
  
  const qoeScore = calculateQoE(avgBitrate, analytics.rebufferCount, analytics.playbackTime);


  const getModeButton = () => {
    switch (mode) {
      case 'random':
        return { text: 'Mode: Random Sim', next: 'manual', color: 'bg-yellow-500' };
      case 'manual':
        return { text: 'Mode: Manual Sim', next: 'real', color: 'bg-cyan-500' };
      case 'real':
        return { text: 'Mode: Real Network', next: 'random', color: 'bg-green-500' };
      default:
        return { text: 'Mode: Random Sim', next: 'manual', color: 'bg-yellow-500' };
    }
  };

  const cycleMode = () => {
    setMode(getModeButton().next);
  };


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
        
        if (mode === 'random') {
          let bwChange = (Math.random() * 4) - 2; 
          let newBw = simStateRef.current.bandwidth + bwChange;
          newBw = Math.max(1, Math.min(10, newBw)); 
          
          let delayChange = (Math.random() * 100) - 50;
          let newDelay = simStateRef.current.delay + delayChange;
          newDelay = Math.max(10, Math.min(400, newDelay));
          
          bandwidth = newBw;
          buffer = getBufferHealth();
          delay = newDelay;
          
          simStateRef.current = { bandwidth: newBw, delay: newDelay };
        } else if (mode === 'real') {
          bandwidth = navigator.connection ? navigator.connection.downlink : 1.0;
          buffer = getBufferHealth();
          delay = navigator.connection ? navigator.connection.rtt : 50;
        } else { 
          bandwidth = manualInputs.bandwidth;
          buffer = manualInputs.buffer; 
          delay = manualInputs.delay;
        }
        
        const newDataPoint = {
          time: new Date().toLocaleTimeString(),
          bandwidth: parseFloat(bandwidth.toFixed(2)),
          buffer: parseFloat(buffer.toFixed(2)),
          delay: parseFloat(delay.toFixed(2)),
          event: lastEvent,
        };
        
        setLastEvent(null);
        setNetworkData(prevData => [...prevData.slice(-20), newDataPoint]);

        const response = await axios.post(API_URL, { bandwidth, buffer, delay });
        
        const { fuzzyBitrateDecision } = response.data;
        if (fuzzyBitrateDecision) {
          setFuzzyDecision(fuzzyBitrateDecision);
        }
      } catch (error) {
        console.error("Error posting network data:", error.message);
      }
    };

    postDataAndGetDecision();
    const intervalId = setInterval(postDataAndGetDecision, 3000);
    return () => clearInterval(intervalId);

  }, [mode, manualInputs, getBufferHealth, lastEvent]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (videoRef.current && !videoRef.current.paused) {
        setAnalytics(prev => {
          const newAnalytics = { ...prev, playbackTime: prev.playbackTime + 1 };
          
          return newAnalytics;
        });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleRebuffer = useCallback(() => {
    if (!isRebuffering) {
      setIsRebuffering(true); 
      setLastEvent('rebuffer');
      setAnalytics(prev => {
        const newAnalytics = { ...prev, rebufferCount: prev.rebufferCount + 1 };
        
        return newAnalytics;
      });
    }
  }, [isRebuffering]); 

  const handlePlay = useCallback(() => {
    if (isRebuffering) {
      setIsRebuffering(false);
    }
  }, [isRebuffering]);

  const handleBitrateChange = useCallback((newBitrate) => {
    setCurrentPlayingBitrate(newBitrate);
    setLastEvent('switch');
    setAnalytics(prev => {
      const newAnalytics = {
        ...prev,
        totalBitrateSum: prev.totalBitrateSum + newBitrate,
        totalBitrateSamples: prev.totalBitrateSamples + 1
      };
      
      return newAnalytics;
    });
  }, []); 
  
  
  const modeButton = getModeButton();

  return (
    <div className="bg-gray-900 text-gray-100 min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        
        <header className="flex flex-col md:flex-row justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-white">
            LagFree <span className="text-cyan-400">StreamLink</span>
          </h1>
          
      
          <button
            onClick={cycleMode}
            className={`mt-4 md:mt-0 px-6 py-2 rounded-full font-semibold text-black transition-all ${modeButton.color} hover:opacity-80`}
          >
            {modeButton.text}
          </button>
        </header>

        <AnalyticsDashboard analytics={{...analytics, avgBitrate, qoeScore }} />

        <main className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <div className="lg:col-span-2 space-y-4">
            <VideoPlayer
              videoRef={videoRef}
              selectedBitrate={fuzzyDecision}
              onRebuffer={handleRebuffer}
              onBitrateChange={handleBitrateChange}
              onPlay={handlePlay}
            />
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-800 p-4 rounded-lg shadow text-center">
                <div className="text-sm font-medium text-gray-400">FUZZY DECISION</div>
                <div className="text-3xl font-bold text-cyan-400">{Math.round(fuzzyDecision)}p</div>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg shadow text-center">
                <div className="text-sm font-medium text-gray-400">ACTUAL PLAYING</div>
                <div className="text-3xl font-bold text-green-400">{currentPlayingBitrate}p</div>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <SimulationControls
              manualInputs={manualInputs}
              setManualInputs={setManualInputs}
              isEnabled={mode === 'manual'}
            />
          </div>
        </main>
        
        <Dashboard data={networkData} />

      </div>
    </div>
  );
}

export default App;
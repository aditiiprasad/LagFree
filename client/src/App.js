import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';


import Header from './layout/Header';
import Controls from './layout/Controls';
import Footer from './layout/Footer';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import VideoPlayer from './components/VideoPlayer';
import Dashboard from './components/Dashboard';
import BackgroundGrid from './components/ui/BackgroundGrid';
import FloatingStats from './components/FloatingStats';
import DigitalRain from './components/ui/DigitalRain'; 

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
  
  
  const isRebuffering = useRef(false);
 

  const simStateRef = useRef({ bandwidth: 5, delay: 100 });
  const [isLoading, setIsLoading] = useState(false); 

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
      setIsLoading(true); 
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
      } finally {
        setIsLoading(false); 
      }
    };

    postDataAndGetDecision();
    const intervalId = setInterval(postDataAndGetDecision, 3000);
    return () => clearInterval(intervalId);

  }, [mode, manualInputs, getBufferHealth, lastEvent]); 

  useEffect(() => {
    const interval = setInterval(() => {
      if (videoRef.current && !videoRef.current.paused) {
        setAnalytics(prev => ({ ...prev, playbackTime: prev.playbackTime + 1 }));
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []); 

  
  const handleRebuffer = useCallback(() => {
    if (!isRebuffering.current) {
      isRebuffering.current = true; 
      setLastEvent('rebuffer');
      setAnalytics(prev => ({ ...prev, rebufferCount: prev.rebufferCount + 1 }));
    }
  }, []); 


  const handlePlay = useCallback(() => {
    if (isRebuffering.current) {
      isRebuffering.current = false; 
    }
  }, []); 

  const handleBitrateChange = useCallback((newBitrate) => {
    setCurrentPlayingBitrate(newBitrate);
    setLastEvent('switch');
    setAnalytics(prev => ({
      ...prev,
      totalBitrateSum: prev.totalBitrateSum + newBitrate,
      totalBitrateSamples: prev.totalBitrateSamples + 1
    }));
  }, []); 
  
  return (
    <>
      <DigitalRain /> 
      <FloatingStats 
        fuzzyDecision={fuzzyDecision}
        currentPlayingBitrate={currentPlayingBitrate}
      />

      <div className="relative z-10 min-h-screen p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          
          <Header isLoading={isLoading} />

          <Controls 
            mode={mode}
            setMode={setMode} 
            manualInputs={manualInputs}
            setManualInputs={setManualInputs}
          />
          
          <AnalyticsDashboard analytics={{...analytics, avgBitrate, qoeScore }} />

          <main className="grid grid-cols-1 lg:grid-cols-5 gap-6 mt-8">
            <div className="lg:col-span-3">
              <VideoPlayer
                videoRef={videoRef}
                selectedBitrate={fuzzyDecision}
                onRebuffer={handleRebuffer}
                onBitrateChange={handleBitrateChange}
                onPlay={handlePlay}
              />
            </div>
            <div className="lg:col-span-2">
              <Dashboard data={networkData} />
            </div>
          </main>
          
          <Footer />

        </div>
      </div>
    </>
  );
}

export default App;
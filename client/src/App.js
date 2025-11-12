import React, { useState, useEffect } from 'react';
import axios from 'axios';
import VideoPlayer from './components/VideoPlayer';
import Dashboard from './components/Dashboard';
import './App.css'; 



const API_URL = 'https://lagfree-server.onrender.com/api/network-status';

function App() {
  const [networkData, setNetworkData] = useState([]);
  const [currentBitrate, setCurrentBitrate] = useState(360); 

  
  useEffect(() => {
    const fetchData = async () => {
      try {
       
        const response = await axios.get(API_URL);
        
        
        const { bandwidth, buffer, delay, fuzzyBitrateDecision } = response.data;
        
        const newDataPoint = {
          time: new Date().toLocaleTimeString(),
          bandwidth,
          buffer,
          delay,
        };
        
      
        setNetworkData(prevData => [...prevData.slice(-20), newDataPoint]); 
        
        
        setCurrentBitrate(fuzzyBitrateDecision);

      } catch (error) {
        console.error("Error fetching network data:", error);
        
      }
    };

   
    const intervalId = setInterval(fetchData, 3000);

    
    return () => clearInterval(intervalId);
  }, []); 

  return (
    <div className="App" style={{ padding: '20px', maxWidth: '900px', margin: 'auto' }}>
      <header>
        <h1>LagFree StreamLink: Fuzzy ABR Optimizer</h1>
      </header>
      <main>
        <VideoPlayer selectedBitrate={currentBitrate} />
        <Dashboard data={networkData} />
      </main>
    </div>
  );
}

export default App;
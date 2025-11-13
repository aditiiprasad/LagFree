const express = require('express');
const cors = require('cors');
const axios = require('axios'); 

const app = express();
const PORT = 8000;


app.use(cors()); 
app.use(express.json()); 


const FUZZY_ENGINE_API = 'https://lagfree-fuzzy.onrender.com/get-bitrate';
// const FUZZY_ENGINE_API = 'http://127.0.0.1:5000/get-bitrate'; 


app.post('/api/network-status', async (req, res) => {
  try {
    
    const conditions = req.body;
    
    
    let fuzzyBitrateDecision = 360;
    
    try {
      const pythonResponse = await axios.post(FUZZY_ENGINE_API, {
        bandwidth: conditions.bandwidth,
        buffer: conditions.buffer,
        delay: conditions.delay,
      });
      
      fuzzyBitrateDecision = pythonResponse.data.bitrate;

    } catch (pythonError) {
      console.warn(`Could not connect to Python engine. Using default. (Error: ${pythonError.message})`);
    }

    
    res.json({
      fuzzyBitrateDecision: fuzzyBitrateDecision,
    });

  } catch (error) {
    console.error("Error in /api/network-status:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});


app.listen(PORT, () => {
  console.log(`🚀 Node.js server running on http://localhost:${PORT}`);
  console.log(`Receiving real data and forwarding to ${FUZZY_ENGINE_API}`);
});
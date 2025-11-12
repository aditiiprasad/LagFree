const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = 8000;

app.use(cors());
app.use(express.json());

const FUZZY_ENGINE_API = 'https://lagfree-fuzzy.onrender.com/get-bitrate';


const simulateNetworkConditions = () => {
  const bandwidth = Math.random() * 9 + 1;
  const buffer = Math.random() * 10;
  const delay = Math.random() * 290 + 10;

  return {
    bandwidth: parseFloat(bandwidth.toFixed(2)),
    buffer: parseFloat(buffer.toFixed(2)),
    delay: parseFloat(delay.toFixed(2)),
  };
};

app.get('/api/network-status', async (req, res) => {
  try {
    const conditions = simulateNetworkConditions();
    let fuzzyBitrateDecision = 360;

    try {
      const pythonResponse = await axios.post(FUZZY_ENGINE_API, {
        bandwidth: conditions.bandwidth,
        buffer: conditions.buffer,
        delay: conditions.delay,
      });
      fuzzyBitrateDecision = pythonResponse.data.bitrate;
    } catch (pythonError) {
      console.warn(`Could not connect to Python engine. Using default bitrate. (Error: ${pythonError.message})`);
    }

    res.json({
      bandwidth: conditions.bandwidth,
      buffer: conditions.buffer,
      delay: conditions.delay,
      fuzzyBitrateDecision: fuzzyBitrateDecision,
    });

  } catch (error) {
    console.error("Error in /api/network-status:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Node.js server running on http://localhost:${PORT}`);
  console.log(`Forwarding fuzzy logic requests to ${FUZZY_ENGINE_API}`);
});

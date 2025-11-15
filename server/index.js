const express = require('express');
const cors = require('cors');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 8000;

app.use(cors());
app.use(express.json());

const FUZZY_ENGINE_API = 'https://lagfree-fuzzy.onrender.com/get-bitrate';
const FUZZY_HEALTH_API = 'https://lagfree-fuzzy.onrender.com/health';

// const FUZZY_ENGINE_API = 'http://127.0.0.1:5000/get-bitrate';
// const FUZZY_HEALTH_API = 'http://127.0.0.1:5000/health';


const LOG_FILE = path.join(__dirname, 'api_logs.json');
const MAX_LOGS = 100;

const readLogs = () => {
  try {
    if (fs.existsSync(LOG_FILE)) {
      const data = fs.readFileSync(LOG_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error("Could not read log file:", err);
  }
  return [];
};

const writeLog = (logEntry) => {
  try {
    let logs = readLogs();
    logs.unshift(logEntry);
    logs = logs.slice(0, MAX_LOGS);
    fs.writeFileSync(LOG_FILE, JSON.stringify(logs, null, 2), 'utf8');
  } catch (err) {
    console.error("Could not write to log file:", err);
  }
};

app.post('/api/network-status', async (req, res) => {
  try {
    const conditions = req.body;
    let fuzzyBitrateDecision = 360;
    let source = "fallback";

    try {
      const pythonResponse = await axios.post(FUZZY_ENGINE_API, {
        bandwidth: conditions.bandwidth,
        buffer: conditions.buffer,
        delay: conditions.delay,
      });
      
      fuzzyBitrateDecision = pythonResponse.data.bitrate;
      source = "fuzzy_engine";

    } catch (pythonError) {
      console.warn(`Could not connect to Python engine. Using default. (Error: ${pythonError.message})`);
      source = `fallback (${pythonError.message})`;
    }

    const logEntry = {
      timestamp: new Date().toISOString(),
      inputs: conditions,
      output: {
        bitrate: fuzzyBitrateDecision,
        source: source
      }
    };
    writeLog(logEntry);

    res.json({
      fuzzyBitrateDecision: fuzzyBitrateDecision,
    });

  } catch (error) {
    console.error("Error in /api/network-status:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get('/api/logs', (req, res) => {
  const logs = readLogs();
  res.json(logs);
});

app.get('/health/python', async (req, res) => {
  try {
    const startTime = Date.now();
    const response = await axios.get(FUZZY_HEALTH_API, { timeout: 3000 });
    const latency = Date.now() - startTime;

    if (response.data && response.data.status === 'healthy') {
      res.json({
        status: 'UP',
        latency: `${latency} ms`,
        message: 'Fuzzy engine is healthy.'
      });
    } else {
      throw new Error('Unhealthy response from Python engine');
    }
  } catch (error) {
    console.error("Python engine health check failed:", error.message);
    res.status(503).json({
      status: 'DOWN',
      message: 'Fuzzy engine is unreachable or unhealthy.',
      error: error.message,
      details: 'Fallback to 360p is active.'
    });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'UP', message: 'Node.js server is running.' });
});

app.listen(PORT, () => {
  console.log(`🚀 Node.js server running on http://localhost:${PORT}`);
  console.log(`Receiving real data and forwarding to ${FUZZY_ENGINE_API}`);
});

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config({ path: '../.env.local' });

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());

// Main Backend Health Route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'Aether Credit Core Backend',
    timestamp: new Date().toISOString()
  });
});

// Proxy routes for API or standalone server functionality
app.get('/api/v1/system/status', (req, res) => {
  res.json({
    agents_active: 5,
    db_connected: true,
    latency: '12ms'
  });
});

app.listen(PORT, () => {
  console.log(`[Aether Backend] Server successfully running perfectly on port ${PORT}`);
});

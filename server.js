// server.js - Master Application Server Hub Core Orchestrator
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Set global environment variable configurations
const PORT = process.env.PORT || 5000;
const mongoURI = process.env.MONGO_URI;

// Apply cross-origin traffic policies
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());

// Boot verification log
console.log(`[PulseOne Engine Initialization]: Checking MONGO_URI string value mapping...`);

if (!mongoURI) {
  console.error(' [CONFIGURATION ERROR]: MONGO_URI key variable value definition is completely missing inside your .env configuration file map layout.');
  process.exit(1);
}

// Establish permanent pooling connections to remote cloud cluster or local instance
mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB Connected successfully to PulseOne Cluster Database Layer ✅'))
  .catch((err) => console.error('MongoDB Server Connection Linkage Failure Error ❌', err));

// Mount routing checkpoints
app.use('/api/auth', require('./routes/auth'));

app.get('/', (req, res) => {
  res.send('PulseOne API Infrastructure Runtime Engine Online.');
});

app.listen(PORT, () => {
  console.log(`Server executing successfully on live listener port: ${PORT} 🚀`);
});
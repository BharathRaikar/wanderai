require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:3000'] }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString().slice(11,19)}] ${req.method} ${req.url}`);
  next();
});

// ─── Initialise DB on startup ─────────────────────────────────────────────────
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));
// ─── API Routes ───────────────────────────────────────────────────────────────
app.use('/api/auth',         require('./routes/auth'));
app.use('/api/destinations', require('./routes/destinations'));
app.use('/api/itinerary',    require('./routes/itinerary'));
app.use('/api/bookings',     require('./routes/bookings'));

// ─── Health check ─────────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'WanderAI API', version: '2.0.0', timestamp: new Date().toISOString() });
});

app.use((_req, res) => res.status(404).json({ error: 'Route not found.' }));
app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error.' });
});

app.listen(PORT, () => {
  console.log(`\n🌍 WanderAI Travel Planner API v2`);
  console.log(`   Running at http://localhost:${PORT}\n`);
});

module.exports = app;

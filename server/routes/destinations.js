const express = require('express');
const router = express.Router();
const destinations = require('../data/destinations.json');
const activities = require('../data/activities.json');
const hotels = require('../data/hotels.json');
const transport = require('../data/transport.json');
const { rankDestinations } = require('../services/itineraryGenerator');

// GET /api/destinations — list all with optional filters
router.get('/', (req, res) => {
  const { continent, budget, tags, q } = req.query;
  let results = [...destinations];

  if (continent) results = results.filter(d => d.continent.toLowerCase() === continent.toLowerCase());
  if (budget)    results = results.filter(d => d.avgDailyCostUSD <= Number(budget));
  if (tags)      results = results.filter(d => tags.split(',').some(t => d.tags.includes(t.trim())));
  if (q)         results = results.filter(d =>
    d.name.toLowerCase().includes(q.toLowerCase()) ||
    d.country.toLowerCase().includes(q.toLowerCase()) ||
    d.description.toLowerCase().includes(q.toLowerCase())
  );

  res.json({ success: true, destinations: results, count: results.length });
});

// GET /api/destinations/recommend — AI-style recommendation based on preferences
router.post('/recommend', (req, res) => {
  const preferences = req.body;
  const ranked = rankDestinations(preferences);
  res.json({ success: true, destinations: ranked.slice(0, 6) });
});

// GET /api/destinations/:id — full destination detail
router.get('/:id', (req, res) => {
  const dest = destinations.find(d => d.id === req.params.id);
  if (!dest) return res.status(404).json({ error: 'Destination not found.' });

  const destActivities = activities.filter(a => a.destinationId === req.params.id);
  const destHotels = hotels.filter(h => h.destinationId === req.params.id);
  const destTransport = transport.filter(t => t.destinationId === req.params.id);

  res.json({
    success: true,
    destination: dest,
    activities: destActivities,
    hotels: destHotels,
    transport: destTransport
  });
});

module.exports = router;

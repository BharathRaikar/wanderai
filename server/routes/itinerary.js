const express = require('express');
const router = express.Router();
const { generateItinerary } = require('../services/itineraryGenerator');
const { requireAuth, optionalAuth } = require('../middleware/auth');
const db = require('../database');

// POST /api/itinerary/generate — generate and persist
router.post('/generate', optionalAuth, (req, res) => {
  try {
    const preferences = req.body;

    if (!preferences.startDate || !preferences.endDate)
      return res.status(400).json({ error: 'startDate and endDate are required.' });
    if (!preferences.budget || preferences.budget <= 0)
      return res.status(400).json({ error: 'A valid budget is required.' });

    const itinerary = generateItinerary(preferences);
    const userId = req.user?.id || null;
    db.saveItinerary(itinerary, userId);

    res.json({ success: true, itinerary });
  } catch (err) {
    console.error('Itinerary generation error:', err);
    res.status(500).json({ error: 'Failed to generate itinerary.' });
  }
});

// GET /api/itinerary — list saved itineraries (user-scoped if authenticated)
router.get('/', optionalAuth, (req, res) => {
  const list = req.user
    ? db.listItinerariesByUser(req.user.id)
    : db.listAllItineraries();

  res.json({
    success: true,
    itineraries: list.map(r => ({
      id: r.id,
      destination: r.destination_name,
      country: r.destination_country,
      numDays: r.num_days,
      travelers: r.travelers,
      budget: r.budget,
      createdAt: r.created_at
    }))
  });
});

// GET /api/itinerary/:id
router.get('/:id', (req, res) => {
  const row = db.getItineraryById(req.params.id);
  if (!row) return res.status(404).json({ error: 'Itinerary not found.' });
  res.json({ success: true, itinerary: row.data });
});

// DELETE /api/itinerary/:id
router.delete('/:id', requireAuth, (req, res) => {
  const row = db.getItineraryById(req.params.id);
  if (!row) return res.status(404).json({ error: 'Itinerary not found.' });
  db.deleteItinerary(req.params.id);
  res.json({ success: true, message: 'Itinerary deleted.' });
});

module.exports = router;

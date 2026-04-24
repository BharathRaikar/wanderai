const express = require('express');
const router = express.Router();
const { generateItinerary } = require('../services/itineraryGenerator');
const { requireAuth, optionalAuth } = require('../middleware/auth');
const Itinerary = require('../models/Itinerary');

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0;
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
}

// POST /api/itinerary/generate — generate and persist
router.post('/generate', optionalAuth, async (req, res) => {
  try {
    const preferences = req.body;

    if (!preferences.startDate || !preferences.endDate)
      return res.status(400).json({ error: 'startDate and endDate are required.' });
    if (!preferences.budget || preferences.budget <= 0)
      return res.status(400).json({ error: 'A valid budget is required.' });

    const itinerary = generateItinerary(preferences);
    if (!itinerary.id) itinerary.id = uuidv4();
    const userId = req.user?.id || null;

    try {
      await Itinerary.create({
        id: itinerary.id,
        user_id: userId,
        destination_name: itinerary.destination.name,
        destination_country: itinerary.destination.country,
        num_days: itinerary.preferences.numDays,
        travelers: itinerary.preferences.travelers,
        budget: itinerary.preferences.budget,
        data: itinerary
      });
    } catch (dbErr) {
      console.warn('⚠️ Could not save itinerary to DB (is it connected?), but returning generated trip anyway.', dbErr.message);
    }

    res.json({ success: true, itinerary });
  } catch (err) {
    console.error('Itinerary generation error:', err);
    res.status(500).json({ error: 'Failed to generate itinerary.' });
  }
});

// GET /api/itinerary — list saved itineraries (user-scoped if authenticated)
router.get('/', optionalAuth, async (req, res) => {
  try {
    const query = req.user ? { user_id: req.user.id } : {};
    const list = await Itinerary.find(query).sort({ created_at: -1 });

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
  } catch (err) {
    console.error('Fetch itineraries error:', err);
    res.status(500).json({ error: 'Failed to fetch itineraries.' });
  }
});

// GET /api/itinerary/:id
router.get('/:id', async (req, res) => {
  try {
    const row = await Itinerary.findOne({ id: req.params.id });
    if (!row) return res.status(404).json({ error: 'Itinerary not found.' });
    res.json({ success: true, itinerary: row.data });
  } catch (err) {
    console.error('Fetch itinerary error:', err);
    res.status(500).json({ error: 'Failed to fetch itinerary.' });
  }
});

// DELETE /api/itinerary/:id
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const row = await Itinerary.findOneAndDelete({ id: req.params.id });
    if (!row) return res.status(404).json({ error: 'Itinerary not found.' });
    res.json({ success: true, message: 'Itinerary deleted.' });
  } catch (err) {
    console.error('Delete itinerary error:', err);
    res.status(500).json({ error: 'Failed to delete itinerary.' });
  }
});

module.exports = router;

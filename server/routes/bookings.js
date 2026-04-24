const express = require('express');
const router = express.Router();
const { requireAuth, optionalAuth } = require('../middleware/auth');
const Booking = require('../models/Booking');

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0;
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
}

// POST /api/bookings
router.post('/', optionalAuth, async (req, res) => {
  try {
    const { itineraryId, type, itemId, itemName, travelers, pricePerPerson, date, guestName, guestEmail } = req.body;

    if (!type || !itemId || !travelers || !pricePerPerson)
      return res.status(400).json({ error: 'Missing required booking fields.' });

    const bookingData = {
      id: uuidv4(),
      user_id: req.user?.id || null,
      itinerary_id: itineraryId || null,
      type,
      item_id: itemId,
      item_name: itemName,
      travelers: Number(travelers),
      price_per_person: Number(pricePerPerson),
      total_price: Number(travelers) * Number(pricePerPerson),
      date: date || null,
      guest_name: guestName || null,
      guest_email: guestEmail || null,
      status: 'confirmed',
      confirmation_code: `WA-${Math.random().toString(36).toUpperCase().slice(2, 9)}`
    };

    const newBooking = await Booking.create(bookingData);

    res.status(201).json({
      success: true,
      booking: newBooking,
      message: `Booking confirmed! Reference: ${newBooking.confirmation_code}`
    });
  } catch (err) {
    console.error('Booking error:', err);
    res.status(500).json({ error: 'Booking failed. Please try again.' });
  }
});

// GET /api/bookings
router.get('/', optionalAuth, async (req, res) => {
  try {
    const query = req.user ? { user_id: req.user.id } : {};
    const list = await Booking.find(query).sort({ booked_at: -1 });
    res.json({ success: true, bookings: list, count: list.length });
  } catch (err) {
    console.error('Fetch bookings error:', err);
    res.status(500).json({ error: 'Failed to fetch bookings.' });
  }
});

// GET /api/bookings/:id
router.get('/:id', async (req, res) => {
  try {
    const booking = await Booking.findOne({ id: req.params.id });
    if (!booking) return res.status(404).json({ error: 'Booking not found.' });
    res.json({ success: true, booking });
  } catch (err) {
    console.error('Fetch booking error:', err);
    res.status(500).json({ error: 'Failed to fetch booking.' });
  }
});

// DELETE /api/bookings/:id — cancel
router.delete('/:id', optionalAuth, async (req, res) => {
  try {
    const booking = await Booking.findOneAndUpdate(
      { id: req.params.id },
      { status: 'cancelled' },
      { new: true }
    );
    if (!booking) return res.status(404).json({ error: 'Booking not found.' });
    res.json({ success: true, message: 'Booking cancelled.', booking });
  } catch (err) {
    console.error('Cancel booking error:', err);
    res.status(500).json({ error: 'Failed to cancel booking.' });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const { requireAuth, optionalAuth } = require('../middleware/auth');
const db = require('../database');

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0;
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
}

// POST /api/bookings
router.post('/', optionalAuth, (req, res) => {
  try {
    const { itineraryId, type, itemId, itemName, travelers, pricePerPerson, date, guestName, guestEmail } = req.body;

    if (!type || !itemId || !travelers || !pricePerPerson)
      return res.status(400).json({ error: 'Missing required booking fields.' });

    const booking = {
      id: uuidv4(),
      itineraryId: itineraryId || null,
      type,
      itemId,
      itemName,
      travelers: Number(travelers),
      pricePerPerson: Number(pricePerPerson),
      totalPrice: Number(travelers) * Number(pricePerPerson),
      date: date || null,
      guestName: guestName || null,
      guestEmail: guestEmail || null,
      status: 'confirmed',
      confirmationCode: `WA-${Math.random().toString(36).toUpperCase().slice(2, 9)}`
    };

    db.saveBooking(booking, req.user?.id || null);

    res.status(201).json({
      success: true,
      booking,
      message: `Booking confirmed! Reference: ${booking.confirmationCode}`
    });
  } catch (err) {
    console.error('Booking error:', err);
    res.status(500).json({ error: 'Booking failed. Please try again.' });
  }
});

// GET /api/bookings
router.get('/', optionalAuth, (req, res) => {
  const list = req.user
    ? db.listBookingsByUser(req.user.id)
    : db.listAllBookings();
  res.json({ success: true, bookings: list, count: list.length });
});

// GET /api/bookings/:id
router.get('/:id', (req, res) => {
  const booking = db.getBookingById(req.params.id);
  if (!booking) return res.status(404).json({ error: 'Booking not found.' });
  res.json({ success: true, booking });
});

// DELETE /api/bookings/:id — cancel
router.delete('/:id', optionalAuth, (req, res) => {
  const booking = db.getBookingById(req.params.id);
  if (!booking) return res.status(404).json({ error: 'Booking not found.' });
  db.updateBookingStatus(req.params.id, 'cancelled');
  res.json({ success: true, message: 'Booking cancelled.', booking: { ...booking, status: 'cancelled' } });
});

module.exports = router;

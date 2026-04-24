const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  user_id: { type: String, default: null },
  itinerary_id: { type: String, default: null },
  type: { type: String, required: true },
  item_id: { type: String, required: true },
  item_name: { type: String, required: true },
  travelers: { type: Number, required: true },
  price_per_person: { type: Number, required: true },
  total_price: { type: Number, required: true },
  date: { type: String, default: null },
  guest_name: { type: String, default: null },
  guest_email: { type: String, default: null },
  status: { type: String, required: true },
  confirmation_code: { type: String, required: true },
  booked_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Booking', BookingSchema);

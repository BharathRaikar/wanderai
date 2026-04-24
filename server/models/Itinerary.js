const mongoose = require('mongoose');

const ItinerarySchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  user_id: { type: String, default: null }, // can be null for guest users
  destination_name: { type: String, required: true },
  destination_country: { type: String, required: true },
  num_days: { type: Number, required: true },
  travelers: { type: Number, required: true },
  budget: { type: Number, required: true },
  data: { type: mongoose.Schema.Types.Mixed, required: true }, // Store the full itinerary JSON
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Itinerary', ItinerarySchema);

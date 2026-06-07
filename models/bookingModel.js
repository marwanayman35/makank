const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  ticketId: { type: String, required: true, unique: true },
  userEmail: { type: String, required: true },
  userName: { type: String, required: true },
  event: { type: String, required: true },
  date: { type: String, required: true },
  venue: { type: String, required: true },
  tier: { type: String, required: true },
  qty: { type: Number, required: true },
  total: { type: Number, required: true },
  purchasedOn: { type: String, required: true },
  status: { type: String, default: 'active' } // 'active' or 'cancelled'
});

module.exports = mongoose.model('Booking', bookingSchema);

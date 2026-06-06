const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true }, // custom identifier (e.g. #EV-001, MATCH-001)
  name: { type: String, required: true },
  type: { type: String, required: true }, // 'football', 'concert', etc.
  date: { type: String, required: true },
  venue: { type: String, required: true },
  city: { type: String },
  price: { type: Number, min: [0, 'Price cannot be negative'] },
  description: { type: String },
  mapUrl: { 
    type: String, 
    validate: {
      validator: function(v) {
        if (!v) return true;
        return /^https?:\/\/.+/.test(v);
      },
      message: props => `${props.value} is not a valid URL!`
    }
  },
  headerImage: { type: String },
  galleryImages: { type: [String], default: [] },
  featured: { type: Boolean, default: false },
  status: { type: String, default: 'Active' }, // 'Active', 'available', 'closed'
  subevents: { type: Array, default: [] },

  // Football-specific fields (optional)
  homeTeam: { type: String },
  homeTeamLogo: { type: String },
  awayTeam: { type: String },
  awayTeamLogo: { type: String },
  time: { type: String },
  matchNo: { type: Number }
});

module.exports = mongoose.model('Event', eventSchema);

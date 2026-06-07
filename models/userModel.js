const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  ticketId: { type: String, required: true },
  event: { type: String, required: true },
  date: { type: String, required: true },
  venue: { type: String, required: true },
  tier: { type: String, required: true },
  qty: { type: Number, required: true },
  total: { type: Number, required: true },
  purchasedOn: { type: String, required: true },
  status: { type: String, default: 'active' } // 'active' or 'cancelled'
});

const userSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: {
      validator: function(v) {
        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
      },
      message: props => `${props.value} is not a valid email address!`
    }
  },
  password: { type: String, required: true },
  created: { type: String, required: true },
  tickets: [ticketSchema]
});

module.exports = mongoose.model('User', userSchema);
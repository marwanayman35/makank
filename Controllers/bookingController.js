const Booking = require('../models/bookingModel');
const User = require('../models/userModel');

const bookingController = {
  // Process payment and record a ticket booking
  createBooking: async (req, res) => {
    const { holderEmail, eventName, eventDate, venue, tier, quantity, total } = req.body;

    try {
      const user = await User.findOne({ email: holderEmail.toLowerCase() });
      if (!user) {
        return res.status(404).json({ success: false, message: 'User account not found' });
      }

      // Generate secure unique ticket code
      const ticketId = 'TKT-' + Math.floor(10000 + Math.random() * 90000);

      const newTicket = {
        ticketId,
        event: eventName,
        date: eventDate,
        venue,
        tier,
        qty: parseInt(quantity) || 1,
        total: parseFloat(total) || 60,
        purchasedOn: new Date().toISOString().split('T')[0],
        status: 'active'
      };

      // 1. Embed ticket in User account profile array
      user.tickets.push(newTicket);
      await user.save();

      // 2. Save master transaction booking document in database
      const newBooking = new Booking({
        ticketId,
        userEmail: holderEmail.toLowerCase(),
        userName: user.name,
        event: eventName,
        date: eventDate,
        venue,
        tier,
        qty: parseInt(quantity) || 1,
        total: parseFloat(total) || 60,
        purchasedOn: new Date().toISOString().split('T')[0],
        status: 'active'
      });

      await newBooking.save();

      return res.status(201).json({ success: true, ticket: newTicket });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  },

  // Aggregate all tickets across all users for admin overview
  getAllTickets: async (req, res) => {
    try {
      const tickets = await Booking.find({});
      return res.status(200).json({ success: true, tickets });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }
};

module.exports = bookingController;

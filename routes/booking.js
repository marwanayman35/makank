const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const authMiddleware = require('../authMiddleware');

// Booking operations
router.post('/', authMiddleware.verifyUser, bookingController.createBooking);
router.get('/', bookingController.getAllTickets); // accessible for admin checks

module.exports = router;

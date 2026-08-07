const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const verifyToken = require('../middleware/auth');
const requireRole = require('../middleware/roleCheck');

// Customer create booking
router.post('/', verifyToken, requireRole('customer'), bookingController.createBooking);

// Worker update status (accept/reject/in_progress/completed)
router.put('/:id/status', verifyToken, requireRole('worker'), bookingController.updateBookingStatus);

// Customer cancel booking
router.put('/:id/cancel', verifyToken, requireRole('customer'), bookingController.cancelBooking);

module.exports = router;

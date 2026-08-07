const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');
const verifyToken = require('../middleware/auth');
const requireRole = require('../middleware/roleCheck');

router.get('/me', verifyToken, requireRole('customer'), customerController.getMe);
router.put('/me', verifyToken, requireRole('customer'), customerController.updateMe);
router.get('/me/bookings', verifyToken, requireRole('customer'), customerController.getMyBookings);

module.exports = router;

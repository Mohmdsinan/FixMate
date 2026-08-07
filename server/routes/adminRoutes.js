const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const verifyToken = require('../middleware/auth');
const requireRole = require('../middleware/roleCheck');

// All routes require admin token
router.use(verifyToken, requireRole('admin'));

router.get('/workers/pending', adminController.getPendingWorkers);
router.put('/workers/:id/verify', adminController.verifyWorker);
router.get('/users', adminController.getUsers);
router.put('/users/:id/suspend', adminController.suspendUser);
router.get('/bookings', adminController.getAllBookings);

module.exports = router;

const express = require('express');
const router = express.Router();
const workerController = require('../controllers/workerController');
const reviewController = require('../controllers/reviewController');
const verifyToken = require('../middleware/auth');
const requireRole = require('../middleware/roleCheck');
const { upload } = require('../config/cloudinary');

// Public worker endpoints
router.get('/', workerController.getWorkers);
router.get('/:id', workerController.getWorkerById);
router.get('/:id/reviews', reviewController.getWorkerReviews);

// Protected worker endpoints
router.put('/me', verifyToken, requireRole('worker'), workerController.updateMe);
router.post('/me/photo', verifyToken, requireRole('worker'), upload.single('photo'), workerController.uploadPhoto);
router.get('/me/bookings', verifyToken, requireRole('worker'), workerController.getMyBookings);

module.exports = router;

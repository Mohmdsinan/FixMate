const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const verifyToken = require('../middleware/auth');
const requireRole = require('../middleware/roleCheck');

// Customer create review
router.post('/', verifyToken, requireRole('customer'), reviewController.createReview);

module.exports = router;

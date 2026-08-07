const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Customer Auth
router.post('/customer/register', authController.registerCustomer);
router.post('/customer/login', authController.loginCustomer);

// Worker Auth
router.post('/worker/register', authController.registerWorker);
router.post('/worker/login', authController.loginWorker);

// Admin Auth
router.post('/admin/login', authController.loginAdmin);

module.exports = router;

const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const verifyToken = require('../middleware/auth');
const requireRole = require('../middleware/roleCheck');

// Public
router.get('/', categoryController.getCategories);

// Admin only
router.post('/', verifyToken, requireRole('admin'), categoryController.createCategory);
router.delete('/:id', verifyToken, requireRole('admin'), categoryController.deleteCategory);

module.exports = router;

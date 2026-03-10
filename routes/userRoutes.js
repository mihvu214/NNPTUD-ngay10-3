const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Create user
router.post('/', userController.createUser);

// Get all users (with optional username search)
router.get('/', userController.getAllUsers);

// Enable user (set status to true)
router.post('/enable', userController.enableUser);

// Disable user (set status to false)
router.post('/disable', userController.disableUser);

// Get user by ID
router.get('/:id', userController.getUserById);

// Update user
router.put('/:id', userController.updateUser);

// Delete user (soft delete)
router.delete('/:id', userController.deleteUser);

module.exports = router;

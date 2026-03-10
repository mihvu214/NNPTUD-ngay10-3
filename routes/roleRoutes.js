const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController');

// Create role
router.post('/', roleController.createRole);

// Get all roles
router.get('/', roleController.getAllRoles);

// Get role by ID
router.get('/:id', roleController.getRoleById);

// Get all users by role ID
router.get('/:id/users', roleController.getUsersByRoleId);

// Update role
router.put('/:id', roleController.updateRole);

// Delete role (soft delete)
router.delete('/:id', roleController.deleteRole);

module.exports = router;

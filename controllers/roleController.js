const Role = require('../models/Role');

// Create (C)
exports.createRole = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Name is required' });
    }

    const existingRole = await Role.findOne({ name, isDeleted: false });
    if (existingRole) {
      return res.status(400).json({ message: 'Role name already exists' });
    }

    const role = new Role({
      name,
      description: description || ""
    });

    const savedRole = await role.save();
    res.status(201).json({
      message: 'Role created successfully',
      data: savedRole
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Read All (R)
exports.getAllRoles = async (req, res) => {
  try {
    const roles = await Role.find({ isDeleted: false });
    res.status(200).json({
      message: 'Get all roles successfully',
      data: roles
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Read By ID (R)
exports.getRoleById = async (req, res) => {
  try {
    const { id } = req.params;
    const role = await Role.findOne({ _id: id, isDeleted: false });

    if (!role) {
      return res.status(404).json({ message: 'Role not found' });
    }

    res.status(200).json({
      message: 'Get role successfully',
      data: role
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update (U)
exports.updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const role = await Role.findOne({ _id: id, isDeleted: false });
    if (!role) {
      return res.status(404).json({ message: 'Role not found' });
    }

    // Check if new name is unique
    if (name && name !== role.name) {
      const existingRole = await Role.findOne({ name, isDeleted: false });
      if (existingRole) {
        return res.status(400).json({ message: 'Role name already exists' });
      }
      role.name = name;
    }

    if (description !== undefined) {
      role.description = description;
    }

    const updatedRole = await role.save();
    res.status(200).json({
      message: 'Role updated successfully',
      data: updatedRole
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete (Soft Delete) (D)
exports.deleteRole = async (req, res) => {
  try {
    const { id } = req.params;
    const role = await Role.findOne({ _id: id, isDeleted: false });

    if (!role) {
      return res.status(404).json({ message: 'Role not found' });
    }

    role.isDeleted = true;
    await role.save();

    res.status(200).json({
      message: 'Role deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Users by Role ID
exports.getUsersByRoleId = async (req, res) => {
  try {
    const { id } = req.params;
    const User = require('../models/User');

    // Check if role exists
    const role = await Role.findOne({ _id: id, isDeleted: false });
    if (!role) {
      return res.status(404).json({ message: 'Role not found' });
    }

    // Get all users with this role
    const users = await User.find({ role: id, isDeleted: false }).populate('role');

    res.status(200).json({
      message: 'Get users by role successfully',
      data: users
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

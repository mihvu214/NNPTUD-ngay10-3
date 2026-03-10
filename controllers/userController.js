const User = require('../models/User');
const Role = require('../models/Role');

// Create (C)
exports.createUser = async (req, res) => {
  try {
    const { username, password, email, fullName, avatarUrl, role } = req.body;

    // Validate required fields
    if (!username || !password || !email) {
      return res.status(400).json({ message: 'Username, password, and email are required' });
    }

    // Check if username exists
    const existingUsername = await User.findOne({ username, isDeleted: false });
    if (existingUsername) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Check if email exists
    const existingEmail = await User.findOne({ email, isDeleted: false });
    if (existingEmail) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Validate role if provided
    if (role) {
      const existingRole = await Role.findOne({ _id: role, isDeleted: false });
      if (!existingRole) {
        return res.status(400).json({ message: 'Role not found' });
      }
    }

    const user = new User({
      username,
      password,
      email,
      fullName: fullName || "",
      avatarUrl: avatarUrl || "https://i.sstatic.net/l60Hf.png",
      role: role || null
    });

    const savedUser = await user.save();
    res.status(201).json({
      message: 'User created successfully',
      data: savedUser
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Read All (R) - with username search (includes)
exports.getAllUsers = async (req, res) => {
  try {
    const { username } = req.query;
    let filter = { isDeleted: false };

    // Search by username (includes)
    if (username) {
      filter.username = { $regex: username, $options: 'i' };
    }

    const users = await User.find(filter).populate('role');
    res.status(200).json({
      message: 'Get all users successfully',
      data: users
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Read By ID (R)
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findOne({ _id: id, isDeleted: false }).populate('role');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      message: 'Get user successfully',
      data: user
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update (U)
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, fullName, avatarUrl, status, role } = req.body;

    const user = await User.findOne({ _id: id, isDeleted: false });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if new username is unique
    if (username && username !== user.username) {
      const existingUsername = await User.findOne({ username, isDeleted: false });
      if (existingUsername) {
        return res.status(400).json({ message: 'Username already exists' });
      }
      user.username = username;
    }

    // Check if new email is unique
    if (email && email !== user.email) {
      const existingEmail = await User.findOne({ email, isDeleted: false });
      if (existingEmail) {
        return res.status(400).json({ message: 'Email already exists' });
      }
      user.email = email;
    }

    // Validate role if provided
    if (role && role !== user.role.toString()) {
      const existingRole = await Role.findOne({ _id: role, isDeleted: false });
      if (!existingRole) {
        return res.status(400).json({ message: 'Role not found' });
      }
      user.role = role;
    }

    if (fullName !== undefined) user.fullName = fullName;
    if (avatarUrl !== undefined) user.avatarUrl = avatarUrl;
    if (status !== undefined) user.status = status;

    const updatedUser = await user.save();
    
    // Populate role before sending response
    const populatedUser = await User.findById(updatedUser._id).populate('role');

    res.status(200).json({
      message: 'User updated successfully',
      data: populatedUser
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete (Soft Delete) (D)
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findOne({ _id: id, isDeleted: false });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.isDeleted = true;
    await user.save();

    res.status(200).json({
      message: 'User deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Enable User (POST /enable)
exports.enableUser = async (req, res) => {
  try {
    const { email, username } = req.body;

    // Validate required fields
    if (!email || !username) {
      return res.status(400).json({ message: 'Email and username are required' });
    }

    // Find user by email and username
    const user = await User.findOne({ 
      email, 
      username, 
      isDeleted: false 
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found with provided email and username' });
    }

    // Set status to true
    user.status = true;
    const updatedUser = await user.save();

    // Populate role before sending response
    const populatedUser = await User.findById(updatedUser._id).populate('role');

    res.status(200).json({
      message: 'User enabled successfully',
      data: populatedUser
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Disable User (POST /disable)
exports.disableUser = async (req, res) => {
  try {
    const { email, username } = req.body;

    // Validate required fields
    if (!email || !username) {
      return res.status(400).json({ message: 'Email and username are required' });
    }

    // Find user by email and username
    const user = await User.findOne({ 
      email, 
      username, 
      isDeleted: false 
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found with provided email and username' });
    }

    // Set status to false
    user.status = false;
    const updatedUser = await user.save();

    // Populate role before sending response
    const populatedUser = await User.findById(updatedUser._id).populate('role');

    res.status(200).json({
      message: 'User disabled successfully',
      data: populatedUser
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

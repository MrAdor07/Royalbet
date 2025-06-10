const User = require('../models/User');
const Transaction = require('../models/Transaction');
const bcrypt = require('bcryptjs');

// ✅ Agent Dashboard
exports.getDashboard = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user', createdBy: req.user.id });
    const totalTransactions = await Transaction.countDocuments({ createdBy: req.user.id });

    res.json({
      success: true,
      totalUsers,
      totalTransactions
    });
  } catch (error) {
    console.error('Dashboard error:', error.message);
    res.status(500).json({ message: 'Dashboard error' });
  }
};

// ✅ Agent creates new user
exports.createUser = async (req, res) => {
  try {
    const { username, password, phone } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Password hash
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user under agent
    const newUser = new User({
      username,
      password: hashedPassword,
      phone,
      role: 'user',
      createdBy: req.user.id
    });

    await newUser.save();

    res.json({ success: true, message: 'User created successfully', user: newUser });
  } catch (error) {
    console.error('Create user error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ Agent can view all their created users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({ role: 'user', createdBy: req.user.id });
    res.json(users);
  } catch (error) {
    console.error('Get users error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

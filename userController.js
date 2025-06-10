const User = require('../models/User');
const Transaction = require('../models/Transaction');

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password'); // hide password
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

// Get user by ID
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching user' });
  }
};

// Update user details
const updateUser = async (req, res) => {
  try {
    const { username, phone, balance } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { username, phone, balance },
      { new: true }
    );
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user' });
  }
};

// Delete a user
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
};

// Get all transactions of a user
const getUserTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.params.id });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching user transactions' });
  }
};

// ✅ Define getUserProfile
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching profile' });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUserTransactions,
  getUserProfile,
};

const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const { check, validationResult } = require('express-validator');
const User = require('../models/auth');

// ==========================
// ✅ Test Route
// ==========================
router.get('/test', (req, res) => {
  res.status(200).json({ success: true, message: "API is working perfectly!" });
});

// ==========================
// ✅ Get User Profile (Protected)
// ==========================
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, user });
  } catch (err) {
    console.error('❌ Profile Error:', err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ==========================
// ✅ Update User Profile (Protected)
// ==========================
router.put('/profile', authMiddleware, [
  check('username', 'Username is required').not().isEmpty(),
  check('phone', 'Phone number is required').not().isEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const { username, phone } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { username, phone },
      { new: true }
    ).select('-password');

    res.json({ success: true, user });

  } catch (err) {
    console.error('❌ Update Profile Error:', err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;

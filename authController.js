const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// ✅ অপ্টিমাইজড রেজিস্ট্রেশন কন্ট্রোলার
exports.registerUser = async (req, res) => {
  try {
    const { username, phone, password } = req.body;

    // ফিল্ড ভ্যালিডেশন
    if (!username || !phone || !password) {
      return res.status(400).json({ 
        success: false,
        message: 'Username, phone and password are required' 
      });
    }

    // পাসওয়ার্ড শক্তি চেক
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters'
      });
    }

    // এক্সিস্টিং ইউজার চেক
    const existingUser = await User.findOne({ 
      $or: [{ phone }, { username }] 
    });
    
    if (existingUser) {
      const conflicts = {
        usernameExists: existingUser.username === username,
        phoneExists: existingUser.phone === phone
      };
      return res.status(409).json({
        success: false,
        message: 'User already exists',
        conflicts
      });
    }

    // পাসওয়ার্ড হ্যাশিং
    const hashedPassword = await bcrypt.hash(password, 12);

    // নতুন ইউজার ক্রিয়েট
    const newUser = new User({ 
      username, 
      phone, 
      password: hashedPassword,
      role: 'user'
    });

    await newUser.save();
    
    // জেএডব্লিউটি টোকেন জেনারেট
    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      token,
      user: {
        id: newUser._id,
        username: newUser.username,
        phone: newUser.phone,
        role: newUser.role
      }
    });

  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// ✅ ইম্প্রুভড লগইন কন্ট্রোলার
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // ইউজার এক্সিস্টেন্স চেক
    const user = await User.findOne({ username }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password'
      });
    }

    // পাসওয়ার্ড ম্যাচ চেক
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password'
      });
    }

    // টোকেন জেনারেশন
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // সেনসিটিভ ডেটা মুছে রেসপন্স প্রস্তুত
    user.password = undefined;

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user
    });

  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

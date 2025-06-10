const Transaction = require('../models/Transaction');
const User = require('../models/User');

// Deposit
exports.deposit = async (req, res) => {
  try {
    const { amount, method, currency, trxId } = req.body;

    if (!amount || !method || !currency || !trxId) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existing = await Transaction.findOne({ trxId });
    if (existing) {
      return res.status(400).json({ message: 'Transaction ID already used' });
    }

    const newTransaction = new Transaction({
      userId: req.user._id,
      type: 'deposit',
      method,
      amount,
      currency,
      trxId,
      status: 'pending',
    });

    await newTransaction.save();
    res.status(201).json({ message: 'Deposit request submitted', transaction: newTransaction });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Withdraw
exports.withdraw = async (req, res) => {
  try {
    const { amount, method, currency, trxId } = req.body;

    if (!amount || !method || !currency || !trxId) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const user = await User.findById(req.user._id);

    if (user.balance[currency] < amount) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    const existing = await Transaction.findOne({ trxId });
    if (existing) {
      return res.status(400).json({ message: 'Transaction ID already used' });
    }

    const newTransaction = new Transaction({
      userId: req.user._id,
      type: 'withdraw',
      method,
      amount,
      currency,
      trxId,
      status: 'pending',
    });

    await newTransaction.save();
    res.status(201).json({ message: 'Withdraw request submitted', transaction: newTransaction });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get user's transaction history
exports.getTransactionHistory = async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin-level: Search transactions
exports.searchTransactions = async (req, res) => {
  try {
    const { query } = req.query;

    const transactions = await Transaction.find({
      $or: [
        { trxId: { $regex: query, $options: 'i' } },
        { method: { $regex: query, $options: 'i' } }
      ]
    }).populate('userId', 'username email').sort({ createdAt: -1 });

    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all transactions (admin)
exports.getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ createdAt: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

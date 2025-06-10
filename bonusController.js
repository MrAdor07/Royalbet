const Bonus = require('../models/Bonus');
const User = require('../models/User');

exports.claimBonus = async (req, res) => {
  try {
    const userId = req.user.id;
    const bonus = await Bonus.findOne({ userId: userId });
    if (bonus && !bonus.claimed) {
      bonus.claimed = true;
      await bonus.save();
      await User.findByIdAndUpdate(userId, { $inc: { balance: bonus.amount } });
      return res.json({ message: 'Bonus claimed' });
    }
    res.status(400).json({ message: 'Bonus already claimed or not available' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getBonusStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    const bonus = await Bonus.findOne({ userId });
    if (!bonus) {
      return res.status(404).json({ message: 'No bonus found' });
    }
    res.json({
      claimed: bonus.claimed || false,
      amount: bonus.amount,
      target: bonus.target,
      achieved: bonus.achieved
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

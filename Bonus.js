const mongoose = require('mongoose');

const bonusSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  target: { type: Number, required: true },
  achieved: { type: Boolean, default: false },
  claimed: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Bonus', bonusSchema);

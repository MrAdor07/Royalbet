const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  type: { type: String, enum: ['deposit', 'withdraw'], required: true },
  method: { type: String, required: true },
  amount: { type: Number, required: true },
  currency: { type: String, enum: ['BDT', 'USD', 'USDT'], required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  trxId: { type: String, required: true, unique: true },
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);

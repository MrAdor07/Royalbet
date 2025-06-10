const mongoose = require('mongoose');
const adminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['main', 'sub'], default: 'sub' },
  balance: {
    BDT: { type: Number, default: 0 },
    USDT: { type: Number, default: 0 }
  }
}, { timestamps: true });
module.exports = mongoose.model('Admin', adminSchema);
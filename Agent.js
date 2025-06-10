const mongoose = require('mongoose');
const agentSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  permissions: [String],
  balance: {
    BDT: { type: Number, default: 0 },
    USDT: { type: Number, default: 0 }
  }
}, { timestamps: true });
module.exports = mongoose.model('Agent', agentSchema);
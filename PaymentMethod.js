const mongoose = require('mongoose');
const paymentMethodSchema = new mongoose.Schema({
  name: { type: String, required: true },
  number: { type: String, required: true },
  currency: { type: String, enum: ['BDT', 'USD', 'USDT'], required: true },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });
module.exports = mongoose.model('PaymentMethod', paymentMethodSchema);
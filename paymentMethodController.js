const PaymentMethod = require('../models/PaymentMethod');
exports.getPaymentMethods = async (req, res) => {
  try {
    const methods = await PaymentMethod.find();
    res.json(methods);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.addPaymentMethod = async (req, res) => {
  try {
    const { name, number, currency, isActive } = req.body;
    const method = new PaymentMethod({ name, number, currency, isActive });
    await method.save();
    res.json({ message: 'Payment method added successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updatePaymentMethod = async (req, res) => {
  try {
    const { id, name, number, currency, isActive } = req.body;
    const method = await PaymentMethod.findByIdAndUpdate(id, {
      name, number, currency, isActive
    }, { new: true });
    if (!method) return res.status(404).json({ message: 'Method not found' });
    res.json({ message: 'Payment method updated', method });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

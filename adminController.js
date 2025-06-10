const Admin = require('../models/Admin');
const Transaction = require('../models/Transaction');
const PaymentMethod = require('../models/PaymentMethod');
const User = require('../models/User');

// ✅ Dashboard Data
exports.getDashboard = async (req, res) => {
  try {
    const totalTransactions = await Transaction.countDocuments();

    const totalDeposit = await Transaction.aggregate([
      {
        $match: {
          type: 'deposit',
          status: 'approved'
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" }
        }
      }
    ]);

    const totalWithdraw = await Transaction.aggregate([
      {
        $match: {
          type: 'withdraw',
          status: 'approved'
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" }
        }
      }
    ]);

    const depositAmount = totalDeposit.length > 0 ? totalDeposit[0].total : 0;
    const withdrawAmount = totalWithdraw.length > 0 ? totalWithdraw[0].total : 0;

    res.status(200).json({
      totalTransactions,
      depositAmount,
      withdrawAmount
    });

  } catch (error) {
    console.error("❌ Dashboard Error:", error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ Assign Balance to User
exports.assignBalance = async (req, res) => {
  const { username, amount } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.balance += parseFloat(amount);
    await user.save();

    res.status(200).json({ message: "Balance assigned successfully" });
  } catch (error) {
    console.error("❌ Assign Balance Error:", error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ Get All Sub Admins
exports.getSubAdmins = async (req, res) => {
  try {
    const subAdmins = await Admin.find({ role: "sub-admin" }).select("-password");
    res.status(200).json(subAdmins);
  } catch (error) {
    console.error("❌ Get Sub Admins Error:", error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ Create Sub Admin
exports.createSubAdmin = async (req, res) => {
  const { username, password } = req.body;
  try {
    const existing = await Admin.findOne({ username });
    if (existing) {
      return res.status(400).json({ message: "Sub Admin already exists" });
    }

    const newSubAdmin = new Admin({ username, password, role: "sub-admin" });
    await newSubAdmin.save();

    res.status(201).json({ message: "Sub Admin created successfully" });
  } catch (error) {
    console.error("❌ Create Sub Admin Error:", error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ Remove Sub Admin
exports.removeSubAdmin = async (req, res) => {
  const { username } = req.body;
  try {
    const subAdmin = await Admin.findOne({ username, role: "sub-admin" });
    if (!subAdmin) {
      return res.status(404).json({ message: "Sub Admin not found" });
    }

    await Admin.deleteOne({ _id: subAdmin._id });

    res.status(200).json({ message: "Sub Admin removed successfully" });
  } catch (error) {
    console.error("❌ Remove Sub Admin Error:", error);
    res.status(500).json({ message: 'Server error' });
  }
};

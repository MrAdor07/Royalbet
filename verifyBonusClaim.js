const Bonus = require("../models/Bonus");
const Transaction = require("../models/Transaction");

const verifyBonusClaim = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const existingBonus = await Bonus.findOne({ user: userId });
    if (existingBonus) {
      return res.status(400).json({ error: "Bonus already claimed." });
    }
    next();
  } catch (error) {
    console.error("verifyBonusClaim error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = verifyBonusClaim;
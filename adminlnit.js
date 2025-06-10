const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");

const initializeAdmin = async () => {
  try {
    const existingAdmin = await Admin.findOne({ username: "admin" });
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash("admin123", 10);
      const admin = new Admin({
        username: "admin",
        password: hashedPassword,
        role: "main",
        balance: {
          BDT: 1000000,
          USDT: 20000,
        },
      });
      await admin.save();
      console.log("Default admin created.");
    } else {
      console.log("Admin already exists.");
    }
  } catch (error) {
    console.error("Error initializing admin:", error);
  }
};

module.exports = initializeAdmin;
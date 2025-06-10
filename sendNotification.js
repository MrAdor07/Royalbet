const logger = require("./logger");

const sendNotification = async (userId, title, message) => {
  try {
    logger(`📢 Notification sent to user ${userId} - ${title}`);
  } catch (error) {
    logger(`❌ Failed to send notification to ${userId}: ${error.message}`);
  }
};

module.exports = sendNotification;
// /root/Royalbet-backend/middlewares/logRequest.js
const fs = require('fs');
const path = require('path');
const logRequest = (req, res, next) => {
  const logFile = '/root/Royalbet-backend/request_logs.txt';
  
  try {
    const logEntry = `${new Date().toISOString()} ${req.method} ${req.url}\n`;
    fs.appendFileSync(logFile, logEntry, { flag: 'a' });
  } catch (err) {
    console.error('Log error:', err.message);
  }
  next();
};
module.exports = logRequest;

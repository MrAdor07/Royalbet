const fs = require('fs');
const path = require('path');

const logFile = path.join(__dirname, '../logs/royalbet_requests.log');

const logger = (message) => {
    const time = new Date().toISOString();
    fs.appendFileSync(logFile, `[${time}] ${message}\n`);
};

module.exports = logger;

require('dotenv').config();
const fs = require("fs");
const path = require("path");
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
const connectDB = require(__dirname + '/config/db');
const authRoutes = require('./routes/authRoutes'); // ✅ authRoutes import

// ==========================
// ✅ লগ ফাইল সেটআপ
// ==========================
const logsDir = path.join(__dirname, 'logs');

if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true, mode: 0o755 });
}

const logPath = path.join(logsDir, 'royalbet_requests.log');
const logStream = fs.createWriteStream(logPath, { flags: 'a' });
// ==========================
// ✅ MongoDB সংযোগ
// ==========================
connectDB(); // ✅ একটাই কানেকশন, clean & standard

// ==========================
// ✅ Express অ্যাপ ইনিশিয়ালাইজেশন
// ==========================
const app = express();

// ==========================
// ✅ সিকিউরিটি মিডলওয়্যার
// ==========================
app.set('trust proxy', true);

app.use(helmet());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
  maxAge: 86400
}));

app.use(mongoSanitize());
app.use(hpp());

// ==========================
// ✅ লগিং মিডলওয়্যার
// ==========================
app.use(morgan('combined', { stream: logStream }));

// ==========================
// ✅ রেট লিমিটার
// ==========================
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  message: { 
    success: false, 
    message: 'Too many requests from this IP, please try again after 15 minutes' 
  }
});

app.use('/api/', apiLimiter);

// ==========================
// ✅ বডি পার্সার
// ==========================
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// ==========================
// ✅ ম্যালিসিয়াস রিকুয়েস্ট ব্লকার
// ==========================
app.use((req, res, next) => {
  const blockedPatterns = [
    /(\.env$|wp-|wordpress|phpmyadmin|adminer|\.git|\.svn|\.htaccess|\.bash)/i,
    /(union.*select|select.*from|insert.*into|delete.*from|drop.*table)/i,
    /(\.\.\/|..\\|%00|\x00|\u0000)/i,
    /\b(eval|system|exec|passthru|shell_exec|base64_decode|assert|preg_replace)\b/i,
    /(php:\/\/|allow_url_include)/i,
    /(vendor\/phpunit)/i
  ];
  
  const url = req.originalUrl.toLowerCase();
  const userAgent = req.headers['user-agent'] || '';
  
  for (const pattern of blockedPatterns) {
    if (pattern.test(url) || pattern.test(userAgent)) {
      console.warn(`🚨 Blocked malicious request from ${req.ip}: ${url}`);
      return res.status(403).json({ 
        success: false, 
        message: 'Forbidden request pattern detected.' 
      });
    }
  }
  next();
});

// ==========================
// ✅ রাউট সেটআপ
// ==========================
app.use('/api/auth', authRoutes); // ✅ Your routes loaded properly

// ==========================
// ✅ রুট হ্যান্ডলার
// ==========================
app.get('/', (req, res) => {
  res.json({ 
    status: 'running',
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  });
});

// 404 হ্যান্ডলার
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Resource not found' });
});

// গ্লোবাল এরর হ্যান্ডলার
app.use((err, req, res, next) => {
  console.error('🔥 Error:', err.stack);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

// ==========================
// ✅ সার্ভার স্টার্ট
// ==========================
const PORT = process.env.PORT || 3001;
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`✅ Log file: ${logPath}`);
  console.log(`✅ Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`✅ PID: ${process.pid}`);
});

// গ্রেসফুল শাটডাউন
process.on('SIGINT', () => {
  console.log('🛑 SIGINT received. Shutting down gracefully...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

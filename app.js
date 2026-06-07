require('dotenv').config();
const express = require('express');
const path = require('path');
const https = require('https');
const http = require('http');
const fs = require('fs');
const connectDB = require('./config/db');

// Import routes
const webRoutes = require('./routes/web');
const authRoutes = require('./routes/auth');
const bookingRoutes = require('./routes/booking');

const app = express();
const PORT = process.env.PORT || 8080;

// Connect to MongoDB Atlas
connectDB();

// Set EJS as template view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static directory assets
app.use(express.static(path.join(__dirname, 'public')));

// Parse URL-encoded bodies and JSON objects (higher size limits for admin base64 images)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Configure session middleware
const session = require('express-session');
app.use(session({
  secret: process.env.SESSION_SECRET || 'nile-league-secret-key-12345',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

// Mount Application Routes
app.use('/', webRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);

// Catch-all 404 handler
app.use((req, res, next) => {
  res.status(404);
  if (req.accepts('html') && !req.path.startsWith('/api/')) {
    res.render('404');
    return;
  }
  res.json({ success: false, message: 'Resource not found.' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Server execution error:', err.stack);
  res.status(500).json({ success: false, message: 'Internal server error occurred.' });
});

// Start listening
const USE_HTTPS = process.env.USE_HTTPS === 'true';
const SSL_KEY_PATH = process.env.SSL_KEY_PATH;
const SSL_CERT_PATH = process.env.SSL_CERT_PATH;

let server;

if (USE_HTTPS && SSL_KEY_PATH && SSL_CERT_PATH) {
  try {
    const sslOptions = {
      key: fs.readFileSync(path.resolve(__dirname, SSL_KEY_PATH)),
      cert: fs.readFileSync(path.resolve(__dirname, SSL_CERT_PATH))
    };
    server = https.createServer(sslOptions, app);
    server.listen(PORT, () => {
      console.log(`Your server is now running securely on https://localhost:${PORT} and https://makank.com:${PORT}`);
    });
  } catch (err) {
    console.error('Failed to load SSL certificates. Falling back to HTTP:', err.message);
    server = http.createServer(app);
    server.listen(PORT, () => {
      console.log(`Your server is now running on http://localhost:${PORT}`);
    });
  }
} else {
  server = http.createServer(app);
  server.listen(PORT, () => {
    console.log(`Your server is now running on http://localhost:${PORT}`);
  });
}

module.exports = app;

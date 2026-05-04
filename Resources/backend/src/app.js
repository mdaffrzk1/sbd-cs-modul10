const express = require('express');
// Import library yang baru diinstal
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit'); // Tambahkan import rateLimit

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const itemRoutes = require('./routes/itemRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const reportRoutes = require('./routes/reportRoutes');

const app = express();

// Konfigurasi CORS sesuai instruksi
app.use(cors({
  origin: function (origin, callback) {
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:3001',
      'https://sbd-cs-modul10.vercel.app'
    ];
    // Izinkan jika origin ada di list atau jika request berasal dari server-to-server (origin undefined)
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Tangani preflight requests
app.options('*', cors());

// Tambahkan Helmet untuk keamanan HTTP headers semua route
app.use(helmet({
  crossOriginResourcePolicy: false,
}));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Buat konfigurasi rate limiting (Max 5 request per 15 menit)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit dalam milisecond
  max: 5, // Batasi setiap IP Address max 5 requests per windowMs
  message: {
    success: false,
    message: 'Terlalu banyak request dari alamat IP ini, coba lagi dalam 15 menit.',
    payload: null
  },
  standardHeaders: true, // Return rate limit info di `RateLimit-*` headers
  legacyHeaders: false, // Nonaktifkan header `X-RateLimit-*` lawas
});

// Terapkan limiter tersebut HANYA ke rute autentikasi
app.use('/auth', authLimiter, authRoutes); // Untuk Login
app.use('/user/register', authLimiter); // Untuk Register

// API routes
app.use('/user', userRoutes);
app.use('/items', itemRoutes);
app.use('/transaction', transactionRoutes);
app.use('/reports', reportRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
    payload: null,
  });
});

// Simple error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    payload: null,
  });
});

module.exports = app;
const express  = require('express');
const cors     = require('cors');
const morgan   = require('morgan');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const authRoutes     = require('./routes/auth');
const categoryRoutes = require('./routes/categories');
const productRoutes  = require('./routes/products');
const cartRoutes     = require('./routes/cart');
const orderRoutes    = require('./routes/orders');

const app = express();

const allowedOrigins = (
  process.env.CLIENT_URLS || process.env.CLIENT_URL || 'http://localhost:3000'
)
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

// ── Middleware ──────────────────────────────────────────────
app.use(cors({
  origin: (origin, callback) => {
    // Allow server-to-server, Postman, and health checks without browser origin header
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('CORS: origin not allowed'));
  },
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'));

// ── Health check ────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ ok: true, message: 'Organic Store API is running' });
});

// ── Routes ──────────────────────────────────────────────────
app.use('/api/auth',       authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products',   productRoutes);
app.use('/api/cart',       cartRoutes);
app.use('/api/orders',     orderRoutes);

// ── 404 handler ─────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// ── Global error handler ────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
  });
});

module.exports = app;

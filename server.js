/**
 * server.js — Main entry point for the City Distance Analyzer backend
 * Sets up Express with middleware, routes, and starts the HTTP server.
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

// Import route modules
const citiesRouter = require('./src/routes/cities');
const algorithmRouter = require('./src/routes/algorithm');
const exportRouter = require('./src/routes/export');

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(helmet()); // Security headers
app.use(cors({ origin: '*' })); // Allow frontend requests
app.use(morgan('dev')); // Request logging
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ─── Static Files (uploaded CSVs) ────────────────────────────────────────────
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use('/api/cities', citiesRouter);
app.use('/api/algorithm', algorithmRouter);
app.use('/api/export', exportRouter);

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    service: 'City Distance Analyzer API'
  });
});

// ─── 404 Handler ──────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.message);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error'
  });
});

// ─── Start Server ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 City Distance Analyzer API`);
  console.log(`   Running at: http://localhost:${PORT}`);
  console.log(`   Health:     http://localhost:${PORT}/api/health\n`);
});

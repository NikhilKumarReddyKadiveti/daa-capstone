/**
 * cities.js — Express router for city CRUD and CSV upload
 */

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { parse } = require('csv-parse/sync');
const { v4: uuidv4 } = require('uuid');

// Path to the local JSON data store
const DATA_PATH = path.join(__dirname, '../data/cities.json');

// Multer — store uploaded CSVs in /uploads
const upload = multer({
  dest: path.join(__dirname, '../../uploads/'),
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
      cb(null, true);
    } else {
      cb(new Error('Only CSV files are allowed'));
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 } // 5 MB max
});

// ─── Helpers ──────────────────────────────────────────────────────────────────
function readCities() {
  const raw = fs.readFileSync(DATA_PATH, 'utf-8');
  return JSON.parse(raw);
}

function writeCities(cities) {
  fs.writeFileSync(DATA_PATH, JSON.stringify(cities, null, 2));
}

// ─── GET /api/cities ──────────────────────────────────────────────────────────
router.get('/', (req, res) => {
  try {
    const cities = readCities();
    const { search, state } = req.query;

    let filtered = cities;

    // Optional search filter
    if (search) {
      filtered = filtered.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Optional state filter
    if (state) {
      filtered = filtered.filter(c =>
        c.state?.toLowerCase() === state.toLowerCase()
      );
    }

    res.json({ count: filtered.length, cities: filtered });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── POST /api/cities ─────────────────────────────────────────────────────────
router.post('/', (req, res) => {
  try {
    const { name, latitude, longitude, population, state } = req.body;

    if (!name || latitude === undefined || longitude === undefined) {
      return res.status(400).json({ error: 'name, latitude, and longitude are required' });
    }

    const cities = readCities();
    const newCity = {
      id: uuidv4(),
      name,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      population: population ? parseInt(population) : null,
      state: state || null
    };

    cities.push(newCity);
    writeCities(cities);

    res.status(201).json({ message: 'City added', city: newCity });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── DELETE /api/cities/:id ───────────────────────────────────────────────────
router.delete('/:id', (req, res) => {
  try {
    let cities = readCities();
    const before = cities.length;
    cities = cities.filter(c => c.id !== req.params.id);

    if (cities.length === before) {
      return res.status(404).json({ error: 'City not found' });
    }

    writeCities(cities);
    res.json({ message: 'City deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── POST /api/cities/upload ──────────────────────────────────────────────────
router.post('/upload', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const content = fs.readFileSync(req.file.path, 'utf-8');

    // Parse CSV
    const records = parse(content, {
      columns: true,
      skip_empty_lines: true,
      trim: true
    });

    const cities = records.map(row => ({
      id: uuidv4(),
      name: row.name || row.Name || row.city || row.City,
      latitude: parseFloat(row.latitude || row.lat || row.Latitude),
      longitude: parseFloat(row.longitude || row.lon || row.lng || row.Longitude),
      population: row.population ? parseInt(row.population) : null,
      state: row.state || row.State || null
    })).filter(c => c.name && !isNaN(c.latitude) && !isNaN(c.longitude));

    // Replace dataset
    writeCities(cities);

    // Clean up temp file
    fs.unlinkSync(req.file.path);

    res.json({
      message: 'Dataset uploaded successfully',
      count: cities.length,
      cities: cities.slice(0, 5) // Preview first 5
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── POST /api/cities/reset ───────────────────────────────────────────────────
router.post('/reset', (req, res) => {
  try {
    const defaultPath = path.join(__dirname, '../data/cities.json');
    const defaultData = fs.readFileSync(defaultPath, 'utf-8');
    writeCities(JSON.parse(defaultData));
    res.json({ message: 'Dataset reset to default' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

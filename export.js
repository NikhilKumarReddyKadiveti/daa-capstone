/**
 * export.js — Route for exporting analysis results as JSON/CSV
 */

const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { compareAlgorithms } = require('../services/closestPair');

const DATA_PATH = path.join(__dirname, '../data/cities.json');

function readCities() {
  return JSON.parse(fs.readFileSync(DATA_PATH, 'utf-8'));
}

// ─── GET /api/export/results ──────────────────────────────────────────────────
// Export full analysis as JSON (frontend will convert to PDF)
router.get('/results', (req, res) => {
  try {
    const cities = readCities();
    const comparison = compareAlgorithms(cities);

    const exportData = {
      exportedAt: new Date().toISOString(),
      project: 'City Distance Analyzer',
      version: '1.0.0',
      dataset: {
        totalCities: cities.length,
        cities: cities.map(c => ({
          name: c.name,
          lat: c.latitude,
          lon: c.longitude,
          state: c.state
        }))
      },
      analysis: {
        closestPair: comparison.closestPair
          ? {
              city1: comparison.closestPair.city1?.name,
              city2: comparison.closestPair.city2?.name,
              distanceKm: comparison.closestPair.distance?.toFixed(2)
            }
          : null,
        bruteForce: {
          timeMs: comparison.bruteForce.timeMs,
          complexity: comparison.bruteForce.complexity,
          operations: comparison.bruteForce.theoreticalOps
        },
        divideConquer: {
          timeMs: comparison.divideAndConquer.timeMs,
          complexity: comparison.divideAndConquer.complexity,
          operations: comparison.divideAndConquer.theoreticalOps
        },
        speedupFactor: comparison.speedup
      }
    };

    res.json(exportData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── GET /api/export/csv ──────────────────────────────────────────────────────
router.get('/csv', (req, res) => {
  try {
    const cities = readCities();

    const header = 'name,latitude,longitude,population,state\n';
    const rows = cities
      .map(c => `${c.name},${c.latitude},${c.longitude},${c.population || ''},${c.state || ''}`)
      .join('\n');

    const csv = header + rows;

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="cities-export.csv"');
    res.send(csv);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

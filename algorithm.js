/**
 * algorithm.js — Routes for running and comparing algorithms
 */

const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { runBruteForce, runDivideAndConquer, compareAlgorithms } = require('../services/closestPair');
const { nearestNeighborRoute, distanceMatrix } = require('../services/routeOptimizer');

const DATA_PATH = path.join(__dirname, '../data/cities.json');

function readCities() {
  return JSON.parse(fs.readFileSync(DATA_PATH, 'utf-8'));
}

// ─── GET /api/algorithm/closest-pair ─────────────────────────────────────────
// Run both algorithms and return comparison
router.get('/closest-pair', (req, res) => {
  try {
    const cities = readCities();

    if (cities.length < 2) {
      return res.status(400).json({ error: 'Need at least 2 cities' });
    }

    const comparison = compareAlgorithms(cities);
    res.json(comparison);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── GET /api/algorithm/brute-force ──────────────────────────────────────────
router.get('/brute-force', (req, res) => {
  try {
    const cities = readCities();
    const result = runBruteForce(cities);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── GET /api/algorithm/divide-conquer ───────────────────────────────────────
router.get('/divide-conquer', (req, res) => {
  try {
    const cities = readCities();
    const result = runDivideAndConquer(cities);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── POST /api/algorithm/route ────────────────────────────────────────────────
// Optimize a route through selected cities
router.post('/route', (req, res) => {
  try {
    const { cityIds, startId } = req.body;
    const allCities = readCities();

    let cities = allCities;
    if (cityIds && Array.isArray(cityIds) && cityIds.length > 0) {
      cities = allCities.filter(c => cityIds.includes(c.id));
    }

    if (cities.length < 2) {
      return res.status(400).json({ error: 'Select at least 2 cities for routing' });
    }

    const result = nearestNeighborRoute(cities, startId || cities[0].id);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── GET /api/algorithm/matrix ────────────────────────────────────────────────
// Get pairwise distance matrix
router.get('/matrix', (req, res) => {
  try {
    const cities = readCities();
    const matrix = distanceMatrix(cities.slice(0, 10)); // Limit for performance
    res.json({ matrix, cities: cities.slice(0, 10).map(c => c.name) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── GET /api/algorithm/stats ─────────────────────────────────────────────────
router.get('/stats', (req, res) => {
  try {
    const cities = readCities();
    const n = cities.length;

    res.json({
      cityCount: n,
      bruteForceOps: n * n,
      dcOps: Math.ceil(n * Math.log2(Math.max(n, 1))),
      improvement: n > 1 ? (n / Math.log2(n)).toFixed(1) : '—',
      complexities: [
        { n: 10, bf: 100, dc: Math.ceil(10 * Math.log2(10)) },
        { n: 50, bf: 2500, dc: Math.ceil(50 * Math.log2(50)) },
        { n: 100, bf: 10000, dc: Math.ceil(100 * Math.log2(100)) },
        { n: 500, bf: 250000, dc: Math.ceil(500 * Math.log2(500)) },
        { n: 1000, bf: 1000000, dc: Math.ceil(1000 * Math.log2(1000)) },
        { n: 5000, bf: 25000000, dc: Math.ceil(5000 * Math.log2(5000)) }
      ]
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

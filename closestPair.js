/**
 * closestPair.js — Core algorithm service
 *
 * Implements two approaches:
 *   1. Brute Force     — O(n²) comparison of all pairs
 *   2. Divide & Conquer — O(n log n) recursive splitting
 *
 * Both use Haversine formula for real geographic distance (km).
 */

// ─── Haversine Distance ───────────────────────────────────────────────────────
/**
 * Calculates the great-circle distance between two GPS coordinates.
 * @param {Object} a - City a with lat/lon
 * @param {Object} b - City b with lat/lon
 * @returns {number} Distance in kilometers
 */
function haversineDistance(a, b) {
  const R = 6371; // Earth radius in km
  const dLat = toRad(b.latitude - a.latitude);
  const dLon = toRad(b.longitude - a.longitude);
  const lat1 = toRad(a.latitude);
  const lat2 = toRad(b.latitude);

  const x =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
  return R * c;
}

function toRad(deg) {
  return deg * (Math.PI / 180);
}

// ─── Euclidean Distance (for 2D plane visualization) ─────────────────────────
function euclideanDistance(a, b) {
  const dx = b.longitude - a.longitude;
  const dy = b.latitude - a.latitude;
  return Math.sqrt(dx * dx + dy * dy);
}

// ─── Brute Force O(n²) ───────────────────────────────────────────────────────
/**
 * Checks all pairs of cities and returns the closest.
 * @param {Array} cities
 * @returns {Object} { city1, city2, distance, steps }
 */
function bruteForce(cities) {
  let minDist = Infinity;
  let closestPair = null;
  let steps = 0;
  const comparisons = [];

  for (let i = 0; i < cities.length; i++) {
    for (let j = i + 1; j < cities.length; j++) {
      steps++;
      const dist = haversineDistance(cities[i], cities[j]);
      comparisons.push({ city1: cities[i].name, city2: cities[j].name, distance: dist });

      if (dist < minDist) {
        minDist = dist;
        closestPair = { city1: cities[i], city2: cities[j], distance: dist };
      }
    }
  }

  return { ...closestPair, steps, comparisons: comparisons.slice(0, 20) };
}

// ─── Divide & Conquer O(n log n) ─────────────────────────────────────────────

/**
 * Helper: find closest pair in the strip region near the dividing line.
 * @param {Array} strip - Cities within delta distance of midline
 * @param {number} delta - Current minimum distance
 * @returns {Object|null}
 */
function stripClosest(strip, delta) {
  let minDist = delta;
  let result = null;

  // Sort strip by latitude (Y coordinate)
  strip.sort((a, b) => a.latitude - b.latitude);

  for (let i = 0; i < strip.length; i++) {
    // Only need to check next 7 points (mathematical proof)
    for (let j = i + 1; j < strip.length && strip[j].latitude - strip[i].latitude < minDist; j++) {
      const dist = haversineDistance(strip[i], strip[j]);
      if (dist < minDist) {
        minDist = dist;
        result = { city1: strip[i], city2: strip[j], distance: dist };
      }
    }
  }

  return result;
}

/**
 * Recursive divide & conquer closest pair.
 * @param {Array} sorted - Cities sorted by longitude
 * @param {Array} steps - Accumulator for visualization steps
 * @returns {Object} { city1, city2, distance }
 */
function divideAndConquer(sorted, steps = []) {
  const n = sorted.length;

  // Base case: use brute force for small arrays
  if (n <= 3) {
    let minDist = Infinity;
    let result = null;
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        const dist = haversineDistance(sorted[i], sorted[j]);
        if (dist < minDist) {
          minDist = dist;
          result = { city1: sorted[i], city2: sorted[j], distance: dist };
        }
      }
    }
    steps.push({
      type: 'base',
      cities: sorted.map(c => c.name),
      result: result ? { ...result, distance: result.distance } : null
    });
    return result;
  }

  // Find the midpoint (divide)
  const mid = Math.floor(n / 2);
  const midCity = sorted[mid];

  steps.push({
    type: 'divide',
    midCity: midCity.name,
    left: sorted.slice(0, mid).map(c => c.name),
    right: sorted.slice(mid).map(c => c.name)
  });

  // Recurse on left and right halves (conquer)
  const leftResult = divideAndConquer(sorted.slice(0, mid), steps);
  const rightResult = divideAndConquer(sorted.slice(mid), steps);

  // Find the minimum of left and right results
  let best = null;
  if (leftResult && rightResult) {
    best = leftResult.distance < rightResult.distance ? leftResult : rightResult;
  } else {
    best = leftResult || rightResult;
  }

  const delta = best ? best.distance : Infinity;

  // Find cities in the strip region
  const strip = sorted.filter(
    city => Math.abs(city.longitude - midCity.longitude) < delta
  );

  const stripResult = stripClosest(strip, delta);

  steps.push({
    type: 'combine',
    delta: delta.toFixed(2),
    stripSize: strip.length,
    stripResult: stripResult
      ? { city1: stripResult.city1.name, city2: stripResult.city2.name, distance: stripResult.distance.toFixed(2) }
      : null
  });

  // Return the overall minimum
  if (stripResult && stripResult.distance < delta) {
    return stripResult;
  }
  return best;
}

// ─── Main Export Functions ────────────────────────────────────────────────────

/**
 * Run Brute Force algorithm on city array.
 */
function runBruteForce(cities) {
  const start = process.hrtime.bigint();
  const result = bruteForce(cities);
  const end = process.hrtime.bigint();
  const timeMs = Number(end - start) / 1_000_000;

  return {
    algorithm: 'Brute Force',
    complexity: 'O(n²)',
    result,
    timeMs: timeMs.toFixed(3),
    cityCount: cities.length,
    theoreticalOps: cities.length * cities.length
  };
}

/**
 * Run Divide & Conquer algorithm on city array.
 */
function runDivideAndConquer(cities) {
  const sorted = [...cities].sort((a, b) => a.longitude - b.longitude);
  const steps = [];

  const start = process.hrtime.bigint();
  const result = divideAndConquer(sorted, steps);
  const end = process.hrtime.bigint();
  const timeMs = Number(end - start) / 1_000_000;

  return {
    algorithm: 'Divide & Conquer',
    complexity: 'O(n log n)',
    result,
    steps,
    timeMs: timeMs.toFixed(3),
    cityCount: cities.length,
    theoreticalOps: Math.ceil(cities.length * Math.log2(cities.length))
  };
}

/**
 * Run both algorithms and return comparison data.
 */
function compareAlgorithms(cities) {
  const bf = runBruteForce(cities);
  const dc = runDivideAndConquer(cities);

  return {
    bruteForce: bf,
    divideAndConquer: dc,
    speedup: (parseFloat(bf.timeMs) / parseFloat(dc.timeMs)).toFixed(2),
    closestPair: dc.result
  };
}

module.exports = {
  runBruteForce,
  runDivideAndConquer,
  compareAlgorithms,
  haversineDistance
};

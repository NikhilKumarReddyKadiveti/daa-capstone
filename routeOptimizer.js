/**
 * routeOptimizer.js — Route Optimization Service
 *
 * Uses Nearest Neighbor heuristic (greedy TSP approximation)
 * to find an efficient route through all selected cities.
 *
 * Time Complexity: O(n²)
 */

const { haversineDistance } = require('./closestPair');

/**
 * Nearest Neighbor TSP heuristic:
 * Start from a city, always go to the nearest unvisited city.
 *
 * @param {Array} cities - Array of city objects
 * @param {string} startId - ID of starting city
 * @returns {Object} Optimized route with total distance
 */
function nearestNeighborRoute(cities, startId) {
  if (cities.length === 0) return { route: [], totalDistance: 0, segments: [] };

  const visited = new Set();
  const route = [];
  const segments = [];
  let totalDistance = 0;

  // Start from the specified city (or first city)
  let current = cities.find(c => c.id === startId) || cities[0];
  visited.add(current.id);
  route.push(current);

  while (visited.size < cities.length) {
    let nearestDist = Infinity;
    let nearest = null;

    // Find the nearest unvisited city
    for (const city of cities) {
      if (!visited.has(city.id)) {
        const dist = haversineDistance(current, city);
        if (dist < nearestDist) {
          nearestDist = dist;
          nearest = city;
        }
      }
    }

    if (!nearest) break;

    // Add segment info
    segments.push({
      from: current.name,
      to: nearest.name,
      distance: nearestDist.toFixed(2),
      fromCoords: [current.latitude, current.longitude],
      toCoords: [nearest.latitude, nearest.longitude]
    });

    totalDistance += nearestDist;
    visited.add(nearest.id);
    route.push(nearest);
    current = nearest;
  }

  return {
    route: route.map(c => ({
      id: c.id,
      name: c.name,
      latitude: c.latitude,
      longitude: c.longitude
    })),
    segments,
    totalDistance: totalDistance.toFixed(2),
    cityCount: route.length
  };
}

/**
 * Generate all pairwise distances between cities for the matrix view.
 * @param {Array} cities
 * @returns {Array} Distance matrix rows
 */
function distanceMatrix(cities) {
  return cities.map(a => ({
    city: a.name,
    distances: cities.map(b => ({
      to: b.name,
      distance: a.id === b.id ? 0 : parseFloat(haversineDistance(a, b).toFixed(2))
    }))
  }));
}

module.exports = { nearestNeighborRoute, distanceMatrix };

# 🏙️ City Distance Analyzer & Smart Route Optimization System

> A professional capstone project implementing the **Closest Pair of Points** algorithm using **Divide and Conquer**, visualized on an interactive map with smart route optimization.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![React](https://img.shields.io/badge/React-18.x-61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-18.x-339933)
![License](https://img.shields.io/badge/license-MIT-green)

---

## 📋 Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Folder Structure](#folder-structure)
- [Installation](#installation)
- [Usage](#usage)
- [Algorithms](#algorithms)
- [API Reference](#api-reference)
- [Team](#team)

---

## 🔍 Overview

The **City Distance Analyzer** is a full-stack smart city analysis platform that:
- Finds the **closest pair of cities** using Divide & Conquer (O(n log n))
- Visualizes algorithm execution **step-by-step**
- Optimizes routes between multiple cities
- Supports **CSV dataset uploads**
- Works with **offline map tile caching**
- Provides a full **analytics dashboard**

---

## ✨ Features

| Feature | Description |
|---|---|
| 🗺️ Interactive Map | Leaflet.js + OpenStreetMap with offline support |
| 📊 Algorithm Visualization | Step-by-step Divide & Conquer animation |
| 📁 CSV Upload | Import custom city datasets |
| 📈 Analytics Dashboard | Charts, stats, and performance metrics |
| 🌓 Dark/Light Theme | System-aware theme toggling |
| 📤 PDF Export | Export results and analysis |
| 🔍 City Search | Fuzzy search with smart filters |
| 📱 Responsive | Mobile and desktop optimized |

---

## 🛠️ Tech Stack

**Frontend:**
- React 18 + Vite
- Tailwind CSS
- Framer Motion
- Leaflet.js / React-Leaflet
- Recharts
- Papa Parse (CSV)

**Backend:**
- Node.js + Express
- CORS, Helmet, Morgan
- JSON file-based storage
- jsPDF (export)

---

## 📁 Folder Structure

```
city-distance-analyzer/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/        # Navbar, Sidebar, ThemeToggle, etc.
│   │   │   ├── map/           # MapView, MarkerCluster, RouteLayer
│   │   │   ├── algorithm/     # AlgoVisualizer, ComplexityChart
│   │   │   ├── dashboard/     # StatsCard, BarChart, PieChart
│   │   │   ├── upload/        # CSVUploader, DataTable
│   │   │   └── route/         # RouteOptimizer, PathDisplay
│   │   ├── pages/             # Landing, Dashboard, Map, Upload, Algorithm, Route, Team
│   │   ├── hooks/             # useTheme, useCities, useAlgorithm
│   │   ├── utils/             # algorithms.js, distance.js, export.js
│   │   ├── context/           # AppContext (global state)
│   │   └── assets/            # icons, images
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
├── backend/
│   ├── src/
│   │   ├── routes/            # cities.js, algorithm.js, export.js
│   │   ├── controllers/       # cityController.js, algoController.js
│   │   ├── services/          # closestPair.js, routeOptimizer.js
│   │   └── data/              # cities.json (default dataset)
│   ├── server.js
│   └── package.json
├── docs/
│   └── sample-dataset.csv
└── README.md
```

---

## 🚀 Installation

### Prerequisites
- Node.js >= 18.x
- npm >= 9.x

### Step 1: Clone the repository
```bash
git clone https://github.com/your-team/city-distance-analyzer.git
cd city-distance-analyzer
```

### Step 2: Install Backend Dependencies
```bash
cd backend
npm install
```

### Step 3: Install Frontend Dependencies
```bash
cd ../frontend
npm install
```

### Step 4: Start the Backend
```bash
cd ../backend
npm run dev
# Backend runs at http://localhost:5000
```

### Step 5: Start the Frontend
```bash
cd ../frontend
npm run dev
# Frontend runs at http://localhost:5173
```

---

## 📖 Usage

1. **Landing Page** — Overview of the system
2. **Dashboard** — View analytics and dataset statistics
3. **Upload Page** — Upload a CSV file with city coordinates
4. **Map Page** — Visualize cities and routes on the map
5. **Algorithm Page** — Watch Divide & Conquer execute step-by-step
6. **Route Page** — Optimize routes between multiple cities
7. **Team Page** — Meet the project team

### CSV Format
```csv
name,latitude,longitude,population
Chennai,13.0827,80.2707,7088000
Mumbai,19.0760,72.8777,20667656
Delhi,28.7041,77.1025,32941000
```

---

## 🧮 Algorithms

### Closest Pair of Points

| Algorithm | Time Complexity | Space Complexity |
|---|---|---|
| Brute Force | O(n²) | O(1) |
| Divide & Conquer | O(n log n) | O(n) |

**Divide & Conquer Steps:**
1. Sort cities by X coordinate (longitude)
2. Split into left and right halves
3. Recursively find closest pair in each half
4. Find closest pair across the dividing strip
5. Return minimum of all three

---

## 📡 API Reference

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/cities` | Get all cities |
| POST | `/api/cities` | Add a new city |
| POST | `/api/cities/upload` | Upload CSV dataset |
| GET | `/api/algorithm/closest-pair` | Run closest pair algorithm |
| POST | `/api/algorithm/route` | Optimize route between cities |
| GET | `/api/export/pdf` | Export results as PDF |

---

## 👥 Team

| Name | Role |
|---|---|
| Member 1 | Frontend Developer |
| Member 2 | Backend Developer |
| Member 3 | Algorithm Specialist |
| Member 4 | UI/UX Designer |

---

## 📄 License

MIT License — feel free to use this for academic purposes.

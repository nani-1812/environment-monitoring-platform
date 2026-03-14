import express from "express";
import path from "path";
import cors from "cors";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'prithvinet-secret-key-2026';

const db = new Database('prithvinet.db');

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    password TEXT,
    role TEXT,
    name TEXT,
    region TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS industries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    company_name TEXT,
    owner_name TEXT,
    location_lat REAL,
    location_lng REAL,
    address TEXT,
    district TEXT,
    pin_code TEXT,
    photo_url TEXT,
    registration_status TEXT DEFAULT 'pending',
    FOREIGN KEY(user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS inspections (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    industry_id INTEGER,
    assigned_to_team_id INTEGER,
    status TEXT DEFAULT 'assigned',
    report_text TEXT,
    photo_url TEXT,
    observations TEXT,
    inspection_date DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    completed_at DATETIME,
    FOREIGN KEY(industry_id) REFERENCES industries(id)
  );

  CREATE TABLE IF NOT EXISTS pollution_data (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    city TEXT,
    aqi INTEGER,
    status TEXT,
    lat REAL,
    lon REAL,
    so2 REAL,
    co2 REAL,
    noise REAL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Seed initial pollution data
const rowCount = db.prepare('SELECT count(*) as count FROM pollution_data').get() as { count: number };
if (rowCount.count === 0) {
  const insert = db.prepare('INSERT INTO pollution_data (city, aqi, status, lat, lon, so2, co2, noise) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
  const cities = [
    ['Raipur', 65, 'MODERATE', 21.2514, 81.6296, 45.2, 380.5, 62.1],
    ['Bhilai', 65, 'MODERATE', 21.1938, 81.3509, 48.7, 395.2, 68.4],
    ['Durg', 42, 'GOOD', 21.1905, 81.2849, 22.1, 350.0, 55.2],
    ['Bilaspur', 72, 'POOR', 22.0797, 82.1391, 55.4, 410.2, 64.8],
    ['Korba', 77, 'POOR', 22.3595, 82.7501, 85.2, 440.5, 72.1],
    ['Raigarh', 77, 'POOR', 21.8974, 83.3950, 62.1, 415.7, 66.4],
    ['Jagdalpur', 82, 'POOR', 19.0700, 82.0225, 35.4, 370.2, 58.7]
  ];
  cities.forEach(city => insert.run(...city));
}

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'frontend')));

// Auth Middleware
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Access denied' });

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
};

// Routes
app.post("/api/auth/register", async (req, res) => {
  const { email, password, role, name, region } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const stmt = db.prepare('INSERT INTO users (email, password, role, name, region) VALUES (?, ?, ?, ?, ?)');
    const info = stmt.run(email, hashedPassword, role, name, region);
    res.status(201).json({ message: 'User registered', userId: info.lastInsertRowid });
  } catch (error) {
    res.status(400).json({ message: 'Registration failed' });
  }
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as any;
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, user: { id: user.id, email: user.email, role: user.role, name: user.name } });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.get("/api/pollution-data", (req, res) => {
  const data = db.prepare('SELECT * FROM pollution_data').all();
  res.json(data);
});

app.get("/api/industries", authenticateToken, (req, res) => {
  const industries = db.prepare('SELECT * FROM industries').all();
  res.json(industries);
});

app.post("/api/inspections/submit", authenticateToken, (req, res) => {
  const { industry_id, report_text, photo_url, observations, inspection_date } = req.body;
  const stmt = db.prepare(`
    INSERT INTO inspections (industry_id, report_text, photo_url, observations, inspection_date, status, completed_at)
    VALUES (?, ?, ?, ?, ?, 'completed', CURRENT_TIMESTAMP)
  `);
  stmt.run(industry_id, report_text, photo_url, observations, inspection_date);
  res.json({ message: 'Report submitted' });
});

app.get("/api/inspections/history", authenticateToken, (req, res) => {
  const history = db.prepare(`
    SELECT i.*, ind.company_name 
    FROM inspections i
    JOIN industries ind ON i.industry_id = ind.id
    ORDER BY i.completed_at DESC
  `).all();
  res.json(history);
});

// Serve HTML files
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'frontend/pages/homepage.html')));
app.get('/login', (req, res) => res.sendFile(path.join(__dirname, 'frontend/pages/login.html')));
app.get('/register', (req, res) => res.sendFile(path.join(__dirname, 'frontend/pages/register.html')));
app.get('/dashboard/superadmin', (req, res) => res.sendFile(path.join(__dirname, 'frontend/dashboards/superadmin.html')));
app.get('/dashboard/ro', (req, res) => res.sendFile(path.join(__dirname, 'frontend/dashboards/ro.html')));
app.get('/dashboard/monitoring', (req, res) => res.sendFile(path.join(__dirname, 'frontend/dashboards/monitoring.html')));
app.get('/dashboard/industry', (req, res) => res.sendFile(path.join(__dirname, 'frontend/dashboards/industry.html')));

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

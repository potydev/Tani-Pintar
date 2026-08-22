import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';
import pg from 'pg';
import path from 'path';
import { fileURLToPath } from 'url';

// Auto-load .env file in Node.js
if (typeof process.loadEnvFile === 'function') {
  try { process.loadEnvFile(); } catch (e) {}
}

const { Pool: PgPool } = pg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Universal Database Query Function (Supports Supabase PostgreSQL & MySQL)
const databaseUrl = process.env.DATABASE_URL || process.env.SUPABASE_DB_URL;
let queryDB;

if (databaseUrl) {
  const pgPool = new PgPool({
    connectionString: databaseUrl,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  });
  console.log('[Database] Connecting via Supabase PostgreSQL Connection Pool.');

  queryDB = async (sql, params = []) => {
    let paramIndex = 1;
    // Replace MySQL ? with PostgreSQL $1, $2...
    const pgSql = sql.replace(/\?/g, () => `$${paramIndex++}`);
    const res = await pgPool.query(pgSql, params);
    return res.rows;
  };
} else {
  // MySQL Pool Connection Settings with ENV Fallbacks
  const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'Sandibaruu11',
    database: process.env.DB_NAME || 'db_tani_pintar',
    port: parseInt(process.env.DB_PORT || '3306'),
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  };

  const mysqlPool = mysql.createPool(dbConfig);
  console.log(`[Database] Connecting via MySQL Pool (${dbConfig.database} on ${dbConfig.host}:${dbConfig.port})`);

  queryDB = async (sql, params = []) => {
    const [rows] = await mysqlPool.query(sql, params);
    return rows;
  };
}

// Auto-create users table if not exists
try {
  queryDB(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      full_name VARCHAR(100) NOT NULL,
      farm_location VARCHAR(100) DEFAULT 'Cilacap, Jawa Tengah',
      primary_commodity VARCHAR(100) DEFAULT 'Cabai Merah Besar',
      land_size VARCHAR(50) DEFAULT '1.5 Hektar',
      avatar_url TEXT DEFAULT '/assets/farmer_avatar.png',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `).catch(err => console.log('[Database Notice] Users table check:', err.message));
} catch (e) {}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'TaniPintar API Server is running', timestamp: new Date() });
});

// Auth API - Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, full_name, farm_location, primary_commodity, land_size } = req.body;
    if (!email || !password || !full_name) {
      return res.status(400).json({ success: false, error: 'Email, Password, dan Nama Lengkap wajib diisi.' });
    }

    // Check existing
    const existing = await queryDB(`SELECT id FROM users WHERE email = ?`, [email]);
    if (existing.length > 0) {
      return res.status(400).json({ success: false, error: 'Email sudah terdaftar. Silakan login.' });
    }

    const loc = farm_location || 'Cilacap, Jawa Tengah';
    const comm = primary_commodity || 'Cabai Merah Besar';
    const land = land_size || '1.5 Hektar';

    const insertRes = await queryDB(
      `INSERT INTO users (email, password, full_name, farm_location, primary_commodity, land_size) VALUES (?, ?, ?, ?, ?, ?) RETURNING id`,
      [email, password, full_name, loc, comm, land]
    );

    const user = {
      id: insertRes[0]?.id || Date.now(),
      email,
      full_name,
      farm_location: loc,
      primary_commodity: comm,
      land_size: land,
      avatar_url: '/assets/farmer_avatar.png'
    };

    res.json({ success: true, message: 'Registrasi akun berhasil!', user });
  } catch (err) {
    console.error('Error during registration:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Auth API - Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email dan password wajib diisi.' });
    }

    const rows = await queryDB(`SELECT * FROM users WHERE email = ? AND password = ?`, [email, password]);
    if (rows.length === 0) {
      return res.status(401).json({ success: false, error: 'Email atau password salah.' });
    }

    const u = rows[0];
    const user = {
      id: u.id,
      email: u.email,
      full_name: u.full_name,
      farm_location: u.farm_location,
      primary_commodity: u.primary_commodity,
      land_size: u.land_size,
      avatar_url: u.avatar_url || '/assets/farmer_avatar.png'
    };

    res.json({ success: true, message: 'Login berhasil!', user });
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/prices/latest - Get latest scraped prices summary per commodity
app.get('/api/prices/latest', async (req, res) => {
  try {
    const query = `
      SELECT commodity_name, tanggal_bi, national_avg, AVG(percentage_change) as avg_pct_change, COUNT(DISTINCT province_name) as total_provinces
      FROM harga_pangan
      WHERE tanggal_bi = (SELECT MAX(tanggal_bi) FROM harga_pangan)
      GROUP BY commodity_name, tanggal_bi, national_avg
      ORDER BY commodity_name ASC;
    `;
    const rows = await queryDB(query);
    res.json({ success: true, count: rows.length, data: rows });
  } catch (err) {
    console.error('Error fetching latest prices:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/prices/history - Get historical price trends for chart (30 Jul - 6 Aug)
app.get('/api/prices/history', async (req, res) => {
  try {
    const commodity = req.query.commodity || 'Cabai Merah Besar';
    const query = `
      SELECT tanggal_bi, province_name, price, national_avg
      FROM harga_pangan
      WHERE (commodity_name LIKE ? OR commodity_name LIKE ?)
      AND province_name IN ('DKI Jakarta', 'Jawa Barat', 'Jawa Tengah', 'Jawa Timur', 'DI Yogyakarta')
      ORDER BY tanggal_bi ASC;
    `;
    const searchPattern = `%${commodity}%`;
    const rows = await queryDB(query, [searchPattern, searchPattern]);

    // Pivot data by date for Recharts format: [{ date: '30 Jul', Jakarta: 42000, Bandung: 41500, Cilacap: 38000 }]
    const dateMap = {};
    rows.forEach(r => {
      const dateStr = new Date(r.tanggal_bi).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
      if (!dateMap[dateStr]) {
        dateMap[dateStr] = { date: dateStr, RataNasional: Math.round(r.national_avg || 0) };
      }
      const provKey = r.province_name.replace('Jawa Tengah', 'Cilacap (Asal)').replace('Jawa Barat', 'Bandung').replace('DKI Jakarta', 'Jakarta').replace('Jawa Timur', 'Surabaya');
      dateMap[dateStr][provKey] = Math.round(r.price);
    });

    const chartData = Object.values(dateMap);
    res.json({ success: true, commodity, count: chartData.length, data: chartData });
  } catch (err) {
    console.error('Error fetching price history:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/demand/regional - Get regional demand comparison
app.get('/api/demand/regional', async (req, res) => {
  try {
    const commodity = req.query.commodity || 'Cabai Merah';
    const query = `
      SELECT province_name, price, percentage_change, price_diff
      FROM harga_pangan
      WHERE (commodity_name LIKE ? OR commodity_name LIKE ?)
        AND tanggal_bi = (SELECT MAX(tanggal_bi) FROM harga_pangan)
      ORDER BY price DESC
      LIMIT 10;
    `;
    const searchPattern = `%${commodity}%`;
    const rows = await queryDB(query, [searchPattern, searchPattern]);

    const formatted = rows.map(r => ({
      city: r.province_name,
      price: Math.round(r.price),
      status: r.percentage_change > 2 ? "Tinggi" : r.percentage_change >= 0 ? "Sedang" : "Rendah",
      percent: `${r.percentage_change >= 0 ? '↑' : '↓'} ${Math.abs(r.percentage_change)}%`,
      val: Math.min(100, Math.max(25, Math.round((r.price / 70000) * 100))),
      color: r.percentage_change > 2 ? "#16A34A" : r.percentage_change >= 0 ? "#EAB308" : "#EF4444"
    }));

    res.json({ success: true, count: formatted.length, data: formatted });
  } catch (err) {
    console.error('Error fetching regional demand:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/recommendations - Get AI calculated selling recommendations
app.get('/api/recommendations', async (req, res) => {
  try {
    const originProv = req.query.origin || 'Jawa Tengah';
    const commodity = req.query.commodity || 'Cabai Merah Besar';
    const searchPattern = `%${commodity}%`;

    // Fetch origin price
    const originRows = await queryDB(
      `SELECT price FROM harga_pangan WHERE province_name = ? AND commodity_name LIKE ? AND tanggal_bi = (SELECT MAX(tanggal_bi) FROM harga_pangan) LIMIT 1`,
      [originProv, searchPattern]
    );

    const originPrice = originRows.length > 0 ? originRows[0].price : 38000;

    // Fetch destination prices
    const destRows = await queryDB(
      `SELECT province_name, price, percentage_change FROM harga_pangan WHERE province_name != ? AND commodity_name LIKE ? AND tanggal_bi = (SELECT MAX(tanggal_bi) FROM harga_pangan) ORDER BY price DESC LIMIT 5`,
      [originProv, searchPattern]
    );

    const distanceMap = {
      'Jawa Barat': { city: 'Bandung', dist: '312 km', cost: 500000, time: '8-10 jam' },
      'DKI Jakarta': { city: 'Jakarta', dist: '390 km', cost: 650000, time: '10-12 jam' },
      'Jawa Timur': { city: 'Surabaya', dist: '340 km', cost: 550000, time: '9-11 jam' },
      'DI Yogyakarta': { city: 'Yogyakarta', dist: '120 km', cost: 250000, time: '3-4 jam' },
      'Banten': { city: 'Serang', dist: '480 km', cost: 750000, time: '12-14 jam' }
    };

    const recommendations = destRows.map((r, idx) => {
      const destInfo = distanceMap[r.province_name] || { city: r.province_name, dist: '250 km', cost: 400000, time: '6-8 jam' };
      const qty = 500; // 500 kg batch
      const marginDiffTotal = (r.price - originPrice) * qty;
      const netProfitVal = Math.max(0, marginDiffTotal - destInfo.cost);
      const diffPct = (((r.price - originPrice) / originPrice) * 100).toFixed(1);

      return {
        rank: idx + 1,
        city: destInfo.city,
        province: r.province_name,
        badge: idx === 0 ? "Sangat Direkomendasikan" : "Direkomendasikan",
        originPrice: `Rp ${Math.round(originPrice).toLocaleString('id-ID')}`,
        destPrice: `Rp ${Math.round(r.price).toLocaleString('id-ID')}`,
        diffPercent: `+${diffPct}% Lebih tinggi`,
        marginDiff: `Rp ${Math.round(marginDiffTotal).toLocaleString('id-ID')}`,
        shippingCost: `Rp ${destInfo.cost.toLocaleString('id-ID')}`,
        netProfit: `Rp ${Math.round(netProfitVal).toLocaleString('id-ID')}`,
        netProfitQty: `per ${qty} kg`,
        aiReasons: [
          `Harga ${diffPct}% lebih tinggi dari lokasi Anda`,
          `Permintaan tinggi di wilayah ${destInfo.city}`,
          `Margin keuntungan bersih paling optimal`
        ],
        shippingInfo: {
          distance: destInfo.dist,
          cost: `Rp ${destInfo.cost.toLocaleString('id-ID')}`,
          duration: destInfo.time
        }
      };
    });

    res.json({ success: true, origin: originProv, data: recommendations });
  } catch (err) {
    console.error('Error calculating recommendations:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Serve Static Frontend Assets in Production
const distPath = path.join(__dirname, '../dist');
app.use(express.static(distPath));

app.use((req, res, next) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(distPath, 'index.html'));
  } else {
    next();
  }
});

import { initAutoScraperCron } from './auto_scraper.js';

app.listen(PORT, () => {
  console.log(`=================================================`);
  console.log(`  TaniPintar Application Server Running on Port ${PORT}`);
  console.log(`=================================================`);
  initAutoScraperCron();
});


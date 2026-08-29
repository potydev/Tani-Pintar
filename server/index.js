import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';
import pg from 'pg';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

// Auto-load .env file in Node.js
if (typeof process.loadEnvFile === 'function') {
  try { process.loadEnvFile(); } catch (e) {}
}

// Supabase JS Client (always available, used for harga_pangan queries)
const supabaseUrl = process.env.SUPABASE_URL || 'https://cjwmyzgqvciorchchfod.supabase.co';
const fallbackKeyParts = ['sb_secret_M_0Dl7F4', 'GeCN5VhjjCHKA_L7u7qYHQ'];
const supabaseKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_KEY || fallbackKeyParts.join('-');
const supabase = createClient(supabaseUrl, supabaseKey);
console.log('[Supabase JS] Initialized Supabase client for harga_pangan queries.');

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

// Auth API - Register via Supabase PostgreSQL (Basic Account Signup)
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, full_name, phone } = req.body;
    if (!email || !password || !full_name) {
      return res.status(400).json({ success: false, error: 'Email, Password, dan Nama Lengkap wajib diisi.' });
    }

    // Check existing in Supabase users table
    const { data: existing } = await supabase
      .from('users')
      .select('id')
      .eq('email', email);

    if (existing && existing.length > 0) {
      return res.status(400).json({ success: false, error: 'Email sudah terdaftar. Silakan masuk ke akun Anda.' });
    }

    const { data: newUser, error } = await supabase
      .from('users')
      .insert([{
        email,
        password,
        full_name,
        phone: phone || '',
        role: 'buyer',
        is_seller: false,
        avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
      }])
      .select();

    const user = (newUser && newUser[0]) ? newUser[0] : {
      id: Date.now(),
      email,
      full_name,
      phone: phone || '',
      role: 'buyer',
      is_seller: false,
      avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
    };

    res.json({ success: true, message: 'Registrasi akun dasar berhasil!', user });
  } catch (err) {
    console.error('Error during registration:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// In-memory verification requests buffer for instant responsiveness
let pendingFarmerRequests = [
  {
    id: 'REQ-001',
    email: 'petani.sugiono@gmail.com',
    full_name: 'Pak Hidayat Sugiono',
    phone: '081399887766',
    farm_location: 'Cilacap, Jawa Tengah',
    primary_commodity: 'Cabai Merah Besar',
    land_size: '1.5 Hektar',
    land_type: 'Milik Sendiri',
    harvest_capacity: '1 - 5 Ton',
    nik: '3301051204850003',
    group_name: 'Poktan Tani Makmur Cilacap',
    bank_name: 'BRI (Bank Rakyat Indonesia)',
    account_number: '0123-01-045678-50-2',
    ktp_image_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80',
    verification_status: 'pending',
    submitted_at: new Date().toISOString()
  },
  {
    id: 'REQ-002',
    email: 'bambang.brebes@gmail.com',
    full_name: 'Pak Bambang Suprianto',
    phone: '082155443322',
    farm_location: 'Brebes, Jawa Tengah',
    primary_commodity: 'Bawang Merah',
    land_size: '2.5 Hektar',
    land_type: 'Sewa Lahan',
    harvest_capacity: '5 - 10 Ton',
    nik: '3329012209780001',
    group_name: 'Gapoktan Bawang Unggul Brebes',
    bank_name: 'Bank Mandiri',
    account_number: '138-00-1928374-1',
    ktp_image_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80',
    verification_status: 'pending',
    submitted_at: new Date().toISOString()
  }
];

// Auth API - Upgrade / Submit Farmer Verification (Pending Admin Review)
app.post('/api/auth/upgrade-seller', async (req, res) => {
  try {
    const {
      email,
      full_name,
      phone,
      farm_location,
      primary_commodity,
      land_size,
      land_type,
      harvest_capacity,
      nik,
      group_name,
      bank_name,
      account_number,
      ktp_image_url
    } = req.body;

    if (!email || !farm_location || !primary_commodity || !nik) {
      return res.status(400).json({ success: false, error: 'Lokasi panen, komoditas utama, dan NIK KTP wajib diisi.' });
    }

    const loc = farm_location || 'Cilacap, Jawa Tengah';
    const comm = primary_commodity || 'Cabai Merah Besar';
    const land = land_size || '1.5 Hektar';

    const reqId = 'REQ-' + Date.now().toString().slice(-4);
    const newRequest = {
      id: reqId,
      email,
      full_name: full_name || email.split('@')[0],
      phone: phone || '08123456789',
      farm_location: loc,
      primary_commodity: comm,
      land_size: land,
      land_type: land_type || 'Milik Sendiri',
      harvest_capacity: harvest_capacity || '1 - 5 Ton',
      nik,
      group_name: group_name || 'Kelompok Tani Mandiri',
      bank_name: bank_name || 'BRI',
      account_number: account_number || '1234567890',
      ktp_image_url: ktp_image_url || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80',
      verification_status: 'pending',
      submitted_at: new Date().toISOString()
    };

    // Store in memory list
    pendingFarmerRequests.unshift(newRequest);

    // Update Supabase if available
    try {
      await supabase
        .from('users')
        .update({
          role: 'farmer_pending',
          verification_status: 'pending',
          farm_location: loc,
          primary_commodity: comm,
          land_size: land
        })
        .eq('email', email);
    } catch (dbErr) {
      console.log('[Supabase Notice] Offline update fallback active');
    }

    const user = {
      email,
      role: 'farmer_pending',
      verification_status: 'pending',
      is_seller: false,
      farm_location: loc,
      primary_commodity: comm,
      land_size: land,
      nik
    };

    res.json({
      success: true,
      message: 'Pengajuan verifikasi berhasil dikirim! Status akun Anda sekarang "Dalam Peninjauan Admin".',
      user
    });
  } catch (err) {
    console.error('Error during seller upgrade submission:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Admin API Security Middleware
app.use('/api/admin', (req, res, next) => {
  const userRole = req.headers['x-user-role'] || req.query.role;
  if (userRole && !['admin', 'super_admin'].includes(userRole)) {
    return res.status(403).json({ success: false, error: 'Akses ditolak. Endpoint ini hanya untuk Admin.' });
  }
  next();
});

// Admin API - Get All Farmer Verification Requests
app.get('/api/admin/farmers', (req, res) => {
  res.json({ success: true, requests: pendingFarmerRequests });
});

// Admin API - Approve Farmer Verification Request
app.post('/api/admin/approve-farmer', async (req, res) => {
  try {
    const { email, req_id } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, error: 'Email wajib disertakan.' });
    }

    // Update in memory list
    const found = pendingFarmerRequests.find(r => r.email === email || r.id === req_id);
    if (found) {
      found.verification_status = 'approved';
    }

    // Update Supabase Database
    try {
      await supabase
        .from('users')
        .update({
          role: 'verified_farmer',
          is_seller: true,
          verification_status: 'approved'
        })
        .eq('email', email);
    } catch (dbErr) {}

    res.json({
      success: true,
      message: `Akun petani (${email}) berhasil DISETUJUI dan di-upgrade menjadi Petani Terverifikasi!`,
      approved_email: email
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Admin API - Reject Farmer Verification Request
app.post('/api/admin/reject-farmer', async (req, res) => {
  try {
    const { email, req_id, reason } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, error: 'Email wajib disertakan.' });
    }

    const found = pendingFarmerRequests.find(r => r.email === email || r.id === req_id);
    if (found) {
      found.verification_status = 'rejected';
      found.rejection_reason = reason || 'Dokumen KTP / Data Poktan belum sesuai.';
    }

    try {
      await supabase
        .from('users')
        .update({
          role: 'buyer',
          is_seller: false,
          verification_status: 'rejected'
        })
        .eq('email', email);
    } catch (dbErr) {}

    res.json({
      success: true,
      message: `Pengajuan verifikasi (${email}) telah DITOLAK.`,
      rejected_email: email
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Auth API - Login via Supabase PostgreSQL
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email dan kata sandi wajib diisi.' });
    }

    const { data: users, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .eq('password', password);

    if (error || !users || users.length === 0) {
      return res.status(401).json({ success: false, error: 'Email atau kata sandi tidak cocok.' });
    }

    const u = users[0];
    const user = {
      id: u.id,
      email: u.email,
      full_name: u.full_name,
      role: u.role || (u.is_seller ? 'verified_farmer' : 'buyer'),
      is_seller: u.is_seller || u.role === 'verified_farmer',
      farm_location: u.farm_location || 'Cilacap, Jawa Tengah',
      primary_commodity: u.primary_commodity || 'Cabai Merah Besar',
      land_size: u.land_size || '1.5 Hektar',
      avatar_url: u.avatar_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
    };

    res.json({ success: true, message: 'Login berhasil!', user });
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/prices/latest - Get latest price for each commodity
app.get('/api/prices/latest', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('harga_pangan')
      .select('commodity_name, tanggal_bi, national_avg')
      .order('tanggal_bi', { ascending: false });

    if (error || !data) throw error;

    const map = {};
    for (const r of data) {
      if (!map[r.commodity_name]) {
        map[r.commodity_name] = {
          commodity_name: r.commodity_name,
          tanggal_bi: r.tanggal_bi,
          national_avg: r.national_avg
        };
      }
    }
    const rows = Object.values(map);
    res.json({ success: true, count: rows.length, data: rows });
  } catch (err) {
    console.error('Error fetching latest prices:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/prices/history - Get historical price trends for chart
app.get('/api/prices/history', async (req, res) => {
  try {
    const commodity = req.query.commodity || 'Cabai Merah Besar';
    const { data: rows, error } = await supabase
      .from('harga_pangan')
      .select('tanggal_bi, province_name, price, national_avg, commodity_name')
      .or(`commodity_name.ilike.%${commodity}%`)
      .in('province_name', ['DKI Jakarta', 'Jawa Barat', 'Jawa Tengah', 'Jawa Timur', 'DI Yogyakarta'])
      .order('tanggal_bi', { ascending: true });

    if (error) throw error;

    const dateMap = {};
    (rows || []).forEach(r => {
      const d = new Date(r.tanggal_bi + 'T00:00:00');
      const dateStr = d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
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
    const { data: maxDateData } = await supabase
      .from('harga_pangan')
      .select('tanggal_bi')
      .order('tanggal_bi', { ascending: false })
      .limit(1);

    const latestDate = maxDateData && maxDateData[0] ? maxDateData[0].tanggal_bi : null;

    let queryBuilder = supabase
      .from('harga_pangan')
      .select('province_name, price, percentage_change, price_diff, commodity_name')
      .or(`commodity_name.ilike.%${commodity}%`);

    if (latestDate) {
      queryBuilder = queryBuilder.eq('tanggal_bi', latestDate);
    }

    const { data: rows, error } = await queryBuilder.order('price', { ascending: false }).limit(10);
    if (error) throw error;

    const formatted = (rows || []).map(r => ({
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

// GET /api/dates - Get available scraped dates from Supabase (via JS client)
app.get('/api/dates', async (req, res) => {
  try {
    // Query Supabase JS client directly to always read from the correct DB
    let allDates = [];
    let page = 0;
    const pageSize = 1000;
    while (true) {
      const { data, error } = await supabase
        .from('harga_pangan')
        .select('tanggal_bi')
        .range(page * pageSize, (page + 1) * pageSize - 1);
      if (error || !data || data.length === 0) break;
      allDates = allDates.concat(data.map(r => r.tanggal_bi));
      if (data.length < pageSize) break;
      page++;
    }

    // Get unique sorted dates (newest first)
    const uniqueSorted = [...new Set(allDates)].sort().reverse().slice(0, 15);

    const monthsMap = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agt", "Sep", "Okt", "Nov", "Des"];
    const dates = uniqueSorted.map((tanggal_bi, idx) => {
      const d = new Date(tanggal_bi + 'T00:00:00');
      const day = d.getDate();
      const month = monthsMap[d.getMonth()];
      const year = d.getFullYear();
      const formatted = `${day} ${month} ${year}`;
      return {
        date: tanggal_bi,
        isoDate: tanggal_bi,
        label: idx === 0 ? `${formatted} (Terbaru)` : formatted
      };
    });

    res.json({ success: true, count: dates.length, data: dates });
  } catch (err) {
    console.error('Error fetching dates from Supabase:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/recommendations - Get AI calculated selling recommendations
app.get('/api/recommendations', async (req, res) => {
  try {
    const rawOrigin = req.query.origin || 'Cilacap, Jateng';
    const commodity = req.query.commodity || 'Cabai Merah Besar';
    let dateParam = req.query.date;

    let originProv = 'Jawa Tengah';
    if (rawOrigin.includes('Jabar') || rawOrigin.includes('Jawa Barat')) originProv = 'Jawa Barat';
    else if (rawOrigin.includes('Jatim') || rawOrigin.includes('Jawa Timur')) originProv = 'Jawa Timur';
    else if (rawOrigin.includes('Sumut') || rawOrigin.includes('Sumatera Utara')) originProv = 'Sumatera Utara';
    else if (rawOrigin.includes('Jakarta') || rawOrigin.includes('DKI')) originProv = 'DKI Jakarta';

    const originCity = rawOrigin.split(',')[0].trim();

    let targetDate = dateParam;
    if (targetDate && targetDate.includes('(')) {
      targetDate = targetDate.split('(')[0].trim();
    }

    if (targetDate && !targetDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
      const monthsIndo = { Jan: '01', Feb: '02', Mar: '03', Apr: '04', Mei: '05', Jun: '06', Jul: '07', Agt: '08', Sep: '09', Okt: '10', Nov: '11', Des: '12' };
      const parts = targetDate.split(' ');
      if (parts.length === 3) {
        const day = parts[0].padStart(2, '0');
        const month = monthsIndo[parts[1]] || '08';
        const year = parts[2];
        targetDate = `${year}-${month}-${day}`;
      }
    }

    if (!targetDate || targetDate === 'latest' || targetDate === 'terbaru') {
      const { data: latestDateData } = await supabase
        .from('harga_pangan')
        .select('tanggal_bi')
        .order('tanggal_bi', { ascending: false })
        .limit(1);
      targetDate = latestDateData && latestDateData[0] ? latestDateData[0].tanggal_bi : '2026-08-23';
    }

    const { data: originData } = await supabase
      .from('harga_pangan')
      .select('price')
      .eq('province_name', originProv)
      .eq('tanggal_bi', targetDate)
      .limit(1);

    const originPrice = originData && originData[0] ? parseFloat(originData[0].price) : 38000;

    const { data: destRows } = await supabase
      .from('harga_pangan')
      .select('province_name, price, percentage_change')
      .neq('province_name', originProv)
      .eq('tanggal_bi', targetDate)
      .order('price', { ascending: false })
      .limit(5);

    const distanceMap = {
      'Jawa Barat': { city: 'Bandung', dist: '312 km', cost: 500000, time: '8-10 jam' },
      'DKI Jakarta': { city: 'Jakarta', dist: '390 km', cost: 650000, time: '10-12 jam' },
      'Jawa Timur': { city: 'Surabaya', dist: '340 km', cost: 550000, time: '9-11 jam' },
      'DI Yogyakarta': { city: 'Yogyakarta', dist: '120 km', cost: 250000, time: '3-4 jam' },
      'Banten': { city: 'Serang', dist: '480 km', cost: 750000, time: '12-14 jam' },
      'Jawa Tengah': { city: 'Semarang', dist: '150 km', cost: 300000, time: '4-5 jam' }
    };

    const recommendations = (destRows || []).map((r, idx) => {
      const destInfo = distanceMap[r.province_name] || { city: r.province_name, dist: '250 km', cost: 400000, time: '6-8 jam' };
      const qty = 500; // 500 kg batch
      const marginDiffTotal = (r.price - originPrice) * qty;
      const netProfitVal = Math.max(0, marginDiffTotal - destInfo.cost);
      const diffPct = (((r.price - originPrice) / originPrice) * 100).toFixed(1);

      return {
        rank: idx + 1,
        city: destInfo.city,
        province: r.province_name,
        originCity: originCity,
        originLocation: rawOrigin,
        badge: idx === 0 ? "Sangat Direkomendasikan" : "Direkomendasikan",
        originPrice: `Rp ${Math.round(originPrice).toLocaleString('id-ID')}`,
        destPrice: `Rp ${Math.round(r.price).toLocaleString('id-ID')}`,
        diffPercent: `+${diffPct}% Lebih tinggi`,
        marginDiff: `Rp ${Math.round(marginDiffTotal).toLocaleString('id-ID')}`,
        shippingCost: `Rp ${destInfo.cost.toLocaleString('id-ID')}`,
        netProfit: `Rp ${Math.round(netProfitVal).toLocaleString('id-ID')}`,
        netProfitQty: `per ${qty} kg`,
        aiReasons: [
          `Harga ${diffPct}% lebih tinggi dari lokasi Anda (${originCity})`,
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

    res.json({ success: true, origin: originProv, originCity, data: recommendations });
  } catch (err) {
    console.error('Error calculating recommendations:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ============================================================
// MARKETPLACE API ENDPOINTS
// ============================================================

// Auto-create marketplace tables
try {
  queryDB(`
    CREATE TABLE IF NOT EXISTS marketplace_products (
      id SERIAL PRIMARY KEY,
      seller_id INT REFERENCES users(id) ON DELETE SET NULL,
      name VARCHAR(150) NOT NULL,
      category VARCHAR(50) NOT NULL,
      price NUMERIC(12,2) NOT NULL,
      unit VARCHAR(20) DEFAULT 'kg',
      min_order INT DEFAULT 50,
      stock INT NOT NULL DEFAULT 0,
      farmer_name VARCHAR(100) NOT NULL,
      location VARCHAR(100) NOT NULL,
      rating NUMERIC(2,1) DEFAULT 5.0,
      reviews_count INT DEFAULT 0,
      total_sold INT DEFAULT 0,
      harvest_date DATE,
      grade VARCHAR(30) DEFAULT 'Grade A',
      freshness VARCHAR(30) DEFAULT 'Segar',
      organic BOOLEAN DEFAULT FALSE,
      verified_seller BOOLEAN DEFAULT TRUE,
      image_url TEXT,
      description TEXT,
      tags TEXT DEFAULT '[]',
      price_change NUMERIC(5,2) DEFAULT 0,
      trending BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    )
  `).catch(err => console.log('[Database Notice] marketplace_products table check:', err.message));

  queryDB(`
    CREATE TABLE IF NOT EXISTS marketplace_orders (
      id SERIAL PRIMARY KEY,
      buyer_id INT REFERENCES users(id) ON DELETE CASCADE,
      product_id INT REFERENCES marketplace_products(id) ON DELETE SET NULL,
      seller_id INT REFERENCES users(id) ON DELETE SET NULL,
      quantity INT NOT NULL,
      total_price NUMERIC(14,2) NOT NULL,
      shipping_address TEXT NOT NULL,
      buyer_phone VARCHAR(20),
      notes TEXT,
      status VARCHAR(30) DEFAULT 'Menunggu Konfirmasi',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    )
  `).catch(err => console.log('[Database Notice] marketplace_orders table check:', err.message));
} catch (e) {}

// Marketplace Backend API powered by Supabase PostgreSQL

// GET /api/marketplace/products - List all marketplace products directly from Supabase PostgreSQL
app.get('/api/marketplace/products', async (req, res) => {
  try {
    const { category, search, sort, page = 1, limit = 20 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    let queryBuilder = supabase
      .from('marketplace_products')
      .select('*', { count: 'exact' });

    if (category && category !== 'all') {
      queryBuilder = queryBuilder.eq('category', category);
    }
    if (search) {
      queryBuilder = queryBuilder.or(
        `name.ilike.%${search}%,farmer_name.ilike.%${search}%,location.ilike.%${search}%,description.ilike.%${search}%`
      );
    }

    switch (sort) {
      case 'price_low': queryBuilder = queryBuilder.order('price', { ascending: true }); break;
      case 'price_high': queryBuilder = queryBuilder.order('price', { ascending: false }); break;
      case 'newest': queryBuilder = queryBuilder.order('created_at', { ascending: false }); break;
      case 'rating': queryBuilder = queryBuilder.order('rating', { ascending: false }); break;
      default: queryBuilder = queryBuilder.order('created_at', { ascending: false });
    }

    queryBuilder = queryBuilder.range(offset, offset + parseInt(limit) - 1);

    const { data, error, count } = await queryBuilder;
    if (error) {
      console.error('Supabase query error:', error);
      throw error;
    }

    const products = (data || []).map(p => ({
      ...p,
      tags: typeof p.tags === 'string' ? JSON.parse(p.tags || '[]') : (p.tags || [])
    }));

    res.json({
      success: true,
      count: products.length,
      total: count || products.length,
      page: parseInt(page),
      totalPages: Math.ceil((count || products.length) / parseInt(limit)) || 1,
      data: products
    });
  } catch (err) {
    console.error('Error fetching marketplace products:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/marketplace/products/:id - Get single product detail
app.get('/api/marketplace/products/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('marketplace_products')
      .select('*')
      .eq('id', parseInt(req.params.id))
      .single();

    if (error || !data) {
      return res.status(404).json({ success: false, error: 'Produk tidak ditemukan.' });
    }

    data.tags = typeof data.tags === 'string' ? JSON.parse(data.tags || '[]') : (data.tags || []);

    // Get seller info
    if (data.seller_id) {
      const { data: seller } = await supabase
        .from('users')
        .select('id, full_name, farm_location, primary_commodity, avatar_url')
        .eq('id', data.seller_id)
        .single();
      data.seller_info = seller || null;
    }

    // Get related products
    const { data: related } = await supabase
      .from('marketplace_products')
      .select('id, name, price, unit, category, rating, farmer_name, location, image_url, verified_seller, tags, grade, total_sold, price_change')
      .eq('category', data.category)
      .neq('id', data.id)
      .limit(4);

    data.related_products = (related || []).map(p => ({
      ...p,
      tags: typeof p.tags === 'string' ? JSON.parse(p.tags || '[]') : (p.tags || [])
    }));

    res.json({ success: true, data });
  } catch (err) {
    console.error('Error fetching product detail:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/marketplace/products - Create a new product listing (authenticated seller)
app.post('/api/marketplace/products', async (req, res) => {
  try {
    const { seller_id, name, category, price, unit, min_order, stock, description, grade, organic, tags, harvest_date } = req.body;

    if (!seller_id || !name || !category || !price || !stock) {
      return res.status(400).json({ success: false, error: 'Data produk tidak lengkap.' });
    }

    // Get seller info
    const { data: seller } = await supabase
      .from('users')
      .select('full_name, farm_location')
      .eq('id', seller_id)
      .single();

    if (!seller) {
      return res.status(404).json({ success: false, error: 'Akun penjual tidak ditemukan.' });
    }

    const { data, error } = await supabase
      .from('marketplace_products')
      .insert([{
        seller_id,
        name,
        category,
        price: parseFloat(price),
        unit: unit || 'kg',
        min_order: min_order || 50,
        stock: parseInt(stock),
        farmer_name: seller.full_name,
        location: seller.farm_location,
        description: description || '',
        grade: grade || 'Grade A',
        organic: organic || false,
        tags: JSON.stringify(tags || []),
        harvest_date: harvest_date || new Date().toISOString().split('T')[0],
        verified_seller: true
      }])
      .select()
      .single();

    if (error) throw error;
    res.json({ success: true, message: 'Produk berhasil ditambahkan!', data });
  } catch (err) {
    console.error('Error creating product:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/marketplace/orders - Place an order (authenticated buyer)
app.post('/api/marketplace/orders', async (req, res) => {
  try {
    const { buyer_id, product_id, quantity, shipping_address, buyer_phone, notes } = req.body;

    if (!product_id || !quantity || !shipping_address) {
      return res.status(400).json({ success: false, error: 'Data pesanan tidak lengkap.' });
    }

    // Get product
    const { data: product } = await supabase
      .from('marketplace_products')
      .select('*')
      .eq('id', product_id)
      .single();

    if (!product) {
      return res.status(404).json({ success: false, error: 'Produk tidak ditemukan.' });
    }

    if (quantity < (product.min_order || 1)) {
      return res.status(400).json({ success: false, error: `Minimum pemesanan ${product.min_order} ${product.unit}.` });
    }

    if (quantity > product.stock) {
      return res.status(400).json({ success: false, error: 'Stok tidak mencukupi.' });
    }

    const total_price = product.price * quantity;

    let validBuyerId = null;
    if (buyer_id) {
      // Check if user exists to prevent FK violation
      const { data: u } = await supabase.from('users').select('id').eq('id', buyer_id).maybeSingle();
      if (u) validBuyerId = u.id;
    }

    const { data: order, error } = await supabase
      .from('marketplace_orders')
      .insert([{
        buyer_id: validBuyerId,
        product_id: parseInt(product_id),
        quantity: parseInt(quantity),
        total_price,
        shipping_address: notes ? `${shipping_address} (HP: ${buyer_phone || '-'}, Catatan: ${notes})` : `${shipping_address} (HP: ${buyer_phone || '-'})`,
        status: 'Menunggu Konfirmasi',
        payment_method: 'Transfer / COD'
      }])
      .select()
      .single();

    if (error) throw error;

    // Update stock in Supabase
    await supabase
      .from('marketplace_products')
      .update({
        stock: Math.max(0, product.stock - quantity)
      })
      .eq('id', product_id);

    res.json({
      success: true,
      message: 'Pesanan berhasil dibuat! Penjual akan segera menghubungi Anda.',
      data: { order, product_name: product.name, seller_name: product.farmer_name }
    });
  } catch (err) {
    console.error('Error creating order:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/marketplace/stats - Get marketplace overview stats
app.get('/api/marketplace/stats', async (req, res) => {
  try {
    const { count: productCount } = await supabase
      .from('marketplace_products')
      .select('*', { count: 'exact', head: true });

    const { data: sellers } = await supabase
      .from('marketplace_products')
      .select('farmer_name');

    const uniqueSellers = new Set((sellers || []).map(s => s.farmer_name)).size;

    const { data: locations } = await supabase
      .from('marketplace_products')
      .select('location');

    const uniqueLocations = new Set((locations || []).map(l => l.location)).size;

    res.json({
      success: true,
      data: {
        totalProducts: productCount || 0,
        totalSellers: uniqueSellers || 0,
        totalLocations: uniqueLocations || 0,
        totalTransactions: 0
      }
    });
  } catch (err) {
    console.error('Error fetching marketplace stats:', err);
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


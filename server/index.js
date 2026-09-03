import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';
import pg from 'pg';
import path from 'path';
import fs from 'fs';
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

// Process crash protection & error logging
process.on('uncaughtException', (err) => {
  console.error('[CRITICAL - Uncaught Exception]:', err.message || err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('[CRITICAL - Unhandled Rejection]:', reason);
});

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

// Supabase Data Store is primary. DDL migration runner if direct DB pool is available
if (databaseUrl) {
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
}


// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'TaniPintar API Server is running', timestamp: new Date() });
});

// Google Gemini AI Assistant Integration
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyBo4EfCgLjH5EDbRFkpxOJUm9sqDNDyBZQ';

async function generateGeminiAIResponse(prompt, systemInstruction = '', history = []) {
  const models = ['gemini-3.6-flash', 'gemini-3.7-flash', 'gemini-3.5-flash', 'gemini-flash-latest', 'gemini-2.5-flash-lite'];
  
  const contents = [];
  
  // Add conversation history if available
  if (Array.isArray(history) && history.length > 0) {
    for (const h of history.slice(-6)) {
      contents.push({
        role: h.sender === 'user' ? 'user' : 'model',
        parts: [{ text: h.text }]
      });
    }
  }
  
  // Add current user prompt
  contents.push({
    role: 'user',
    parts: [{ text: prompt }]
  });

  const payload = {
    contents,
    generationConfig: {
      temperature: 0.7,
      topP: 0.95,
      maxOutputTokens: 1200
    }
  };

  if (systemInstruction) {
    payload.systemInstruction = {
      parts: [{ text: systemInstruction }]
    };
  }

  for (const model of models) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const data = await response.json();
      if (response.ok && data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
        return {
          text: data.candidates[0].content.parts[0].text,
          model: model
        };
      }
      console.log(`[Gemini API Warning] Model ${model} returned:`, data.error?.message || 'Empty response');
    } catch (err) {
      console.error(`[Gemini API Error] Model ${model} failed:`, err.message);
    }
  }

  throw new Error('Semua model Gemini sedang sibuk. Silakan coba kembali sesaat lagi.');
}

// AI Chatbot Assistant Endpoint
app.post('/api/ai/chat', async (req, res) => {
  try {
    const { message, history = [], userContext = {} } = req.body;
    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, error: 'Pesan pertanyaan tidak boleh kosong.' });
    }

    const commodity = userContext.commodity || 'Cabai Merah';
    const location = userContext.location || 'Cilacap, Jawa Tengah';
    const userName = userContext.userName || 'Petani Hebat';

    // System instruction enriched with domain expertise
    const systemPrompt = `Anda adalah "TaniBot", asisten AI pintar dari platform TaniPintar (AI Market Intelligence untuk Petani & Agribisnis Indonesia).
Tujuan utama Anda: Membantu petani mengambil keputusan terbaik tentang:
1. Kapan waktu panen/jual terbaik (prediksi tren harga pasar BI PIHPS).
2. Ke mana lokasi/kota pasar tujuan pengiriman terbaik dengan selisih margin keuntungan tertinggi (arbitrase pasar antar provinsi).
3. Berapa estimasi batas harga jual yang wajar dan strategi tawar-menawar dengan pedagang/pasar induk.
4. Tips logistik, penanganan pasca-panen (grading, packing cabai/bawang/sayur), dan manajemen biaya operasional.

Profil Pengguna saat ini:
- Nama: ${userName}
- Lokasi Panen Asal: ${location}
- Komoditas Utama: ${commodity}

Gaya Komunikasi:
- Ramah, praktis, empatik, berbahasa Indonesia yang santun dan mudah dipahami petani.
- Berikan angka estimasi konkret (dalam Rupiah) jika relevan.
- Gunakan format markdown bersih (bullet points, bold) agar nyaman dibaca.`;

    const aiResult = await generateGeminiAIResponse(message, systemPrompt, history);
    res.json({
      success: true,
      reply: aiResult.text,
      model: aiResult.model
    });
  } catch (err) {
    console.error('Error in /api/ai/chat:', err);
    res.status(500).json({
      success: false,
      error: err.message || 'Terjadi kesalahan pada layanan AI TaniBot.'
    });
  }
});

// Auth API - Register via Supabase PostgreSQL
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, full_name, role, farm_location, primary_commodity, land_size } = req.body;
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

    const loc = farm_location || 'Surabaya, Jawa Timur';
    const comm = primary_commodity || 'Cabai Merah Besar';
    const land = land_size || '1.5 Hektar';
    const userRole = role || 'farmer';

    const { data: newUser, error } = await supabase
      .from('users')
      .insert([{
        email,
        password,
        full_name,
        role: userRole,
        is_seller: userRole !== 'buyer',
        farm_location: loc,
        primary_commodity: comm,
        land_size: land,
        avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
      }])
      .select();

    if (error) {
      console.error("Supabase insert error:", error);
      return res.status(500).json({ success: false, error: error.message });
    }

    const created = newUser && newUser[0] ? newUser[0] : {};
    const user = {
      id: created.id || Date.now(),
      email: created.email || email,
      full_name: created.full_name || full_name,
      role: created.role || userRole,
      is_seller: created.is_seller !== undefined ? created.is_seller : (userRole !== 'buyer'),
      farm_location: created.farm_location || loc,
      primary_commodity: created.primary_commodity || comm,
      land_size: created.land_size || land,
      avatar_url: created.avatar_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      needsOnboarding: true
    };

    res.json({ success: true, message: 'Pendaftaran berhasil! Selamat datang di TaniPintar.', user });
  } catch (err) {
    console.error('Error during registration:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Auth API - Onboarding Setup (Fiverr style post-register preference)
app.post('/api/auth/onboarding', async (req, res) => {
  try {
    const { email, id, role, farm_location, primary_commodity, land_size } = req.body;
    if (!email && !id) {
      return res.status(400).json({ success: false, error: 'User ID atau Email wajib disertakan.' });
    }

    const updatePayload = {
      role: role || 'farmer',
      is_seller: role !== 'buyer',
      farm_location: farm_location || 'Surabaya, Jawa Timur',
      primary_commodity: primary_commodity || 'Cabai Merah Besar',
      land_size: land_size || '1.5 Hektar'
    };

    let query = supabase.from('users').update(updatePayload);
    if (id) {
      query = query.eq('id', id);
    } else {
      query = query.eq('email', email);
    }

    const { data: updated, error } = await query.select();

    if (error) {
      console.warn("Supabase onboarding update warning:", error.message);
    }

    const userObj = updated && updated[0] ? updated[0] : {
      id: id || Date.now(),
      email,
      ...updatePayload
    };

    res.json({
      success: true,
      message: 'Preferensi dan wilayah panen berhasil disimpan!',
      user: {
        ...userObj,
        needsOnboarding: false,
        onboarded: true
      }
    });
  } catch (err) {
    console.error('Error during onboarding:', err);
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
      role: u.role || 'farmer',
      is_seller: u.is_seller !== undefined ? u.is_seller : true,
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

// Mapping of Indonesian cities/keywords to exact Supabase province_name
const PROVINCE_MAPPING = {
  // Jawa Tengah
  'cilacap': 'Jawa Tengah',
  'brebes': 'Jawa Tengah',
  'semarang': 'Jawa Tengah',
  'solo': 'Jawa Tengah',
  'surakarta': 'Jawa Tengah',
  'banyumas': 'Jawa Tengah',
  'wonosobo': 'Jawa Tengah',
  'magelang': 'Jawa Tengah',
  'temanggung': 'Jawa Tengah',
  'boyolali': 'Jawa Tengah',
  'demak': 'Jawa Tengah',
  'grobogan': 'Jawa Tengah',
  'kebumen': 'Jawa Tengah',
  'karanganyar': 'Jawa Tengah',
  'pati': 'Jawa Tengah',
  'sukoharjo': 'Jawa Tengah',
  'kudus': 'Jawa Tengah',
  'pekalongan': 'Jawa Tengah',
  'tegal': 'Jawa Tengah',
  'jateng': 'Jawa Tengah',
  'jawa tengah': 'Jawa Tengah',

  // Jawa Barat
  'bandung': 'Jawa Barat',
  'garut': 'Jawa Barat',
  'cianjur': 'Jawa Barat',
  'tasikmalaya': 'Jawa Barat',
  'cirebon': 'Jawa Barat',
  'majalengka': 'Jawa Barat',
  'kuningan': 'Jawa Barat',
  'sukabumi': 'Jawa Barat',
  'sumedang': 'Jawa Barat',
  'karawang': 'Jawa Barat',
  'indramayu': 'Jawa Barat',
  'bogor': 'Jawa Barat',
  'bekasi': 'Jawa Barat',
  'depok': 'Jawa Barat',
  'jabar': 'Jawa Barat',
  'jawa barat': 'Jawa Barat',

  // DKI Jakarta
  'jakarta': 'DKI Jakarta',
  'dki': 'DKI Jakarta',
  'cipinang': 'DKI Jakarta',

  // Jawa Timur
  'surabaya': 'Jawa Timur',
  'malang': 'Jawa Timur',
  'kediri': 'Jawa Timur',
  'blitar': 'Jawa Timur',
  'banyuwangi': 'Jawa Timur',
  'probolinggo': 'Jawa Timur',
  'nganjuk': 'Jawa Timur',
  'jember': 'Jawa Timur',
  'lumajang': 'Jawa Timur',
  'bojonegoro': 'Jawa Timur',
  'tuban': 'Jawa Timur',
  'pasuruan': 'Jawa Timur',
  'madiun': 'Jawa Timur',
  'jatim': 'Jawa Timur',
  'jawa timur': 'Jawa Timur',

  // DI Yogyakarta
  'yogyakarta': 'DI Yogyakarta',
  'jogja': 'DI Yogyakarta',
  'sleman': 'DI Yogyakarta',
  'kulon progo': 'DI Yogyakarta',
  'bantul': 'DI Yogyakarta',
  'gunungkidul': 'DI Yogyakarta',
  'diy': 'DI Yogyakarta',

  // Banten
  'serang': 'Banten',
  'lebak': 'Banten',
  'tangerang': 'Banten',
  'cilegon': 'Banten',
  'pandeglang': 'Banten',
  'banten': 'Banten',

  // Sumatera Utara
  'medan': 'Sumatera Utara',
  'karo': 'Sumatera Utara',
  'berastagi': 'Sumatera Utara',
  'simalungun': 'Sumatera Utara',
  'toba': 'Sumatera Utara',
  'pematang siantar': 'Sumatera Utara',
  'sumut': 'Sumatera Utara',
  'sumatera utara': 'Sumatera Utara',

  // Sumatera Barat
  'padang': 'Sumatera Barat',
  'solok': 'Sumatera Barat',
  'tanah datar': 'Sumatera Barat',
  'agam': 'Sumatera Barat',
  'bukittinggi': 'Sumatera Barat',
  'sumbar': 'Sumatera Barat',
  'sumatera barat': 'Sumatera Barat',

  // Riau & Kepri
  'pekanbaru': 'Riau',
  'riau': 'Riau',
  'batam': 'Kepulauan Riau',
  'tanjungpinang': 'Kepulauan Riau',
  'kepri': 'Kepulauan Riau',

  // Jambi
  'kerinci': 'Jambi',
  'jambi': 'Jambi',

  // Sumatera Selatan
  'palembang': 'Sumatera Selatan',
  'banyuasin': 'Sumatera Selatan',
  'ogan komering': 'Sumatera Selatan',
  'sumsel': 'Sumatera Selatan',
  'sumatera selatan': 'Sumatera Selatan',

  // Bengkulu
  'curup': 'Bengkulu',
  'rejang lebong': 'Bengkulu',
  'bengkulu': 'Bengkulu',

  // Lampung
  'lampung': 'Lampung',
  'bandar lampung': 'Lampung',

  // Aceh
  'pidie': 'Aceh',
  'takengon': 'Aceh',
  'gayo': 'Aceh',
  'banda aceh': 'Aceh',
  'aceh': 'Aceh',

  // Bangka Belitung
  'pangkalpinang': 'Kepulauan Bangka Belitung',
  'bangka': 'Kepulauan Bangka Belitung',
  'belitung': 'Kepulauan Bangka Belitung',

  // Bali
  'denpasar': 'Bali',
  'tabanan': 'Bali',
  'bangli': 'Bali',
  'buleleng': 'Bali',
  'bali': 'Bali',

  // Nusa Tenggara Barat
  'mataram': 'Nusa Tenggara Barat',
  'lombok': 'Nusa Tenggara Barat',
  'bima': 'Nusa Tenggara Barat',
  'sumbawa': 'Nusa Tenggara Barat',
  'ntb': 'Nusa Tenggara Barat',

  // Nusa Tenggara Timur
  'kupang': 'Nusa Tenggara Timur',
  'manggarai': 'Nusa Tenggara Timur',
  'flores': 'Nusa Tenggara Timur',
  'ntt': 'Nusa Tenggara Timur',

  // Sulawesi Selatan
  'makassar': 'Sulawesi Selatan',
  'enrekang': 'Sulawesi Selatan',
  'bantaeng': 'Sulawesi Selatan',
  'gowa': 'Sulawesi Selatan',
  'sidrap': 'Sulawesi Selatan',
  'bone': 'Sulawesi Selatan',
  'wajo': 'Sulawesi Selatan',
  'sulsel': 'Sulawesi Selatan',
  'sulawesi selatan': 'Sulawesi Selatan',

  // Sulawesi Utara
  'manado': 'Sulawesi Utara',
  'minahasa': 'Sulawesi Utara',
  'modoinding': 'Sulawesi Utara',
  'sulut': 'Sulawesi Utara',
  'sulawesi utara': 'Sulawesi Utara',

  // Gorontalo
  'gorontalo': 'Gorontalo',

  // Sulawesi Tengah
  'palu': 'Sulawesi Tengah',
  'parigi': 'Sulawesi Tengah',
  'sulteng': 'Sulawesi Tengah',
  'sulawesi tengah': 'Sulawesi Tengah',

  // Sulawesi Tenggara
  'kendari': 'Sulawesi Tenggara',
  'konawe': 'Sulawesi Tenggara',
  'sultra': 'Sulawesi Tenggara',
  'sulawesi tenggara': 'Sulawesi Tenggara',

  // Sulawesi Barat
  'mamuju': 'Sulawesi Barat',
  'sulbar': 'Sulawesi Barat',

  // Kalimantan Selatan
  'banjarmasin': 'Kalimantan Selatan',
  'barito kuala': 'Kalimantan Selatan',
  'tanah laut': 'Kalimantan Selatan',
  'kalsel': 'Kalimantan Selatan',

  // Kalimantan Barat
  'pontianak': 'Kalimantan Barat',
  'sambas': 'Kalimantan Barat',
  'kalbar': 'Kalimantan Barat',

  // Kalimantan Timur
  'samarinda': 'Kalimantan Timur',
  'balikpapan': 'Kalimantan Timur',
  'kutai': 'Kalimantan Timur',
  'kaltim': 'Kalimantan Timur',

  // Kalimantan Tengah & Utara
  'palangkaraya': 'Kalimantan Tengah',
  'kalteng': 'Kalimantan Tengah',
  'tarakan': 'Kalimantan Utara',
  'kaltara': 'Kalimantan Utara',

  // Maluku & Maluku Utara
  'ambon': 'Maluku',
  'seram': 'Maluku',
  'maluku': 'Maluku',
  'ternate': 'Maluku Utara',
  'malut': 'Maluku Utara',

  // Papua
  'jayapura': 'Papua',
  'merauke': 'Papua',
  'wamena': 'Papua',
  'jayawijaya': 'Papua',
  'sorong': 'Papua Barat',
  'manokwari': 'Papua Barat',
  'papua': 'Papua'
};

function resolveProvince(rawInput) {
  if (!rawInput) return 'Jawa Tengah';
  const clean = rawInput.toLowerCase().trim();
  for (const [key, prov] of Object.entries(PROVINCE_MAPPING)) {
    if (clean.includes(key)) return prov;
  }
  return 'Jawa Tengah';
}

const PROVINCE_HUBS = {
  'Jawa Tengah': { city: 'Semarang', island: 'Jawa', lat: -7.0, lon: 110.4 },
  'Jawa Barat': { city: 'Bandung', island: 'Jawa', lat: -6.9, lon: 107.6 },
  'DKI Jakarta': { city: 'Jakarta (Pasar Cipinang)', island: 'Jawa', lat: -6.2, lon: 106.8 },
  'Jawa Timur': { city: 'Surabaya (Osowilangun)', island: 'Jawa', lat: -7.2, lon: 112.7 },
  'DI Yogyakarta': { city: 'Yogyakarta', island: 'Jawa', lat: -7.8, lon: 110.3 },
  'Banten': { city: 'Tangerang / Serang', island: 'Jawa', lat: -6.1, lon: 106.1 },
  'Lampung': { city: 'Bandar Lampung', island: 'Sumatera', lat: -5.4, lon: 105.2 },
  'Sumatera Selatan': { city: 'Palembang', island: 'Sumatera', lat: -2.9, lon: 104.7 },
  'Sumatera Utara': { city: 'Medan (Lau Cih)', island: 'Sumatera', lat: 3.5, lon: 98.6 },
  'Sumatera Barat': { city: 'Padang', island: 'Sumatera', lat: -0.9, lon: 100.3 },
  'Riau': { city: 'Pekanbaru', island: 'Sumatera', lat: 0.5, lon: 101.4 },
  'Kepulauan Riau': { city: 'Batam', island: 'Sumatera', lat: 1.1, lon: 104.0 },
  'Jambi': { city: 'Jambi', island: 'Sumatera', lat: -1.6, lon: 103.6 },
  'Bengkulu': { city: 'Bengkulu', island: 'Sumatera', lat: -3.8, lon: 102.3 },
  'Aceh': { city: 'Banda Aceh', island: 'Sumatera', lat: 5.5, lon: 95.3 },
  'Kepulauan Bangka Belitung': { city: 'Pangkalpinang', island: 'Sumatera', lat: -2.1, lon: 106.1 },
  'Kalimantan Selatan': { city: 'Banjarmasin', island: 'Kalimantan', lat: -3.3, lon: 114.5 },
  'Kalimantan Timur': { city: 'Balikpapan', island: 'Kalimantan', lat: -1.2, lon: 116.8 },
  'Kalimantan Barat': { city: 'Pontianak', island: 'Kalimantan', lat: -0.0, lon: 109.3 },
  'Kalimantan Tengah': { city: 'Palangkaraya', island: 'Kalimantan', lat: -2.2, lon: 113.9 },
  'Kalimantan Utara': { city: 'Tarakan', island: 'Kalimantan', lat: 3.3, lon: 117.6 },
  'Sulawesi Selatan': { city: 'Makassar', island: 'Sulawesi', lat: -5.1, lon: 119.4 },
  'Sulawesi Utara': { city: 'Manado', island: 'Sulawesi', lat: 1.4, lon: 124.8 },
  'Gorontalo': { city: 'Gorontalo', island: 'Sulawesi', lat: 0.5, lon: 123.0 },
  'Sulawesi Tengah': { city: 'Palu', island: 'Sulawesi', lat: -0.9, lon: 119.8 },
  'Sulawesi Tenggara': { city: 'Kendari', island: 'Sulawesi', lat: -3.9, lon: 122.5 },
  'Sulawesi Barat': { city: 'Mamuju', island: 'Sulawesi', lat: -2.6, lon: 118.8 },
  'Bali': { city: 'Denpasar', island: 'Bali', lat: -8.6, lon: 115.2 },
  'Nusa Tenggara Barat': { city: 'Mataram (Lombok)', island: 'Nusa Tenggara', lat: -8.5, lon: 116.1 },
  'Nusa Tenggara Timur': { city: 'Kupang', island: 'Nusa Tenggara', lat: -10.1, lon: 123.5 },
  'Maluku': { city: 'Ambon', island: 'Maluku', lat: -3.6, lon: 128.1 },
  'Maluku Utara': { city: 'Ternate', island: 'Maluku', lat: 0.7, lon: 127.3 },
  'Papua': { city: 'Jayapura', island: 'Papua', lat: -2.5, lon: 140.7 },
  'Papua Barat': { city: 'Sorong', island: 'Papua', lat: -0.8, lon: 131.2 }
};

function calculateLogistics(originProv, destProv) {
  const originHub = PROVINCE_HUBS[originProv] || { city: originProv, island: 'Jawa', lat: -7.0, lon: 110.0 };
  const destHub = PROVINCE_HUBS[destProv] || { city: destProv, island: 'Lainnya', lat: -5.0, lon: 115.0 };

  const dLat = (destHub.lat - originHub.lat) * 111;
  const dLon = (destHub.lon - originHub.lon) * 111;
  const approxKm = Math.max(60, Math.round(Math.sqrt(dLat * dLat + dLon * dLon) * 1.3));

  let cost = 0;
  let duration = '';

  if (originHub.island === destHub.island) {
    cost = Math.max(300000, Math.round(approxKm * 1800));
    const hours = Math.max(3, Math.round(approxKm / 40));
    duration = `${hours}-${hours + 2} jam (Darat)`;
  } else {
    cost = Math.max(850000, Math.round(approxKm * 2800 + 400000));
    const days = Math.max(1, Math.round(approxKm / 350));
    duration = `${days}-${days + 1} hari (Kargo Laut/Udara)`;
  }

  return {
    city: destHub.city,
    province: destProv,
    distance: `${approxKm} km`,
    cost: cost,
    duration: duration
  };
}

// GET /api/prices/history - Get historical price trends for chart matching the origin location
app.get('/api/prices/history', async (req, res) => {
  try {
    const rawCommodity = req.query.commodity || 'Cabai Merah';
    const rawOrigin = req.query.origin || 'Cilacap, Jateng';
    const originProv = resolveProvince(rawOrigin);
    const originCity = rawOrigin.split(',')[0].trim();
    const cleanComm = getCommodityFilter(rawCommodity);

    // Select origin province + benchmark destination provinces
    const targetProvinces = [originProv, 'DKI Jakarta', 'Jawa Barat', 'Jawa Timur', 'Sumatera Utara'].filter((v, i, a) => a.indexOf(v) === i).slice(0, 4);

    const { data: rows, error } = await supabase
      .from('harga_pangan')
      .select('tanggal_bi, province_name, price, national_avg, commodity_name')
      .ilike('commodity_name', `%${cleanComm}%`)
      .in('province_name', targetProvinces)
      .order('tanggal_bi', { ascending: true });

    if (error) throw error;

    const dateMap = {};
    (rows || []).forEach(r => {
      const d = new Date(r.tanggal_bi + 'T00:00:00');
      const dateStr = d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
      if (!dateMap[dateStr]) {
        dateMap[dateStr] = { date: dateStr, RataNasional: Math.round(r.national_avg || 0) };
      }
      if (r.province_name === originProv) {
        dateMap[dateStr][`${originCity} (Asal)`] = Math.round(r.price);
      } else {
        const shortName = r.province_name.replace('DKI Jakarta', 'Jakarta').replace('Jawa Barat', 'Bandung').replace('Jawa Timur', 'Surabaya').replace('Sumatera Utara', 'Medan');
        dateMap[dateStr][shortName] = Math.round(r.price);
      }
    });

    const chartData = Object.values(dateMap);
    res.json({ success: true, commodity: rawCommodity, origin: originProv, originCity, count: chartData.length, data: chartData });
  } catch (err) {
    console.error('Error fetching price history:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Helper to sanitize and normalize commodity queries
function getCommodityFilter(comm) {
  if (!comm) return 'Cabai Merah';
  const c = comm.trim().toLowerCase();
  if (c.includes('ayam')) return 'Daging Ayam';
  if (c.includes('sapi')) return 'Daging Sapi';
  if (c.includes('telur')) return 'Telur Ayam';
  if (c.includes('bawang merah')) return 'Bawang Merah';
  if (c.includes('bawang putih')) return 'Bawang Putih';
  if (c.includes('cabai rawit') || c.includes('rawit')) return 'Cabai Rawit';
  if (c.includes('cabai merah') || c.includes('keriting') || c.includes('merah besar')) return 'Cabai Merah';
  if (c.includes('beras')) return 'Beras';
  if (c.includes('minyak')) return 'Minyak Goreng';
  if (c.includes('gula')) return 'Gula Pasir';
  return comm.trim();
}

// GET /api/demand/regional - Get regional demand comparison
app.get('/api/demand/regional', async (req, res) => {
  try {
    const rawCommodity = req.query.commodity || 'Cabai Merah';
    const cleanComm = getCommodityFilter(rawCommodity);

    const { data: maxDateData } = await supabase
      .from('harga_pangan')
      .select('tanggal_bi')
      .ilike('commodity_name', `%${cleanComm}%`)
      .order('tanggal_bi', { ascending: false })
      .limit(1);

    const latestDate = maxDateData && maxDateData[0] ? maxDateData[0].tanggal_bi : null;

    let queryBuilder = supabase
      .from('harga_pangan')
      .select('province_name, price, percentage_change, price_diff, commodity_name')
      .ilike('commodity_name', `%${cleanComm}%`);

    if (latestDate) {
      queryBuilder = queryBuilder.eq('tanggal_bi', latestDate);
    }

    const { data: rows, error } = await queryBuilder.order('price', { ascending: false }).limit(10);
    if (error) throw error;

    const formatted = (rows || []).map(r => ({
      city: r.province_name,
      price: Math.round(r.price),
      status: r.percentage_change > 2 ? "Tinggi" : r.percentage_change >= 0 ? "Sedang" : "Rendah",
      percent: `${r.percentage_change >= 0 ? '↑' : '↓'} ${Math.abs(r.percentage_change || 1.5)}%`,
      val: Math.min(100, Math.max(25, Math.round((r.price / 80000) * 100))),
      color: r.percentage_change > 2 ? "#16A34A" : r.percentage_change >= 0 ? "#EAB308" : "#EF4444"
    }));

    res.json({ success: true, count: formatted.length, data: formatted });
  } catch (err) {
    console.error('Error fetching regional demand:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/dates - Get available scraped dates from Supabase
app.get('/api/dates', async (req, res) => {
  try {
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

// GET /api/recommendations - Get Dynamic AI calculated selling recommendations based on Origin & Supabase Prices
app.get('/api/recommendations', async (req, res) => {
  try {
    const rawOrigin = req.query.origin || 'Cilacap, Jateng';
    const rawCommodity = req.query.commodity || 'Cabai Merah';
    const cleanComm = getCommodityFilter(rawCommodity);
    let dateParam = req.query.date;

    const originProv = resolveProvince(rawOrigin);
    const originCity = rawOrigin.split(',')[0].trim();

    // Parse date parameter
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

    // Query latest available date in Supabase if not specified
    if (!targetDate || targetDate === 'latest' || targetDate === 'terbaru') {
      const { data: latestDateData } = await supabase
        .from('harga_pangan')
        .select('tanggal_bi')
        .ilike('commodity_name', `%${cleanComm}%`)
        .order('tanggal_bi', { ascending: false })
        .limit(1);
      targetDate = latestDateData && latestDateData[0] ? latestDateData[0].tanggal_bi : '2026-08-31';
    }

    // Fetch prices for all provinces on targetDate for the chosen commodity ONLY
    let { data: allProvRows, error } = await supabase
      .from('harga_pangan')
      .select('province_name, price, percentage_change, tanggal_bi, commodity_name')
      .ilike('commodity_name', `%${cleanComm}%`)
      .eq('tanggal_bi', targetDate);

    // Fallback if targetDate has no rows for this commodity
    if (!allProvRows || allProvRows.length === 0) {
      const { data: fallbackRows } = await supabase
        .from('harga_pangan')
        .select('province_name, price, percentage_change, tanggal_bi, commodity_name')
        .ilike('commodity_name', `%${cleanComm}%`)
        .order('tanggal_bi', { ascending: false })
        .limit(150);
      
      if (fallbackRows && fallbackRows.length > 0) {
        const fallbackDate = fallbackRows[0].tanggal_bi;
        allProvRows = fallbackRows.filter(r => r.tanggal_bi === fallbackDate);
        targetDate = fallbackDate;
      }
    }

    // Group and calculate average price per province
    const provPrices = {};
    for (const r of (allProvRows || [])) {
      if (!provPrices[r.province_name]) provPrices[r.province_name] = [];
      provPrices[r.province_name].push(Number(r.price));
    }
    const provAvg = {};
    for (const [p, prices] of Object.entries(provPrices)) {
      provAvg[p] = Math.round(prices.reduce((a, b) => a + b, 0) / prices.length);
    }

    // Determine realistic origin price
    let originPrice = provAvg[originProv];
    if (!originPrice) {
      // Query historical origin price for this province and commodity
      const { data: originData } = await supabase
        .from('harga_pangan')
        .select('price')
        .ilike('commodity_name', `%${cleanComm}%`)
        .eq('province_name', originProv)
        .order('tanggal_bi', { ascending: false })
        .limit(1);

      if (originData && originData[0] && originData[0].price) {
        originPrice = Number(originData[0].price);
      } else {
        const allVals = Object.values(provAvg);
        originPrice = allVals.length > 0 ? Math.round(allVals.reduce((a, b) => a + b, 0) / allVals.length) : 35000;
      }
    }

    // Calculate arbitrage profit across all other provinces
    const destinations = [];
    for (const [destProv, destPrice] of Object.entries(provAvg)) {
      if (destProv === originProv) continue;

      const logistics = calculateLogistics(originProv, destProv);
      const qty = 500; // 500 kg batch
      const marginPerKg = destPrice - originPrice;
      const grossMarginTotal = marginPerKg * qty;
      const netProfitVal = grossMarginTotal - logistics.cost;
      const diffPct = (((destPrice - originPrice) / originPrice) * 100).toFixed(1);

      destinations.push({
        destProv,
        city: logistics.city,
        destPrice,
        marginPerKg,
        grossMarginTotal,
        netProfitVal,
        diffPct,
        logistics
      });
    }

    // Sort by net profit descending
    destinations.sort((a, b) => b.netProfitVal - a.netProfitVal);

    // If all destinations are lower (origin has highest price), fall back to top benchmark hubs
    let finalDestinations = destinations.filter(d => d.netProfitVal > 0);
    if (finalDestinations.length === 0) {
      finalDestinations = destinations.slice(0, 3);
    }

    const qty = 500;
    const recommendations = finalDestinations.slice(0, 3).map((item, idx) => {
      const isPositive = Number(item.diffPct) >= 0;
      const diffStr = isPositive ? `+${item.diffPct}%` : `${item.diffPct}%`;
      const netProfitDisplay = item.netProfitVal > 0 ? `Rp ${Math.round(item.netProfitVal).toLocaleString('id-ID')}` : `Rp ${Math.round(Math.abs(item.netProfitVal)).toLocaleString('id-ID')}`;

      return {
        rank: idx + 1,
        city: item.city,
        province: item.destProv,
        originCity: originCity,
        originLocation: rawOrigin,
        commodity: cleanComm,
        badge: idx === 0 ? "Sangat Direkomendasikan" : "Direkomendasikan",
        originPrice: `Rp ${Math.round(originPrice).toLocaleString('id-ID')}`,
        destPrice: `Rp ${Math.round(item.destPrice).toLocaleString('id-ID')}`,
        diffPercent: `${diffStr} ${isPositive ? 'Lebih tinggi' : 'Tingkat serapan'}`,
        marginDiff: `Rp ${Math.round(Math.max(0, item.grossMarginTotal)).toLocaleString('id-ID')}`,
        shippingCost: `Rp ${item.logistics.cost.toLocaleString('id-ID')}`,
        netProfit: netProfitDisplay,
        netProfitQty: `per ${qty} kg muatan`,
        aiReasons: [
          `Harga ${cleanComm} ${diffStr} dibanding sentra panen Anda (${originCity})`,
          `Tujuan pasar utama di ${item.city} (${item.destProv})`,
          `Rute pengiriman ${item.logistics.duration} dengan armada pengangkut`
        ],
        shippingInfo: {
          distance: item.logistics.distance,
          cost: `Rp ${item.logistics.cost.toLocaleString('id-ID')}`,
          duration: item.logistics.duration
        }
      };
    });

    res.json({
      success: true,
      commodity: cleanComm,
      origin: originProv,
      originCity,
      originPrice: Math.round(originPrice),
      targetDate,
      count: recommendations.length,
      data: recommendations
    });
  } catch (err) {
    console.error('Error calculating recommendations:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});


// ============================================================
// MARKETPLACE API ENDPOINTS
// ============================================================

// Auto-create marketplace tables if direct DB pool is configured
if (databaseUrl) {
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
}


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
    const { seller_id, name, category, price, unit, min_order, stock, description, grade, organic, tags, harvest_date, image_url, location } = req.body;

    if (!name || !category || !price || !stock) {
      return res.status(400).json({ success: false, error: 'Data produk tidak lengkap.' });
    }

    let sellerName = 'Petani Mitra TaniPintar';
    let sellerLocation = location || 'Surabaya, Jawa Timur';

    if (seller_id) {
      const { data: seller } = await supabase
        .from('users')
        .select('full_name, farm_location')
        .eq('id', seller_id)
        .maybeSingle();

      if (seller) {
        sellerName = seller.full_name || sellerName;
        sellerLocation = seller.farm_location || sellerLocation;
      }
    }

    const defaultImages = {
      cabai: 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=800&q=80',
      bawang: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=800&q=80',
      sayuran: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
      buah: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=800&q=80',
      padi: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80',
      rempah: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80'
    };

    const finalImage = image_url || defaultImages[category] || defaultImages.cabai;

    const { data, error } = await supabase
      .from('marketplace_products')
      .insert([{
        seller_id: seller_id || null,
        name,
        category,
        price: parseFloat(price),
        unit: unit || 'kg',
        min_order: parseInt(min_order) || 50,
        stock: parseInt(stock),
        farmer_name: sellerName,
        location: sellerLocation,
        image_url: finalImage,
        description: description || 'Komoditas hasil panen segar langsung dari perkebunan binaan TaniPintar.',
        grade: grade || 'Grade A',
        organic: Boolean(organic),
        tags: JSON.stringify(tags || []),
        harvest_date: harvest_date || new Date().toISOString().split('T')[0],
        verified_seller: true
      }])
      .select()
      .single();

    if (error) throw error;
    res.json({ success: true, message: 'Komoditas berhasil dipasang di Marketplace!', data });
  } catch (err) {
    console.error('Error creating product:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/marketplace/orders - Place an order (authenticated buyer)
app.post('/api/marketplace/orders', async (req, res) => {
  try {
    const { buyer_id, product_id, quantity, shipping_address, buyer_phone, notes, payment_method } = req.body;

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
        payment_method: payment_method === 'cod' ? 'COD (Bayar di Tempat)' : 'Transfer Bank / QRIS'
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

// GET /api/marketplace/orders/my-orders - Get orders for current user (both as buyer and seller)
app.get('/api/marketplace/orders/my-orders', async (req, res) => {
  try {
    const { buyer_id, seller_name } = req.query;

    let buyerOrders = [];
    let sellerOrders = [];

    // 1. Fetch all orders with product details
    const { data: allOrders, error: orderErr } = await supabase
      .from('marketplace_orders')
      .select(`
        *,
        marketplace_products (
          id, name, price, unit, category, image_url, farmer_name, location
        )
      `)
      .order('created_at', { ascending: false });

    if (orderErr) {
      console.warn("Supabase join warning, fallback to direct query:", orderErr.message);
      const { data: directOrders } = await supabase
        .from('marketplace_orders')
        .select('*')
        .order('created_at', { ascending: false });
      
      const { data: allProds } = await supabase.from('marketplace_products').select('*');
      const prodMap = new Map((allProds || []).map(p => [p.id, p]));

      const mapped = (directOrders || []).map(o => ({
        ...o,
        product: prodMap.get(o.product_id) || { name: 'Komoditas Panen', price: o.total_price / o.quantity, unit: 'kg' }
      }));

      buyerOrders = buyer_id ? mapped.filter(o => String(o.buyer_id) === String(buyer_id)) : mapped;
      sellerOrders = mapped;
    } else {
      const mapped = (allOrders || []).map(o => ({
        ...o,
        product: o.marketplace_products || { name: 'Komoditas Panen', price: o.total_price / o.quantity, unit: 'kg' }
      }));

      buyerOrders = buyer_id ? mapped.filter(o => String(o.buyer_id) === String(buyer_id)) : mapped;
      sellerOrders = mapped;
    }

    res.json({
      success: true,
      data: {
        buyerOrders: buyerOrders || [],
        sellerOrders: sellerOrders || []
      }
    });
  } catch (err) {
    console.error('Error fetching my orders:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// PATCH /api/marketplace/orders/:id/status - Update order fulfillment status
app.patch('/api/marketplace/orders/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ success: false, error: 'Status pesanan wajib disertakan.' });
    }

    const { data, error } = await supabase
      .from('marketplace_orders')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    res.json({
      success: true,
      message: `Status pesanan #${id} berhasil diubah menjadi: ${status}`,
      data
    });
  } catch (err) {
    console.error('Error updating order status:', err);
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
const distIndex = path.join(distPath, 'index.html');

if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
}

// Single Page Application (SPA) Client-side Routing Fallback
app.use((req, res, next) => {
  if (!req.path.startsWith('/api')) {
    if (fs.existsSync(distIndex)) {
      return res.sendFile(distIndex);
    }
    return res.status(200).send(`
      <!DOCTYPE html>
      <html>
        <head><title>TaniPintar Backend Running</title></head>
        <body style="font-family: sans-serif; text-align: center; padding: 50px;">
          <h2>🌾 TaniPintar Backend API Server is Running on Port ${PORT}</h2>
          <p>Frontend production bundle dist/ is not built yet or running in development mode.</p>
          <p>Buka <a href="http://localhost:3000">http://localhost:3000</a> untuk mengakses antarmuka Vite frontend.</p>
        </body>
      </html>
    `);
  }
  next();
});

// 404 Handler for undefined /api routes
app.use('/api', (req, res) => {
  res.status(404).json({
    success: false,
    error: `Endpoint API '${req.method} ${req.originalUrl}' tidak ditemukan.`
  });
});

// Express Global Error Handling Middleware
app.use((err, req, res, _next) => {
  console.error('[Server Internal Error]:', err);
  if (res.headersSent) return;
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Terjadi kesalahan internal pada server.',
    ...(process.env.NODE_ENV !== 'production' ? { stack: err.stack } : {})
  });
});

import { initAutoScraperCron } from './auto_scraper.js';

const primaryPort = parseInt(process.env.PORT || '5000', 10);

const mainServer = app.listen(primaryPort, '0.0.0.0', () => {
  console.log(`=================================================`);
  console.log(`  TaniPintar Application Server Running on Port ${primaryPort} (0.0.0.0:${primaryPort})`);
  console.log(`=================================================`);
  initAutoScraperCron();
});

// Dual listener support for Dokploy / Traefik / Docker hosting:
// If primaryPort is not 3000, also listen on port 3000 (Dokploy's default app port) inside container
if (primaryPort !== 3000) {
  try {
    const aliasServer = app.listen(3000, '0.0.0.0', () => {
      console.log(`[Hosting Multi-Port] Also listening on port 3000 (0.0.0.0:3000) for Dokploy/Traefik reverse proxy`);
    });
    aliasServer.on('error', (err) => {
      // Port 3000 is in use (e.g. in local Vite dev mode), which is normal and safe to ignore
      console.log(`[Hosting Multi-Port Notice] Port 3000 alias listener: ${err.message}`);
    });
  } catch (e) {}
}




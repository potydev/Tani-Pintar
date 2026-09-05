import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const JWT_SECRET = process.env.JWT_SECRET || 'tanipintar_sec_token_key_2026_supa';
const ROLES_FILE = path.join(__dirname, 'user_roles.json');

// --- In-Memory & Persistent Role Store ---
let roleStore = {
  'admin@tanipintar.id': { role: 'admin', is_seller: true, verification_status: 'approved' },
  'petani.baru@tanipintar.id': { role: 'verified_farmer', is_seller: true, verification_status: 'approved' }
};

// Load existing role file if present
try {
  if (fs.existsSync(ROLES_FILE)) {
    const raw = fs.readFileSync(ROLES_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    roleStore = { ...roleStore, ...parsed };
  }
} catch (e) {
  console.warn('[Security] Could not load user_roles.json:', e.message);
}

function saveRolesToFile() {
  try {
    fs.writeFileSync(ROLES_FILE, JSON.stringify(roleStore, null, 2), 'utf-8');
  } catch (e) {
    console.warn('[Security] Could not save user_roles.json:', e.message);
  }
}

export function getUserRole(email) {
  if (!email) return 'farmer';
  const normalized = email.toLowerCase().trim();
  if (normalized === 'admin@tanipintar.id') return 'admin';
  return roleStore[normalized]?.role || 'farmer';
}

export function getUserMeta(email) {
  if (!email) return { role: 'farmer', is_seller: true, verification_status: 'pending' };
  const normalized = email.toLowerCase().trim();
  if (normalized === 'admin@tanipintar.id') {
    return { role: 'admin', is_seller: true, verification_status: 'approved' };
  }
  return roleStore[normalized] || { role: 'farmer', is_seller: true, verification_status: 'pending' };
}

export function setUserRole(email, data) {
  if (!email) return;
  const normalized = email.toLowerCase().trim();
  roleStore[normalized] = {
    ...(roleStore[normalized] || {}),
    ...data
  };
  saveRolesToFile();
}

// --- Password Hashing with Salted Scrypt ---
export function hashPassword(password) {
  if (!password) throw new Error('Password cannot be empty');
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `scrypt:${salt}:${hash}`;
}

export function verifyPassword(password, storedPassword) {
  if (!password || !storedPassword) return false;

  if (storedPassword.startsWith('scrypt:')) {
    const parts = storedPassword.split(':');
    if (parts.length !== 3) return false;
    const [, salt, originalHash] = parts;
    try {
      const derivedHash = crypto.scryptSync(password, salt, 64).toString('hex');
      return crypto.timingSafeEqual(Buffer.from(derivedHash, 'hex'), Buffer.from(originalHash, 'hex'));
    } catch (e) {
      return false;
    }
  }

  // Backward compatibility fallback for legacy plaintext passwords
  return password === storedPassword;
}

export function isPasswordHashed(storedPassword) {
  return typeof storedPassword === 'string' && storedPassword.startsWith('scrypt:');
}

// --- Cryptographic Session Token (JWT-compatible HMAC SHA256) ---
function base64UrlEncode(str) {
  return Buffer.from(str)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function base64UrlDecode(str) {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  return Buffer.from(base64, 'base64').toString('utf-8');
}

export function createToken(user) {
  const header = { alg: 'HS256', typ: 'JWT' };
  const payload = {
    id: user.id,
    email: (user.email || '').toLowerCase().trim(),
    role: user.role || 'farmer',
    full_name: user.full_name,
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days expiration
  };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const signature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(`${encodedHeader}.${encodedPayload}`)
    .digest('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

export function verifyToken(token) {
  if (!token || typeof token !== 'string') return null;
  const parts = token.trim().split('.');
  if (parts.length !== 3) return null;

  const [encodedHeader, encodedPayload, signature] = parts;

  try {
    const expectedSig = crypto
      .createHmac('sha256', JWT_SECRET)
      .update(`${encodedHeader}.${encodedPayload}`)
      .digest('base64')
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');

    const sigBuf = Buffer.from(signature);
    const expectedBuf = Buffer.from(expectedSig);

    if (sigBuf.length !== expectedBuf.length || !crypto.timingSafeEqual(sigBuf, expectedBuf)) {
      return null;
    }

    const payload = JSON.parse(base64UrlDecode(encodedPayload));
    if (payload.exp && payload.exp < Date.now()) {
      return null; // Expired
    }

    return payload;
  } catch (e) {
    return null;
  }
}

// --- PII Data Masking for Security Compliance ---
export function maskNik(nik) {
  if (!nik || typeof nik !== 'string') return '-';
  const clean = nik.trim();
  if (clean.length < 8) return '******';
  return `${clean.slice(0, 6)}******${clean.slice(-4)}`;
}

export function maskAccountNumber(acc) {
  if (!acc || typeof acc !== 'string') return '-';
  const clean = acc.trim();
  if (clean.length < 8) return '****-****';
  return `${clean.slice(0, 4)}-**-*****-${clean.slice(-3)}`;
}

export function maskPhoneNumber(phone) {
  if (!phone || typeof phone !== 'string') return '-';
  const clean = phone.trim();
  if (clean.length < 7) return '****';
  return `${clean.slice(0, 4)}****${clean.slice(-3)}`;
}

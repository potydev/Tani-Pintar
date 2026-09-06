import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getUserMeta } from './security.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const READ_STATE_FILE = path.join(__dirname, 'notifications_state.json');

// Read states store: { [userEmailOrId]: { readIds: [string], allMarkedAt: number } }
let readStore = {};

try {
  if (fs.existsSync(READ_STATE_FILE)) {
    const raw = fs.readFileSync(READ_STATE_FILE, 'utf-8');
    readStore = JSON.parse(raw);
  }
} catch (e) {
  console.warn('[Notifications] Could not load notifications_state.json:', e.message);
}

function saveReadStore() {
  try {
    fs.writeFileSync(READ_STATE_FILE, JSON.stringify(readStore, null, 2), 'utf-8');
  } catch (e) {
    console.warn('[Notifications] Could not save notifications_state.json:', e.message);
  }
}

/**
 * Format relative time in Indonesian
 */
function getRelativeTime(timestamp) {
  const diffMs = Date.now() - new Date(timestamp).getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffMin < 1) return 'Baru saja';
  if (diffMin < 60) return `${diffMin} menit lalu`;
  if (diffHour < 24) return `${diffHour} jam lalu`;
  if (diffDay === 1) return 'Kemarin';
  return `${diffDay} hari lalu`;
}

/**
 * Generate real-time notifications for a specific user based on Supabase live data
 */
export async function getRealNotifications({ user = {}, supabase }) {
  const userEmail = (user.email || 'petani@tanipintar.id').toLowerCase().trim();
  const userName = user.full_name || 'Pak Joko Slamet';
  const location = user.farm_location || 'Cilacap, Jawa Tengah';
  const rawCommodity = user.primary_commodity || 'Cabai Merah';
  const commodity = rawCommodity.includes('Cabai') ? 'Cabai Merah' : rawCommodity;

  const userReadData = readStore[userEmail] || { readIds: [], allMarkedAt: 0 };
  const readIdsSet = new Set(userReadData.readIds || []);
  const allMarkedAt = userReadData.allMarkedAt || 0;

  const notifs = [];
  const now = Date.now();

  // 1. Live Market Signals (from Supabase harga_pangan)
  try {
    if (supabase) {
      // Query prices for this commodity across provinces
      const { data: prices } = await supabase
        .from('harga_pangan')
        .select('province_name, price, tanggal_bi, national_avg, commodity_name')
        .ilike('commodity_name', `%${commodity}%`)
        .order('tanggal_bi', { ascending: false })
        .limit(30);

      if (prices && prices.length > 0) {
        const sorted = [...prices].sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0));
        const highest = sorted[0];
        const localRecord = prices.find(p => p.province_name && p.province_name.toLowerCase().includes('jawa tengah')) || sorted[sorted.length - 1];

        const highPrice = Number(highest.price) || 85000;
        const localPrice = Number(localRecord.price) || 34225;
        const diffPercent = Math.round(((highPrice - localPrice) / localPrice) * 100);
        const estProfitPer500kg = (highPrice - localPrice) * 500;

        // Notif 1: Highest Arbitrage Destination Alert
        const notifMarketId = `market_arb_${commodity}_${highest.province_name}_${highest.tanggal_bi || 'today'}`;
        notifs.push({
          id: notifMarketId,
          type: 'market',
          category: 'Pasar & Harga',
          badge: 'Sinyal Pasar',
          badgeColor: 'emerald',
          title: `Peluang Arbitrase: ${commodity} +${diffPercent}%`,
          message: `Harga ${commodity} di ${highest.province_name} mencapai Rp ${highPrice.toLocaleString('id-ID')}/kg vs sentra Anda Rp ${localPrice.toLocaleString('id-ID')}/kg. Potensi laba kotor Rp ${estProfitPer500kg.toLocaleString('id-ID')} /500kg.`,
          actionUrl: '/dashboard',
          icon: 'trending-up',
          timestamp: new Date(highest.tanggal_bi || now - 1800000).toISOString(),
          time: getRelativeTime(highest.tanggal_bi || now - 1800000)
        });

        // Notif 2: Safe Bidding Price Floor
        const safeFloor = Math.round(localPrice * 0.92);
        const offerTarget = Math.round(localPrice * 1.12);
        const notifBidId = `market_bid_${commodity}_${localRecord.tanggal_bi || 'today'}`;
        notifs.push({
          id: notifBidId,
          type: 'market',
          category: 'Pasar & Harga',
          badge: 'Batas Tawar',
          badgeColor: 'blue',
          title: `Rekomendasi Buka Harga: Rp ${offerTarget.toLocaleString('id-ID')}/kg`,
          message: `Berdasarkan pantauan pasar terkini, tawarkan di Rp ${offerTarget.toLocaleString('id-ID')}/kg. Pasang batas negosiasi aman di Rp ${safeFloor.toLocaleString('id-ID')}/kg agar BEP terlindungi.`,
          actionUrl: '/dashboard',
          icon: 'shield-check',
          timestamp: new Date(now - 3600000 * 2).toISOString(),
          time: getRelativeTime(now - 3600000 * 2)
        });
      }
    }
  } catch (err) {
    console.warn('[Notifications] Error generating market notification:', err.message);
  }

  // 2. Real Marketplace Orders (from Supabase marketplace_orders)
  try {
    if (supabase) {
      const { data: recentOrders } = await supabase
        .from('marketplace_orders')
        .select(`
          id, quantity, total_price, status, created_at,
          marketplace_products ( name, unit, category )
        `)
        .order('created_at', { ascending: false })
        .limit(4);

      if (recentOrders && recentOrders.length > 0) {
        recentOrders.forEach(o => {
          const prodName = o.marketplace_products?.name || 'Komoditas Panen';
          const notifOrderId = `order_${o.id}_${o.status}`;
          let orderDesc = `Pesanan #${o.id} (${prodName}, ${o.quantity} kg) senilai Rp ${Number(o.total_price).toLocaleString('id-ID')}.`;
          
          if (o.status === 'Dalam Pengiriman') {
            orderDesc += ' Muatan telah diberangkatkan via armada kargo.';
          } else if (o.status === 'Selesai') {
            orderDesc += ' Transaksi selesai dan dana diteruskan ke saldo petani.';
          } else {
            orderDesc += ' Sedang menunggu konfirmasi jadwal timbang.';
          }

          notifs.push({
            id: notifOrderId,
            type: 'order',
            category: 'Pesanan',
            badge: 'Marketplace',
            badgeColor: 'amber',
            title: `Pesanan #${o.id}: ${o.status}`,
            message: orderDesc,
            actionUrl: '/marketplace',
            icon: 'package',
            timestamp: o.created_at || new Date(now - 7200000).toISOString(),
            time: getRelativeTime(o.created_at || now - 7200000)
          });
        });
      } else {
        // Welcoming marketplace order promo if no orders yet
        notifs.push({
          id: `order_promo_new`,
          type: 'order',
          category: 'Pesanan',
          badge: 'Peluang Panen',
          badgeColor: 'amber',
          title: 'Pasang Hasil Panen di Marketplace',
          message: 'Hubungkan hasil panen Anda langsung ke 1.200+ mitra grosir dan industri kuliner tanpa potongan perantara.',
          actionUrl: '/marketplace',
          icon: 'package',
          timestamp: new Date(now - 14400000).toISOString(),
          time: getRelativeTime(now - 14400000)
        });
      }
    }
  } catch (err) {
    console.warn('[Notifications] Error generating order notification:', err.message);
  }

  // 3. Account KYC & Verification Status
  const userMeta = getUserMeta(userEmail);
  const isApproved = userMeta.role === 'admin' || userMeta.role === 'verified_farmer' || userMeta.verification_status === 'approved';

  if (isApproved) {
    notifs.push({
      id: `acc_verified_${userEmail}`,
      type: 'account',
      category: 'Akun & Keamanan',
      badge: 'Terverifikasi',
      badgeColor: 'emerald',
      title: 'Akun Petani Binaan Terverifikasi',
      message: `Selamat ${userName}! Profil kebun Anda di ${location} telah terverifikasi dengan badge Centang Hijau resmi.`,
      actionUrl: '/dashboard',
      icon: 'check-circle-2',
      timestamp: new Date(now - 86400000).toISOString(),
      time: getRelativeTime(now - 86400000)
    });
  } else {
    notifs.push({
      id: `acc_pending_${userEmail}`,
      type: 'account',
      category: 'Akun & Keamanan',
      badge: 'Verifikasi',
      badgeColor: 'indigo',
      title: 'Verifikasi Lahan Sedang Ditinjau',
      message: 'Dokumen pengajuan petani binaan Anda sedang dalam proses verifikasi tim lapangan TaniPintar.',
      actionUrl: '/dashboard',
      icon: 'shield',
      timestamp: new Date(now - 43200000).toISOString(),
      time: getRelativeTime(now - 43200000)
    });
  }

  // 4. AI TaniBot Agricultural Alert
  notifs.push({
    id: `ai_tip_${commodity}_weather`,
    type: 'ai',
    category: 'Saran TaniBot',
    badge: 'AI Agronomi',
    badgeColor: 'purple',
    title: `Prakiraan Waktu Panen: ${commodity}`,
    message: `Cuaca sentra ${location} diprediksi cerah 3 hari ke depan. Disarankan petik saat kadar air optimal untuk menjaga grade komoditas.`,
    actionUrl: '/dashboard',
    icon: 'sparkles',
    timestamp: new Date(now - 21600000).toISOString(),
    time: getRelativeTime(now - 21600000)
  });

  // Apply read states
  const enrichedNotifs = notifs.map(n => {
    const isRead = readIdsSet.has(n.id) || (new Date(n.timestamp).getTime() <= allMarkedAt);
    return {
      ...n,
      unread: !isRead
    };
  });

  // Sort by timestamp descending
  enrichedNotifs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return enrichedNotifs;
}

/**
 * Mark a single notification as read
 */
export function markNotificationAsRead(userEmail, notifId) {
  if (!userEmail || !notifId) return;
  const key = userEmail.toLowerCase().trim();
  if (!readStore[key]) {
    readStore[key] = { readIds: [], allMarkedAt: 0 };
  }
  if (!readStore[key].readIds.includes(notifId)) {
    readStore[key].readIds.push(notifId);
    saveReadStore();
  }
}

/**
 * Mark all notifications as read for a user
 */
export function markAllNotificationsAsRead(userEmail) {
  if (!userEmail) return;
  const key = userEmail.toLowerCase().trim();
  if (!readStore[key]) {
    readStore[key] = { readIds: [], allMarkedAt: 0 };
  }
  readStore[key].allMarkedAt = Date.now();
  saveReadStore();
}

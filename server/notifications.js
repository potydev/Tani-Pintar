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
  const userEmail = (user.email || '').toLowerCase().trim();
  const userName = (user.full_name || '').trim();
  const userId = user.id || null;
  const location = user.farm_location || 'Cilacap, Jawa Tengah';
  const rawCommodity = user.primary_commodity || 'Cabai Merah';
  const commodity = rawCommodity.includes('Cabai') ? 'Cabai Merah' : rawCommodity;

  const storageKey = userEmail || (userId ? `uid_${userId}` : 'guest_session');
  const userReadData = readStore[storageKey] || (userEmail ? readStore[userEmail] : null) || { readIds: [], allMarkedAt: 0 };
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

  // 2. Real Marketplace Orders (strictly isolated per user account)
  try {
    if (supabase && (userId || (userName && userName.length > 2))) {
      const userOrders = [];

      // A. Buyer Orders: Orders placed by THIS user
      if (userId) {
        const { data: myPurchases } = await supabase
          .from('marketplace_orders')
          .select(`
            id, quantity, total_price, status, created_at, product_id,
            marketplace_products ( id, name, unit, category )
          `)
          .eq('buyer_id', userId)
          .order('created_at', { ascending: false })
          .limit(5);

        if (myPurchases && myPurchases.length > 0) {
          myPurchases.forEach(o => {
            const prodName = o.marketplace_products?.name || 'Komoditas Panen';
            let statusDesc = '';
            if (o.status === 'Dalam Pengiriman' || o.status === 'Siap Kirim / Dikirim') {
              statusDesc = 'Muatan telah diberangkatkan dan sedang dalam perjalanan armada kargo.';
            } else if (o.status === 'Selesai') {
              statusDesc = 'Pesanan telah diterima dengan baik. Transaksi selesai.';
            } else if (o.status === 'Diproses' || o.status === 'Diproses / Dikemas') {
              statusDesc = 'Petani sedang memilah dan mengemas komoditas pesanan Anda.';
            } else {
              statusDesc = 'Menunggu konfirmasi penjual untuk verifikasi stok dan jadwal muat.';
            }

            userOrders.push({
              id: `order_buyer_${o.id}_${o.status}`,
              type: 'order',
              category: 'Pesanan',
              badge: 'Pembelian Anda',
              badgeColor: 'blue',
              title: `Pesanan #${o.id}: ${o.status}`,
              message: `Pembelian ${prodName} (${o.quantity} kg) senilai Rp ${Number(o.total_price).toLocaleString('id-ID')}. ${statusDesc}`,
              actionUrl: '/dashboard?tab=orders',
              icon: 'shopping-bag',
              timestamp: o.created_at || new Date(now - 3600000).toISOString(),
              time: getRelativeTime(o.created_at || now - 3600000)
            });
          });
        }
      }

      // B. Seller Orders: Incoming orders for products strictly belonging to THIS user (seller_id)
      let myProductIds = [];
      if (userId) {
        const { data: prodsBySellerId } = await supabase
          .from('marketplace_products')
          .select('id')
          .eq('seller_id', userId);
        if (prodsBySellerId && prodsBySellerId.length > 0) {
          myProductIds.push(...prodsBySellerId.map(p => p.id));
        }
      }

      if (myProductIds.length > 0) {
        const { data: incomingSales } = await supabase
          .from('marketplace_orders')
          .select(`
            id, quantity, total_price, status, created_at, product_id,
            marketplace_products ( id, name, unit, category )
          `)
          .in('product_id', myProductIds)
          .order('created_at', { ascending: false })
          .limit(5);

        if (incomingSales && incomingSales.length > 0) {
          incomingSales.forEach(o => {
            const prodName = o.marketplace_products?.name || 'Komoditas Panen';
            userOrders.push({
              id: `order_seller_${o.id}_${o.status}`,
              type: 'order',
              category: 'Pesanan',
              badge: 'Pesanan Masuk',
              badgeColor: 'amber',
              title: `Pesanan Masuk #${o.id}: ${o.status}`,
              message: `Ada pesanan masuk untuk ${prodName} (${o.quantity} kg) senilai Rp ${Number(o.total_price).toLocaleString('id-ID')}. Status saat ini: ${o.status}.`,
              actionUrl: '/dashboard?tab=orders',
              icon: 'package',
              timestamp: o.created_at || new Date(now - 7200000).toISOString(),
              time: getRelativeTime(o.created_at || now - 7200000)
            });
          });
        }
      }

      // If user has orders, display their own orders. If 0 orders, show onboarding promo (NEVER stranger orders!)
      if (userOrders.length > 0) {
        notifs.push(...userOrders);
      } else {
        notifs.push({
          id: `order_promo_${storageKey}`,
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
    } else {
      // Guest user or unauthenticated
      notifs.push({
        id: `order_promo_guest`,
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
  } catch (err) {
    console.warn('[Notifications] Error generating order notification:', err.message);
  }

  // 3. Account KYC & Verification Status (Only if user has an account)
  if (userEmail) {
    const userMeta = getUserMeta(userEmail);
    const isApproved = userMeta.role === 'verified_farmer' || userMeta.verification_status === 'approved';

    if (isApproved) {
      notifs.push({
        id: `acc_verified_${userEmail}`,
        type: 'account',
        category: 'Akun & Keamanan',
        badge: 'Terverifikasi',
        badgeColor: 'emerald',
        title: 'Akun Petani Binaan Terverifikasi',
        message: `Selamat ${userName || 'Mitra Petani'}! Profil kebun Anda di ${location} telah terverifikasi dengan badge Centang Hijau resmi.`,
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
  }

  // 4. AI TaniBot Agricultural Alert
  notifs.push({
    id: `ai_tip_${commodity}_${location.replace(/[^a-zA-Z0-9]/g, '_')}`,
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
export function markNotificationAsRead(userEmailOrId, notifId) {
  if (!userEmailOrId || !notifId) return;
  const key = String(userEmailOrId).toLowerCase().trim();
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
export function markAllNotificationsAsRead(userEmailOrId) {
  if (!userEmailOrId) return;
  const key = String(userEmailOrId).toLowerCase().trim();
  if (!readStore[key]) {
    readStore[key] = { readIds: [], allMarkedAt: 0 };
  }
  readStore[key].allMarkedAt = Date.now();
  saveReadStore();
}

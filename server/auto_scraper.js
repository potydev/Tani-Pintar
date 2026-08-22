import { createClient } from '@supabase/supabase-js';
import cron from 'node-cron';

// Auto-load .env file in Node.js
if (typeof process.loadEnvFile === 'function') {
  try { process.loadEnvFile(); } catch (e) {}
}

const supabaseUrl = process.env.SUPABASE_URL || 'https://cjwmyzgqvciorchchfod.supabase.co';
const supabaseKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

const BASE_URL = "https://www.bi.go.id/hargapangan/WebSite/Home/";
const HEADERS = {
  "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  "Referer": "https://www.bi.go.id/hargapangan/Home"
};

const COMMODITIES = {
  "1_1": "Beras Kualitas Bawah I",
  "1_3": "Beras Kualitas Medium I",
  "1_5": "Beras Kualitas Super I",
  "2_7": "Daging Ayam Ras Segar",
  "3_8": "Daging Sapi Kualitas 1",
  "4_10": "Telur Ayam Ras Segar",
  "5_11": "Bawang Merah Ukuran Sedang",
  "6_12": "Bawang Putih Ukuran Sedang",
  "7_13": "Cabai Merah Besar",
  "7_14": "Cabai Merah Keriting",
  "8_15": "Cabai Rawit Hijau",
  "8_16": "Cabai Rawit Merah",
  "9_17": "Minyak Goreng Curah",
  "10_20": "Gula Pasir Kualitas Premium"
};

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function formatBiDateParam(dateObj) {
  const m = MONTH_NAMES[dateObj.getMonth()];
  const d = dateObj.getDate();
  const y = dateObj.getFullYear();
  return `${m} ${d}, ${y}`;
}

function parseBiDateToSql(dateStr) {
  if (!dateStr) return null;
  try {
    const parts = dateStr.trim().split(/\s+/);
    if (parts.length < 3) return null;
    const day = parseInt(parts[0]);
    const monthStr = parts[1].toLowerCase();
    const yearStr = parts[2];
    const monthsMap = {
      jan: 1, feb: 2, mar: 3, apr: 4, mei: 5, jun: 6,
      jul: 7, agt: 8, aug: 8, sep: 9, okt: 10, oct: 10, nov: 11, des: 12, dec: 12
    };
    const month = monthsMap[monthStr] || 1;
    const year = yearStr.length === 2 ? 2000 + parseInt(yearStr) : parseInt(yearStr);
    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  } catch (e) {
    return null;
  }
}

async function fetchGridData(dateStr, commodityId) {
  const url = `${BASE_URL}GetGridData1?tanggal=${encodeURIComponent(dateStr)}&commodity=${commodityId}&priceType=1&isPasokan=1&jenis=1&periode=1&provId=0&_=${Date.now()}`;
  try {
    const res = await fetch(url, { headers: HEADERS });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch (err) {
    console.warn(`    [WARN] Failed to fetch ${commodityId} for ${dateStr}:`, err.message);
    return [];
  }
}

export async function scrapeRecentDays(daysCount = 3) {
  console.log('====================================================');
  console.log(`  Scraping Last ${daysCount} Days Price Data to Supabase`);
  console.log('====================================================');

  const today = new Date();
  const datesToScrape = [];

  for (let i = daysCount - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    datesToScrape.push(d);
  }

  let totalInserted = 0;

  for (const dateObj of datesToScrape) {
    const biDateStr = formatBiDateParam(dateObj);
    console.log(`\n📅 Scraping BI PIHPS for Date: ${biDateStr}...`);

    const recordsToInsert = [];

    for (const [commId, commName] of Object.entries(COMMODITIES)) {
      process.stdout.write(`  -> Fetching ${commName} (${commId})... `);
      const gridItems = await fetchGridData(biDateStr, commId);

      if (gridItems && gridItems.length > 0) {
        console.log(`Found ${gridItems.length} regional records.`);

        for (const item of gridItems) {
          const rawPrice = item.Nilai;
          const price = typeof rawPrice === 'number' ? rawPrice : parseFloat(rawPrice || 0);
          if (isNaN(price) || price <= 0) continue;

          const provId = item.ProvID || 0;
          const provName = item.Provinsi || 'Nasional';
          const tanggalSql = parseBiDateToSql(item.Tanggal) || dateObj.toISOString().split('T')[0];
          const priceDiff = item.NilaiDiff ? String(item.NilaiDiff) : 'Rp0';
          const natAvg = parseFloat(item.SemuaProvinsi || price);
          const pctChange = parseFloat(item.Percentage || 0);

          recordsToInsert.push({
            commodity_id: commId,
            commodity_name: commName,
            prov_id: provId,
            province_name: provName,
            tanggal_bi: tanggalSql,
            price: price,
            price_diff: priceDiff,
            national_avg: isNaN(natAvg) ? price : natAvg,
            percentage_change: isNaN(pctChange) ? 0 : pctChange
          });
        }
      } else {
        console.log(`No online data available (weekend/holiday).`);
      }

      // Small throttle delay
      await new Promise(r => setTimeout(r, 250));
    }

    if (recordsToInsert.length > 0) {
      console.log(`💾 Upserting ${recordsToInsert.length} records to Supabase PostgreSQL...`);
      const batchSize = 200;
      for (let i = 0; i < recordsToInsert.length; i += batchSize) {
        const batch = recordsToInsert.slice(i, i + batchSize);
        const { error } = await supabase
          .from('harga_pangan')
          .upsert(batch, { onConflict: 'commodity_id,prov_id,tanggal_bi' });

        if (error) {
          console.error(`❌ Supabase Upsert Error:`, error.message);
        } else {
          totalInserted += batch.length;
        }
      }
    }
  }

  console.log('\n====================================================');
  console.log(`🎉 SUCCESS! Completed scraping & inserted ${totalInserted} records to Supabase.`);
  console.log('====================================================');
  return totalInserted;
}

// Function to start the 08:00 AM Cron Schedule
export function initAutoScraperCron() {
  console.log('⏰ [Cron Scheduler] Initializing Daily 08:00 AM WIB Price Scraper Cron Job...');
  
  // '0 8 * * *' = Every day at 08:00 AM Asia/Jakarta time
  cron.schedule('0 8 * * *', async () => {
    console.log('⏰ [CRON TRIGGER] Executing daily 08:00 AM BI PIHPS Scraper...');
    try {
      await scrapeRecentDays(1);
    } catch (err) {
      console.error('❌ [CRON ERROR] Failed daily scraper execution:', err);
    }
  }, {
    timezone: "Asia/Jakarta"
  });
}

// Execute standalone if called directly
if (process.argv[1] && process.argv[1].includes('auto_scraper.js')) {
  scrapeRecentDays(3);
}

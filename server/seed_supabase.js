import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supabaseUrl = process.env.SUPABASE_URL || 'https://cjwmyzgqvciorchchfod.supabase.co';
const supabaseKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  console.log('====================================================');
  console.log('  Seeding 4,276 Records to Supabase PostgreSQL');
  console.log('====================================================');

  const filePath = path.join(__dirname, 'harga_pangan_export.json');
  if (!fs.existsSync(filePath)) {
    console.error('File server/harga_pangan_export.json not found!');
    process.exit(1);
  }

  const rawData = fs.readFileSync(filePath, 'utf-8');
  const records = JSON.parse(rawData);

  console.log(`Loaded ${records.length} records. Starting batch upload to Supabase...`);

  // Format data for Supabase
  const formattedRecords = records.map(r => ({
    commodity_id: r.commodity_id,
    commodity_name: r.commodity_name,
    prov_id: r.prov_id,
    province_name: r.province_name,
    tanggal_bi: r.tanggal_bi,
    price: parseFloat(r.price),
    price_diff: r.price_diff,
    national_avg: parseFloat(r.national_avg),
    percentage_change: parseFloat(r.percentage_change),
    created_at: r.created_at || new Date().toISOString()
  }));

  const batchSize = 250;
  let insertedCount = 0;

  for (let i = 0; i < formattedRecords.length; i += batchSize) {
    const batch = formattedRecords.slice(i, i + batchSize);
    const { data, error } = await supabase
      .from('harga_pangan')
      .upsert(batch, { onConflict: 'commodity_id,prov_id,tanggal_bi' });

    if (error) {
      console.error(`Batch upload error [${i} - ${i + batch.length}]:`, error);
      if (error.code === 'PGRST205') {
        console.error('\n⚠️ TABLE NOT FOUND IN SUPABASE!');
        console.error('Silakan buat tabel "harga_pangan" terlebih dahulu di Supabase SQL Editor.');
        console.error('Jalankan SQL Query berikut di Supabase SQL Editor:\n');
        console.error(`
CREATE TABLE IF NOT EXISTS harga_pangan (
  id SERIAL PRIMARY KEY,
  commodity_id VARCHAR(20) NOT NULL,
  commodity_name VARCHAR(100) NOT NULL,
  prov_id INT NOT NULL,
  province_name VARCHAR(100) NOT NULL,
  tanggal_bi DATE NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  price_diff VARCHAR(50),
  national_avg NUMERIC(10,2),
  percentage_change NUMERIC(5,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT uq_commodity_prov_date UNIQUE (commodity_id, prov_id, tanggal_bi)
);
CREATE INDEX IF NOT EXISTS idx_harga_pangan_query ON harga_pangan (commodity_name, province_name, tanggal_bi);
        `);
        process.exit(1);
      }
    } else {
      insertedCount += batch.length;
      console.log(`  Uploaded ${insertedCount} / ${formattedRecords.length} records...`);
    }
  }

  console.log('====================================================');
  console.log(`🎉 SUCCESS! Uploaded ${insertedCount} records to Supabase.`);
  console.log('====================================================');
}

seed();

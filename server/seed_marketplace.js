import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || 'https://cjwmyzgqvciorchchfod.supabase.co';
const supabaseKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const PRODUCTS = [
  { name: "Cabai Merah Besar", category: "cabai", price: 42000, unit: "kg", min_order: 50, stock: 2500, farmer_name: "Pak Joko Slamet", location: "Cilacap, Jawa Tengah", rating: 4.8, total_sold: 12400, harvest_date: "2026-08-24", grade: "Premium A", freshness: "Segar", description: "Cabai merah besar segar langsung dari kebun petani binaan. Kualitas premium, ukuran seragam, warna merah cerah.", trending: true, price_change: 3.2, verified_seller: true, tags: '["Organik","Petani Binaan","Segar"]' },
  { name: "Bawang Merah Brebes", category: "bawang", price: 35000, unit: "kg", min_order: 100, stock: 5000, farmer_name: "Bu Siti Nurjanah", location: "Brebes, Jawa Tengah", rating: 4.9, total_sold: 18200, harvest_date: "2026-08-22", grade: "Super", freshness: "Segar", description: "Bawang merah varietas Brebes unggulan. Aroma kuat, tahan simpan lama, cocok untuk industri dan retail.", trending: true, price_change: -1.5, verified_seller: true, tags: '["Varietas Brebes","Tahan Lama"]' },
  { name: "Cabai Rawit Merah", category: "cabai", price: 55000, unit: "kg", min_order: 25, stock: 800, farmer_name: "Pak Bambang Hermanto", location: "Malang, Jawa Timur", rating: 4.7, total_sold: 8900, harvest_date: "2026-08-25", grade: "Premium A", freshness: "Sangat Segar", description: "Cabai rawit merah dari dataran tinggi Malang. Tingkat kepedasan tinggi, cocok untuk sambal dan industri makanan.", trending: false, price_change: 5.8, verified_seller: true, tags: '["Dataran Tinggi","Pedas Ekstra"]' },
  { name: "Beras IR 64 Premium", category: "padi", price: 14500, unit: "kg", min_order: 500, stock: 15000, farmer_name: "Koperasi Tani Sejahtera", location: "Karawang, Jawa Barat", rating: 4.6, total_sold: 45000, harvest_date: "2026-08-15", grade: "Premium", freshness: "Segar", description: "Beras IR 64 premium dari persawahan Karawang. Pulen, wangi alami, dan telah melalui proses pengeringan optimal.", trending: false, price_change: 0.5, verified_seller: true, tags: '["Pulen","Wangi Alami","Koperasi"]' },
  { name: "Tomat Segar Organik", category: "sayuran", price: 12000, unit: "kg", min_order: 100, stock: 3500, farmer_name: "Pak Ahmad Ridwan", location: "Garut, Jawa Barat", rating: 4.5, total_sold: 6700, harvest_date: "2026-08-25", grade: "A", freshness: "Sangat Segar", description: "Tomat organik dari perkebunan Garut. Tanpa pestisida kimia, cocok untuk konsumsi langsung dan olahan.", trending: false, price_change: -2.1, verified_seller: false, tags: '["Organik","Tanpa Pestisida"]' },
  { name: "Bawang Putih Lokal", category: "bawang", price: 38000, unit: "kg", min_order: 50, stock: 2000, farmer_name: "Pak Darmawan", location: "Temanggung, Jawa Tengah", rating: 4.4, total_sold: 5200, harvest_date: "2026-08-20", grade: "A", freshness: "Segar", description: "Bawang putih varietas lokal Temanggung. Siung besar, aroma khas, cocok untuk bumbu masakan tradisional.", trending: false, price_change: 1.2, verified_seller: true, tags: '["Lokal","Siung Besar"]' },
  { name: "Cabai Hijau Besar", category: "cabai", price: 28000, unit: "kg", min_order: 50, stock: 1800, farmer_name: "Ibu Rina Wati", location: "Boyolali, Jawa Tengah", rating: 4.6, total_sold: 7300, harvest_date: "2026-08-24", grade: "A", freshness: "Segar", description: "Cabai hijau besar segar dari petani Boyolali. Ukuran seragam, cocok untuk sayur dan sambal hijau.", trending: false, price_change: -0.8, verified_seller: true, tags: '["Segar","Ukuran Besar"]' },
  { name: "Jahe Merah Segar", category: "rempah", price: 65000, unit: "kg", min_order: 20, stock: 600, farmer_name: "Kelompok Tani Makmur", location: "Wonogiri, Jawa Tengah", rating: 4.9, total_sold: 3400, harvest_date: "2026-08-22", grade: "Super Premium", freshness: "Segar", description: "Jahe merah organik dari Wonogiri. Kandungan minyak atsiri tinggi, cocok untuk herbal, jamu, dan ekspor.", trending: true, price_change: 8.5, verified_seller: true, tags: '["Organik","Herbal","Ekspor"]' },
  { name: "Kentang Dieng Premium", category: "sayuran", price: 16000, unit: "kg", min_order: 200, stock: 8000, farmer_name: "Pak Sugianto", location: "Wonosobo, Jawa Tengah", rating: 4.7, total_sold: 21000, harvest_date: "2026-08-21", grade: "Premium", freshness: "Segar", description: "Kentang dari dataran tinggi Dieng. Tekstur padat, rasa manis alami, cocok untuk gorengan dan industri makanan.", trending: false, price_change: 2.0, verified_seller: true, tags: '["Dataran Tinggi","Dieng"]' },
  { name: "Mangga Gedong Gincu", category: "buah", price: 25000, unit: "kg", min_order: 50, stock: 4000, farmer_name: "Pak Hasan Basri", location: "Indramayu, Jawa Barat", rating: 4.8, total_sold: 9800, harvest_date: "2026-08-23", grade: "Super", freshness: "Matang Pohon", description: "Mangga Gedong Gincu premium. Manis, wangi, warna kuning kemerahan cerah. Buah unggulan Indramayu.", trending: true, price_change: 4.3, verified_seller: true, tags: '["Matang Pohon","Premium","Ekspor"]' },
  { name: "Kunyit Segar", category: "rempah", price: 22000, unit: "kg", min_order: 30, stock: 1200, farmer_name: "Bu Endang Susanti", location: "Pacitan, Jawa Timur", rating: 4.3, total_sold: 2100, harvest_date: "2026-08-24", grade: "A", freshness: "Segar", description: "Kunyit segar dari Pacitan. Warna kuning cerah, cocok untuk bumbu, jamu, dan pewarna alami makanan.", trending: false, price_change: 1.0, verified_seller: false, tags: '["Pewarna Alami","Jamu"]' },
  { name: "Jeruk Siam Pontianak", category: "buah", price: 18000, unit: "kg", min_order: 100, stock: 6000, farmer_name: "Kelompok Tani Citrus", location: "Pontianak, Kalimantan Barat", rating: 4.5, total_sold: 15600, harvest_date: "2026-08-20", grade: "Premium", freshness: "Segar", description: "Jeruk Siam khas Pontianak. Manis segar dengan kadar air tinggi, populer di seluruh Nusantara.", trending: false, price_change: -0.5, verified_seller: true, tags: '["Kalimantan","Manis Segar"]' },
];

async function seed() {
  console.log('=== Seeding marketplace_products to Supabase ===');

  // Create table first
  const { error: createErr } = await supabase.rpc('exec_sql', { sql: `
    CREATE TABLE IF NOT EXISTS marketplace_products (
      id SERIAL PRIMARY KEY,
      seller_id INT,
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
    );
  `});

  if (createErr) {
    console.log('Note: RPC exec_sql not available, table must be created via SQL Editor.');
    console.log('Attempting direct insert anyway...');
  }

  // Clear existing
  await supabase.from('marketplace_products').delete().neq('id', 0);

  // Insert products
  const { data, error } = await supabase
    .from('marketplace_products')
    .insert(PRODUCTS)
    .select();

  if (error) {
    console.error('Error inserting products:', error);
    console.log('\n⚠️  You need to create the table first! Run this SQL in Supabase SQL Editor:\n');
    console.log(`CREATE TABLE IF NOT EXISTS marketplace_products (
  id SERIAL PRIMARY KEY, seller_id INT, name VARCHAR(150) NOT NULL,
  category VARCHAR(50) NOT NULL, price NUMERIC(12,2) NOT NULL,
  unit VARCHAR(20) DEFAULT 'kg', min_order INT DEFAULT 50,
  stock INT NOT NULL DEFAULT 0, farmer_name VARCHAR(100) NOT NULL,
  location VARCHAR(100) NOT NULL, rating NUMERIC(2,1) DEFAULT 5.0,
  reviews_count INT DEFAULT 0, total_sold INT DEFAULT 0,
  harvest_date DATE, grade VARCHAR(30) DEFAULT 'Grade A',
  freshness VARCHAR(30) DEFAULT 'Segar', organic BOOLEAN DEFAULT FALSE,
  verified_seller BOOLEAN DEFAULT TRUE, image_url TEXT, description TEXT,
  tags TEXT DEFAULT '[]', price_change NUMERIC(5,2) DEFAULT 0,
  trending BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);`);
  } else {
    console.log(`✅ Successfully inserted ${data.length} products!`);
  }
}

seed();

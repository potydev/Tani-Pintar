const fs = require('fs');
const env = fs.readFileSync('.env', 'utf8');
const url = env.match(/SUPABASE_URL=(.*)/)?.[1]?.trim();
const key = env.match(/SUPABASE_SECRET_KEY=(.*)/)?.[1]?.trim() || env.match(/SUPABASE_KEY=(.*)/)?.[1]?.trim();
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(url, key);

const REAL_PRODUCTS = [
  {
    name: "Cabai Merah Besar",
    category: "cabai",
    price: 42000,
    unit: "kg",
    min_order: 50,
    stock: 2500,
    farmer_name: "Pak Joko Slamet",
    location: "Cilacap, Jawa Tengah",
    rating: 4.8,
    reviews_count: 34,
    harvest_date: "2026-08-24",
    grade: "Premium A",
    organic: true,
    verified_seller: true,
    image_url: "https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=600&q=80",
    description: "Cabai merah besar segar langsung dari kebun petani binaan Cilacap. Kualitas premium, ukuran seragam, warna merah cerah alami."
  },
  {
    name: "Bawang Merah Brebes",
    category: "bawang",
    price: 35000,
    unit: "kg",
    min_order: 100,
    stock: 5000,
    farmer_name: "Bu Siti Nurjanah",
    location: "Brebes, Jawa Tengah",
    rating: 4.9,
    reviews_count: 52,
    harvest_date: "2026-08-22",
    grade: "Super",
    organic: false,
    verified_seller: true,
    image_url: "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=600&q=80",
    description: "Bawang merah varietas Brebes unggulan. Aroma kuat, kadar air rendah, tahan simpan lama untuk grosir dan industri."
  },
  {
    name: "Cabai Rawit Merah",
    category: "cabai",
    price: 55000,
    unit: "kg",
    min_order: 25,
    stock: 800,
    farmer_name: "Pak Bambang Hermanto",
    location: "Malang, Jawa Timur",
    rating: 4.7,
    reviews_count: 29,
    harvest_date: "2026-08-25",
    grade: "Premium A",
    organic: false,
    verified_seller: true,
    image_url: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=600&q=80",
    description: "Cabai rawit merah dari dataran tinggi Malang. Tingkat kepedasan tinggi, petik segar setiap pagi."
  },
  {
    name: "Beras IR 64 Premium",
    category: "padi",
    price: 14500,
    unit: "kg",
    min_order: 500,
    stock: 15000,
    farmer_name: "Koperasi Tani Sejahtera",
    location: "Karawang, Jawa Barat",
    rating: 4.6,
    reviews_count: 88,
    harvest_date: "2026-08-15",
    grade: "Premium",
    organic: false,
    verified_seller: true,
    image_url: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80",
    description: "Beras IR 64 premium dari lumbung padi Karawang. Pulen, wangi alami, tanpa pemutih atau pengawet."
  },
  {
    name: "Tomat Segar Organik",
    category: "sayuran",
    price: 12000,
    unit: "kg",
    min_order: 100,
    stock: 3500,
    farmer_name: "Pak Ahmad Ridwan",
    location: "Garut, Jawa Barat",
    rating: 4.5,
    reviews_count: 18,
    harvest_date: "2026-08-25",
    grade: "Grade A",
    organic: true,
    verified_seller: false,
    image_url: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80",
    description: "Tomat organik dari lahan pegunungan Garut. Bebas zat kimia, kaya antioksidan, cocok untuk konsumsi harian."
  },
  {
    name: "Bawang Putih Lokal",
    category: "bawang",
    price: 38000,
    unit: "kg",
    min_order: 50,
    stock: 2000,
    farmer_name: "Pak Darmawan",
    location: "Temanggung, Jawa Tengah",
    rating: 4.4,
    reviews_count: 15,
    harvest_date: "2026-08-20",
    grade: "Grade A",
    organic: false,
    verified_seller: true,
    image_url: "https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?auto=format&fit=crop&w=600&q=80",
    description: "Bawang putih varietas lokal Temanggung. Siung padat dan beraroma harum khas masakan Nusantara."
  },
  {
    name: "Cabai Hijau Besar",
    category: "cabai",
    price: 28000,
    unit: "kg",
    min_order: 50,
    stock: 1800,
    farmer_name: "Ibu Rina Wati",
    location: "Boyolali, Jawa Tengah",
    rating: 4.6,
    reviews_count: 22,
    harvest_date: "2026-08-24",
    grade: "Grade A",
    organic: false,
    verified_seller: true,
    image_url: "https://images.unsplash.com/photo-1526346698789-22fd84314424?auto=format&fit=crop&w=600&q=80",
    description: "Cabai hijau besar pilihan dari Boyolali. Tekstur renyah, warna hijau segar konsisten."
  },
  {
    name: "Jahe Merah Segar",
    category: "rempah",
    price: 65000,
    unit: "kg",
    min_order: 20,
    stock: 600,
    farmer_name: "Kelompok Tani Makmur",
    location: "Wonogiri, Jawa Tengah",
    rating: 4.9,
    reviews_count: 41,
    harvest_date: "2026-08-22",
    grade: "Super Premium",
    organic: true,
    verified_seller: true,
    image_url: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80",
    description: "Jahe merah rimpang tua dari Wonogiri. Rasa hangat pekat, kandungan atsiri tinggi untuk industri minuman dan herbal."
  },
  {
    name: "Kentang Dieng Premium",
    category: "sayuran",
    price: 16000,
    unit: "kg",
    min_order: 200,
    stock: 8000,
    farmer_name: "Pak Sugianto",
    location: "Wonosobo, Jawa Tengah",
    rating: 4.7,
    reviews_count: 64,
    harvest_date: "2026-08-21",
    grade: "Premium",
    organic: false,
    verified_seller: true,
    image_url: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=600&q=80",
    description: "Kentang Dieng kualitas super. Umbi bersih, tidak mudah busuk, sangat ideal untuk restoran dan pengolahan kripik."
  },
  {
    name: "Mangga Gedong Gincu",
    category: "buah",
    price: 25000,
    unit: "kg",
    min_order: 50,
    stock: 4000,
    farmer_name: "Pak Hasan Basri",
    location: "Indramayu, Jawa Barat",
    rating: 4.8,
    reviews_count: 37,
    harvest_date: "2026-08-23",
    grade: "Super",
    organic: false,
    verified_seller: true,
    image_url: "https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=600&q=80",
    description: "Mangga Gedong Gincu asli Indramayu. Matang pohon, manis legit, aroma harum semerbak."
  }
];

async function seed() {
  console.log('Clearing existing products in Supabase...');
  await supabase.from('marketplace_products').delete().neq('id', 0);

  console.log('Inserting real products into Supabase marketplace_products table...');
  const { data, error } = await supabase.from('marketplace_products').insert(REAL_PRODUCTS).select();

  if (error) {
    console.error('Seeding Error:', error);
  } else {
    console.log(`✅ SUCCESS! Inserted ${data.length} real commodity products into Supabase PostgreSQL!`);
  }
}

seed();

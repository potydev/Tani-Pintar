import mysql from 'mysql2/promise';
import pg from 'pg';

const { Pool: PgPool } = pg;

// Connection configurations
const postgresConnectionString = process.env.DATABASE_URL || process.argv[2];

if (!postgresConnectionString) {
  console.error('Usage: node server/migrate_to_supabase.js "<SUPABASE_DATABASE_URL>"');
  console.error('Example: node server/migrate_to_supabase.js "postgres://postgres.xxx:password@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres"');
  process.exit(1);
}

const mysqlConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'Sandibaruu11',
  database: process.env.DB_NAME || 'db_tani_pintar',
  port: parseInt(process.env.DB_PORT || '3306')
};

async function migrate() {
  console.log('====================================================');
  console.log('  Migrating db_tani_pintar -> Supabase PostgreSQL');
  console.log('====================================================');

  const pgPool = new PgPool({
    connectionString: postgresConnectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    // 1. Create table in Supabase PostgreSQL
    console.log('[1/3] Creating table "harga_pangan" in Supabase PostgreSQL...');
    await pgPool.query(`
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
    console.log('✔ Table "harga_pangan" created or verified.');

    // 2. Fetch rows from MySQL
    console.log('[2/3] Reading records from MySQL database...');
    const mysqlConn = await mysql.createConnection(mysqlConfig);
    const [rows] = await mysqlConn.query('SELECT * FROM harga_pangan ORDER BY id ASC');
    console.log(`✔ Read ${rows.length} records from MySQL.`);
    await mysqlConn.end();

    // 3. Insert in batches into Supabase PostgreSQL
    console.log(`[3/3] Inserting ${rows.length} records into Supabase PostgreSQL...`);
    let inserted = 0;
    const batchSize = 250;

    for (let i = 0; i < rows.length; i += batchSize) {
      const batch = rows.slice(i, i + batchSize);
      for (const r of batch) {
        const query = `
          INSERT INTO harga_pangan (commodity_id, commodity_name, prov_id, province_name, tanggal_bi, price, price_diff, national_avg, percentage_change, created_at)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
          ON CONFLICT (commodity_id, prov_id, tanggal_bi) DO UPDATE SET
            price = EXCLUDED.price,
            price_diff = EXCLUDED.price_diff,
            national_avg = EXCLUDED.national_avg,
            percentage_change = EXCLUDED.percentage_change;
        `;
        const values = [
          r.commodity_id,
          r.commodity_name,
          r.prov_id,
          r.province_name,
          r.tanggal_bi,
          r.price,
          r.price_diff,
          r.national_avg,
          r.percentage_change,
          r.created_at || new Date()
        ];
        await pgPool.query(query, values);
        inserted++;
      }
      console.log(`  Progress: ${inserted} / ${rows.length} records processed...`);
    }

    console.log('====================================================');
    console.log(`🎉 MIGRATION SUCCESSFUL! ${inserted} records in Supabase PostgreSQL.`);
    console.log('====================================================');
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    await pgPool.end();
  }
}

migrate();

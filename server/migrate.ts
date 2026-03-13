import pg from "pg";

export async function runMigrations() {
  if (!process.env.DATABASE_URL) {
    console.warn("DATABASE_URL not set, skipping migrations");
    return;
  }

  const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();

  console.log("Running database migrations...");

  await client.query(`
    CREATE TABLE IF NOT EXISTS users (
      id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
      username TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS clients (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      phone TEXT,
      company TEXT,
      password_hash TEXT NOT NULL,
      is_verified BOOLEAN DEFAULT false,
      discount INTEGER DEFAULT 0,
      manager_id TEXT,
      created_at TIMESTAMP DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      client_id TEXT,
      client_name TEXT,
      client_phone TEXT,
      company TEXT,
      items JSONB,
      total_price INTEGER,
      branding TEXT,
      comment TEXT,
      status TEXT DEFAULT 'new',
      manager_id TEXT,
      created_at TIMESTAMP DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS wishlist (
      id TEXT PRIMARY KEY,
      client_id TEXT NOT NULL,
      product_id TEXT NOT NULL,
      added_at TIMESTAMP DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS managers (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      phone TEXT,
      created_at TIMESTAMP DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS proposals (
      id TEXT PRIMARY KEY,
      manager_id TEXT NOT NULL,
      manager_name TEXT,
      manager_phone TEXT,
      client_id TEXT,
      title TEXT,
      client_name TEXT,
      client_contact TEXT,
      client_logo_url TEXT,
      branding TEXT,
      comment TEXT,
      items JSONB,
      valid_days INTEGER DEFAULT 30,
      views INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS subscribers (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      name TEXT,
      is_active BOOLEAN DEFAULT true,
      subscribed_at TIMESTAMP DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS product_cache (
      id TEXT PRIMARY KEY,
      data JSONB,
      synced_at TIMESTAMP DEFAULT now()
    );
  `);

  console.log("Database migrations complete.");
  await client.end();
}

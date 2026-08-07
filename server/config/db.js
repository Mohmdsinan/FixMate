const { Pool } = require('pg');
const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

let pgPool = null;
let sqliteDb = null;
let mode = 'sqlite'; // 'pg' or 'sqlite'

if (process.env.DATABASE_URL) {
  try {
    pgPool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    });
    mode = 'pg';
    console.log('[DB] Using PostgreSQL connection pool.');
  } catch (err) {
    console.warn('[DB] Failed to connect via DATABASE_URL, falling back to local SQLite:', err.message);
  }
}

if (mode === 'sqlite') {
  const dbPath = path.join(__dirname, '..', 'fixmate.db');
  sqliteDb = new Database(dbPath);
  sqliteDb.pragma('foreign_keys = ON');
  console.log(`[DB] Using local SQLite database at ${dbPath}`);
}

// Auto init SQLite schema if using sqlite mode
function initDb() {
  if (mode === 'sqlite') {
    sqliteDb.exec(`
      CREATE TABLE IF NOT EXISTS customers (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        phone TEXT,
        password_hash TEXT NOT NULL,
        address TEXT,
        is_suspended INTEGER DEFAULT 0,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS workers (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        phone TEXT,
        password_hash TEXT NOT NULL,
        profession TEXT,
        experience_years INTEGER DEFAULT 0,
        description TEXT,
        profile_photo_url TEXT,
        service_area TEXT,
        price_min REAL,
        price_max REAL,
        is_available INTEGER DEFAULT 1,
        is_verified INTEGER DEFAULT 0,
        is_suspended INTEGER DEFAULT 0,
        rating_avg REAL DEFAULT 0,
        rating_count INTEGER DEFAULT 0,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS categories (
        id TEXT PRIMARY KEY,
        name TEXT UNIQUE NOT NULL,
        icon TEXT
      );

      CREATE TABLE IF NOT EXISTS worker_categories (
        worker_id TEXT,
        category_id TEXT,
        PRIMARY KEY (worker_id, category_id),
        FOREIGN KEY (worker_id) REFERENCES workers(id) ON DELETE CASCADE,
        FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS bookings (
        id TEXT PRIMARY KEY,
        customer_id TEXT,
        worker_id TEXT,
        category_id TEXT,
        date TEXT NOT NULL,
        time TEXT NOT NULL,
        address TEXT NOT NULL,
        notes TEXT,
        status TEXT DEFAULT 'pending',
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
        FOREIGN KEY (worker_id) REFERENCES workers(id) ON DELETE CASCADE,
        FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS reviews (
        id TEXT PRIMARY KEY,
        booking_id TEXT UNIQUE,
        customer_id TEXT,
        worker_id TEXT,
        rating INTEGER CHECK (rating BETWEEN 1 AND 5),
        review_text TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
        FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
        FOREIGN KEY (worker_id) REFERENCES workers(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS admins (
        id TEXT PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL
      );
    `);

    // Seed Categories
    const categoriesCount = sqliteDb.prepare('SELECT COUNT(*) as count FROM categories').get().count;
    if (categoriesCount === 0) {
      const insertCat = sqliteDb.prepare('INSERT INTO categories (id, name, icon) VALUES (?, ?, ?)');
      const seedCats = [
        ['c1', 'Plumbing', 'Wrench'],
        ['c2', 'Electrical', 'Zap'],
        ['c3', 'Carpentry', 'Hammer'],
        ['c4', 'Painting', 'Paintbrush'],
        ['c5', 'Cleaning', 'Sparkles'],
        ['c6', 'Appliance Repair', 'Tv'],
        ['c7', 'Gardening', 'Flower2'],
        ['c8', 'Pest Control', 'Bug'],
        ['c9', 'CCTV Installation', 'Camera'],
        ['c10', 'Interior Works', 'Home']
      ];
      seedCats.forEach(([id, name, icon]) => insertCat.run(id, name, icon));
    }

    // Seed Admin
    const adminCount = sqliteDb.prepare('SELECT COUNT(*) as count FROM admins').get().count;
    if (adminCount === 0) {
      const defaultAdminPass = bcrypt.hashSync('admin123', 10);
      sqliteDb.prepare('INSERT INTO admins (id, username, password_hash) VALUES (?, ?, ?)').run(
        crypto.randomUUID(),
        'admin',
        defaultAdminPass
      );
    }

    // Seed sample workers & customers for immediate demo testing
    const workerCount = sqliteDb.prepare('SELECT COUNT(*) as count FROM workers').get().count;
    if (workerCount === 0) {
      const pass = bcrypt.hashSync('worker123', 10);
      const custPass = bcrypt.hashSync('customer123', 10);

      // Demo Workers
      const w1Id = crypto.randomUUID();
      const w2Id = crypto.randomUUID();
      const w3Id = crypto.randomUUID();

      sqliteDb.prepare(`
        INSERT INTO workers 
        (id, name, email, phone, password_hash, profession, experience_years, description, profile_photo_url, service_area, price_min, price_max, is_available, is_verified, rating_avg, rating_count)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        w1Id, 'Alex Morgan', 'alex.plumbing@fixmate.com', '+1-555-0192', pass,
        'Senior Master Plumber', 8, 'Specialized in leak repair, pipe fitting, emergency drain clearing, and bathroom installations.',
        'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop&q=80',
        'Downtown, Metro & Suburbs', 45, 120, 1, 1, 4.9, 18
      );

      sqliteDb.prepare(`
        INSERT INTO workers 
        (id, name, email, phone, password_hash, profession, experience_years, description, profile_photo_url, service_area, price_min, price_max, is_available, is_verified, rating_avg, rating_count)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        w2Id, 'Sarah Jenkins', 'sarah.elec@fixmate.com', '+1-555-0381', pass,
        'Licensed Electrician', 6, 'Expert in circuit breaker upgrades, smart home wiring, lighting fixtures, and safety audits.',
        'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
        'North District & Surrounding Areas', 60, 150, 1, 1, 4.8, 24
      );

      sqliteDb.prepare(`
        INSERT INTO workers 
        (id, name, email, phone, password_hash, profession, experience_years, description, profile_photo_url, service_area, price_min, price_max, is_available, is_verified, rating_avg, rating_count)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        w3Id, 'Carlos Rivera', 'carlos.paint@fixmate.com', '+1-555-0829', pass,
        'Commercial & Residential Painter', 5, 'High precision interior and exterior painting, texture coating, and wall repair.',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
        'City Center & Eastside', 40, 90, 1, 0, 0, 0
      );

      // Link categories
      sqliteDb.prepare('INSERT INTO worker_categories (worker_id, category_id) VALUES (?, ?)').run(w1Id, 'c1');
      sqliteDb.prepare('INSERT INTO worker_categories (worker_id, category_id) VALUES (?, ?)').run(w2Id, 'c2');
      sqliteDb.prepare('INSERT INTO worker_categories (worker_id, category_id) VALUES (?, ?)').run(w3Id, 'c4');

      // Demo Customer
      const c1Id = crypto.randomUUID();
      sqliteDb.prepare(`
        INSERT INTO customers (id, name, email, phone, password_hash, address)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(c1Id, 'Emily Watson', 'emily@example.com', '+1-555-0100', custPass, '742 Evergreen Terrace, Apt 4B');
    }
  }
}

// Unified query wrapper
async function query(sql, params = []) {
  if (mode === 'pg') {
    // Convert ? to $1, $2 for Postgres compatibility if necessary
    let paramIndex = 1;
    const pgSql = sql.replace(/\?/g, () => `$${paramIndex++}`);
    const res = await pgPool.query(pgSql, params);
    return res.rows;
  } else {
    // SQLite
    const trimmed = sql.trim().toUpperCase();
    if (trimmed.startsWith('SELECT')) {
      return sqliteDb.prepare(sql).all(...params);
    } else {
      const info = sqliteDb.prepare(sql).run(...params);
      return info;
    }
  }
}

// Single row helper
async function queryOne(sql, params = []) {
  const rows = await query(sql, params);
  if (mode === 'pg') {
    return rows[0] || null;
  } else {
    if (Array.isArray(rows)) return rows[0] || null;
    return rows || null;
  }
}

// Helper to generate UUID
function generateUUID() {
  return crypto.randomUUID();
}

module.exports = {
  query,
  queryOne,
  generateUUID,
  initDb,
  getMode: () => mode
};

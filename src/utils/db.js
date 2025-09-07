const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

async function getDB() {
  const db = await open({
    filename: './quotes.db',
    driver: sqlite3.Database
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS quotes (
      job_id TEXT PRIMARY KEY,
      email TEXT NOT NULL,
      material TEXT NOT NULL,
      color TEXT NOT NULL,
      grams INTEGER NOT NULL,
      cost REAL NOT NULL,
      sku TEXT,
      status TEXT DEFAULT 'submitted',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS click_events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      label TEXT NOT NULL,
      timestamp TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS pageviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      path TEXT NOT NULL,
      timestamp TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      job_id TEXT NOT NULL,
      email TEXT NOT NULL,
      sku TEXT,
      scope TEXT NOT NULL,
      rating INTEGER NOT NULL,
      message TEXT NOT NULL,
      timestamp TEXT DEFAULT CURRENT_TIMESTAMP,
      is_public BOOLEAN DEFAULT 0,
      status TEXT DEFAULT 'pending'
    );

    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT,
      role TEXT DEFAULT 'user',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS audit_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      actor_email TEXT NOT NULL,
      action TEXT NOT NULL,
      target TEXT,
      details TEXT,
      timestamp TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS audit_logs_archive (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      actor_email TEXT NOT NULL,
      action TEXT NOT NULL,
      target TEXT,
      details TEXT,
      timestamp TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS audit_log_hashes (
      log_id INTEGER PRIMARY KEY,
      hash TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS filament_specs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      material TEXT NOT NULL,
      manufacturer TEXT NOT NULL,
      name TEXT,
      description TEXT,
      diameter REAL,
      print_temp INTEGER,
      spool_weight INTEGER,
      spool_type TEXT
    );

    CREATE TABLE IF NOT EXISTS filament_images (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      material TEXT NOT NULL,
      manufacturer TEXT NOT NULL,
      url TEXT NOT NULL,
      sort_order INTEGER DEFAULT 0
    );
  `);

  return db;
}

module.exports = {
  getDB
};

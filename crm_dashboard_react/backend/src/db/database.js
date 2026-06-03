/**
 * database.js — SQLite connection + initialisation
 * =================================================
 * Uses node-sqlite3-wasm (pure-WASM SQLite — no native compilation, works on
 * any OS with zero build tools). Creates the DB file, runs schema.sql and
 * seeds sample data on the very first run. Set RESEED=1 to wipe and rebuild.
 *
 * This driver implements file locking with a "<db>.lock" directory. If the
 * process is force-killed mid-write that directory can be left behind, making
 * every later start report "database is locked". Because this is a single
 * local process that solely owns its DB file, we safely clear a stale lock
 * directory on startup, and we close the DB cleanly on shutdown.
 */
import pkg from 'node-sqlite3-wasm';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { seed } from './seed.js';

const { Database } = pkg;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// The .db file lives next to this module, inside backend/src/db/
const DB_PATH = path.join(__dirname, 'crm.db');
const LOCK_PATH = DB_PATH + '.lock';
const SCHEMA_PATH = path.join(__dirname, 'schema.sql');

let db; // single shared connection for the whole process

/** Remove a stale lock directory left behind by a previously crashed process. */
function clearStaleLock() {
  try {
    if (fs.existsSync(LOCK_PATH)) {
      fs.rmSync(LOCK_PATH, { recursive: true, force: true });
      console.log('[initDb] Cleared a stale lock directory.');
    }
  } catch {
    /* ignore — if we can't clear it, opening will surface a clear error */
  }
}

/**
 * Open (and if necessary create + seed) the database, returning the shared
 * node-sqlite3-wasm connection.
 */
export function initDb() {
  clearStaleLock();

  const isNew = !fs.existsSync(DB_PATH);
  const forceReseed = process.env.RESEED === '1';

  if (forceReseed && fs.existsSync(DB_PATH)) {
    fs.rmSync(DB_PATH);
    console.log('[initDb] RESEED=1 — old database removed.');
  }

  db = new Database(DB_PATH);
  db.exec('PRAGMA foreign_keys = ON');

  const needsSetup = isNew || forceReseed;
  if (needsSetup) {
    const schema = fs.readFileSync(SCHEMA_PATH, 'utf-8');
    db.exec(schema);          // create all tables + indexes
    seed(db);                 // insert sample data
    console.log(`[initDb] Database initialised at ${DB_PATH} and seeded.`);
  } else {
    console.log(`[initDb] Database already exists at ${DB_PATH} (skipping schema/seed).`);
  }

  return db;
}

/** Return the already-opened connection. */
export function getDb() {
  if (!db) throw new Error('Database not initialised — call initDb() first.');
  return db;
}

/** Close the connection cleanly (releases the file lock). */
export function closeDb() {
  try {
    if (db && db.isOpen) db.close();
  } catch {
    /* ignore */
  }
}

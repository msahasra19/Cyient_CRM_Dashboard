/**
 * crudFactory.js — generic CRUD router builder
 * ============================================
 * Direct port of the Flask `build_crud` helper. Given a table definition it
 * returns an Express Router exposing the standard 5 endpoints:
 *
 *   GET    /            list (optional ?q= free-text search)
 *   GET    /:id         fetch one
 *   POST   /            create
 *   PUT    /:id         update
 *   DELETE /:id         delete
 *
 * This is the heart of the "modular" design: every feature module reuses this
 * one factory instead of repeating CRUD logic.
 *
 * NOTE: we use the driver's db.run / db.get / db.all convenience methods,
 * which prepare-execute-finalize internally. Leaving prepared statements
 * un-finalized on the single shared connection causes "database is locked"
 * errors on subsequent writes, so we avoid that pattern entirely.
 */
import express from 'express';
import { getDb } from '../db/database.js';

export function buildCrud({ name, table, fields, searchFields = [], selectExtra = '', joins = '' }) {
  const router = express.Router();
  const baseSelect = `SELECT ${table}.*${selectExtra ? ', ' + selectExtra : ''} FROM ${table} ${joins}`;

  // qualify an unqualified column with the base table to avoid ambiguity after joins
  const qualify = (f) => (f.includes('.') ? f : `${table}.${f}`);

  // ---- LIST (with optional search) ----
  router.get('/', (req, res) => {
    const db = getDb();
    const q = (req.query.q || '').trim();
    let where = '';
    let params = [];

    if (q && searchFields.length) {
      const clauses = searchFields.map((f) => `${qualify(f)} LIKE ?`).join(' OR ');
      where = `WHERE ${clauses}`;
      params = searchFields.map(() => `%${q}%`);
    }

    const order = ` ORDER BY ${table}.id DESC`;
    res.json(db.all(`${baseSelect} ${where}${order}`, params));
  });

  // ---- GET ONE ----
  router.get('/:id', (req, res) => {
    const db = getDb();
    const row = db.get(`${baseSelect} WHERE ${table}.id = ?`, [req.params.id]);
    if (!row) return res.status(404).json({ error: 'not found', message: `${name} not found` });
    res.json(row);
  });

  // ---- CREATE ----
  router.post('/', (req, res) => {
    const db = getDb();
    const body = req.body || {};
    const cols = [];
    const vals = [];
    for (const f of fields) {
      if (Object.prototype.hasOwnProperty.call(body, f)) {
        cols.push(f);
        vals.push(body[f]);
      }
    }
    if (!cols.length) return res.status(400).json({ error: 'no fields supplied' });

    const placeholders = cols.map(() => '?').join(',');
    try {
      const info = db.run(`INSERT INTO ${table} (${cols.join(',')}) VALUES (${placeholders})`, vals);
      const row = db.get(`${baseSelect} WHERE ${table}.id = ?`, [info.lastInsertRowid]);
      res.status(201).json(row);
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  });

  // ---- UPDATE ----
  router.put('/:id', (req, res) => {
    const db = getDb();
    const body = req.body || {};
    const sets = [];
    const vals = [];
    for (const f of fields) {
      if (Object.prototype.hasOwnProperty.call(body, f)) {
        sets.push(`${f} = ?`);
        vals.push(body[f]);
      }
    }
    if (!sets.length) return res.status(400).json({ error: 'no fields supplied' });
    vals.push(req.params.id);

    try {
      db.run(`UPDATE ${table} SET ${sets.join(',')} WHERE id = ?`, vals);
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }
    const row = db.get(`${baseSelect} WHERE ${table}.id = ?`, [req.params.id]);
    if (!row) return res.status(404).json({ error: 'not found', message: `${name} not found` });
    res.json(row);
  });

  // ---- DELETE ----
  router.delete('/:id', (req, res) => {
    const db = getDb();
    db.run(`DELETE FROM ${table} WHERE id = ?`, [req.params.id]);
    res.json({ deleted: true, id: Number(req.params.id) });
  });

  return router;
}

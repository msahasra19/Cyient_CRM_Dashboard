/**
 * options.routes.js — lightweight {id, name} lists for <select> dropdowns
 * ======================================================================
 * GET /api/options/:entity  -> [{ id, name }]
 * Port of the Flask /api/options/<entity> view.
 */
import express from 'express';
import { getDb } from '../db/database.js';

const router = express.Router();

const ALLOWED = {
  projects: 'SELECT id, name FROM projects ORDER BY name',
  courses: 'SELECT id, name FROM courses ORDER BY name',
  modules: 'SELECT id, name FROM modules ORDER BY name',
  chapters: 'SELECT id, name FROM chapters ORDER BY name',
  trainers: 'SELECT id, name FROM trainers ORDER BY name',
  students: 'SELECT id, name FROM students ORDER BY name',
  skills: 'SELECT id, name FROM skills ORDER BY name',
  volunteers: 'SELECT id, name FROM volunteers ORDER BY name',
  activities: 'SELECT id, name FROM activities ORDER BY name',
};

router.get('/:entity', (req, res) => {
  const sql = ALLOWED[req.params.entity];
  if (!sql) return res.status(400).json({ error: 'unknown entity' });
  res.json(getDb().all(sql));
});

export default router;

/**
 * app.js — Express application wiring
 * ===================================
 * Mounts every feature module under /api. Keeping this separate from the
 * server bootstrap (server.js) makes the app easy to test and reason about.
 */
import express from 'express';
import cors from 'cors';
import { buildCrud } from './modules/crudFactory.js';
import { ENTITY_DEFS } from './modules/entities.config.js';
import dashboardRouter from './modules/dashboard.routes.js';
import optionsRouter from './modules/options.routes.js';

export function createApp() {
  const app = express();

  app.use(cors());              // allow the React dev server to call the API
  app.use(express.json());      // parse JSON request bodies

  // Aggregate + dropdown endpoints first (more specific paths).
  app.use('/api/dashboard', dashboardRouter);
  app.use('/api/options', optionsRouter);

  // Auto-mount a CRUD router for every entity definition.
  for (const def of ENTITY_DEFS) {
    app.use(`/api/${def.name}`, buildCrud(def));
  }

  // Simple health check.
  app.get('/api/health', (req, res) => res.json({ ok: true }));

  // 404 for unknown API routes.
  app.use('/api', (req, res) => {
    res.status(404).json({ error: 'not found', message: `No API route for ${req.method} ${req.path}` });
  });

  // Centralised error handler.
  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: 'server error', message: err.message });
  });

  return app;
}

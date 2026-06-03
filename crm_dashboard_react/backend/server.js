/**
 * server.js — entry point
 * =======================
 * Initialises the database (creating + seeding on first run) then starts the
 * HTTP server. Run with:  npm start   (or  npm run dev  for auto-reload)
 */
import { initDb, closeDb } from './src/db/database.js';
import { createApp } from './src/app.js';

const PORT = process.env.PORT || 4000;

initDb();                       // open / create / seed the SQLite database
const app = createApp();

const server = app.listen(PORT, () => {
  console.log(`\n  CRM Dashboard API running at http://localhost:${PORT}`);
  console.log(`  Try:  http://localhost:${PORT}/api/dashboard\n`);
});

// Close the DB cleanly on shutdown so the file lock is always released.
function shutdown() {
  console.log('\n  Shutting down — closing database…');
  server.close(() => {
    closeDb();
    process.exit(0);
  });
  // Safety: force-exit if the server doesn't close promptly.
  setTimeout(() => { closeDb(); process.exit(0); }, 1500).unref();
}
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

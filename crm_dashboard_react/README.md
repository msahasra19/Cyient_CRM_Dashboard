# Cyient Foundation — CRM Dashboard (React + Node.js + SQLite)

A faithful rebuild of the original Flask CRM dashboard, ported to a modern
**React (Vite) frontend** and a **Node.js (Express) + SQLite backend**, with the
code split into clear, single-purpose **modules**. Same UI, same features.

> **New here? Read [`SETUP_GUIDE.md`](./SETUP_GUIDE.md)** — it walks through
> installing everything from scratch and running the site on a fresh computer.

---

## Tech stack

| Layer    | Technology                                                            |
|----------|-----------------------------------------------------------------------|
| Frontend | React 18, React Router, Vite, Chart.js                                |
| Backend  | Node.js, Express                                                      |
| Database | SQLite via `node-sqlite3-wasm` (pure WebAssembly — no compiler needed) |

**Why `node-sqlite3-wasm` and not `better-sqlite3`?** The popular
`better-sqlite3` driver compiles native C++ on install, which is the single
most common reason setup fails for beginners (it needs Python + Visual Studio
build tools on Windows). `node-sqlite3-wasm` is pure WebAssembly: it installs
instantly on any OS with zero build tools, so `npm install` just works.

---

## Quick start

Run the two halves in two terminals (full details in `SETUP_GUIDE.md`):

```bash
# Terminal 1 — backend API on http://localhost:4000
cd backend
npm install
npm start

# Terminal 2 — website on http://localhost:5173
cd frontend
npm install
npm run dev
```

Then open **http://localhost:5173**. The database is created and seeded with
sample data automatically on the backend's first run.

---

## What "modules" means here

The original app kept all server logic in one big `app.py`. This version is
organised into small, focused modules so each piece has one job:

### Backend (`backend/src/`)

```
db/
  database.js          # opens / creates / seeds SQLite; lock handling
  schema.sql           # all table definitions
  seed.js              # sample data generator
modules/
  crudFactory.js       # one reusable factory → the 5 CRUD endpoints per entity
  entities.config.js   # definitions of all 14 entities (tables, joins, search)
  dashboard.routes.js  # the Master Board aggregate endpoint
  options.routes.js    # {id, name} lists for dropdowns
app.js                 # wires the modules together into the Express app
server.js              # entry point: init DB, start server, graceful shutdown
```

Adding a new entity is usually just one entry in `entities.config.js` — the
`crudFactory` gives it list/search/create/read/update/delete for free.

### Frontend (`frontend/src/`)

```
api/api.js             # single fetch wrapper for the whole app
config/
  nav.js               # sidebar order
  icons.jsx            # SVG icon set
  entities.jsx         # per-module table columns + form fields
components/            # Sidebar, Topbar, DataTable, FormModal, Toast, etc.
pages/
  Dashboard.jsx        # Master Board (stat cards + Chart.js charts)
  EntityPage.jsx       # one generic page that powers every module route
App.jsx / main.jsx     # shell, routing and providers
styles/styles.css      # the original stylesheet, reused unchanged
```

The original CSS is reused verbatim and the charts use the same Chart.js
library, so the interface matches the original closely.

---

## Project layout

```
crm_dashboard_react/
├── README.md            ← you are here
├── SETUP_GUIDE.md       ← start here to install & run
├── backend/             ← Node.js + Express + SQLite API
└── frontend/            ← React (Vite) user interface
```

---

## Useful commands

```bash
# Backend
npm start        # run the API
npm run dev      # run the API with auto-reload on file changes
npm run reseed   # wipe & rebuild the database with fresh sample data

# Frontend
npm run dev      # run the website (development)
npm run build    # build an optimised production bundle into dist/
npm run preview  # preview the production build
```

---

## Notes

- The SQLite database lives at `backend/src/db/crm.db` and is created on first
  run. Delete it (or run `npm run reseed`) to start fresh.
- The backend closes the database cleanly on `Ctrl+C`, and automatically clears
  a stale lock left by any previous hard shutdown — so you should never get
  stuck on a "database is locked" error.
- The API uses standard REST conventions: `GET/POST /api/<entity>`,
  `GET/PUT/DELETE /api/<entity>/:id`, plus `/api/dashboard` and
  `/api/options/<entity>`.

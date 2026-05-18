# Cyient Foundation – CRM Dashboard

A full-featured CRM dashboard for managing projects, courses, students, trainers,
activities, and attendance. Built with **Flask + SQLite** on the backend and
**vanilla HTML / CSS / JS + Chart.js** on the frontend — no build step, no
node_modules, just `python app.py` and go.

![preview](static/img/logo.svg)

---

## 1. Prerequisites

| Tool   | Version            |
|--------|--------------------|
| Python | 3.8 or newer       |
| pip    | (ships with Python)|
| Browser| any modern browser |

> Nothing else. No Node. No npm. No build step. SQLite ships inside Python.

---

## 2. Setup & run (3 commands)

```bash
# 1. unzip / cd into the project folder
cd crm_dashboard

# 2. install the single Python dependency
pip install -r requirements.txt

# 3. run the app
python app.py
```

Then open **<http://127.0.0.1:5000>** in your browser.

The first run automatically:
* creates `instance/crm.db`
* loads the schema (13 tables)
* seeds realistic demo data:
  4 admins · 5 projects · 7 courses · 11 modules · 15 chapters · 8 skills ·
  6 trainers · 60 students · 24 chapter assignments · 8 activities ·
  750 student-attendance rows · 180 trainer-attendance rows · 177 grade rows

Subsequent runs reuse the existing DB.

### Reset the database

```bash
# wipe and re-seed
rm instance/crm.db && python app.py

# or, without deleting the file:
RESEED=1 python app.py        # macOS / Linux
set RESEED=1 && python app.py # Windows cmd
$env:RESEED="1"; python app.py # Windows PowerShell
```

---

## 3. Features

### 13 modules (per requirements doc)

| Section     | Module                                  |
|-------------|-----------------------------------------|
| Dashboard   | Master Board (stat cards + 3 charts + recent activity) |
| Operations  | Projects · Activities                   |
| Academics   | Courses · Modules · Chapters · Assign Chapters · Skills · Grades |
| People      | Students · Trainers · Administrators    |
| Attendance  | Student Attendance · Trainer Attendance |

Every module has:
* **List** view with sortable columns and colour-coded status badges
* **Search** — debounced server-side search across relevant fields
* **Add** — modal form auto-built from field config (text / email / number /
  date / select / textarea), including async FK dropdowns
* **Edit** — same form, pre-filled from the API
* **Delete** — with confirmation modal

### Master Board (dashboard)

* **8 stat cards**: active projects, students, trainers, courses, chapters,
  activities, skills, administrators
* **Attendance trend** — line chart, last 14 days
* **Project status** — doughnut chart with semantic colours
* **Course-wise students** — horizontal bar chart
* **Top projects** with progress bars
* **Recent activities** feed

### UI / UX

* Responsive layout — sidebar collapses on tablet, slides over on mobile
* Hash-based routing — `#projects`, `#students`, etc. (back / forward buttons work)
* Toast notifications for every action
* Confirmation modals before destructive actions
* Clean design tokens — single brand-teal palette, easy to re-theme via CSS vars

---

## 4. Folder structure

```
crm_dashboard/
├── app.py                  # Flask app + all API routes (CRUD generator)
├── database.py             # connection helper + init_db()
├── schema.sql              # 13 tables, FKs, indexes
├── seed_data.py            # populates ~1300 demo rows
├── requirements.txt        # Flask==3.0.3
│
├── instance/
│   └── crm.db              # auto-created on first run (git-ignore this)
│
├── templates/
│   └── index.html          # SPA shell — sidebar / topbar / modal
│
└── static/
    ├── css/
    │   └── styles.css      # design tokens, layout, components, responsive
    ├── js/
    │   ├── api.js          # fetch wrapper: API.list/get/create/update/remove
    │   ├── ui.js           # toast, modal, confirm, badges, formatters
    │   ├── configs.js      # ENTITIES (drives all 13 pages) + NAV_ORDER + ICONS
    │   ├── dashboard.js    # Master Board renderer (Chart.js)
    │   └── app.js          # SPA router, sidebar, generic table + CRUD
    └── img/
        └── logo.svg
```

---

## 5. REST API (cheat sheet)

All endpoints under `/api/`. JSON in, JSON out.

| Method | Path                                | Purpose                                     |
|--------|-------------------------------------|---------------------------------------------|
| GET    | `/api/dashboard`                    | aggregates for the Master Board             |
| GET    | `/api/<entity>?q=<text>`            | list (optional search)                      |
| GET    | `/api/<entity>/<id>`                | fetch one                                   |
| POST   | `/api/<entity>`                     | create                                      |
| PUT    | `/api/<entity>/<id>`                | update                                      |
| DELETE | `/api/<entity>/<id>`                | delete                                      |
| GET    | `/api/options/<entity>`             | `[{id, name}]` for FK dropdowns             |

Entities: `administrators`, `projects`, `courses`, `modules`, `chapters`,
`skills`, `trainers`, `students`, `chapter_assignments`, `activities`,
`student_attendance`, `trainer_attendance`, `student_skills`.

Example:

```bash
curl http://127.0.0.1:5000/api/projects
curl http://127.0.0.1:5000/api/students?q=Reddy
curl -X POST http://127.0.0.1:5000/api/projects \
  -H 'Content-Type: application/json' \
  -d '{"name":"New project","status":"Active","start_date":"2026-06-01"}'
```

---

## 6. Tech stack & design choices

| Concern        | Choice                | Why                                       |
|----------------|-----------------------|-------------------------------------------|
| Backend        | Flask 3.0             | one-file, zero ceremony, runs anywhere    |
| Database       | SQLite (bundled)      | no setup, single `.db` file, fast enough  |
| Frontend       | Vanilla JS + Chart.js | no build step, no bundler, easy to read   |
| Routing        | Hash-based SPA        | works offline, no server route plumbing   |
| Styling        | Hand-rolled CSS + vars | full control, no Tailwind / framework      |
| Code structure | Config-driven CRUD    | one `build_crud()` backend + one `ENTITIES` config drives all 13 modules — adding a 14th module is ~20 lines |

---

## 7. Troubleshooting

* **Port 5000 already in use** — change the last line of `app.py` to a free
  port (e.g. `port=5050`).
* **Blank page / 404 on `/static/js/app.js`** — make sure you're running
  `python app.py` from inside the `crm_dashboard/` folder.
* **DB looks empty / wrong** — `rm instance/crm.db && python app.py` to wipe
  and re-seed.
* **Want a fresh seed without deleting** — `RESEED=1 python app.py`.

---

Built for Cyient Foundation. Customise the brand colour by editing
`--brand-500` in `static/css/styles.css`.

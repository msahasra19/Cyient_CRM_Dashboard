# Setup Guide — CRM Dashboard (React + Node.js + SQLite)

This guide explains **everything to install from scratch** and how to run the
website on a fresh computer. No prior setup is assumed. It works on **Windows,
macOS and Linux**.

The project has two parts that run at the same time:

| Part         | Folder      | What it is                          | Runs on |
|--------------|-------------|-------------------------------------|---------|
| **Backend**  | `backend/`  | Node.js + Express API + SQLite data | port **4000** |
| **Frontend** | `frontend/` | React (Vite) user interface         | port **5173** |

You open the **frontend** in your browser; it talks to the **backend** behind
the scenes.

---

## Step 1 — Install Node.js (one-time)

Node.js gives you both `node` and `npm` (the package installer). This is the
only thing you need to install manually.

1. Go to **https://nodejs.org**
2. Download the **LTS** version (the big green button — currently Node 20 or 22).
3. Run the installer and click **Next** through all the defaults.
   - On Windows, just keep clicking Next; you do **not** need the optional
     "Tools for Native Modules" checkbox (this project needs no compiler).
4. **Close and reopen** any terminal/Command Prompt windows so the new `node`
   command is recognised.

**Check it worked.** Open a terminal and run:

```bash
node --version
npm --version
```

You should see version numbers (e.g. `v22.x.x` and `10.x.x`). If you get
"command not found", restart your computer and try again.

> **Where is "the terminal"?**
> - **Windows:** press `Win`, type **Command Prompt** (or **PowerShell**), open it.
> - **macOS:** press `Cmd+Space`, type **Terminal**, open it.

---

## Step 2 — Get the project onto your computer

Unzip the project folder somewhere easy to find, e.g. your Desktop. You should
end up with a folder named **`crm_dashboard_react`** containing `backend/` and
`frontend/` folders.

---

## Step 3 — Start the backend (API + database)

Open a terminal and go into the `backend` folder. For example, if the project
is on your Desktop:

```bash
cd Desktop/crm_dashboard_react/backend
```

> **Tip (Windows):** the easiest way is to open the `backend` folder in File
> Explorer, click the address bar, type `cmd`, and press Enter — that opens a
> terminal already in the right place.

Install the backend's libraries (only needed the first time):

```bash
npm install
```

Start the server:

```bash
npm start
```

The **first run** automatically creates the SQLite database file and fills it
with sample data. You'll see something like:

```
[seed] Inserted: 4 admins, 5 projects, 7 courses, ...
[initDb] Database initialised ... and seeded.

  CRM Dashboard API running at http://localhost:4000
```

**Leave this terminal open and running.** Closing it stops the backend.

---

## Step 4 — Start the frontend (the website)

Open a **second, separate** terminal window (keep the backend one running).
Go into the `frontend` folder:

```bash
cd Desktop/crm_dashboard_react/frontend
```

Install the frontend's libraries (only needed the first time):

```bash
npm install
```

Start the website:

```bash
npm run dev
```

You'll see:

```
  VITE v5.x  ready in ... ms
  ➜  Local:   http://localhost:5173/
```

---

## Step 5 — Open it in your browser

Go to **http://localhost:5173**

You should see the full CRM Dashboard with the Master Board, charts, and all
the modules in the sidebar. Try adding, editing, searching and deleting a
record — it all saves to the local database.

That's it! 🎉

---

## Stopping and restarting

- **To stop** either server, click its terminal window and press `Ctrl + C`.
- **To start again later**, you do **not** need to run `npm install` again —
  just `npm start` (backend) and `npm run dev` (frontend) in their folders.

---

## Quick reference

```bash
# ---- Backend (terminal 1) ----
cd crm_dashboard_react/backend
npm install      # first time only
npm start        # starts API on http://localhost:4000

# ---- Frontend (terminal 2) ----
cd crm_dashboard_react/frontend
npm install      # first time only
npm run dev      # starts website on http://localhost:5173
```

---

## Troubleshooting

**"npm is not recognized" / "command not found: npm"**
Node.js isn't installed or the terminal was open before you installed it. Close
all terminals, reopen one, and run `node --version`. If still failing, restart
the computer.

**The website loads but everything says "Network error" or no data appears.**
The backend isn't running. Make sure the **backend** terminal (Step 3) is still
open and shows "CRM Dashboard API running". Both servers must run at the same
time.

**"Port 4000 already in use" or "Port 5173 already in use".**
Another copy is still running. Close the other terminal, or restart your
computer to clear it. (Advanced: you can change the backend port by starting it
with `PORT=4001 npm start`, but then no other change is needed because the
frontend talks to the backend through Vite's proxy on the same address.)

**"database is locked" when starting the backend.**
This can only happen if the backend was force-closed mid-write previously. The
app clears stale locks automatically on the next start, so just run
`npm start` again. If it persists, delete the file
`backend/src/db/crm.db.lock` (it's a leftover folder) and start again.

**I want to reset all data back to the original sample data.**
Stop the backend, then start it once in reseed mode:

```bash
cd crm_dashboard_react/backend
npm run reseed
```

This wipes `crm.db` and rebuilds it with fresh sample data. After it finishes,
stop it (`Ctrl+C`) and start normally with `npm start`.
(You can also simply delete the file `backend/src/db/crm.db` and start again.)

---

## Optional: building the frontend for production

For everyday use, `npm run dev` is all you need. If you ever want an optimised
static build of the website:

```bash
cd crm_dashboard_react/frontend
npm run build      # outputs to frontend/dist/
npm run preview    # serves the built site locally to check it
```

(The backend still needs to be running for data to load.)

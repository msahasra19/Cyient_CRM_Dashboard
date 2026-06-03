/**
 * Dashboard.jsx — Master Board (port of dashboard.js)
 * ==================================================
 * Stat cards + three Chart.js charts (attendance line, project-status
 * doughnut, students-per-course bar) + top projects and recent activities.
 * Uses chart.js directly with refs so the charts match the original pixel for
 * pixel. Each chart is created in an effect and destroyed on cleanup.
 */
import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import { API } from '../api/api.js';
import { Topbar } from '../components/Topbar.jsx';
import { Badge } from '../components/Badge.jsx';
import { Icon, ICONS } from '../config/icons.jsx';
import { fmtNum, fmtDate } from '../utils/format.js';

const shortDate = (s) => fmtDate(s).split(' ').slice(0, 2).join(' ');

function StatCard({ label, value, meta, icon, color }) {
  return (
    <div className="stat-card">
      <div className={`stat-icon ${color || ''}`}>
        <Icon svg={ICONS[icon] || ICONS.grid} />
      </div>
      <div>
        <div className="stat-label">{label}</div>
        <div className="stat-value">{fmtNum(value)}</div>
        <div className="stat-meta">{meta}</div>
      </div>
    </div>
  );
}

export function Dashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  const attendanceRef = useRef(null);
  const projectsRef = useRef(null);
  const coursesRef = useRef(null);

  useEffect(() => {
    let alive = true;
    API.dashboard()
      .then((d) => alive && setData(d))
      .catch((e) => alive && setError(e.message));
    return () => {
      alive = false;
    };
  }, []);

  // ---- attendance line chart ----
  useEffect(() => {
    if (!data || !attendanceRef.current) return;
    const ctx = attendanceRef.current;
    const trend = data.attendance_trend;
    const gradient = ctx.getContext('2d').createLinearGradient(0, 0, 0, 280);
    gradient.addColorStop(0, 'rgba(14,157,177,0.35)');
    gradient.addColorStop(1, 'rgba(14,157,177,0.00)');

    const chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: trend.map((r) => shortDate(r.attendance_date)),
        datasets: [
          {
            label: 'Present %',
            data: trend.map((r) => r.present_pct),
            borderColor: '#0E9DB1',
            backgroundColor: gradient,
            fill: true,
            tension: 0.4,
            borderWidth: 2.5,
            pointRadius: 3,
            pointBackgroundColor: '#0E9DB1',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: (c) => `${c.parsed.y}% present` } },
        },
        scales: {
          y: { beginAtZero: true, max: 100, ticks: { callback: (v) => v + '%', color: '#6B7785' }, grid: { color: '#EEF2F6' } },
          x: { ticks: { color: '#6B7785', maxRotation: 0, autoSkip: true }, grid: { display: false } },
        },
      },
    });
    return () => chart.destroy();
  }, [data]);

  // ---- project status doughnut ----
  useEffect(() => {
    if (!data || !projectsRef.current) return;
    const colorMap = { Active: '#16A34A', Completed: '#2563EB', Planned: '#0E9DB1', 'On Hold': '#D97706' };
    const rows = data.project_status;
    const chart = new Chart(projectsRef.current, {
      type: 'doughnut',
      data: {
        labels: rows.map((r) => r.status),
        datasets: [{ data: rows.map((r) => r.count), backgroundColor: rows.map((r) => colorMap[r.status] || '#95A2B1'), borderWidth: 0 }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '65%',
        plugins: { legend: { position: 'bottom', labels: { padding: 14, font: { size: 12 } } } },
      },
    });
    return () => chart.destroy();
  }, [data]);

  // ---- students per course bar ----
  useEffect(() => {
    if (!data || !coursesRef.current) return;
    const rows = data.course_student_count;
    const chart = new Chart(coursesRef.current, {
      type: 'bar',
      data: {
        labels: rows.map((r) => r.course_name),
        datasets: [{ label: 'Students', data: rows.map((r) => r.student_count), backgroundColor: '#2DB7C7', borderRadius: 6, maxBarThickness: 28 }],
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { beginAtZero: true, ticks: { color: '#6B7785', precision: 0 }, grid: { color: '#EEF2F6' } },
          y: { ticks: { color: '#6B7785' }, grid: { display: false } },
        },
      },
    });
    return () => chart.destroy();
  }, [data]);

  return (
    <>
      <Topbar breadcrumb="Dashboard" title="Master Board" />
      <section className="content">
        {error ? (
          <div className="card">
            <h3 style={{ color: 'var(--danger)' }}>Failed to load dashboard</h3>
            <p>{error}</p>
          </div>
        ) : !data ? (
          <div className="loader">
            <div className="spinner" />
            <div>Loading…</div>
          </div>
        ) : (
          <Content data={data} refs={{ attendanceRef, projectsRef, coursesRef }} />
        )}
      </section>
    </>
  );
}

function Content({ data, refs }) {
  const c = data.counts;
  return (
    <>
      <div className="stats-grid">
        <StatCard label="Total Projects" value={c.projects} meta={`${c.active_projects} active`} icon="briefcase" color="" />
        <StatCard label="Students" value={c.students} meta={`${c.active_students} active`} icon="users" color="purple" />
        <StatCard label="Trainers" value={c.trainers} meta={`${c.active_trainers} active`} icon="user-tie" color="green" />
        <StatCard label="Volunteers" value={c.volunteers} meta={`${c.active_volunteers} active`} icon="heart" color="pink" />
        <StatCard label="Courses" value={c.courses} meta={`${c.modules} modules`} icon="book" color="blue" />
        <StatCard label="Chapters" value={c.chapters} meta={`${c.chapter_assignments} assignments`} icon="bookmark" color="orange" />
        <StatCard label="Activities" value={c.activities} meta="all categories" icon="activity" color="pink" />
        <StatCard label="Skills" value={c.skills} meta="tracked" icon="award" color="" />
        <StatCard label="Administrators" value={c.administrators} meta="with access" icon="shield" color="red" />
      </div>

      <div className="dashboard-grid">
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">Student attendance — last 14 days</h3>
              <div className="card-subtitle">Daily present %</div>
            </div>
          </div>
          <div className="chart-wrap">
            <canvas ref={refs.attendanceRef} />
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">Project status</h3>
              <div className="card-subtitle">Distribution across all projects</div>
            </div>
          </div>
          <div className="chart-wrap">
            <canvas ref={refs.projectsRef} />
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">Students per course</h3>
              <div className="card-subtitle">Top courses by enrolment</div>
            </div>
          </div>
          <div className="chart-wrap">
            <canvas ref={refs.coursesRef} />
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">Top projects</h3>
              <div className="card-subtitle">Sorted by progress</div>
            </div>
          </div>
          <div id="top-projects">
            {data.top_projects.length ? (
              data.top_projects.map((p) => {
                const pct = p.progress || 0;
                return (
                  <div className="project-row" key={p.id}>
                    <div>
                      <div className="name">{p.name}</div>
                      <div className="meta">
                        <Badge>{p.status}</Badge> <span style={{ marginLeft: 6 }}>{pct}% complete</span>
                      </div>
                      <div className="progress-bar">
                        <div className={'progress-bar-fill' + (pct >= 100 ? ' full' : '')} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <p style={{ color: 'var(--gray-500)', fontSize: 13 }}>No projects yet.</p>
            )}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <div>
            <h3 className="card-title">Recent activities</h3>
            <div className="card-subtitle">Latest events, workshops and CSR initiatives</div>
          </div>
        </div>
        <div>
          {data.recent_activities.length ? (
            data.recent_activities.map((a) => {
              const t = (a.activity_type || 'A').slice(0, 1).toUpperCase();
              return (
                <div className="activity-row" key={a.id}>
                  <div className="activity-icon">{t}</div>
                  <div>
                    <div className="activity-name">{a.name}</div>
                    <div className="activity-meta">
                      {a.activity_type || ''} • {fmtDate(a.activity_date)} • {a.project_name || 'No project'}
                    </div>
                  </div>
                  <div className="activity-count">{fmtNum(a.participants_count || 0)} ppl</div>
                </div>
              );
            })
          ) : (
            <p style={{ color: 'var(--gray-500)', fontSize: 13 }}>No activities yet.</p>
          )}
        </div>
      </div>
    </>
  );
}

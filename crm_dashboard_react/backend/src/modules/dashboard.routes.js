/**
 * dashboard.routes.js — Master Board aggregate endpoint
 * =====================================================
 * GET /api/dashboard  -> counters, project status breakdown, attendance
 * trend, students-by-status, course-wise counts and recent activities.
 * Port of the Flask /api/dashboard view.
 *
 * Uses db.all / db.get convenience methods (auto prepare+finalize) so the
 * shared connection never holds a lock.
 */
import express from 'express';
import { getDb } from '../db/database.js';

const router = express.Router();

router.get('/', (req, res) => {
  const db = getDb();
  const scalar = (sql) => {
    const row = db.get(sql);
    return row ? Object.values(row)[0] : 0;
  };

  const counts = {
    projects: scalar('SELECT COUNT(*) FROM projects'),
    active_projects: scalar("SELECT COUNT(*) FROM projects WHERE status='Active'"),
    courses: scalar('SELECT COUNT(*) FROM courses'),
    modules: scalar('SELECT COUNT(*) FROM modules'),
    chapters: scalar('SELECT COUNT(*) FROM chapters'),
    students: scalar('SELECT COUNT(*) FROM students'),
    active_students: scalar("SELECT COUNT(*) FROM students WHERE status='Active'"),
    trainers: scalar('SELECT COUNT(*) FROM trainers'),
    active_trainers: scalar("SELECT COUNT(*) FROM trainers WHERE status='Active'"),
    administrators: scalar('SELECT COUNT(*) FROM administrators'),
    skills: scalar('SELECT COUNT(*) FROM skills'),
    activities: scalar('SELECT COUNT(*) FROM activities'),
    chapter_assignments: scalar('SELECT COUNT(*) FROM chapter_assignments'),
    volunteers: scalar('SELECT COUNT(*) FROM volunteers'),
    active_volunteers: scalar("SELECT COUNT(*) FROM volunteers WHERE status='Active'"),
  };

  const project_status = db.all('SELECT status, COUNT(*) AS count FROM projects GROUP BY status');

  const top_projects = db.all(
    'SELECT id, name, status, progress FROM projects ORDER BY progress DESC LIMIT 5'
  );

  let attendance_trend = db
    .all(`
      SELECT attendance_date,
             COUNT(*) AS total,
             SUM(CASE WHEN status='Present' THEN 1 ELSE 0 END) AS present_count
      FROM student_attendance
      GROUP BY attendance_date
      ORDER BY attendance_date DESC
      LIMIT 14
    `)
    .reverse();
  attendance_trend = attendance_trend.map((r) => ({
    ...r,
    present_pct: r.total ? Math.round((r.present_count / r.total) * 1000) / 10 : 0,
  }));

  const students_by_status = db.all('SELECT status, COUNT(*) AS count FROM students GROUP BY status');

  const course_student_count = db.all(`
    SELECT c.name AS course_name, COUNT(s.id) AS student_count
    FROM courses c LEFT JOIN students s ON s.course_id = c.id
    GROUP BY c.id ORDER BY student_count DESC LIMIT 7
  `);

  const recent_activities = db.all(`
    SELECT a.id, a.name, a.activity_type, a.activity_date, a.participants_count,
           p.name AS project_name
    FROM activities a LEFT JOIN projects p ON a.project_id = p.id
    ORDER BY date(a.activity_date) DESC LIMIT 6
  `);

  res.json({
    counts,
    project_status,
    top_projects,
    attendance_trend,
    students_by_status,
    course_student_count,
    recent_activities,
  });
});

export default router;

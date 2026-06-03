/**
 * nav.js — sidebar navigation order (grouped by section)
 * ======================================================
 * Ported verbatim from the original configs.js NAV_ORDER.
 */
export const NAV_ORDER = [
  { type: 'item', key: 'dashboard', label: 'Master Board', icon: 'grid' },
  { type: 'heading', label: 'Operations' },
  { type: 'item', key: 'projects', label: 'Projects', icon: 'briefcase' },
  { type: 'item', key: 'activities', label: 'Activities', icon: 'activity' },
  { type: 'heading', label: 'Academics' },
  { type: 'item', key: 'courses', label: 'Courses', icon: 'book' },
  { type: 'item', key: 'modules', label: 'Modules', icon: 'layers' },
  { type: 'item', key: 'chapters', label: 'Chapters', icon: 'bookmark' },
  { type: 'item', key: 'chapter_assignments', label: 'Assign Chapters', icon: 'clipboard' },
  { type: 'item', key: 'skills', label: 'Skills', icon: 'award' },
  { type: 'item', key: 'student_skills', label: 'Grades', icon: 'star' },
  { type: 'heading', label: 'People' },
  { type: 'item', key: 'students', label: 'Students', icon: 'users' },
  { type: 'item', key: 'trainers', label: 'Trainers', icon: 'user-tie' },
  { type: 'item', key: 'volunteers', label: 'Volunteers', icon: 'heart' },
  { type: 'item', key: 'administrators', label: 'Administrators', icon: 'shield' },
  { type: 'heading', label: 'Attendance' },
  { type: 'item', key: 'student_attendance', label: 'Student Attendance', icon: 'check-circle' },
  { type: 'item', key: 'trainer_attendance', label: 'Trainer Attendance', icon: 'clock' },
];

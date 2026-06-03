/**
 * entities.jsx — per-module configuration (table columns + form fields)
 * ====================================================================
 * Ported from the original configs.js ENTITIES. Each entry drives one module
 * page. Column `render` functions return JSX (instead of HTML strings).
 */
import React from 'react';
import { API } from '../api/api.js';
import { Badge } from '../components/Badge.jsx';
import { fmtDate, fmtCurrency, fmtNum } from '../utils/format.js';

export const STATUS_OPTIONS = {
  project: ['Planned', 'Active', 'On Hold', 'Completed'],
  course: ['Active', 'Inactive', 'Completed'],
  trainer: ['Active', 'Inactive', 'On Leave'],
  student: ['Active', 'Inactive', 'Completed', 'Dropped'],
  admin: ['Active', 'Inactive'],
  assignment: ['Scheduled', 'In Progress', 'Completed', 'Cancelled'],
  attendance_student: ['Present', 'Absent', 'Late', 'Excused'],
  attendance_trainer: ['Present', 'Absent', 'Half-day', 'On Leave'],
  volunteer: ['Active', 'Inactive', 'On Break'],
};

// Async option source for FK selects.
export const opts = (entity) => async () => {
  const list = await API.options(entity);
  return list.map((o) => ({ value: o.id, label: o.name }));
};

// Small progress-bar cell used in the projects table.
function ProgressCell({ value }) {
  const pct = value || 0;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 120 }}>
      <div className="progress-bar" style={{ flex: 1 }}>
        <div className={'progress-bar-fill' + (pct >= 100 ? ' full' : '')} style={{ width: `${pct}%` }} />
      </div>
      <span style={{ fontSize: 12, color: 'var(--gray-600)' }}>{pct}%</span>
    </div>
  );
}

export const ENTITIES = {
  // ---------- ADMINISTRATORS ----------
  administrators: {
    title: 'Administrators',
    section: 'People',
    entity: 'administrators',
    icon: 'shield',
    columns: [
      { key: 'id', label: '#', render: (r) => <strong>#{r.id}</strong> },
      { key: 'name', label: 'Name' },
      { key: 'email', label: 'Email' },
      { key: 'role', label: 'Role', render: (r) => <Badge>{r.role}</Badge> },
      { key: 'phone', label: 'Phone' },
      { key: 'status', label: 'Status', render: (r) => <Badge>{r.status}</Badge> },
    ],
    fields: [
      { key: 'name', label: 'Full name', required: true, full: true },
      { key: 'email', label: 'Email', type: 'email', required: true },
      { key: 'phone', label: 'Phone' },
      { key: 'role', label: 'Role', type: 'select', required: true, options: ['SuperAdmin', 'Admin', 'Manager', 'Viewer'] },
      { key: 'status', label: 'Status', type: 'select', required: true, options: STATUS_OPTIONS.admin },
      { key: 'permissions', label: 'Permissions (comma separated)', full: true, placeholder: 'read,write,delete' },
    ],
  },

  // ---------- PROJECTS ----------
  projects: {
    title: 'Project Management',
    section: 'Operations',
    entity: 'projects',
    icon: 'briefcase',
    columns: [
      { key: 'id', label: '#', render: (r) => <strong>#{r.id}</strong> },
      { key: 'name', label: 'Project' },
      { key: 'institution', label: 'Institution' },
      { key: 'start_date', label: 'Start', render: (r) => fmtDate(r.start_date) },
      { key: 'end_date', label: 'End', render: (r) => fmtDate(r.end_date) },
      { key: 'status', label: 'Status', render: (r) => <Badge>{r.status}</Badge> },
      { key: 'progress', label: 'Progress', render: (r) => <ProgressCell value={r.progress} /> },
      { key: 'budget', label: 'Budget', render: (r) => fmtCurrency(r.budget) },
    ],
    fields: [
      { key: 'name', label: 'Project name', required: true, full: true },
      { key: 'institution', label: 'Institution' },
      { key: 'status', label: 'Status', type: 'select', required: true, options: STATUS_OPTIONS.project },
      { key: 'start_date', label: 'Start date', type: 'date' },
      { key: 'end_date', label: 'End date', type: 'date' },
      { key: 'progress', label: 'Progress (%)', type: 'number', min: 0, max: 100 },
      { key: 'budget', label: 'Budget (INR)', type: 'number', min: 0, step: 1000 },
      { key: 'description', label: 'Description', type: 'textarea', full: true },
    ],
  },

  // ---------- COURSES ----------
  courses: {
    title: 'Course Management',
    section: 'Academics',
    entity: 'courses',
    icon: 'book',
    columns: [
      { key: 'id', label: '#', render: (r) => <strong>#{r.id}</strong> },
      { key: 'name', label: 'Course' },
      { key: 'project_name', label: 'Project' },
      { key: 'target_group', label: 'Target group' },
      { key: 'duration_weeks', label: 'Duration', render: (r) => `${r.duration_weeks || 0} weeks` },
      { key: 'status', label: 'Status', render: (r) => <Badge>{r.status}</Badge> },
    ],
    fields: [
      { key: 'name', label: 'Course name', required: true, full: true },
      { key: 'project_id', label: 'Project', type: 'select', options: opts('projects') },
      { key: 'status', label: 'Status', type: 'select', required: true, options: STATUS_OPTIONS.course },
      { key: 'duration_weeks', label: 'Duration (weeks)', type: 'number', min: 1 },
      { key: 'target_group', label: 'Target group' },
      { key: 'objectives', label: 'Objectives', type: 'textarea', full: true },
      { key: 'learning_outcomes', label: 'Learning outcomes', type: 'textarea', full: true },
    ],
  },

  // ---------- MODULES ----------
  modules: {
    title: 'Modules Management',
    section: 'Academics',
    entity: 'modules',
    icon: 'layers',
    columns: [
      { key: 'id', label: '#', render: (r) => <strong>#{r.id}</strong> },
      { key: 'sequence', label: 'Seq' },
      { key: 'name', label: 'Module' },
      { key: 'course_name', label: 'Course' },
      { key: 'duration_hours', label: 'Duration', render: (r) => `${r.duration_hours || 0} hrs` },
    ],
    fields: [
      { key: 'name', label: 'Module name', required: true, full: true },
      { key: 'course_id', label: 'Course', type: 'select', required: true, options: opts('courses') },
      { key: 'sequence', label: 'Sequence number', type: 'number', min: 1 },
      { key: 'duration_hours', label: 'Duration (hours)', type: 'number', min: 1 },
      { key: 'learning_goals', label: 'Learning goals', type: 'textarea', full: true },
    ],
  },

  // ---------- CHAPTERS ----------
  chapters: {
    title: 'Chapters Management',
    section: 'Academics',
    entity: 'chapters',
    icon: 'bookmark',
    columns: [
      { key: 'id', label: '#', render: (r) => <strong>#{r.id}</strong> },
      { key: 'sequence', label: 'Seq' },
      { key: 'name', label: 'Chapter' },
      { key: 'module_name', label: 'Module' },
      { key: 'content_type', label: 'Type', render: (r) => <Badge>{r.content_type}</Badge> },
    ],
    fields: [
      { key: 'name', label: 'Chapter name', required: true, full: true },
      { key: 'module_id', label: 'Module', type: 'select', required: true, options: opts('modules') },
      { key: 'sequence', label: 'Sequence', type: 'number', min: 1 },
      { key: 'content_type', label: 'Content type', type: 'select', options: ['Theory', 'Practical', 'Skill', 'Assessment'] },
      { key: 'description', label: 'Description', type: 'textarea', full: true },
    ],
  },

  // ---------- SKILLS ----------
  skills: {
    title: 'Grades / Skills Management',
    section: 'Academics',
    entity: 'skills',
    icon: 'award',
    columns: [
      { key: 'id', label: '#', render: (r) => <strong>#{r.id}</strong> },
      { key: 'name', label: 'Skill' },
      { key: 'category', label: 'Category', render: (r) => <Badge>{r.category}</Badge> },
      { key: 'max_grade', label: 'Max grade' },
      { key: 'description', label: 'Description' },
    ],
    fields: [
      { key: 'name', label: 'Skill name', required: true, full: true },
      { key: 'category', label: 'Category', type: 'select', required: true, options: ['Technical', 'Soft', 'Practical'] },
      { key: 'max_grade', label: 'Max grade', type: 'number', min: 1 },
      { key: 'description', label: 'Description', type: 'textarea', full: true },
    ],
  },

  // ---------- CHAPTER ASSIGNMENTS ----------
  chapter_assignments: {
    title: 'Assign Chapter Management',
    section: 'Academics',
    entity: 'chapter_assignments',
    icon: 'clipboard',
    columns: [
      { key: 'id', label: '#', render: (r) => <strong>#{r.id}</strong> },
      { key: 'chapter_name', label: 'Chapter' },
      { key: 'trainer_name', label: 'Trainer' },
      { key: 'batch', label: 'Batch' },
      { key: 'scheduled_date', label: 'Scheduled', render: (r) => fmtDate(r.scheduled_date) },
      { key: 'status', label: 'Status', render: (r) => <Badge>{r.status}</Badge> },
    ],
    fields: [
      { key: 'chapter_id', label: 'Chapter', type: 'select', required: true, options: opts('chapters') },
      { key: 'trainer_id', label: 'Trainer', type: 'select', required: true, options: opts('trainers') },
      { key: 'batch', label: 'Batch', required: true, placeholder: 'B-2026-A' },
      { key: 'scheduled_date', label: 'Scheduled date', type: 'date' },
      { key: 'status', label: 'Status', type: 'select', required: true, options: STATUS_OPTIONS.assignment },
      { key: 'notes', label: 'Notes', type: 'textarea', full: true },
    ],
  },

  // ---------- TRAINERS ----------
  trainers: {
    title: 'Trainer Management',
    section: 'People',
    entity: 'trainers',
    icon: 'user-tie',
    columns: [
      { key: 'id', label: '#', render: (r) => <strong>#{r.id}</strong> },
      { key: 'name', label: 'Name' },
      { key: 'email', label: 'Email' },
      { key: 'phone', label: 'Phone' },
      { key: 'specialization', label: 'Specialization' },
      { key: 'experience_years', label: 'Experience', render: (r) => `${r.experience_years || 0} yrs` },
      { key: 'status', label: 'Status', render: (r) => <Badge>{r.status}</Badge> },
    ],
    fields: [
      { key: 'name', label: 'Full name', required: true, full: true },
      { key: 'email', label: 'Email', type: 'email', required: true },
      { key: 'phone', label: 'Phone' },
      { key: 'specialization', label: 'Specialization' },
      { key: 'qualification', label: 'Qualification' },
      { key: 'experience_years', label: 'Experience (yrs)', type: 'number', min: 0 },
      { key: 'status', label: 'Status', type: 'select', required: true, options: STATUS_OPTIONS.trainer },
      { key: 'joined_date', label: 'Joined date', type: 'date' },
    ],
  },

  // ---------- VOLUNTEERS ----------
  volunteers: {
    title: 'Volunteer Management',
    section: 'People',
    entity: 'volunteers',
    icon: 'heart',
    columns: [
      { key: 'id', label: '#', render: (r) => <strong>#{r.id}</strong> },
      { key: 'name', label: 'Name' },
      { key: 'email', label: 'Email' },
      { key: 'organization', label: 'Organization' },
      { key: 'expertise', label: 'Expertise' },
      { key: 'area_of_interest', label: 'Interest', render: (r) => <Badge>{r.area_of_interest}</Badge> },
      { key: 'availability', label: 'Availability' },
      { key: 'activity_name', label: 'Activity' },
      { key: 'hours_contributed', label: 'Hours', render: (r) => fmtNum(r.hours_contributed) },
      { key: 'status', label: 'Status', render: (r) => <Badge>{r.status}</Badge> },
    ],
    fields: [
      { key: 'name', label: 'Full name', required: true, full: true },
      { key: 'email', label: 'Email', type: 'email', required: true },
      { key: 'phone', label: 'Phone' },
      { key: 'organization', label: 'Organization / Company' },
      { key: 'expertise', label: 'Expertise / Skills offered', full: true, placeholder: 'e.g. Python, UI Design, Public Speaking' },
      { key: 'area_of_interest', label: 'Area of interest', type: 'select', required: true, options: ['Mentoring', 'Teaching', 'Workshop', 'Content', 'Outreach', 'CSR', 'Event Support'] },
      { key: 'availability', label: 'Availability', type: 'select', required: true, options: ['Weekdays', 'Weekends', 'Flexible', 'Project-based'] },
      { key: 'activity_id', label: 'Assigned activity', type: 'select', options: opts('activities') },
      { key: 'hours_contributed', label: 'Hours contributed', type: 'number', min: 0 },
      { key: 'joined_date', label: 'Joined date', type: 'date' },
      { key: 'status', label: 'Status', type: 'select', required: true, options: STATUS_OPTIONS.volunteer },
      { key: 'notes', label: 'Notes', type: 'textarea', full: true },
    ],
  },

  // ---------- STUDENTS ----------
  students: {
    title: 'Student Management',
    section: 'People',
    entity: 'students',
    icon: 'users',
    columns: [
      { key: 'id', label: '#', render: (r) => <strong>#{r.id}</strong> },
      { key: 'name', label: 'Name' },
      { key: 'email', label: 'Email' },
      { key: 'batch', label: 'Batch' },
      { key: 'project_name', label: 'Project' },
      { key: 'course_name', label: 'Course' },
      { key: 'institution', label: 'Institution' },
      { key: 'status', label: 'Status', render: (r) => <Badge>{r.status}</Badge> },
    ],
    fields: [
      { key: 'name', label: 'Full name', required: true, full: true },
      { key: 'email', label: 'Email', type: 'email', required: true },
      { key: 'phone', label: 'Phone' },
      { key: 'gender', label: 'Gender', type: 'select', options: ['Male', 'Female', 'Other'] },
      { key: 'project_id', label: 'Project', type: 'select', options: opts('projects') },
      { key: 'course_id', label: 'Course', type: 'select', options: opts('courses') },
      { key: 'batch', label: 'Batch', placeholder: 'B-2026-A' },
      { key: 'institution', label: 'Institution' },
      { key: 'enrollment_date', label: 'Enrollment date', type: 'date' },
      { key: 'status', label: 'Status', type: 'select', required: true, options: STATUS_OPTIONS.student },
    ],
  },

  // ---------- ACTIVITIES ----------
  activities: {
    title: 'Activity Management',
    section: 'Operations',
    entity: 'activities',
    icon: 'activity',
    columns: [
      { key: 'id', label: '#', render: (r) => <strong>#{r.id}</strong> },
      { key: 'name', label: 'Activity' },
      { key: 'activity_type', label: 'Type', render: (r) => <Badge>{r.activity_type}</Badge> },
      { key: 'project_name', label: 'Project' },
      { key: 'activity_date', label: 'Date', render: (r) => fmtDate(r.activity_date) },
      { key: 'location', label: 'Location' },
      { key: 'participants_count', label: 'Participants', render: (r) => fmtNum(r.participants_count) },
    ],
    fields: [
      { key: 'name', label: 'Activity name', required: true, full: true },
      { key: 'activity_type', label: 'Type', type: 'select', required: true, options: ['Classroom', 'Practical', 'Workshop', 'Hackathon', 'CSR', 'Event'] },
      { key: 'project_id', label: 'Project', type: 'select', options: opts('projects') },
      { key: 'activity_date', label: 'Date', type: 'date' },
      { key: 'location', label: 'Location' },
      { key: 'participants_count', label: 'Participants', type: 'number', min: 0 },
      { key: 'description', label: 'Description', type: 'textarea', full: true },
    ],
  },

  // ---------- STUDENT ATTENDANCE ----------
  student_attendance: {
    title: 'Manage Student Attendance',
    section: 'Attendance',
    entity: 'student_attendance',
    icon: 'check-circle',
    columns: [
      { key: 'id', label: '#', render: (r) => <strong>#{r.id}</strong> },
      { key: 'attendance_date', label: 'Date', render: (r) => fmtDate(r.attendance_date) },
      { key: 'student_name', label: 'Student' },
      { key: 'course_name', label: 'Course' },
      { key: 'session', label: 'Session' },
      { key: 'status', label: 'Status', render: (r) => <Badge>{r.status}</Badge> },
    ],
    fields: [
      { key: 'student_id', label: 'Student', type: 'select', required: true, options: opts('students') },
      { key: 'course_id', label: 'Course', type: 'select', options: opts('courses') },
      { key: 'attendance_date', label: 'Date', type: 'date', required: true },
      { key: 'session', label: 'Session', type: 'select', options: ['Morning', 'Afternoon', 'Full Day'] },
      { key: 'status', label: 'Status', type: 'select', required: true, options: STATUS_OPTIONS.attendance_student },
      { key: 'remarks', label: 'Remarks', type: 'textarea', full: true },
    ],
  },

  // ---------- TRAINER ATTENDANCE ----------
  trainer_attendance: {
    title: 'Trainer Attendance',
    section: 'Attendance',
    entity: 'trainer_attendance',
    icon: 'clock',
    columns: [
      { key: 'id', label: '#', render: (r) => <strong>#{r.id}</strong> },
      { key: 'attendance_date', label: 'Date', render: (r) => fmtDate(r.attendance_date) },
      { key: 'trainer_name', label: 'Trainer' },
      { key: 'hours_taught', label: 'Hours' },
      { key: 'status', label: 'Status', render: (r) => <Badge>{r.status}</Badge> },
    ],
    fields: [
      { key: 'trainer_id', label: 'Trainer', type: 'select', required: true, options: opts('trainers') },
      { key: 'attendance_date', label: 'Date', type: 'date', required: true },
      { key: 'hours_taught', label: 'Hours taught', type: 'number', min: 0, step: 0.5 },
      { key: 'status', label: 'Status', type: 'select', required: true, options: STATUS_OPTIONS.attendance_trainer },
      { key: 'remarks', label: 'Remarks', type: 'textarea', full: true },
    ],
  },

  // ---------- STUDENT SKILLS (grades) ----------
  student_skills: {
    title: 'Student Skills & Grades',
    section: 'Academics',
    entity: 'student_skills',
    icon: 'star',
    columns: [
      { key: 'id', label: '#', render: (r) => <strong>#{r.id}</strong> },
      { key: 'student_name', label: 'Student' },
      { key: 'skill_name', label: 'Skill' },
      { key: 'grade', label: 'Grade' },
      { key: 'skill_level', label: 'Level', render: (r) => <Badge>{r.skill_level}</Badge> },
      { key: 'evaluated_on', label: 'Evaluated', render: (r) => fmtDate(r.evaluated_on) },
    ],
    fields: [
      { key: 'student_id', label: 'Student', type: 'select', required: true, options: opts('students') },
      { key: 'skill_id', label: 'Skill', type: 'select', required: true, options: opts('skills') },
      { key: 'grade', label: 'Grade', type: 'number', min: 0, max: 100 },
      { key: 'skill_level', label: 'Skill level', type: 'select', options: ['Beginner', 'Intermediate', 'Advanced', 'Expert'] },
      { key: 'evaluated_on', label: 'Evaluated on', type: 'date' },
      { key: 'remarks', label: 'Remarks', type: 'textarea', full: true },
    ],
  },
};

/** Crude singularizer for button/title text — matches the original. */
export function singularize(title) {
  if (title.endsWith('Management')) return title.replace(/ Management$/, '');
  if (title.endsWith('s')) return title.slice(0, -1);
  return title;
}

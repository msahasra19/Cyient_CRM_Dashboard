/**
 * entities.config.js — definition of every CRUD module
 * ====================================================
 * Each entry is fed to buildCrud() to generate a full set of REST endpoints.
 * Mirrors the Flask build_crud(...) registrations one-for-one.
 */
export const ENTITY_DEFS = [
  {
    name: 'administrators',
    table: 'administrators',
    fields: ['name', 'email', 'role', 'permissions', 'phone', 'status'],
    searchFields: ['name', 'email', 'role'],
  },
  {
    name: 'projects',
    table: 'projects',
    fields: ['name', 'description', 'institution', 'start_date', 'end_date', 'status', 'progress', 'budget'],
    searchFields: ['name', 'institution', 'status'],
  },
  {
    name: 'courses',
    table: 'courses',
    fields: ['name', 'project_id', 'duration_weeks', 'objectives', 'learning_outcomes', 'target_group', 'status'],
    searchFields: ['courses.name', 'target_group', 'courses.status'],
    selectExtra: 'projects.name AS project_name',
    joins: 'LEFT JOIN projects ON courses.project_id = projects.id',
  },
  {
    name: 'modules',
    table: 'modules',
    fields: ['name', 'course_id', 'learning_goals', 'sequence', 'duration_hours'],
    searchFields: ['modules.name', 'learning_goals'],
    selectExtra: 'courses.name AS course_name',
    joins: 'LEFT JOIN courses ON modules.course_id = courses.id',
  },
  {
    name: 'chapters',
    table: 'chapters',
    fields: ['name', 'module_id', 'content_type', 'sequence', 'description'],
    searchFields: ['chapters.name', 'content_type'],
    selectExtra: 'modules.name AS module_name',
    joins: 'LEFT JOIN modules ON chapters.module_id = modules.id',
  },
  {
    name: 'skills',
    table: 'skills',
    fields: ['name', 'description', 'category', 'max_grade'],
    searchFields: ['name', 'category'],
  },
  {
    name: 'trainers',
    table: 'trainers',
    fields: ['name', 'email', 'phone', 'specialization', 'qualification', 'experience_years', 'status', 'joined_date'],
    searchFields: ['name', 'email', 'specialization', 'status'],
  },
  {
    name: 'students',
    table: 'students',
    fields: ['name', 'email', 'phone', 'project_id', 'course_id', 'batch', 'enrollment_date', 'status', 'gender', 'institution'],
    searchFields: ['students.name', 'students.email', 'batch', 'institution'],
    selectExtra: 'projects.name AS project_name, courses.name AS course_name',
    joins: 'LEFT JOIN projects ON students.project_id = projects.id LEFT JOIN courses ON students.course_id = courses.id',
  },
  {
    name: 'chapter_assignments',
    table: 'chapter_assignments',
    fields: ['chapter_id', 'trainer_id', 'batch', 'scheduled_date', 'status', 'notes'],
    searchFields: ['batch', 'chapter_assignments.status'],
    selectExtra: 'chapters.name AS chapter_name, trainers.name AS trainer_name',
    joins: 'LEFT JOIN chapters ON chapter_assignments.chapter_id = chapters.id LEFT JOIN trainers ON chapter_assignments.trainer_id = trainers.id',
  },
  {
    name: 'activities',
    table: 'activities',
    fields: ['name', 'activity_type', 'project_id', 'activity_date', 'description', 'participants_count', 'location'],
    searchFields: ['activities.name', 'activity_type', 'location'],
    selectExtra: 'projects.name AS project_name',
    joins: 'LEFT JOIN projects ON activities.project_id = projects.id',
  },
  {
    name: 'student_attendance',
    table: 'student_attendance',
    fields: ['student_id', 'course_id', 'attendance_date', 'session', 'status', 'remarks'],
    searchFields: ['student_attendance.status', 'session'],
    selectExtra: 'students.name AS student_name, courses.name AS course_name',
    joins: 'LEFT JOIN students ON student_attendance.student_id = students.id LEFT JOIN courses ON student_attendance.course_id = courses.id',
  },
  {
    name: 'trainer_attendance',
    table: 'trainer_attendance',
    fields: ['trainer_id', 'attendance_date', 'hours_taught', 'status', 'remarks'],
    searchFields: ['trainer_attendance.status'],
    selectExtra: 'trainers.name AS trainer_name',
    joins: 'LEFT JOIN trainers ON trainer_attendance.trainer_id = trainers.id',
  },
  {
    name: 'student_skills',
    table: 'student_skills',
    fields: ['student_id', 'skill_id', 'grade', 'skill_level', 'evaluated_on', 'remarks'],
    searchFields: ['skill_level'],
    selectExtra: 'students.name AS student_name, skills.name AS skill_name',
    joins: 'LEFT JOIN students ON student_skills.student_id = students.id LEFT JOIN skills ON student_skills.skill_id = skills.id',
  },
  {
    name: 'volunteers',
    table: 'volunteers',
    fields: ['name', 'email', 'phone', 'organization', 'expertise', 'area_of_interest', 'availability', 'activity_id', 'hours_contributed', 'joined_date', 'status', 'notes'],
    searchFields: ['volunteers.name', 'email', 'organization', 'expertise', 'area_of_interest'],
    selectExtra: 'activities.name AS activity_name',
    joins: 'LEFT JOIN activities ON volunteers.activity_id = activities.id',
  },
];

/**
 * seed.js — sample data for the CRM dashboard
 * ===========================================
 * Faithful port of the original Flask seed_data.py. A small deterministic
 * PRNG (mulberry32) is used so every fresh install gets the same realistic
 * data set, exactly like the Python version's random.seed(42).
 */

// ---- deterministic PRNG (so seeding is reproducible) ----
function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(42);
const randInt = (min, max) => Math.floor(rand() * (max - min + 1)) + min; // inclusive
const choice = (arr) => arr[Math.floor(rand() * arr.length)];
const choices = (arr, k = 1) => Array.from({ length: k }, () => choice(arr));
function sample(arr, k) {
  const pool = [...arr];
  const out = [];
  for (let i = 0; i < k && pool.length; i++) {
    const idx = Math.floor(rand() * pool.length);
    out.push(pool.splice(idx, 1)[0]);
  }
  return out;
}
const range = (start, endInclusive) =>
  Array.from({ length: endInclusive - start + 1 }, (_, i) => start + i);
const isoDate = (d) => d.toISOString().slice(0, 10);
const addDays = (date, days) => new Date(date.getTime() + days * 86400000);

export function seed(db) {
  const insertMany = (sql, rows) => {
    const stmt = db.prepare(sql);
    db.exec('BEGIN');
    try {
      for (const r of rows) stmt.run(r);
      db.exec('COMMIT');
    } catch (e) {
      db.exec('ROLLBACK');
      throw e;
    } finally {
      stmt.finalize();
    }
  };

  // -------- Administrators --------
  const admins = [
    ['Ramesh Kumar', 'ramesh.kumar@cyientfoundation.org', 'SuperAdmin', 'read,write,delete,admin', '+91 9000000001', 'Active'],
    ['Priya Sharma', 'priya.sharma@cyientfoundation.org', 'Admin', 'read,write', '+91 9000000002', 'Active'],
    ['Vikram Singh', 'vikram.singh@cyientfoundation.org', 'Manager', 'read,write', '+91 9000000003', 'Active'],
    ['Sunita Rao', 'sunita.rao@cyientfoundation.org', 'Viewer', 'read', '+91 9000000004', 'Active'],
  ];
  insertMany(
    'INSERT INTO administrators (name,email,role,permissions,phone,status) VALUES (?,?,?,?,?,?)',
    admins
  );

  // -------- Projects --------
  const projects = [
    ['Skill India - Telangana', 'Digital literacy and employability programme across rural Telangana.', 'Cyient Foundation', '2026-01-15', '2026-12-30', 'Active', 62, 5000000],
    ['Women in STEM', 'Promoting women participation in STEM fields through workshops and mentoring.', 'Cyient Foundation x KL University', '2026-02-01', '2026-11-30', 'Active', 45, 3200000],
    ['Industrial IoT Training', 'IoT training programme for ITI students.', 'Cyient Foundation', '2026-03-10', '2026-10-30', 'Active', 30, 2500000],
    ['Rural Coding Bootcamp', 'Python and web development bootcamp for rural youth.', 'Cyient Foundation x Govt Schools', '2025-08-01', '2026-03-31', 'Completed', 100, 1800000],
    ['AI for Educators', 'AI awareness and tools training for school educators.', 'Cyient Foundation', '2026-04-01', '2026-09-30', 'Planned', 5, 1500000],
  ];
  insertMany(
    'INSERT INTO projects (name,description,institution,start_date,end_date,status,progress,budget) VALUES (?,?,?,?,?,?,?,?)',
    projects
  );

  // -------- Courses --------
  const courses = [
    ['Digital Literacy Foundations', 1, 8, 'Build comfort with computers, internet and basic productivity tools.', 'Use Office tools, browse safely, communicate digitally.', 'Rural youth (18-25)', 'Active'],
    ['Employability & Soft Skills', 1, 6, 'Develop communication, teamwork and interview skills.', 'Crack entry-level interviews, write resumes, communicate clearly.', 'Rural youth (18-25)', 'Active'],
    ['Python for STEM', 2, 12, 'Python programming foundations for women in STEM.', 'Write Python scripts, automate tasks, basic data analysis.', 'Women undergraduates', 'Active'],
    ['Robotics Foundations', 2, 10, 'Arduino, sensors, robotic kits.', 'Build small robots, understand sensors and actuators.', 'Women undergraduates', 'Active'],
    ['IoT with Arduino', 3, 8, 'Hands-on IoT prototypes using Arduino and ESP32.', 'Build 3 IoT prototypes, understand protocols.', 'ITI students', 'Active'],
    ['Web Development Basics', 4, 10, 'HTML / CSS / JavaScript foundations.', 'Build static and interactive websites.', 'Rural youth (18-25)', 'Completed'],
    ['AI Tools for Teachers', 5, 4, 'Practical AI tools for lesson planning and admin.', 'Use AI for lesson plans and content.', 'School educators', 'Planned'],
  ];
  insertMany(
    'INSERT INTO courses (name,project_id,duration_weeks,objectives,learning_outcomes,target_group,status) VALUES (?,?,?,?,?,?,?)',
    courses
  );

  // -------- Modules --------
  const modules = [
    ['Computer Basics', 1, 'Understand hardware, OS basics, files & folders.', 1, 8],
    ['Internet & Email', 1, 'Browse safely, set up email, use search engines.', 2, 6],
    ['Office Productivity', 1, 'Word, Excel, basic PowerPoint.', 3, 10],
    ['Communication Skills', 2, 'Verbal, written and digital communication.', 1, 6],
    ['Interview Preparation', 2, 'Resume, mock interviews, group discussions.', 2, 6],
    ['Python Fundamentals', 3, 'Variables, data types, control flow.', 1, 12],
    ['Functions & Modules', 3, 'Code organisation and reuse.', 2, 8],
    ['Data with Pandas', 3, 'Read, clean and analyse tabular data.', 3, 10],
    ['Arduino Basics', 5, 'Setup, sketches, digital and analog IO.', 1, 8],
    ['Sensors & Actuators', 5, 'Working with common sensors and motors.', 2, 8],
    ['IoT Cloud', 5, 'Connect device to cloud, build a dashboard.', 3, 6],
  ];
  insertMany(
    'INSERT INTO modules (name,course_id,learning_goals,sequence,duration_hours) VALUES (?,?,?,?,?)',
    modules
  );

  // -------- Chapters --------
  const chapters = [
    ['Introduction to Computers', 1, 'Theory', 1, 'What is a computer, components, types.'],
    ['Operating System Basics', 1, 'Theory', 2, 'Windows / Linux essentials.'],
    ['Files and Folders', 1, 'Practical', 3, 'Create, move, copy, search.'],
    ['Browsing the Web', 2, 'Practical', 1, 'Browsers, tabs, bookmarks, downloads.'],
    ['Setting up Email', 2, 'Practical', 2, 'Create Gmail, attachments, drafts.'],
    ['Word Processing', 3, 'Practical', 1, 'Documents, formatting, tables.'],
    ['Spreadsheets', 3, 'Practical', 2, 'Cells, formulas, charts.'],
    ['Hello Python', 6, 'Practical', 1, 'Install, REPL, first script.'],
    ['Variables & Types', 6, 'Theory', 2, 'int, float, str, list, dict.'],
    ['Control Flow', 6, 'Practical', 3, 'if, for, while.'],
    ['Functions', 7, 'Practical', 1, 'def, args, return.'],
    ['Modules & Imports', 7, 'Practical', 2, 'Standard library, pip.'],
    ['Arduino IDE', 9, 'Practical', 1, 'Setup, sketches, board selection.'],
    ['Digital I/O', 9, 'Practical', 2, 'LED blink, buttons, debouncing.'],
    ['Analog I/O', 9, 'Practical', 3, 'PWM, analog read.'],
  ];
  insertMany(
    'INSERT INTO chapters (name,module_id,content_type,sequence,description) VALUES (?,?,?,?,?)',
    chapters
  );

  // -------- Skills --------
  const skills = [
    ['Python Programming', 'Writing Python scripts and small applications.', 'Technical', 100],
    ['HTML/CSS', 'Building static web pages.', 'Technical', 100],
    ['Communication', 'Spoken and written communication.', 'Soft', 100],
    ['Teamwork', 'Working effectively in a team.', 'Soft', 100],
    ['Problem Solving', 'Breaking down and solving problems.', 'Soft', 100],
    ['Arduino Prototyping', 'Building Arduino-based prototypes.', 'Practical', 100],
    ['MS Excel', 'Data entry, formulas, basic analysis.', 'Technical', 100],
    ['Resume Building', 'Crafting a professional resume.', 'Soft', 100],
  ];
  insertMany('INSERT INTO skills (name,description,category,max_grade) VALUES (?,?,?,?)', skills);

  // -------- Trainers --------
  const trainers = [
    ['Dr. Anil Reddy', 'anil.reddy@cyient.org', '+91 9111111111', 'Python, Data Science', 'PhD Computer Science', 12, 'Active', '2024-06-01'],
    ['Meena Iyer', 'meena.iyer@cyient.org', '+91 9111111112', 'Communication, Soft Skills', 'MA English, TESOL', 8, 'Active', '2024-07-15'],
    ['Sanjay Patel', 'sanjay.patel@cyient.org', '+91 9111111113', 'Electronics, IoT, Arduino', 'M.Tech Electronics', 10, 'Active', '2024-05-20'],
    ['Lakshmi Narayanan', 'lakshmi.n@cyient.org', '+91 9111111114', 'MS Office, Digital Literacy', 'MCA', 6, 'Active', '2025-01-10'],
    ['Rohit Verma', 'rohit.verma@cyient.org', '+91 9111111115', 'Web Development, JavaScript', 'B.Tech IT', 5, 'On Leave', '2025-03-05'],
    ['Kavya Krishnan', 'kavya.k@cyient.org', '+91 9111111116', 'AI, Machine Learning', 'M.Tech AI', 7, 'Active', '2025-02-12'],
  ];
  insertMany(
    'INSERT INTO trainers (name,email,phone,specialization,qualification,experience_years,status,joined_date) VALUES (?,?,?,?,?,?,?,?)',
    trainers
  );

  // -------- Students (60, generated) --------
  const firstNames = ['Aarav', 'Aditi', 'Arjun', 'Ananya', 'Bhavya', 'Chetan', 'Divya', 'Esha', 'Farhan', 'Gauri',
    'Harsh', 'Ishaan', 'Jaya', 'Kiran', 'Lavanya', 'Manoj', 'Neha', 'Omkar', 'Pooja', 'Quasim',
    'Rahul', 'Sneha', 'Tanvi', 'Uday', 'Vidya', 'Yash', 'Zara', 'Aryan', 'Bindu', 'Chirag'];
  const lastNames = ['Reddy', 'Sharma', 'Patel', 'Kumar', 'Singh', 'Rao', 'Naidu', 'Iyer', 'Krishnan', 'Joshi',
    'Mehta', 'Das', 'Gupta', 'Bose', 'Pillai', 'Menon', 'Chowdhury', 'Bhat', 'Shetty', 'Nair'];
  const institutions = ['Govt ITI Hyderabad', 'KL University', 'Govt High School Warangal',
    'Polytechnic Nizamabad', 'Govt ITI Karimnagar', 'Anurag University'];
  const courseByProject = { 1: [1, 2], 2: [3, 4], 3: [5], 4: [6], 5: [7] };

  const students = [];
  for (let i = 0; i < 60; i++) {
    const name = `${choice(firstNames)} ${choice(lastNames)}`;
    const email = `student${String(i + 1).padStart(3, '0')}@learner.cyient.org`;
    const phone = `+91 9${randInt(100000000, 999999999)}`;
    const projectId = choice([1, 1, 1, 2, 2, 3, 4]);
    const courseId = choice(courseByProject[projectId] || [1]);
    const batch = `B-2026-${choice(['A', 'B', 'C'])}`;
    const enrollmentDate = isoDate(addDays(new Date(2026, 0, 1), randInt(0, 90)));
    const status = choice(['Active', 'Active', 'Active', 'Completed', 'Inactive']);
    const gender = choice(['Male', 'Female', 'Female', 'Male']);
    const institution = choice(institutions);
    students.push([name, email, phone, projectId, courseId, batch, enrollmentDate, status, gender, institution]);
  }
  insertMany(
    'INSERT INTO students (name,email,phone,project_id,course_id,batch,enrollment_date,status,gender,institution) VALUES (?,?,?,?,?,?,?,?,?,?)',
    students
  );

  // -------- student_skills (2-4 evaluations per student) --------
  const studentSkillRows = [];
  for (let sid = 1; sid <= 60; sid++) {
    for (const skillId of sample(range(1, 8), randInt(2, 4))) {
      const grade = randInt(40, 98);
      const level = grade < 55 ? 'Beginner' : grade < 75 ? 'Intermediate' : grade < 90 ? 'Advanced' : 'Expert';
      const evaluatedOn = isoDate(addDays(new Date(2026, 1, 1), randInt(0, 80)));
      studentSkillRows.push([sid, skillId, grade, level, evaluatedOn, '']);
    }
  }
  insertMany(
    'INSERT INTO student_skills (student_id,skill_id,grade,skill_level,evaluated_on,remarks) VALUES (?,?,?,?,?,?)',
    studentSkillRows
  );

  // -------- Chapter Assignments --------
  const chapterAssignments = [];
  const trainerIds = range(1, 6);
  const batches = ['B-2026-A', 'B-2026-B', 'B-2026-C'];
  for (const ch of range(1, 15)) {
    for (const b of sample(batches, randInt(1, 2))) {
      const trainer = choice(trainerIds);
      const sched = isoDate(addDays(new Date(2026, 2, 1), randInt(0, 60)));
      const status = choice(['Scheduled', 'In Progress', 'Completed']);
      chapterAssignments.push([ch, trainer, b, sched, status, '']);
    }
  }
  insertMany(
    'INSERT INTO chapter_assignments (chapter_id,trainer_id,batch,scheduled_date,status,notes) VALUES (?,?,?,?,?,?)',
    chapterAssignments
  );

  // -------- Activities --------
  const activities = [
    ['Inaugural Workshop Hyderabad', 'Workshop', 1, '2026-02-05', 'Programme launch workshop.', 80, 'Hyderabad'],
    ['Hackathon: SmartCity', 'Hackathon', 2, '2026-04-10', '24hr SmartCity solutions hackathon.', 60, 'KL University Hyderabad'],
    ['IoT Demo Day', 'Practical', 3, '2026-05-12', 'Students showcase IoT prototypes.', 45, 'Cyient Madhapur'],
    ['Resume Building Workshop', 'Workshop', 1, '2026-03-20', 'Resume + LinkedIn workshop.', 70, 'Online'],
    ['Women in Tech Panel', 'Event', 2, '2026-03-08', "Industry panel for International Women's Day.", 120, 'Cyient HQ'],
    ['CSR Tree Plantation', 'CSR', 1, '2026-06-05', 'World Environment Day plantation drive.', 50, 'Outskirts of Warangal'],
    ['AI Awareness Seminar', 'Workshop', 5, '2026-04-15', 'Introductory AI seminar for educators.', 40, 'Online'],
    ['Mid-term Assessment', 'Classroom', 1, '2026-04-22', 'Mid-programme student assessment.', 90, 'Multiple centres'],
  ];
  insertMany(
    'INSERT INTO activities (name,activity_type,project_id,activity_date,description,participants_count,location) VALUES (?,?,?,?,?,?,?)',
    activities
  );

  // -------- Student Attendance (last 30 days) --------
  const saRows = [];
  const today = new Date(2026, 4, 17); // 2026-05-17
  const saStatuses = ['Present', 'Present', 'Present', 'Present', 'Absent', 'Late', 'Excused'];
  for (let dayOffset = 0; dayOffset < 30; dayOffset++) {
    const d = isoDate(addDays(today, -dayOffset));
    for (const sid of sample(range(1, 60), 25)) {
      const courseId = randInt(1, 5);
      const session = choice(['Morning', 'Afternoon', 'Full Day']);
      const st = choice(saStatuses);
      saRows.push([sid, courseId, d, session, st, '']);
    }
  }
  insertMany(
    'INSERT INTO student_attendance (student_id,course_id,attendance_date,session,status,remarks) VALUES (?,?,?,?,?,?)',
    saRows
  );

  // -------- Trainer Attendance (last 30 days) --------
  const taRows = [];
  for (let dayOffset = 0; dayOffset < 30; dayOffset++) {
    const d = isoDate(addDays(today, -dayOffset));
    for (let tid = 1; tid <= 6; tid++) {
      const status = choice(['Present', 'Present', 'Present', 'Half-day', 'Absent', 'On Leave']);
      const hours = { Present: choice([6, 7, 8]), 'Half-day': 4, Absent: 0, 'On Leave': 0 }[status];
      taRows.push([tid, d, hours, status, '']);
    }
  }
  insertMany(
    'INSERT INTO trainer_attendance (trainer_id,attendance_date,hours_taught,status,remarks) VALUES (?,?,?,?,?)',
    taRows
  );

  // -------- Volunteers --------
  const volunteers = [
    ['Aarav Mehta', 'aarav.mehta@volunteer.org', '+919812340001', 'Infosys Foundation', 'Python, Data Science', 'Mentoring', 'Weekends', 1, 24, '2026-01-15', 'Active', 'Mentors final-year ML capstone groups'],
    ['Diya Sharma', 'diya.sharma@volunteer.org', '+919812340002', 'TCS', 'UI/UX, Figma', 'Teaching', 'Weekdays', 2, 36, '2026-01-22', 'Active', 'Conducts design thinking workshops'],
    ['Rohan Iyer', 'rohan.iyer@volunteer.org', '+919812340003', 'Wipro', 'Java, Spring Boot', 'Mentoring', 'Flexible', 3, 18, '2026-02-05', 'Active', 'Backend mentor for student projects'],
    ['Ananya Reddy', 'ananya.reddy@volunteer.org', '+919812340004', 'Independent', 'Public Speaking, Soft Skills', 'Workshop', 'Weekends', 4, 12, '2026-02-12', 'Active', 'Runs communication-skills sessions'],
    ['Kabir Singh', 'kabir.singh@volunteer.org', '+919812340005', 'Cyient', 'Embedded Systems, IoT', 'Teaching', 'Weekdays', 5, 28, '2026-02-20', 'Active', 'Industry mentor for IoT module'],
    ['Meera Krishnan', 'meera.krishnan@volunteer.org', '+919812340006', 'Tech Mahindra', 'Content Writing, Curriculum', 'Content', 'Flexible', null, 15, '2026-03-01', 'Active', 'Reviews course material'],
    ['Vihaan Patel', 'vihaan.patel@volunteer.org', '+919812340007', 'Accenture', 'Cloud, DevOps', 'Mentoring', 'Project-based', 6, 20, '2026-03-10', 'Active', 'Azure mentor'],
    ['Ishita Verma', 'ishita.verma@volunteer.org', '+919812340008', 'Microsoft', 'AI/ML, NLP', 'Workshop', 'Weekends', 7, 32, '2026-03-18', 'Active', 'AI/ML expert sessions'],
    ['Arjun Nair', 'arjun.nair@volunteer.org', '+919812340009', 'Cognizant', 'Mobile Dev, Flutter', 'Teaching', 'Weekdays', 8, 16, '2026-03-25', 'Active', 'Mobile app development trainer'],
    ['Sanvi Joshi', 'sanvi.joshi@volunteer.org', '+919812340010', 'Independent', 'Career Counseling', 'Outreach', 'Flexible', null, 10, '2026-04-02', 'Active', 'Placement preparation guidance'],
    ['Aditya Kapoor', 'aditya.kapoor@volunteer.org', '+919812340011', 'Cyient', 'CSR Program Management', 'CSR', 'Weekdays', 1, 22, '2026-04-08', 'Active', 'Cyient CSR coordinator'],
    ['Pooja Menon', 'pooja.menon@volunteer.org', '+919812340012', 'HCL', 'Event Management', 'Event Support', 'Project-based', 2, 8, '2026-04-15', 'On Break', 'Hackathon coordinator (on leave)'],
    ['Karthik Rao', 'karthik.rao@volunteer.org', '+919812340013', 'Independent', 'Cybersecurity', 'Workshop', 'Weekends', 3, 14, '2026-04-22', 'Active', 'Security awareness sessions'],
    ['Riya Bhat', 'riya.bhat@volunteer.org', '+919812340014', 'Capgemini', 'Database, SQL', 'Teaching', 'Weekdays', 4, 26, '2026-04-30', 'Active', 'DBMS module support'],
    ['Yash Agarwal', 'yash.agarwal@volunteer.org', '+919812340015', 'Independent', 'Entrepreneurship', 'Mentoring', 'Flexible', null, 6, '2026-05-05', 'Inactive', 'Recently transitioned out'],
  ];
  insertMany(
    'INSERT INTO volunteers (name,email,phone,organization,expertise,area_of_interest,availability,activity_id,hours_contributed,joined_date,status,notes) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)',
    volunteers
  );

  console.log(
    `[seed] Inserted: ${admins.length} admins, ${projects.length} projects, ` +
    `${courses.length} courses, ${modules.length} modules, ${chapters.length} chapters, ` +
    `${skills.length} skills, ${trainers.length} trainers, ${students.length} students, ` +
    `${studentSkillRows.length} student-skill rows, ${chapterAssignments.length} chapter assignments, ` +
    `${activities.length} activities, ${saRows.length} student-attendance rows, ` +
    `${taRows.length} trainer-attendance rows, ${volunteers.length} volunteers.`
  );
}

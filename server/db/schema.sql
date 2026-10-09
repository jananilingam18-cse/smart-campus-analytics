-- Campus IQ AI Master Multi-College Schema
-- Enforces strict multi-college isolation, role-based governance, and deterministic student telemetry.

PRAGMA foreign_keys = ON;

-- 1. Colleges / Institutions (Tenant boundary)
CREATE TABLE IF NOT EXISTS colleges (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    code TEXT UNIQUE NOT NULL,
    domain TEXT UNIQUE NOT NULL,
    state TEXT NOT NULL,
    city TEXT NOT NULL,
    attendance_threshold REAL NOT NULL DEFAULT 75.0,
    scoring_weights_json TEXT NOT NULL DEFAULT '{"attendance":0.25,"academic":0.40,"participation":0.15,"assignment":0.20}',
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- 2. Users and Authentication (Identities bound to a tenant college)
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    college_id TEXT NOT NULL REFERENCES colleges(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    salt TEXT NOT NULL,
    role TEXT NOT NULL CHECK(role IN ('student', 'faculty', 'admin', 'superadmin')),
    name TEXT NOT NULL,
    avatar_url TEXT,
    is_active INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    UNIQUE(college_id, email)
);

-- 3. Academic Departments
CREATE TABLE IF NOT EXISTS departments (
    id TEXT PRIMARY KEY,
    college_id TEXT NOT NULL REFERENCES colleges(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    code TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    UNIQUE(college_id, code)
);

-- 4. Degree Courses / Programs
CREATE TABLE IF NOT EXISTS courses (
    id TEXT PRIMARY KEY,
    college_id TEXT NOT NULL REFERENCES colleges(id) ON DELETE CASCADE,
    department_id TEXT NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    code TEXT NOT NULL,
    duration_years INTEGER NOT NULL DEFAULT 4,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    UNIQUE(college_id, code)
);

-- 5. Faculty Profiles
CREATE TABLE IF NOT EXISTS faculty_profiles (
    id TEXT PRIMARY KEY,
    user_id TEXT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    college_id TEXT NOT NULL REFERENCES colleges(id) ON DELETE CASCADE,
    department_id TEXT NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
    designation TEXT NOT NULL,
    cabin_location TEXT,
    phone TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- 6. Student Master Profiles
CREATE TABLE IF NOT EXISTS students (
    id TEXT PRIMARY KEY,
    user_id TEXT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    college_id TEXT NOT NULL REFERENCES colleges(id) ON DELETE CASCADE,
    department_id TEXT NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
    course_id TEXT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    roll_no TEXT NOT NULL,
    branch TEXT NOT NULL,
    current_year INTEGER NOT NULL DEFAULT 3,
    current_semester INTEGER NOT NULL DEFAULT 5,
    class_section TEXT NOT NULL DEFAULT 'A',
    mentor_faculty_id TEXT REFERENCES faculty_profiles(id),
    phone TEXT,
    has_insufficient_data INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    UNIQUE(college_id, roll_no)
);

-- 7. Subjects
CREATE TABLE IF NOT EXISTS subjects (
    id TEXT PRIMARY KEY,
    college_id TEXT NOT NULL REFERENCES colleges(id) ON DELETE CASCADE,
    department_id TEXT NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
    code TEXT NOT NULL,
    name TEXT NOT NULL,
    semester INTEGER NOT NULL,
    credits INTEGER NOT NULL DEFAULT 4,
    faculty_id TEXT REFERENCES faculty_profiles(id),
    UNIQUE(college_id, code, semester)
);

-- 8. Subject Attendance Records
CREATE TABLE IF NOT EXISTS subject_attendance (
    id TEXT PRIMARY KEY,
    college_id TEXT NOT NULL REFERENCES colleges(id) ON DELETE CASCADE,
    student_id TEXT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    subject_id TEXT NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    classes_attended INTEGER NOT NULL DEFAULT 0,
    total_classes_conducted INTEGER NOT NULL DEFAULT 0,
    attendance_percentage REAL NOT NULL DEFAULT 0.0,
    is_shortage INTEGER NOT NULL DEFAULT 0,
    consecutive_classes_needed INTEGER NOT NULL DEFAULT 0,
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    UNIQUE(student_id, subject_id)
);

-- 9. Coursework Assignments
CREATE TABLE IF NOT EXISTS assignments (
    id TEXT PRIMARY KEY,
    college_id TEXT NOT NULL REFERENCES colleges(id) ON DELETE CASCADE,
    subject_id TEXT NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    due_date TEXT NOT NULL,
    max_marks REAL NOT NULL DEFAULT 30.0,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- 10. Student Assignment Submissions
CREATE TABLE IF NOT EXISTS assignment_submissions (
    id TEXT PRIMARY KEY,
    college_id TEXT NOT NULL REFERENCES colleges(id) ON DELETE CASCADE,
    assignment_id TEXT NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
    student_id TEXT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    status TEXT NOT NULL CHECK(status IN ('Submitted', 'Pending', 'Overdue')),
    marks_obtained REAL,
    submission_date TEXT,
    completion_percentage REAL NOT NULL DEFAULT 0.0,
    feedback TEXT,
    UNIQUE(assignment_id, student_id)
);

-- 11. Academic Results (Semester-level SGPA/Credits)
CREATE TABLE IF NOT EXISTS academic_results (
    id TEXT PRIMARY KEY,
    college_id TEXT NOT NULL REFERENCES colleges(id) ON DELETE CASCADE,
    student_id TEXT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    semester INTEGER NOT NULL,
    sgpa REAL NOT NULL,
    credits_earned INTEGER NOT NULL,
    total_credits INTEGER NOT NULL,
    backlogs_count INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    UNIQUE(student_id, semester)
);

-- 12. Subject Grades (Per examination)
CREATE TABLE IF NOT EXISTS subject_grades (
    id TEXT PRIMARY KEY,
    college_id TEXT NOT NULL REFERENCES colleges(id) ON DELETE CASCADE,
    result_id TEXT NOT NULL REFERENCES academic_results(id) ON DELETE CASCADE,
    subject_id TEXT NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    grade TEXT NOT NULL,
    marks REAL NOT NULL,
    max_marks REAL NOT NULL DEFAULT 100.0,
    result_status TEXT NOT NULL CHECK(result_status IN ('Pass', 'Fail', 'Backlog'))
);

-- 13. Revaluation Records
CREATE TABLE IF NOT EXISTS revaluations (
    id TEXT PRIMARY KEY,
    college_id TEXT NOT NULL REFERENCES colleges(id) ON DELETE CASCADE,
    student_id TEXT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    subject_id TEXT NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    semester INTEGER NOT NULL,
    initial_grade TEXT NOT NULL,
    revised_grade TEXT,
    application_status TEXT NOT NULL CHECK(application_status IN ('Eligible', 'Applied', 'Under Review', 'Result Published')),
    deadline TEXT NOT NULL,
    fee_paid INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- 14. Event Participations & Co-Curricular Portfolios
CREATE TABLE IF NOT EXISTS event_participations (
    id TEXT PRIMARY KEY,
    college_id TEXT NOT NULL REFERENCES colleges(id) ON DELETE CASCADE,
    student_id TEXT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    category TEXT NOT NULL CHECK(category IN ('Technical', 'Non-Technical')),
    subcategory TEXT NOT NULL,
    date TEXT NOT NULL,
    status TEXT NOT NULL CHECK(status IN ('Winner', '1st Runner Up', 'Finalist', 'Participant', 'Organizer')),
    points_awarded REAL NOT NULL,
    certificate_url TEXT,
    certificate_name TEXT,
    verification_status TEXT NOT NULL CHECK(verification_status IN ('Verified', 'Pending Verification', 'Rejected')),
    description TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- 15. Placement Readiness Evaluations
CREATE TABLE IF NOT EXISTS placement_readiness (
    id TEXT PRIMARY KEY,
    college_id TEXT NOT NULL REFERENCES colleges(id) ON DELETE CASCADE,
    student_id TEXT UNIQUE NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    is_assessed INTEGER NOT NULL DEFAULT 0,
    overall_percentage REAL NOT NULL DEFAULT 0.0,
    coding_score REAL NOT NULL DEFAULT 0.0,
    aptitude_score REAL NOT NULL DEFAULT 0.0,
    mock_interview_score REAL NOT NULL DEFAULT 0.0,
    verified_projects_count INTEGER NOT NULL DEFAULT 0,
    readiness_tier TEXT NOT NULL CHECK(readiness_tier IN ('High', 'Moderate', 'Low', 'Needs Attention', 'Not Assessed')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- 16. Calculated Student Success Scores
CREATE TABLE IF NOT EXISTS success_scores (
    id TEXT PRIMARY KEY,
    college_id TEXT NOT NULL REFERENCES colleges(id) ON DELETE CASCADE,
    student_id TEXT UNIQUE NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    overall_score REAL NOT NULL,
    previous_score REAL NOT NULL,
    attendance_score REAL NOT NULL,
    academic_score REAL NOT NULL,
    participation_score REAL NOT NULL,
    assignment_score REAL NOT NULL,
    performance_grade TEXT NOT NULL CHECK(performance_grade IN ('Grade A', 'Grade B', 'Grade C', 'Grade D', 'Not Yet Rated')),
    progression_level INTEGER NOT NULL,
    level_name TEXT NOT NULL,
    points_to_next REAL NOT NULL,
    strongest_indicator TEXT NOT NULL,
    weakest_indicator TEXT NOT NULL,
    is_provisional INTEGER NOT NULL DEFAULT 0,
    provisional_reason TEXT,
    calculation_date TEXT NOT NULL,
    explainability_json TEXT NOT NULL,
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- 17. Student Badges & Achievements
CREATE TABLE IF NOT EXISTS student_badges (
    id TEXT PRIMARY KEY,
    college_id TEXT NOT NULL REFERENCES colleges(id) ON DELETE CASCADE,
    student_id TEXT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    badge_key TEXT NOT NULL,
    badge_name TEXT NOT NULL,
    category TEXT NOT NULL,
    is_earned INTEGER NOT NULL DEFAULT 0,
    earned_date TEXT,
    unlock_progress REAL NOT NULL DEFAULT 0.0,
    is_warning_locked INTEGER NOT NULL DEFAULT 0,
    warning_reason TEXT,
    UNIQUE(student_id, badge_key)
);

-- 18. Audit & Compliance Log
CREATE TABLE IF NOT EXISTS audit_logs (
    id TEXT PRIMARY KEY,
    college_id TEXT NOT NULL REFERENCES colleges(id) ON DELETE CASCADE,
    user_id TEXT REFERENCES users(id),
    action TEXT NOT NULL,
    resource_type TEXT NOT NULL,
    resource_id TEXT,
    details_json TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Performance and Tenant Isolation Indices
CREATE INDEX IF NOT EXISTS idx_users_college_role ON users(college_id, role);
CREATE INDEX IF NOT EXISTS idx_students_college_dept ON students(college_id, department_id);
CREATE INDEX IF NOT EXISTS idx_students_college_roll ON students(college_id, roll_no);
CREATE INDEX IF NOT EXISTS idx_attendance_college_student ON subject_attendance(college_id, student_id);
CREATE INDEX IF NOT EXISTS idx_attendance_shortage ON subject_attendance(college_id, is_shortage);
CREATE INDEX IF NOT EXISTS idx_assignments_college ON assignments(college_id, subject_id);
CREATE INDEX IF NOT EXISTS idx_submissions_student ON assignment_submissions(college_id, student_id);
CREATE INDEX IF NOT EXISTS idx_results_student ON academic_results(college_id, student_id);
CREATE INDEX IF NOT EXISTS idx_scores_college_grade ON success_scores(college_id, performance_grade);
CREATE INDEX IF NOT EXISTS idx_badges_student ON student_badges(college_id, student_id);
CREATE INDEX IF NOT EXISTS idx_events_student ON event_participations(college_id, student_id);

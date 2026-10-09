import { queryAll, queryOne, runQuery } from '../db/connection.js';
import { AuthContext } from '../auth/context.js';
import { assertCanAccessStudent } from '../policies/rbac.js';
import { assertCollegeIsolation } from '../policies/isolation.js';

export interface StudentProfile {
  id: string;
  user_id: string;
  college_id: string;
  department_id: string;
  course_id: string;
  roll_no: string;
  name: string;
  email: string;
  avatar_url?: string;
  branch: string;
  current_year: number;
  current_semester: number;
  class_section: string;
  mentor_faculty_id?: string;
  phone?: string;
  has_insufficient_data: number;
  department_name?: string;
  course_name?: string;
}

export function getStudentById(studentId: string, context: AuthContext): StudentProfile {
  const student = queryOne<StudentProfile>(`
    SELECT 
      s.*, 
      u.name, 
      u.email, 
      u.avatar_url,
      d.name as department_name,
      c.name as course_name
    FROM students s
    JOIN users u ON s.user_id = u.id
    JOIN departments d ON s.department_id = d.id
    JOIN courses c ON s.course_id = c.id
    WHERE s.id = ?
  `, [studentId]);

  if (!student) {
    throw new Error(`Student '${studentId}' not found`);
  }

  assertCanAccessStudent(context, student);
  return student;
}

export function getStudentByUserId(userId: string, context: AuthContext): StudentProfile {
  const student = queryOne<StudentProfile>(`
    SELECT 
      s.*, 
      u.name, 
      u.email, 
      u.avatar_url,
      d.name as department_name,
      c.name as course_name
    FROM students s
    JOIN users u ON s.user_id = u.id
    JOIN departments d ON s.department_id = d.id
    JOIN courses c ON s.course_id = c.id
    WHERE s.user_id = ?
  `, [userId]);

  if (!student) {
    throw new Error(`Student record for user '${userId}' not found`);
  }

  assertCanAccessStudent(context, student);
  return student;
}

export function getStudentAttendance(studentId: string, context: AuthContext) {
  const student = getStudentById(studentId, context);

  return queryAll(`
    SELECT 
      sa.*,
      sub.code as subject_code,
      sub.name as subject_name,
      sub.credits
    FROM subject_attendance sa
    JOIN subjects sub ON sa.subject_id = sub.id
    WHERE sa.student_id = ? AND sa.college_id = ?
    ORDER BY sub.code ASC
  `, [student.id, context.collegeId]);
}

export function getStudentAssignments(studentId: string, context: AuthContext) {
  const student = getStudentById(studentId, context);

  return queryAll(`
    SELECT 
      asub.*,
      a.title,
      a.description,
      a.due_date,
      a.max_marks,
      sub.code as subject_code,
      sub.name as subject_name
    FROM assignment_submissions asub
    JOIN assignments a ON asub.assignment_id = a.id
    JOIN subjects sub ON a.subject_id = sub.id
    WHERE asub.student_id = ? AND asub.college_id = ?
    ORDER BY a.due_date ASC
  `, [student.id, context.collegeId]);
}

export function getStudentResults(studentId: string, context: AuthContext) {
  const student = getStudentById(studentId, context);

  const semesters = queryAll(`
    SELECT * FROM academic_results
    WHERE student_id = ? AND college_id = ?
    ORDER BY semester ASC
  `, [student.id, context.collegeId]);

  return semesters.map(sem => {
    const grades = queryAll(`
      SELECT 
        sg.*,
        sub.code as subject_code,
        sub.name as subject_name,
        sub.credits
      FROM subject_grades sg
      JOIN subjects sub ON sg.subject_id = sub.id
      WHERE sg.result_id = ? AND sg.college_id = ?
    `, [sem.id, context.collegeId]);

    return {
      ...sem,
      subjects: grades
    };
  });
}

export function getStudentSuccessScore(studentId: string, context: AuthContext) {
  const student = getStudentById(studentId, context);

  return queryOne(`
    SELECT * FROM success_scores
    WHERE student_id = ? AND college_id = ?
  `, [student.id, context.collegeId]);
}

export function getStudentBadges(studentId: string, context: AuthContext) {
  const student = getStudentById(studentId, context);

  return queryAll(`
    SELECT * FROM student_badges
    WHERE student_id = ? AND college_id = ?
    ORDER BY is_earned DESC, badge_name ASC
  `, [student.id, context.collegeId]);
}

export function getStudentEvents(studentId: string, context: AuthContext) {
  const student = getStudentById(studentId, context);

  return queryAll(`
    SELECT * FROM event_participations
    WHERE student_id = ? AND college_id = ?
    ORDER BY date DESC
  `, [student.id, context.collegeId]);
}

export function getStudentPlacementReadiness(studentId: string, context: AuthContext) {
  const student = getStudentById(studentId, context);

  return queryOne(`
    SELECT * FROM placement_readiness
    WHERE student_id = ? AND college_id = ?
  `, [student.id, context.collegeId]);
}

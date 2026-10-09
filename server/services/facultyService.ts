import { queryAll, queryOne } from '../db/connection.js';
import { AuthContext } from '../auth/context.js';
import { assertRole } from '../policies/rbac.js';
import { assertCollegeIsolation } from '../policies/isolation.js';

export function getFacultyByUserId(userId: string, context: AuthContext) {
  assertRole(context, ['faculty', 'admin', 'superadmin']);

  const faculty = queryOne(`
    SELECT fp.*, u.name, u.email, d.name as department_name
    FROM faculty_profiles fp
    JOIN users u ON fp.user_id = u.id
    JOIN departments d ON fp.department_id = d.id
    WHERE fp.user_id = ?
  `, [userId]);

  if (!faculty) {
    throw new Error(`Faculty profile for user '${userId}' not found`);
  }

  assertCollegeIsolation(context, faculty.college_id, 'Faculty Profile');
  return faculty;
}

export function getDepartmentStudents(departmentId: string, context: AuthContext) {
  assertRole(context, ['faculty', 'admin', 'superadmin']);

  const dept = queryOne(`SELECT college_id FROM departments WHERE id = ?`, [departmentId]);
  if (!dept) {
    throw new Error(`Department '${departmentId}' not found`);
  }
  assertCollegeIsolation(context, dept.college_id, 'Department Roster');

  return queryAll(`
    SELECT 
      s.id,
      s.roll_no,
      s.branch,
      s.current_year,
      s.current_semester,
      s.class_section,
      u.name,
      u.email,
      ss.overall_score,
      ss.performance_grade
    FROM students s
    JOIN users u ON s.user_id = u.id
    LEFT JOIN success_scores ss ON s.id = ss.student_id
    WHERE s.department_id = ? AND s.college_id = ?
    ORDER BY s.roll_no ASC
  `, [departmentId, context.collegeId]);
}

export function getSubjectAttendanceRoster(subjectId: string, context: AuthContext) {
  assertRole(context, ['faculty', 'admin', 'superadmin']);

  const sub = queryOne(`SELECT college_id, code, name FROM subjects WHERE id = ?`, [subjectId]);
  if (!sub) {
    throw new Error(`Subject '${subjectId}' not found`);
  }
  assertCollegeIsolation(context, sub.college_id, 'Subject Roster');

  return queryAll(`
    SELECT 
      sa.*,
      s.roll_no,
      u.name as student_name
    FROM subject_attendance sa
    JOIN students s ON sa.student_id = s.id
    JOIN users u ON s.user_id = u.id
    WHERE sa.subject_id = ? AND sa.college_id = ?
    ORDER BY sa.is_shortage DESC, s.roll_no ASC
  `, [subjectId, context.collegeId]);
}

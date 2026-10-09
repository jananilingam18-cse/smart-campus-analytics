import { queryAll, queryOne, runQuery } from '../db/connection.js';
import { AuthContext } from '../auth/context.js';
import { assertRole } from '../policies/rbac.js';
import { assertCollegeIsolation } from '../policies/isolation.js';

export function getInstitutionalMetrics(collegeId: string, context: AuthContext) {
  assertCollegeIsolation(context, collegeId, 'Institutional Metrics');
  assertRole(context, ['admin', 'superadmin']);

  const totalStudents = queryOne<{ count: number }>(`
    SELECT COUNT(*) as count FROM students WHERE college_id = ?
  `, [collegeId])?.count || 0;

  const scoreStats = queryOne<{ avg_score: number; scored_count: number }>(`
    SELECT 
      AVG(overall_score) as avg_score,
      COUNT(*) as scored_count
    FROM success_scores 
    WHERE college_id = ? AND performance_grade != 'Not Yet Rated'
  `, [collegeId]);

  const atRiskStudents = queryOne<{ count: number }>(`
    SELECT COUNT(DISTINCT s.id) as count
    FROM students s
    LEFT JOIN success_scores ss ON s.id = ss.student_id
    LEFT JOIN subject_attendance sa ON s.id = sa.student_id
    WHERE s.college_id = ? 
      AND (
        (ss.overall_score < 50 AND s.has_insufficient_data = 0)
        OR sa.is_shortage = 1
      )
  `, [collegeId])?.count || 0;

  const shortageStudents = queryOne<{ count: number }>(`
    SELECT COUNT(DISTINCT student_id) as count
    FROM subject_attendance
    WHERE college_id = ? AND is_shortage = 1
  `, [collegeId])?.count || 0;

  const assignmentStats = queryOne<{ avg_completion: number }>(`
    SELECT AVG(completion_percentage) as avg_completion
    FROM assignment_submissions
    WHERE college_id = ?
  `, [collegeId]);

  const grades = queryAll<{ performance_grade: string; count: number }>(`
    SELECT performance_grade, COUNT(*) as count
    FROM success_scores
    WHERE college_id = ?
    GROUP BY performance_grade
  `, [collegeId]);

  const gradeMap: Record<string, number> = {
    'Grade A': 0,
    'Grade B': 0,
    'Grade C': 0,
    'Grade D': 0,
    'Not Yet Rated': 0
  };
  grades.forEach(g => {
    gradeMap[g.performance_grade] = g.count;
  });

  return {
    collegeId,
    totalStudents,
    averageSuccessScore: scoreStats?.avg_score ? Number(scoreStats.avg_score.toFixed(1)) : 0,
    atRiskStudentsCount: atRiskStudents,
    attendanceShortageStudentsCount: shortageStudents,
    assignmentCompletionAvg: assignmentStats?.avg_completion ? Number(assignmentStats.avg_completion.toFixed(1)) : 0,
    segmentDistribution: gradeMap
  };
}

export function getAtRiskCohort(collegeId: string, context: AuthContext) {
  assertCollegeIsolation(context, collegeId, 'At-Risk Cohort');
  assertRole(context, ['admin', 'superadmin']);

  return queryAll(`
    SELECT DISTINCT
      s.id,
      s.roll_no,
      s.branch,
      s.class_section,
      u.name,
      u.email,
      ss.overall_score,
      ss.performance_grade,
      (SELECT COUNT(*) FROM subject_attendance sa WHERE sa.student_id = s.id AND sa.is_shortage = 1) as shortage_subjects_count
    FROM students s
    JOIN users u ON s.user_id = u.id
    LEFT JOIN success_scores ss ON s.id = ss.student_id
    LEFT JOIN subject_attendance sa ON s.id = sa.student_id
    WHERE s.college_id = ? 
      AND (
        (ss.overall_score < 50 AND s.has_insufficient_data = 0)
        OR sa.is_shortage = 1
      )
    ORDER BY ss.overall_score ASC, s.roll_no ASC
  `, [collegeId]);
}

export function recordAuditLog(
  collegeId: string,
  userId: string | null,
  action: string,
  resourceType: string,
  resourceId: string | null,
  details: Record<string, any>
): void {
  const id = `audit_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  runQuery(`
    INSERT INTO audit_logs (id, college_id, user_id, action, resource_type, resource_id, details_json, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))
  `, [id, collegeId, userId, action, resourceType, resourceId, JSON.stringify(details)]);
}

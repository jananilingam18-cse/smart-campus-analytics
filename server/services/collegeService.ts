import { queryAll, queryOne, runQuery } from '../db/connection.js';
import { AuthContext } from '../auth/context.js';
import { assertCollegeIsolation } from '../policies/isolation.js';
import { assertRole, assertCanModifyScoringWeights } from '../policies/rbac.js';

export interface CollegeRecord {
  id: string;
  name: string;
  code: string;
  domain: string;
  state: string;
  city: string;
  attendance_threshold: number;
  scoring_weights_json: string;
  created_at: string;
  updated_at: string;
}

export function listColleges(): CollegeRecord[] {
  return queryAll<CollegeRecord>(`SELECT * FROM colleges ORDER BY name ASC`);
}

export function getCollegeById(collegeId: string, context?: AuthContext): CollegeRecord | null {
  if (context) {
    assertCollegeIsolation(context, collegeId, 'College Metadata');
  }
  return queryOne<CollegeRecord>(`SELECT * FROM colleges WHERE id = ?`, [collegeId]);
}

export function updateCollegeScoringWeights(
  collegeId: string,
  weights: { attendance: number; academic: number; participation: number; assignment: number },
  context: AuthContext
): CollegeRecord {
  assertCanModifyScoringWeights(context, collegeId);

  const sum = weights.attendance + weights.academic + weights.participation + weights.assignment;
  if (Math.abs(sum - 1.0) > 0.001) {
    throw new Error(`Invalid scoring weights: Total sum must equal 1.0 (received ${sum.toFixed(3)})`);
  }

  const weightsJson = JSON.stringify(weights);
  runQuery(
    `UPDATE colleges SET scoring_weights_json = ?, updated_at = datetime('now') WHERE id = ?`,
    [weightsJson, collegeId]
  );

  return queryOne<CollegeRecord>(`SELECT * FROM colleges WHERE id = ?`, [collegeId])!;
}

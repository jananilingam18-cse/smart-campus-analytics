import { AuthContext } from '../auth/context.js';

export class TenantIsolationViolationError extends Error {
  statusCode: number;
  userCollegeId: string;
  targetCollegeId: string;

  constructor(userCollegeId: string, targetCollegeId: string, message?: string) {
    super(
      message || 
      `Multi-College Isolation Policy Enforced: User from college '${userCollegeId}' is forbidden from accessing data belonging to college '${targetCollegeId}'.`
    );
    this.name = 'TenantIsolationViolationError';
    this.statusCode = 403;
    this.userCollegeId = userCollegeId;
    this.targetCollegeId = targetCollegeId;
  }
}

export function assertCollegeIsolation(
  context: AuthContext, 
  targetCollegeId: string, 
  resourceName = 'Resource'
): void {
  // Superadmins with explicit system scope can cross-audit; normal users are strictly bound to their college
  if (context.role === 'superadmin') {
    return;
  }

  if (context.collegeId !== targetCollegeId) {
    throw new TenantIsolationViolationError(
      context.collegeId,
      targetCollegeId,
      `Cross-College Access Blocked: ${resourceName} belongs to college '${targetCollegeId}', but current caller is authenticated under college '${context.collegeId}'.`
    );
  }
}

export function enforceTenantFilter<T extends { college_id: string }>(
  context: AuthContext,
  record: T | null | undefined,
  resourceName = 'Record'
): T {
  if (!record) {
    throw new Error(`${resourceName} not found`);
  }
  assertCollegeIsolation(context, record.college_id, resourceName);
  return record;
}

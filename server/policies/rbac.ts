import { AuthContext, UserRole } from '../auth/context.js';
import { assertCollegeIsolation } from './isolation.js';

export class AuthorizationError extends Error {
  statusCode: number;
  requiredRoles: UserRole[];
  userRole: UserRole;

  constructor(userRole: UserRole, requiredRoles: UserRole[], message?: string) {
    super(
      message || 
      `Access Denied: Role '${userRole}' lacks required permissions. Required role(s): ${requiredRoles.join(', ')}.`
    );
    this.name = 'AuthorizationError';
    this.statusCode = 403;
    this.userRole = userRole;
    this.requiredRoles = requiredRoles;
  }
}

export function assertRole(context: AuthContext, allowedRoles: UserRole[]): void {
  if (context.role === 'superadmin') {
    return;
  }
  if (!allowedRoles.includes(context.role)) {
    throw new AuthorizationError(context.role, allowedRoles);
  }
}

export function assertCanAccessStudent(
  context: AuthContext,
  student: { id: string; user_id: string; college_id: string; department_id: string }
): void {
  // 1. First, strict multi-college tenant isolation
  assertCollegeIsolation(context, student.college_id, 'Student Record');

  // 2. Role-specific constraints
  if (context.role === 'admin' || context.role === 'superadmin') {
    // Admin has college-wide student read access
    return;
  }

  if (context.role === 'faculty') {
    // Faculty can view students in their college
    return;
  }

  if (context.role === 'student') {
    // Student can ONLY access their own private record
    if (context.userId !== student.user_id) {
      throw new AuthorizationError(
        context.role,
        ['admin', 'faculty'],
        `Student Privacy Violation: Student cannot access private records of another student.`
      );
    }
    return;
  }

  throw new AuthorizationError(context.role, ['student', 'faculty', 'admin']);
}

export function assertCanModifyScoringWeights(context: AuthContext, collegeId: string): void {
  assertCollegeIsolation(context, collegeId, 'College Scoring Configuration');
  assertRole(context, ['admin', 'superadmin']);
}

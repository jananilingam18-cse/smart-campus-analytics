import { AuthPayload } from './tokens.js';

export type UserRole = 'student' | 'faculty' | 'admin' | 'superadmin';

export interface AuthContext {
  userId: string;
  collegeId: string;
  role: UserRole;
  email: string;
  name: string;
}

export function fromPayload(payload: AuthPayload): AuthContext {
  return {
    userId: payload.userId,
    collegeId: payload.collegeId,
    role: payload.role,
    email: payload.email,
    name: payload.name
  };
}

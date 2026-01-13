import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import { db } from './db';

export type UserRole = 'candidate' | 'manager' | 'recruiter';

export interface User {
  id: number;
  email: string;
  name: string;
  role: UserRole;
  department: string | null;
  job_title: string | null;
  manager_id: number | null;
}

export interface JWTPayload {
  userId: number;
  email: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';

/**
 * Generate JWT token for user
 */
export function generateToken(user: User): string {
  const payload: JWTPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };

  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

/**
 * Verify and decode JWT token
 */
export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch (error) {
    return null;
  }
}

/**
 * Get user from request (from cookie or Authorization header)
 */
export function getUserFromRequest(request: NextRequest): User | null {
  try {
    // Try to get token from cookie
    let token = request.cookies.get('auth-token')?.value;

    // Fallback to Authorization header
    if (!token) {
      const authHeader = request.headers.get('authorization');
      if (authHeader?.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }

    if (!token) {
      return null;
    }

    const payload = verifyToken(token);
    if (!payload) {
      return null;
    }

    // Get user from database
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(payload.userId) as User;
    return user || null;
  } catch (error) {
    console.error('Error getting user from request:', error);
    return null;
  }
}

/**
 * Check if user has required role
 */
export function hasRole(user: User | null, roles: UserRole[]): boolean {
  if (!user) return false;
  return roles.includes(user.role);
}

/**
 * Check if user is manager of another user
 */
export function isManagerOf(managerId: number, employeeId: number): boolean {
  const employee = db.prepare('SELECT manager_id FROM users WHERE id = ?').get(employeeId) as { manager_id: number | null };
  return employee?.manager_id === managerId;
}

/**
 * Get all team members for a manager
 */
export function getTeamMembers(managerId: number): User[] {
  return db.prepare('SELECT * FROM users WHERE manager_id = ?').all(managerId) as User[];
}

/**
 * SSO Authentication (Simulated)
 * In production, integrate with your actual SSO provider (SAML, OAuth2, OIDC)
 */
export interface SSOAuthResult {
  success: boolean;
  user?: User;
  token?: string;
  error?: string;
}

export function authenticateSSO(email: string, ssoId?: string): SSOAuthResult {
  try {
    // In production, validate SSO token/assertion here
    // For demo, we'll look up user by email
    let user = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as User | undefined;

    if (!user) {
      // Auto-provision user from SSO (if enabled)
      // For demo, return error
      return {
        success: false,
        error: 'User not found. Please contact HR to set up your account.',
      };
    }

    // Update SSO ID if provided
    if (ssoId) {
      db.prepare('UPDATE users SET sso_id = ? WHERE id = ?').run(ssoId, user.id);
    }

    const token = generateToken(user);

    return {
      success: true,
      user,
      token,
    };
  } catch (error) {
    console.error('SSO authentication error:', error);
    return {
      success: false,
      error: 'Authentication failed',
    };
  }
}

/**
 * Create notification for user
 */
export function createNotification(
  userId: number,
  type: string,
  title: string,
  message: string,
  link?: string
) {
  db.prepare(`
    INSERT INTO notifications (user_id, type, title, message, link)
    VALUES (?, ?, ?, ?, ?)
  `).run(userId, type, title, message, link || null);
}

/**
 * Check permission for specific resource
 */
export interface PermissionCheck {
  allowed: boolean;
  reason?: string;
}

export function canViewJob(user: User | null, jobId: number): PermissionCheck {
  if (!user) return { allowed: false, reason: 'Not authenticated' };

  // Recruiters can view all jobs
  if (user.role === 'recruiter') return { allowed: true };

  // Managers and candidates can view open jobs
  const job = db.prepare('SELECT status, is_internal_only FROM jobs WHERE id = ?').get(jobId) as { status: string; is_internal_only: number } | undefined;

  if (!job) return { allowed: false, reason: 'Job not found' };
  if (job.status !== 'open') return { allowed: false, reason: 'Job is not open' };
  if (job.is_internal_only === 0 && user.role === 'candidate') return { allowed: false, reason: 'External job postings not accessible' };

  return { allowed: true };
}

export function canApplyToJob(user: User | null, jobId: number): PermissionCheck {
  if (!user) return { allowed: false, reason: 'Not authenticated' };
  if (user.role !== 'candidate') return { allowed: false, reason: 'Only candidates can apply' };

  const viewCheck = canViewJob(user, jobId);
  if (!viewCheck.allowed) return viewCheck;

  // Check if already applied
  const existing = db.prepare('SELECT id FROM applications WHERE job_id = ? AND candidate_id = ?').get(jobId, user.id);
  if (existing) return { allowed: false, reason: 'Already applied to this job' };

  return { allowed: true };
}

export function canViewApplication(user: User | null, applicationId: number): PermissionCheck {
  if (!user) return { allowed: false, reason: 'Not authenticated' };

  const application = db.prepare(`
    SELECT a.*, u.manager_id
    FROM applications a
    JOIN users u ON a.candidate_id = u.id
    WHERE a.id = ?
  `).get(applicationId) as { candidate_id: number; manager_id: number | null } | undefined;

  if (!application) return { allowed: false, reason: 'Application not found' };

  // Candidate can view their own application
  if (user.id === application.candidate_id) return { allowed: true };

  // Recruiter can view all applications
  if (user.role === 'recruiter') return { allowed: true };

  // Manager can view their team members' applications
  if (user.role === 'manager' && application.manager_id === user.id) return { allowed: true };

  return { allowed: false, reason: 'Not authorized' };
}

import { NextRequest, NextResponse } from 'next/server';
import { authenticateSSO } from '@/lib/auth';
import { getSuccessFactorsIntegration } from '@/lib/integrations/successfactors';
import { db } from '@/lib/db';
import { ensureDbInitialized } from '@/lib/init-db';

// Initialize database on first API call
ensureDbInitialized();

export async function POST(request: NextRequest) {
  try {
    const { email, ssoToken } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Try SuccessFactors integration first
    const sfIntegration = getSuccessFactorsIntegration();
    if (sfIntegration && ssoToken) {
      try {
        // Fetch user from SuccessFactors
        const sfUser = await sfIntegration.getUserByEmail(email);

        if (sfUser) {
          // Get permissions
          const permissions = await sfIntegration.fetchPermissions(sfUser.userId);

          // Determine role
          let role: 'candidate' | 'manager' | 'recruiter' = 'candidate';
          if (permissions.isRecruiter) {
            role = 'recruiter';
          } else if (permissions.isManager) {
            role = 'manager';
          }

          // Upsert user in local database
          const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email) as { id: number } | undefined;

          if (existing) {
            db.prepare(`
              UPDATE users
              SET name = ?, role = ?, department = ?, job_title = ?, sso_id = ?, updated_at = CURRENT_TIMESTAMP
              WHERE id = ?
            `).run(`${sfUser.firstName} ${sfUser.lastName}`, role, sfUser.department, sfUser.jobTitle, sfUser.userId, existing.id);
          } else {
            db.prepare(`
              INSERT INTO users (email, name, role, department, job_title, sso_id)
              VALUES (?, ?, ?, ?, ?, ?)
            `).run(email, `${sfUser.firstName} ${sfUser.lastName}`, role, sfUser.department, sfUser.jobTitle, sfUser.userId);
          }
        }
      } catch (error) {
        console.error('SuccessFactors authentication failed, falling back to local:', error);
      }
    }

    // Authenticate using local database
    const authResult = authenticateSSO(email, ssoToken);

    if (!authResult.success) {
      return NextResponse.json({ error: authResult.error }, { status: 401 });
    }

    // Set cookie and return user data
    const response = NextResponse.json({
      user: authResult.user,
      message: 'Login successful',
    });

    response.cookies.set('auth-token', authResult.token!, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}

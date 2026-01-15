import { NextRequest, NextResponse } from 'next/server';
import { authenticateSSO, generateToken } from '@/lib/auth';
import { getSuccessFactorsIntegration } from '@/lib/integrations/successfactors';
import { db } from '@/lib/db';
import { ensureDbInitialized } from '@/lib/init-db';
import { isDemoMode, getDemoUserByEmail } from '@/lib/demo-data';

// Initialize database on first API call (skip in demo mode)
if (!isDemoMode()) {
  ensureDbInitialized();
}

export async function POST(request: NextRequest) {
  try {
    // Log environment variables for debugging
    console.log('[LOGIN] Environment check - POSTGRES_URL:', !!process.env.POSTGRES_URL, 'DATABASE_PATH:', !!process.env.DATABASE_PATH, 'NODE_ENV:', process.env.NODE_ENV);
    
    const { email, ssoToken } = await request.json();
    console.log('[LOGIN] Login attempt for email:', email);

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // DEMO MODE: Skip database, use demo data
    const demoModeActive = isDemoMode();
    console.log('[LOGIN] Demo mode active:', demoModeActive);
    
    if (demoModeActive) {
      const demoUser = getDemoUserByEmail(email);
      console.log('[LOGIN] Demo user lookup for', email, ':', !!demoUser);

      if (!demoUser) {
        console.log('[LOGIN] Demo user not found, returning 401');
        return NextResponse.json({ 
          error: 'Demo user not found. Try: john.smith@company.com, manager@company.com, or admin@company.com',
          demoMode: true 
        }, { status: 401 });
      }

      console.log('[LOGIN] Creating token for demo user:', demoUser.email);
      // Create session token
      const token = generateToken({
        id: demoUser.id,
        email: demoUser.email,
        name: demoUser.name,
        role: demoUser.role as any,
        department: demoUser.department,
        job_title: demoUser.title,
        manager_id: null
      });

      console.log('[LOGIN] Token generated, length:', token.length);

      const response = NextResponse.json({
        success: true,
        user: demoUser,
        token
      });

      response.cookies.set('auth-token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7 // 7 days
      });

      console.log('[LOGIN] Demo login successful for:', demoUser.email);
      return response;
    }

    console.log('[LOGIN] Demo mode NOT active, proceeding with database authentication');
    
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

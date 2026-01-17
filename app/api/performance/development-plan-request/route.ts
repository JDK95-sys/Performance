import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { isDemoMode } from '@/lib/demo-data';

/**
 * POST /api/performance/development-plan-request
 * Request a development plan from the manager
 */
export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value || request.headers.get('authorization')?.split(' ')[1];

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const body = await request.json();
    const { message } = body;

    // In demo mode or production, we would send a notification to the manager
    // For now, we'll just log and return success
    console.log('Development plan request received:', {
      userId: decoded.userId,
      email: decoded.email,
      message: message || 'No message provided'
    });

    // In a real implementation, this would:
    // 1. Create a notification for the manager
    // 2. Send an email to the manager
    // 3. Create a record of the request

    return NextResponse.json({
      success: true,
      message: 'Development plan request sent successfully',
      data: {
        requestedBy: decoded.userId,
        requestedAt: new Date().toISOString(),
        status: 'pending'
      }
    });
  } catch (error: any) {
    console.error('Error sending development plan request:', error);
    return NextResponse.json(
      { error: 'Failed to send development plan request', message: error.message },
      { status: 500 }
    );
  }
}

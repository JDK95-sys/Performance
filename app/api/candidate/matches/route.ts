import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import JobMatchingEngine from '@/lib/matching';

/**
 * GET /api/candidate/matches - Get AI-powered job matches for candidate
 */
export async function GET(request: NextRequest) {
  const user = getUserFromRequest(request);

  if (!user || user.role !== 'candidate') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const limit = parseInt(request.nextUrl.searchParams.get('limit') || '10');

    const matches = JobMatchingEngine.findJobMatchesForCandidate(user.id, limit);

    return NextResponse.json({ matches });
  } catch (error) {
    console.error('Error finding matches:', error);
    return NextResponse.json({ error: 'Failed to find matches' }, { status: 500 });
  }
}

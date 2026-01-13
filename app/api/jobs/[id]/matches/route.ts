import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import JobMatchingEngine from '@/lib/matching';

/**
 * GET /api/jobs/:id/matches - Get best candidate matches for a job (Recruiter only)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = getUserFromRequest(request);

  if (!user || user.role !== 'recruiter') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const jobId = parseInt(params.id);
    const limit = parseInt(request.nextUrl.searchParams.get('limit') || '20');

    const matches = JobMatchingEngine.findCandidateMatchesForJob(jobId, limit);

    return NextResponse.json({ matches });
  } catch (error) {
    console.error('Error finding matches:', error);
    return NextResponse.json({ error: 'Failed to find matches' }, { status: 500 });
  }
}

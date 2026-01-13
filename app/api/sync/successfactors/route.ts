import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import { getSuccessFactorsIntegration } from '@/lib/integrations/successfactors';

/**
 * Sync employee data from SAP SuccessFactors
 * Only accessible by recruiters/admins
 */
export async function POST(request: NextRequest) {
  const user = getUserFromRequest(request);

  if (!user || user.role !== 'recruiter') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const sfIntegration = getSuccessFactorsIntegration();

    if (!sfIntegration) {
      return NextResponse.json(
        { error: 'SuccessFactors integration not configured' },
        { status: 400 }
      );
    }

    const result = await sfIntegration.syncEmployees();

    return NextResponse.json({
      message: 'Sync completed successfully',
      synced: result.synced,
      errors: result.errors,
    });
  } catch (error) {
    console.error('Sync error:', error);
    return NextResponse.json(
      { error: 'Sync failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const user = getUserFromRequest(request);

  if (!user || user.role !== 'recruiter') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  return NextResponse.json({
    configured: !!getSuccessFactorsIntegration(),
    lastSync: null, // TODO: Track last sync time in database
  });
}

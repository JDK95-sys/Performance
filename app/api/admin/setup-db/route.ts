import { NextRequest, NextResponse } from 'next/server';
import { initializeVercelDatabase, seedVercelDatabase } from '@/lib/db-vercel';

/**
 * POST /api/admin/setup-db
 * Initialize Vercel Postgres database
 * This should be called once after deploying to Vercel
 */
export async function POST(request: NextRequest) {
  // Simple authentication check - only allow in development or with admin key
  const authHeader = request.headers.get('authorization');
  const adminKey = process.env.ADMIN_SETUP_KEY || 'setup-key-change-me';

  if (authHeader !== `Bearer ${adminKey}` && process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Check if Vercel Postgres is configured
    if (!process.env.POSTGRES_URL) {
      return NextResponse.json({
        error: 'Vercel Postgres not configured',
        message: 'Please add a Postgres database in your Vercel project settings',
        docs: 'https://vercel.com/docs/storage/vercel-postgres'
      }, { status: 400 });
    }

    // Initialize schema
    const initResult = await initializeVercelDatabase();

    // Seed data (optional, based on query param)
    const { searchParams } = new URL(request.url);
    const shouldSeed = searchParams.get('seed') === 'true';

    let seedResult = null;
    if (shouldSeed) {
      seedResult = await seedVercelDatabase();
    }

    return NextResponse.json({
      success: true,
      message: 'Database setup completed successfully',
      initialized: initResult,
      seeded: seedResult
    });
  } catch (error: any) {
    console.error('Database setup error:', error);
    return NextResponse.json({
      error: 'Database setup failed',
      message: error.message,
      details: error.stack
    }, { status: 500 });
  }
}

/**
 * GET /api/admin/setup-db
 * Check database setup status
 */
export async function GET() {
  return NextResponse.json({
    configured: !!process.env.POSTGRES_URL,
    environment: process.env.NODE_ENV,
    instructions: {
      '1': 'Add Vercel Postgres to your project in Vercel dashboard',
      '2': 'Deploy your application',
      '3': 'Call POST /api/admin/setup-db?seed=true with Authorization header',
      '4': 'Use "Bearer setup-key-change-me" or set ADMIN_SETUP_KEY env variable'
    }
  });
}

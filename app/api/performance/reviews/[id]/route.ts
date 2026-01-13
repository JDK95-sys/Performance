import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest, canViewPerformanceReview, canEditPerformanceReview } from '@/lib/auth';
import { db } from '@/lib/db';

/**
 * GET /api/performance/reviews/[id]
 * Get a specific performance review
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = getUserFromRequest(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const reviewId = parseInt(params.id);

  // Check permission
  const permission = canViewPerformanceReview(user, reviewId);
  if (!permission.allowed) {
    return NextResponse.json({ error: permission.reason }, { status: 403 });
  }

  try {
    const review = db.prepare(`
      SELECT
        pr.*,
        u.name as employee_name,
        u.email as employee_email,
        u.department,
        u.job_title,
        m.name as manager_name,
        rc.name as cycle_name,
        rc.cycle_type
      FROM pm_reviews pr
      JOIN users u ON pr.employee_id = u.id
      JOIN users m ON pr.manager_id = m.id
      JOIN review_cycles rc ON pr.cycle_id = rc.id
      WHERE pr.id = ?
    `).get(reviewId);

    if (!review) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    }

    // Get competency assessments
    const competencies = db.prepare(`
      SELECT ca.*, c.name, c.category, c.description
      FROM competency_assessments ca
      JOIN competencies c ON ca.competency_id = c.id
      WHERE ca.review_id = ?
    `).all(reviewId);

    return NextResponse.json({ review, competencies });
  } catch (error) {
    console.error('Error fetching review:', error);
    return NextResponse.json({ error: 'Failed to fetch review' }, { status: 500 });
  }
}

/**
 * PATCH /api/performance/reviews/[id]
 * Update a performance review
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = getUserFromRequest(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const reviewId = parseInt(params.id);

  try {
    const body = await request.json();
    const { review_type, ...updates } = body;

    // Get current review to check type
    const currentReview = db.prepare('SELECT review_type FROM pm_reviews WHERE id = ?').get(reviewId) as any;
    if (!currentReview) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    }

    // Check permission
    const permission = canEditPerformanceReview(user, reviewId, currentReview.review_type);
    if (!permission.allowed) {
      return NextResponse.json({ error: permission.reason }, { status: 403 });
    }

    // Build update query
    const allowedFields = [
      'status', 'overall_rating', 'potential_rating', 'achievements',
      'strengths', 'areas_for_improvement', 'development_priorities',
      'manager_comments', 'employee_comments', 'career_aspirations',
      'recommended_next_role', 'promotion_readiness', 'flight_risk',
      'flight_risk_factors', 'retention_actions', 'pre_calibration_rating',
      'post_calibration_rating', 'calibration_notes'
    ];

    const updateFields = Object.keys(updates).filter(key => allowedFields.includes(key));

    if (updateFields.length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
    }

    const setClause = updateFields.map(field => `${field} = ?`).join(', ');
    const values = updateFields.map(field => updates[field]);

    // Add timestamp for submission
    if (updates.status === 'submitted') {
      if (currentReview.review_type === 'self') {
        setClause.concat(', self_submitted_at = datetime("now")');
      } else if (currentReview.review_type === 'manager') {
        setClause.concat(', manager_submitted_at = datetime("now")');
      }
    }

    const query = `
      UPDATE pm_reviews
      SET ${setClause}, updated_at = datetime('now')
      WHERE id = ?
    `;

    db.prepare(query).run(...values, reviewId);

    // Get updated review
    const updated = db.prepare('SELECT * FROM pm_reviews WHERE id = ?').get(reviewId);

    return NextResponse.json({ review: updated });
  } catch (error) {
    console.error('Error updating review:', error);
    return NextResponse.json({ error: 'Failed to update review' }, { status: 500 });
  }
}

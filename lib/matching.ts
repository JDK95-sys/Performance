import { db } from './db';

export interface MatchScore {
  jobId: number;
  candidateId: number;
  overallScore: number;
  skillsScore: number;
  experienceScore: number;
  departmentScore: number;
  potentialScore: number;
  matchingSkills: Array<{ name: string; userLevel: number; requiredLevel: number }>;
  missingSkills: Array<{ name: string; requiredLevel: number }>;
  recommendations: string[];
}

export interface JobMatch {
  job: any;
  matchScore: MatchScore;
}

/**
 * AI-Powered Job Matching Algorithm
 * Inspired by Eightfold.ai's talent intelligence matching
 */
export class JobMatchingEngine {
  /**
   * Calculate match score between candidate and job
   */
  static calculateMatchScore(candidateId: number, jobId: number): MatchScore {
    // Get candidate skills
    const candidateSkills = db.prepare(`
      SELECT s.id, s.name, us.proficiency_level, us.years_experience
      FROM user_skills us
      JOIN skills s ON us.skill_id = s.id
      WHERE us.user_id = ?
    `).all(candidateId) as Array<{
      id: number;
      name: string;
      proficiency_level: number;
      years_experience: number;
    }>;

    // Get job required skills
    const jobSkills = db.prepare(`
      SELECT s.id, s.name, js.required_level, js.is_required
      FROM job_skills js
      JOIN skills s ON js.skill_id = s.id
      WHERE js.job_id = ?
    `).all(jobId) as Array<{
      id: number;
      name: string;
      required_level: number;
      is_required: number;
    }>;

    // Get candidate info
    const candidate = db.prepare(`
      SELECT years_experience, department, job_title
      FROM users
      WHERE id = ?
    `).get(candidateId) as {
      years_experience: number;
      department: string;
      job_title: string;
    };

    // Get job info
    const job = db.prepare(`
      SELECT department, title, requirements
      FROM jobs
      WHERE id = ?
    `).get(jobId) as {
      department: string;
      title: string;
      requirements: string;
    };

    // Calculate skills match
    const matchingSkills: Array<{ name: string; userLevel: number; requiredLevel: number }> = [];
    const missingSkills: Array<{ name: string; requiredLevel: number }> = [];
    let skillsMatchPoints = 0;
    let totalRequiredPoints = 0;

    const candidateSkillMap = new Map(candidateSkills.map(s => [s.id, s]));

    jobSkills.forEach(jobSkill => {
      const candidateSkill = candidateSkillMap.get(jobSkill.id);
      const weight = jobSkill.is_required ? 2 : 1;
      totalRequiredPoints += jobSkill.required_level * weight;

      if (candidateSkill) {
        const skillMatch = Math.min(candidateSkill.proficiency_level / jobSkill.required_level, 1);
        skillsMatchPoints += skillMatch * jobSkill.required_level * weight;
        matchingSkills.push({
          name: jobSkill.name,
          userLevel: candidateSkill.proficiency_level,
          requiredLevel: jobSkill.required_level,
        });
      } else {
        missingSkills.push({
          name: jobSkill.name,
          requiredLevel: jobSkill.required_level,
        });
      }
    });

    const skillsScore = totalRequiredPoints > 0 ? (skillsMatchPoints / totalRequiredPoints) * 100 : 0;

    // Calculate experience score
    const experienceScore = Math.min((candidate.years_experience / 10) * 100, 100);

    // Calculate department/internal mobility score
    const departmentScore = candidate.department === job.department ? 100 : 70;

    // Calculate potential score based on performance reviews
    const performanceReview = db.prepare(`
      SELECT AVG(potential_score) as avg_potential, AVG(rating) as avg_rating
      FROM performance_reviews
      WHERE user_id = ?
    `).get(candidateId) as { avg_potential: number | null; avg_rating: number | null };

    const potentialScore = performanceReview?.avg_potential
      ? (performanceReview.avg_potential / 5) * 100
      : 70; // Default potential score

    // Calculate overall weighted score
    const weights = {
      skills: 0.45,
      experience: 0.20,
      department: 0.15,
      potential: 0.20,
    };

    const overallScore =
      skillsScore * weights.skills +
      experienceScore * weights.experience +
      departmentScore * weights.department +
      potentialScore * weights.potential;

    // Generate recommendations
    const recommendations = this.generateRecommendations(
      skillsScore,
      missingSkills,
      candidate,
      job
    );

    return {
      jobId,
      candidateId,
      overallScore: Math.round(overallScore * 10) / 10,
      skillsScore: Math.round(skillsScore * 10) / 10,
      experienceScore: Math.round(experienceScore * 10) / 10,
      departmentScore: Math.round(departmentScore * 10) / 10,
      potentialScore: Math.round(potentialScore * 10) / 10,
      matchingSkills,
      missingSkills,
      recommendations,
    };
  }

  /**
   * Generate AI-powered recommendations for career development
   */
  static generateRecommendations(
    skillsScore: number,
    missingSkills: Array<{ name: string; requiredLevel: number }>,
    candidate: any,
    job: any
  ): string[] {
    const recommendations: string[] = [];

    if (skillsScore >= 80) {
      recommendations.push('Strong skills match - you are well-qualified for this role');
    } else if (skillsScore >= 60) {
      recommendations.push('Good skills match - consider highlighting your transferable skills');
    } else {
      recommendations.push('Skills gap identified - consider upskilling before applying');
    }

    if (missingSkills.length > 0 && missingSkills.length <= 3) {
      const skillNames = missingSkills.map(s => s.name).join(', ');
      recommendations.push(`Develop these skills to improve your match: ${skillNames}`);
    } else if (missingSkills.length > 3) {
      recommendations.push(`Consider taking courses in ${missingSkills[0].name} and ${missingSkills[1].name} to strengthen your application`);
    }

    if (candidate.department !== job.department) {
      recommendations.push('Cross-functional move - emphasize adaptability and learning agility');
    } else {
      recommendations.push('Internal move within your department - leverage your domain expertise');
    }

    return recommendations;
  }

  /**
   * Find best job matches for a candidate
   */
  static findJobMatchesForCandidate(candidateId: number, limit: number = 10): JobMatch[] {
    const openJobs = db.prepare(`
      SELECT * FROM jobs
      WHERE status = 'open' AND is_internal_only = 1
    `).all() as any[];

    const matches: JobMatch[] = openJobs.map(job => {
      const matchScore = this.calculateMatchScore(candidateId, job.id);
      return { job, matchScore };
    });

    // Sort by overall score descending
    matches.sort((a, b) => b.matchScore.overallScore - a.matchScore.overallScore);

    return matches.slice(0, limit);
  }

  /**
   * Find best candidate matches for a job
   */
  static findCandidateMatchesForJob(jobId: number, limit: number = 20): Array<{
    candidate: any;
    matchScore: MatchScore;
  }> {
    // Get all candidates (users with candidate or any role who can apply)
    const candidates = db.prepare(`
      SELECT * FROM users
      WHERE role IN ('candidate', 'manager')
    `).all() as any[];

    const matches = candidates.map(candidate => {
      const matchScore = this.calculateMatchScore(candidate.id, jobId);
      return { candidate, matchScore };
    });

    // Sort by overall score descending
    matches.sort((a, b) => b.matchScore.overallScore - a.matchScore.overallScore);

    return matches.slice(0, limit);
  }

  /**
   * Identify flight risk and recommend retention actions
   */
  static analyzeFlightRisk(userId: number): {
    riskLevel: 'low' | 'medium' | 'high';
    factors: string[];
    recommendations: string[];
  } {
    const factors: string[] = [];
    let riskScore = 0;

    // Check recent performance reviews
    const review = db.prepare(`
      SELECT flight_risk_level, rating, potential_score
      FROM performance_reviews
      WHERE user_id = ?
      ORDER BY created_at DESC
      LIMIT 1
    `).get(userId) as { flight_risk_level: string; rating: number; potential_score: number } | undefined;

    if (review) {
      if (review.flight_risk_level === 'high') {
        riskScore += 40;
        factors.push('Flagged as high flight risk in recent review');
      }
      if (review.rating >= 4 && review.potential_score >= 4) {
        riskScore += 20;
        factors.push('High performer with limited recent growth opportunities');
      }
    }

    // Check career goals alignment
    const goals = db.prepare(`
      SELECT * FROM career_goals
      WHERE user_id = ?
      ORDER BY created_at DESC
      LIMIT 1
    `).get(userId);

    if (goals) {
      factors.push('Has documented career aspirations - needs growth opportunities');
      riskScore += 15;
    }

    // Check recent applications
    const recentApplications = db.prepare(`
      SELECT COUNT(*) as count
      FROM applications
      WHERE candidate_id = ? AND created_at > datetime('now', '-90 days')
    `).get(userId) as { count: number };

    if (recentApplications.count > 3) {
      riskScore += 25;
      factors.push('Actively exploring internal opportunities');
    }

    const riskLevel: 'low' | 'medium' | 'high' =
      riskScore >= 60 ? 'high' : riskScore >= 30 ? 'medium' : 'low';

    const recommendations: string[] = [];
    if (riskLevel === 'high') {
      recommendations.push('Schedule 1-on-1 to discuss career development');
      recommendations.push('Identify stretch assignments or leadership opportunities');
      recommendations.push('Review compensation and promotion timeline');
    } else if (riskLevel === 'medium') {
      recommendations.push('Proactively discuss career goals in next review');
      recommendations.push('Consider for high-visibility projects');
    }

    return { riskLevel, factors, recommendations };
  }

  /**
   * Suggest career paths based on current role and skills
   */
  static suggestCareerPaths(userId: number): Array<{
    targetRole: string;
    matchScore: number;
    skillGaps: string[];
    timeframe: string;
  }> {
    // This is a simplified version - in production, use ML models
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId) as any;

    const careerPaths = [
      {
        targetRole: 'Senior ' + user.job_title,
        matchScore: 75,
        skillGaps: ['Leadership', 'Strategic Planning'],
        timeframe: '1-2 years',
      },
      {
        targetRole: 'Tech Lead',
        matchScore: 65,
        skillGaps: ['System Design', 'Mentoring'],
        timeframe: '2-3 years',
      },
      {
        targetRole: 'Engineering Manager',
        matchScore: 55,
        skillGaps: ['People Management', 'Project Management'],
        timeframe: '3-4 years',
      },
    ];

    return careerPaths;
  }
}

export default JobMatchingEngine;

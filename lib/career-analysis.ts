/**
 * Career Path Analysis & Visualization Logic
 * Analyzes skill gaps and provides career progression recommendations
 */

export interface SkillRequirement {
  skillName: string;
  category: string;
  requiredLevel: number; // 1-5
  priority: 'critical' | 'important' | 'nice-to-have';
}

export interface RoleDefinition {
  title: string;
  level: string;
  requiredSkills: SkillRequirement[];
  typicalYearsExperience: number;
  description: string;
}

export interface UserSkill {
  skillName: string;
  category: string;
  currentLevel: number; // 1-5
  yearsExperience: number;
  endorsedCount: number;
}

export interface SkillGap {
  skillName: string;
  category: string;
  requiredLevel: number;
  currentLevel: number;
  gap: number; // Difference between required and current
  priority: 'critical' | 'important' | 'nice-to-have';
  status: 'proficient' | 'developing' | 'needs-development' | 'missing';
}

export interface CareerPathData {
  currentRole: string;
  targetRole: string;
  timeframe: string;
  overallReadiness: number; // 0-100%
  currentSkills: UserSkill[];
  requiredSkills: SkillRequirement[];
  skillGaps: SkillGap[];
  strengths: string[]; // Skills above required level
  developmentAreas: string[]; // Skills below required level
  nextSteps: string[];
}

/**
 * Role Skill Requirements Database
 * Defines what skills are needed for various technical and leadership roles
 */
const ROLE_DEFINITIONS: Record<string, RoleDefinition> = {
  'Software Engineer': {
    title: 'Software Engineer',
    level: 'IC3',
    typicalYearsExperience: 2,
    description: 'Individual contributor building features and fixing bugs',
    requiredSkills: [
      { skillName: 'JavaScript', category: 'Programming', requiredLevel: 3, priority: 'critical' },
      { skillName: 'TypeScript', category: 'Programming', requiredLevel: 3, priority: 'important' },
      { skillName: 'React', category: 'Frontend', requiredLevel: 3, priority: 'critical' },
      { skillName: 'Git', category: 'Tools', requiredLevel: 3, priority: 'critical' },
      { skillName: 'Problem Solving', category: 'Soft Skills', requiredLevel: 3, priority: 'critical' },
      { skillName: 'Communication', category: 'Soft Skills', requiredLevel: 3, priority: 'important' },
    ]
  },
  'Senior Software Engineer': {
    title: 'Senior Software Engineer',
    level: 'IC4',
    typicalYearsExperience: 5,
    description: 'Experienced engineer leading technical design and mentoring others',
    requiredSkills: [
      { skillName: 'JavaScript', category: 'Programming', requiredLevel: 4, priority: 'critical' },
      { skillName: 'TypeScript', category: 'Programming', requiredLevel: 4, priority: 'critical' },
      { skillName: 'React', category: 'Frontend', requiredLevel: 4, priority: 'critical' },
      { skillName: 'Node.js', category: 'Backend', requiredLevel: 4, priority: 'important' },
      { skillName: 'System Design', category: 'Architecture', requiredLevel: 4, priority: 'critical' },
      { skillName: 'Mentoring', category: 'Leadership', requiredLevel: 3, priority: 'important' },
      { skillName: 'Problem Solving', category: 'Soft Skills', requiredLevel: 4, priority: 'critical' },
      { skillName: 'Communication', category: 'Soft Skills', requiredLevel: 4, priority: 'critical' },
    ]
  },
  'Tech Lead': {
    title: 'Tech Lead',
    level: 'IC5',
    typicalYearsExperience: 7,
    description: 'Technical leader driving architecture and team execution',
    requiredSkills: [
      { skillName: 'JavaScript', category: 'Programming', requiredLevel: 5, priority: 'critical' },
      { skillName: 'TypeScript', category: 'Programming', requiredLevel: 5, priority: 'critical' },
      { skillName: 'System Design', category: 'Architecture', requiredLevel: 5, priority: 'critical' },
      { skillName: 'Leadership', category: 'Leadership', requiredLevel: 4, priority: 'critical' },
      { skillName: 'Mentoring', category: 'Leadership', requiredLevel: 4, priority: 'critical' },
      { skillName: 'Strategic Thinking', category: 'Leadership', requiredLevel: 4, priority: 'important' },
      { skillName: 'Communication', category: 'Soft Skills', requiredLevel: 5, priority: 'critical' },
      { skillName: 'Project Management', category: 'Management', requiredLevel: 4, priority: 'important' },
    ]
  },
  'Engineering Manager': {
    title: 'Engineering Manager',
    level: 'M3',
    typicalYearsExperience: 8,
    description: 'People manager responsible for team performance and growth',
    requiredSkills: [
      { skillName: 'Leadership', category: 'Leadership', requiredLevel: 5, priority: 'critical' },
      { skillName: 'People Management', category: 'Management', requiredLevel: 5, priority: 'critical' },
      { skillName: 'Mentoring', category: 'Leadership', requiredLevel: 5, priority: 'critical' },
      { skillName: 'Strategic Thinking', category: 'Leadership', requiredLevel: 4, priority: 'critical' },
      { skillName: 'Communication', category: 'Soft Skills', requiredLevel: 5, priority: 'critical' },
      { skillName: 'Conflict Resolution', category: 'Management', requiredLevel: 4, priority: 'important' },
      { skillName: 'Performance Management', category: 'Management', requiredLevel: 4, priority: 'critical' },
      { skillName: 'System Design', category: 'Architecture', requiredLevel: 4, priority: 'important' },
    ]
  },
  'Product Manager': {
    title: 'Product Manager',
    level: 'PM3',
    typicalYearsExperience: 4,
    description: 'Defines product strategy and prioritizes features',
    requiredSkills: [
      { skillName: 'Product Strategy', category: 'Product', requiredLevel: 4, priority: 'critical' },
      { skillName: 'User Research', category: 'Product', requiredLevel: 4, priority: 'important' },
      { skillName: 'Data Analysis', category: 'Analytics', requiredLevel: 4, priority: 'important' },
      { skillName: 'Communication', category: 'Soft Skills', requiredLevel: 5, priority: 'critical' },
      { skillName: 'Stakeholder Management', category: 'Management', requiredLevel: 4, priority: 'critical' },
      { skillName: 'Strategic Thinking', category: 'Leadership', requiredLevel: 4, priority: 'critical' },
    ]
  },
  'Data Scientist': {
    title: 'Data Scientist',
    level: 'IC3',
    typicalYearsExperience: 3,
    description: 'Analyzes data and builds ML models to drive insights',
    requiredSkills: [
      { skillName: 'Python', category: 'Programming', requiredLevel: 4, priority: 'critical' },
      { skillName: 'Machine Learning', category: 'AI/ML', requiredLevel: 4, priority: 'critical' },
      { skillName: 'Statistics', category: 'Analytics', requiredLevel: 4, priority: 'critical' },
      { skillName: 'Data Analysis', category: 'Analytics', requiredLevel: 4, priority: 'critical' },
      { skillName: 'SQL', category: 'Database', requiredLevel: 4, priority: 'important' },
      { skillName: 'Communication', category: 'Soft Skills', requiredLevel: 4, priority: 'important' },
    ]
  },
  'DevOps Engineer': {
    title: 'DevOps Engineer',
    level: 'IC3',
    typicalYearsExperience: 3,
    description: 'Manages infrastructure and deployment pipelines',
    requiredSkills: [
      { skillName: 'AWS', category: 'Cloud', requiredLevel: 4, priority: 'critical' },
      { skillName: 'Docker', category: 'DevOps', requiredLevel: 4, priority: 'critical' },
      { skillName: 'Kubernetes', category: 'DevOps', requiredLevel: 4, priority: 'critical' },
      { skillName: 'CI/CD', category: 'DevOps', requiredLevel: 4, priority: 'critical' },
      { skillName: 'Linux', category: 'Infrastructure', requiredLevel: 4, priority: 'important' },
      { skillName: 'Python', category: 'Programming', requiredLevel: 3, priority: 'important' },
      { skillName: 'Problem Solving', category: 'Soft Skills', requiredLevel: 4, priority: 'critical' },
    ]
  },
};

/**
 * Calculate skill gaps between current and required skills
 */
export function calculateSkillGaps(
  currentSkills: UserSkill[],
  requiredSkills: SkillRequirement[]
): SkillGap[] {
  const gaps: SkillGap[] = [];
  
  // Create a map of current skills for quick lookup
  const currentSkillMap = new Map(
    currentSkills.map(skill => [skill.skillName.toLowerCase(), skill])
  );

  for (const required of requiredSkills) {
    const current = currentSkillMap.get(required.skillName.toLowerCase());
    const currentLevel = current?.currentLevel || 0;
    const gap = required.requiredLevel - currentLevel;

    let status: 'proficient' | 'developing' | 'needs-development' | 'missing';
    if (currentLevel === 0) {
      status = 'missing';
    } else if (currentLevel >= required.requiredLevel) {
      status = 'proficient';
    } else if (gap <= 1) {
      status = 'developing';
    } else {
      status = 'needs-development';
    }

    gaps.push({
      skillName: required.skillName,
      category: required.category,
      requiredLevel: required.requiredLevel,
      currentLevel,
      gap,
      priority: required.priority,
      status
    });
  }

  // Sort by priority and gap size
  return gaps.sort((a, b) => {
    // Critical skills first
    if (a.priority === 'critical' && b.priority !== 'critical') return -1;
    if (a.priority !== 'critical' && b.priority === 'critical') return 1;
    
    // Then by gap size (larger gaps first)
    return b.gap - a.gap;
  });
}

/**
 * Calculate overall career readiness percentage
 */
export function calculateReadiness(skillGaps: SkillGap[]): number {
  if (skillGaps.length === 0) return 100;

  const totalWeight = skillGaps.reduce((sum, gap) => {
    const weight = gap.priority === 'critical' ? 3 : gap.priority === 'important' ? 2 : 1;
    return sum + weight;
  }, 0);

  const achievedWeight = skillGaps.reduce((sum, gap) => {
    const weight = gap.priority === 'critical' ? 3 : gap.priority === 'important' ? 2 : 1;
    const achievement = Math.max(0, gap.requiredLevel - gap.gap) / gap.requiredLevel;
    return sum + (weight * achievement);
  }, 0);

  return Math.round((achievedWeight / totalWeight) * 100);
}

/**
 * Generate next steps based on skill gaps
 */
export function generateNextSteps(skillGaps: SkillGap[]): string[] {
  const steps: string[] = [];
  
  // Critical missing skills
  const criticalMissing = skillGaps.filter(g => g.priority === 'critical' && g.status === 'missing');
  if (criticalMissing.length > 0) {
    steps.push(`Start learning ${criticalMissing[0].skillName} through online courses or workshops`);
  }

  // Critical gaps
  const criticalGaps = skillGaps.filter(g => g.priority === 'critical' && g.gap > 0 && g.status !== 'missing');
  if (criticalGaps.length > 0) {
    steps.push(`Advance ${criticalGaps[0].skillName} from level ${criticalGaps[0].currentLevel} to ${criticalGaps[0].requiredLevel}`);
  }

  // Important skills
  const importantGaps = skillGaps.filter(g => g.priority === 'important' && g.gap > 0);
  if (importantGaps.length > 0) {
    steps.push(`Develop ${importantGaps[0].skillName} through projects or mentorship`);
  }

  // General recommendations
  if (steps.length === 0) {
    steps.push('Continue strengthening your current skills');
    steps.push('Consider stretch assignments to build leadership experience');
  } else {
    steps.push('Discuss development plan with your manager');
    steps.push('Set specific goals in your development plan');
  }

  return steps.slice(0, 4); // Return max 4 steps
}

/**
 * Analyze career path and generate comprehensive report
 */
export function analyzeCareerPath(
  currentSkills: UserSkill[],
  targetRole: string,
  currentRole?: string,
  timeframe?: string
): CareerPathData {
  const roleDefinition = ROLE_DEFINITIONS[targetRole];
  
  if (!roleDefinition) {
    throw new Error(`Role definition not found for: ${targetRole}`);
  }

  const skillGaps = calculateSkillGaps(currentSkills, roleDefinition.requiredSkills);
  const overallReadiness = calculateReadiness(skillGaps);
  
  // Identify strengths (skills at or above required level)
  const strengths = skillGaps
    .filter(gap => gap.status === 'proficient')
    .map(gap => gap.skillName);

  // Identify development areas (skills below required level)
  const developmentAreas = skillGaps
    .filter(gap => gap.status !== 'proficient')
    .map(gap => gap.skillName);

  const nextSteps = generateNextSteps(skillGaps);

  return {
    currentRole: currentRole || 'Current Position',
    targetRole: roleDefinition.title,
    timeframe: timeframe || 'Not specified',
    overallReadiness,
    currentSkills,
    requiredSkills: roleDefinition.requiredSkills,
    skillGaps,
    strengths,
    developmentAreas,
    nextSteps
  };
}

/**
 * Get all available target roles
 */
export function getAvailableRoles(): string[] {
  return Object.keys(ROLE_DEFINITIONS);
}

/**
 * Get role definition by title
 */
export function getRoleDefinition(roleTitle: string): RoleDefinition | undefined {
  return ROLE_DEFINITIONS[roleTitle];
}

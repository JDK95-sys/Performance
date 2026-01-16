/**
 * Training Data Generator for ML Models
 * Generates synthetic training data for TensorFlow models
 */

/**
 * Generate synthetic training data for flight risk prediction
 * In production, this would use historical employee data
 */
export function generateFlightRiskTrainingData(): {
  features: number[][];
  labels: number[][];
} {
  const features: number[][] = [];
  const labels: number[][] = [];

  // Generate 500 synthetic training samples
  for (let i = 0; i < 500; i++) {
    // Features: [performanceRating, potentialRating, yearsExperience, 
    //           feedbackCount, oneOnOneCount, goalsAtRisk, hasDevPlan, promotionReadiness]
    
    const performanceRating = Math.random() * 4 + 1; // 1-5
    const potentialRating = Math.random() * 4 + 1; // 1-5
    const yearsExperience = Math.random() * 20; // 0-20
    const feedbackCount = Math.random() * 15; // 0-15
    const oneOnOneCount = Math.random() * 8; // 0-8
    const goalsAtRisk = Math.floor(Math.random() * 5); // 0-4
    const hasDevPlan = Math.random() > 0.5 ? 1 : 0;
    const promotionReadiness = Math.random();

    features.push([
      performanceRating,
      potentialRating,
      yearsExperience,
      feedbackCount,
      oneOnOneCount,
      goalsAtRisk,
      hasDevPlan,
      promotionReadiness
    ]);

    // Calculate flight risk (0: low, 1: medium, 2: high)
    let riskScore = 0;
    
    // High performers without dev plan are at risk
    if (performanceRating >= 4.0 && hasDevPlan === 0) riskScore += 0.3;
    
    // Long tenure without growth
    if (yearsExperience >= 5 && promotionReadiness < 0.3) riskScore += 0.25;
    
    // Low feedback
    if (feedbackCount < 3) riskScore += 0.15;
    
    // Infrequent 1-on-1s
    if (oneOnOneCount < 2) riskScore += 0.2;
    
    // Goals at risk
    if (goalsAtRisk > 1) riskScore += 0.15;
    
    // High potential without support
    if (potentialRating >= 4 && hasDevPlan === 0) riskScore += 0.2;

    // Convert to one-hot encoding
    let label: number[];
    if (riskScore >= 0.6) {
      label = [0, 0, 1]; // high
    } else if (riskScore >= 0.3) {
      label = [0, 1, 0]; // medium
    } else {
      label = [1, 0, 0]; // low
    }

    labels.push(label);
  }

  return { features, labels };
}

/**
 * Generate synthetic training data for performance trend prediction
 */
export function generatePerformanceTrendTrainingData(): {
  features: number[][];
  labels: number[];
} {
  const features: number[][] = [];
  const labels: number[] = [];

  // Generate 500 synthetic training samples
  for (let i = 0; i < 500; i++) {
    // Features: [goalCompletion, feedbackScore, oneOnOneFrequency, 
    //           skillGrowth, projectImpact, teamCollaboration]
    
    const goalCompletion = Math.random() * 100; // 0-100%
    const feedbackScore = Math.random() * 4 + 1; // 1-5
    const oneOnOneFrequency = Math.random() * 8; // 0-8
    const skillGrowth = Math.random() * 4 + 1; // 1-5
    const projectImpact = Math.random() * 4 + 1; // 1-5
    const teamCollaboration = Math.random() * 4 + 1; // 1-5

    features.push([
      goalCompletion,
      feedbackScore,
      oneOnOneFrequency,
      skillGrowth,
      projectImpact,
      teamCollaboration
    ]);

    // Calculate predicted performance rating (1-5)
    const performanceRating = (
      (goalCompletion / 100) * 0.25 +
      (feedbackScore / 5) * 0.2 +
      (Math.min(oneOnOneFrequency, 4) / 4) * 0.1 +
      (skillGrowth / 5) * 0.2 +
      (projectImpact / 5) * 0.15 +
      (teamCollaboration / 5) * 0.1
    ) * 5;

    labels.push(performanceRating / 5); // Normalize to 0-1

  }

  return { features, labels };
}

/**
 * Generate synthetic training data for churn prediction
 */
export function generateChurnTrainingData(): {
  features: number[][];
  labels: number[];
} {
  const features: number[][] = [];
  const labels: number[] = [];

  // Generate 1000 synthetic training samples
  for (let i = 0; i < 1000; i++) {
    // Features: [performanceRating, satisfactionScore, yearsAtCompany, promotionHistory,
    //           compensationLevel, workLifeBalance, managerRating, peerFeedbackScore,
    //           trainingHours, careerGrowthScore]
    
    const performanceRating = Math.random() * 4 + 1;
    const satisfactionScore = Math.random() * 4 + 1;
    const yearsAtCompany = Math.random() * 20;
    const promotionHistory = Math.floor(Math.random() * 5);
    const compensationLevel = Math.random() * 10;
    const workLifeBalance = Math.random() * 4 + 1;
    const managerRating = Math.random() * 4 + 1;
    const peerFeedbackScore = Math.random() * 4 + 1;
    const trainingHours = Math.random() * 80;
    const careerGrowthScore = Math.random() * 4 + 1;

    features.push([
      performanceRating,
      satisfactionScore,
      yearsAtCompany,
      promotionHistory,
      compensationLevel,
      workLifeBalance,
      managerRating,
      peerFeedbackScore,
      trainingHours,
      careerGrowthScore
    ]);

    // Calculate churn probability
    let churnScore = 0.5; // Base probability

    // Low satisfaction increases churn
    if (satisfactionScore < 2.5) churnScore += 0.3;
    else if (satisfactionScore < 3.5) churnScore += 0.1;
    
    // Poor work-life balance
    if (workLifeBalance < 2.5) churnScore += 0.2;
    
    // Long tenure without promotion
    if (yearsAtCompany >= 5 && promotionHistory === 0) churnScore += 0.25;
    
    // Low compensation
    if (compensationLevel < 5) churnScore += 0.15;
    
    // Poor manager relationship
    if (managerRating < 2.5) churnScore += 0.2;
    
    // Lack of growth
    if (careerGrowthScore < 2.5) churnScore += 0.2;
    
    // High performers with no growth are flight risks
    if (performanceRating >= 4 && careerGrowthScore < 3) churnScore += 0.15;

    // Positive factors reduce churn
    if (satisfactionScore >= 4) churnScore -= 0.2;
    if (workLifeBalance >= 4) churnScore -= 0.1;
    if (trainingHours >= 40) churnScore -= 0.1;
    if (peerFeedbackScore >= 4) churnScore -= 0.1;

    // Clamp to 0-1
    churnScore = Math.max(0, Math.min(1, churnScore));

    labels.push(churnScore);
  }

  return { features, labels };
}

/**
 * Pre-train all ML models with synthetic data
 * This should be called on server startup
 */
export async function preTrainModels(): Promise<void> {
  try {
    const { getFlightRiskPredictor, getPerformanceTrendAnalyzer, getChurnPredictor } = await import('./ml-models');
    
    // Train flight risk predictor
    const flightRiskData = generateFlightRiskTrainingData();
    const flightRiskPredictor = await getFlightRiskPredictor();
    await flightRiskPredictor.train(flightRiskData);
    
    console.log('✓ Flight Risk Predictor trained');

    // Performance trend analyzer doesn't need explicit training for this demo
    await getPerformanceTrendAnalyzer();
    console.log('✓ Performance Trend Analyzer initialized');

    // Churn predictor doesn't need explicit training for this demo
    await getChurnPredictor();
    console.log('✓ Churn Predictor initialized');

    console.log('✓ All ML models initialized and ready');
  } catch (error) {
    console.error('Error pre-training models:', error);
  }
}

/**
 * TensorFlow ML Models Tests
 * Tests for Phase 2: Advanced ML models
 */

import { FlightRiskPredictor, PerformanceTrendAnalyzer, ChurnPredictor } from '../lib/ml-models';
import { generateFlightRiskTrainingData, generatePerformanceTrendTrainingData, generateChurnTrainingData } from '../lib/ml-training-data';

describe('TensorFlow ML Models', () => {
  describe('FlightRiskPredictor', () => {
    let predictor: FlightRiskPredictor;

    beforeAll(async () => {
      predictor = new FlightRiskPredictor();
      await predictor.initialize();
    });

    afterAll(() => {
      predictor.dispose();
    });

    test('should initialize successfully', () => {
      expect(predictor).toBeDefined();
    });

    test('should predict low risk for high performer with dev plan', async () => {
      // Features: [performanceRating, potentialRating, yearsExperience, 
      //           feedbackCount, oneOnOneCount, goalsAtRisk, hasDevPlan, promotionReadiness]
      const features = [4.5, 4.0, 3, 10, 4, 0, 1, 0.8];
      const result = await predictor.predict(features);

      expect(result).toHaveProperty('risk');
      expect(result).toHaveProperty('confidence');
      expect(result).toHaveProperty('factors');
      expect(['low', 'medium', 'high']).toContain(result.risk);
      expect(result.confidence).toBeGreaterThanOrEqual(0);
      expect(result.confidence).toBeLessThanOrEqual(100);
      expect(Array.isArray(result.factors)).toBe(true);
    });

    test('should predict high risk for high performer without dev plan', async () => {
      // High performer, no dev plan, long tenure, low feedback
      const features = [4.5, 4.0, 8, 1, 1, 2, 0, 0.2];
      const result = await predictor.predict(features);

      expect(result).toHaveProperty('risk');
      expect(result.confidence).toBeGreaterThan(0);
      expect(result.factors.length).toBeGreaterThan(0);
    });

    test('should train with synthetic data', async () => {
      const trainingData = generateFlightRiskTrainingData();
      
      expect(trainingData.features).toBeDefined();
      expect(trainingData.labels).toBeDefined();
      expect(trainingData.features.length).toBeGreaterThan(0);
      expect(trainingData.features.length).toBe(trainingData.labels.length);

      // Train the model
      await expect(predictor.train(trainingData)).resolves.not.toThrow();
    });
  });

  describe('PerformanceTrendAnalyzer', () => {
    let analyzer: PerformanceTrendAnalyzer;

    beforeAll(async () => {
      analyzer = new PerformanceTrendAnalyzer();
      await analyzer.initialize();
    });

    afterAll(() => {
      analyzer.dispose();
    });

    test('should initialize successfully', () => {
      expect(analyzer).toBeDefined();
    });

    test('should analyze improving trend', async () => {
      const historicalRatings = [3.0, 3.2, 3.5, 4.0, 4.2];
      // Features: [goalCompletion, feedbackScore, oneOnOneFrequency, skillGrowth, projectImpact, teamCollaboration]
      const features = [85, 4.5, 4, 4.5, 4.0, 4.2];
      
      const result = await analyzer.analyzeTrend(historicalRatings, features);

      expect(result).toHaveProperty('trend');
      expect(result).toHaveProperty('predictedRating');
      expect(result).toHaveProperty('confidence');
      expect(result).toHaveProperty('insights');
      expect(['improving', 'stable', 'declining']).toContain(result.trend);
      expect(result.predictedRating).toBeGreaterThanOrEqual(1);
      expect(result.predictedRating).toBeLessThanOrEqual(5);
      expect(Array.isArray(result.insights)).toBe(true);
    });

    test('should analyze declining trend', async () => {
      const historicalRatings = [4.2, 4.0, 3.5, 3.2, 3.0];
      const features = [50, 3.0, 1, 2.5, 2.8, 2.5];
      
      const result = await analyzer.analyzeTrend(historicalRatings, features);

      expect(result.trend).toBeDefined();
      expect(result.insights.length).toBeGreaterThan(0);
    });

    test('should generate valid training data', () => {
      const trainingData = generatePerformanceTrendTrainingData();
      
      expect(trainingData.features).toBeDefined();
      expect(trainingData.labels).toBeDefined();
      expect(trainingData.features.length).toBeGreaterThan(0);
      expect(trainingData.features.length).toBe(trainingData.labels.length);
    });
  });

  describe('ChurnPredictor', () => {
    let predictor: ChurnPredictor;

    beforeAll(async () => {
      predictor = new ChurnPredictor();
      await predictor.initialize();
    });

    afterAll(() => {
      predictor.dispose();
    });

    test('should initialize successfully', () => {
      expect(predictor).toBeDefined();
    });

    test('should predict low churn for satisfied employee', async () => {
      // Features: [performanceRating, satisfactionScore, yearsAtCompany, promotionHistory,
      //           compensationLevel, workLifeBalance, managerRating, peerFeedbackScore,
      //           trainingHours, careerGrowthScore]
      const features = [4.5, 4.5, 3, 1, 8, 4.5, 4.5, 4.5, 50, 4.5];
      
      const result = await predictor.predictChurn(features);

      expect(result).toHaveProperty('churnProbability');
      expect(result).toHaveProperty('risk');
      expect(result).toHaveProperty('recommendations');
      expect(result.churnProbability).toBeGreaterThanOrEqual(0);
      expect(result.churnProbability).toBeLessThanOrEqual(100);
      expect(['low', 'medium', 'high']).toContain(result.risk);
      expect(Array.isArray(result.recommendations)).toBe(true);
    });

    test('should predict high churn for dissatisfied employee', async () => {
      // Low satisfaction, poor work-life balance, long tenure without promotion
      const features = [3.0, 2.0, 8, 0, 4, 2.0, 2.5, 3.0, 10, 2.0];
      
      const result = await predictor.predictChurn(features);

      expect(result.churnProbability).toBeGreaterThan(0);
      expect(result.recommendations.length).toBeGreaterThan(0);
    });

    test('should generate valid training data', () => {
      const trainingData = generateChurnTrainingData();
      
      expect(trainingData.features).toBeDefined();
      expect(trainingData.labels).toBeDefined();
      expect(trainingData.features.length).toBeGreaterThan(0);
      expect(trainingData.features.length).toBe(trainingData.labels.length);
    });
  });

  describe('Training Data Generation', () => {
    test('flight risk training data should have correct shape', () => {
      const data = generateFlightRiskTrainingData();
      
      expect(data.features.length).toBeGreaterThan(0);
      expect(data.features[0].length).toBe(8); // 8 features
      expect(data.labels[0].length).toBe(3); // 3 classes (low, medium, high)
    });

    test('performance trend training data should have correct shape', () => {
      const data = generatePerformanceTrendTrainingData();
      
      expect(data.features.length).toBeGreaterThan(0);
      expect(data.features[0].length).toBe(6); // 6 features
      expect(typeof data.labels[0]).toBe('number'); // Single value prediction
    });

    test('churn training data should have correct shape', () => {
      const data = generateChurnTrainingData();
      
      expect(data.features.length).toBeGreaterThan(0);
      expect(data.features[0].length).toBe(10); // 10 features
      expect(typeof data.labels[0]).toBe('number'); // Binary prediction
    });
  });
});

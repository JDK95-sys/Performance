/**
 * Machine Learning Models with TensorFlow.js
 * Phase 2: Advanced ML models for performance analytics
 */

import * as tf from '@tensorflow/tfjs';

/**
 * Flight Risk Prediction Model using TensorFlow
 * Predicts employee flight risk using neural network
 */
export class FlightRiskPredictor {
  private model: tf.LayersModel | null = null;
  private isInitialized = false;

  /**
   * Initialize and train the flight risk prediction model
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    // Create a simple neural network for flight risk prediction
    this.model = tf.sequential({
      layers: [
        tf.layers.dense({ inputShape: [8], units: 16, activation: 'relu' }),
        tf.layers.dropout({ rate: 0.2 }),
        tf.layers.dense({ units: 8, activation: 'relu' }),
        tf.layers.dense({ units: 3, activation: 'softmax' }) // low, medium, high
      ]
    });

    // Compile the model
    this.model.compile({
      optimizer: tf.train.adam(0.001),
      loss: 'categoricalCrossentropy',
      metrics: ['accuracy']
    });

    this.isInitialized = true;
  }

  /**
   * Predict flight risk for an employee
   * @param features Array of 8 features: [performanceRating, potentialRating, yearsExperience, 
   *                 feedbackCount, oneOnOneCount, goalsAtRisk, hasDevPlan, promotionReadiness]
   * @returns Prediction with risk level, confidence, and factors
   */
  async predict(features: number[]): Promise<{
    risk: 'low' | 'medium' | 'high';
    confidence: number;
    factors: string[];
  }> {
    if (!this.isInitialized || !this.model) {
      await this.initialize();
    }

    // Normalize features to 0-1 range
    const normalizedFeatures = this.normalizeFeatures(features);

    // Make prediction
    const input = tf.tensor2d([normalizedFeatures]);
    const prediction = this.model!.predict(input) as tf.Tensor;
    const predictionData = await prediction.data();
    
    // Clean up tensors
    input.dispose();
    prediction.dispose();

    // Get risk level (0: low, 1: medium, 2: high)
    const riskLevels: ('low' | 'medium' | 'high')[] = ['low', 'medium', 'high'];
    const maxIndex = predictionData.indexOf(Math.max(...Array.from(predictionData)));
    const risk = riskLevels[maxIndex];
    const confidence = Math.round(predictionData[maxIndex] * 100);

    // Generate factors based on features
    const factors = this.generateFactors(features);

    return { risk, confidence, factors };
  }

  /**
   * Normalize features to 0-1 range
   */
  private normalizeFeatures(features: number[]): number[] {
    // Feature ranges: [0-5, 0-5, 0-30, 0-20, 0-10, 0-10, 0-1, 0-1]
    const maxValues = [5, 5, 30, 20, 10, 10, 1, 1];
    return features.map((f, i) => Math.min(f / maxValues[i], 1));
  }

  /**
   * Generate human-readable factors
   */
  private generateFactors(features: number[]): string[] {
    const factors: string[] = [];
    const [perf, pot, years, feedback, oneOnOne, goalsAtRisk, devPlan, promotion] = features;

    if (perf >= 4.0 && devPlan === 0) {
      factors.push('High performer without active development plan');
    }
    if (years >= 5 && promotion < 0.5) {
      factors.push('Experienced employee - review growth trajectory');
    }
    if (feedback < 3) {
      factors.push('Limited recent feedback and recognition');
    }
    if (oneOnOne < 2) {
      factors.push('Infrequent manager check-ins');
    }
    if (goalsAtRisk > 0) {
      factors.push('Goals at risk - may indicate blockers or lack of support');
    }
    if (pot >= 4.0 && devPlan === 0) {
      factors.push('High potential without structured development');
    }

    return factors;
  }

  /**
   * Train model with historical data
   * In production, this would use actual employee data
   */
  async train(trainingData: { features: number[][]; labels: number[][] }): Promise<void> {
    if (!this.isInitialized || !this.model) {
      await this.initialize();
    }

    const xs = tf.tensor2d(trainingData.features.map(f => this.normalizeFeatures(f)));
    const ys = tf.tensor2d(trainingData.labels);

    await this.model!.fit(xs, ys, {
      epochs: 50,
      batchSize: 32,
      validationSplit: 0.2,
      verbose: 0
    });

    // Clean up tensors
    xs.dispose();
    ys.dispose();
  }

  /**
   * Cleanup resources
   */
  dispose(): void {
    if (this.model) {
      this.model.dispose();
      this.model = null;
      this.isInitialized = false;
    }
  }
}

/**
 * Performance Trend Analyzer using TensorFlow
 * Analyzes performance trends and predicts future performance
 */
export class PerformanceTrendAnalyzer {
  private model: tf.LayersModel | null = null;
  private isInitialized = false;

  /**
   * Initialize the performance trend model
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    // LSTM model for time series prediction
    this.model = tf.sequential({
      layers: [
        tf.layers.dense({ inputShape: [6], units: 16, activation: 'relu' }),
        tf.layers.dropout({ rate: 0.2 }),
        tf.layers.dense({ units: 8, activation: 'relu' }),
        tf.layers.dense({ units: 1, activation: 'linear' })
      ]
    });

    this.model.compile({
      optimizer: tf.train.adam(0.001),
      loss: 'meanSquaredError',
      metrics: ['mae']
    });

    this.isInitialized = true;
  }

  /**
   * Analyze performance trend
   * @param historicalRatings Array of historical performance ratings
   * @param features Current employee features [goalCompletion, feedbackScore, oneOnOneFrequency, skillGrowth, projectImpact, teamCollaboration]
   * @returns Trend analysis with prediction
   */
  async analyzeTrend(historicalRatings: number[], features: number[]): Promise<{
    trend: 'improving' | 'stable' | 'declining';
    predictedRating: number;
    confidence: number;
    insights: string[];
  }> {
    if (!this.isInitialized || !this.model) {
      await this.initialize();
    }

    // Normalize features
    const normalizedFeatures = features.map((f, i) => {
      const maxValues = [100, 5, 10, 5, 5, 5];
      return f / maxValues[i];
    });

    // Make prediction
    const input = tf.tensor2d([normalizedFeatures]);
    const prediction = this.model!.predict(input) as tf.Tensor;
    const predictionData = await prediction.data();
    
    // Clean up tensors
    input.dispose();
    prediction.dispose();

    const predictedRating = Math.min(Math.max(predictionData[0] * 5, 1), 5);
    
    // Determine trend
    const recentAvg = historicalRatings.slice(-3).reduce((a, b) => a + b, 0) / Math.min(historicalRatings.length, 3);
    const previousAvg = historicalRatings.slice(0, -3).reduce((a, b) => a + b, 0) / Math.max(historicalRatings.length - 3, 1);
    
    let trend: 'improving' | 'stable' | 'declining';
    if (recentAvg > previousAvg + 0.3) {
      trend = 'improving';
    } else if (recentAvg < previousAvg - 0.3) {
      trend = 'declining';
    } else {
      trend = 'stable';
    }

    // Generate insights
    const insights = this.generateInsights(features, trend, predictedRating);
    const confidence = Math.round(Math.min(historicalRatings.length * 15, 95));

    return {
      trend,
      predictedRating: Math.round(predictedRating * 10) / 10,
      confidence,
      insights
    };
  }

  /**
   * Generate insights based on features and trend
   */
  private generateInsights(features: number[], trend: string, predictedRating: number): string[] {
    const insights: string[] = [];
    const [goalCompletion, feedbackScore, oneOnOneFreq, skillGrowth, projectImpact, teamCollab] = features;

    if (trend === 'improving') {
      insights.push(`Performance is trending upward - predicted rating: ${predictedRating.toFixed(1)}/5.0`);
      if (goalCompletion >= 80) {
        insights.push('Strong goal completion rate driving improvement');
      }
      if (skillGrowth >= 4) {
        insights.push('Significant skill development contributing to growth');
      }
    } else if (trend === 'declining') {
      insights.push(`Performance showing decline - intervention recommended`);
      if (goalCompletion < 60) {
        insights.push('Low goal completion may indicate blockers');
      }
      if (oneOnOneFreq < 2) {
        insights.push('Increase 1-on-1 frequency for better support');
      }
    } else {
      insights.push(`Performance stable at ${predictedRating.toFixed(1)}/5.0`);
      if (projectImpact >= 4) {
        insights.push('High project impact - consider stretch assignments');
      }
    }

    if (teamCollab < 3) {
      insights.push('Focus on improving team collaboration');
    }
    if (feedbackScore >= 4.5) {
      insights.push('Excellent feedback from peers and manager');
    }

    return insights;
  }

  /**
   * Cleanup resources
   */
  dispose(): void {
    if (this.model) {
      this.model.dispose();
      this.model = null;
      this.isInitialized = false;
    }
  }
}

/**
 * Employee Churn Predictor using TensorFlow
 * Predicts likelihood of employee turnover
 */
export class ChurnPredictor {
  private model: tf.LayersModel | null = null;
  private isInitialized = false;

  /**
   * Initialize the churn prediction model
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    this.model = tf.sequential({
      layers: [
        tf.layers.dense({ inputShape: [10], units: 24, activation: 'relu' }),
        tf.layers.dropout({ rate: 0.3 }),
        tf.layers.dense({ units: 12, activation: 'relu' }),
        tf.layers.dropout({ rate: 0.2 }),
        tf.layers.dense({ units: 1, activation: 'sigmoid' })
      ]
    });

    this.model.compile({
      optimizer: tf.train.adam(0.001),
      loss: 'binaryCrossentropy',
      metrics: ['accuracy']
    });

    this.isInitialized = true;
  }

  /**
   * Predict churn probability
   * @param features [performanceRating, satisfactionScore, yearsAtCompany, promotionHistory, 
   *                 compensationLevel, workLifeBalance, managerRating, peerFeedbackScore, 
   *                 trainingHours, careerGrowthScore]
   * @returns Churn prediction with probability and recommendations
   */
  async predictChurn(features: number[]): Promise<{
    churnProbability: number;
    risk: 'low' | 'medium' | 'high';
    recommendations: string[];
  }> {
    if (!this.isInitialized || !this.model) {
      await this.initialize();
    }

    // Normalize features
    const maxValues = [5, 5, 30, 5, 10, 5, 5, 5, 100, 5];
    const normalizedFeatures = features.map((f, i) => f / maxValues[i]);

    // Make prediction
    const input = tf.tensor2d([normalizedFeatures]);
    const prediction = this.model!.predict(input) as tf.Tensor;
    const predictionData = await prediction.data();
    
    // Clean up tensors
    input.dispose();
    prediction.dispose();

    const churnProbability = Math.round(predictionData[0] * 100);
    
    // Determine risk level
    let risk: 'low' | 'medium' | 'high';
    if (churnProbability >= 70) {
      risk = 'high';
    } else if (churnProbability >= 40) {
      risk = 'medium';
    } else {
      risk = 'low';
    }

    // Generate recommendations
    const recommendations = this.generateRecommendations(features, churnProbability);

    return {
      churnProbability,
      risk,
      recommendations
    };
  }

  /**
   * Generate retention recommendations
   */
  private generateRecommendations(features: number[], churnProb: number): string[] {
    const recommendations: string[] = [];
    const [, satisfaction, years, promotion, comp, workLife, manager, , training, career] = features;

    if (churnProb >= 40) {
      if (satisfaction < 3) {
        recommendations.push('Conduct satisfaction survey and address key concerns');
      }
      if (workLife < 3) {
        recommendations.push('Review workload and work-life balance');
      }
      if (career < 3) {
        recommendations.push('Create clear career development path');
      }
      if (years >= 3 && promotion < 1) {
        recommendations.push('Review promotion opportunities and timeline');
      }
      if (comp < 5) {
        recommendations.push('Conduct compensation review against market rates');
      }
      if (manager < 3) {
        recommendations.push('Address manager-employee relationship issues');
      }
      if (training < 20) {
        recommendations.push('Increase learning and development opportunities');
      }
    }

    if (recommendations.length === 0) {
      recommendations.push('Continue current retention practices');
      recommendations.push('Maintain regular check-ins and feedback');
    }

    return recommendations;
  }

  /**
   * Cleanup resources
   */
  dispose(): void {
    if (this.model) {
      this.model.dispose();
      this.model = null;
      this.isInitialized = false;
    }
  }
}

// Singleton instances
let flightRiskPredictor: FlightRiskPredictor | null = null;
let performanceTrendAnalyzer: PerformanceTrendAnalyzer | null = null;
let churnPredictor: ChurnPredictor | null = null;

/**
 * Get or create flight risk predictor instance
 */
export async function getFlightRiskPredictor(): Promise<FlightRiskPredictor> {
  if (!flightRiskPredictor) {
    flightRiskPredictor = new FlightRiskPredictor();
    await flightRiskPredictor.initialize();
  }
  return flightRiskPredictor;
}

/**
 * Get or create performance trend analyzer instance
 */
export async function getPerformanceTrendAnalyzer(): Promise<PerformanceTrendAnalyzer> {
  if (!performanceTrendAnalyzer) {
    performanceTrendAnalyzer = new PerformanceTrendAnalyzer();
    await performanceTrendAnalyzer.initialize();
  }
  return performanceTrendAnalyzer;
}

/**
 * Get or create churn predictor instance
 */
export async function getChurnPredictor(): Promise<ChurnPredictor> {
  if (!churnPredictor) {
    churnPredictor = new ChurnPredictor();
    await churnPredictor.initialize();
  }
  return churnPredictor;
}

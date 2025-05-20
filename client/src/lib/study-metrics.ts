import { StudyArea } from '@/hooks/useStudyProgress';
import { formatPercent } from './utils';

/**
 * Core study metrics interface
 */
interface StudyMetrics {
  overallProgress: number;
  studyTime: number;
  questionsAttempted: number;
  correctRate: number;
  areasOfFocus: string[];
  strongAreas: string[];
  studyStreak: number;
  consistency: number;
  topicDistribution: TopicDistribution[];
  estimatedExamReadiness: number;
  recentImprovementRate: number;
  recommendedFocusAreas: RecommendedFocusArea[];
  spaceRepetitionProgress: number;
}

/**
 * Topic distribution interface
 */
interface TopicDistribution {
  topic: string;
  percentage: number;
  questionsAttempted: number;
  correctRate: number;
}

/**
 * Recommended focus area interface
 */
interface RecommendedFocusArea {
  area: string;
  priority: number; // 1-5 scale
  reason: string;
  suggestedAction: string;
}

/**
 * Helper function to format area names for display
 */
function formatAreaName(area: string): string {
  // Special cases for common nursing specialties
  const specialCases: Record<string, string> = {
    'med-surg': 'Medical-Surgical',
    'ob': 'Obstetrics',
    'peds': 'Pediatrics',
    'psych': 'Psychiatric',
    'pharm': 'Pharmacology',
    'fundamentals': 'Fundamentals',
    'cardio': 'Cardiovascular',
    'resp': 'Respiratory',
    'neuro': 'Neurological',
    'endo': 'Endocrine',
    'gi': 'Gastrointestinal',
    'gu': 'Genitourinary',
    'onc': 'Oncology'
  };
  
  // Return special case if it exists
  if (area.toLowerCase() in specialCases) {
    return specialCases[area.toLowerCase()];
  }
  
  // General case: capitalize first letter of each word
  return area
    .split(/[\s-]+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Estimates exam readiness based on confidence levels, correct rates, and question coverage
 */
function calculateExamReadiness(
  studyAreas: Record<string, StudyArea>,
  totalQuestionsAttempted: number,
  correctRate: number
): number {
  // NCLEX exam has proportional content for different areas
  // These weights represent the importance of each area in the exam
  const areaWeights: Record<string, number> = {
    'med-surg': 0.40,
    'fundamentals': 0.15,
    'pharmacology': 0.15,
    'psychiatric': 0.10,
    'obstetrics': 0.10,
    'pediatrics': 0.10
  };
  
  // Default weight for areas not specifically listed
  const defaultWeight = 0.05;
  
  // Calculate weighted confidence
  let weightedConfidence = 0;
  let totalWeight = 0;
  
  Object.entries(studyAreas).forEach(([area, data]) => {
    const normalizedArea = area.toLowerCase();
    const weight = areaWeights[normalizedArea] || defaultWeight;
    weightedConfidence += (data.confidenceLevel / 3) * weight; // Normalize to 0-1 scale
    totalWeight += weight;
  });
  
  // Normalize weighted confidence to account for missing areas
  const normalizedConfidence = totalWeight > 0 ? weightedConfidence / totalWeight : 0;
  
  // Question volume factor (assuming ideally 1000+ questions for full preparation)
  const questionVolumeFactor = Math.min(totalQuestionsAttempted / 1000, 1);
  
  // Correct rate factor (assuming 65% is passing threshold for NCLEX)
  const correctRateFactor = Math.max(0, (correctRate - 50) / 35); // Scale from 50-85% to 0-1
  
  // Calculate overall readiness
  // Weight the factors: confidence (50%), correct rate (30%), question volume (20%)
  const readiness = (normalizedConfidence * 0.5) + 
                   (correctRateFactor * 0.3) + 
                   (questionVolumeFactor * 0.2);
  
  // Return as percentage
  return Math.min(Math.round(readiness * 100), 100);
}

/**
 * Calculates improvement rate based on recent performance compared to overall
 */
function calculateImprovementRate(
  studyAreas: Record<string, StudyArea>,
  overallCorrectRate: number
): number {
  // Calculate correct rate for most recent 20% of questions
  const recentQuestionsThreshold = 20; // Consider last 20 questions per area as "recent"
  
  let recentCorrect = 0;
  let recentTotal = 0;
  
  Object.values(studyAreas).forEach(area => {
    if (area.recentActivity && area.recentActivity.totalAnswered > 0) {
      // Get the most recent performance data
      const recentQs = Math.min(area.recentActivity.totalAnswered, recentQuestionsThreshold);
      const recentCorrectRatio = area.recentActivity.correct / area.recentActivity.totalAnswered;
      
      recentCorrect += recentCorrectRatio * recentQs;
      recentTotal += recentQs;
    }
  });
  
  // Calculate recent correct rate
  const recentCorrectRate = recentTotal > 0 ? (recentCorrect / recentTotal) * 100 : 0;
  
  // Calculate improvement as percentage change
  const improvementRate = overallCorrectRate > 0 ? 
    ((recentCorrectRate - overallCorrectRate) / overallCorrectRate) * 100 : 0;
  
  return Math.round(improvementRate);
}

/**
 * Identifies recommended focus areas based on performance and exam importance
 */
function getRecommendedFocusAreas(
  studyAreas: Record<string, StudyArea>
): RecommendedFocusArea[] {
  const priorityAreas: RecommendedFocusArea[] = [];
  
  // Core NCLEX areas that should be emphasized
  const coreNclexAreas = [
    'med-surg', 'fundamentals', 'pharmacology', 
    'psychiatric', 'obstetrics', 'pediatrics'
  ];
  
  // Analyze each study area
  Object.entries(studyAreas).forEach(([area, data]) => {
    const normalizedArea = area.toLowerCase();
    const displayName = formatAreaName(area);
    
    // Calculate priority level (1-5 scale, 5 being highest priority)
    let priority = 3; // Default medium priority
    
    // Lower confidence increases priority
    if (data.confidenceLevel === 1) priority += 2;
    else if (data.confidenceLevel === 2) priority += 1;
    
    // Core NCLEX areas get higher priority
    if (coreNclexAreas.includes(normalizedArea)) priority += 1;
    
    // Low correct rate increases priority
    const correctRate = 
      data.recentActivity && data.recentActivity.totalAnswered > 0 ? 
      (data.recentActivity.correct / data.recentActivity.totalAnswered) * 100 : 50;
    
    if (correctRate < 60) priority += 1;
    
    // Cap priority at 5
    priority = Math.min(priority, 5);
    
    // Generate reason based on data
    let reason = 'Balanced study recommended';
    if (data.confidenceLevel === 1) {
      reason = 'Low confidence area';
    } else if (correctRate < 60) {
      reason = 'Low correct answer rate';
    } else if (data.recentActivity && data.recentActivity.totalAnswered < 20) {
      reason = 'Insufficient practice questions';
    }
    
    // Generate suggested action
    let suggestedAction = 'Increase practice questions';
    if (data.confidenceLevel === 1) {
      suggestedAction = 'Review core content and complete practice questions';
    } else if (correctRate < 60) {
      suggestedAction = 'Study answer rationales and review related concepts';
    } else if (priority >= 4) {
      suggestedAction = 'Focus on test-taking strategies for this content area';
    }
    
    // Only add areas with priority 3 or higher
    if (priority >= 3) {
      priorityAreas.push({
        area: displayName,
        priority,
        reason,
        suggestedAction
      });
    }
  });
  
  // Sort by priority (highest first) and return top 3
  return priorityAreas
    .sort((a, b) => b.priority - a.priority)
    .slice(0, 3);
}

/**
 * Calculate spaced repetition progress 
 * This estimates how effectively the user is using spaced repetition principles
 */
function calculateSpacedRepetitionProgress(
  studyAreas: Record<string, StudyArea>
): number {
  // If no areas have last updated dates, return 0
  const areasWithTimestamps = Object.values(studyAreas)
    .filter(area => area.lastUpdated)
    .length;
    
  if (areasWithTimestamps === 0) return 0;
  
  // Calculate distribution of study across areas
  const totalAreas = Object.keys(studyAreas).length;
  const coveredAreas = Object.values(studyAreas)
    .filter(area => area.recentActivity && area.recentActivity.totalAnswered > 0)
    .length;
    
  const areaCoverageScore = totalAreas > 0 ? (coveredAreas / totalAreas) * 100 : 0;
  
  // Calculate time distribution (over last 7 days ideally)
  const now = new Date();
  const millisecondsPerDay = 24 * 60 * 60 * 1000;
  const daysToCheck = 7;
  
  // Count distribution of study sessions across days
  const daysWithActivity = new Set();
  Object.values(studyAreas).forEach(area => {
    if (area.lastUpdated) {
      const lastUpdated = new Date(area.lastUpdated);
      const daysSinceUpdate = Math.floor((now.getTime() - lastUpdated.getTime()) / millisecondsPerDay);
      
      if (daysSinceUpdate < daysToCheck) {
        daysWithActivity.add(Math.floor(daysSinceUpdate));
      }
    }
  });
  
  const timeDistributionScore = (daysWithActivity.size / daysToCheck) * 100;
  
  // Combine scores with weights
  const spacedRepetitionScore = (areaCoverageScore * 0.6) + (timeDistributionScore * 0.4);
  
  return Math.round(spacedRepetitionScore);
}

/**
 * Calculates study metrics based on user's study progress with enhanced analytics
 * 
 * @param studyAreas Map of study areas with their progress data
 * @param lastActivity Date or ISO string representing the time of the last activity
 * @returns Comprehensive study metrics for analytics and recommendations
 */
export function calculateStudyMetrics(
  studyAreas: Record<string, StudyArea>,
  lastActivity: Date | string
): StudyMetrics {
  // Safety check for empty data
  if (!studyAreas || Object.keys(studyAreas).length === 0) {
    return {
      overallProgress: 0,
      studyTime: 0,
      questionsAttempted: 0,
      correctRate: 0,
      areasOfFocus: [],
      strongAreas: [],
      studyStreak: 0,
      consistency: 0,
      topicDistribution: [],
      estimatedExamReadiness: 0,
      recentImprovementRate: 0,
      recommendedFocusAreas: [],
      spaceRepetitionProgress: 0
    };
  }
  
  // Calculate total questions attempted and correct based on recentActivity
  const totalAttempted = Object.values(studyAreas).reduce(
    (sum, area) => sum + (area.recentActivity?.totalAnswered || 0), 0
  );
  
  const totalCorrect = Object.values(studyAreas).reduce(
    (sum, area) => sum + (area.recentActivity?.correct || 0), 0
  );
  
  // Calculate overall confidence (weighted by areas)
  const totalConfidence = Object.values(studyAreas).reduce(
    (sum, area) => sum + area.confidenceLevel, 0
  );
  
  const areaCount = Object.keys(studyAreas).length || 1; // Avoid division by zero
  const averageConfidence = totalConfidence / areaCount;
  
  // Calculate time since last activity
  const lastActivityDate = typeof lastActivity === 'string' ? new Date(lastActivity) : lastActivity;
  const now = new Date();
  const timeSinceActivity = Math.floor((now.getTime() - lastActivityDate.getTime()) / (1000 * 60 * 60)); // hours
  
  // Identify focus areas (low confidence) and strong areas (high confidence)
  const focusAreas = Object.entries(studyAreas)
    .filter(([_, area]) => area.confidenceLevel === 1)
    .map(([name, _]) => formatAreaName(name));
  
  const strongAreas = Object.entries(studyAreas)
    .filter(([_, area]) => area.confidenceLevel === 3)
    .map(([name, _]) => formatAreaName(name));
  
  // Calculate correct rate
  const correctRate = totalAttempted > 0 ? (totalCorrect / totalAttempted) * 100 : 0;
  
  // Calculate overall progress (based on confidence levels and questions attempted)
  // Max confidence across all areas would be 3 * areaCount
  // Max questions attempted arbitrarily set to 100 per area
  const confidenceProgress = (totalConfidence / (3 * areaCount)) * 100;
  const questionProgress = Math.min(totalAttempted / (100 * areaCount) * 100, 100);
  
  // Weight confidence more heavily than raw question count
  const overallProgress = (confidenceProgress * 0.7) + (questionProgress * 0.3);
  
  // Calculate topic distribution
  const topicDistribution: TopicDistribution[] = Object.entries(studyAreas)
    .filter(([_, area]) => area.recentActivity && area.recentActivity.totalAnswered > 0)
    .map(([name, area]) => {
      const areaAttempted = area.recentActivity?.totalAnswered || 0;
      const areaCorrect = area.recentActivity?.correct || 0;
      const areaCorrectRate = areaAttempted > 0 ? (areaCorrect / areaAttempted) * 100 : 0;
      
      return {
        topic: formatAreaName(name),
        percentage: totalAttempted > 0 ? (areaAttempted / totalAttempted) * 100 : 0,
        questionsAttempted: areaAttempted,
        correctRate: Math.round(areaCorrectRate)
      };
    })
    .sort((a, b) => b.percentage - a.percentage);
  
  // Calculate streak and consistency
  const studyStreak = 1; // For now just a placeholder, would need daily history data
  const consistency = 50; // For now just a placeholder, would need daily history data
  
  // Calculate estimated exam readiness
  const estimatedExamReadiness = calculateExamReadiness(
    studyAreas, 
    totalAttempted, 
    correctRate
  );
  
  // Calculate improvement rate
  const recentImprovementRate = calculateImprovementRate(
    studyAreas,
    correctRate
  );
  
  // Get recommended focus areas
  const recommendedFocusAreas = getRecommendedFocusAreas(studyAreas);
  
  // Calculate spaced repetition progress
  const spaceRepetitionProgress = calculateSpacedRepetitionProgress(studyAreas);
  
  return {
    overallProgress: Math.min(Math.round(overallProgress), 100),
    studyTime: timeSinceActivity,
    questionsAttempted: totalAttempted,
    correctRate: Math.round(correctRate),
    areasOfFocus: focusAreas,
    strongAreas: strongAreas,
    studyStreak,
    consistency,
    topicDistribution,
    estimatedExamReadiness,
    recentImprovementRate,
    recommendedFocusAreas,
    spaceRepetitionProgress
  };
}
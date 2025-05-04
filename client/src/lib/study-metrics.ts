import { StudyArea } from '@/hooks/useStudyProgress';

interface StudyMetrics {
  overallProgress: number;
  studyTime: number;
  questionsAttempted: number;
  correctRate: number;
  areasOfFocus: string[];
  strongAreas: string[];
}

/**
 * Calculates study metrics based on user's study progress.
 * 
 * @param studyAreas Map of study areas with their progress data
 * @param lastActivity ISO string representing the time of the last activity
 * @returns Study metrics including overall progress, time stats, and areas of focus
 */
export function calculateStudyMetrics(
  studyAreas: Record<string, StudyArea>,
  lastActivity: Date | string
): StudyMetrics {
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
  
  return {
    overallProgress: Math.min(Math.round(overallProgress), 100),
    studyTime: timeSinceActivity,
    questionsAttempted: totalAttempted,
    correctRate: Math.round(correctRate),
    areasOfFocus: focusAreas,
    strongAreas: strongAreas
  };
}
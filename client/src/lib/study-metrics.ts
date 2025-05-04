interface StudyArea {
  name: string;
  confidenceLevel: number;
  questionsAttempted: number;
  questionsCorrect: number;
  recommendedFocus: boolean;
}

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
  lastActivity: string
): StudyMetrics {
  // Calculate total questions attempted and correct
  const totalAttempted = Object.values(studyAreas).reduce(
    (sum, area) => sum + area.questionsAttempted, 0
  );
  
  const totalCorrect = Object.values(studyAreas).reduce(
    (sum, area) => sum + area.questionsCorrect, 0
  );
  
  // Calculate overall confidence (weighted by areas)
  const totalConfidence = Object.values(studyAreas).reduce(
    (sum, area) => sum + area.confidenceLevel, 0
  );
  
  const areaCount = Object.keys(studyAreas).length || 1; // Avoid division by zero
  const averageConfidence = totalConfidence / areaCount;
  
  // Calculate time since last activity
  const lastActivityDate = new Date(lastActivity);
  const now = new Date();
  const timeSinceActivity = Math.floor((now.getTime() - lastActivityDate.getTime()) / (1000 * 60 * 60)); // hours
  
  // Identify focus areas (low confidence) and strong areas (high confidence)
  const focusAreas = Object.values(studyAreas)
    .filter(area => area.confidenceLevel === 1)
    .map(area => area.name);
  
  const strongAreas = Object.values(studyAreas)
    .filter(area => area.confidenceLevel === 3)
    .map(area => area.name);
  
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
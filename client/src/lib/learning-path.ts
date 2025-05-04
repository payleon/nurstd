// Types for Learning Path

export type LearningStyle = 'visual' | 'auditory' | 'reading' | 'kinesthetic';
export type TimeCommitment = 'minimal' | 'moderate' | 'intensive';
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';
export type ResourceType = 'video' | 'article' | 'quiz' | 'interactive' | 'flashcard' | 'practice';

// Study areas for nursing
export type StudyArea = 
  | 'med-surg' 
  | 'pediatrics' 
  | 'obstetrics' 
  | 'psych' 
  | 'pharmacology' 
  | 'fundamentals'
  | 'critical-care'
  | 'emergency'
  | 'community-health'
  | 'leadership'
  | 'ethics'
  | 'pathophysiology';

// User preferences for learning path generation
export interface LearningPathPreferences {
  learningStyle: LearningStyle;
  timeCommitment: TimeCommitment;
  strengthAreas: StudyArea[];
  weaknessAreas: StudyArea[];
  daysUntilExam: number;
  difficultyLevel: DifficultyLevel;
  title: string;
  description?: string;
  focusAreas: StudyArea[];
  additionalNotes?: string;
}

// A learning activity node in the path
export interface LearningPathNode {
  id: string;
  title: string;
  description: string;
  resourceType: ResourceType;
  url?: string;
  estimatedTime: number; // in minutes
  difficulty: DifficultyLevel;
  completed: boolean;
  requiredForCompletion: boolean;
}

// A section within a learning path
export interface LearningPathSection {
  id: string;
  title: string;
  description: string;
  focusArea: StudyArea;
  completed: boolean;
  nodes: LearningPathNode[];
}

// The complete learning path structure
export interface LearningPath {
  id: string;
  title: string;
  description: string;
  createdAt: string | Date;
  updatedAt: string | Date;
  learningStyle: LearningStyle;
  timeCommitment: TimeCommitment;
  difficulty: DifficultyLevel;
  focusAreas: StudyArea[];
  sections: LearningPathSection[];
  progress: number; // 0-100
}

// Response from creating a learning path
export interface CreateLearningPathResponse {
  id: string;
  title: string;
  message: string;
}
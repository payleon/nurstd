import { v4 as uuidv4 } from 'uuid';

// Learning path node representing a single resource or activity
export interface LearningPathNode {
  id: string;
  title: string;
  description: string;
  resourceType: 'video' | 'article' | 'quiz' | 'interactive' | 'flashcard' | 'practice';
  estimatedTime: number; // in minutes
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  url?: string;
  completed: boolean;
}

// Learning path section grouping related nodes
export interface LearningPathSection {
  id: string;
  title: string;
  description: string;
  nodes: LearningPathNode[];
  completed: boolean;
}

// The main learning path structure
export interface LearningPath {
  id: string;
  title: string;
  description: string;
  overview?: string;
  learningStyle: 'visual' | 'auditory' | 'reading' | 'kinesthetic';
  timeCommitment: 'minimal' | 'moderate' | 'intensive';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  focusAreas: string[];
  createdAt: string;
  updatedAt: string;
  progress: number; // Overall completion percentage (0-100)
  sections: LearningPathSection[];
}

// Helper functions for creating path components with unique IDs
export function createLearningPathNode(
  partialNode: Omit<LearningPathNode, 'id' | 'completed'>
): LearningPathNode {
  return {
    id: uuidv4(),
    completed: false,
    ...partialNode,
  };
}

export function createLearningPathSection(
  partialSection: Omit<LearningPathSection, 'id' | 'completed' | 'nodes'> & { nodes?: Partial<LearningPathNode>[] }
): LearningPathSection {
  return {
    id: uuidv4(),
    completed: false,
    nodes: partialSection.nodes?.map(node => createLearningPathNode(node as Omit<LearningPathNode, 'id' | 'completed'>)) || [],
    ...partialSection,
  };
}

export function createLearningPath(
  partialPath: Omit<LearningPath, 'id' | 'createdAt' | 'updatedAt' | 'progress' | 'sections'> & 
  { sections?: Partial<LearningPathSection>[] }
): LearningPath {
  const now = new Date().toISOString();
  
  return {
    id: uuidv4(),
    createdAt: now,
    updatedAt: now,
    progress: 0,
    sections: partialPath.sections?.map(section => 
      createLearningPathSection(section as Omit<LearningPathSection, 'id' | 'completed' | 'nodes'>)
    ) || [],
    ...partialPath,
  };
}
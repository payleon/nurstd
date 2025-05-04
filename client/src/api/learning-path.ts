import { LearningPath } from '@/lib/learning-path';

// Generate a learning path based on user preferences
export async function generateLearningPath(preferences: {
  learningStyle: 'visual' | 'auditory' | 'reading' | 'kinesthetic';
  timeCommitment: 'minimal' | 'moderate' | 'intensive';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  focusAreas: string[];
  excludedAreas?: string[];
  daysUntilExam?: number;
  weakAreas?: string[];
  strongAreas?: string[];
}): Promise<LearningPath> {
  try {
    const response = await fetch('/api/learning-path/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(preferences),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to generate learning path');
    }

    return await response.json();
  } catch (error) {
    console.error('Error generating learning path:', error);
    throw error;
  }
}

// Get all learning paths for the current user
export async function getUserLearningPaths(): Promise<LearningPath[]> {
  try {
    const response = await fetch('/api/learning-path');

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch learning paths');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching learning paths:', error);
    throw error;
  }
}

// Get a specific learning path by ID
export async function getLearningPath(id: string): Promise<LearningPath> {
  try {
    const response = await fetch(`/api/learning-path/${id}`);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch learning path');
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching learning path ${id}:`, error);
    throw error;
  }
}

// Mark a learning path node as completed
export async function markNodeAsCompleted(pathId: string, nodeId: string): Promise<void> {
  try {
    const response = await fetch(`/api/learning-path/${pathId}/complete-node/${nodeId}`, {
      method: 'POST',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to mark node as completed');
    }
  } catch (error) {
    console.error(`Error marking node ${nodeId} as completed:`, error);
    throw error;
  }
}
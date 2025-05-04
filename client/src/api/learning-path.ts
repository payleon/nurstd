import { LearningPath } from '@/lib/learning-path';

// Base API URL
const API_BASE = '/api/learning-path';

/**
 * Fetch all learning paths for the current user
 */
export async function getUserLearningPaths(): Promise<LearningPath[]> {
  try {
    const response = await fetch(API_BASE);
    
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Please log in to access your learning paths.');
      }
      throw new Error(`Failed to fetch learning paths: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching learning paths:', error);
    throw error;
  }
}

/**
 * Fetch a specific learning path by ID
 */
export async function getLearningPath(id: string): Promise<LearningPath> {
  try {
    const response = await fetch(`${API_BASE}/${id}`);
    
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Please log in to access this learning path.');
      } else if (response.status === 404) {
        throw new Error('Learning path not found.');
      }
      throw new Error(`Failed to fetch learning path: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error fetching learning path ${id}:`, error);
    throw error;
  }
}

/**
 * User preferences for generating a learning path
 */
export interface LearningPathPreferences {
  learningStyle: 'visual' | 'auditory' | 'reading' | 'kinesthetic';
  timeCommitment: 'minimal' | 'moderate' | 'intensive';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  focusAreas: string[];
  excludedAreas?: string[];
  daysUntilExam?: number;
  weakAreas?: string[];
  strongAreas?: string[];
}

/**
 * Generate a new learning path based on user preferences
 */
export async function generateLearningPath(preferences: LearningPathPreferences): Promise<LearningPath> {
  try {
    const response = await fetch(`${API_BASE}/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(preferences),
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Please log in to create a learning path.');
      } else if (response.status === 400) {
        const data = await response.json();
        throw new Error(data.message || 'Invalid preferences');
      }
      throw new Error(`Failed to generate learning path: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error generating learning path:', error);
    throw error;
  }
}

/**
 * Mark a specific node in a learning path as completed
 */
export async function completePathNode(pathId: string, nodeId: string): Promise<void> {
  try {
    const response = await fetch(`${API_BASE}/${pathId}/complete-node/${nodeId}`, {
      method: 'POST',
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Please log in to update your learning path.');
      } else if (response.status === 404) {
        throw new Error('Learning path or node not found.');
      }
      throw new Error(`Failed to mark node as completed: ${response.statusText}`);
    }
  } catch (error) {
    console.error(`Error completing node ${nodeId} in path ${pathId}:`, error);
    throw error;
  }
}
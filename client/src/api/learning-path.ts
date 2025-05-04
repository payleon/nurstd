import { apiRequest } from '@/lib/queryClient';
import { 
  LearningPath, 
  LearningPathPreferences, 
  CreateLearningPathResponse 
} from '@/lib/learning-path';

/**
 * Fetches all learning paths for the current user
 */
export async function getUserLearningPaths(): Promise<LearningPath[]> {
  const response = await apiRequest('GET', '/api/learning-paths');
  return await response.json();
}

/**
 * Fetches a specific learning path by ID
 */
export async function getLearningPath(id: string): Promise<LearningPath> {
  const response = await apiRequest('GET', `/api/learning-paths/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch learning path');
  }
  return await response.json();
}

/**
 * Creates a new personalized learning path based on user preferences
 */
export async function createLearningPath(
  preferences: LearningPathPreferences
): Promise<CreateLearningPathResponse> {
  const response = await apiRequest('POST', '/api/learning-paths', preferences);
  if (!response.ok) {
    throw new Error('Failed to create learning path');
  }
  return await response.json();
}

/**
 * Marks a learning path node as complete
 */
export async function completePathNode(
  pathId: string, 
  nodeId: string
): Promise<void> {
  const response = await apiRequest(
    'POST', 
    `/api/learning-paths/${pathId}/nodes/${nodeId}/complete`
  );
  
  if (!response.ok) {
    throw new Error('Failed to mark node as complete');
  }
}

/**
 * Deletes a learning path
 */
export async function deleteLearningPath(id: string): Promise<void> {
  const response = await apiRequest('DELETE', `/api/learning-paths/${id}`);
  if (!response.ok) {
    throw new Error('Failed to delete learning path');
  }
}
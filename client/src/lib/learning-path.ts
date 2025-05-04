import { fetchApi } from './api';

// Types for learning path preferences
export interface LearningPathPreferences {
  title: string;
  description?: string;
  learningStyle: 'visual' | 'reading' | 'auditory' | 'kinesthetic';
  timeCommitment: 'minimal' | 'moderate' | 'intensive';
  strengthAreas: string[];
  weaknessAreas: string[];
  daysUntilExam: number;
  difficultyLevel: 'beginner' | 'intermediate' | 'advanced';
  focusAreas: string[];
  additionalNotes?: string;
}

// Types for learning path data
export interface LearningPathNode {
  id: string;
  title: string;
  description: string;
  resourceType: 'video' | 'article' | 'quiz' | 'interactive' | 'flashcard' | 'practice';
  url: string;
  estimatedTime: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  completed: boolean;
  requiredForCompletion: boolean;
}

export interface LearningPathSection {
  id: string;
  title: string;
  description: string;
  focusArea: string;
  completed: boolean;
  nodes: LearningPathNode[];
}

export interface LearningPath {
  id: string;
  title: string;
  description: string;
  learningStyle: string;
  timeCommitment: string;
  difficulty: string;
  focusAreas: string[];
  sections: LearningPathSection[];
  createdAt: string;
  updatedAt: string;
  progress: number;
}

// API functions for learning paths
export async function createLearningPath(preferences: LearningPathPreferences): Promise<LearningPath> {
  try {
    const response = await fetchApi('/api/learning-paths', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(preferences)
    });

    if (!response.ok) {
      throw new Error(`Failed to create learning path: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating learning path:', error);
    throw error;
  }
}

export async function getLearningPath(id: string): Promise<LearningPath> {
  try {
    const response = await fetchApi(`/api/learning-paths/${id}`);

    if (!response.ok) {
      throw new Error(`Failed to get learning path: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching learning path:', error);
    throw error;
  }
}

export async function getAllLearningPaths(): Promise<LearningPath[]> {
  try {
    const response = await fetchApi('/api/learning-paths');

    if (!response.ok) {
      throw new Error(`Failed to get learning paths: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching learning paths:', error);
    throw error;
  }
}

export async function updateLearningPathProgress(
  id: string, 
  updates: Partial<LearningPath>
): Promise<LearningPath> {
  try {
    const response = await fetchApi(`/api/learning-paths/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updates)
    });

    if (!response.ok) {
      throw new Error(`Failed to update learning path: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating learning path:', error);
    throw error;
  }
}

export async function deleteLearningPath(id: string): Promise<void> {
  try {
    const response = await fetchApi(`/api/learning-paths/${id}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      throw new Error(`Failed to delete learning path: ${response.status} ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error deleting learning path:', error);
    throw error;
  }
}

// Helper function to calculate progress
export function calculateLearningPathProgress(path: LearningPath): number {
  if (!path.sections || path.sections.length === 0) {
    return 0;
  }

  let totalNodes = 0;
  let completedNodes = 0;

  for (const section of path.sections) {
    for (const node of section.nodes) {
      if (node.requiredForCompletion) {
        totalNodes++;
        if (node.completed) {
          completedNodes++;
        }
      }
    }
  }

  if (totalNodes === 0) {
    return 0;
  }

  return Math.round((completedNodes / totalNodes) * 100);
}

// Function to check if a section is completed
export function isSectionCompleted(section: LearningPathSection): boolean {
  if (!section.nodes || section.nodes.length === 0) {
    return false;
  }

  const requiredNodes = section.nodes.filter(node => node.requiredForCompletion);
  
  if (requiredNodes.length === 0) {
    return false;
  }

  return requiredNodes.every(node => node.completed);
}

// Function to toggle node completion
export function toggleNodeCompletion(
  path: LearningPath, 
  sectionId: string, 
  nodeId: string
): LearningPath {
  // Create a deep copy of the path
  const updatedPath = JSON.parse(JSON.stringify(path)) as LearningPath;

  // Find the section
  const sectionIndex = updatedPath.sections.findIndex(s => s.id === sectionId);
  if (sectionIndex === -1) {
    return path;
  }

  // Find the node
  const nodeIndex = updatedPath.sections[sectionIndex].nodes.findIndex(n => n.id === nodeId);
  if (nodeIndex === -1) {
    return path;
  }

  // Toggle completion
  const node = updatedPath.sections[sectionIndex].nodes[nodeIndex];
  node.completed = !node.completed;

  // Update section completion
  updatedPath.sections[sectionIndex].completed = isSectionCompleted(updatedPath.sections[sectionIndex]);

  // Update overall progress
  updatedPath.progress = calculateLearningPathProgress(updatedPath);

  return updatedPath;
}
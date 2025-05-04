import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { LearningPathPreferences } from '../../client/src/lib/learning-path';
import { generateGeminiLearningPath } from './gemini';

// Store learning paths in memory
const learningPaths = new Map<string, any>();

/**
 * Creates a learning path based on user preferences
 */
export async function createLearningPath(req: Request, res: Response) {
  try {
    // Extract preferences from request body
    const preferences = req.body as LearningPathPreferences;
    
    // Generate a learning path using Gemini
    const learningPath = await generateGeminiLearningPath(preferences);
    
    // Store the learning path in memory
    learningPaths.set(learningPath.id, learningPath);
    
    // Return the created learning path
    res.status(201).json(learningPath);
  } catch (error) {
    console.error('Error creating learning path:', error);
    res.status(500).json({ error: 'Failed to create learning path' });
  }
}

/**
 * Gets a learning path by ID
 */
export function getLearningPath(req: Request, res: Response) {
  const pathId = req.params.id;
  
  // Check if path exists
  if (!learningPaths.has(pathId)) {
    return res.status(404).json({ error: 'Learning path not found' });
  }
  
  // Return the learning path
  res.json(learningPaths.get(pathId));
}

/**
 * Updates a learning path (for progress tracking)
 */
export function updateLearningPath(req: Request, res: Response) {
  const pathId = req.params.id;
  const updates = req.body;
  
  // Check if path exists
  if (!learningPaths.has(pathId)) {
    return res.status(404).json({ error: 'Learning path not found' });
  }
  
  // Get the current path
  const currentPath = learningPaths.get(pathId);
  
  // Update the learning path
  const updatedPath = {
    ...currentPath,
    ...updates,
    updatedAt: new Date().toISOString()
  };
  
  // Save the updated path
  learningPaths.set(pathId, updatedPath);
  
  // Return the updated path
  res.json(updatedPath);
}

/**
 * Gets all learning paths (for listing)
 */
export function getAllLearningPaths(req: Request, res: Response) {
  // Convert the Map to an array
  const paths = Array.from(learningPaths.values());
  
  // Return the paths
  res.json(paths);
}

/**
 * Deletes a learning path
 */
export function deleteLearningPath(req: Request, res: Response) {
  const pathId = req.params.id;
  
  // Check if path exists
  if (!learningPaths.has(pathId)) {
    return res.status(404).json({ error: 'Learning path not found' });
  }
  
  // Delete the path
  learningPaths.delete(pathId);
  
  // Return success
  res.status(204).send();
}

// Add some predefined learning paths for testing
function addPredefinedPaths() {
  const predefinedPath = {
    id: uuidv4(),
    title: "Sample NCLEX Study Plan",
    description: "A comprehensive study plan for NCLEX preparation focusing on critical thinking and core nursing topics.",
    learningStyle: "visual",
    timeCommitment: "moderate",
    difficulty: "intermediate",
    focusAreas: ["med-surg", "pharmacology"],
    progress: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    sections: [
      {
        id: uuidv4(),
        title: "Medical-Surgical Nursing Fundamentals",
        description: "Core concepts in medical-surgical nursing practice.",
        focusArea: "med-surg",
        completed: false,
        nodes: [
          {
            id: uuidv4(),
            title: "Fluid and Electrolyte Balance",
            description: "Understanding fluid and electrolyte imbalances and their management in patient care.",
            resourceType: "article",
            url: "https://nurseslabs.com/fluid-and-electrolytes-imbalances/",
            estimatedTime: 30,
            difficulty: "intermediate",
            completed: false,
            requiredForCompletion: true
          },
          {
            id: uuidv4(),
            title: "Respiratory Assessment",
            description: "Comprehensive review of respiratory assessment techniques and findings interpretation.",
            resourceType: "quiz",
            url: "https://nurseslabs.com/respiratory-system-disorders-nclex-practice-quiz-2-50-items/",
            estimatedTime: 25,
            difficulty: "intermediate",
            completed: false,
            requiredForCompletion: true
          }
        ]
      },
      {
        id: uuidv4(),
        title: "Pharmacology Essentials",
        description: "Key pharmacological concepts for safe medication administration.",
        focusArea: "pharmacology",
        completed: false,
        nodes: [
          {
            id: uuidv4(),
            title: "Medication Administration Guidelines",
            description: "Best practices for safe medication administration in various clinical settings.",
            resourceType: "article",
            url: "https://nurseslabs.com/medication-administration/",
            estimatedTime: 40,
            difficulty: "intermediate",
            completed: false,
            requiredForCompletion: true
          },
          {
            id: uuidv4(),
            title: "IV Medication Administration",
            description: "Step-by-step guide to safe IV medication preparation and administration.",
            resourceType: "video",
            url: "https://www.youtube.com/watch?v=kRRY9QQm51c",
            estimatedTime: 25,
            difficulty: "intermediate",
            completed: false,
            requiredForCompletion: true
          }
        ]
      }
    ]
  };
  
  learningPaths.set(predefinedPath.id, predefinedPath);
  console.log('Added predefined learning path with ID:', predefinedPath.id);
}

// Initialize with predefined paths
addPredefinedPaths();
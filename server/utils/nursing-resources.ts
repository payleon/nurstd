import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current file path in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the StudyArea type
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

// Define the structure of a nursing resource
export interface NursingResource {
  title: string;
  url: string;
  resourceType: 'article' | 'video' | 'quiz' | 'interactive' | 'flashcard' | 'practice';
  description: string;
  estimatedTime: number;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
}

// Define the structure of the resources by category
export interface NursingResourcesByCategory {
  [key: string]: NursingResource[];
}

// Load the nursing resources from the JSON file
// Determine if we're in production (built) environment or development
const isDevelopment = process.env.NODE_ENV === 'development';
const resourcesFilePath = isDevelopment 
  ? path.join(__dirname, 'nursing_resources.json')
  : path.join(process.cwd(), 'dist', 'utils', 'nursing_resources.json');

console.log(`Loading nursing resources from: ${resourcesFilePath}`);
let nursingResources: NursingResourcesByCategory;

try {
  const resourcesData = fs.readFileSync(resourcesFilePath, 'utf8');
  nursingResources = JSON.parse(resourcesData);
  console.log('Nursing resources loaded successfully');
} catch (error) {
  console.error('Error loading nursing resources:', error);
  // Fallback to empty resources if file can't be read
  nursingResources = {};
}

/**
 * Get nursing resources for specific categories
 * @param categories Array of nursing study areas
 * @param count Number of resources to return per category
 * @returns Object with resources grouped by category
 */
export function getResourcesForCategories(
  categories: StudyArea[],
  count: number = 3
): NursingResourcesByCategory {
  const result: NursingResourcesByCategory = {};
  
  for (const category of categories) {
    if (nursingResources[category]) {
      // Get random subset of resources for this category
      const categoryResources = nursingResources[category];
      const selectedResources = categoryResources
        .sort(() => 0.5 - Math.random()) // Shuffle array
        .slice(0, count); // Take first 'count' elements
        
      result[category] = selectedResources;
    }
  }
  
  return result;
}

/**
 * Get resources for a learning path based on focus areas and preferences
 * @param focusAreas Primary focus areas for the learning path
 * @param learningStyle Preferred learning style
 * @param difficulty Difficulty level
 * @returns Array of resources suited for the learning path
 */
export function getResourcesForLearningPath(
  focusAreas: StudyArea[],
  learningStyle: string,
  difficulty: string
): NursingResource[] {
  const allResources: NursingResource[] = [];
  
  // Get more resources for primary focus areas
  const primaryResources = getResourcesForCategories(focusAreas, 4);
  
  for (const category in primaryResources) {
    const resources = primaryResources[category];
    
    // Add difficulty level based on the requested difficulty
    const resourcesWithDifficulty = resources.map(resource => ({
      ...resource,
      difficulty: difficulty as 'beginner' | 'intermediate' | 'advanced'
    }));
    
    allResources.push(...resourcesWithDifficulty);
  }
  
  // Prioritize resources based on learning style
  return allResources.sort((a, b) => {
    // Prioritize based on learning style
    if (learningStyle === 'visual' && a.resourceType === 'video') return -1;
    if (learningStyle === 'visual' && b.resourceType === 'video') return 1;
    
    if (learningStyle === 'reading' && a.resourceType === 'article') return -1;
    if (learningStyle === 'reading' && b.resourceType === 'article') return 1;
    
    if (learningStyle === 'kinesthetic' && a.resourceType === 'interactive') return -1;
    if (learningStyle === 'kinesthetic' && b.resourceType === 'interactive') return 1;
    
    return 0;
  });
}

export default {
  getResourcesForCategories,
  getResourcesForLearningPath
};
import { Router, Request, Response } from 'express';
import { generateGeminiLearningPath } from './gemini';
import { db } from '../db';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

// In-memory storage for learning paths (temporary until database implementation)
const learningPathsStorage = new Map<string, any>();

// Get all learning paths for the current user
router.get('/learning-paths', async (req: Request, res: Response) => {
  try {
    // For development purposes, allow unauthenticated requests
    // TODO: Once authentication is fully implemented, uncomment the below check
    // if (!req.user) {
    //   return res.status(401).json({ message: 'Authentication required' });
    // }

    // TODO: Replace with actual database query
    // For now, return mock data for testing
    const learningPaths = [
      {
        id: '1',
        title: 'Pediatric Nursing Essentials',
        description: 'A comprehensive learning path covering essential pediatric nursing concepts and patient care.',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        learningStyle: 'visual',
        timeCommitment: 'moderate',
        difficulty: 'intermediate',
        focusAreas: ['pediatrics', 'pharmacology'],
        progress: 25,
        sections: []
      },
      {
        id: '2',
        title: 'Critical Care Foundations',
        description: 'Build a strong foundation in critical care nursing with this structured learning path.',
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString(),
        learningStyle: 'reading',
        timeCommitment: 'intensive',
        difficulty: 'advanced',
        focusAreas: ['critical-care', 'med-surg', 'pharmacology'],
        progress: 40,
        sections: []
      }
    ];

    res.status(200).json(learningPaths);
  } catch (error) {
    console.error('Error fetching learning paths:', error);
    res.status(500).json({ message: 'Failed to fetch learning paths' });
  }
});

// Get a specific learning path by ID
router.get('/learning-paths/:id', async (req: Request, res: Response) => {
  try {
    // For development purposes, allow unauthenticated requests
    // TODO: Once authentication is fully implemented, uncomment the below check
    // if (!req.user) {
    //   return res.status(401).json({ message: 'Authentication required' });
    // }

    const pathId = req.params.id;

    // First check if the path is in our in-memory storage
    if (learningPathsStorage.has(pathId)) {
      console.log(`Retrieving learning path with ID: ${pathId} from storage`);
      return res.status(200).json(learningPathsStorage.get(pathId));
    }

    // If not in memory, check our mock data examples
    if (pathId === '1') {
      res.status(200).json({
        id: '1',
        title: 'Pediatric Nursing Essentials',
        description: 'A comprehensive learning path covering essential pediatric nursing concepts and patient care.',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        learningStyle: 'visual',
        timeCommitment: 'moderate',
        difficulty: 'intermediate',
        focusAreas: ['pediatrics', 'pharmacology'],
        progress: 25,
        sections: [
          {
            id: 's1',
            title: 'Pediatric Development',
            description: 'Understanding normal growth and development in children',
            focusArea: 'pediatrics',
            completed: false,
            nodes: [
              {
                id: 'n1',
                title: 'Infant Growth Milestones',
                description: 'Learn about normal growth milestones for infants 0-12 months',
                resourceType: 'video',
                url: 'https://example.com/pediatric-videos/infant-growth',
                estimatedTime: 25,
                difficulty: 'beginner',
                completed: true,
                requiredForCompletion: true
              },
              {
                id: 'n2',
                title: 'Toddler and Preschooler Development',
                description: 'Understanding developmental milestones for ages 1-5',
                resourceType: 'article',
                url: 'https://example.com/pediatric-articles/toddler-development',
                estimatedTime: 40,
                difficulty: 'beginner',
                completed: true,
                requiredForCompletion: true
              },
              {
                id: 'n3',
                title: 'School-Age Child Development Quiz',
                description: 'Test your knowledge of school-age developmental milestones',
                resourceType: 'quiz',
                url: 'https://example.com/pediatric-quizzes/school-age',
                estimatedTime: 20,
                difficulty: 'intermediate',
                completed: false,
                requiredForCompletion: true
              }
            ]
          },
          {
            id: 's2',
            title: 'Pediatric Medication Administration',
            description: 'Safe medication practices for pediatric patients',
            focusArea: 'pharmacology',
            completed: false,
            nodes: [
              {
                id: 'n4',
                title: 'Pediatric Dosage Calculations',
                description: 'Learn how to calculate pediatric medication dosages based on weight',
                resourceType: 'interactive',
                url: 'https://example.com/pediatric-interactive/dosage-calc',
                estimatedTime: 60,
                difficulty: 'intermediate',
                completed: false,
                requiredForCompletion: true
              },
              {
                id: 'n5',
                title: 'Common Pediatric Medications',
                description: 'Review common medications used in pediatric care',
                resourceType: 'flashcard',
                url: 'https://example.com/pediatric-flashcards/medications',
                estimatedTime: 45,
                difficulty: 'intermediate',
                completed: false,
                requiredForCompletion: true
              }
            ]
          }
        ]
      });
    } else if (pathId === '2') {
      res.status(200).json({
        id: '2',
        title: 'Critical Care Foundations',
        description: 'Build a strong foundation in critical care nursing with this structured learning path.',
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString(),
        learningStyle: 'reading',
        timeCommitment: 'intensive',
        difficulty: 'advanced',
        focusAreas: ['critical-care', 'med-surg', 'pharmacology'],
        progress: 40,
        sections: [
          {
            id: 's1',
            title: 'Hemodynamic Monitoring',
            description: 'Understanding hemodynamic principles and monitoring techniques',
            focusArea: 'critical-care',
            completed: true,
            nodes: [
              {
                id: 'n1',
                title: 'Arterial Line Management',
                description: 'Learn about arterial line insertion, monitoring, and troubleshooting',
                resourceType: 'video',
                url: 'https://example.com/critical-care/arterial-lines',
                estimatedTime: 45,
                difficulty: 'intermediate',
                completed: true,
                requiredForCompletion: true
              },
              {
                id: 'n2',
                title: 'Central Venous Pressure Monitoring',
                description: 'Understanding CVP monitoring and interpretation',
                resourceType: 'article',
                url: 'https://example.com/critical-care/cvp-monitoring',
                estimatedTime: 30,
                difficulty: 'advanced',
                completed: true,
                requiredForCompletion: true
              }
            ]
          },
          {
            id: 's2',
            title: 'Mechanical Ventilation',
            description: 'Principles and management of mechanical ventilation',
            focusArea: 'critical-care',
            completed: false,
            nodes: [
              {
                id: 'n3',
                title: 'Ventilator Modes and Settings',
                description: 'Learn about different ventilator modes and appropriate settings',
                resourceType: 'interactive',
                url: 'https://example.com/critical-care/ventilator-modes',
                estimatedTime: 60,
                difficulty: 'advanced',
                completed: true,
                requiredForCompletion: true
              },
              {
                id: 'n4',
                title: 'Ventilator Waveform Interpretation',
                description: 'How to interpret ventilator waveforms and troubleshoot issues',
                resourceType: 'practice',
                url: 'https://example.com/critical-care/waveform-interpretation',
                estimatedTime: 90,
                difficulty: 'advanced',
                completed: false,
                requiredForCompletion: true
              },
              {
                id: 'n5',
                title: 'Ventilator Alarms and Troubleshooting',
                description: 'Common ventilator alarms and how to address them',
                resourceType: 'quiz',
                url: 'https://example.com/critical-care/ventilator-alarms',
                estimatedTime: 30,
                difficulty: 'intermediate',
                completed: false,
                requiredForCompletion: true
              }
            ]
          }
        ]
      });
    } else {
      res.status(404).json({ message: 'Learning path not found' });
    }
  } catch (error) {
    console.error('Error fetching learning path:', error);
    res.status(500).json({ message: 'Failed to fetch learning path' });
  }
});

// Create a new learning path
router.post('/learning-paths', async (req: Request, res: Response) => {
  try {
    const preferences = req.body;
    
    // Generate learning path using Gemini AI
    const learningPath = await generateGeminiLearningPath(preferences);
    
    // Store the learning path in memory (temporary solution)
    // In a production app, this would be saved to a database
    const id = learningPath.id || uuidv4();
    learningPath.id = id;
    learningPathsStorage.set(id, learningPath);
    
    console.log(`Created learning path with ID: ${id}`);
    
    // Return the full learning path with ID
    res.status(201).json({
      id: id,
      ...learningPath
    });
  } catch (error) {
    console.error('Error creating learning path:', error);
    res.status(500).json({ message: 'Failed to create learning path' });
  }
});

// Mark a learning path node as complete
router.post('/learning-paths/:pathId/nodes/:nodeId/complete', async (req: Request, res: Response) => {
  try {
    const { pathId, nodeId } = req.params;
    
    // TODO: Update the node completion status in the database
    
    res.status(200).json({ message: 'Node marked as complete' });
  } catch (error) {
    console.error('Error marking node as complete:', error);
    res.status(500).json({ message: 'Failed to mark node as complete' });
  }
});

// Delete a learning path
router.delete('/learning-paths/:id', async (req: Request, res: Response) => {
  try {
    const pathId = req.params.id;
    
    // TODO: Delete the learning path from the database
    
    res.status(200).json({ message: 'Learning path deleted successfully' });
  } catch (error) {
    console.error('Error deleting learning path:', error);
    res.status(500).json({ message: 'Failed to delete learning path' });
  }
});

export default router;
import { Router } from 'express';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { generateLearningPathRecommendation, analyzeStudyPatterns } from './gemini';

const router = Router();

// Schema for learning path request
const learningPathRequestSchema = z.object({
  learningStyle: z.enum(['visual', 'auditory', 'reading', 'kinesthetic']),
  timeCommitment: z.enum(['minimal', 'moderate', 'intensive']),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
  focusAreas: z.array(z.string()).min(1),
  excludedAreas: z.array(z.string()).optional(),
  daysUntilExam: z.number().optional()
});

// Generate a learning path based on user preferences
router.post('/generate', async (req, res) => {
  try {
    // Validate request body
    const validatedData = learningPathRequestSchema.safeParse(req.body);
    
    if (!validatedData.success) {
      return res.status(400).json({ 
        error: 'Invalid request data', 
        details: validatedData.error.format() 
      });
    }
    
    const preferences = validatedData.data;
    
    // Get study performance if user is authenticated
    let studyPerformance;
    if (req.user) {
      // Here you would retrieve the user's study performance from the database
      // For now, we'll use placeholder data
      studyPerformance = {
        weakAreas: req.body.weakAreas || [],
        strongAreas: req.body.strongAreas || []
      };
    }
    
    // Check if we have the Gemini API key
    if (!process.env.GEMINI_API_KEY) {
      return res.status(503).json({ 
        error: 'Service unavailable', 
        message: 'API key for Gemini Flash is not configured' 
      });
    }
    
    // Generate the learning path
    const rawLearningPath = await generateLearningPathRecommendation(
      preferences, 
      studyPerformance
    );
    
    // Add metadata and IDs where needed
    const enhancedPath = {
      ...rawLearningPath,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
      learningStyle: preferences.learningStyle,
      timeCommitment: preferences.timeCommitment,
      difficulty: preferences.difficulty,
      focusAreas: preferences.focusAreas,
      progress: 0,
      sections: rawLearningPath.sections.map(section => ({
        ...section,
        id: section.id || uuidv4(),
        completed: false,
        nodes: section.nodes.map(node => ({
          ...node,
          id: node.id || uuidv4(),
          completed: false,
          order: node.order || 0
        }))
      }))
    };
    
    // If user is authenticated, save the learning path to the database
    if (req.user) {
      // Here you would save the learning path to the database
      // For now, we'll just return it
    }
    
    res.status(200).json(enhancedPath);
  } catch (error) {
    console.error('Error generating learning path:', error);
    res.status(500).json({ 
      error: 'Failed to generate learning path', 
      message: error.message 
    });
  }
});

// Get a user's saved learning paths
router.get('/', async (req, res) => {
  try {
    // Check if user is authenticated
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    // Here you would retrieve the user's saved learning paths from the database
    // For now, we'll return an empty array
    res.status(200).json([]);
  } catch (error) {
    console.error('Error retrieving learning paths:', error);
    res.status(500).json({ 
      error: 'Failed to retrieve learning paths', 
      message: error.message 
    });
  }
});

// Get a specific learning path by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if user is authenticated
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    // Here you would retrieve the specific learning path from the database
    // For now, we'll return a 404
    res.status(404).json({ error: 'Learning path not found' });
  } catch (error) {
    console.error('Error retrieving learning path:', error);
    res.status(500).json({ 
      error: 'Failed to retrieve learning path', 
      message: error.message 
    });
  }
});

// Mark a learning path node as completed
router.post('/:id/complete-node/:nodeId', async (req, res) => {
  try {
    const { id, nodeId } = req.params;
    
    // Check if user is authenticated
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    // Here you would update the node's completion status in the database
    // For now, we'll return a success message
    res.status(200).json({ message: 'Node marked as completed' });
  } catch (error) {
    console.error('Error updating node completion status:', error);
    res.status(500).json({ 
      error: 'Failed to update node completion status', 
      message: error.message 
    });
  }
});

export default router;
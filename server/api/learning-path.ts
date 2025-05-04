import { Router, Request, Response } from "express";
import { generateGeminiJsonResponse } from "./gemini";
import { LearningPath } from "../../client/src/lib/learning-path";
import { v4 as uuidv4 } from 'uuid';

// In-memory storage for learning paths (would be replaced with database in production)
const userLearningPaths: Record<string, LearningPath[]> = {};

// Create router
const router = Router();

// Generic function to get user-specific learning paths
function getUserPaths(userId: string): LearningPath[] {
  if (!userLearningPaths[userId]) {
    userLearningPaths[userId] = [];
  }
  return userLearningPaths[userId];
}

// Middleware to check authentication
function ensureAuthenticated(req: Request, res: Response, next: Function) {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: 'Not authenticated' });
  }
  next();
}

// GET all learning paths for the current user
router.get('/', ensureAuthenticated, (req: Request, res: Response) => {
  const userId = req.user!.id.toString();
  const paths = getUserPaths(userId);
  res.json(paths);
});

// GET a specific learning path by ID
router.get('/:id', ensureAuthenticated, (req: Request, res: Response) => {
  const userId = req.user!.id.toString();
  const pathId = req.params.id;
  
  const paths = getUserPaths(userId);
  const path = paths.find(p => p.id === pathId);
  
  if (!path) {
    return res.status(404).json({ message: 'Learning path not found' });
  }
  
  res.json(path);
});

// POST to generate a new learning path
router.post('/generate', ensureAuthenticated, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id.toString();
    const preferences = req.body;
    
    // Validate required fields
    if (!preferences.learningStyle || !preferences.timeCommitment || !preferences.difficulty) {
      return res.status(400).json({ message: 'Missing required preferences' });
    }
    
    if (!preferences.focusAreas || !preferences.focusAreas.length) {
      return res.status(400).json({ message: 'At least one focus area is required' });
    }
    
    // Generate system prompt for Gemini
    const systemPrompt = `You are an expert nursing education assistant tasked with creating personalized learning paths for nursing students.
Your job is to create a detailed, structured learning path in JSON format that helps nursing students effectively master specific topics.
Respond with a valid JSON object that strictly follows the structure provided - do not include explanation text.`;

    // Build the prompt with user preferences
    const prompt = `Create a personalized nursing learning path for a student with the following preferences:
- Learning Style: ${preferences.learningStyle}
- Time Commitment: ${preferences.timeCommitment}
- Difficulty Level: ${preferences.difficulty}
- Focus Areas: ${preferences.focusAreas.join(', ')}
${preferences.excludedAreas ? '- Excluded Areas: ' + preferences.excludedAreas.join(', ') : ''}
${preferences.daysUntilExam ? '- Days Until Exam: ' + preferences.daysUntilExam : ''}
${preferences.weakAreas ? '- Weak Areas: ' + preferences.weakAreas.join(', ') : ''}
${preferences.strongAreas ? '- Strong Areas: ' + preferences.strongAreas.join(', ') : ''}

The learning path should help a nursing student prepare for exams by providing a structured study plan that matches their learning style.

Generate a complete learning path with:
1. An appropriate title and description
2. 3-5 study sections, each with its own title and description
3. Each section should have 3-6 learning activities (nodes)
4. Make sure nodes have different resource types (video, article, quiz, interactive, flashcard, practice)
5. Each node should have an appropriate title, description, estimated time (in minutes), and difficulty level
6. Include URLs for online resources where appropriate, ensuring they are fictional but realistic

Please format your response as a JSON object with the following structure:
{
  "title": "Title of the learning path",
  "description": "Overall description",
  "overview": "Additional details about the path's approach and benefits",
  "learningStyle": "${preferences.learningStyle}",
  "timeCommitment": "${preferences.timeCommitment}",
  "difficulty": "${preferences.difficulty}",
  "focusAreas": ${JSON.stringify(preferences.focusAreas)},
  "sections": [
    {
      "title": "Section title",
      "description": "Section description",
      "nodes": [
        {
          "title": "Node title",
          "description": "Node description",
          "resourceType": "One of: video, article, quiz, interactive, flashcard, practice",
          "estimatedTime": 30,
          "difficulty": "One of: beginner, intermediate, advanced",
          "url": "Optional URL for external resources"
        }
      ]
    }
  ]
}

Make sure all attributes in the JSON are present and correctly formatted.
Do NOT include any placeholder text like [PLACEHOLDER] or similar.
Provide realistic and specific titles, descriptions, and content for a nursing student.`;

    // Generate the learning path using Gemini
    const generatedPath = await generateGeminiJsonResponse<Partial<LearningPath>>(prompt, systemPrompt);
    
    // Create a complete path with ID, timestamps, and progress fields
    const now = new Date().toISOString();
    const newPath: LearningPath = {
      ...generatedPath as any,
      id: uuidv4(),
      createdAt: now,
      updatedAt: now,
      progress: 0,
      // Ensure sections have IDs and completed status
      sections: (generatedPath.sections || []).map(section => ({
        ...section,
        id: uuidv4(),
        completed: false,
        // Ensure nodes have IDs and completed status
        nodes: (section.nodes || []).map(node => ({
          ...node,
          id: uuidv4(),
          completed: false,
        })),
      })),
    };
    
    // Save the learning path for the user
    const userPaths = getUserPaths(userId);
    userPaths.push(newPath);
    
    // Return the new learning path
    res.status(201).json(newPath);
  } catch (error) {
    console.error('Error generating learning path:', error);
    res.status(500).json({ message: (error as Error).message || 'Failed to generate learning path' });
  }
});

// POST to mark a node as completed
router.post('/:id/complete-node/:nodeId', ensureAuthenticated, (req: Request, res: Response) => {
  const userId = req.user!.id.toString();
  const pathId = req.params.id;
  const nodeId = req.params.nodeId;
  
  const paths = getUserPaths(userId);
  const pathIndex = paths.findIndex(p => p.id === pathId);
  
  if (pathIndex === -1) {
    return res.status(404).json({ message: 'Learning path not found' });
  }
  
  const path = paths[pathIndex];
  let nodeFound = false;
  
  // Create a deep copy of the path to modify
  const updatedPath = { ...path };
  
  // Update the node's completed status
  updatedPath.sections = path.sections.map(section => {
    const updatedSection = { ...section };
    
    updatedSection.nodes = section.nodes.map(node => {
      if (node.id === nodeId) {
        nodeFound = true;
        return { ...node, completed: true };
      }
      return node;
    });
    
    // Update section completed status if all nodes are completed
    updatedSection.completed = updatedSection.nodes.every(node => node.completed);
    
    return updatedSection;
  });
  
  if (!nodeFound) {
    return res.status(404).json({ message: 'Node not found in the learning path' });
  }
  
  // Calculate overall progress
  const totalNodes = updatedPath.sections.reduce(
    (sum, section) => sum + section.nodes.length, 0
  );
  const completedNodes = updatedPath.sections.reduce(
    (sum, section) => sum + section.nodes.filter(node => node.completed).length, 0
  );
  
  updatedPath.progress = totalNodes > 0 
    ? Math.round((completedNodes / totalNodes) * 100)
    : 0;
  
  updatedPath.updatedAt = new Date().toISOString();
  
  // Update the path in storage
  paths[pathIndex] = updatedPath;
  
  res.json({ success: true });
});

export default router;
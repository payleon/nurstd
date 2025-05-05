import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import { v4 as uuidv4 } from 'uuid';
import { LearningPathPreferences } from '../../client/src/lib/learning-path';
import nursingResources from '../utils/nursing-resources';

// Setup Gemini model with API key
const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  console.error('GEMINI_API_KEY is not set in your environment variables');
}

const genAI = new GoogleGenerativeAI(API_KEY || '');

// Use the current version of Gemini model that is available in the API
// Model name: gemini-1.5-pro is the latest version as of May 2025
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

// Configuration for safety settings
const generationConfig = {
  temperature: 0.7,
  topK: 40,
  topP: 0.95,
  maxOutputTokens: 4096,
};

const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];

/**
 * Generates a personalized learning path using Gemini AI
 */
export async function generateGeminiLearningPath(preferences: LearningPathPreferences) {
  try {
    // Construct a detailed prompt for the AI based on user preferences
    const prompt = `
      You are an expert nursing education advisor designing a personalized NCLEX exam study plan. 
      Create a detailed learning path based on the following preferences:
      
      - Learning Style: ${preferences.learningStyle}
      - Time Commitment: ${preferences.timeCommitment}
      - Strength Areas: ${preferences.strengthAreas.join(', ')}
      - Weakness Areas: ${preferences.weaknessAreas.join(', ')}
      - Days Until Exam: ${preferences.daysUntilExam}
      - Difficulty Level: ${preferences.difficultyLevel}
      - Focus Areas: ${preferences.focusAreas.join(', ')}
      - Title: ${preferences.title}
      - Description: ${preferences.description || 'No additional description provided'}
      - Additional Notes: ${preferences.additionalNotes || 'No additional notes provided'}
      
      The learning path should:
      1. Focus heavily on the specified weakness areas while building on strengths
      2. Be tailored to the specified learning style (${preferences.learningStyle})
      3. Have appropriate difficulty level (${preferences.difficultyLevel})
      4. Be realistic for the time commitment (${preferences.timeCommitment})
      5. Prioritize the most critical content given the days until the exam (${preferences.daysUntilExam} days)
      
      Provide the response in the following JSON format:
      {
        "title": "Learning path title",
        "description": "Detailed description of the learning path",
        "learningStyle": "${preferences.learningStyle}",
        "timeCommitment": "${preferences.timeCommitment}",
        "difficulty": "${preferences.difficultyLevel}",
        "focusAreas": ["area1", "area2", ...],
        "sections": [
          {
            "id": "unique-id",
            "title": "Section title",
            "description": "Section description",
            "focusArea": "primary focus area for this section",
            "completed": false,
            "nodes": [
              {
                "id": "unique-id",
                "title": "Learning activity title",
                "description": "Detailed description of the activity",
                "resourceType": "video|article|quiz|interactive|flashcard|practice",
                "url": "example-url-or-empty-if-not-applicable",
                "estimatedTime": <time-in-minutes>,
                "difficulty": "beginner|intermediate|advanced",
                "completed": false,
                "requiredForCompletion": true|false
              },
              ...more nodes
            ]
          },
          ...more sections
        ]
      }
      
      Ensure that:
      - All sections align with the focus areas and user preferences
      - Each node has a descriptive title and detailed description
      - Estimated time for activities is realistic
      - Resource types are varied but emphasize ${preferences.learningStyle} learning style
      - For urls, either provide realistic example URLs or leave as empty strings
    `;

    // Call Gemini model
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig,
      safetySettings,
    });

    const response = result.response;
    const text = response.text();
    
    // Extract JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) {
      throw new Error('Failed to generate a valid learning path');
    }
    
    const learningPathData = JSON.parse(jsonMatch[0]);
    
    // Add unique IDs if they don't exist and ensure real resources
    const processedPath = {
      ...learningPathData,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      progress: 0,
    };
    
    // Get real nursing resources based on the focus areas
    const realResources = nursingResources.getResourcesForLearningPath(
      preferences.focusAreas as any[], 
      preferences.learningStyle,
      preferences.difficultyLevel
    );
    
    // Create a fallback list with at least one resource of each type for when we run out
    const fallbackResources = {
      article: {
        url: "https://www.registerednursing.org/nclex/",
        resourceType: "article",
        title: "NCLEX Study Guide",
        description: "Comprehensive NCLEX study guide with practice questions",
        estimatedTime: 45
      },
      video: {
        url: "https://www.youtube.com/watch?v=IisgnbMfKvI",
        resourceType: "video", 
        title: "NCLEX Study Tips",
        description: "Video guide for NCLEX preparation strategies",
        estimatedTime: 30
      },
      quiz: {
        url: "https://nurseslabs.com/nclex-practice-exam-1-40-items/",
        resourceType: "quiz",
        title: "NCLEX Practice Quiz",
        description: "Practice quiz with NCLEX-style questions",
        estimatedTime: 20
      },
      interactive: {
        url: "https://nurseslabs.com/nclex-practice-questions/",
        resourceType: "interactive",
        title: "Interactive NCLEX Review",
        description: "Interactive review of key NCLEX concepts",
        estimatedTime: 25
      },
      flashcard: {
        url: "https://quizlet.com/375587945/nclex-pharmacology-flash-cards/",
        resourceType: "flashcard",
        title: "NCLEX Pharmacology Flashcards",
        description: "Flashcards covering key pharmacology concepts for the NCLEX exam",
        estimatedTime: 15
      },
      practice: {
        url: "https://www.registerednursing.org/nclex/practice-questions/",
        resourceType: "practice",
        title: "NCLEX Practice Questions",
        description: "Extensive collection of NCLEX practice questions with detailed explanations",
        estimatedTime: 40
      }
    };
    
    // Map of resource index to track used resources
    let resourceIndex = 0;
    
    // Process sections with real resources
    processedPath.sections = learningPathData.sections.map((section: any) => {
      const sectionWithId = {
        ...section,
        id: section.id || `section-${uuidv4()}`,
        completed: false,
      };
      
      // Process nodes with real resources
      sectionWithId.nodes = section.nodes.map((node: any) => {
        let resourceToUse;
        
        // First try to get a resource from our real resources
        if (resourceIndex < realResources.length) {
          resourceToUse = realResources[resourceIndex++];
        } 
        // If we've run out, use a fallback based on the resource type
        else {
          const type = node.resourceType || 'article';
          // Use the appropriate fallback or default to article
          resourceToUse = fallbackResources[type] || fallbackResources.article;
        }
        
        // Always use a resource (either real or fallback)
        return {
          ...node,
          id: node.id || `node-${uuidv4()}`,
          completed: false,
          requiredForCompletion: node.requiredForCompletion !== undefined ? node.requiredForCompletion : true,
          url: resourceToUse.url,
          resourceType: resourceToUse.resourceType,
          title: node.title || resourceToUse.title,
          description: node.description || resourceToUse.description,
          estimatedTime: node.estimatedTime || resourceToUse.estimatedTime,
          difficulty: node.difficulty || resourceToUse.difficulty || preferences.difficultyLevel
        };
      });
      
      return sectionWithId;
    });
    
    return processedPath;
  } catch (error) {
    console.error('Error generating learning path with Gemini:', error);
    throw new Error('Failed to generate learning path');
  }
}
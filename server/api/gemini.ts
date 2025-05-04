import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import { v4 as uuidv4 } from 'uuid';
import { LearningPathPreferences } from '../../client/src/lib/learning-path';

// Setup Gemini model with API key
const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  console.error('GEMINI_API_KEY is not set in your environment variables');
}

const genAI = new GoogleGenerativeAI(API_KEY || '');

// Gemini Flash 2.0 model (replaced with Gemini Pro for now as Flash 2.0 is not available publicly yet)
// When Gemini Flash 2.0 is released, update this to the correct model name
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

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
    
    // Add unique IDs if they don't exist
    const processedPath = {
      ...learningPathData,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      progress: 0,
      sections: learningPathData.sections.map((section: any) => ({
        ...section,
        id: section.id || `section-${uuidv4()}`,
        completed: false,
        nodes: section.nodes.map((node: any) => ({
          ...node,
          id: node.id || `node-${uuidv4()}`,
          completed: false,
          requiredForCompletion: node.requiredForCompletion !== undefined ? node.requiredForCompletion : true
        }))
      }))
    };
    
    return processedPath;
  } catch (error) {
    console.error('Error generating learning path with Gemini:', error);
    throw new Error('Failed to generate learning path');
  }
}
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini API with your API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Use Gemini Flash 2.0 model
const MODEL_NAME = 'gemini-flash-2.0';

/**
 * Generate a personalized learning path based on user preferences and study performance
 */
export async function generateLearningPathRecommendation(
  preferences: {
    learningStyle: string;
    timeCommitment: string;
    difficulty: string;
    focusAreas: string[];
    excludedAreas?: string[];
    daysUntilExam?: number;
  },
  studyPerformance?: {
    weakAreas: string[];
    strongAreas: string[];
    recentErrors?: { area: string; concept: string }[];
  }
) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("Gemini API key is not configured");
    }

    // Build the prompt with preferences and study performance data
    const weakAreasText = studyPerformance?.weakAreas?.length
      ? `Weak areas: ${studyPerformance.weakAreas.join(", ")}`
      : "No specific weak areas identified yet";

    const strongAreasText = studyPerformance?.strongAreas?.length
      ? `Strong areas: ${studyPerformance.strongAreas.join(", ")}`
      : "No specific strong areas identified yet";

    const recentErrorsText = studyPerformance?.recentErrors?.length
      ? `Recent errors: ${studyPerformance.recentErrors
          .map((e) => `${e.area} (${e.concept})`)
          .join(", ")}`
      : "No recent errors recorded";

    const prompt = `
      Generate a personalized NCLEX study plan as a detailed JSON object based on the following information:
      
      **User Learning Preferences:**
      - Learning style: ${preferences.learningStyle}
      - Time commitment: ${preferences.timeCommitment}
      - Difficulty level: ${preferences.difficulty}
      - Focus areas: ${preferences.focusAreas.join(", ")}
      ${
        preferences.excludedAreas?.length
          ? `- Areas to exclude: ${preferences.excludedAreas.join(", ")}`
          : ""
      }
      ${
        preferences.daysUntilExam
          ? `- Days until exam: ${preferences.daysUntilExam}`
          : "- No specific exam date"
      }
      
      **User Study Performance:**
      - ${weakAreasText}
      - ${strongAreasText}
      - ${recentErrorsText}
      
      Please create a comprehensive study plan with:
      1. An overall strategy tailored to their learning style and time commitment
      2. A breakdown of study sections organized by topic priority (weak areas first)
      3. For each section, include 4-7 learning activities with:
         - Title
         - Description
         - Estimated time (in minutes)
         - Resource type (video, article, quiz, interactive, flashcard, practice)
         - Difficulty level
      4. Adapt the plan based on their performance data
      
      For the learning style:
      - Visual learners: Prioritize diagrams, videos, charts, and color-coded materials
      - Auditory learners: Prioritize recorded lectures, discussions, and verbal explanations
      - Reading/writing learners: Prioritize text-based resources, articles, and note-taking
      - Kinesthetic learners: Prioritize interactive activities, simulations, and practice scenarios
      
      The output should be a JSON object with the following structure:
      {
        "title": "Personalized NCLEX Study Plan for [Weak Areas]",
        "description": "A customized study plan focusing on your weak areas while building on your strengths",
        "overview": "Overall strategy description with implementation tips",
        "sections": [
          {
            "id": "unique-id-1",
            "title": "Section Title",
            "description": "Section description",
            "order": 1,
            "nodes": [
              {
                "id": "unique-activity-id-1",
                "title": "Activity Title",
                "description": "Activity description",
                "resourceType": "video|article|quiz|interactive|flashcard|practice",
                "estimatedTime": 30,
                "difficulty": "beginner|intermediate|advanced",
                "focusArea": "relevant-focus-area"
              }
            ]
          }
        ]
      }
    `;

    // Get the generative model
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    // Generate learning path
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        topP: 0.95,
        responseStyle: "precise"
      }
    });

    const response = result.response;
    const text = response.text();
    
    // Extract the JSON from the response
    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || 
                      text.match(/```\n([\s\S]*?)\n```/) || 
                      [null, text];
                      
    const jsonText = jsonMatch[1] || text;
    const cleanedJson = jsonText.replace(/^```json\n|^```\n|```$/g, '').trim();
    
    return JSON.parse(cleanedJson);
  } catch (error) {
    console.error("Error generating learning path recommendation:", error);
    throw new Error(`Failed to generate learning path: ${error.message}`);
  }
}

/**
 * Analyze user's study patterns and generate insights
 */
export async function analyzeStudyPatterns(studyData: any) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("Gemini API key is not configured");
    }

    const prompt = `Analyze this study data and provide insights as a JSON object: ${JSON.stringify(
      studyData
    )}`;

    // Get the generative model
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    // Generate insights
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.5,
        topP: 0.9,
        responseStyle: "analytical"
      }
    });

    const response = result.response;
    const text = response.text();
    
    // Extract the JSON from the response
    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || 
                      text.match(/```\n([\s\S]*?)\n```/) || 
                      [null, text];
                      
    const jsonText = jsonMatch[1] || text;
    const cleanedJson = jsonText.replace(/^```json\n|^```\n|```$/g, '').trim();
    
    return JSON.parse(cleanedJson);
  } catch (error) {
    console.error("Error analyzing study patterns:", error);
    throw new Error(`Failed to analyze study patterns: ${error.message}`);
  }
}
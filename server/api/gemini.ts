import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini with API key
const API_KEY = process.env.GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(API_KEY);

// Set up the model
const modelName = 'gemini-1.5-flash';
const model = genAI.getGenerativeModel({ model: modelName });

// Safely prompt the model and handle errors
export async function generateGeminiResponse(prompt: string, systemPrompt: string = ''): Promise<string> {
  try {
    if (!API_KEY) {
      throw new Error('Gemini API key is not configured.');
    }
    
    // Create a chat session
    const chat = model.startChat({
      generationConfig: {
        temperature: 0.6,
        topP: 0.9,
      },
      safetySettings: [
        {
          category: 'HARM_CATEGORY_HARASSMENT',
          threshold: 'BLOCK_MEDIUM_AND_ABOVE',
        },
        {
          category: 'HARM_CATEGORY_HATE_SPEECH',
          threshold: 'BLOCK_MEDIUM_AND_ABOVE',
        },
        {
          category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
          threshold: 'BLOCK_MEDIUM_AND_ABOVE',
        },
        {
          category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
          threshold: 'BLOCK_MEDIUM_AND_ABOVE',
        },
      ],
    });
    
    // Send message with context
    const messageContent = systemPrompt 
      ? `${systemPrompt}\n\n${prompt}`
      : prompt;
    
    // Send the message and get the response
    const result = await chat.sendMessage(messageContent);
    
    // Return the text response
    const response = result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating Gemini response:', error);
    
    if ((error as any).message?.includes('API key')) {
      throw new Error('Gemini API key is not properly configured. Please check your environment variables.');
    }
    
    throw new Error(`Failed to generate response: ${(error as Error).message}`);
  }
}

// Parse JSON from the Gemini response
export async function generateGeminiJsonResponse<T>(
  prompt: string, 
  systemPrompt: string = ''
): Promise<T> {
  const response = await generateGeminiResponse(prompt, systemPrompt);
  
  try {
    // Extract JSON from the response
    const jsonMatch = response.match(/```json\n([\s\S]*?)\n```/) || 
                      response.match(/```\n([\s\S]*?)\n```/) ||
                      response.match(/\{[\s\S]*\}/);
                      
    const jsonString = jsonMatch 
      ? jsonMatch[1] || jsonMatch[0]
      : response;
    
    // Parse and return the JSON
    return JSON.parse(jsonString.trim());
  } catch (error) {
    console.error('Error parsing JSON from Gemini response:', error);
    console.error('Raw response:', response);
    throw new Error('Failed to parse JSON from Gemini response. Please try again.');
  }
}
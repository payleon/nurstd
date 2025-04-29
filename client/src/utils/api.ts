import { QuestionsResponse } from "../types/question";

// Fetch questions from the server
export async function fetchQuestions(): Promise<QuestionsResponse> {
  try {
    const response = await fetch('/api/questions');
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching questions:', error);
    // Return an empty set of questions as fallback
    return { questions: [] };
  }
}

// Fetch tests from the server
export async function fetchTests() {
  try {
    const response = await fetch('/api/tests');
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching tests:', error);
    return [];
  }
}

// Fetch a single test by ID
export async function fetchTest(id: number) {
  try {
    const response = await fetch(`/api/tests/${id}`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching test ID ${id}:`, error);
    return null;
  }
}
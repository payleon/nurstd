import { QuestionsResponse } from "../types/question";

// Fetch all questions from the server
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

// Fetch questions filtered by category and limited by count
export async function fetchQuizQuestions(category: string, count: number): Promise<QuestionsResponse> {
  try {
    // Use the same endpoint but process the data client-side for simplicity
    const response = await fetch('/api/questions');
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json() as QuestionsResponse;
    
    // Filter by category if not 'All'
    let filteredQuestions = data.questions;
    if (category !== 'All') {
      filteredQuestions = filteredQuestions.filter(question => {
        const qCategory = question.category?.toLowerCase() || '';
        const requestedCategory = category.toLowerCase();
        
        if (requestedCategory === 'medical-surgical') {
          return qCategory.includes('med') || qCategory.includes('surg');
        } else if (requestedCategory === 'pediatric') {
          return qCategory.includes('ped');
        } else if (requestedCategory === 'obstetric') {
          return qCategory.includes('ob');
        } else if (requestedCategory === 'mental health') {
          return qCategory.includes('psych') || qCategory.includes('mental');
        } else if (requestedCategory === 'pharmacology') {
          return qCategory.includes('pharm');
        } else if (requestedCategory === 'leadership') {
          return qCategory.includes('lead') || qCategory.includes('manage');
        } else if (requestedCategory === 'fundamentals') {
          return qCategory.includes('fund');
        }
        
        return false;
      });
    }
    
    // Shuffle the questions
    const shuffled = [...filteredQuestions].sort(() => 0.5 - Math.random());
    
    // Take only the requested number of questions
    const limitedQuestions = shuffled.slice(0, count);
    
    return { questions: limitedQuestions };
  } catch (error) {
    console.error('Error fetching quiz questions:', error);
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
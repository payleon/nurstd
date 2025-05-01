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
    // Map frontend category to backend category for filtering
    let categoryParam = category;
    if (category !== 'All') {
      if (category === 'Medical-Surgical') {
        categoryParam = 'Cardiac';
      } else if (category === 'Pediatric') {
        categoryParam = 'Pediatric';
      } else if (category === 'Obstetric') {
        categoryParam = 'Maternity';
      } else if (category === 'Mental Health') {
        categoryParam = 'Mental';
      } else if (category === 'Pharmacology') {
        categoryParam = 'Pharmacology';
      } else if (category === 'Leadership') {
        categoryParam = 'Leadership';
      } else if (category === 'Fundamentals') {
        categoryParam = 'Fundamentals';
      }
    }

    // Now use the new filter endpoint
    const response = await fetch(
      `/api/questions/filter?${category === 'All' ? '' : `category=${categoryParam}&`}count=${count}`
    );
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json() as QuestionsResponse;
    console.log('Filtered questions response:', data);
    
    // If we don't get enough questions with our category filter, fall back to getting some from all categories
    if (data.questions.length === 0 && category !== 'All') {
      console.log('No questions found for category, falling back to all categories');
      return fetchQuizQuestions('All', count);
    }
    
    return data;
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
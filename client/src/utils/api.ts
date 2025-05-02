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

// Fetch questions filtered by categories, difficulty and limited by count
export async function fetchQuizQuestions(
  categories: string[] | string, 
  count: number, 
  difficulty?: 'beginner' | 'intermediate' | 'advanced'
): Promise<QuestionsResponse> {
  try {
    // Handle both array and string inputs for backward compatibility
    const categoryArray = Array.isArray(categories) ? categories : [categories];
    
    // Map frontend categories to backend categories for filtering
    const mappedCategories = categoryArray.map(category => {
      // System categories
      if (category === 'Medical-Surgical') return 'Cardiovascular';
      if (category === 'Obstetric') return 'Maternity';
      
      // Direct match categories
      if (['Cardiovascular', 'Pediatric', 'Maternity', 'Mental Health', 
           'Pharmacology', 'Leadership', 'Fundamentals', 'Respiratory',
           'Neurological', 'Endocrine', 'Oncology', 'Emergency', 'Geriatric',
           'Critical Care'].includes(category)) {
        return category;
      }
      
      // Handle remaining categories with their original names
      return category;
    });
    
    console.log(`Fetching ${count} questions for categories: ${mappedCategories.join(', ')}`);
    
    // Build the query string for multiple categories
    let queryParams = new URLSearchParams();
    
    // Add each category as a separate parameter
    if (mappedCategories.length > 0 && mappedCategories[0] !== 'All') {
      mappedCategories.forEach(cat => {
        queryParams.append('category', cat);
      });
    }
    
    // Add count parameter
    queryParams.append('count', count.toString());
    
    // Add difficulty parameter if provided
    if (difficulty) {
      queryParams.append('difficulty', difficulty);
      console.log(`Filtering for ${difficulty} difficulty level`);
    }
    
    // Now use the new filter endpoint with multiple categories
    const response = await fetch(`/api/questions/filter?${queryParams.toString()}`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json() as QuestionsResponse;
    console.log(`Received ${data.questions.length} questions from selected categories`);
    
    // The server will now handle falling back and duplicating questions as needed,
    // so we can just return the data directly
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
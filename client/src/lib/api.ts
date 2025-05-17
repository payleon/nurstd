// API utilities for fetching data from the server

export async function fetchTest(testId: number) {
  console.log(`API Request: GET /api/tests/${testId}`);
  try {
    const response = await fetch(`/api/tests/${testId}`);
    console.log(`API Response status for /api/tests/${testId}:`, response.status, response.statusText);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch test: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching test:', error);
    throw error;
  }
}

export async function fetchTestContent(testId: number) {
  console.log(`API Request: GET /api/tests/${testId}/content`);
  try {
    const response = await fetch(`/api/tests/${testId}/content`);
    console.log(`API Response status for /api/tests/${testId}/content:`, response.status, response.statusText);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch test content: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching test content:', error);
    throw error;
  }
}

export async function fetchQuestions(path: string) {
  console.log(`API Request: GET ${path}`);
  try {
    const response = await fetch(path);
    console.log(`API Response status for ${path}:`, response.status, response.statusText);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch questions: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching questions:', error);
    throw error;
  }
}

export async function saveUserProgress(data: any) {
  try {
    const response = await fetch('/api/user/progress', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to save progress: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error saving user progress:', error);
    throw error;
  }
}

export async function submitExamResults(data: any) {
  try {
    console.log(`API Request: POST /api/exams/submit`, data);
    const response = await fetch('/api/exams/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    console.log(`API Response status for /api/exams/submit:`, response.status, response.statusText);
    
    if (!response.ok) {
      throw new Error(`Failed to submit exam: ${response.status} ${response.statusText}`);
    }
    
    // Special handling for exam submission - on some endpoints we might just receive a success message
    // Check the content type to see if it's JSON or something else
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    } else {
      // If it's not JSON, just return a success object
      return { success: true, message: 'Exam completed successfully' };
    }
  } catch (error) {
    console.error('Error submitting exam results:', error);
    throw error;
  }
}
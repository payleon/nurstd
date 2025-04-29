import { Test, Question, QuestionsResponse } from "@shared/schema";
import { apiRequest } from "./queryClient";

export async function fetchTests(): Promise<Test[]> {
  const response = await apiRequest("GET", "/api/tests", undefined);
  return response.json();
}

export async function fetchTest(testId: number): Promise<Test | null> {
  try {
    console.log(`Fetching test with ID: ${testId}`);
    const response = await apiRequest("GET", `/api/tests/${testId}`, undefined);
    if (!response.ok) {
      console.error(`Error fetching test ID ${testId}: ${response.status}`);
      return null;
    }
    return response.json();
  } catch (error) {
    console.error(`Error fetching test ID ${testId}:`, error);
    return null;
  }
}

export async function fetchTestContent(testId: number): Promise<string | QuestionsResponse> {
  console.log(`Making API request for test ID: ${testId}`);
  try {
    const response = await apiRequest("GET", `/api/tests/${testId}/content`, undefined);
    
    // Check if response is JSON or text
    const contentType = response.headers.get('content-type');
    console.log(`Content-Type for test ${testId}:`, contentType);
    
    if (contentType && contentType.includes('application/json')) {
      const json = await response.json();
      console.log(`Received JSON data for test ${testId}:`, json);
      return json;
    } else {
      const text = await response.text();
      console.log(`Received text data for test ${testId}, length: ${text.length}`);
      return text;
    }
  } catch (error) {
    console.error(`Error fetching test content for test ID ${testId}:`, error);
    throw error;
  }
}

export async function fetchQuestions(): Promise<QuestionsResponse> {
  const response = await apiRequest("GET", "/api/questions", undefined);
  return response.json();
}

export async function fetchQuestion(questionId: number): Promise<Question> {
  const response = await apiRequest("GET", `/api/questions/${questionId}`, undefined);
  return response.json();
}

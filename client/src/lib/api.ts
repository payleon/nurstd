import { Test, Question, QuestionsResponse } from "@shared/schema";
import { apiRequest } from "./queryClient";

export async function fetchTests(): Promise<Test[]> {
  const response = await apiRequest("GET", "/api/tests", undefined);
  return response.json();
}

export async function fetchTestContent(testId: number): Promise<string | any> {
  const response = await apiRequest("GET", `/api/tests/${testId}/content`, undefined);
  
  // Check if response is JSON or text
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return response.json();
  } else {
    return response.text();
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

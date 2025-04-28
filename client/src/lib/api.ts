import { Test } from "@shared/schema";
import { apiRequest } from "./queryClient";

export async function fetchTests(): Promise<Test[]> {
  const response = await apiRequest("GET", "/api/tests", undefined);
  return response.json();
}

export async function fetchTestContent(testId: number): Promise<string> {
  const response = await apiRequest("GET", `/api/tests/${testId}/content`, undefined);
  return response.text();
}

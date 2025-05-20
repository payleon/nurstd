// API utilities for fetching data from the server
import { uniqueId } from './utils';

/**
 * Common request options for API calls
 */
interface RequestOptions {
  headers?: Record<string, string>;
  timeout?: number;
  retries?: number;
  retryDelay?: number;
  credentials?: RequestCredentials;
  cache?: RequestCache;
}

/**
 * Default request options
 */
const defaultOptions: RequestOptions = {
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
  retries: 2,
  retryDelay: 1000,
  credentials: 'include',
  cache: 'default'
};

/**
 * Enhanced fetch with timeout, retries, and error handling
 */
async function enhancedFetch(
  url: string, 
  method: string = 'GET', 
  data?: any, 
  options: RequestOptions = {}
): Promise<Response> {
  const requestId = uniqueId('req');
  const mergedOptions = { ...defaultOptions, ...options };
  const { 
    timeout = 30000, 
    retries = 2, 
    retryDelay = 1000, 
    ...fetchOptions 
  } = mergedOptions;
  
  // Create controller for timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  // Add headers and method to fetch options
  const fetchParams: RequestInit = {
    method,
    headers: {
      ...mergedOptions.headers,
    },
    credentials: mergedOptions.credentials,
    cache: mergedOptions.cache,
    signal: controller.signal,
  };
  
  // Add body for non-GET requests with data
  if (method !== 'GET' && data !== undefined) {
    fetchParams.body = JSON.stringify(data);
  }
  
  // Log outgoing request
  console.log(`[${requestId}] API Request: ${method} ${url}`, 
    method !== 'GET' && data ? { requestBody: data } : '');
  
  let lastError: Error | null = null;
  let attempts = 0;
  
  while (attempts <= retries) {
    attempts++;
    
    try {
      const response = await fetch(url, fetchParams);
      
      // Clear timeout as request completed
      clearTimeout(timeoutId);
      
      // Log response status
      console.log(`[${requestId}] API Response (${attempts}/${retries + 1}): ${response.status} ${response.statusText}`);
      
      return response;
    } catch (error: any) {
      lastError = error;
      
      // Clear timeout
      clearTimeout(timeoutId);
      
      // Handle abort error due to timeout
      if (error.name === 'AbortError') {
        console.warn(`[${requestId}] Request timeout after ${timeout}ms`);
        throw new Error(`Request timeout after ${timeout}ms`);
      }
      
      // Log retry attempts
      if (attempts <= retries) {
        console.warn(`[${requestId}] Retrying request (${attempts}/${retries}) after error:`, error.message);
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, retryDelay));
      } else {
        console.error(`[${requestId}] All retry attempts failed for ${url}:`, error);
        throw error;
      }
    }
  }
  
  // This should never be reached as the last failed attempt will throw
  throw lastError;
}

/**
 * Process response to extract JSON or handle errors
 */
async function processResponse<T>(response: Response, errorPrefix: string): Promise<T> {
  // Handle failed responses
  if (!response.ok) {
    let errorMessage = `${errorPrefix}: ${response.status} ${response.statusText}`;
    
    try {
      // Try to parse error response body
      const errorData = await response.json();
      errorMessage += ` - ${JSON.stringify(errorData.message || errorData)}`;
    } catch {
      // If error body isn't valid JSON, just use status text
    }
    
    throw new Error(errorMessage);
  }
  
  // For successful responses, parse JSON or return appropriate format
  const contentType = response.headers.get('content-type');
  
  if (contentType && contentType.includes('application/json')) {
    return await response.json() as T;
  } else {
    // For non-JSON responses, return a success object
    return { success: true, message: 'Operation completed successfully' } as unknown as T;
  }
}

/**
 * Fetch a specific test by ID
 */
export async function fetchTest(testId: number) {
  try {
    const response = await enhancedFetch(`/api/tests/${testId}`);
    return processResponse(response, 'Failed to fetch test');
  } catch (error) {
    console.error('Error fetching test:', error);
    throw error;
  }
}

/**
 * Fetch test content for a specific test ID
 */
export async function fetchTestContent(testId: number) {
  try {
    const response = await enhancedFetch(`/api/tests/${testId}/content`);
    return processResponse(response, 'Failed to fetch test content');
  } catch (error) {
    console.error('Error fetching test content:', error);
    throw error;
  }
}

/**
 * Fetch questions from a specific path
 */
export async function fetchQuestions(path: string) {
  try {
    const response = await enhancedFetch(path);
    return processResponse(response, 'Failed to fetch questions');
  } catch (error) {
    console.error('Error fetching questions:', error);
    throw error;
  }
}

/**
 * Save user study progress
 */
export async function saveUserProgress(data: any) {
  try {
    const response = await enhancedFetch('/api/user/progress', 'POST', data);
    return processResponse(response, 'Failed to save progress');
  } catch (error) {
    console.error('Error saving user progress:', error);
    throw error;
  }
}

/**
 * Submit exam results to the server
 */
export async function submitExamResults(data: any) {
  try {
    const response = await enhancedFetch('/api/exams/submit', 'POST', data);
    return processResponse(response, 'Failed to submit exam');
  } catch (error) {
    console.error('Error submitting exam results:', error);
    throw error;
  }
}
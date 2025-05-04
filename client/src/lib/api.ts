/**
 * API utility functions for fetching data from the server
 */

// Base URL for API requests
const API_BASE_URL = '';

/**
 * Fetch API with error handling and standard headers
 */
export async function fetchApi(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Log the request (helpful for debugging)
  console.log(`API Request: ${options.method || 'GET'} ${endpoint}`);
  
  // Set up default headers if not provided
  const headers = {
    ...options.headers,
  };
  
  // Make the request
  const response = await fetch(url, {
    ...options,
    headers,
  });
  
  // Log the response status (helpful for debugging)
  console.log(`API Response status for ${endpoint}:`, response.status, response.statusText);
  
  // For non-ok responses, log an error
  if (!response.ok) {
    let errorDetails = {};
    try {
      errorDetails = await response.clone().json();
    } catch (e) {
      // Ignore JSON parsing errors
    }
    console.error(`API Request failed for ${endpoint}:`, errorDetails);
  }
  
  return response;
}

/**
 * Simplified GET request helper
 */
export async function get<T>(endpoint: string): Promise<T> {
  const response = await fetchApi(endpoint);
  
  if (!response.ok) {
    throw new Error(`API Request failed: ${response.status} ${response.statusText}`);
  }
  
  return await response.json();
}

/**
 * Simplified POST request helper
 */
export async function post<T>(endpoint: string, data: any): Promise<T> {
  const response = await fetchApi(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    throw new Error(`API Request failed: ${response.status} ${response.statusText}`);
  }
  
  return await response.json();
}

/**
 * Simplified PUT request helper
 */
export async function put<T>(endpoint: string, data: any): Promise<T> {
  const response = await fetchApi(endpoint, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    throw new Error(`API Request failed: ${response.status} ${response.statusText}`);
  }
  
  return await response.json();
}

/**
 * Simplified DELETE request helper
 */
export async function del(endpoint: string): Promise<void> {
  const response = await fetchApi(endpoint, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    throw new Error(`API Request failed: ${response.status} ${response.statusText}`);
  }
}

/**
 * Fetch a single test by ID
 */
export async function fetchTest(id: number): Promise<any> {
  try {
    const response = await fetchApi(`/api/tests/${id}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch test with ID ${id}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error fetching test with ID ${id}:`, error);
    throw error;
  }
}
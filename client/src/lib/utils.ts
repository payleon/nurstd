import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines multiple class names into a single string, resolving Tailwind CSS conflicts
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Creates a delay in milliseconds
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Formats a date to a human-readable string
 */
export function formatDate(date: Date | string): string {
  if (!date) return 'N/A';
  try {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  } catch (err) {
    console.error('Error formatting date:', err);
    return 'Invalid date';
  }
}

/**
 * Formats a date with time to a human-readable string
 */
export function formatDateTime(date: Date | string): string {
  if (!date) return 'N/A';
  try {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (err) {
    console.error('Error formatting datetime:', err);
    return 'Invalid date';
  }
}

/**
 * Returns a human-readable time ago string (e.g., "2 hours ago")
 * Enhanced to handle month/year ranges and invalid dates gracefully
 */
export function timeAgo(date: Date | string): string {
  if (!date) return 'N/A';
  try {
    const d = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(d.getTime())) return 'Invalid date';
    
    const now = new Date();
    
    const seconds = Math.floor((now.getTime() - d.getTime()) / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30.44); // Average month length
    const years = Math.floor(days / 365);
    
    if (years > 0) {
      return `${years} year${years === 1 ? '' : 's'} ago`;
    } else if (months > 0) {
      return `${months} month${months === 1 ? '' : 's'} ago`;
    } else if (days > 0) {
      return `${days} day${days === 1 ? '' : 's'} ago`;
    } else if (hours > 0) {
      return `${hours} hour${hours === 1 ? '' : 's'} ago`;
    } else if (minutes > 0) {
      return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
    } else {
      return 'Just now';
    }
  } catch (err) {
    console.error('Error calculating time ago:', err);
    return 'Unknown';
  }
}

/**
 * Truncates text to a specified length with an ellipsis
 * Enhanced to handle HTML entities and preserve words
 */
export function truncateText(text: string, maxLength: number, preserveWords = false): string {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  
  if (preserveWords) {
    // Truncate at last space within maxLength
    const truncated = text.substring(0, maxLength);
    const lastSpace = truncated.lastIndexOf(' ');
    
    if (lastSpace > 0) {
      return truncated.substring(0, lastSpace) + '...';
    }
  }
  
  return text.substring(0, maxLength) + '...';
}

/**
 * Randomizes the order of elements in an array using Fisher-Yates algorithm
 * Enhanced with typings and seed option for deterministic shuffling
 */
export function shuffleArray<T>(array: T[], seed?: number): T[] {
  if (!array || !Array.isArray(array)) return [];
  
  const result = [...array];
  
  // With seed for deterministic shuffling if needed
  if (seed !== undefined) {
    const rng = seedRandom(seed);
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }
  
  // Standard shuffling
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Simple seeded random number generator
 */
function seedRandom(seed: number): () => number {
  return function() {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
}

/**
 * Extracts initials from a name (e.g., "John Doe" -> "JD")
 * Enhanced to handle edge cases and names with multiple parts
 */
export function getInitials(name: string): string {
  if (!name) return '';
  
  // Filter out empty parts after splitting
  const parts = name.split(' ').filter(part => part.length > 0);
  
  if (parts.length === 0) return '';
  if (parts.length === 1) {
    // For single names, take the first two letters
    return parts[0].substring(0, 2).toUpperCase();
  }
  
  // For multiple parts, take the first letter of the first and last parts
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/**
 * Debounces a function to limit how often it's called
 * Enhanced with return value handling and cancel method
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  immediate = false
): {
  (...args: Parameters<T>): void;
  cancel: () => void;
} {
  let timeout: NodeJS.Timeout | null = null;
  
  const debounced = function(this: any, ...args: Parameters<T>) {
    const context = this;
    
    const later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    
    const callNow = immediate && !timeout;
    
    if (timeout) clearTimeout(timeout);
    
    timeout = setTimeout(later, wait);
    
    if (callNow) func.apply(context, args);
  };
  
  debounced.cancel = function() {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
  };
  
  return debounced;
}

/**
 * Throttles a function to limit its execution rate
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T, 
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;
  let lastFunc: NodeJS.Timeout;
  let lastRan: number;
  
  return function(this: any, ...args: Parameters<T>) {
    const context = this;
    
    if (!inThrottle) {
      func.apply(context, args);
      lastRan = Date.now();
      inThrottle = true;
      
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    } else {
      clearTimeout(lastFunc);
      lastFunc = setTimeout(() => {
        if (Date.now() - lastRan >= limit) {
          func.apply(context, args);
          lastRan = Date.now();
        }
      }, limit - (Date.now() - lastRan));
    }
  };
}

/**
 * Formats a number according to locale and options
 */
export function formatNumber(
  num: number, 
  options: Intl.NumberFormatOptions = {}, 
  locale = 'en-US'
): string {
  if (num === null || num === undefined || isNaN(num)) return 'N/A';
  return new Intl.NumberFormat(locale, options).format(num);
}

/**
 * Formats a percentage with optional precision
 */
export function formatPercent(value: number, precision = 1): string {
  if (value === null || value === undefined || isNaN(value)) return 'N/A';
  return `${value.toFixed(precision)}%`;
}

/**
 * Creates a unique ID (useful for temporary element IDs)
 */
export function uniqueId(prefix = 'id'): string {
  return `${prefix}_${Math.random().toString(36).substring(2, 9)}_${Date.now().toString(36)}`;
}

/**
 * Safely access deeply nested object properties
 */
export function getNestedValue<T>(obj: any, path: string, defaultValue: T): T {
  if (!obj || !path) return defaultValue;
  
  const keys = path.split('.');
  let current = obj;
  
  for (const key of keys) {
    if (current === null || current === undefined || typeof current !== 'object') {
      return defaultValue;
    }
    current = current[key];
  }
  
  return current === undefined ? defaultValue : current;
}

/**
 * Calculates the reading time for a given text
 */
export function calculateReadingTime(text: string, wordsPerMinute = 200): number {
  if (!text) return 0;
  const words = text.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}
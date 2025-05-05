/**
 * Content enrichment utilities for learning resources
 * 
 * This module provides functions to enhance learning content by:
 * 1. Fetching additional relevant content from external sources
 * 2. Generating summaries and key points for articles
 * 3. Structuring content in learning-optimized formats
 */
import { exec } from 'child_process';
import { promisify } from 'util';
import { LearningPathNode } from '../../client/src/lib/learning-path';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Convert exec to promise-based
const execAsync = promisify(exec);

// Setup Gemini model with API key for content enhancement
const API_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY || '');
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

// Get current file path in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cache directory for scraped content
const CACHE_DIR = path.join(__dirname, '../../temp_dir/content_cache');

/**
 * Cache key generator
 */
function getCacheKey(url: string): string {
  // Convert URL to a valid filename by replacing non-alphanumeric characters
  return url.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 100);
}

/**
 * Ensures cache directory exists
 */
async function ensureCacheDir(): Promise<void> {
  try {
    await fs.mkdir(CACHE_DIR, { recursive: true });
  } catch (error) {
    console.error('Error creating cache directory:', error);
  }
}

/**
 * Get cached content if available
 */
async function getCachedContent(url: string): Promise<string | null> {
  try {
    const cacheKey = getCacheKey(url);
    const cachePath = path.join(CACHE_DIR, `${cacheKey}.txt`);
    const content = await fs.readFile(cachePath, 'utf8');
    return content;
  } catch (error) {
    return null;
  }
}

/**
 * Cache content for future use
 */
async function cacheContent(url: string, content: string): Promise<void> {
  try {
    await ensureCacheDir();
    const cacheKey = getCacheKey(url);
    const cachePath = path.join(CACHE_DIR, `${cacheKey}.txt`);
    await fs.writeFile(cachePath, content, 'utf8');
  } catch (error) {
    console.error('Error caching content:', error);
  }
}

/**
 * Extract the main content from a URL using trafilatura
 */
export async function extractContentFromUrl(url: string): Promise<string> {
  // First check cache
  const cachedContent = await getCachedContent(url);
  if (cachedContent) {
    return cachedContent;
  }

  try {
    // Use trafilatura via Python to extract content
    const { stdout } = await execAsync(`python -c "import trafilatura; downloaded = trafilatura.fetch_url('${url}'); print(trafilatura.extract(downloaded))" 2>/dev/null`);
    
    // Cache the results
    if (stdout) {
      await cacheContent(url, stdout);
    }
    
    return stdout || 'No content could be extracted from this URL.';
  } catch (error) {
    console.error('Error extracting content:', error);
    return 'Failed to extract content from the URL.';
  }
}

/**
 * Generate key points from article content using Gemini
 */
export async function generateContentSummary(content: string, title: string): Promise<{summary: string, keyPoints: string[]}> {
  try {
    // Default response if generation fails
    const defaultResponse = {
      summary: 'Summary not available.',
      keyPoints: ['Key points could not be generated.']
    };
    
    if (!content || content.length < 100) {
      return defaultResponse;
    }
    
    // Truncate content if too long (Gemini has token limits)
    const truncatedContent = content.substring(0, 15000);
    
    const prompt = `
      You are an expert nursing educator preparing study materials for NCLEX exam preparation.
      
      Please extract the most important information from the following article with the title "${title}":
      
      ${truncatedContent}
      
      Provide a concise summary and 3-5 key nursing knowledge points that a student should remember.
      
      Format your response as JSON:
      {
        "summary": "Concise summary of the article",
        "keyPoints": ["Key point 1", "Key point 2", "Key point 3", ...]
      }
    `;
    
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    });
    
    const response = result.response;
    const text = response.text();
    
    // Extract JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) {
      return defaultResponse;
    }
    
    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error('Error generating content summary:', error);
    return {
      summary: 'Summary not available.',
      keyPoints: ['Key points could not be generated.']
    };
  }
}

/**
 * Enrich a learning node with additional content from its URL
 */
export async function enrichNodeContent(node: LearningPathNode): Promise<LearningPathNode> {
  // Only process nodes with URLs that are articles
  if (!node.url || node.resourceType !== 'article') {
    return node;
  }
  
  try {
    // Extract content from the URL
    const extractedContent = await extractContentFromUrl(node.url);
    
    if (!extractedContent || extractedContent.length < 100) {
      return node;
    }
    
    // Generate summary and key points
    const { summary, keyPoints } = await generateContentSummary(extractedContent, node.title);
    
    // Return enriched node
    return {
      ...node,
      extractedContent,
      contentSummary: summary,
      keyPoints
    };
  } catch (error) {
    console.error('Error enriching node content:', error);
    return node;
  }
}
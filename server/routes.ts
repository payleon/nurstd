import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import fs from "fs/promises";
import path from "path";
import { QuestionsResponseSchema, QuestionSchema } from "@shared/schema";
import learningPathRouter from "./api/learning-path-router";

export async function registerRoutes(app: Express): Promise<Server> {
  // Serve sitemap.xml and robots.txt at root level
  app.get('/sitemap.xml', async (req, res) => {
    try {
      const rootDir = path.join(import.meta.dirname, '..');
      const sitemapPath = path.join(rootDir, 'public', 'sitemap.xml');
      
      try {
        await fs.access(sitemapPath);
        const sitemapContent = await fs.readFile(sitemapPath, 'utf-8');
        res.type('application/xml').send(sitemapContent);
      } catch (error) {
        console.error("Sitemap not found:", error);
        res.status(404).send('Sitemap not found');
      }
    } catch (error) {
      console.error("Error serving sitemap:", error);
      res.status(500).send('Error serving sitemap');
    }
  });
  
  app.get('/robots.txt', async (req, res) => {
    try {
      const rootDir = path.join(import.meta.dirname, '..');
      const robotsPath = path.join(rootDir, 'public', 'robots.txt');
      
      try {
        await fs.access(robotsPath);
        const robotsContent = await fs.readFile(robotsPath, 'utf-8');
        res.type('text/plain').send(robotsContent);
      } catch (error) {
        console.error("Robots.txt not found:", error);
        res.status(404).send('Robots.txt not found');
      }
    } catch (error) {
      console.error("Error serving robots.txt:", error);
      res.status(500).send('Error serving robots.txt');
    }
  });
  // Get all tests from tests.json
  app.get("/api/tests", async (req, res) => {
    try {
      const publishedDir = path.join(import.meta.dirname, "../published");
      const testsFilePath = path.join(publishedDir, "tests.json");
      
      // Make sure the published directory exists
      try {
        await fs.access(publishedDir);
      } catch (error) {
        // Create the directory if it doesn't exist
        await fs.mkdir(publishedDir, { recursive: true });
      }
      
      // Check if tests.json exists
      try {
        await fs.access(testsFilePath);
      } catch (error) {
        // Return empty array if it doesn't exist
        return res.json([]);
      }
      
      // Read and parse tests.json
      const testsContent = await fs.readFile(testsFilePath, 'utf-8');
      const tests = JSON.parse(testsContent);
      
      res.json(tests);
    } catch (error) {
      console.error("Error reading tests:", error);
      res.status(500).json({ message: "Failed to load tests" });
    }
  });
  
  // Get a single test by ID
  app.get("/api/tests/:id", async (req, res) => {
    try {
      const testId = parseInt(req.params.id);
      
      // Get tests from tests.json
      const publishedDir = path.join(import.meta.dirname, "../published");
      const testsFilePath = path.join(publishedDir, "tests.json");
      
      try {
        await fs.access(testsFilePath);
      } catch (error) {
        return res.status(404).json({ message: "Tests file not found" });
      }
      
      // Read and parse tests.json
      const testsContent = await fs.readFile(testsFilePath, 'utf-8');
      const tests = JSON.parse(testsContent);
      
      // Find the test by ID
      const test = tests.find((t: any) => t.id === testId);
      
      if (!test) {
        return res.status(404).json({ message: "Test not found" });
      }
      
      res.json(test);
    } catch (error) {
      console.error(`Error fetching test ID ${req.params.id}:`, error);
      res.status(500).json({ message: "Failed to load test" });
    }
  });

  // Get the content of a specific test
  app.get("/api/tests/:id/content", async (req, res) => {
    try {
      const testId = parseInt(req.params.id);
      
      // Get tests from tests.json
      const publishedDir = path.join(import.meta.dirname, "../published");
      const testsFilePath = path.join(publishedDir, "tests.json");
      
      try {
        await fs.access(testsFilePath);
      } catch (error) {
        return res.status(404).json({ message: "Tests file not found" });
      }
      
      // Read and parse tests.json
      const testsContent = await fs.readFile(testsFilePath, 'utf-8');
      const tests = JSON.parse(testsContent);
      
      // Find the test with the matching ID
      const test = tests.find((test: any) => test.id === testId);
      
      if (!test) {
        return res.status(404).json({ message: "Test not found" });
      }
      
      // If the test points to a json file like questions.json, return it's structure
      if (test.path.endsWith('.json')) {
        const filePath = path.join(import.meta.dirname, "..", test.path);
        const content = await fs.readFile(filePath, 'utf-8');
        const jsonContent = JSON.parse(content);
        
        // Validate the data against our schema if it matches the expected format
        try {
          // Check if data has a 'questions' array
          if (jsonContent && typeof jsonContent === 'object' && Array.isArray(jsonContent.questions)) {
            const validatedData = QuestionsResponseSchema.parse(jsonContent);
            res.json(validatedData);
          } else {
            // Just return the data as-is
            res.json(jsonContent);
          }
        } catch (error) {
          console.error("Test content validation error:", error);
          // Still return the data even if validation fails
          res.json(jsonContent);
        }
      } else {
        // For HTML content
        const filePath = path.join(import.meta.dirname, "..", test.path);
        const content = await fs.readFile(filePath, 'utf-8');
        res.type('text/html').send(content);
      }
    } catch (error) {
      console.error("Error reading test content:", error);
      res.status(500).json({ message: "Failed to load test content" });
    }
  });

  // Get all questions from all_questions.json
  app.get("/api/questions", async (req, res) => {
    try {
      const publishedDir = path.join(import.meta.dirname, "../published");
      const questionsFilePath = path.join(publishedDir, "all_questions.json");
      
      try {
        await fs.access(publishedDir);
      } catch (error) {
        // Create the directory if it doesn't exist
        await fs.mkdir(publishedDir, { recursive: true });
      }
      
      try {
        await fs.access(questionsFilePath);
      } catch (error) {
        console.error("Questions file not found at", questionsFilePath);
        // Use a minimal skeleton response structure
        return res.json({ 
          questions: [] 
        });
      }
      
      // Read the questions file
      const questionsContent = await fs.readFile(questionsFilePath, 'utf-8');
      
      // Validate JSON format
      let questionsData;
      try {
        questionsData = JSON.parse(questionsContent);
      } catch (error) {
        console.error("Error parsing questions JSON:", error);
        return res.status(500).json({ 
          message: "Invalid JSON format in questions file",
          error: (error as Error).message 
        });
      }
      
      // Validate the data against our schema
      try {
        const validatedData = QuestionsResponseSchema.parse(questionsData);
        res.json(validatedData);
      } catch (error) {
        console.error("Questions data validation error:", error);
        
        // Try to return partial data if possible
        if (questionsData && typeof questionsData === 'object' && 'questions' in questionsData && Array.isArray(questionsData.questions)) {
          console.log("Returning unvalidated question data");
          res.json(questionsData);
        } else {
          res.status(500).json({ 
            message: "Invalid questions data format", 
            error: (error as Error).message 
          });
        }
      }
    } catch (error) {
      console.error("Error reading questions:", error);
      res.status(500).json({ 
        message: "Failed to load questions",
        error: (error as Error).message 
      });
    }
  });
  
  // Get questions filtered by categories and limited by count
  app.get("/api/questions/filter", async (req, res) => {
    try {
      // Extract query parameters
      // Support both single category and multiple categories
      const categoryParam = req.query.category;
      const categories = Array.isArray(categoryParam) ? categoryParam : categoryParam ? [categoryParam] : [];
      const count = req.query.count ? parseInt(req.query.count as string) : 10; // Default to 10 if not specified
      
      const publishedDir = path.join(import.meta.dirname, "../published");
      const questionsFilePath = path.join(publishedDir, "all_questions.json");
      
      console.log(`Received request for ${count} questions in categories: ${categories.length > 0 ? categories.join(', ') : 'All'}`);
      
      // Add a query parameter for difficulty if it exists
      const difficulty = req.query.difficulty;
      if (difficulty) {
        console.log(`Filtering for difficulty level: ${difficulty}`);
      }
      
      try {
        await fs.access(questionsFilePath);
      } catch (error) {
        console.error("Questions file not found at", questionsFilePath);
        return res.json({ 
          questions: [] 
        });
      }
      
      // Read and parse the questions file
      const questionsContent = await fs.readFile(questionsFilePath, 'utf-8');
      const questionsData = JSON.parse(questionsContent);
      
      // Validate the data
      const validatedData = QuestionsResponseSchema.parse(questionsData);
      
      // Filter questions by categories if specified
      let filteredQuestions = validatedData.questions;
      console.log(`Total questions available: ${filteredQuestions.length}`);
      
      // Log types of questions available
      const questionTypes = {};
      filteredQuestions.forEach(q => {
        questionTypes[q.type] = (questionTypes[q.type] || 0) + 1;
      });
      console.log('Question types available:', questionTypes);
      
      // Log some sample category data to debug category matching
      console.log('Sample question categories:');
      filteredQuestions.slice(0, 10).forEach(q => {
        console.log(`  Question ID ${q.id}: category="${q.category || 'undefined'}", title="${q.title}"`);
      });
      
      if (categories.length > 0) {
        filteredQuestions = filteredQuestions.filter(q => {
          // Check if the question matches any of the selected categories
          return categories.some(category => {
            // Skip 'all' category as it matches everything
            if (category.toLowerCase() === 'all') return true;
            
            // Check both title and category fields for expanded matching
            // Using more flexible matching to increase the pool of questions
            const titleMatch = q.title && q.title.toLowerCase().includes(category.toLowerCase());
            const categoryMatch = q.category && (
              q.category === category || 
              q.category.toLowerCase().includes(category.toLowerCase()) ||
              category.toLowerCase().includes(q.category.toLowerCase())
            );
            
            // Log matching information for troubleshooting
            if (titleMatch || categoryMatch) {
              console.log(`  Match found: "${category}" matches question ID ${q.id} (${q.category || 'no category'})`);
            }
            
            return titleMatch || categoryMatch;
          });
        });
      }
      
      console.log(`Found ${filteredQuestions.length} matching questions before duplication`);
      
      // Ensure we have enough questions to meet the requested count
      // If we don't have enough questions, duplicate existing ones
      let resultQuestions = [];
      
      if (filteredQuestions.length > 0) {
        // Shuffle the questions first for randomness
        const shuffledQuestions = [...filteredQuestions].sort(() => Math.random() - 0.5);

        // If we have enough questions, just take what we need
        if (shuffledQuestions.length >= count) {
          resultQuestions = shuffledQuestions.slice(0, count);
        } else {
          // If we don't have enough, create multiple sets of questions with modified IDs
          // Calculate how many complete sets we need
          const sets = Math.floor(count / shuffledQuestions.length);
          const remainder = count % shuffledQuestions.length;
          
          // Add complete sets
          for (let i = 0; i < sets; i++) {
            const duplicatedQuestions = shuffledQuestions.map((q, index) => ({
              ...q,
              id: q.id + (i * shuffledQuestions.length * 1000), // Ensure unique IDs
              text: i > 0 ? `[Variant ${i+1}] ${q.text}` : q.text // Optionally mark duplicated questions
            }));
            resultQuestions = [...resultQuestions, ...duplicatedQuestions];
          }
          
          // Add remaining questions to reach the requested count
          if (remainder > 0) {
            const remainderQuestions = shuffledQuestions.slice(0, remainder).map((q, index) => ({
              ...q,
              id: q.id + (sets * shuffledQuestions.length * 1000), // Ensure unique IDs
              text: sets > 0 ? `[Variant ${sets+1}] ${q.text}` : q.text // Optionally mark duplicated questions
            }));
            resultQuestions = [...resultQuestions, ...remainderQuestions];
          }
        }
      } else if (categories.length > 0) {
        // If no questions match the specified categories, try to get questions from all categories
        console.log('No questions found for selected categories, falling back to all categories');
        const allQuestions = validatedData.questions;
        
        if (allQuestions.length > 0) {
          // Shuffle and select from all questions
          const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
          
          if (shuffled.length >= count) {
            resultQuestions = shuffled.slice(0, count);
          } else {
            // If still not enough, duplicate as needed
            const sets = Math.floor(count / shuffled.length);
            const remainder = count % shuffled.length;
            
            let duplicatedResults = [];
            // Add complete sets
            for (let i = 0; i < sets; i++) {
              const duplicatedQuestions = shuffled.map((q, index) => ({
                ...q,
                id: q.id + (i * shuffled.length * 1000), // Ensure unique IDs
                text: i > 0 ? `[Variant ${i+1}] ${q.text}` : q.text // Optionally mark duplicated questions
              }));
              duplicatedResults = [...duplicatedResults, ...duplicatedQuestions];
            }
            
            // Add remaining questions
            if (remainder > 0) {
              const remainderQuestions = shuffled.slice(0, remainder).map((q, index) => ({
                ...q,
                id: q.id + (sets * shuffled.length * 1000), // Ensure unique IDs
                text: sets > 0 ? `[Variant ${sets+1}] ${q.text}` : q.text // Optionally mark duplicated questions 
              }));
              duplicatedResults = [...duplicatedResults, ...remainderQuestions];
            }
            
            resultQuestions = duplicatedResults;
          }
        }
      }
      
      console.log(`Returning ${resultQuestions.length} questions after processing`);
      
      // Return the filtered and processed questions
      res.json({ questions: resultQuestions });
      
    } catch (error) {
      console.error("Error filtering questions:", error);
      res.status(500).json({ 
        message: "Failed to filter questions",
        error: (error as Error).message 
      });
    }
  });

  // Get a specific question by ID
  app.get("/api/questions/:id", async (req, res) => {
    try {
      const questionId = parseInt(req.params.id);
      const publishedDir = path.join(import.meta.dirname, "../published");
      const questionsFilePath = path.join(publishedDir, "all_questions.json");
      
      try {
        await fs.access(questionsFilePath);
      } catch (error) {
        return res.status(404).json({ message: "Questions file not found" });
      }
      
      // Read the questions file
      const questionsContent = await fs.readFile(questionsFilePath, 'utf-8');
      const questionsData = JSON.parse(questionsContent);
      
      // Validate the data and find the specific question
      try {
        const validatedData = QuestionsResponseSchema.parse(questionsData);
        const question = validatedData.questions.find(q => q.id === questionId);
        
        if (!question) {
          return res.status(404).json({ message: "Question not found" });
        }
        
        // Validate the specific question
        const validatedQuestion = QuestionSchema.parse(question);
        res.json(validatedQuestion);
      } catch (error) {
        console.error("Question data validation error:", error);
        res.status(500).json({ message: "Invalid question data format" });
      }
    } catch (error) {
      console.error("Error reading question:", error);
      res.status(500).json({ message: "Failed to load question" });
    }
  });

  // Register learning path routes
  app.use("/api/learning-paths", learningPathRouter);
  console.log('Learning path routes registered');

  const httpServer = createServer(app);
  console.log('Routes initialized successfully (authentication disabled).');
  return httpServer;
}

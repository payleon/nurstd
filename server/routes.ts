import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import fs from "fs/promises";
import path from "path";
import { QuestionsResponseSchema, QuestionSchema } from "@shared/schema";

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
  
  // Get questions filtered by category and limited by count
  app.get("/api/questions/filter", async (req, res) => {
    try {
      // Extract query parameters
      const category = req.query.category as string;
      const count = req.query.count ? parseInt(req.query.count as string) : 10; // Default to 10 if not specified
      
      const publishedDir = path.join(import.meta.dirname, "../published");
      const questionsFilePath = path.join(publishedDir, "all_questions.json");
      
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
      
      // Filter questions by category if specified
      let filteredQuestions = validatedData.questions;
      if (category && category !== 'all') {
        filteredQuestions = filteredQuestions.filter(q => {
          // Check both title and category fields
          const titleMatch = q.title && q.title.toLowerCase().includes(category.toLowerCase());
          const categoryMatch = q.category && q.category === category;
          return titleMatch || categoryMatch;
        });
      }
      
      // Ensure we have enough questions to meet the requested count
      // If we don't have enough questions, duplicate existing ones
      let resultQuestions = [];
      
      if (filteredQuestions.length > 0) {
        // If we have some questions but not enough, duplicate them
        if (filteredQuestions.length < count) {
          // Calculate how many complete sets we need
          const sets = Math.floor(count / filteredQuestions.length);
          const remainder = count % filteredQuestions.length;
          
          // Add complete sets
          for (let i = 0; i < sets; i++) {
            const duplicatedQuestions = filteredQuestions.map((q, index) => ({
              ...q,
              id: q.id + (i * filteredQuestions.length * 1000) // Ensure unique IDs
            }));
            resultQuestions = [...resultQuestions, ...duplicatedQuestions];
          }
          
          // Add remaining questions to reach the requested count
          if (remainder > 0) {
            const remainderQuestions = filteredQuestions.slice(0, remainder).map((q, index) => ({
              ...q,
              id: q.id + (sets * filteredQuestions.length * 1000) // Ensure unique IDs
            }));
            resultQuestions = [...resultQuestions, ...remainderQuestions];
          }
        } else {
          // If we have enough questions, just take what we need
          // Shuffle the questions to get random ones each time
          const shuffled = [...filteredQuestions].sort(() => Math.random() - 0.5);
          resultQuestions = shuffled.slice(0, count);
        }
      } else if (category && category !== 'all') {
        // If no questions match the specified category, try to get questions from all categories
        console.log('No questions found for category, falling back to all categories');
        const allQuestions = validatedData.questions;
        
        if (allQuestions.length > 0) {
          // Shuffle and select from all questions
          const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
          resultQuestions = shuffled.slice(0, Math.min(count, allQuestions.length));
          
          // If still not enough, duplicate as needed
          if (resultQuestions.length < count) {
            const sets = Math.floor(count / resultQuestions.length);
            const remainder = count % resultQuestions.length;
            
            let duplicatedResults = [];
            // Add complete sets
            for (let i = 0; i < sets; i++) {
              const duplicatedQuestions = resultQuestions.map((q, index) => ({
                ...q,
                id: q.id + (i * resultQuestions.length * 1000) // Ensure unique IDs
              }));
              duplicatedResults = [...duplicatedResults, ...duplicatedQuestions];
            }
            
            // Add remaining questions
            if (remainder > 0) {
              const remainderQuestions = resultQuestions.slice(0, remainder).map((q, index) => ({
                ...q,
                id: q.id + (sets * resultQuestions.length * 1000) // Ensure unique IDs
              }));
              duplicatedResults = [...duplicatedResults, ...remainderQuestions];
            }
            
            resultQuestions = duplicatedResults;
          }
        }
      }
      
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

  const httpServer = createServer(app);
  return httpServer;
}

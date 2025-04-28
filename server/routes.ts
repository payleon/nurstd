import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import fs from "fs/promises";
import path from "path";
import { QuestionsResponseSchema, QuestionSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all tests from the published directory
  app.get("/api/tests", async (req, res) => {
    try {
      const publishedDir = path.join(import.meta.dirname, "../published");
      
      // Make sure the published directory exists
      try {
        await fs.access(publishedDir);
      } catch (error) {
        // Create the directory if it doesn't exist
        await fs.mkdir(publishedDir, { recursive: true });
      }
      
      // Read the directory
      const files = await fs.readdir(publishedDir);
      
      // Filter for HTML files
      const htmlFiles = files.filter(file => file.endsWith('.html'));
      
      // Create test objects
      const tests = htmlFiles.map((file, index) => {
        // Get the file name without extension to use as title
        const fileName = path.basename(file, '.html');
        const title = fileName
          .replace(/_/g, ' ')
          .replace(/\b\w/g, c => c.toUpperCase());
        
        return {
          id: index + 1,
          title: title,
          path: `published/${file}`,
          createdAt: new Date().toISOString(),
        };
      });
      
      res.json(tests);
    } catch (error) {
      console.error("Error reading tests directory:", error);
      res.status(500).json({ message: "Failed to load tests" });
    }
  });

  // Get the content of a specific test
  app.get("/api/tests/:id/content", async (req, res) => {
    try {
      const testId = parseInt(req.params.id);
      
      // First get all tests to find the one with the matching ID
      const publishedDir = path.join(import.meta.dirname, "../published");
      const files = await fs.readdir(publishedDir);
      const htmlFiles = files.filter(file => file.endsWith('.html'));
      
      // Map files to test objects with IDs
      const tests = htmlFiles.map((file, index) => ({
        id: index + 1,
        path: file
      }));
      
      // Find the test with the matching ID
      const test = tests.find(test => test.id === testId);
      
      if (!test) {
        return res.status(404).json({ message: "Test not found" });
      }
      
      // Read the HTML content
      const filePath = path.join(publishedDir, test.path);
      const content = await fs.readFile(filePath, 'utf-8');
      
      // Send the HTML content
      res.type('text/html').send(content);
    } catch (error) {
      console.error("Error reading test content:", error);
      res.status(500).json({ message: "Failed to load test content" });
    }
  });

  // Get all questions from questions.json
  app.get("/api/questions", async (req, res) => {
    try {
      const publishedDir = path.join(import.meta.dirname, "../published");
      const questionsFilePath = path.join(publishedDir, "questions.json");
      
      try {
        await fs.access(questionsFilePath);
      } catch (error) {
        return res.status(404).json({ message: "Questions file not found" });
      }
      
      // Read the questions file
      const questionsContent = await fs.readFile(questionsFilePath, 'utf-8');
      const questionsData = JSON.parse(questionsContent);
      
      // Validate the data against our schema
      try {
        const validatedData = QuestionsResponseSchema.parse(questionsData);
        res.json(validatedData);
      } catch (error) {
        console.error("Questions data validation error:", error);
        res.status(500).json({ message: "Invalid questions data format" });
      }
    } catch (error) {
      console.error("Error reading questions:", error);
      res.status(500).json({ message: "Failed to load questions" });
    }
  });

  // Get a specific question by ID
  app.get("/api/questions/:id", async (req, res) => {
    try {
      const questionId = parseInt(req.params.id);
      const publishedDir = path.join(import.meta.dirname, "../published");
      const questionsFilePath = path.join(publishedDir, "questions.json");
      
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

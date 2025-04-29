import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import fs from "fs/promises";
import path from "path";
import { QuestionsResponseSchema, QuestionSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
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

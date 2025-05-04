import { pgTable, text, serial, integer, timestamp, varchar, jsonb, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Keep the original users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Add a new tests table for our application
export const tests = pgTable("tests", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  path: varchar("path", { length: 255 }).notNull(),
  description: varchar("description", { length: 1000 }),
  questionCount: integer("question_count"),
  timeLimit: integer("time_limit"),
  category: varchar("category", { length: 100 }),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertTestSchema = createInsertSchema(tests).pick({
  title: true,
  path: true,
  description: true,
  questionCount: true,
  timeLimit: true,
  category: true,
});

export type InsertTest = z.infer<typeof insertTestSchema>;
export type Test = typeof tests.$inferSelect;

// User Study Progress
export const userStudyProgress = pgTable("user_study_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  category: text("category").notNull(), // e.g., "med-surg", "pharmacology", etc.
  confidenceLevel: integer("confidence_level").notNull(), // 1-5 scale
  lastUpdated: timestamp("last_updated").defaultNow().notNull(),
  questionsAttempted: integer("questions_attempted").default(0),
  questionsCorrect: integer("questions_correct").default(0),
  recommendedFocus: boolean("recommended_focus").default(false),
});

// User Study Recommendations
export const userRecommendations = pgTable("user_recommendations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  recommendationType: text("recommendation_type").notNull(), // e.g., "content", "strategy", "resource"
  title: text("title").notNull(),
  description: text("description").notNull(),
  priority: integer("priority").default(1), // 1-3 with 3 being highest
  completed: boolean("completed").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Define the types for user study progress and recommendations
export type UserStudyProgress = typeof userStudyProgress.$inferSelect;
export type InsertUserStudyProgress = typeof userStudyProgress.$inferInsert;
export type UserRecommendation = typeof userRecommendations.$inferSelect;
export type InsertUserRecommendation = typeof userRecommendations.$inferInsert;

// Define schemas for question types
export const QuestionChoiceSchema = z.object({
  id: z.string(),
  text: z.string()
});

// Base schema with common fields
const BaseQuestionSchema = z.object({
  id: z.number(),
  title: z.string(),
  text: z.string(),
  rationale: z.string(),
  category: z.string().optional()
});

// Multiple choice question schema
const MultipleChoiceQuestionSchema = BaseQuestionSchema.extend({
  type: z.literal("mc"),
  choices: z.array(QuestionChoiceSchema),
  correctAnswer: z.string()
});

// Select all that apply question schema
const SelectAllQuestionSchema = BaseQuestionSchema.extend({
  type: z.literal("sata"),
  choices: z.array(QuestionChoiceSchema),
  correctAnswer: z.array(z.string())
});

// Fill in the blank question schema
const FillInBlankQuestionSchema = BaseQuestionSchema.extend({
  type: z.literal("fill_in_blank"),
  correctAnswer: z.string(),
  choices: z.array(QuestionChoiceSchema).optional()
});

// Hotspot question schema (for identifying areas on an image)
const HotspotQuestionSchema = BaseQuestionSchema.extend({
  type: z.literal("hotspot"),
  imagePath: z.string(),
  correctAreas: z.array(z.object({
    id: z.string(),
    x: z.number(),  // x coordinate percentage from left
    y: z.number(),  // y coordinate percentage from top
    width: z.number(), // width percentage
    height: z.number(), // height percentage
    label: z.string().optional()
  })),
  distractorAreas: z.array(z.object({
    id: z.string(),
    x: z.number(),
    y: z.number(),
    width: z.number(),
    height: z.number(),
    label: z.string().optional()
  })).optional()
});

// Ordered response question schema (drag and drop in correct order)
const OrderedResponseQuestionSchema = BaseQuestionSchema.extend({
  type: z.literal("ordered-response"),
  items: z.array(z.object({
    id: z.string(),
    text: z.string()
  })),
  correctOrder: z.array(z.string())
});

// Chart/exhibit question schema (questions based on a chart, graph, or medical record)
const ChartExhibitQuestionSchema = BaseQuestionSchema.extend({
  type: z.literal("chart-exhibit"),
  exhibitType: z.enum(["lab-results", "vital-signs", "medication-record", "assessment-findings", "diagnostic-results"]),
  exhibitData: z.record(z.string(), z.any()),
  questions: z.array(z.object({
    id: z.string(),
    text: z.string(),
    choices: z.array(QuestionChoiceSchema),
    correctAnswer: z.union([z.string(), z.array(z.string())])
  }))
});

// Union of all question types
export const QuestionSchema = z.discriminatedUnion("type", [
  MultipleChoiceQuestionSchema,
  SelectAllQuestionSchema,
  FillInBlankQuestionSchema,
  HotspotQuestionSchema,
  OrderedResponseQuestionSchema,
  ChartExhibitQuestionSchema
]);

export const QuestionsResponseSchema = z.object({
  questions: z.array(QuestionSchema)
});

export type QuestionChoice = z.infer<typeof QuestionChoiceSchema>;
export type Question = z.infer<typeof QuestionSchema>;
export type QuestionsResponse = z.infer<typeof QuestionsResponseSchema>;

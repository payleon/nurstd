import { pgTable, text, serial, integer, timestamp, varchar } from "drizzle-orm/pg-core";
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
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertTestSchema = createInsertSchema(tests).pick({
  title: true,
  path: true,
});

export type InsertTest = z.infer<typeof insertTestSchema>;
export type Test = typeof tests.$inferSelect;

// Question Choice type
export interface QuestionChoice {
  id: string;
  text: string;
  isCorrect?: boolean;
}

// Base Question interface
export interface BaseQuestion {
  id: number; // Changed from string to number to match server schema
  title?: string;
  text: string;
  category?: string;
  difficulty?: 'easy' | 'medium' | 'hard' | 'advanced';
  rationale?: string;
  hint?: string;
  keyPoints?: string[];
  keywords?: string[];
  references?: string[];
}

// Multiple Choice Question
export interface MCQuestion extends BaseQuestion {
  type: 'mc';
  choices: QuestionChoice[];
  correctAnswer: string;
}

// Select All That Apply Question
export interface SATAQuestion extends BaseQuestion {
  type: 'sata';
  choices: QuestionChoice[];
  correctAnswer: string[]; // Changed from correctAnswers to match server schema
}

// Fill in the Blank Question
export interface FillInBlankQuestion extends BaseQuestion {
  type: 'fill_in_blank';
  correctAnswer: string;
  acceptableAnswers?: string[];
}

// Hotspot Question
export interface HotspotQuestion extends BaseQuestion {
  type: 'hotspot';
  imagePath: string; // Changed from imageUrl to match server schema
  correctAreas: {
    id: string;
    x: number;  // x coordinate percentage from left
    y: number;  // y coordinate percentage from top
    width: number; // width percentage
    height: number; // height percentage
    label?: string;
  }[];
  distractorAreas?: {
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
    label?: string;
  }[];
}

// Ordered Response Question
export interface OrderedResponseQuestion extends BaseQuestion {
  type: 'ordered-response';
  items: {
    id: string;
    text: string;
  }[];
  correctOrder: string[];
}

// Chart/Exhibit Question
export interface ChartExhibitQuestion extends BaseQuestion {
  type: 'chart-exhibit';
  exhibits: {
    id: string;
    title: string;
    content: string;
    type: 'text' | 'image' | 'table' | 'chart';
  }[];
  questions: {
    id: string;
    text: string;
    choices: QuestionChoice[];
    correctAnswer: string;
  }[];
}

// Union type for all question types
export type Question = 
  | MCQuestion 
  | SATAQuestion 
  | FillInBlankQuestion 
  | HotspotQuestion 
  | OrderedResponseQuestion 
  | ChartExhibitQuestion;

// Response from the API
export interface QuestionsResponse {
  questions: Question[];
}
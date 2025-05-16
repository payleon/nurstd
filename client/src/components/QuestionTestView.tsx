import React from "react";
import { Test, Question, QuestionsResponse } from "@shared/schema";
import { EnhancedExamView } from "./exam/EnhancedExamView";

interface QuestionTestViewProps {
  test: Test & { questionsData?: QuestionsResponse };
  onBack: () => void;
  onComplete?: (score: number, totalQuestions: number) => void;
  onBookmarkQuestion?: (question: Question) => void;
  bookmarkedQuestions?: number[];
}

export function QuestionTestView({ 
  test, 
  onBack, 
  onComplete,
  onBookmarkQuestion,
  bookmarkedQuestions = []
}: QuestionTestViewProps) {
  // Use the new enhanced exam interface that matches the screenshots
  return (
    <EnhancedExamView 
      test={test}
      onBack={onBack}
      onComplete={onComplete}
    />
  );
}
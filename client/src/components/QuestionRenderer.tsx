import React, { useState } from "react";
import { Question } from "@shared/schema";

interface QuestionRendererProps {
  question: Question;
  onAnswer: (answer: string | string[]) => void;
}

export function QuestionRenderer({ question, onAnswer }: QuestionRendererProps) {
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  
  const isSingleChoice = question.type === "mc";
  
  const handleAnswerSelect = (answerId: string) => {
    if (isSingleChoice) {
      // For multiple choice, only one answer can be selected
      setSelectedAnswers([answerId]);
      onAnswer(answerId);
    } else {
      // For select all that apply
      const updatedAnswers = selectedAnswers.includes(answerId)
        ? selectedAnswers.filter(id => id !== answerId)
        : [...selectedAnswers, answerId];
      
      setSelectedAnswers(updatedAnswers);
      onAnswer(updatedAnswers);
    }
  };

  return (
    <div className="question-container">
      <div className="question-header mb-6">
        <h3 className="text-lg font-bold text-[#13294B] mb-2">{question.title}</h3>
        <p className="text-gray-800">{question.text}</p>
      </div>
      
      <div className="answer-options space-y-3">
        {question.choices.map((choice) => (
          <div 
            key={choice.id}
            className="flex items-start p-3 border rounded-md cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => handleAnswerSelect(choice.id)}
          >
            <div className="mr-3 mt-0.5">
              {isSingleChoice ? (
                <div 
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    selectedAnswers.includes(choice.id) 
                      ? "border-[#4B9CD3] bg-[#4B9CD3]" 
                      : "border-gray-300"
                  }`}
                >
                  {selectedAnswers.includes(choice.id) && (
                    <div className="w-2 h-2 rounded-full bg-white"></div>
                  )}
                </div>
              ) : (
                <div 
                  className={`w-5 h-5 rounded-sm border-2 flex items-center justify-center ${
                    selectedAnswers.includes(choice.id) 
                      ? "border-[#4B9CD3] bg-[#4B9CD3]" 
                      : "border-gray-300"
                  }`}
                >
                  {selectedAnswers.includes(choice.id) && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              )}
            </div>
            <div className="flex-1">
              <div className="font-medium">{choice.id}. {choice.text}</div>
            </div>
          </div>
        ))}
      </div>
      
      {!isSingleChoice && (
        <div className="mt-4 text-sm text-gray-600 italic">
          Select all that apply
        </div>
      )}
    </div>
  );
}
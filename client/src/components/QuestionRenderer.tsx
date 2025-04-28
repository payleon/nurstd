import React, { useState, useEffect } from "react";
import { Question } from "@shared/schema";
import { AlertCircle, CheckCircle2 } from "lucide-react";

interface QuestionRendererProps {
  question: Question;
  onAnswer: (answer: string | string[]) => void;
  userAnswer?: string | string[];
  showRationale?: boolean;
  isCorrect?: boolean;
}

export function QuestionRenderer({ 
  question, 
  onAnswer, 
  userAnswer, 
  showRationale = false,
  isCorrect = false
}: QuestionRendererProps) {
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>(
    Array.isArray(userAnswer) ? userAnswer : userAnswer ? [userAnswer] : []
  );
  const [textAnswer, setTextAnswer] = useState<string>(
    typeof userAnswer === 'string' ? userAnswer : ''
  );
  
  // Reset state when question changes
  useEffect(() => {
    setSelectedAnswers(Array.isArray(userAnswer) ? userAnswer : userAnswer ? [userAnswer] : []);
    setTextAnswer(typeof userAnswer === 'string' ? userAnswer : '');
  }, [question.id, userAnswer]);
  
  const isSingleChoice = question.type === "mc";
  const isMultiChoice = question.type === "sata";
  const isFillInBlank = question.type === "fill_in_blank";
  
  const handleAnswerSelect = (answerId: string) => {
    if (isSingleChoice) {
      // For multiple choice, only one answer can be selected
      setSelectedAnswers([answerId]);
      onAnswer(answerId);
    } else if (isMultiChoice) {
      // For select all that apply
      const updatedAnswers = selectedAnswers.includes(answerId)
        ? selectedAnswers.filter(id => id !== answerId)
        : [...selectedAnswers, answerId];
      
      setSelectedAnswers(updatedAnswers);
      // Don't submit answer automatically for SATA questions
      // User will need to click a submit button
    }
  };

  const handleTextInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTextAnswer(value);
    // Don't submit answer automatically for fill-in-blank
    // User will need to press Enter or click a submit button
  };
  
  const handleSubmitAnswer = () => {
    if (isMultiChoice) {
      onAnswer(selectedAnswers);
    } else if (isFillInBlank) {
      onAnswer(textAnswer);
    }
  };

  return (
    <div className="question-container">
      <div className="question-header mb-6">
        <h3 className="text-lg font-bold text-[#13294B] mb-2">{question.title}</h3>
        <p className="text-gray-800">{question.text}</p>
      </div>
      
      {isFillInBlank ? (
        <div className="fill-blank-container mt-6">
          <label className="block text-gray-700 font-medium mb-2">
            Enter your answer:
          </label>
          <input
            type="text"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4B9CD3] focus:border-transparent"
            placeholder="Type your answer here"
            value={textAnswer}
            onChange={handleTextInputChange}
            disabled={showRationale}
          />
        </div>
      ) : (
        <>
          <div className="answer-options space-y-3">
            {question.choices?.map((choice) => {
              const isSelected = selectedAnswers.includes(choice.id);
              const isCorrectChoice = Array.isArray(question.correctAnswer) 
                ? question.correctAnswer.includes(choice.id) 
                : question.correctAnswer === choice.id;
              
              // Determine styling for answered questions when showing rationale
              let choiceStyle = "border rounded-md cursor-pointer hover:bg-gray-50 transition-colors";
              if (showRationale) {
                if (isCorrectChoice) {
                  choiceStyle = "border-2 border-green-400 bg-green-50 rounded-md";
                } else if (isSelected && !isCorrectChoice) {
                  choiceStyle = "border-2 border-red-400 bg-red-50 rounded-md";
                }
              }
              
              return (
                <div 
                  key={choice.id}
                  className={`flex items-start p-3 ${choiceStyle}`}
                  onClick={() => !showRationale && handleAnswerSelect(choice.id)}
                >
                  <div className="mr-3 mt-0.5">
                    {isSingleChoice ? (
                      <div 
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          isSelected
                            ? "border-[#4B9CD3] bg-[#4B9CD3]" 
                            : "border-gray-300"
                        }`}
                      >
                        {isSelected && (
                          <div className="w-2 h-2 rounded-full bg-white"></div>
                        )}
                      </div>
                    ) : (
                      <div 
                        className={`w-5 h-5 rounded-sm border-2 flex items-center justify-center ${
                          isSelected
                            ? "border-[#4B9CD3] bg-[#4B9CD3]" 
                            : "border-gray-300"
                        }`}
                      >
                        {isSelected && (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">
                      {choice.id}. {choice.text}
                      {showRationale && isCorrectChoice && (
                        <span className="ml-2 text-green-600 inline-flex items-center">
                          <CheckCircle2 size={16} className="mr-1" /> Correct
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {isMultiChoice && (
            <div className="mt-4 text-sm text-gray-600 italic">
              Select all that apply
            </div>
          )}
        </>
      )}
      
      {/* Submit Button for SATA and Fill in Blank questions */}
      {!showRationale && (isMultiChoice || isFillInBlank) && (
        <div className="mt-6">
          <button
            onClick={handleSubmitAnswer}
            className="px-6 py-2 bg-[#13294B] text-white rounded-md hover:bg-[#0A1E3A] transition-colors"
            disabled={
              (isMultiChoice && selectedAnswers.length === 0) || 
              (isFillInBlank && textAnswer.trim() === '')
            }
          >
            Submit Answer
          </button>
        </div>
      )}
      
      {/* Rationale Section */}
      {showRationale && question.rationale && (
        <div className="mt-6 border-t pt-4">
          <div className={`p-4 rounded-md ${isCorrect ? 'bg-green-50' : 'bg-amber-50'}`}>
            <div className="flex items-center font-medium text-lg mb-2">
              {isCorrect ? (
                <CheckCircle2 className="mr-2 text-green-600" size={20} />
              ) : (
                <AlertCircle className="mr-2 text-amber-600" size={20} />
              )}
              <h4 className={isCorrect ? 'text-green-800' : 'text-amber-800'}>
                {isCorrect ? 'Correct!' : 'Incorrect'}
              </h4>
            </div>
            
            <div className="mb-2">
              <span className="font-medium">Correct Answer: </span>
              {Array.isArray(question.correctAnswer) ? (
                question.correctAnswer.join(', ')
              ) : (
                question.correctAnswer
              )}
            </div>
            
            <div className="rationale">
              <h5 className="font-medium mb-1">Rationale:</h5>
              <p className="text-gray-700">{question.rationale}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
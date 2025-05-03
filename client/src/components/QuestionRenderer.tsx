import React, { useState, useEffect, useRef } from "react";
import { Question } from "@shared/schema";
import { AlertCircle, CheckCircle2, Lightbulb, Info, XCircle, ArrowRight, Highlighter, Bookmark, Eye, EyeOff, MoveRight, Menu, ChevronUp, ChevronDown } from "lucide-react";
import { cleanQuestionTitle } from '../utils/formatting';
import { motion, AnimatePresence } from "framer-motion";

interface QuestionRendererProps {
  question: Question;
  onAnswer: (answer: string | string[]) => void;
  userAnswer?: string | string[];
  showRationale?: boolean;
  isCorrect?: boolean;
  hideSubmitButton?: boolean; // Add this to hide submit button when in test view
}

export function QuestionRenderer({ 
  question, 
  onAnswer, 
  userAnswer, 
  showRationale = false,
  isCorrect = false,
  hideSubmitButton = false
}: QuestionRendererProps) {
  // Debug log for showRationale prop
  console.log(`QuestionRenderer for question ${question.id}: showRationale=${showRationale}, isCorrect=${isCorrect}`);

  // Validate question data to prevent errors
  if (!question || typeof question !== 'object') {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-700">
        <p className="font-medium">Error: Invalid question data</p>
        <p className="text-sm mt-2">The question data is missing or invalid.</p>
      </div>
    );
  }

  if (!question.id || !question.text || !question.type) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md text-yellow-700">
        <p className="font-medium">Warning: Incomplete question data</p>
        <p className="text-sm mt-2">The question is missing required fields (ID, text, or type).</p>
      </div>
    );
  }

  const [selectedAnswers, setSelectedAnswers] = useState<string[]>(
    Array.isArray(userAnswer) ? userAnswer : userAnswer ? [userAnswer] : []
  );
  const [textAnswer, setTextAnswer] = useState<string>(
    typeof userAnswer === 'string' ? userAnswer : ''
  );
  const [showHint, setShowHint] = useState(false);
  const [showKeyPoints, setShowKeyPoints] = useState(false);
  const [highlightedText, setHighlightedText] = useState("");
  const [showReferencePopup, setShowReferencePopup] = useState(false);
  const [showKeywordList, setShowKeywordList] = useState(false);

  // References for the question (hardcoded for now, would come from data in real app)
  const references = [
    "Potter, P. A., & Perry, A. G. (2021). Fundamentals of nursing (10th ed.). Mosby.",
    "Lewis, S. L., Bucher, L., Heitkemper, M. M., & Harding, M. M. (2022). Medical-surgical nursing: Assessment and management of clinical problems (11th ed.). Elsevier.",
    "Ignatavicius, D. D., Workman, M. L., & Rebar, C. R. (2021). Medical-surgical nursing: Concepts for interprofessional collaborative care (10th ed.). Elsevier."
  ];

  // Keywords for popup glossary (hardcoded for now)
  const keywords = [
    { word: "Hypoxemia", definition: "Abnormally low oxygen content in arterial blood." },
    { word: "Perfusion", definition: "The passage of fluid through the circulatory system to an organ or tissue." },
    { word: "Tachycardia", definition: "Abnormally rapid heart rate, usually defined as greater than 100 beats per minute." }
  ];

  // Determine question type
  const isMultiChoice = question.type === "mc";
  const isSelectAll = question.type === "sata";
  const isFillInBlank = question.type === "fill_in_blank";
  const isHotspot = question.type === "hotspot";
  const isOrderedResponse = question.type === "ordered-response";
  const isChartExhibit = question.type === "chart-exhibit";

  // Update answers based on props changes
  useEffect(() => {
    if (Array.isArray(userAnswer)) {
      setSelectedAnswers(userAnswer);
    } else if (userAnswer && typeof userAnswer === 'string') {
      if (isFillInBlank) {
        setTextAnswer(userAnswer);
      } else {
        setSelectedAnswers([userAnswer]);
      }
    }
  }, [userAnswer, isFillInBlank]);

  // Initialize ordered response items state on load
  useEffect(() => {
    if (isOrderedResponse && hasOrderedItems(question) && 
        (!selectedAnswers.length || selectedAnswers.length !== question.items.length)) {
      // If no selection yet, or selection is incomplete, initialize with current order
      const initialOrder = question.items.map(item => item.id);
      setSelectedAnswers(initialOrder);
    }
  }, [question, isOrderedResponse, selectedAnswers.length]);

  // Handle multi-choice selection
  const handleAnswerSelect = (choiceId: string) => {
    let newSelectedAnswers: string[];

    if (isMultiChoice) {
      // For multiple choice, only one answer can be selected
      newSelectedAnswers = [choiceId];
    } else if (isSelectAll) {
      // For select-all-that-apply, toggle the selection
      if (selectedAnswers.includes(choiceId)) {
        newSelectedAnswers = selectedAnswers.filter(id => id !== choiceId);
      } else {
        newSelectedAnswers = [...selectedAnswers, choiceId];
      }
    } else {
      // Default
      newSelectedAnswers = [choiceId];
    }

    setSelectedAnswers(newSelectedAnswers);
    
    // For multiple choice questions, we used to automatically notify the parent with select-all-that-apply
    // But now we want the user to explicitly submit their answer
    // We only auto-submit for standard multiple choice questions
    if (isMultiChoice) {
      onAnswer(newSelectedAnswers);
    }
  };

  // Handle fill-in-blank text input
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTextAnswer(e.target.value);
  };

  // Handle submit button click
  const handleSubmitAnswer = () => {
    if (isMultiChoice) {
      onAnswer(selectedAnswers[0] || "");
    } else if (isSelectAll) {
      // For select all that apply, send the array of selected answers
      onAnswer(selectedAnswers);
    } else if (isFillInBlank) {
      onAnswer(textAnswer);
    } else if (isHotspot) {
      onAnswer(selectedAnswers);
    } else {
      onAnswer(selectedAnswers);
    }
  };

  // Type guard functions
  const hasMCChoices = (q: Question): q is Extract<Question, { type: "mc" }> => {
    return q.type === "mc" && 'choices' in q;
  };

  const hasSATAChoices = (q: Question): q is Extract<Question, { type: "sata" }> => {
    return q.type === "sata" && 'choices' in q;
  };

  const hasFillInBlank = (q: Question): q is Extract<Question, { type: "fill_in_blank" }> => {
    return q.type === "fill_in_blank" && 'correctAnswer' in q;
  };

  const hasHotspotAreas = (q: Question): q is Extract<Question, { type: "hotspot" }> => {
    return q.type === "hotspot" && 'correctAreas' in q;
  };

  const hasOrderedItems = (q: Question): q is Extract<Question, { type: "ordered-response" }> => {
    return q.type === "ordered-response" && 'items' in q;
  };

  const hasChartExhibit = (q: Question): q is Extract<Question, { type: "chart-exhibit" }> => {
    return q.type === "chart-exhibit" && 'exhibitType' in q;
  };

  // Normalize answer strings by removing quotes if present
  const normalizeAnswerString = (value: string): string => {
    // Handle nested quotes from JSON stringification (e.g., "\"A\"") 
    // First try to parse it as JSON if it looks like a JSON string
    if ((value.startsWith('"') && value.endsWith('"')) || 
        (value.startsWith('\"') && value.endsWith('\"'))) {
      try {
        // Try to parse as JSON first - this handles cases like "\"A\""
        const parsed = JSON.parse(value);
        if (typeof parsed === 'string') {
          // If the result is still a string, it might have more quotes to remove
          return normalizeAnswerString(parsed); // Recursively normalize
        }
        return String(parsed);
      } catch (e) {
        // If parsing fails, just remove the outer quotes
        return value.substring(1, value.length - 1);
      }
    }
    // Return as is if no quotes
    return value;
  };

  // Get the correct answer with proper normalization
  const getCorrectAnswer = (q: Question): string | string[] => {
    if (q.type === "mc" && 'correctAnswer' in q) {
      // Normalize MC answers to remove any quotes
      return typeof q.correctAnswer === 'string' 
        ? normalizeAnswerString(q.correctAnswer)
        : q.correctAnswer;
    } else if (q.type === "sata" && 'correctAnswer' in q) {
      // Normalize each answer in the array
      return Array.isArray(q.correctAnswer) 
        ? q.correctAnswer.map(ans => typeof ans === 'string' ? normalizeAnswerString(ans) : ans)
        : q.correctAnswer;
    } else if (q.type === "fill_in_blank" && 'correctAnswer' in q) {
      // Normalize fill-in-blank answers
      return typeof q.correctAnswer === 'string' 
        ? normalizeAnswerString(q.correctAnswer)
        : q.correctAnswer;
    } else if (q.type === "hotspot" && 'correctAreas' in q) {
      return q.correctAreas.map(area => area.id);
    } else if (q.type === "ordered-response" && 'correctOrder' in q) {
      // Normalize ordered response answers
      return Array.isArray(q.correctOrder)
        ? q.correctOrder.map(item => typeof item === 'string' ? normalizeAnswerString(item) : item)
        : q.correctOrder;
    } else if (q.type === "chart-exhibit" && 'questions' in q && q.questions.length > 0) {
      const subAnswer = q.questions[0].correctAnswer;
      // Normalize chart/exhibit sub-question answers
      if (typeof subAnswer === 'string') {
        return normalizeAnswerString(subAnswer);
      } else if (Array.isArray(subAnswer)) {
        return subAnswer.map(ans => typeof ans === 'string' ? normalizeAnswerString(ans) : ans);
      }
      return subAnswer;
    }
    return "";
  };

  // Define letters for choice labeling
  const letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
  
  return (
    <div className="question-renderer">
      {/* Question Text */}
      <div className="question-text mb-6">
        <h3 className="text-lg font-medium mb-3 text-gray-900">{cleanQuestionTitle(question.title)}:</h3>
        <p className="text-gray-800 whitespace-pre-line">{question.text}</p>
        
        {/* Optional hint button */}
        {'hint' in question && (question as any).hint && (
          <div className="mt-3">
            <button 
              onClick={() => setShowHint(!showHint)}
              className="flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500"
            >
              <Info className="h-4 w-4 mr-1" />
              {showHint ? "Hide Hint" : "Show Hint"}
            </button>
            
            {showHint && (
              <div className="mt-2 p-3 bg-indigo-50 rounded-md text-sm text-indigo-700">
                {(question as any).hint}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Answer area */}
      <div className="answer-area mb-6">
        {/* Multiple Choice Question */}
        {isMultiChoice && hasMCChoices(question) && (
          <div className="multiple-choice-container">
            <div className="space-y-3">
              {question.choices.map((choice, index) => {
                const isSelected = selectedAnswers.includes(choice.id);
                const isCorrectChoice = showRationale && 
                  hasMCChoices(question) && 
                  normalizeAnswerString(String(question.correctAnswer)) === choice.id;
                
                let choiceStyle;
                if (showRationale) {
                  // When showing rationale, apply different styles based on correctness:
                  // 1. If this is the correct choice, highlight it in green
                  // 2. If user selected this but it's wrong, highlight in amber/orange
                  // 3. If not selected and not correct, just show normal style
                  if (isCorrectChoice) {
                    // This is the correct answer - always show in green
                    choiceStyle = "border-2 border-green-200 bg-green-50 p-3 flex items-start"; 
                  } else if (isSelected && !isCorrect) { 
                    // User selected this but it's wrong (only show red if their overall answer was wrong)
                    choiceStyle = "border-2 border-red-200 bg-red-50 p-3 flex items-start";
                  } else {
                    // Not selected and not correct
                    choiceStyle = "border border-gray-300 p-3 flex items-start";
                  }
                } else {
                  // When not showing rationale (during question answering)
                  choiceStyle = isSelected
                    ? "border-2 border-[#4B9CD3] bg-blue-50 p-3 flex items-start" 
                    : "border border-gray-300 p-3 hover:border-[#4B9CD3] hover:bg-blue-50 transition-colors flex items-start";
                }
                
                return (
                  <div 
                    key={choice.id}
                    data-choice-id={choice.id}
                    className={`rounded-md ${choiceStyle} ${showRationale ? '' : 'cursor-pointer'}`}
                    onClick={() => !showRationale && handleAnswerSelect(choice.id)}
                  >
                    <div className="flex-shrink-0 mr-3">
                      <div className={`h-7 w-7 rounded flex items-center justify-center font-medium text-sm
                        ${isSelected ? 'bg-[#4B9CD3] text-white' : 'bg-gray-100 text-gray-700'}`}
                      >
                        {letters[index]}
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-800">{choice.text}</p>
                    </div>
                    {showRationale && (
                      <div className="flex-shrink-0 ml-2">
                        {isCorrectChoice ? (
                          <CheckCircle2 className="h-5 w-5 text-green-600" />
                        ) : isSelected && !isCorrect ? (
                          <XCircle className="h-5 w-5 text-red-600" />
                        ) : null}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Select All That Apply Question */}
        {isSelectAll && hasSATAChoices(question) && (
          <div className="select-all-container">
            <p className="mb-3 text-sm font-medium text-gray-500">
              Select all that apply:
            </p>
            <div className="space-y-3">
              {question.choices.map((choice, index) => {
                const isSelected = selectedAnswers.includes(choice.id);
                const isCorrectChoice = showRationale && 
                  hasSATAChoices(question) && 
                  question.correctAnswer.includes(choice.id);
                
                let choiceStyle;
                if (showRationale) {
                  if (isCorrectChoice && isSelected) {
                    choiceStyle = "border-2 border-green-200 bg-green-50";
                  } else if (isCorrectChoice && !isSelected) {
                    choiceStyle = "border-2 border-amber-200 bg-amber-50"; // Should have selected
                  } else if (!isCorrectChoice && isSelected) {
                    choiceStyle = "border-2 border-red-200 bg-red-50"; // Incorrect selection
                  } else {
                    choiceStyle = "border border-gray-300"; // Correctly didn't select
                  }
                } else {
                  choiceStyle = isSelected
                    ? "border-2 border-[#4B9CD3] bg-blue-50" 
                    : "border border-gray-300 hover:border-[#4B9CD3] hover:bg-blue-50 transition-colors";
                }
                
                return (
                  <div 
                    key={choice.id}
                    className={`p-3 ${choiceStyle} rounded-md flex items-start ${showRationale ? '' : 'cursor-pointer'}`}
                    onClick={() => !showRationale && handleAnswerSelect(choice.id)}
                  >
                    <div 
                      className="flex-shrink-0 mr-3"
                      data-choice-id={choice.id}
                    >
                      <div className={`h-7 w-7 rounded flex items-center justify-center font-medium text-sm
                        ${isSelected ? 'bg-[#4B9CD3] text-white' : 'bg-gray-100 text-gray-700'}`}
                      >
                        {letters[index]}
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-800">{choice.text}</p>
                    </div>
                    {showRationale && (
                      <div className="flex-shrink-0 ml-2">
                        {isCorrectChoice ? (
                          <CheckCircle2 className="h-5 w-5 text-green-600" />
                        ) : isSelected ? (
                          <XCircle className="h-5 w-5 text-red-600" />
                        ) : null}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Fill in the Blank Question */}
        {isFillInBlank && hasFillInBlank(question) && (
          <div className="fill-in-blank-container">
            <div className="p-3 rounded-md border border-gray-300">
              <input 
                type="text" 
                value={textAnswer}
                onChange={handleTextChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#4B9CD3] focus:border-transparent"
                placeholder="Type your answer here..."
                disabled={showRationale}
              />
              
              {showRationale && (
                <div className={`p-3 rounded-md ${isCorrect ? 'bg-green-50 border border-green-200' : 'bg-amber-50 border border-amber-200'}`}>
                  <p className="text-sm font-medium mb-1">
                    {isCorrect ? "Correct" : "Incorrect"} - Expected Answer:
                  </p>
                  <p className="font-medium">
                    {getCorrectAnswer(question)}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Hotspot Question */}
        {isHotspot && hasHotspotAreas(question) && (
          <div className="hotspot-container">
            <div className="relative border border-gray-300 rounded-md overflow-hidden">
              {/* Image container with clickable areas */}
              <div className="relative">
                {'imageUrl' in question && (
                  <img 
                    src={question.imageUrl} 
                    alt="Hotspot image" 
                    className="w-full h-auto"
                  />
                )}
                
                {/* Clickable areas */}
                <div className="absolute top-0 left-0 w-full h-full">
                  {'areas' in question && question.areas && question.areas.map(area => {
                    // Determine if this area is selected
                    const isSelected = selectedAnswers.includes(area.id);
                    // Determine if this area is correct (for feedback)
                    const isCorrect = area.isCorrect;
                    
                    // Styles based on selection and correctness
                    let areaStyle = '';
                    if (showRationale) {
                      if (isSelected && isCorrect) {
                        areaStyle = 'border-2 border-green-500 bg-green-200 bg-opacity-30';
                      } else if (isSelected && !isCorrect) {
                        areaStyle = 'border-2 border-red-500 bg-red-200 bg-opacity-30';
                      } else if (!isSelected && isCorrect) {
                        areaStyle = 'border-2 border-yellow-500 bg-yellow-200 bg-opacity-30';
                      } else {
                        areaStyle = 'border border-transparent';
                      }
                    } else {
                      areaStyle = isSelected
                        ? 'border-2 border-[#4B9CD3] bg-blue-200 bg-opacity-30'
                        : 'border border-transparent hover:border-[#4B9CD3] hover:bg-blue-100 hover:bg-opacity-30';
                    }
                    
                    return (
                      <div
                        key={area.id}
                        className={`absolute cursor-pointer ${areaStyle}`}
                        style={{
                          top: `${area.top}%`,
                          left: `${area.left}%`,
                          width: `${area.width}%`,
                          height: `${area.height}%`,
                        }}
                        onClick={() => !showRationale && handleAnswerSelect(area.id)}
                      >
                        {showRationale && isCorrect && (
                          <CheckCircle2 className="absolute top-1 right-1 h-5 w-5 text-green-600" />
                        )}
                        {showRationale && isSelected && !isCorrect && (
                          <XCircle className="absolute top-1 right-1 h-5 w-5 text-red-600" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {/* Legend */}
              <div className="p-3 bg-gray-50 border-t border-gray-300">
                <p className="text-sm font-medium text-gray-700 mb-2">Click on the areas that match the criteria:</p>
                <p className="text-sm text-gray-600">{question.criteria || "Select all appropriate areas"}</p>
              </div>
            </div>
          </div>
        )}

        {/* Ordered Response Question */}
        {isOrderedResponse && hasOrderedItems(question) && (
          <div className="ordered-response-container">
            {!question.items || !Array.isArray(question.items) || question.items.length === 0 ? (
              <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-700">
                <p className="font-medium">Error: No items provided for ordered response question</p>
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  {question.items.map((item, index) => {
                    // Find the actual position of this item in the selected answer array
                    const currentPosition = selectedAnswers.findIndex(id => id === item.id);
                    const displayIndex = currentPosition !== -1 ? currentPosition : index;
                    
                    return (
                      <div 
                        key={item.id}
                        className="p-3 bg-white border border-gray-300 rounded-md flex items-center"
                      >
                        <div className="flex-shrink-0 mr-3">
                          <div className="h-7 w-7 rounded-full bg-gray-100 flex items-center justify-center font-medium text-gray-700">
                            {displayIndex + 1}
                          </div>
                        </div>
                        <div className="flex-1">
                          <p className="text-gray-800">{item.text}</p>
                        </div>
                        {!showRationale && (
                          <div className="flex-shrink-0 ml-3 space-x-2">
                            <button 
                              className="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-50"
                              onClick={() => {
                                // Move item up in the order (reduce index)
                                if (currentPosition > 0) {
                                  const newOrder = [...selectedAnswers];
                                  const temp = newOrder[currentPosition];
                                  newOrder[currentPosition] = newOrder[currentPosition - 1];
                                  newOrder[currentPosition - 1] = temp;
                                  setSelectedAnswers(newOrder);
                                }
                              }}
                              disabled={currentPosition <= 0}
                            >
                              <ChevronUp className="h-5 w-5" />
                            </button>
                            <button 
                              className="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-50"
                              onClick={() => {
                                // Move item down in the order (increase index)
                                if (currentPosition < selectedAnswers.length - 1) {
                                  const newOrder = [...selectedAnswers];
                                  const temp = newOrder[currentPosition];
                                  newOrder[currentPosition] = newOrder[currentPosition + 1];
                                  newOrder[currentPosition + 1] = temp;
                                  setSelectedAnswers(newOrder);
                                }
                              }}
                              disabled={currentPosition >= selectedAnswers.length - 1}
                            >
                              <ChevronDown className="h-5 w-5" />
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                
                {showRationale && 'correctOrder' in question && (
                  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
                    <h4 className="font-medium text-[#13294B] mb-2">Correct Order:</h4>
                    <ol className="list-decimal pl-5 space-y-2">
                      {Array.isArray(question.correctOrder) && question.correctOrder.map((itemId, index) => {
                        const item = question.items.find(i => i.id === itemId);
                        return (
                          <li key={itemId} className="text-gray-800">
                            {item?.text || `Item ${itemId}`}
                          </li>
                        );
                      })}
                    </ol>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Chart/Exhibit Question */}
        {isChartExhibit && hasChartExhibit(question) && (
          <div className="chart-exhibit-container">
            <div className="mb-6 border border-gray-300 rounded-md overflow-hidden">
              {/* Chart or Exhibit Container */}
              <div className="p-4 bg-white">
                {question.exhibitType === 'chart' && (
                  <div className="chart-container">
                    {/* If chart data is provided, render the appropriate chart */}
                    {'chartUrl' in question && (
                      <img 
                        src={question.chartUrl} 
                        alt="Chart data" 
                        className="max-w-full h-auto mx-auto"
                      />
                    )}
                  </div>
                )}
                
                {question.exhibitType === 'text' && (
                  <div className="text-exhibit p-4 bg-gray-50 rounded-md">
                    {'exhibitContent' in question && (
                      <p className="whitespace-pre-line text-gray-800">{question.exhibitContent}</p>
                    )}
                  </div>
                )}
                
                {question.exhibitType === 'lab' && (
                  <div className="lab-results">
                    {'labResults' in question && Array.isArray(question.labResults) && (
                      <table className="min-w-full divide-y divide-gray-300">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Test</th>
                            <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Result</th>
                            <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reference Range</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {question.labResults.map((result, index) => (
                            <tr key={index}>
                              <td className="py-2 px-4 text-sm text-gray-900">{result.name}</td>
                              <td className="py-2 px-4 text-sm text-gray-900">
                                <span 
                                  className={
                                    result.flagged ? 'font-bold text-red-600' : 'text-gray-900'
                                  }
                                >
                                  {result.value}
                                </span>
                              </td>
                              <td className="py-2 px-4 text-sm text-gray-600">{result.range}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                )}
              </div>
              
              {/* Sub-questions related to the chart/exhibit */}
              {'questions' in question && Array.isArray(question.questions) && question.questions.length > 0 && (
                <div className="border-t border-gray-300">
                  <div className="p-4 bg-gray-50">
                    <h4 className="font-medium text-gray-900 mb-3">{question.questions[0].text}</h4>
                    
                    {/* Sub-question choices */}
                    {'choices' in question.questions[0] && (
                      <div className="space-y-3">
                        {question.questions[0].choices.map((choice, index) => {
                          const isSelected = selectedAnswers.includes(choice.id);
                          const isCorrectChoice = showRationale && 
                            'correctAnswer' in question.questions[0] && 
                            (
                              Array.isArray(question.questions[0].correctAnswer)
                                ? question.questions[0].correctAnswer.includes(choice.id)
                                : question.questions[0].correctAnswer === choice.id
                            );
                          
                          let choiceStyle;
                          if (showRationale) {
                            if (isCorrectChoice) {
                              choiceStyle = "border-2 border-green-200 bg-green-50";
                            } else if (isSelected) {
                              choiceStyle = "border-2 border-red-200 bg-red-50";
                            } else {
                              choiceStyle = "border border-gray-300";
                            }
                          } else {
                            choiceStyle = isSelected
                              ? "border-2 border-[#4B9CD3] bg-blue-50"
                              : "border border-gray-300 hover:border-[#4B9CD3] hover:bg-blue-50";
                          }
                          
                          return (
                            <div 
                              key={choice.id}
                              className={`p-3 ${choiceStyle} rounded-md flex items-start ${showRationale ? '' : 'cursor-pointer'}`}
                              onClick={() => !showRationale && handleAnswerSelect(choice.id)}
                            >
                              <div className="flex-shrink-0 mr-3">
                                <div className={`h-6 w-6 rounded flex items-center justify-center font-medium text-sm
                                  ${isSelected ? 'bg-[#4B9CD3] text-white' : 'bg-gray-100 text-gray-700'}`}
                                >
                                  {letters[index]}
                                </div>
                              </div>
                              <div className="flex-1">
                                <p className="text-gray-800">{choice.text}</p>
                              </div>
                              {showRationale && (
                                <div className="flex-shrink-0 ml-2">
                                  {isCorrectChoice ? (
                                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                                  ) : isSelected ? (
                                    <XCircle className="h-5 w-5 text-red-600" />
                                  ) : null}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Submit button - only show if not already showing rationale and answers exist */}
        {!hideSubmitButton && !showRationale && (
          <div className="mt-6">
            <button 
              onClick={handleSubmitAnswer}
              disabled={
                (isMultiChoice && selectedAnswers.length === 0) ||
                (isSelectAll && selectedAnswers.length === 0) ||
                (isFillInBlank && textAnswer.trim() === '')
              }
              className="bg-[#13294B] text-white px-4 py-2 rounded-md hover:bg-[#0d1f3a] focus:outline-none focus:ring-2 focus:ring-[#4B9CD3] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Submit Answer
            </button>
          </div>
        )}
      </div>
      
      {/* Rationale area - only show after answering */}
      {showRationale && (
        <div className="rationale-area mt-8">
          <div className={`p-5 rounded-lg border-2 ${isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
            <div className="flex items-center mb-4">
              {isCorrect ? (
                <CheckCircle2 className="h-6 w-6 text-green-600 mr-2" />
              ) : (
                <XCircle className="h-6 w-6 text-red-600 mr-2" />
              )}
              <h4 className={isCorrect ? 'text-green-800' : 'text-red-800'}>
                {isCorrect ? 'Correct Answer' : 'Incorrect Answer'}
              </h4>
            </div>
            
            <div className="rationale-content">
              <h5 className="font-medium mb-2">Rationale:</h5>
              <p className="text-gray-800 mb-3 whitespace-pre-line">{question.rationale}</p>
              
              <div className="expected-answer mb-4">
                <h5 className="font-medium mb-1">Expected Answer:</h5>
                <div className="text-gray-800">
                  {Array.isArray(getCorrectAnswer(question)) ? (
                    getCorrectAnswer(question) as string[]
                  ) : (
                    getCorrectAnswer(question)
                  )}
                </div>
              </div>
            </div>
            
            {/* Optional learning tools */}
            <div className="learning-tools border-t border-gray-300 pt-3 mt-3">
              <div className="flex flex-wrap gap-2">
                <button 
                  onClick={() => setShowKeyPoints(!showKeyPoints)}
                  className="flex items-center text-sm bg-white px-3 py-1 rounded-md border border-gray-300 hover:bg-gray-50"
                >
                  <Lightbulb className="h-4 w-4 mr-1 text-amber-500" />
                  Key Points
                </button>
                
                <button 
                  onClick={() => setShowReferencePopup(!showReferencePopup)}
                  className="flex items-center text-sm bg-white px-3 py-1 rounded-md border border-gray-300 hover:bg-gray-50"
                >
                  <Bookmark className="h-4 w-4 mr-1 text-blue-500" />
                  References
                </button>
                
                <button 
                  onClick={() => setShowKeywordList(!showKeywordList)}
                  className="flex items-center text-sm bg-white px-3 py-1 rounded-md border border-gray-300 hover:bg-gray-50"
                >
                  <Highlighter className="h-4 w-4 mr-1 text-purple-500" />
                  Key Terms
                </button>
              </div>
              
              {/* Key Points Panel */}
              <AnimatePresence>
                {showKeyPoints && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-3 overflow-hidden"
                  >
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-md">
                      <h5 className="font-medium text-amber-800 mb-2">Key Learning Points:</h5>
                      <ul className="list-disc pl-5 space-y-1 text-amber-900">
                        <li>Oxygen saturation below 90% requires immediate intervention.</li>
                        <li>Hypoxemia can rapidly progress to respiratory failure.</li>
                        <li>Prioritize assessment findings based on ABC (Airway, Breathing, Circulation).</li>
                        <li>Normal oxygen saturation is 95-100% in most adults.</li>
                      </ul>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              
              {/* References Popup */}
              <AnimatePresence>
                {showReferencePopup && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-3 overflow-hidden"
                  >
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                      <h5 className="font-medium text-blue-800 mb-2">References:</h5>
                      <ul className="space-y-1 text-blue-900 text-sm">
                        {references.map((ref, index) => (
                          <li key={index}>{ref}</li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              
              {/* Key Terms Glossary */}
              <AnimatePresence>
                {showKeywordList && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-3 overflow-hidden"
                  >
                    <div className="p-3 bg-purple-50 border border-purple-200 rounded-md">
                      <h5 className="font-medium text-purple-800 mb-2">Key Terms:</h5>
                      <dl className="space-y-2">
                        {keywords.map((term, index) => (
                          <div key={index}>
                            <dt className="font-medium text-purple-900">{term.word}</dt>
                            <dd className="text-purple-800 text-sm ml-4">{term.definition}</dd>
                          </div>
                        ))}
                      </dl>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
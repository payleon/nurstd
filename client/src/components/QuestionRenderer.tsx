import React, { useState, useEffect, useRef } from "react";
import { Question } from "@shared/schema";
import { AlertCircle, CheckCircle2, Lightbulb, Info, XCircle, ArrowRight, Highlighter, Bookmark, Eye, EyeOff, MoveRight, Menu, ChevronUp, ChevronDown } from "lucide-react";
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
    
    // For select-all-that-apply, automatically notify parent
    if (isSelectAll) {
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
    return q.type === "fill_in_blank" && 'answer' in q;
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

  const getCorrectAnswer = (q: Question): string | string[] => {
    if (q.type === "mc" && 'correctAnswer' in q) {
      return q.correctAnswer;
    } else if (q.type === "sata" && 'correctAnswers' in q) {
      return q.correctAnswers;
    } else if (q.type === "fill_in_blank" && 'answer' in q) {
      return q.answer;
    } else if (q.type === "hotspot" && 'correctAreas' in q) {
      return q.correctAreas.map(area => area.id);
    } else if (q.type === "ordered-response" && 'correctOrder' in q) {
      return q.correctOrder;
    } else if (q.type === "chart-exhibit" && 'questions' in q && q.questions.length > 0) {
      return q.questions[0].correctAnswer;
    }
    return "";
  };

  // Define letters for choice labeling
  const letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];

  return (
    <div className="question-renderer">
      {/* Question Text */}
      <div className="question-text mb-6">
        <h3 className="text-lg font-medium mb-3 text-gray-900">{question.title || "Question"}:</h3>
        <p className="text-gray-800 whitespace-pre-line">{question.text}</p>
        
        {/* Optional hint button */}
        {question.hint && (
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
                {question.hint}
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
                  question.correctAnswer === choice.id;
                
                let choiceStyle;
                if (showRationale) {
                  choiceStyle = isCorrectChoice
                    ? "border-2 border-green-200 bg-green-50 p-3 flex items-start"
                    : isSelected
                    ? "border-2 border-amber-200 bg-amber-50 p-3 flex items-start" 
                    : "border border-gray-300 p-3 flex items-start";
                } else {
                  choiceStyle = isSelected
                    ? "border-2 border-[#4B9CD3] bg-blue-50 p-3 flex items-start" 
                    : "border border-gray-300 p-3 hover:border-[#4B9CD3] hover:bg-blue-50 transition-colors flex items-start";
                }
                
                return (
                  <div 
                    key={choice.id}
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
                  question.correctAnswers.includes(choice.id);
                
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
                    <div className="flex-shrink-0 mr-3">
                      <div className={`h-6 w-6 flex items-center justify-center rounded-md
                        ${isSelected ? 'bg-[#4B9CD3] text-white' : 'border border-gray-300 bg-white'}`}
                      >
                        {isSelected && <CheckCircle2 className="h-4 w-4" />}
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
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Answer:
              </label>
              <input 
                type="text" 
                value={textAnswer}
                onChange={handleTextChange}
                disabled={showRationale}
                className={`w-full p-3 border ${showRationale ? 'bg-gray-100' : ''} rounded-md focus:ring-blue-500 focus:border-blue-500`}
                placeholder="Type your answer here"
              />
            </div>
            
            {showRationale && (
              <div className="mt-3">
                <div className={`p-3 rounded-md ${isCorrect ? 'bg-green-50 border border-green-200' : 'bg-amber-50 border border-amber-200'}`}>
                  <div className="font-medium mb-1">
                    {isCorrect ? "Correct" : "Incorrect"} - Expected Answer:
                  </div>
                  <div className="text-sm">
                    {Array.isArray(question.answer) 
                      ? question.answer.join(" OR ") 
                      : question.answer}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Hotspot Question */}
        {isHotspot && hasHotspotAreas(question) && (
          <div className="hotspot-container">
            {!question.imagePath ? (
              <p className="text-red-500">Error: No image provided for hotspot question</p>
            ) : (
              <div className="relative border border-gray-300 rounded-md overflow-hidden">
                <img 
                  src={question.imagePath} 
                  alt="Hotspot image" 
                  className="max-w-full h-auto"
                  onError={(e) => {
                    console.error(`Failed to load hotspot image: ${question.imagePath}`);
                    e.currentTarget.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="400" height="300" fill="%23f3f4f6" /><text x="50%" y="50%" font-family="sans-serif" font-size="14" text-anchor="middle" fill="%236b7280">Image failed to load</text></svg>';
                  }}
                  loading="eager"
                />
                
                {/* Combine correctAreas and distractorAreas for combined display */}
                {(() => {
                  // Create a combined array of all areas to display
                  const allAreas = [
                    ...question.correctAreas.map(area => ({
                      ...area,
                      top: area.y, // Map y to top for positioning
                      left: area.x, // Map x to left for positioning
                      isCorrect: true
                    })),
                    ...(question.distractorAreas || []).map(area => ({
                      ...area,
                      top: area.y,
                      left: area.x,
                      isCorrect: false
                    }))
                  ];
                  
                  return allAreas.map(area => {
                    const isSelected = selectedAnswers.includes(area.id);
                    const isCorrect = area.isCorrect;
                    
                    let areaStyle = "absolute border-2 cursor-pointer";
                    if (showRationale) {
                      if (isSelected && isCorrect) {
                        areaStyle = "absolute border-2 border-green-500 bg-green-200 bg-opacity-50";
                      } else if (isSelected && !isCorrect) {
                        areaStyle = "absolute border-2 border-red-500 bg-red-200 bg-opacity-50";
                      } else if (!isSelected && isCorrect) {
                        areaStyle = "absolute border-2 border-green-500 bg-green-200 bg-opacity-30";
                      } else {
                        areaStyle = "absolute border-2 border-transparent";
                      }
                    } else {
                      areaStyle = isSelected 
                        ? "absolute border-2 border-blue-500 bg-blue-200 bg-opacity-50" 
                        : "absolute border-2 border-transparent hover:border-blue-500 hover:bg-blue-100 hover:bg-opacity-25 cursor-pointer";
                    }
                    
                    return (
                      <div
                        key={area.id}
                        className={areaStyle}
                        style={{
                          top: `${area.top}%`,
                          left: `${area.left}%`,
                          width: `${area.width}%`,
                          height: `${area.height}%`,
                        }}
                        onClick={() => {
                          if (!showRationale) {
                            const newSelectedAreas = isSelected
                              ? selectedAnswers.filter(id => id !== area.id)
                              : [...selectedAnswers, area.id];
                            setSelectedAnswers(newSelectedAreas);
                            // Notify parent component
                            onAnswer(newSelectedAreas);
                          }
                        }}
                      >
                        {showRationale && isCorrect && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <CheckCircle2 className="h-8 w-8 text-green-600" />
                          </div>
                        )}
                        {showRationale && isSelected && !isCorrect && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <XCircle className="h-8 w-8 text-red-600" />
                          </div>
                        )}
                      </div>
                    );
                  });
                })()}
              </div>
            )}
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
                          <p className="text-[15px]">{item.text}</p>
                        </div>
                        <div className="flex-shrink-0 flex space-x-1">
                          {/* Move up button - disabled for first item */}
                          <button
                            className={`p-1 rounded ${displayIndex === 0 ? 'text-gray-300' : 'text-blue-500 hover:bg-blue-50'}`}
                            disabled={displayIndex === 0 || showRationale}
                            onClick={() => {
                              if (displayIndex > 0 && !showRationale) {
                                // Get current selected answers (item IDs in order)
                                const currentOrder = [...selectedAnswers];
                                // Swap this item with the one above it
                                const temp = currentOrder[displayIndex];
                                currentOrder[displayIndex] = currentOrder[displayIndex - 1];
                                currentOrder[displayIndex - 1] = temp;
                                // Update state and notify parent
                                setSelectedAnswers(currentOrder);
                                onAnswer(currentOrder);
                              }
                            }}
                            aria-label="Move item up"
                          >
                            <ChevronUp className="h-4 w-4" />
                          </button>
                          {/* Move down button - disabled for last item */}
                          <button
                            className={`p-1 rounded ${displayIndex === question.items.length - 1 ? 'text-gray-300' : 'text-blue-500 hover:bg-blue-50'}`}
                            disabled={displayIndex === question.items.length - 1 || showRationale}
                            onClick={() => {
                              if (displayIndex < question.items.length - 1 && !showRationale) {
                                // Get current selected answers (item IDs in order)
                                const currentOrder = [...selectedAnswers];
                                // Swap this item with the one below it
                                const temp = currentOrder[displayIndex];
                                currentOrder[displayIndex] = currentOrder[displayIndex + 1];
                                currentOrder[displayIndex + 1] = temp;
                                // Update state and notify parent
                                setSelectedAnswers(currentOrder);
                                onAnswer(currentOrder);
                              }
                            }}
                            aria-label="Move item down"
                          >
                            <ChevronDown className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-4 text-center text-sm text-gray-600 bg-blue-50 p-3 rounded-md">
                  <p className="font-medium">Instructions:</p>
                  <p>Use the up/down arrows to reorder the items. The current order will be submitted as your answer.</p>
                  <p className="text-xs mt-1 text-gray-500">(Full drag and drop functionality coming soon)</p>
                </div>
              </>
            )}
          </div>
        )}

        {/* Chart/Exhibit Question */}
        {isChartExhibit && hasChartExhibit(question) && (
          <div className="chart-exhibit-container">
            <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-md">
              <h4 className="font-medium text-gray-700 mb-3">{question.exhibitType.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</h4>

              {/* Lab Results Table */}
              {question.exhibitType === 'lab-results' && (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                      <tr>
                        <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Test</th>
                        <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Result</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {Object.entries(question.exhibitData).map(([category, tests]) => (
                        <React.Fragment key={category}>
                          <tr className="bg-gray-50">
                            <td colSpan={2} className="px-4 py-2 text-sm font-medium text-gray-700">{category}</td>
                          </tr>
                          {Object.entries(tests as Record<string, string>).map(([test, result]) => (
                            <tr key={`${category}-${test}`}>
                              <td className="px-4 py-2 text-sm text-gray-700">{test}</td>
                              <td className="px-4 py-2 text-sm text-gray-700">{result}</td>
                            </tr>
                          ))}
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Other exhibit types would be handled here */}
            </div>

            {/* Sub-questions for this chart/exhibit */}
            <div className="space-y-6">
              {question.questions.map((subQuestion, idx) => (
                <div key={subQuestion.id} className="p-4 border border-gray-200 rounded-md">
                  <p className="font-medium text-gray-800 mb-3">{idx + 1}. {subQuestion.text}</p>

                  <div className="space-y-2">
                    {subQuestion.choices.map((choice, choiceIdx) => (
                      <div 
                        key={choice.id}
                        className="flex items-start p-3 border border-gray-200 rounded-md hover:border-blue-300 cursor-pointer"
                        onClick={() => {
                          if (!showRationale) {
                            // For simplicity, we're just using the first subquestion
                            // In a real app with multiple sub-questions, you'd need to track state separately
                            setSelectedAnswers([choice.id]);
                            // Notify parent component of the chosen answer
                            onAnswer([choice.id]);
                          }
                        }}
                      >
                        <div className="flex-shrink-0 mr-3">
                          <div className="h-6 w-6 rounded-full bg-gray-100 flex items-center justify-center font-medium text-gray-700 text-sm">
                            {letters[choiceIdx]}
                          </div>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm">{choice.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Submit Button for applicable questions - hidden in test view */}
        {!showRationale && (isMultiChoice || isFillInBlank || isHotspot || isChartExhibit) && !hideSubmitButton && (
          <div className="mt-6">
            <button
              onClick={handleSubmitAnswer}
              className="px-6 py-3 bg-[#13294B] text-white rounded-md hover:bg-[#0A1E3A] transition-colors flex items-center"
              disabled={
                (isMultiChoice && selectedAnswers.length === 0) || 
                (isFillInBlank && textAnswer.trim() === '')
              }
            >
              Submit Answer <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {/* Rationale Section */}
      {showRationale && question.rationale && (
        <div className="mt-6">
          <div className={`p-5 rounded-lg border-2 ${isCorrect ? 'border-green-200 bg-green-50' : 'border-amber-200 bg-amber-50'}`}>
            <div className="flex items-center font-medium text-lg mb-3">
              {isCorrect ? (
                <CheckCircle2 className="mr-2 text-green-600 h-6 w-6" />
              ) : (
                <AlertCircle className="mr-2 text-amber-600 h-6 w-6" />
              )}
              <h4 className={isCorrect ? 'text-green-800' : 'text-amber-800'}>
                {isCorrect ? 'Correct Answer' : 'Incorrect Answer'}
              </h4>
            </div>

            <div className="mb-4 pb-4 border-b border-dashed border-gray-300">
              <span className="font-medium text-gray-700">Expected Answer: </span>
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-medium">
                {Array.isArray(getCorrectAnswer(question)) ? (
                  (getCorrectAnswer(question) as string[]).join(', ')
                ) : (
                  getCorrectAnswer(question)
                )}
              </span>
            </div>

            <div className="rationale">
              <h5 className="font-medium mb-2 flex items-center text-gray-800">
                <Lightbulb className="h-5 w-5 text-amber-500 mr-2" />
                Rationale:
              </h5>
              <div className="text-gray-700 leading-relaxed bg-white rounded-md p-4 border border-gray-200">
                {question.rationale}
              </div>

              {/* NCLEX Test-Taking Strategy */}
              <div className="mt-4 bg-blue-50 border border-blue-200 rounded-md p-4">
                <h5 className="font-medium mb-2 text-blue-800">Test-Taking Strategy:</h5>
                <p className="text-sm text-blue-700">
                  Use the process of elimination to rule out incorrect options. Remember to prioritize nursing actions according to Maslow's hierarchy of needs, with physiological needs taking precedence. Also, apply the nursing process (assess, diagnose, plan, implement, evaluate) to determine the appropriate nursing action.
                </p>
              </div>

              {/* Related Topics */}
              <div className="mt-4">
                <h5 className="font-medium mb-2 text-gray-700">Related Topics:</h5>
                <div className="flex flex-wrap gap-2">
                  {["Patient Safety", "Nursing Process", "Prioritization", "Communication"].map((topic, idx) => (
                    <span key={idx} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* References Popup */}
      {showReferencePopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowReferencePopup(false)}>
          <div className="bg-white rounded-lg max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold mb-3 text-[#13294B]">References</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              {references.map((ref, idx) => (
                <li key={idx} className="flex items-start">
                  <MoveRight className="h-4 w-4 mr-2 mt-0.5 text-gray-400" />
                  {ref}
                </li>
              ))}
            </ul>
            <button 
              className="mt-4 px-4 py-2 bg-gray-100 text-gray-700 rounded-md w-full hover:bg-gray-200 transition-colors"
              onClick={() => setShowReferencePopup(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Keywords Popup */}
      {showKeywordList && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowKeywordList(false)}>
          <div className="bg-white rounded-lg max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold mb-3 text-[#13294B]">Key Terms</h3>
            <div className="space-y-3">
              {keywords.map((keyword, idx) => (
                <div key={idx} className="border-b border-gray-100 pb-2 last:border-0">
                  <div className="font-medium text-blue-700">{keyword.word}</div>
                  <div className="text-sm text-gray-600">{keyword.definition}</div>
                </div>
              ))}
            </div>
            <button 
              className="mt-4 px-4 py-2 bg-gray-100 text-gray-700 rounded-md w-full hover:bg-gray-200 transition-colors"
              onClick={() => setShowKeywordList(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
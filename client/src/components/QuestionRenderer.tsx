import React, { useState, useEffect, useRef } from "react";
import { Question } from "@shared/schema";
import { AlertCircle, CheckCircle2, Lightbulb, Info, XCircle, ArrowRight, Highlighter, Bookmark, Eye, EyeOff, MoveRight, Menu } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
  const [showHint, setShowHint] = useState(false);
  const [showKeyPoints, setShowKeyPoints] = useState(false);
  const [highlightedText, setHighlightedText] = useState("");
  const [highlights, setHighlights] = useState<string[]>([]);
  const [showReferencePopup, setShowReferencePopup] = useState(false);
  const [showKeywordList, setShowKeywordList] = useState(false);
  
  const questionContentRef = useRef<HTMLDivElement>(null);
  
  // Reset state when question changes
  useEffect(() => {
    setSelectedAnswers(Array.isArray(userAnswer) ? userAnswer : userAnswer ? [userAnswer] : []);
    setTextAnswer(typeof userAnswer === 'string' ? userAnswer : '');
    setShowHint(false);
    setShowKeyPoints(false);
    setHighlights([]);
    setShowReferencePopup(false);
  }, [question.id, userAnswer]);
  
  const isSingleChoice = question.type === "mc";
  const isMultiChoice = question.type === "sata";
  const isFillInBlank = question.type === "fill_in_blank";
  
  // Mock data for demonstration
  const hint = "Look for interventions that ensure patient safety first.";
  const keyPoints = [
    "Remember the ABCs (Airway, Breathing, Circulation) of patient care",
    "Prioritize Maslow's hierarchy when determining needs",
    "Consider therapeutic communication principles"
  ];
  const keywords = [
    { word: "prioritize", definition: "To arrange in order of importance" },
    { word: "safety", definition: "Freedom from harm or danger" },
    { word: "assess", definition: "To evaluate or estimate" }
  ];
  const references = [
    "Potter, P., & Perry, A. (2021). Fundamentals of Nursing, 10th ed.",
    "Lewis, S. (2019). Medical-Surgical Nursing, 11th ed."
  ];
  
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
  
  const handleMouseUp = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim().length > 0) {
      setHighlightedText(selection.toString().trim());
      
      // Save the highlight
      if (selection.toString().trim().length > 0) {
        setHighlights([...highlights, selection.toString().trim()]);
      }
    }
  };
  
  // Letter options for choices
  const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

  return (
    <div className="question-container">
      {/* Toolbar */}
      <div className="flex justify-between items-center mb-4 bg-gray-100 rounded-md p-2">
        <div className="flex space-x-2">
          <button 
            className={`text-sm px-3 py-1.5 rounded-md flex items-center ${showHint ? 'bg-amber-100 text-amber-800' : 'hover:bg-gray-200'}`}
            onClick={() => setShowHint(!showHint)}
          >
            <Lightbulb className="h-4 w-4 mr-1.5" />
            Hint
          </button>
          <button 
            className={`text-sm px-3 py-1.5 rounded-md flex items-center ${showKeyPoints ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-200'}`}
            onClick={() => setShowKeyPoints(!showKeyPoints)}
          >
            <Info className="h-4 w-4 mr-1.5" />
            Key Points
          </button>
        </div>
        <div className="flex space-x-2">
          <button 
            className="text-sm px-3 py-1.5 rounded-md flex items-center hover:bg-gray-200"
            onClick={() => setShowKeywordList(!showKeywordList)}
          >
            <Menu className="h-4 w-4 mr-1.5" />
            Keywords
          </button>
          <button 
            className="text-sm px-3 py-1.5 rounded-md flex items-center hover:bg-gray-200"
            onClick={() => setShowReferencePopup(!showReferencePopup)}
          >
            <Bookmark className="h-4 w-4 mr-1.5" />
            References
          </button>
        </div>
      </div>
      
      {/* Hint Panel */}
      <AnimatePresence>
        {showHint && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="mb-4 overflow-hidden"
          >
            <div className="bg-amber-50 border border-amber-200 rounded-md p-3 flex items-start">
              <Lightbulb className="h-5 w-5 text-amber-500 mr-2 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-amber-800 mb-1">Study Hint</p>
                <p className="text-sm text-amber-700">{hint}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Key Points Panel */}
      <AnimatePresence>
        {showKeyPoints && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="mb-4 overflow-hidden"
          >
            <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
              <p className="font-medium text-blue-800 mb-2 flex items-center">
                <Info className="h-5 w-5 mr-2" />
                NCLEX Key Points
              </p>
              <ul className="space-y-1 text-sm text-blue-700 pl-7 list-disc">
                {keyPoints.map((point, idx) => (
                  <li key={idx}>{point}</li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Question Content */}
      <div 
        className="question-header mb-6 bg-white rounded-lg p-5 border border-gray-200 shadow-sm"
        ref={questionContentRef}
        onMouseUp={handleMouseUp}
      >
        <div className="question-stem">
          <div className="flex justify-between items-start mb-3">
            <span className="inline-flex items-center justify-center rounded-md bg-[#13294B] text-xs font-medium text-white px-2 py-1">NCLEX-RN Style</span>
            <span className="text-xs text-gray-500">{question.type === "mc" ? "Multiple Choice" : question.type === "sata" ? "Select All That Apply" : "Fill in the Blank"}</span>
          </div>
          
          <h3 className="text-lg font-bold text-[#13294B] mb-3">{question.title}</h3>
          <div className="text-gray-800 text-base leading-relaxed">
            {/* Real questions would have complex formatting - this is a simplified version */}
            <p>{question.text}</p>
            
            {/* Highlighted text will be shown here */}
            {highlights.length > 0 && (
              <div className="mt-3 pt-3 border-t border-dashed border-gray-300">
                <p className="text-xs font-medium text-gray-500 mb-2 flex items-center">
                  <Highlighter className="h-3 w-3 mr-1" />
                  Your Highlights:
                </p>
                <div className="flex flex-wrap gap-2">
                  {highlights.map((highlight, idx) => (
                    <span key={idx} className="bg-yellow-100 text-xs px-2 py-1 rounded">
                      "{highlight}"
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Answer Section */}
      <div className="answer-section bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
        <div className="text-sm text-gray-500 mb-4 flex items-center">
          <p>
            {isFillInBlank ? (
              "Type your answer in the field below"
            ) : isMultiChoice ? (
              <span className="flex items-center">
                <span className="font-medium mr-1">Instructions:</span> Select all answer choices that apply
              </span>
            ) : (
              <span className="flex items-center">
                <span className="font-medium mr-1">Instructions:</span> Select the correct answer
              </span>
            )}
          </p>
        </div>
        
        {isFillInBlank ? (
          <div className="fill-blank-container">
            <input
              type="text"
              className="w-full p-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4B9CD3] focus:border-transparent text-base"
              placeholder="Enter your answer here..."
              value={textAnswer}
              onChange={handleTextInputChange}
              disabled={showRationale}
            />
          </div>
        ) : (
          <>
            <div className="answer-options space-y-3">
              {question.choices?.map((choice, index) => {
                const isSelected = selectedAnswers.includes(choice.id);
                const isCorrectChoice = Array.isArray(question.correctAnswer) 
                  ? question.correctAnswer.includes(choice.id) 
                  : question.correctAnswer === choice.id;
                
                // Determine styling for answered questions when showing rationale
                let choiceStyle = "border-2 border-gray-200 hover:border-[#4B9CD3] transition-colors";
                if (showRationale) {
                  if (isCorrectChoice) {
                    choiceStyle = "border-2 border-green-500 bg-green-50";
                  } else if (isSelected && !isCorrectChoice) {
                    choiceStyle = "border-2 border-red-500 bg-red-50";
                  }
                } else if (isSelected) {
                  choiceStyle = "border-2 border-[#4B9CD3] bg-blue-50";
                }
                
                return (
                  <div 
                    key={choice.id}
                    className={`rounded-md ${choiceStyle} ${showRationale ? '' : 'cursor-pointer'}`}
                    onClick={() => !showRationale && handleAnswerSelect(choice.id)}
                  >
                    <div className="flex items-start p-4">
                      <div className="flex-shrink-0 mr-3">
                        <div className={`h-7 w-7 rounded-full flex items-center justify-center font-medium ${
                          isSelected ? 'bg-[#4B9CD3] text-white' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {letters[index]}
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="text-[15px] leading-relaxed">{choice.text}</p>
                      </div>
                    </div>
                    
                    {/* Rationale specific to each option - shown when the answer is revealed */}
                    {showRationale && (
                      <div className={`text-sm p-3 rounded-b-md ${
                        isCorrectChoice ? 'bg-green-100 text-green-800' : 
                        (isSelected && !isCorrectChoice) ? 'bg-red-100 text-red-800' : 'hidden'
                      }`}>
                        {isCorrectChoice ? (
                          <div className="flex items-start">
                            <CheckCircle2 className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                            <span><span className="font-semibold">Correct. </span>This answer represents the best nursing action for the situation described.</span>
                          </div>
                        ) : (isSelected && !isCorrectChoice) ? (
                          <div className="flex items-start">
                            <XCircle className="h-4 w-4 text-red-600 mr-2 mt-0.5" />
                            <span><span className="font-semibold">Incorrect. </span>This option is not the best nursing action for this scenario.</span>
                          </div>
                        ) : null}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}
        
        {/* Submit Button for SATA and Fill in Blank questions */}
        {!showRationale && (isMultiChoice || isFillInBlank) && (
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
                {Array.isArray(question.correctAnswer) ? (
                  question.correctAnswer.join(', ')
                ) : (
                  question.correctAnswer
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
              className="mt-4 w-full py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-sm transition-colors"
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
            <h3 className="text-lg font-bold mb-3 text-[#13294B]">Important Keywords</h3>
            <div className="space-y-3">
              {keywords.map((keyword, idx) => (
                <div key={idx} className="border-b border-gray-100 pb-2 last:border-0">
                  <div className="font-medium text-[#13294B]">{keyword.word}</div>
                  <div className="text-sm text-gray-600">{keyword.definition}</div>
                </div>
              ))}
            </div>
            <button 
              className="mt-4 w-full py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-sm transition-colors"
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
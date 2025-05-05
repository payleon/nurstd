import React, { useState } from 'react';
import { CheckCircle, HelpCircle, ExternalLink } from 'lucide-react';
import { LearningPathNode } from '@/lib/learning-path';

// Content header component
const ContentHeader = ({ title }: { title: string }) => (
  <h3 className="text-xl font-semibold text-blue-900 mb-3">{title}</h3>
);

// Quiz content component with streamlined UI
export const QuizContent = ({ node }: { node: LearningPathNode }) => {
  // State management
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{[key: number]: number}>({});
  const [showResults, setShowResults] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  
  // Generate topic-specific quiz questions
  const titleLower = node.title.toLowerCase();
  
  // Sample questions based on topic
  const questions = [
    {
      question: `Which of the following best describes a key principle of ${node.title}?`,
      options: [
        'Focusing exclusively on medical interventions',
        'Prioritizing patient needs based on assessment data',
        'Delegating all care responsibilities to support staff',
        'Documenting only when adverse events occur'
      ],
      correctAnswer: 1,
      rationale: "Prioritizing patient needs based on assessment data is a fundamental nursing principle that emphasizes evidence-based, patient-centered care."
    },
    {
      question: 'Which nursing action demonstrates appropriate clinical judgment?',
      options: [
        'Implementing interventions without assessing the patient',
        'Following the care plan without considering changes in patient status',
        'Assessing the patient\'s response to interventions and adjusting care accordingly',
        'Documenting findings without reporting abnormal results'
      ],
      correctAnswer: 2,
      rationale: "Clinical judgment involves continuous assessment and adaptation. Assessing the patient's response to interventions and adjusting care accordingly demonstrates the iterative nature of the nursing process."
    },
    {
      question: 'A priority nursing intervention for a patient with decreased tissue perfusion would be:',
      options: [
        'Administering prescribed oxygen therapy',
        'Documenting vital signs every shift',
        'Scheduling family visits',
        'Planning discharge education'
      ],
      correctAnswer: 0,
      rationale: "For decreased tissue perfusion, improving oxygenation is the priority intervention to prevent tissue hypoxia and further complications."
    }
  ];
  
  // Event handlers
  const handleAnswerSelect = (questionIndex: number, answerIndex: number) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionIndex]: answerIndex
    });
    setShowExplanation(true);
  };
  
  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setShowExplanation(false);
    } else {
      setShowResults(true);
    }
  };
  
  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setShowExplanation(false);
    }
  };
  
  const handleRetry = () => {
    setCurrentQuestion(0);
    setSelectedAnswers({});
    setShowResults(false);
    setShowExplanation(false);
  };
  
  const calculateScore = () => {
    let correct = 0;
    questions.forEach((q, index) => {
      if (selectedAnswers[index] === q.correctAnswer) {
        correct++;
      }
    });
    return Math.round((correct / questions.length) * 100);
  };

  return (
    <div className="quiz-content">
      <ContentHeader title={node.title} />
      <p className="mb-6">{node.description}</p>
      
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-4">
        {!showResults ? (
          // Quiz interface
          <>
            <div className="flex items-center mb-4">
              <div className="bg-purple-100 rounded-full p-2 mr-3">
                <HelpCircle className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-medium">Assessment Quiz: {node.title}</h3>
            </div>
            
            <div className="flex justify-between items-center mb-4">
              <div className="text-sm font-medium text-gray-500">
                Question {currentQuestion + 1} of {questions.length}
              </div>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-1.5 mb-6">
              <div 
                className="h-1.5 rounded-full bg-blue-600"
                style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              ></div>
            </div>
            
            <div className="mb-8">
              <h4 className="text-lg font-medium mb-4">
                {questions[currentQuestion].question}
              </h4>
              
              <div className="space-y-2">
                {questions[currentQuestion].options.map((option, optionIndex) => (
                  <div
                    key={optionIndex}
                    onClick={() => handleAnswerSelect(currentQuestion, optionIndex)}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedAnswers[currentQuestion] === optionIndex
                        ? 'bg-blue-50 border-blue-300'
                        : 'hover:bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-center">
                      <div className={`h-5 w-5 rounded-full flex items-center justify-center mr-2 text-xs font-medium ${
                        selectedAnswers[currentQuestion] === optionIndex 
                          ? 'bg-blue-500 text-white' 
                          : 'bg-gray-200 text-gray-700'
                      }`}>
                        {String.fromCharCode(65 + optionIndex)}
                      </div>
                      <span>{option}</span>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Explanation section, shown after selecting an answer */}
              {showExplanation && selectedAnswers[currentQuestion] !== undefined && (
                <div className="mt-6 bg-blue-50 border-l-4 border-blue-500 p-4">
                  <h5 className="font-medium text-blue-800 mb-1">Explanation</h5>
                  <p className="text-blue-800">
                    {questions[currentQuestion].rationale}
                  </p>
                </div>
              )}
            </div>
            
            <div className="flex justify-between items-center">
              <button
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
                className={`px-4 py-2 border border-gray-300 rounded-md flex items-center ${
                  currentQuestion === 0
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Previous
              </button>
              
              <button
                onClick={handleNext}
                disabled={selectedAnswers[currentQuestion] === undefined}
                className={`px-4 py-2 rounded-md flex items-center ${
                  selectedAnswers[currentQuestion] === undefined
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {currentQuestion < questions.length - 1 ? (
                  <>
                    Next
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </>
                ) : (
                  <>
                    View Results
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </>
        ) : (
          // Results interface
          <>
            <div className="flex items-center mb-4">
              <div className="bg-green-100 rounded-full p-2 mr-3">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-medium">Quiz Results</h3>
            </div>
            
            <p className="text-gray-600 mb-6">
              You've completed the quiz on {node.title}! Here's how you did:
            </p>
            
            <div className="flex flex-col md:flex-row items-center justify-center mb-6 gap-6">
              <div className="relative h-40 w-40 flex-shrink-0">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <span className="text-3xl font-bold text-blue-600">{calculateScore()}%</span>
                    <p className="text-sm text-gray-500 mt-1">
                      {Object.keys(selectedAnswers).filter(idx => 
                        selectedAnswers[parseInt(idx)] === questions[parseInt(idx)].correctAnswer
                      ).length} of {questions.length} correct
                    </p>
                  </div>
                </div>
                <svg className="h-40 w-40" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="3"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="3"
                    strokeDasharray={`${calculateScore()}, 100`}
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex-1">
                <h4 className="font-medium text-blue-800 mb-2">
                  Performance Analysis
                </h4>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Correct Answers</span>
                      <span className="font-medium">
                        {Object.keys(selectedAnswers).filter(idx => 
                          selectedAnswers[parseInt(idx)] === questions[parseInt(idx)].correctAnswer
                        ).length} of {questions.length}
                      </span>
                    </div>
                    <div className="w-full bg-blue-200 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full bg-blue-600"
                        style={{ 
                          width: `${(Object.keys(selectedAnswers).filter(idx => 
                            selectedAnswers[parseInt(idx)] === questions[parseInt(idx)].correctAnswer
                          ).length / questions.length) * 100}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <h5 className="font-medium text-blue-800 mb-2">Score Interpretation</h5>
                    <p className="text-blue-800 text-sm">
                      {calculateScore() >= 80 
                        ? "Excellent work! You demonstrate a strong understanding of the concepts covered in this topic."
                        : calculateScore() >= 60
                          ? "Good job! You've grasped many key concepts, but there are some areas you could review further."
                          : "This is a topic you should focus more study time on. Consider reviewing the explanations and resources provided."
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <button
                onClick={handleRetry}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors font-medium flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Try Again
              </button>
              
              {node.url && (
                <a 
                  href={node.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50 flex items-center justify-center"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Additional Resources
                </a>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
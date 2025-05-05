import React, { useState } from 'react';
import { 
  CheckCircle, 
  Loader2,
  ExternalLink,
  BookOpen,
  Video,
  FileText,
  HelpCircle,
  MousePointer,
  Zap,
  PenTool
} from 'lucide-react';
import { LearningPathNode } from '@/lib/learning-path';

// Resource type icons
const resourceIcons = {
  video: Video,
  article: FileText,
  quiz: HelpCircle,
  interactive: MousePointer,
  flashcard: Zap,
  practice: PenTool,
};

// Generic card content components
const ContentHeader = ({ title }: { title: string }) => (
  <h3 className="text-xl font-semibold text-blue-900 mb-3">{title}</h3>
);

const ArticleContent = ({ node }: { node: LearningPathNode }) => {
  // Generate article content based on node data
  return (
    <div className="prose max-w-none">
      <ContentHeader title={node.title} />
      <p className="mb-4">{node.description}</p>
      
      {/* Generated article content based on the node title/description */}
      <p>
        This content explains core concepts related to {node.title.toLowerCase()}. 
        Understanding these principles is essential for nursing practice and NCLEX preparation.
      </p>
      
      <h4 className="text-lg font-medium mt-6 mb-2">Key Concepts</h4>
      <ul className="list-disc pl-5 mb-4">
        <li>Assessment and evaluation techniques</li>
        <li>Evidence-based nursing interventions</li>
        <li>Critical thinking in clinical scenarios</li>
        <li>Patient-centered communication strategies</li>
      </ul>
      
      <h4 className="text-lg font-medium mt-6 mb-2">Clinical Application</h4>
      <p>
        When applying these concepts in clinical practice, remember to prioritize patient 
        safety and follow established protocols. Documentation is critical for continuity of care.
      </p>
      
      <div className="bg-blue-50 border border-blue-200 p-4 rounded-md mt-6">
        <h4 className="text-md font-medium text-blue-800 mb-2">NCLEX Tip</h4>
        <p className="text-blue-800">
          When answering NCLEX questions on this topic, remember to apply the nursing process 
          and consider patient safety as your highest priority.
        </p>
      </div>
      
      {node.url && (
        <div className="mt-6">
          <a 
            href={node.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 flex items-center"
          >
            <ExternalLink className="h-4 w-4 mr-1" />
            <span>Additional Resource</span>
          </a>
        </div>
      )}
    </div>
  );
};

const VideoContent = ({ node }: { node: LearningPathNode }) => {
  // Show embedded content and/or link to video
  return (
    <div>
      <ContentHeader title={node.title} />
      <p className="mb-4">{node.description}</p>
      
      {node.url && node.url.includes('youtube.com') ? (
        <div className="aspect-w-16 aspect-h-9 mb-4">
          <iframe 
            className="w-full h-72 rounded-lg border border-gray-200"
            src={node.url.replace('watch?v=', 'embed/')} 
            title={node.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowFullScreen
          ></iframe>
        </div>
      ) : (
        <div className="bg-gray-100 border border-gray-200 p-4 rounded-lg mb-4 text-center flex flex-col items-center justify-center min-h-[200px]">
          <Video className="h-12 w-12 text-gray-400 mb-2" />
          <p className="text-gray-600 mb-2">Video content preview</p>
          {node.url && (
            <a 
              href={node.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 flex items-center"
            >
              <ExternalLink className="h-4 w-4 mr-1" />
              <span>Watch Video</span>
            </a>
          )}
        </div>
      )}
      
      <div className="prose max-w-none mt-4">
        <h4 className="text-lg font-medium mb-2">Video Summary</h4>
        <p>
          This video covers key concepts related to {node.title.toLowerCase()}, 
          including assessment techniques, interventions, and patient care considerations.
        </p>
        
        <h4 className="text-lg font-medium mt-4 mb-2">Learning Objectives</h4>
        <ul className="list-disc pl-5">
          <li>Understand the fundamental principles of {node.title.toLowerCase()}</li>
          <li>Apply critical thinking to related clinical scenarios</li>
          <li>Identify key assessment findings and appropriate interventions</li>
          <li>Recognize complications and appropriate nursing responses</li>
        </ul>
      </div>
    </div>
  );
};

const QuizContent = ({ node }: { node: LearningPathNode }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{[key: number]: number}>({});
  const [showResults, setShowResults] = useState(false);
  
  // Generate sample quiz questions based on node title/description
  const questions = [
    {
      question: `Which of the following best describes a key principle of ${node.title}?`,
      options: [
        'Focusing exclusively on medical interventions',
        'Prioritizing patient needs based on assessment data',
        'Delegating all care responsibilities to support staff',
        'Documenting only when adverse events occur'
      ],
      correctAnswer: 1
    },
    {
      question: 'Which nursing action demonstrates appropriate clinical judgment?',
      options: [
        'Implementing interventions without assessing the patient',
        'Following the care plan without considering changes in patient status',
        'Assessing the patient\'s response to interventions and adjusting care accordingly',
        'Documenting findings without reporting abnormal results'
      ],
      correctAnswer: 2
    },
    {
      question: 'A priority nursing intervention for a patient with decreased tissue perfusion would be:',
      options: [
        'Administering prescribed oxygen therapy',
        'Documenting vital signs every shift',
        'Scheduling family visits',
        'Planning discharge education'
      ],
      correctAnswer: 0
    }
  ];
  
  const handleAnswerSelect = (questionIndex: number, answerIndex: number) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionIndex]: answerIndex
    });
  };
  
  const handleSubmit = () => {
    setShowResults(true);
  };
  
  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleSubmit();
    }
  };
  
  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
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
    <div>
      <ContentHeader title={node.title} />
      <p className="mb-6">{node.description}</p>
      
      {showResults ? (
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-4">
          <h3 className="text-xl font-semibold mb-4">Quiz Results</h3>
          <div className="flex items-center justify-center mb-6">
            <div className="relative h-32 w-32">
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold">{calculateScore()}%</span>
              </div>
              <svg className="h-32 w-32" viewBox="0 0 36 36">
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
                />
              </svg>
            </div>
          </div>
          
          <div className="space-y-4">
            {questions.map((q, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <p className="font-medium mb-2">{index + 1}. {q.question}</p>
                <div className="space-y-2">
                  {q.options.map((option, optionIndex) => (
                    <div 
                      key={optionIndex} 
                      className={`p-3 rounded-md ${
                        selectedAnswers[index] === optionIndex 
                          ? optionIndex === q.correctAnswer 
                            ? 'bg-green-100 border border-green-300'
                            : 'bg-red-100 border border-red-300'
                          : optionIndex === q.correctAnswer
                            ? 'bg-green-50 border border-green-200'
                            : 'bg-gray-50 border border-gray-200'
                      }`}
                    >
                      {option}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6">
            {node.url && (
              <a 
                href={node.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 flex items-center"
              >
                <ExternalLink className="h-4 w-4 mr-1" />
                <span>Practice More Questions</span>
              </a>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-4">
          <div className="mb-4 text-sm font-medium text-gray-500">
            Question {currentQuestion + 1} of {questions.length}
          </div>
          
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4">
              {questions[currentQuestion].question}
            </h3>
            
            <div className="space-y-2">
              {questions[currentQuestion].options.map((option, index) => (
                <div
                  key={index}
                  onClick={() => handleAnswerSelect(currentQuestion, index)}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedAnswers[currentQuestion] === index
                      ? 'bg-blue-50 border-blue-300'
                      : 'hover:bg-gray-50 border-gray-200'
                  }`}
                >
                  {option}
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className={`px-4 py-2 border border-gray-300 rounded-md ${
                currentQuestion === 0
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Previous
            </button>
            
            <button
              onClick={handleNext}
              disabled={selectedAnswers[currentQuestion] === undefined}
              className={`px-4 py-2 rounded-md ${
                selectedAnswers[currentQuestion] === undefined
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {currentQuestion < questions.length - 1 ? 'Next' : 'View Results'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const InteractiveContent = ({ node }: { node: LearningPathNode }) => {
  // Show interactive content (case study, drag and drop, etc.)
  return (
    <div>
      <ContentHeader title={node.title} />
      <p className="mb-6">{node.description}</p>
      
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-4">
        <h3 className="text-lg font-medium mb-4">Case Study: Patient Assessment</h3>
        
        <div className="mb-6">
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
            <p>
              <strong>Patient:</strong> J.D., a 68-year-old male, admitted with shortness of breath, fatigue, and peripheral edema.
            </p>
            <p className="mt-2">
              <strong>Medical History:</strong> Hypertension, Type 2 Diabetes, COPD
            </p>
            <p className="mt-2">
              <strong>Vital Signs:</strong> BP 160/95, HR 98, RR 24, Temp 37.1°C, SpO2 91% on room air
            </p>
          </div>
          
          <p className="mb-4">
            Based on the assessment data, identify the priority nursing diagnosis and interventions.
          </p>
          
          <div className="space-y-4 mb-6">
            <div className="border border-gray-200 p-4 rounded-lg hover:bg-gray-50 cursor-pointer">
              <h4 className="font-medium">Nursing Diagnosis: Impaired Gas Exchange</h4>
              <p className="mt-2 text-gray-600">Related to fluid overload and respiratory disease</p>
            </div>
            
            <div className="border border-gray-200 p-4 rounded-lg hover:bg-gray-50 cursor-pointer">
              <h4 className="font-medium">Nursing Diagnosis: Decreased Cardiac Output</h4>
              <p className="mt-2 text-gray-600">Related to fluid volume excess and increased cardiac workload</p>
            </div>
            
            <div className="border border-gray-200 p-4 rounded-lg hover:bg-gray-50 cursor-pointer">
              <h4 className="font-medium">Nursing Diagnosis: Activity Intolerance</h4>
              <p className="mt-2 text-gray-600">Related to imbalance between oxygen supply and demand</p>
            </div>
          </div>
          
          <div className="bg-green-50 border-l-4 border-green-500 p-4">
            <h4 className="font-medium text-green-800">Learning Point</h4>
            <p className="text-green-800 mt-2">
              When prioritizing care for patients with complex conditions, use the ABCs (Airway, Breathing, Circulation) 
              framework and Maslow's hierarchy of needs to determine which issues need immediate attention.
            </p>
          </div>
        </div>
        
        {node.url && (
          <div className="mt-6">
            <a 
              href={node.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 flex items-center"
            >
              <ExternalLink className="h-4 w-4 mr-1" />
              <span>Try More Interactive Cases</span>
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

const FlashcardContent = ({ node }: { node: LearningPathNode }) => {
  const [currentCard, setCurrentCard] = useState(0);
  const [flipped, setFlipped] = useState(false);
  
  // Generate flashcards based on the node topic
  const flashcards = [
    {
      front: `What are the key components of ${node.title}?`,
      back: 'Assessment, Planning, Implementation, and Evaluation - following the nursing process framework.'
    },
    {
      front: 'Which assessment findings would indicate a priority concern?',
      back: 'Changes in vital signs, decreased level of consciousness, or signs of respiratory distress require immediate intervention.'
    },
    {
      front: 'How does evidence-based practice impact nursing care?',
      back: 'Evidence-based practice ensures nursing interventions are based on current research, improving patient outcomes and standardizing care.'
    },
    {
      front: 'What documentation is essential when implementing nursing interventions?',
      back: 'Assessment findings, interventions performed, patient response to interventions, and any communication with healthcare team members.'
    }
  ];
  
  const handleNext = () => {
    if (currentCard < flashcards.length - 1) {
      setCurrentCard(currentCard + 1);
      setFlipped(false);
    }
  };
  
  const handlePrevious = () => {
    if (currentCard > 0) {
      setCurrentCard(currentCard - 1);
      setFlipped(false);
    }
  };
  
  const toggleFlip = () => {
    setFlipped(!flipped);
  };
  
  return (
    <div>
      <ContentHeader title={node.title} />
      <p className="mb-6">{node.description}</p>
      
      <div className="mb-4 flex justify-center">
        <div 
          className="w-full max-w-lg h-64 cursor-pointer perspective-1000"
          onClick={toggleFlip}
        >
          <div className={`relative w-full h-full duration-500 preserve-3d ${flipped ? 'rotate-y-180' : ''}`}>
            <div className="absolute w-full h-full backface-hidden bg-white border-2 border-blue-300 rounded-xl p-6 flex flex-col justify-center">
              <p className="text-xl font-medium text-center">{flashcards[currentCard].front}</p>
              <p className="text-gray-500 text-sm text-center mt-4">Click to flip</p>
            </div>
            <div className="absolute w-full h-full backface-hidden rotate-y-180 bg-blue-50 border-2 border-blue-300 rounded-xl p-6 flex flex-col justify-center">
              <p className="text-xl font-medium text-center">{flashcards[currentCard].back}</p>
              <p className="text-gray-500 text-sm text-center mt-4">Click to flip back</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between items-center mb-6">
        <div className="text-sm font-medium text-gray-500">
          Card {currentCard + 1} of {flashcards.length}
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={handlePrevious}
            disabled={currentCard === 0}
            className={`px-4 py-2 border border-gray-300 rounded-md ${
              currentCard === 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Previous
          </button>
          
          <button
            onClick={handleNext}
            disabled={currentCard === flashcards.length - 1}
            className={`px-4 py-2 border border-gray-300 rounded-md ${
              currentCard === flashcards.length - 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Next
          </button>
        </div>
      </div>
      
      {node.url && (
        <div className="mt-6">
          <a 
            href={node.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 flex items-center"
          >
            <ExternalLink className="h-4 w-4 mr-1" />
            <span>More Flashcards</span>
          </a>
        </div>
      )}
    </div>
  );
};

const PracticeContent = ({ node }: { node: LearningPathNode }) => {
  // Practice exercises/questions
  return (
    <div>
      <ContentHeader title={node.title} />
      <p className="mb-6">{node.description}</p>
      
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-4">
        <h3 className="text-lg font-medium mb-4">Practice Exercise: Prioritization</h3>
        
        <div className="mb-6">
          <p className="mb-4">
            You are assigned to care for the following four patients. Based on the information provided,
            rank these patients in order of priority (drag and drop):
          </p>
          
          <div className="space-y-3 mb-6">
            <div className="border-2 border-blue-200 p-4 rounded-lg bg-blue-50">
              <h4 className="font-medium">Patient A</h4>
              <p className="mt-1 text-gray-600">
                68-year-old male with chest pain, diaphoresis, and shortness of breath. 
                BP 160/90, HR 110, RR 24.
              </p>
            </div>
            
            <div className="border border-gray-200 p-4 rounded-lg hover:bg-gray-50 cursor-move">
              <h4 className="font-medium">Patient B</h4>
              <p className="mt-1 text-gray-600">
                45-year-old female recovering from appendectomy yesterday, reports pain at 4/10.
                Vital signs stable.
              </p>
            </div>
            
            <div className="border border-gray-200 p-4 rounded-lg hover:bg-gray-50 cursor-move">
              <h4 className="font-medium">Patient C</h4>
              <p className="mt-1 text-gray-600">
                78-year-old female with urinary tract infection, receiving IV antibiotics.
                Afebrile, vital signs stable.
              </p>
            </div>
            
            <div className="border border-gray-200 p-4 rounded-lg hover:bg-gray-50 cursor-move">
              <h4 className="font-medium">Patient D</h4>
              <p className="mt-1 text-gray-600">
                52-year-old male admitted for scheduled colonoscopy, awaiting procedure.
                No acute concerns.
              </p>
            </div>
          </div>
          
          <div className="bg-green-50 border-l-4 border-green-500 p-4">
            <h4 className="font-medium text-green-800">Priority Rationale</h4>
            <p className="text-green-800 mt-2">
              Patient A should be your highest priority due to symptoms suggestive of possible 
              acute coronary syndrome, which is potentially life-threatening and requires immediate attention.
            </p>
          </div>
        </div>
        
        {node.url && (
          <div className="mt-6">
            <a 
              href={node.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 flex items-center"
            >
              <ExternalLink className="h-4 w-4 mr-1" />
              <span>More Practice Exercises</span>
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

// Main component to display learning content based on resource type
export function LearningContent({ node }: { node: LearningPathNode }) {
  // Add custom CSS for the flip card animation
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .perspective-1000 {
        perspective: 1000px;
      }
      .preserve-3d {
        transform-style: preserve-3d;
      }
      .backface-hidden {
        backface-visibility: hidden;
      }
      .rotate-y-180 {
        transform: rotateY(180deg);
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  
  // Display appropriate content based on resource type
  const renderContent = () => {
    switch (node.resourceType) {
      case 'article':
        return <ArticleContent node={node} />;
      case 'video':
        return <VideoContent node={node} />;
      case 'quiz':
        return <QuizContent node={node} />;
      case 'interactive':
        return <InteractiveContent node={node} />;
      case 'flashcard':
        return <FlashcardContent node={node} />;
      case 'practice':
        return <PracticeContent node={node} />;
      default:
        return <ArticleContent node={node} />;
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      {renderContent()}
      
      {/* External link at bottom if needed */}
      {node.url && node.resourceType !== 'video' && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600 mb-2">External resource:</p>
          <a 
            href={node.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 flex items-center"
          >
            <ExternalLink className="h-4 w-4 mr-1" />
            <span>{node.url}</span>
          </a>
        </div>
      )}
    </div>
  );
}
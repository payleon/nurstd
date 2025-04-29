import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ListRestart, CheckCircle2, Award, XCircle, Heart, Timer, BookOpen, Shuffle, Brain, ArrowRight } from 'lucide-react';
import { MedicalSpinner } from '@/components/ui/medical-spinner';

interface MedicalTerminologyGameProps {
  onComplete?: (score: number) => void;
  onClose?: () => void;
}

interface Term {
  id: number;
  term: string;
  definition: string;
  category: 'anatomy' | 'physiology' | 'pharmacology' | 'pathology' | 'clinical';
}

// Medical terminology with definitions
const medicalTerms: Term[] = [
  {
    id: 1,
    term: "Dyspnea",
    definition: "Difficulty breathing or shortness of breath",
    category: 'clinical'
  },
  {
    id: 2,
    term: "Tachycardia",
    definition: "Heart rate faster than normal (usually over 100 beats per minute)",
    category: 'clinical'
  },
  {
    id: 3,
    term: "Bradycardia",
    definition: "Heart rate slower than normal (usually under 60 beats per minute)",
    category: 'clinical'
  },
  {
    id: 4,
    term: "Hypertension",
    definition: "Blood pressure higher than normal (140/90 mmHg or higher)",
    category: 'clinical'
  },
  {
    id: 5,
    term: "Hypotension",
    definition: "Blood pressure lower than normal (90/60 mmHg or lower)",
    category: 'clinical'
  },
  {
    id: 6,
    term: "Erythrocyte",
    definition: "Red blood cell that carries oxygen throughout the body",
    category: 'anatomy'
  },
  {
    id: 7,
    term: "Leukocyte",
    definition: "White blood cell involved in the immune response",
    category: 'anatomy'
  },
  {
    id: 8,
    term: "Thrombocyte",
    definition: "Platelet involved in blood clotting",
    category: 'anatomy'
  },
  {
    id: 9,
    term: "Hemostasis",
    definition: "Process of stopping bleeding by forming blood clots",
    category: 'physiology'
  },
  {
    id: 10,
    term: "Cyanosis",
    definition: "Bluish discoloration of the skin due to poor oxygen saturation",
    category: 'clinical'
  },
  {
    id: 11,
    term: "Tachypnea",
    definition: "Abnormally rapid breathing",
    category: 'clinical'
  },
  {
    id: 12,
    term: "Bradypnea",
    definition: "Abnormally slow breathing",
    category: 'clinical'
  },
  {
    id: 13,
    term: "Hypoxemia",
    definition: "Low oxygen level in the blood",
    category: 'pathology'
  },
  {
    id: 14,
    term: "Hypercapnia",
    definition: "Elevated carbon dioxide level in the blood",
    category: 'pathology'
  },
  {
    id: 15,
    term: "Hyperkalemia",
    definition: "High potassium level in the blood",
    category: 'pathology'
  },
  {
    id: 16,
    term: "Hypokalemia",
    definition: "Low potassium level in the blood",
    category: 'pathology'
  },
  {
    id: 17,
    term: "Hypernatremia",
    definition: "High sodium level in the blood",
    category: 'pathology'
  },
  {
    id: 18,
    term: "Hyponatremia",
    definition: "Low sodium level in the blood",
    category: 'pathology'
  },
  {
    id: 19,
    term: "Hypoglycemia",
    definition: "Low blood glucose level",
    category: 'pathology'
  },
  {
    id: 20,
    term: "Hyperglycemia",
    definition: "High blood glucose level",
    category: 'pathology'
  },
  {
    id: 21,
    term: "Antipyretic",
    definition: "Medication that reduces fever",
    category: 'pharmacology'
  },
  {
    id: 22,
    term: "Analgesic",
    definition: "Medication that relieves pain",
    category: 'pharmacology'
  },
  {
    id: 23,
    term: "Antiemetic",
    definition: "Medication that prevents or reduces nausea and vomiting",
    category: 'pharmacology'
  },
  {
    id: 24,
    term: "Antihypertensive",
    definition: "Medication that lowers blood pressure",
    category: 'pharmacology'
  },
  {
    id: 25,
    term: "Diuretic",
    definition: "Medication that increases urine production",
    category: 'pharmacology'
  }
];

interface MatchingSet {
  terms: {id: number, text: string}[];
  definitions: {id: number, text: string}[];
}

export function MedicalTerminologyGame({ onComplete, onClose }: MedicalTerminologyGameProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [gameMode, setGameMode] = useState<'matching' | 'flashcards'>('matching');
  const [matchingSets, setMatchingSets] = useState<MatchingSet[]>([]);
  const [currentSetIndex, setCurrentSetIndex] = useState(0);
  const [selectedTerm, setSelectedTerm] = useState<number | null>(null);
  const [selectedDefinition, setSelectedDefinition] = useState<number | null>(null);
  const [correctMatches, setCorrectMatches] = useState<{[key: number]: number}>({});
  const [incorrectAttempts, setIncorrectAttempts] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes per set
  const [gameState, setGameState] = useState<'playing' | 'set-complete' | 'results'>('playing');
  const [currentFlashcardIndex, setCurrentFlashcardIndex] = useState(0);
  const [flashcardTerms, setFlashcardTerms] = useState<Term[]>([]);
  const [showFlashcardDefinition, setShowFlashcardDefinition] = useState(false);
  
  // Create matching sets (5 terms per set) from the available terms
  useEffect(() => {
    const createSets = () => {
      // Shuffle all terms
      const shuffledTerms = [...medicalTerms].sort(() => Math.random() - 0.5);
      
      // Create sets of 5 terms each
      const sets: MatchingSet[] = [];
      for (let i = 0; i < shuffledTerms.length; i += 5) {
        const setTerms = shuffledTerms.slice(i, i + 5);
        if (setTerms.length === 5) { // Only use complete sets of 5
          const set: MatchingSet = {
            terms: setTerms.map(t => ({ id: t.id, text: t.term })),
            definitions: [...setTerms].sort(() => Math.random() - 0.5).map(t => ({ id: t.id, text: t.definition }))
          };
          sets.push(set);
        }
      }
      
      setMatchingSets(sets);
    };
    
    // For flashcard mode, simply shuffle all terms
    const shuffleFlashcards = () => {
      setFlashcardTerms([...medicalTerms].sort(() => Math.random() - 0.5));
    };
    
    createSets();
    shuffleFlashcards();
    
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Timer countdown
  useEffect(() => {
    if (gameState !== 'playing' || timeLeft <= 0) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => Math.max(0, prev - 1));
    }, 1000);
    
    if (timeLeft === 0) {
      completeSet();
    }
    
    return () => clearInterval(timer);
  }, [timeLeft, gameState]);
  
  const handleTermClick = (id: number) => {
    // If already matched, do nothing
    if (Object.values(correctMatches).includes(id) || Object.keys(correctMatches).map(Number).includes(id)) {
      return;
    }
    
    setSelectedTerm(id);
    
    // If a definition is already selected, check for a match
    if (selectedDefinition !== null) {
      if (selectedDefinition === id) {
        // Correct match
        setCorrectMatches({...correctMatches, [id]: id});
        setScore(score + 10);
      } else {
        // Incorrect match
        setIncorrectAttempts(incorrectAttempts + 1);
        setScore(Math.max(0, score - 2)); // Lose 2 points for incorrect matches
      }
      
      // Reset selections
      setTimeout(() => {
        setSelectedTerm(null);
        setSelectedDefinition(null);
      }, 1000);
    }
  };
  
  const handleDefinitionClick = (id: number) => {
    // If already matched, do nothing
    if (Object.values(correctMatches).includes(id) || Object.keys(correctMatches).map(Number).includes(id)) {
      return;
    }
    
    setSelectedDefinition(id);
    
    // If a term is already selected, check for a match
    if (selectedTerm !== null) {
      if (selectedTerm === id) {
        // Correct match
        setCorrectMatches({...correctMatches, [id]: id});
        setScore(score + 10);
      } else {
        // Incorrect match
        setIncorrectAttempts(incorrectAttempts + 1);
        setScore(Math.max(0, score - 2)); // Lose 2 points for incorrect matches
      }
      
      // Reset selections
      setTimeout(() => {
        setSelectedTerm(null);
        setSelectedDefinition(null);
      }, 1000);
    }
  };
  
  const completeSet = () => {
    setGameState('set-complete');
    
    // Calculate any unmatched terms
    const currentSet = matchingSets[currentSetIndex];
    currentSet.terms.forEach(term => {
      if (!Object.keys(correctMatches).map(Number).includes(term.id)) {
        // Reveal the correct matches for unmatched terms
        setCorrectMatches(prev => ({...prev, [term.id]: term.id}));
      }
    });
  };
  
  const nextSet = () => {
    if (currentSetIndex === matchingSets.length - 1) {
      // Game complete
      finalizeScore();
      return;
    }
    
    // Reset for next set
    setSelectedTerm(null);
    setSelectedDefinition(null);
    setCorrectMatches({});
    setCurrentSetIndex(currentSetIndex + 1);
    setTimeLeft(120); // Reset timer
    setGameState('playing');
  };
  
  const finalizeScore = () => {
    setGameState('results');
    if (onComplete) {
      onComplete(score);
    }
  };
  
  const resetGame = () => {
    setSelectedTerm(null);
    setSelectedDefinition(null);
    setCorrectMatches({});
    setIncorrectAttempts(0);
    setScore(0);
    setTimeLeft(120);
    setCurrentSetIndex(0);
    setGameState('playing');
    setCurrentFlashcardIndex(0);
    setShowFlashcardDefinition(false);
    
    // Reshuffle terms for a new game
    const shuffledTerms = [...medicalTerms].sort(() => Math.random() - 0.5);
    setFlashcardTerms(shuffledTerms);
    
    // Create new matching sets
    const sets: MatchingSet[] = [];
    for (let i = 0; i < shuffledTerms.length; i += 5) {
      const setTerms = shuffledTerms.slice(i, i + 5);
      if (setTerms.length === 5) {
        const set: MatchingSet = {
          terms: setTerms.map(t => ({ id: t.id, text: t.term })),
          definitions: [...setTerms].sort(() => Math.random() - 0.5).map(t => ({ id: t.id, text: t.definition }))
        };
        sets.push(set);
      }
    }
    setMatchingSets(sets);
  };
  
  const nextFlashcard = () => {
    if (currentFlashcardIndex < flashcardTerms.length - 1) {
      setCurrentFlashcardIndex(currentFlashcardIndex + 1);
      setShowFlashcardDefinition(false);
    } else {
      // End of flashcards, restart from beginning
      setCurrentFlashcardIndex(0);
      setShowFlashcardDefinition(false);
    }
  };
  
  const prevFlashcard = () => {
    if (currentFlashcardIndex > 0) {
      setCurrentFlashcardIndex(currentFlashcardIndex - 1);
      setShowFlashcardDefinition(false);
    } else {
      // At the beginning, go to the end
      setCurrentFlashcardIndex(flashcardTerms.length - 1);
      setShowFlashcardDefinition(false);
    }
  };
  
  const flipFlashcard = () => {
    setShowFlashcardDefinition(!showFlashcardDefinition);
  };
  
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center justify-center min-h-[600px]">
        <MedicalSpinner size="lg" type="stethoscope" />
        <p className="mt-4 text-lg text-center text-gray-700">Loading Medical Terminology Game...</p>
      </div>
    );
  }
  
  if (gameState === 'results') {
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden min-h-[600px]">
        <div className="bg-[#13294B] text-white p-4">
          <h2 className="text-xl font-bold">Game Complete!</h2>
        </div>
        
        <div className="p-6 text-center">
          <Award className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-2">Congratulations!</h3>
          <p className="text-lg mb-6">You've completed the Medical Terminology Challenge</p>
          
          <div className="bg-blue-50 rounded-lg p-6 mb-8 inline-block mx-auto">
            <div className="text-3xl font-bold text-blue-700 mb-2">{score}</div>
            <div className="text-sm text-blue-600">Final Score</div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md mx-auto mb-6">
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-xl font-bold text-green-700">{Object.keys(correctMatches).length / 2}</div>
              <div className="text-sm text-green-600">Correct Matches</div>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <div className="text-xl font-bold text-red-700">{incorrectAttempts}</div>
              <div className="text-sm text-red-600">Incorrect Attempts</div>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-4">
            <button
              onClick={resetGame}
              className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors"
            >
              <ListRestart className="h-5 w-5 mr-2" />
              Play Again
            </button>
            
            {onClose && (
              <button
                onClick={onClose}
                className="flex items-center justify-center bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-md transition-colors"
              >
                Return to Game Hub
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }
  
  if (gameMode === 'flashcards') {
    const currentTerm = flashcardTerms[currentFlashcardIndex];
    
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden min-h-[600px]">
        <div className="bg-[#13294B] text-white p-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Medical Terminology Flashcards</h2>
            <div className="flex items-center">
              <button
                onClick={() => setGameMode('matching')}
                className="bg-[#0A1E3A] hover:bg-blue-800 text-white py-1 px-3 rounded-md text-sm transition-colors"
              >
                Switch to Matching Game
              </button>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <div className="text-center mb-4">
            <p className="text-sm text-gray-600">
              Card {currentFlashcardIndex + 1} of {flashcardTerms.length}
            </p>
          </div>
          
          <div 
            onClick={flipFlashcard}
            className="cursor-pointer perspective-1000 relative h-[300px] w-full mx-auto max-w-md mb-6"
          >
            <div className={`absolute w-full h-full transition-transform duration-500 transform-style-3d ${showFlashcardDefinition ? 'rotate-y-180' : ''}`}>
              {/* Front of card (Term) */}
              <div className={`absolute w-full h-full backface-hidden ${showFlashcardDefinition ? 'hidden' : 'block'} bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-xl p-8 flex flex-col items-center justify-center`}>
                <BookOpen className="h-8 w-8 text-blue-600 mb-4" />
                <h3 className="text-2xl font-bold text-blue-800 mb-2">{currentTerm.term}</h3>
                <p className="text-sm text-blue-600">Category: {currentTerm.category}</p>
                <p className="mt-6 text-sm text-center text-gray-600">Click to see definition</p>
              </div>
              
              {/* Back of card (Definition) */}
              <div className={`absolute w-full h-full backface-hidden ${showFlashcardDefinition ? 'block' : 'hidden'} bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 rounded-xl p-8 flex flex-col items-center justify-center rotate-y-180`}>
                <div className="text-xl font-medium text-green-800 mb-6">{currentTerm.definition}</div>
                <p className="mt-4 text-sm text-center text-gray-600">Click to see term</p>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center space-x-4 mt-8">
            <button
              onClick={prevFlashcard}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-md transition-colors"
            >
              Previous
            </button>
            <button
              onClick={flipFlashcard}
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors"
            >
              Flip
            </button>
            <button
              onClick={nextFlashcard}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-md transition-colors"
            >
              Next
            </button>
          </div>
          
          <div className="flex justify-center mt-6">
            <button
              onClick={() => {
                setFlashcardTerms([...flashcardTerms].sort(() => Math.random() - 0.5));
                setCurrentFlashcardIndex(0);
              }}
              className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
            >
              <Shuffle className="h-4 w-4 mr-1" />
              Shuffle Cards
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  // Matching Game Mode
  const currentSet = matchingSets[currentSetIndex];
  const allMatched = currentSet?.terms.every(term => Object.keys(correctMatches).map(Number).includes(term.id));
  
  if (gameState === 'set-complete') {
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden min-h-[600px]">
        <div className="bg-[#13294B] text-white p-4">
          <h2 className="text-xl font-bold">Set Complete!</h2>
        </div>
        
        <div className="p-6 text-center">
          <div className="mb-8">
            <h3 className="text-xl font-bold mb-2">
              {allMatched && timeLeft > 0 ? 'Great job!' : 'Set completed'}
            </h3>
            <p className="text-gray-600">
              {allMatched && timeLeft > 0 
                ? 'You matched all terms correctly!' 
                : 'Here are the correct matches:'}
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 max-w-3xl mx-auto">
            {currentSet.terms.map(term => {
              const matchingTerm = medicalTerms.find(t => t.id === term.id);
              return (
                <div key={term.id} className="bg-blue-50 p-4 rounded-lg">
                  <div className="font-bold text-blue-800 mb-1">{matchingTerm?.term}</div>
                  <div className="text-blue-600">{matchingTerm?.definition}</div>
                </div>
              );
            })}
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            {currentSetIndex < matchingSets.length - 1 ? (
              <button
                onClick={nextSet}
                className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-md transition-colors"
              >
                Next Set <ArrowRight className="ml-2 h-5 w-5" />
              </button>
            ) : (
              <button
                onClick={finalizeScore}
                className="flex items-center justify-center bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded-md transition-colors"
              >
                Complete Game <CheckCircle2 className="ml-2 h-5 w-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden min-h-[600px]">
      <div className="bg-[#13294B] text-white p-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Medical Terminology Matching</h2>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Heart className="h-5 w-5 text-red-400 mr-1.5" />
              <span className="font-mono font-semibold">{score}</span>
            </div>
            <div className="flex items-center bg-[#0A1E3A] py-1 px-3 rounded-md border border-[#4B9CD3]">
              <Timer className="h-4 w-4 mr-1.5 text-[#4B9CD3]" />
              <span className="font-mono font-semibold">{timeLeft}s</span>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between mt-2 text-sm">
          <div className="flex items-center">
            <BookOpen className="h-4 w-4 mr-1.5" />
            <span>Set {currentSetIndex + 1} of {matchingSets.length}</span>
          </div>
          <button
            onClick={() => setGameMode('flashcards')}
            className="bg-[#0A1E3A] hover:bg-blue-800 text-white py-1 px-3 rounded-md text-sm transition-colors"
          >
            Switch to Flashcards
          </button>
        </div>
      </div>
      
      <div className="p-6">
        <div className="mb-6 text-center">
          <h3 className="text-lg font-bold text-[#13294B] mb-2">Match the terms with their definitions</h3>
          <p className="text-sm text-gray-600">Click on a term and then its matching definition. +10 points for correct matches, -2 for incorrect attempts.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Terms Column */}
          <div>
            <h4 className="font-bold text-blue-800 mb-3">Medical Terms</h4>
            <div className="space-y-3">
              {currentSet.terms.map(term => (
                <motion.div
                  key={term.id}
                  whileHover={{ scale: 1.02 }}
                  className={`p-3 rounded-md cursor-pointer transition-colors ${
                    Object.keys(correctMatches).map(Number).includes(term.id)
                      ? 'bg-green-100 border-2 border-green-300'
                      : selectedTerm === term.id
                      ? 'bg-blue-200 border-2 border-blue-400'
                      : 'bg-blue-50 border-2 border-transparent hover:border-blue-300'
                  }`}
                  onClick={() => handleTermClick(term.id)}
                >
                  <div className="font-medium">{term.text}</div>
                </motion.div>
              ))}
            </div>
          </div>
          
          {/* Definitions Column */}
          <div>
            <h4 className="font-bold text-green-800 mb-3">Definitions</h4>
            <div className="space-y-3">
              {currentSet.definitions.map(def => (
                <motion.div
                  key={def.id}
                  whileHover={{ scale: 1.02 }}
                  className={`p-3 rounded-md cursor-pointer transition-colors ${
                    Object.values(correctMatches).includes(def.id)
                      ? 'bg-green-100 border-2 border-green-300'
                      : selectedDefinition === def.id
                      ? 'bg-blue-200 border-2 border-blue-400'
                      : 'bg-green-50 border-2 border-transparent hover:border-green-300'
                  }`}
                  onClick={() => handleDefinitionClick(def.id)}
                >
                  <div>{def.text}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="flex justify-center">
          <button
            onClick={completeSet}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors"
            disabled={allMatched}
          >
            {allMatched ? 'All Matched!' : 'Complete Set'}
          </button>
        </div>
      </div>
    </div>
  );
}
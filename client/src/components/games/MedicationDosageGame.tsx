import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ListRestart, CheckCircle2, Award, XCircle, Heart, Timer, PlusCircle, Calculator, ArrowRight } from 'lucide-react';
import { MedicalSpinner } from '@/components/ui/medical-spinner';

interface MedicationDosageGameProps {
  onComplete?: (score: number) => void;
  onClose?: () => void;
}

interface DosageQuestion {
  id: number;
  questionText: string;
  patientInfo: string;
  medicationInfo: string;
  dosageType: 'weight-based' | 'flow-rate' | 'conversion';
  answerUnit: string;
  correctAnswer: number;
  tolerance: number; // Percentage tolerance for acceptable answers (e.g., 5 means ±5%)
  hint: string;
  explanation: string;
  formula: string;
}

const dosageQuestions: DosageQuestion[] = [
  {
    id: 1,
    questionText: "Calculate the IV flow rate in drops per minute for this patient.",
    patientInfo: "Mr. Garcia needs to receive 1000 mL of normal saline solution over 8 hours.",
    medicationInfo: "The IV set delivers 15 drops per mL.",
    dosageType: "flow-rate",
    answerUnit: "gtt/min",
    correctAnswer: 31.25, // (1000 mL × 15 gtt/mL) ÷ (8 hrs × 60 min/hr) = 31.25 gtt/min
    tolerance: 5,
    hint: "Use the formula: (Total volume × Drop factor) ÷ (Time in minutes)",
    explanation: "Using the formula (Total volume × Drop factor) ÷ (Time in minutes), we calculate:\n(1000 mL × 15 gtt/mL) ÷ (8 hrs × 60 min/hr) = 15000 gtt ÷ 480 min = 31.25 gtt/min.\nThis should be rounded to 31 gtt/min for administration.",
    formula: "(Volume × Drop factor) ÷ (Time in minutes)"
  },
  {
    id: 2,
    questionText: "Calculate the dose of medication to administer based on the patient's weight.",
    patientInfo: "Child weighing 25 kg needs ceftriaxone.",
    medicationInfo: "Ceftriaxone dose: 75 mg/kg/day, given once daily.",
    dosageType: "weight-based",
    answerUnit: "mg",
    correctAnswer: 1875, // 25 kg × 75 mg/kg = 1875 mg
    tolerance: 0,
    hint: "Multiply the patient's weight by the dose per kg.",
    explanation: "To calculate the correct dose: Patient's weight × Prescribed dose\n25 kg × 75 mg/kg = 1875 mg of ceftriaxone to be administered once daily.",
    formula: "Dose = Patient weight × Prescribed dose per kg"
  },
  {
    id: 3,
    questionText: "How many tablets should be administered?",
    patientInfo: "Patient is ordered amoxicillin 750 mg PO q8h.",
    medicationInfo: "Available tablets are 250 mg each.",
    dosageType: "conversion",
    answerUnit: "tablets",
    correctAnswer: 3, // 750 mg ÷ 250 mg = 3 tablets
    tolerance: 0,
    hint: "Divide the ordered dose by the available dose per tablet.",
    explanation: "To determine the number of tablets: Ordered dose ÷ Available dose per tablet\n750 mg ÷ 250 mg = 3 tablets",
    formula: "Number of tablets = Ordered dose ÷ Available dose per tablet"
  },
  {
    id: 4,
    questionText: "Calculate the heparin infusion rate in mL/hr.",
    patientInfo: "Patient weighing 70 kg needs heparin at 18 units/kg/hr.",
    medicationInfo: "The heparin solution contains 25,000 units in 250 mL of D5W.",
    dosageType: "flow-rate",
    answerUnit: "mL/hr",
    correctAnswer: 12.6, // (70 kg × 18 units/kg/hr) ÷ (25,000 units ÷ 250 mL) = 12.6 mL/hr
    tolerance: 5,
    hint: "First calculate total units needed per hour, then determine mL/hr using proportion.",
    explanation: "Step 1: Calculate units/hr: 70 kg × 18 units/kg/hr = 1,260 units/hr\nStep 2: Set up proportion: 25,000 units : 250 mL = 1,260 units : x mL\nStep 3: Solve for x: x = (1,260 × 250) ÷ 25,000 = 12.6 mL/hr",
    formula: "(Weight × Units/kg/hr) ÷ (Units/mL) = mL/hr"
  },
  {
    id: 5,
    questionText: "Calculate how many milliliters to administer for this dose.",
    patientInfo: "Patient is prescribed phenytoin 250 mg IV.",
    medicationInfo: "The medication vial contains phenytoin 100 mg/2 mL.",
    dosageType: "conversion",
    answerUnit: "mL",
    correctAnswer: 5, // (250 mg × 2 mL) ÷ 100 mg = 5 mL
    tolerance: 0,
    hint: "Set up a proportion relating the desired dose to the available concentration.",
    explanation: "Using proportional reasoning:\n100 mg : 2 mL = 250 mg : x mL\nCross multiply: 100x = 2 × 250\nx = 500 ÷ 100 = 5 mL",
    formula: "Volume to give = (Ordered dose × Available volume) ÷ Available dose"
  },
  {
    id: 6,
    questionText: "Calculate the dose of gentamicin in mg based on the patient's weight.",
    patientInfo: "Child weighing 18 kg needs gentamicin.",
    medicationInfo: "Gentamicin dose: 2.5 mg/kg every 8 hours.",
    dosageType: "weight-based",
    answerUnit: "mg",
    correctAnswer: 45, // 18 kg × 2.5 mg/kg = 45 mg
    tolerance: 0,
    hint: "Multiply the patient's weight by the prescribed dose per kg.",
    explanation: "To calculate the dose: Weight × Prescribed dose\n18 kg × 2.5 mg/kg = 45 mg gentamicin every 8 hours",
    formula: "Dose = Weight × Prescribed dose per kg"
  }
];

export function MedicationDosageGame({ onComplete, onClose }: MedicationDosageGameProps) {
  const [currentQuestion, setCurrentQuestion] = useState<DosageQuestion>(dosageQuestions[0]);
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(90); // 90 seconds per question
  const [questionIndex, setQuestionIndex] = useState(0);
  const [gameState, setGameState] = useState<'playing' | 'checking' | 'results'>('playing');
  const [isLoading, setIsLoading] = useState(true);
  const [showCalculator, setShowCalculator] = useState(false);
  const [calculatorValue, setCalculatorValue] = useState('');
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [showFormula, setShowFormula] = useState(false);
  
  // Load the initial question
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentQuestion(dosageQuestions[0]);
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
      checkAnswer();
    }
    
    return () => clearInterval(timer);
  }, [timeLeft, gameState]);
  
  const checkAnswer = () => {
    if (userAnswer.trim() === '') {
      return; // Don't submit empty answers
    }
    
    setGameState('checking');
    
    // Parse user answer as a number
    const numericAnswer = parseFloat(userAnswer);
    
    // Check if answer is within tolerance range
    const correctValue = currentQuestion.correctAnswer;
    const tolerance = currentQuestion.tolerance / 100; // Convert percentage to decimal
    
    // Calculate acceptable range
    const minAcceptable = correctValue * (1 - tolerance);
    const maxAcceptable = correctValue * (1 + tolerance);
    
    const correct = !isNaN(numericAnswer) && 
                   numericAnswer >= minAcceptable && 
                   numericAnswer <= maxAcceptable;
    
    setIsCorrect(correct);
    
    if (correct) {
      // Award points based on time left - faster answers get more points
      const timeBonus = Math.floor(timeLeft / 10); // 0-9 bonus points based on time
      const questionPoints = 10 + timeBonus; // Base 10 points + time bonus
      setScore(prevScore => prevScore + questionPoints);
      setCorrectAnswers(prev => prev + 1);
    }
    
    setShowExplanation(true);
  };
  
  const nextQuestion = () => {
    // Check if we've gone through all questions
    if (questionIndex >= dosageQuestions.length - 1) {
      finishGame();
      return;
    }
    
    const nextIndex = questionIndex + 1;
    setQuestionIndex(nextIndex);
    setIsLoading(true);
    
    // Reset states for next question
    setUserAnswer('');
    setIsCorrect(null);
    setShowExplanation(false);
    setGameState('playing');
    setShowFormula(false);
    
    // Simulate loading time
    setTimeout(() => {
      setCurrentQuestion(dosageQuestions[nextIndex]);
      setTimeLeft(90); // Reset timer
      setIsLoading(false);
    }, 1000);
  };
  
  const resetGame = () => {
    setScore(0);
    setQuestionIndex(0);
    setCorrectAnswers(0);
    setUserAnswer('');
    setIsCorrect(null);
    setShowExplanation(false);
    setGameState('playing');
    setIsLoading(true);
    setShowFormula(false);
    
    setTimeout(() => {
      setCurrentQuestion(dosageQuestions[0]);
      setTimeLeft(90);
      setIsLoading(false);
    }, 1000);
  };
  
  const finishGame = () => {
    setGameState('results');
    if (onComplete) {
      onComplete(score);
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numbers and decimal points
    const value = e.target.value.replace(/[^0-9.]/g, '');
    setUserAnswer(value);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && gameState === 'playing') {
      checkAnswer();
    }
  };
  
  const handleCalculatorInput = (value: string) => {
    if (value === 'C') {
      setCalculatorValue('');
    } else if (value === '←') {
      setCalculatorValue(prev => prev.slice(0, -1));
    } else if (value === '=') {
      try {
        const result = eval(calculatorValue);
        setCalculatorValue(result.toString());
      } catch (e) {
        setCalculatorValue('Error');
      }
    } else {
      setCalculatorValue(prev => prev + value);
    }
  };
  
  const applyCalculatorResult = () => {
    if (calculatorValue && calculatorValue !== 'Error') {
      setUserAnswer(calculatorValue);
    }
    setShowCalculator(false);
  };
  
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[600px] bg-white rounded-lg shadow-md p-8">
        <MedicalSpinner type="pulse" size="lg" text="Loading dosage calculation..." />
      </div>
    );
  }
  
  if (gameState === 'results') {
    const accuracy = Math.round((correctAnswers / dosageQuestions.length) * 100);
    
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden min-h-[600px]">
        <div className="bg-[#13294B] text-white p-4">
          <h2 className="text-xl font-bold">Medication Calculation Results</h2>
        </div>
        
        <div className="p-6">
          <div className="flex flex-col items-center justify-center">
            <div className="mb-6">
              <Award className="h-16 w-16 text-yellow-500" />
            </div>
            
            <h3 className="text-2xl font-bold mb-2">Final Score: {score}</h3>
            <p className="text-lg mb-4">
              Accuracy: {accuracy}% ({correctAnswers} of {dosageQuestions.length})
            </p>
            
            <div className="grid grid-cols-2 gap-4 w-full max-w-md mb-6">
              <div className="bg-blue-50 border border-blue-200 rounded p-4 text-center">
                <div className="text-sm text-blue-500 mb-1">Completed</div>
                <div className="font-bold text-blue-700 text-xl">{dosageQuestions.length}</div>
                <div className="text-xs text-blue-400">questions</div>
              </div>
              <div className="bg-green-50 border border-green-200 rounded p-4 text-center">
                <div className="text-sm text-green-500 mb-1">Average</div>
                <div className="font-bold text-green-700 text-xl">
                  {Math.round(score / dosageQuestions.length)}
                </div>
                <div className="text-xs text-green-400">points per question</div>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button 
                onClick={resetGame} 
                className="px-4 py-2 bg-[#4B9CD3] text-white rounded-md hover:bg-[#3d7eaa] transition-colors"
              >
                Play Again
              </button>
              {onClose && (
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Exit Game
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden min-h-[600px]">
      <div className="bg-[#13294B] text-white p-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Medication Calculation Challenge</h2>
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
        <div className="flex items-center mt-2 text-sm">
          <PlusCircle className="h-4 w-4 mr-1.5" />
          <span>Question {questionIndex + 1} of {dosageQuestions.length}</span>
          <span className="mx-4">|</span>
          <span>Type: {currentQuestion.dosageType}</span>
        </div>
      </div>
      
      <div className="p-6">
        <div className="mb-6">
          <h3 className="text-lg font-bold text-[#13294B] mb-2">{currentQuestion.questionText}</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="bg-blue-100 border border-blue-300 p-3 rounded-md">
              <p className="text-sm font-medium text-blue-900 mb-1">Patient Information:</p>
              <p className="text-blue-900">{currentQuestion.patientInfo}</p>
            </div>
            <div className="bg-purple-100 border border-purple-300 p-3 rounded-md">
              <p className="text-sm font-medium text-purple-900 mb-1">Medication Information:</p>
              <p className="text-purple-900">{currentQuestion.medicationInfo}</p>
            </div>
          </div>
          
          <div className="flex justify-between mb-4">
            <button 
              onClick={() => setShowFormula(!showFormula)}
              className="text-sm text-[#4B9CD3] hover:underline flex items-center"
            >
              {showFormula ? 'Hide Formula' : 'Show Formula'}
            </button>
            <button
              onClick={() => setShowCalculator(true)}
              className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded flex items-center"
            >
              <Calculator className="h-4 w-4 mr-1.5" />
              Calculator
            </button>
          </div>
          
          <AnimatePresence>
            {showFormula && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-4 overflow-hidden"
              >
                <div className="bg-gray-100 border border-gray-300 rounded-md p-3">
                  <p className="text-sm font-medium text-gray-900 mb-1">Formula:</p>
                  <p className="font-mono text-sm bg-white p-2 rounded border border-gray-300 text-gray-900">
                    {currentQuestion.formula}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Answer:
          </label>
          <div className="flex">
            <input
              type="text"
              value={userAnswer}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              disabled={gameState === 'checking'}
              className={`w-full p-3 border-2 rounded-l-md focus:ring-2 focus:ring-[#4B9CD3] focus:outline-none ${
                gameState === 'checking'
                  ? isCorrect 
                    ? 'border-green-500 bg-green-50' 
                    : 'border-red-500 bg-red-50'
                  : 'border-gray-300'
              }`}
              placeholder={`Enter value in ${currentQuestion.answerUnit}`}
            />
            <div className="bg-gray-100 font-mono px-4 flex items-center rounded-r-md border-2 border-l-0 border-gray-300">
              {currentQuestion.answerUnit}
            </div>
          </div>
          
          {gameState === 'checking' && (
            <div className={`mt-2 text-sm ${isCorrect ? 'text-green-600' : 'text-red-600'} flex items-center`}>
              {isCorrect ? (
                <>
                  <CheckCircle2 className="h-4 w-4 mr-1.5" />
                  Correct! {currentQuestion.correctAnswer} {currentQuestion.answerUnit}
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4 mr-1.5" />
                  Incorrect. Correct answer: {currentQuestion.correctAnswer} {currentQuestion.answerUnit}
                </>
              )}
            </div>
          )}
        </div>
        
        <AnimatePresence>
          {showExplanation && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 overflow-hidden"
            >
              <div className={`rounded-md p-4 ${
                isCorrect ? 'bg-green-100 border border-green-300' : 'bg-amber-100 border border-amber-300'
              }`}>
                <div className="flex items-start">
                  {isCorrect ? (
                    <CheckCircle2 className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="h-5 w-5 text-amber-600 mr-2 flex-shrink-0 mt-0.5" />
                  )}
                  <div>
                    <p className="font-medium text-gray-900 mb-2">{isCorrect ? 'Great job!' : 'Solution:'}</p>
                    <p className="whitespace-pre-line text-gray-800">{currentQuestion.explanation}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <div className="flex justify-between">
          <button
            onClick={resetGame}
            className="flex items-center px-3 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
          >
            <ListRestart className="h-4 w-4 mr-1.5" />
            Reset
          </button>
          
          <div className="space-x-3">
            {gameState === 'playing' && (
              <button
                onClick={checkAnswer}
                className="px-4 py-2 bg-[#13294B] text-white rounded-md hover:bg-[#0A1E3A] transition-colors flex items-center"
                disabled={userAnswer.trim() === ''}
              >
                Submit Answer
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </button>
            )}
            
            {gameState === 'checking' && (
              <button
                onClick={nextQuestion}
                className="px-4 py-2 bg-[#4B9CD3] text-white rounded-md hover:bg-[#3d7eaa] transition-colors"
              >
                {questionIndex === dosageQuestions.length - 1 ? 'Finish Game' : 'Next Question'}
              </button>
            )}
            
            {onClose && (
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
              >
                Exit Game
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Calculator Popup */}
      {showCalculator && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowCalculator(false)}>
          <div className="bg-white rounded-lg w-80 shadow-xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="bg-gray-100 p-3 border-b border-gray-200">
              <div className="font-mono text-right text-lg p-2 bg-white border border-gray-300 rounded">
                {calculatorValue || '0'}
              </div>
            </div>
            
            <div className="p-3">
              <div className="grid grid-cols-4 gap-2">
                {['7', '8', '9', '/'].map(btn => (
                  <button
                    key={btn}
                    onClick={() => handleCalculatorInput(btn)}
                    className="p-3 bg-gray-100 hover:bg-gray-200 rounded text-center font-medium"
                  >
                    {btn}
                  </button>
                ))}
                
                {['4', '5', '6', '*'].map(btn => (
                  <button
                    key={btn}
                    onClick={() => handleCalculatorInput(btn)}
                    className="p-3 bg-gray-100 hover:bg-gray-200 rounded text-center font-medium"
                  >
                    {btn}
                  </button>
                ))}
                
                {['1', '2', '3', '-'].map(btn => (
                  <button
                    key={btn}
                    onClick={() => handleCalculatorInput(btn)}
                    className="p-3 bg-gray-100 hover:bg-gray-200 rounded text-center font-medium"
                  >
                    {btn}
                  </button>
                ))}
                
                {['0', '.', '=', '+'].map(btn => (
                  <button
                    key={btn}
                    onClick={() => handleCalculatorInput(btn)}
                    className={`p-3 ${
                      btn === '=' 
                        ? 'bg-[#4B9CD3] hover:bg-[#3d7eaa] text-white' 
                        : 'bg-gray-100 hover:bg-gray-200'
                    } rounded text-center font-medium`}
                  >
                    {btn}
                  </button>
                ))}
                
                <button
                  onClick={() => handleCalculatorInput('C')}
                  className="p-3 bg-red-100 hover:bg-red-200 text-red-600 rounded text-center font-medium col-span-2"
                >
                  Clear
                </button>
                
                <button
                  onClick={() => handleCalculatorInput('←')}
                  className="p-3 bg-gray-100 hover:bg-gray-200 rounded text-center font-medium col-span-2"
                >
                  Backspace
                </button>
              </div>
              
              <div className="mt-3 grid grid-cols-2 gap-2">
                <button
                  onClick={() => setShowCalculator(false)}
                  className="p-2 border border-gray-300 rounded text-gray-700 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={applyCalculatorResult}
                  className="p-2 bg-[#13294B] text-white rounded font-medium"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { ListRestart, CheckCircle2, Award, XCircle, Heart, Timer, Stethoscope, Lightbulb } from 'lucide-react';
import { MedicalSpinner } from '@/components/ui/medical-spinner';

interface NursingPriorityGameProps {
  onComplete?: (score: number) => void;
  onClose?: () => void;
}

interface Scenario {
  id: number;
  title: string;
  patientInfo: string;
  interventions: Intervention[];
  explanation: string;
}

interface Intervention {
  id: string;
  text: string;
  priority: 1 | 2 | 3 | 4 | 5; // 1 is highest priority, 5 is lowest
}

const scenarios: Scenario[] = [
  {
    id: 1,
    title: "Post-Operative Patient Care",
    patientInfo: "Mr. Jones, 65, is 2 hours post-op from abdominal surgery. Vital signs: BP 100/60, HR 110, RR 22, T 100.2°F, O2 sat 93% on room air. Incision is clean with minimal serosanguineous drainage.",
    interventions: [
      { id: "a", text: "Administer pain medication as prescribed", priority: 2 },
      { id: "b", text: "Assess respiratory status and encourage deep breathing", priority: 1 },
      { id: "c", text: "Assist patient to turn to side and reposition", priority: 3 },
      { id: "d", text: "Document vital signs and assessment findings", priority: 5 },
      { id: "e", text: "Check incision site and dressing integrity", priority: 4 }
    ],
    explanation: "Respiratory assessment is highest priority (ABCs). Pain management is next to promote healing and comfort. Repositioning helps prevent complications. Checking the incision site follows, and documentation, while important, is lowest priority in this acute scenario."
  },
  {
    id: 2,
    title: "Pediatric Dehydration",
    patientInfo: "Toddler admitted with gastroenteritis, showing signs of moderate dehydration. Lethargic, decreased urinary output, dry mucous membranes, HR 150, sunken eyes.",
    interventions: [
      { id: "a", text: "Start IV fluids as ordered", priority: 1 },
      { id: "b", text: "Check vital signs every hour", priority: 3 },
      { id: "c", text: "Provide small amounts of oral rehydration solution", priority: 2 },
      { id: "d", text: "Educate parents on signs of dehydration", priority: 5 },
      { id: "e", text: "Monitor intake and output strictly", priority: 4 }
    ],
    explanation: "IV fluid replacement is highest priority to address potentially life-threatening dehydration. Oral rehydration is next if tolerated. Monitoring vital signs is needed to track status. Strict I&O helps evaluate effectiveness. Parent education is important but not the immediate priority."
  },
  {
    id: 3,
    title: "Chest Pain Management",
    patientInfo: "Mrs. Smith, 58, arrived at the emergency department with chest pain radiating to left arm, shortness of breath, and diaphoresis. History of hypertension.",
    interventions: [
      { id: "a", text: "Administer aspirin as ordered", priority: 2 },
      { id: "b", text: "Apply oxygen and monitor O2 saturation", priority: 1 },
      { id: "c", text: "Obtain 12-lead ECG", priority: 3 },
      { id: "d", text: "Start IV access", priority: 4 },
      { id: "e", text: "Take detailed history of pain characteristics", priority: 5 }
    ],
    explanation: "Oxygenation is highest priority (ABCs). Aspirin administration can be life-saving in suspected MI. ECG provides crucial diagnostic information. IV access enables medication administration. Pain history is important but other interventions take precedence in this emergency."
  },
  {
    id: 4,
    title: "Diabetic Ketoacidosis",
    patientInfo: "Teenage patient with type 1 diabetes presents with fruity breath, Kussmaul respirations, blood glucose 450 mg/dL, and lethargy.",
    interventions: [
      { id: "a", text: "Administer insulin as ordered", priority: 2 },
      { id: "b", text: "Begin IV fluid resuscitation", priority: 1 },
      { id: "c", text: "Monitor electrolytes, especially potassium", priority: 3 },
      { id: "d", text: "Check blood glucose hourly", priority: 4 },
      { id: "e", text: "Contact diabetes educator for follow-up education", priority: 5 }
    ],
    explanation: "Fluid resuscitation is highest priority to address dehydration. Insulin therapy follows to correct hyperglycemia. Electrolyte monitoring is crucial as treatment can cause dangerous shifts. Regular glucose monitoring evaluates treatment effectiveness. Education is important but comes after stabilization."
  },
  {
    id: 5,
    title: "Postpartum Hemorrhage",
    patientInfo: "New mother 1 hour after vaginal delivery with heavy bleeding, uterus boggy to palpation, BP 90/50, HR 120.",
    interventions: [
      { id: "a", text: "Massage uterine fundus to promote contractility", priority: 1 },
      { id: "b", text: "Administer oxytocin as ordered", priority: 2 },
      { id: "c", text: "Increase IV fluid rate", priority: 3 },
      { id: "d", text: "Monitor vital signs every 15 minutes", priority: 4 },
      { id: "e", text: "Weigh pads to quantify blood loss", priority: 5 }
    ],
    explanation: "Uterine massage directly addresses the cause of bleeding. Oxytocin administration helps maintain uterine contraction. Increased IV fluids support circulatory status. Frequent vital signs monitoring tracks response to interventions. Quantifying blood loss is important for ongoing assessment but less urgent than stopping the hemorrhage."
  }
];

export function NursingPriorityGame({ onComplete, onClose }: NursingPriorityGameProps) {
  const [currentScenario, setCurrentScenario] = useState<Scenario>(scenarios[0]);
  const [shuffledInterventions, setShuffledInterventions] = useState<Intervention[]>([]);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameState, setGameState] = useState<'playing' | 'checking' | 'results'>('playing');
  const [correctOrder, setCorrectOrder] = useState<Intervention[]>([]);
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [consecutiveCorrect, setConsecutiveCorrect] = useState(0);
  const [streak, setStreak] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  // Load and shuffle the initial scenario
  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      loadScenario(scenarioIndex);
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
  
  const loadScenario = (index: number) => {
    const scenario = scenarios[index];
    setCurrentScenario(scenario);
    
    // Create a shuffled copy of the interventions
    const shuffled = [...scenario.interventions].sort(() => Math.random() - 0.5);
    setShuffledInterventions(shuffled);
    
    // Store correct order for checking later
    const correct = [...scenario.interventions].sort((a, b) => a.priority - b.priority);
    setCorrectOrder(correct);
    
    // Reset state for new scenario
    setShowExplanation(false);
    setTimeLeft(60);
    setGameState('playing');
  };
  
  const checkAnswer = () => {
    setGameState('checking');
    
    // Compare user's order with correct order
    let correct = true;
    let points = 0;
    
    for (let i = 0; i < shuffledInterventions.length; i++) {
      if (shuffledInterventions[i].id === correctOrder[i].id) {
        points += 20; // 20 points per correct position (max 100)
      } else {
        correct = false;
      }
    }
    
    // Update score and streak
    setScore(prevScore => prevScore + points);
    
    if (correct) {
      setConsecutiveCorrect(prev => prev + 1);
      setStreak(prev => Math.max(prev, consecutiveCorrect + 1));
    } else {
      setConsecutiveCorrect(0);
    }
    
    // Show explanation
    setShowExplanation(true);
  };
  
  const nextScenario = () => {
    const nextIndex = (scenarioIndex + 1) % scenarios.length;
    setScenarioIndex(nextIndex);
    setIsLoading(true);
    
    // Simulate loading time between scenarios
    setTimeout(() => {
      loadScenario(nextIndex);
      setIsLoading(false);
    }, 1000);
  };
  
  const resetGame = () => {
    setScore(0);
    setScenarioIndex(0);
    setConsecutiveCorrect(0);
    setStreak(0);
    setIsLoading(true);
    
    setTimeout(() => {
      loadScenario(0);
      setIsLoading(false);
    }, 1000);
  };
  
  const finishGame = () => {
    setGameState('results');
    if (onComplete) {
      onComplete(score);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 bg-white rounded-lg shadow-md p-8">
        <MedicalSpinner type="stethoscope" size="lg" text="Loading nursing scenario..." />
      </div>
    );
  }
  
  if (gameState === 'results') {
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-[#13294B] text-white p-4">
          <h2 className="text-xl font-bold">Game Results</h2>
        </div>
        
        <div className="p-6">
          <div className="flex flex-col items-center justify-center">
            <div className="mb-6">
              <Award className="h-16 w-16 text-yellow-500" />
            </div>
            
            <h3 className="text-2xl font-bold mb-2">Final Score: {score}</h3>
            <p className="text-lg mb-4">Best Streak: {streak} in a row</p>
            
            <div className="grid grid-cols-2 gap-4 w-full max-w-md mb-6">
              <div className="bg-blue-50 border border-blue-200 rounded p-4 text-center">
                <div className="text-sm text-blue-500 mb-1">Scenarios</div>
                <div className="font-bold text-blue-700 text-xl">{scenarioIndex + 1}</div>
              </div>
              <div className="bg-green-50 border border-green-200 rounded p-4 text-center">
                <div className="text-sm text-green-500 mb-1">Avg. Score</div>
                <div className="font-bold text-green-700 text-xl">
                  {Math.round(score / (scenarioIndex + 1))}%
                </div>
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
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-[#13294B] text-white p-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Nursing Priority Game</h2>
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
          <Stethoscope className="h-4 w-4 mr-1.5" />
          <span>Scenario {scenarioIndex + 1} of {scenarios.length}</span>
          <span className="mx-4">|</span>
          <span>Streak: {consecutiveCorrect}</span>
        </div>
      </div>
      
      <div className="p-6">
        <div className="mb-4">
          <h3 className="text-lg font-bold text-[#13294B] mb-2">{currentScenario.title}</h3>
          <div className="bg-blue-100 border border-blue-300 p-4 rounded-md mb-4">
            <p className="text-blue-900">{currentScenario.patientInfo}</p>
          </div>
          
          <p className="text-sm font-medium mb-2">
            Drag to arrange nursing interventions in order of priority (highest to lowest):
          </p>
        </div>
        
        <Reorder.Group 
          values={shuffledInterventions} 
          onReorder={setShuffledInterventions}
          className="space-y-2 mb-6"
          axis="y"
        >
          {shuffledInterventions.map((intervention, index) => (
            <Reorder.Item
              key={intervention.id}
              value={intervention}
              className={`p-3 rounded-md border-2 cursor-move text-gray-900 ${
                gameState === 'checking' 
                  ? intervention.id === correctOrder[index].id 
                    ? 'border-green-500 bg-green-100' 
                    : 'border-red-500 bg-red-100'
                  : 'border-gray-300 hover:border-[#4B9CD3] hover:bg-blue-100'
              }`}
              disabled={gameState !== 'playing'}
            >
              <div className="flex items-center">
                <div className="mr-3 flex-shrink-0 h-6 w-6 rounded-full bg-gray-300 flex items-center justify-center font-medium text-gray-900">
                  {gameState === 'checking' ? (
                    intervention.id === correctOrder[index].id ? (
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600" />
                    )
                  ) : (
                    index + 1
                  )}
                </div>
                <div className="flex-1">{intervention.text}</div>
                {gameState === 'checking' && correctOrder.findIndex(i => i.id === intervention.id) !== index && (
                  <div className="text-sm flex items-center ml-2 bg-gray-100 px-2 py-1 rounded border border-gray-300">
                    <span className="text-gray-900">Should be </span>
                    <span className="font-bold ml-1 text-[#13294B]">
                      #{correctOrder.findIndex(i => i.id === intervention.id) + 1}
                    </span>
                  </div>
                )}
              </div>
            </Reorder.Item>
          ))}
        </Reorder.Group>
        
        <AnimatePresence>
          {showExplanation && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 overflow-hidden"
            >
              <div className="bg-amber-100 border border-amber-300 rounded-md p-4">
                <div className="flex items-start">
                  <Lightbulb className="h-5 w-5 text-amber-600 mr-2 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-amber-900 mb-2">Explanation:</p>
                    <p className="text-amber-900">{currentScenario.explanation}</p>
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
                className="px-4 py-2 bg-[#13294B] text-white rounded-md hover:bg-[#0A1E3A] transition-colors"
              >
                Submit Answer
              </button>
            )}
            
            {gameState === 'checking' && (
              scenarioIndex < scenarios.length - 1 ? (
                <button
                  onClick={nextScenario}
                  className="px-4 py-2 bg-[#4B9CD3] text-white rounded-md hover:bg-[#3d7eaa] transition-colors"
                >
                  Next Scenario
                </button>
              ) : (
                <button
                  onClick={finishGame}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  Finish Game
                </button>
              )
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
    </div>
  );
}
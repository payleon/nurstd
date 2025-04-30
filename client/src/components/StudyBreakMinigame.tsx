import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { motion, AnimatePresence } from 'framer-motion';
import { shuffle } from '@/lib/utils';

// Define trivia question types
export interface TriviaQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number; // Index of correct option
  category: 'anatomy' | 'pharmacology' | 'procedures' | 'medical-history' | 'terminology';
  difficulty: 'easy' | 'medium' | 'hard';
  explanation: string;
  points: number;
}

// Sample trivia questions for the minigame
const triviaQuestions: TriviaQuestion[] = [
  {
    id: 1,
    question: "What is the largest organ in the human body?",
    options: ["Heart", "Liver", "Skin", "Brain"],
    correctAnswer: 2,
    category: 'anatomy',
    difficulty: 'easy',
    explanation: "The skin is the largest organ of the human body, accounting for about 15% of total body weight and covering an area of 1.5-2 square meters.",
    points: 5
  },
  {
    id: 2,
    question: "Which of these medications is classified as an ACE inhibitor?",
    options: ["Lisinopril", "Atorvastatin", "Metformin", "Albuterol"],
    correctAnswer: 0,
    category: 'pharmacology',
    difficulty: 'medium',
    explanation: "Lisinopril is an angiotensin-converting enzyme (ACE) inhibitor used primarily in treatment of hypertension, heart failure, and after heart attacks.",
    points: 10
  },
  {
    id: 3,
    question: "What is the primary purpose of the Glasgow Coma Scale?",
    options: ["Measure blood pressure", "Assess level of consciousness", "Evaluate pain levels", "Calculate drug dosages"],
    correctAnswer: 1,
    category: 'procedures',
    difficulty: 'medium',
    explanation: "The Glasgow Coma Scale (GCS) is a neurological scale designed to assess the level of consciousness after traumatic brain injury.",
    points: 10
  },
  {
    id: 4,
    question: "Florence Nightingale was known for her pioneering work during which war?",
    options: ["World War I", "American Civil War", "Crimean War", "World War II"],
    correctAnswer: 2,
    category: 'medical-history',
    difficulty: 'medium',
    explanation: "Florence Nightingale gained prominence for her pioneering nursing work during the Crimean War (1853-1856), establishing the foundation for modern nursing practice.",
    points: 8
  },
  {
    id: 5,
    question: "What does the medical term 'dyspnea' refer to?",
    options: ["Difficulty swallowing", "Excessive thirst", "Shortness of breath", "Poor vision"],
    correctAnswer: 2,
    category: 'terminology',
    difficulty: 'easy',
    explanation: "Dyspnea refers to shortness of breath or difficult/labored breathing, which can be a symptom of various cardiovascular and respiratory conditions.",
    points: 5
  },
  {
    id: 6,
    question: "Which chamber of the heart receives oxygenated blood from the lungs?",
    options: ["Right atrium", "Right ventricle", "Left atrium", "Left ventricle"],
    correctAnswer: 2,
    category: 'anatomy',
    difficulty: 'medium',
    explanation: "The left atrium receives oxygenated blood from the lungs via the pulmonary veins, which then flows to the left ventricle to be pumped to the body.",
    points: 8
  },
  {
    id: 7,
    question: "What is the correct procedure for measuring blood pressure using a manual sphygmomanometer?",
    options: [
      "Apply cuff, inflate to 120 mmHg, listen for Korotkoff sounds",
      "Apply cuff, inflate to 180 mmHg, watch for arm movement",
      "Apply cuff, inflate above expected systolic, listen for Korotkoff sounds", 
      "Apply cuff, inflate to 100 mmHg, observe pressure gauge"
    ],
    correctAnswer: 2,
    category: 'procedures',
    difficulty: 'medium',
    explanation: "The correct procedure is to apply the cuff, inflate it above the expected systolic pressure, then gradually release while listening for Korotkoff sounds to identify both systolic and diastolic readings.",
    points: 8
  },
  {
    id: 8,
    question: "Which vitamin deficiency can lead to scurvy?",
    options: ["Vitamin A", "Vitamin C", "Vitamin D", "Vitamin K"],
    correctAnswer: 1,
    category: 'pharmacology',
    difficulty: 'easy',
    explanation: "Vitamin C (ascorbic acid) deficiency leads to scurvy, which is characterized by bleeding gums, bruising, and poor wound healing.",
    points: 5
  },
  {
    id: 9,
    question: "What does the abbreviation 'NPO' mean in medical context?",
    options: ["No Physician Order", "Normal Postoperative Observation", "Nothing By Mouth", "Nursing Protocol Order"],
    correctAnswer: 2,
    category: 'terminology',
    difficulty: 'easy',
    explanation: "NPO stands for 'Nil Per Os' or 'Nothing By Mouth', a medical instruction to withhold food and fluids from a patient, often before surgery or certain procedures.",
    points: 5
  },
  {
    id: 10,
    question: "Who developed the first polio vaccine that was declared safe in 1955?",
    options: ["Edward Jenner", "Jonas Salk", "Louis Pasteur", "Alexander Fleming"],
    correctAnswer: 1,
    category: 'medical-history',
    difficulty: 'medium',
    explanation: "Jonas Salk developed the first successful polio vaccine, which was declared safe and effective in 1955 and helped to nearly eradicate the disease globally.",
    points: 8
  },
  {
    id: 11,
    question: "The normal resting heart rate for adults ranges from:",
    options: ["40-60 BPM", "60-100 BPM", "100-120 BPM", "120-140 BPM"],
    correctAnswer: 1,
    category: 'anatomy',
    difficulty: 'easy',
    explanation: "The normal resting heart rate for adults ranges from 60 to 100 beats per minute, though well-conditioned athletes may have a lower normal rate.",
    points: 5
  },
  {
    id: 12,
    question: "Which medication would be most appropriate for a patient experiencing anaphylaxis?",
    options: ["Diphenhydramine", "Epinephrine", "Albuterol", "Acetaminophen"],
    correctAnswer: 1,
    category: 'pharmacology',
    difficulty: 'medium',
    explanation: "Epinephrine is the first-line treatment for anaphylaxis, a severe, potentially life-threatening allergic reaction, due to its ability to quickly reverse symptoms.",
    points: 10
  },
  {
    id: 13,
    question: "What is the proper hand hygiene technique duration recommended by the WHO?",
    options: ["At least 5 seconds", "At least 10 seconds", "At least 20 seconds", "At least 40 seconds"],
    correctAnswer: 3,
    category: 'procedures',
    difficulty: 'medium',
    explanation: "The World Health Organization (WHO) recommends hand rubbing with alcohol-based formulation for 20-30 seconds and handwashing with soap and water for 40-60 seconds.",
    points: 8
  },
  {
    id: 14,
    question: "What anatomical structure connects the pharynx to the stomach?",
    options: ["Trachea", "Esophagus", "Duodenum", "Jejunum"],
    correctAnswer: 1,
    category: 'anatomy',
    difficulty: 'easy',
    explanation: "The esophagus is a muscular tube that connects the pharynx (throat) to the stomach, allowing food and liquids to pass into the digestive system.",
    points: 5
  },
  {
    id: 15,
    question: "In medical terminology, what does the prefix 'tachy-' indicate?",
    options: ["Slow", "Fast", "Pain", "Inflammation"],
    correctAnswer: 1,
    category: 'terminology',
    difficulty: 'easy',
    explanation: "The prefix 'tachy-' indicates fast or rapid, as in tachycardia (rapid heart rate) or tachypnea (rapid breathing).",
    points: 5
  }
];

interface StudyBreakMinigameProps {
  onComplete?: (score: number) => void;
  isOpen: boolean;
  onClose: () => void;
  timeLimitSeconds?: number;
}

export function StudyBreakMinigame({ 
  onComplete, 
  isOpen, 
  onClose, 
  timeLimitSeconds = 120 
}: StudyBreakMinigameProps) {
  const [gameMode, setGameMode] = useState<'trivia' | 'flashcard'>('trivia');
  const [questions, setQuestions] = useState<TriviaQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [timeLeft, setTimeLeft] = useState(timeLimitSeconds);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [category, setCategory] = useState<TriviaQuestion['category'] | 'all'>('all');

  // Initialize game
  useEffect(() => {
    if (isOpen && !gameStarted) {
      // Get 5 random questions
      const randomQuestions = shuffle([...triviaQuestions]).slice(0, 5);
      setQuestions(randomQuestions);
      setCurrentQuestionIndex(0);
      setScore(0);
      setSelectedOption(null);
      setShowExplanation(false);
      setTimeLeft(timeLimitSeconds);
      setGameOver(false);
    }
  }, [isOpen, gameStarted, timeLimitSeconds]);

  // Timer effect
  useEffect(() => {
    if (!gameStarted || gameOver || !isOpen) return;

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          handleGameOver();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameStarted, gameOver, isOpen]);

  const handleGameStart = () => {
    setGameStarted(true);
  };

  const handleOptionSelect = (optionIndex: number) => {
    if (showExplanation) return; // Prevent selecting after answer revealed
    
    setSelectedOption(optionIndex);
    const currentQuestion = questions[currentQuestionIndex];
    const correct = optionIndex === currentQuestion.correctAnswer;
    
    setIsCorrect(correct);
    if (correct) {
      setScore(prev => prev + currentQuestion.points);
    }
    
    setShowExplanation(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    } else {
      handleGameOver();
    }
  };

  const handleGameOver = () => {
    setGameOver(true);
    if (onComplete) {
      onComplete(score);
    }
  };

  const handlePlayAgain = () => {
    // Reset game state but keep dialog open
    setGameStarted(false);
    setGameOver(false);
    // Get new set of questions
    const randomQuestions = shuffle([...triviaQuestions]).slice(0, 5);
    setQuestions(randomQuestions);
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedOption(null);
    setShowExplanation(false);
    setTimeLeft(timeLimitSeconds);
  };

  const handleClose = () => {
    // Reset all states
    setGameStarted(false);
    setGameOver(false);
    onClose();
  };

  const filterQuestionsByCategory = (category: TriviaQuestion['category'] | 'all') => {
    if (category === 'all') {
      return shuffle([...triviaQuestions]).slice(0, 5);
    }
    
    const filteredQuestions = triviaQuestions.filter(q => q.category === category);
    // If not enough questions in category, add some from other categories
    if (filteredQuestions.length < 5) {
      const remainingQuestions = triviaQuestions.filter(q => q.category !== category);
      return [...filteredQuestions, ...shuffle(remainingQuestions)].slice(0, 5);
    }
    
    return shuffle(filteredQuestions).slice(0, 5);
  };

  const handleCategoryChange = (newCategory: TriviaQuestion['category'] | 'all') => {
    setCategory(newCategory);
    setQuestions(filterQuestionsByCategory(newCategory));
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedOption(null);
    setShowExplanation(false);
  };

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' + secs : secs}`;
  };

  const currentQuestion = questions[currentQuestionIndex];
  const progressPercentage = (currentQuestionIndex / questions.length) * 100;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Study Break Mini-Game
          </DialogTitle>
          <DialogDescription className="text-center">
            Take a quick break with some medical trivia to refresh your mind!
          </DialogDescription>
        </DialogHeader>

        {!gameStarted && !gameOver ? (
          <div className="flex flex-col items-center space-y-6 p-4">
            <div className="text-center space-y-2">
              <h3 className="text-xl font-semibold">Select Category</h3>
              <div className="flex flex-wrap justify-center gap-2">
                <Button 
                  variant={category === 'all' ? 'default' : 'outline'} 
                  onClick={() => handleCategoryChange('all')}
                  className="min-w-24"
                >
                  All Topics
                </Button>
                <Button 
                  variant={category === 'anatomy' ? 'default' : 'outline'} 
                  onClick={() => handleCategoryChange('anatomy')}
                  className="min-w-24"
                >
                  Anatomy
                </Button>
                <Button 
                  variant={category === 'pharmacology' ? 'default' : 'outline'} 
                  onClick={() => handleCategoryChange('pharmacology')}
                  className="min-w-24"
                >
                  Pharmacology
                </Button>
                <Button 
                  variant={category === 'procedures' ? 'default' : 'outline'} 
                  onClick={() => handleCategoryChange('procedures')}
                  className="min-w-24"
                >
                  Procedures
                </Button>
                <Button 
                  variant={category === 'terminology' ? 'default' : 'outline'} 
                  onClick={() => handleCategoryChange('terminology')}
                  className="min-w-24"
                >
                  Terminology
                </Button>
                <Button 
                  variant={category === 'medical-history' ? 'default' : 'outline'} 
                  onClick={() => handleCategoryChange('medical-history')}
                  className="min-w-24"
                >
                  History
                </Button>
              </div>
            </div>
            
            <Card className="w-full p-6 shadow-lg">
              <h3 className="text-xl font-bold mb-4">How to Play</h3>
              <ul className="space-y-2 list-disc pl-5">
                <li>You'll get 5 medical trivia questions to answer</li>
                <li>Each correct answer earns you points based on difficulty</li>
                <li>You have {formatTime(timeLimitSeconds)} to complete all questions</li>
                <li>After each question, you'll see an explanation to help you learn</li>
              </ul>
            </Card>
            
            <Button 
              onClick={handleGameStart} 
              size="lg" 
              className="mt-4 text-lg"
            >
              Start Game
            </Button>
          </div>
        ) : gameOver ? (
          <div className="flex flex-col items-center space-y-6 p-4">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <h2 className="text-2xl font-bold mb-2">Game Complete!</h2>
              <p className="text-xl mb-6">Your Score: {score} points</p>
              
              <Card className="w-full p-6 mb-6 shadow-lg">
                <h3 className="text-lg font-semibold mb-3">What You've Learned:</h3>
                <ul className="space-y-2 text-left">
                  {questions.map((q, index) => (
                    <li key={q.id} className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>
                        <span className="font-medium">{q.category}:</span> {q.question} — 
                        <span className="text-gray-600 text-sm ml-1">{q.explanation.split('.')[0]}.</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </Card>
            </motion.div>
            
            <div className="flex space-x-4">
              <Button onClick={handlePlayAgain} variant="outline">
                Play Again
              </Button>
              <Button onClick={handleClose}>
                Return to Study
              </Button>
            </div>
          </div>
        ) : currentQuestion ? (
          <div className="flex flex-col space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">
                Question {currentQuestionIndex + 1} of {questions.length}
              </span>
              <span className="text-sm font-medium">
                Score: {score}
              </span>
              <span className={`text-sm font-medium ${timeLeft < 30 ? 'text-red-500' : ''}`}>
                Time: {formatTime(timeLeft)}
              </span>
            </div>
            
            <Progress value={progressPercentage} className="h-2" />
            
            <Card className="p-6 shadow-lg">
              <div className="flex items-center space-x-2 mb-2">
                <span className={`px-2 py-1 rounded text-xs font-semibold 
                  ${currentQuestion.category === 'anatomy' ? 'bg-blue-100 text-blue-800' : 
                    currentQuestion.category === 'pharmacology' ? 'bg-green-100 text-green-800' : 
                    currentQuestion.category === 'procedures' ? 'bg-purple-100 text-purple-800' : 
                    currentQuestion.category === 'terminology' ? 'bg-amber-100 text-amber-800' : 
                    'bg-rose-100 text-rose-800'}`}
                >
                  {currentQuestion.category}
                </span>
                <span className={`px-2 py-1 rounded text-xs font-semibold 
                  ${currentQuestion.difficulty === 'easy' ? 'bg-green-100 text-green-800' : 
                    currentQuestion.difficulty === 'medium' ? 'bg-amber-100 text-amber-800' : 
                    'bg-red-100 text-red-800'}`}
                >
                  {currentQuestion.difficulty}
                </span>
                <span className="ml-auto text-sm font-medium">
                  {currentQuestion.points} points
                </span>
              </div>
              
              <h3 className="text-xl font-bold mb-4">
                {currentQuestion.question}
              </h3>
              
              <div className="space-y-2">
                {currentQuestion.options.map((option, index) => (
                  <Button
                    key={index}
                    variant={
                      selectedOption === null ? "outline" :
                      selectedOption === index && isCorrect ? "success" :
                      selectedOption === index && !isCorrect ? "destructive" :
                      currentQuestion.correctAnswer === index && showExplanation ? "success" :
                      "outline"
                    }
                    className={`w-full justify-start text-left p-4 h-auto ${
                      selectedOption === null ? "hover:bg-gray-100" : ""
                    }`}
                    onClick={() => handleOptionSelect(index)}
                    disabled={showExplanation}
                  >
                    <span className="font-semibold mr-2">{String.fromCharCode(65 + index)}.</span>
                    {option}
                  </Button>
                ))}
              </div>
              
              <AnimatePresence>
                {showExplanation && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-4 p-4 bg-gray-50 rounded-md border"
                  >
                    <h4 className="font-semibold mb-2">Explanation:</h4>
                    <p>{currentQuestion.explanation}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
            
            {showExplanation && (
              <div className="flex justify-end">
                <Button 
                  onClick={handleNextQuestion} 
                  size="lg"
                >
                  {currentQuestionIndex < questions.length - 1 ? "Next Question" : "See Results"}
                </Button>
              </div>
            )}
          </div>
        ) : null}
        
        <DialogFooter className="flex justify-between items-center">
          <div>
            <Button variant="ghost" onClick={handleClose}>
              Exit Game
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
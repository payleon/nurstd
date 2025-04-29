import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, ListRestart, CheckCircle2, Award, XCircle, Heart, Timer, ArrowRight, HelpCircle } from 'lucide-react';
import { MedicalSpinner } from '@/components/ui/medical-spinner';

interface ECGRhythmGameProps {
  onComplete?: (score: number) => void;
  onClose?: () => void;
}

interface ECGRhythm {
  id: number;
  name: string;
  imagePath: string;
  description: string;
  characteristics: string[];
  nursingActions: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  urgency: 'normal' | 'urgent' | 'emergency';
}

// ECG Rhythm patterns with descriptions and images
const ecgRhythms: ECGRhythm[] = [
  {
    id: 1,
    name: "Normal Sinus Rhythm",
    imagePath: "/images/rhythms/normal_sinus_rhythm.svg",
    description: "The normal heart rhythm originating from the sinoatrial (SA) node.",
    characteristics: [
      "Rate: 60-100 beats per minute",
      "Rhythm: Regular",
      "P waves: Present, upright, and uniform",
      "PR interval: 0.12-0.20 seconds",
      "QRS duration: 0.06-0.10 seconds"
    ],
    nursingActions: [
      "Continue routine monitoring",
      "No immediate intervention required"
    ],
    difficulty: 'beginner',
    urgency: 'normal'
  },
  {
    id: 2,
    name: "Sinus Bradycardia",
    imagePath: "/images/rhythms/sinus_bradycardia.svg",
    description: "A slower than normal heart rhythm originating from the SA node.",
    characteristics: [
      "Rate: Less than 60 beats per minute",
      "Rhythm: Regular",
      "P waves: Present, normal, and uniform",
      "PR interval: Normal (0.12-0.20 seconds)",
      "QRS duration: Normal (0.06-0.10 seconds)"
    ],
    nursingActions: [
      "Monitor for symptoms of decreased cardiac output",
      "Have atropine readily available",
      "Assess for causes (medications, increased vagal tone, etc.)"
    ],
    difficulty: 'beginner',
    urgency: 'normal'
  },
  {
    id: 3,
    name: "Sinus Tachycardia",
    imagePath: "/images/rhythms/sinus_tachycardia.svg",
    description: "A faster than normal heart rhythm originating from the SA node.",
    characteristics: [
      "Rate: Greater than 100 beats per minute",
      "Rhythm: Regular",
      "P waves: Present, normal, and uniform (may be difficult to distinguish from preceding T wave at very rapid rates)",
      "PR interval: Normal or slightly shortened",
      "QRS duration: Normal"
    ],
    nursingActions: [
      "Assess for underlying causes (fever, anxiety, pain, dehydration)",
      "Monitor for symptoms of decreased cardiac output at very rapid rates",
      "Administer medications as ordered to treat underlying cause"
    ],
    difficulty: 'beginner',
    urgency: 'normal'
  },
  {
    id: 4,
    name: "Atrial Fibrillation",
    imagePath: "/images/rhythms/atrial_fibrillation.svg",
    description: "Chaotic, irregular electrical activity in the atria resulting in an irregular ventricular response.",
    characteristics: [
      "Rate: Variable, often rapid (100-180 bpm)",
      "Rhythm: Irregularly irregular",
      "P waves: Absent, replaced by fibrillatory waves",
      "PR interval: Not measurable",
      "QRS duration: Usually normal unless aberrant conduction"
    ],
    nursingActions: [
      "Monitor for signs of decreased cardiac output",
      "Administer anticoagulants as ordered",
      "Prepare for rate control medications if ordered",
      "Prepare for cardioversion if unstable"
    ],
    difficulty: 'intermediate',
    urgency: 'urgent'
  },
  {
    id: 5,
    name: "Ventricular Tachycardia",
    imagePath: "/images/rhythms/ventricular_tachycardia.svg",
    description: "A rapid heart rhythm originating from the ventricles.",
    characteristics: [
      "Rate: 100-250 beats per minute",
      "Rhythm: Usually regular",
      "P waves: Usually not visible",
      "QRS duration: Widened (>0.12 seconds)",
      "T waves: Often in opposite direction of QRS"
    ],
    nursingActions: [
      "Check pulse and patient responsiveness",
      "If pulseless, begin CPR and follow ACLS protocols",
      "If pulse present, prepare for medications and possible cardioversion",
      "Provide supplemental oxygen"
    ],
    difficulty: 'advanced',
    urgency: 'emergency'
  },
  {
    id: 6,
    name: "Ventricular Fibrillation",
    imagePath: "/images/rhythms/ventricular_fibrillation.svg",
    description: "Chaotic, disorganized electrical activity in the ventricles resulting in no effective contractions.",
    characteristics: [
      "Rate: Not measurable",
      "Rhythm: Chaotic",
      "P waves: Absent",
      "QRS complexes: Absent, replaced by irregular, chaotic waveforms",
      "No coordinated electrical activity"
    ],
    nursingActions: [
      "Initiate CPR immediately",
      "Apply defibrillator/AED as soon as available",
      "Prepare for defibrillation",
      "Follow ACLS protocols"
    ],
    difficulty: 'advanced',
    urgency: 'emergency'
  },
  {
    id: 7,
    name: "First-Degree AV Block",
    imagePath: "/images/rhythms/first_degree_av_block.svg",
    description: "Delayed conduction through the AV node.",
    characteristics: [
      "Rate: Usually normal",
      "Rhythm: Regular",
      "P waves: Normal",
      "PR interval: Prolonged (>0.20 seconds)",
      "QRS duration: Normal"
    ],
    nursingActions: [
      "Usually requires no immediate treatment",
      "Monitor for progression to higher-degree blocks",
      "Assess for medication effects"
    ],
    difficulty: 'intermediate',
    urgency: 'normal'
  },
  {
    id: 8,
    name: "Second-Degree AV Block Type I (Wenckebach)",
    imagePath: "/images/rhythms/second_degree_type1.svg",
    description: "Progressive prolongation of PR interval until a P wave fails to conduct to the ventricles.",
    characteristics: [
      "Rate: Usually normal or slow",
      "Rhythm: Irregular but predictable pattern",
      "P waves: Normal, regular",
      "PR interval: Progressively lengthens until a P wave is not conducted",
      "QRS duration: Normal"
    ],
    nursingActions: [
      "Monitor for symptoms of decreased cardiac output",
      "Have atropine readily available",
      "Prepare for temporary pacing if symptomatic"
    ],
    difficulty: 'advanced',
    urgency: 'urgent'
  },
  {
    id: 9,
    name: "Second-Degree AV Block Type II",
    imagePath: "/images/rhythms/second_degree_type2.svg",
    description: "Intermittent failure of conduction of P waves to the ventricles without PR prolongation.",
    characteristics: [
      "Rate: Usually slow",
      "Rhythm: Usually regular with occasional nonconducted P waves",
      "P waves: Normal, some not followed by QRS complexes",
      "PR interval: Constant for conducted beats",
      "QRS duration: Often widened"
    ],
    nursingActions: [
      "Monitor closely for progression to complete heart block",
      "Prepare for temporary or permanent pacemaker insertion",
      "Have atropine available"
    ],
    difficulty: 'advanced',
    urgency: 'urgent'
  },
  {
    id: 10,
    name: "Third-Degree AV Block (Complete Heart Block)",
    imagePath: "/images/rhythms/third_degree_av_block.svg",
    description: "Complete failure of conduction between atria and ventricles.",
    characteristics: [
      "Rate: Atrial rate normal, ventricular rate slow (typically 20-40 bpm)",
      "Rhythm: Atrial and ventricular rhythms regular but independent of each other",
      "P waves: Present but not associated with QRS complexes",
      "PR interval: Variable and not measurable",
      "QRS duration: Often widened"
    ],
    nursingActions: [
      "Prepare for temporary pacemaker insertion",
      "Administer atropine or dopamine as ordered",
      "Monitor for signs of decreased cardiac output",
      "Have transcutaneous pacing available"
    ],
    difficulty: 'advanced',
    urgency: 'emergency'
  }
];

// SVG content for ECG rhythms
const ecgSVGs: { [key: string]: string } = {
  "/images/rhythms/normal_sinus_rhythm.svg": `<svg width="400" height="100" viewBox="0 0 400 100" xmlns="http://www.w3.org/2000/svg">
    <path d="M0,50 L30,50 L40,20 L50,80 L60,50 L90,50 L100,50 L110,20 L120,80 L130,50 L160,50 L170,50 L180,20 L190,80 L200,50 L230,50 L240,50 L250,20 L260,80 L270,50 L300,50 L310,50 L320,20 L330,80 L340,50 L370,50 L380,50 L390,20 L400,80" stroke="#00AA00" fill="none" stroke-width="2" />
  </svg>`,
  
  "/images/rhythms/sinus_bradycardia.svg": `<svg width="400" height="100" viewBox="0 0 400 100" xmlns="http://www.w3.org/2000/svg">
    <path d="M0,50 L50,50 L60,20 L70,80 L80,50 L130,50 L180,50 L190,20 L200,80 L210,50 L260,50 L310,50 L320,20 L330,80 L340,50 L390,50" stroke="#00AA00" fill="none" stroke-width="2" />
  </svg>`,
  
  "/images/rhythms/sinus_tachycardia.svg": `<svg width="400" height="100" viewBox="0 0 400 100" xmlns="http://www.w3.org/2000/svg">
    <path d="M0,50 L20,50 L25,20 L30,80 L35,50 L55,50 L75,50 L80,20 L85,80 L90,50 L110,50 L130,50 L135,20 L140,80 L145,50 L165,50 L185,50 L190,20 L195,80 L200,50 L220,50 L240,50 L245,20 L250,80 L255,50 L275,50 L295,50 L300,20 L305,80 L310,50 L330,50 L350,50 L355,20 L360,80 L365,50 L385,50" stroke="#F6AA00" fill="none" stroke-width="2" />
  </svg>`,
  
  "/images/rhythms/atrial_fibrillation.svg": `<svg width="400" height="100" viewBox="0 0 400 100" xmlns="http://www.w3.org/2000/svg">
    <path d="M0,50 
             C10,45 15,55 20,50 
             L30,50 L35,20 L40,80 L45,50 
             L60,50 
             C70,45 75,55 80,50 
             L95,50 L100,20 L105,80 L110,50 
             L125,50 
             C135,45 140,55 145,50 
             L155,50 L160,20 L165,80 L170,50 
             L190,50 
             C200,45 205,55 210,50 
             L225,50 L230,20 L235,80 L240,50 
             L260,50 
             C270,45 275,55 280,50 
             L290,50 L295,20 L300,80 L305,50 
             L320,50 
             C330,45 335,55 340,50 
             L355,50 L360,20 L365,80 L370,50 
             L385,50 
             C395,45 400,55 400,50" 
          stroke="#F6AA00" fill="none" stroke-width="2" />
  </svg>`,
  
  "/images/rhythms/ventricular_tachycardia.svg": `<svg width="400" height="100" viewBox="0 0 400 100" xmlns="http://www.w3.org/2000/svg">
    <path d="M0,50 L20,50 L20,20 L40,80 L40,50 L60,50 L80,50 L80,20 L100,80 L100,50 L120,50 L140,50 L140,20 L160,80 L160,50 L180,50 L200,50 L200,20 L220,80 L220,50 L240,50 L260,50 L260,20 L280,80 L280,50 L300,50 L320,50 L320,20 L340,80 L340,50 L360,50 L380,50 L380,20 L400,80" stroke="#FF0000" fill="none" stroke-width="2" />
  </svg>`,
  
  "/images/rhythms/ventricular_fibrillation.svg": `<svg width="400" height="100" viewBox="0 0 400 100" xmlns="http://www.w3.org/2000/svg">
    <path d="M0,50 C10,30 20,70 30,40 C40,60 50,20 60,50 C70,30 80,70 90,40 C100,60 110,20 120,50 C130,30 140,70 150,40 C160,60 170,20 180,50 C190,30 200,70 210,40 C220,60 230,20 240,50 C250,30 260,70 270,40 C280,60 290,20 300,50 C310,30 320,70 330,40 C340,60 350,20 360,50 C370,30 380,70 390,40 C400,60 410,20 420,50" stroke="#FF0000" fill="none" stroke-width="2" />
  </svg>`,
  
  "/images/rhythms/first_degree_av_block.svg": `<svg width="400" height="100" viewBox="0 0 400 100" xmlns="http://www.w3.org/2000/svg">
    <path d="M0,50 L10,50 L20,40 L30,50 L50,50 L60,20 L70,80 L80,50 L100,50 L110,50 L120,40 L130,50 L150,50 L160,20 L170,80 L180,50 L200,50 L210,50 L220,40 L230,50 L250,50 L260,20 L270,80 L280,50 L300,50 L310,50 L320,40 L330,50 L350,50 L360,20 L370,80 L380,50 L400,50" stroke="#F6AA00" fill="none" stroke-width="2" />
  </svg>`,
  
  "/images/rhythms/second_degree_type1.svg": `<svg width="400" height="100" viewBox="0 0 400 100" xmlns="http://www.w3.org/2000/svg">
    <path d="M0,50 L10,50 L20,40 L30,50 L60,50 L70,20 L80,80 L90,50 L120,50 L130,50 L140,40 L150,50 L190,50 L200,20 L210,80 L220,50 L250,50 L260,50 L270,40 L280,50 L330,50 L340,40 L350,50 L380,50" stroke="#F6AA00" fill="none" stroke-width="2" />
  </svg>`,
  
  "/images/rhythms/second_degree_type2.svg": `<svg width="400" height="100" viewBox="0 0 400 100" xmlns="http://www.w3.org/2000/svg">
    <path d="M0,50 L10,50 L20,40 L30,50 L40,50 L70,20 L80,80 L90,50 L120,50 L130,50 L140,40 L150,50 L160,50 L190,50 L220,50 L230,40 L240,50 L250,50 L280,20 L290,80 L300,50 L330,50 L340,50 L350,40 L360,50 L370,50 L400,50" stroke="#FF0000" fill="none" stroke-width="2" />
  </svg>`,
  
  "/images/rhythms/third_degree_av_block.svg": `<svg width="400" height="100" viewBox="0 0 400 100" xmlns="http://www.w3.org/2000/svg">
    <path d="M0,50 L10,50 L15,40 L20,50 L30,50 L40,50 L45,40 L50,50 L60,50 L70,50 L75,40 L80,50 L90,50 L100,20 L110,80 L120,50 L150,50 L160,50 L165,40 L170,50 L180,50 L190,50 L195,40 L200,50 L210,50 L220,50 L225,40 L230,50 L240,50 L250,20 L260,80 L270,50 L300,50 L310,50 L315,40 L320,50 L330,50 L340,50 L345,40 L350,50 L360,50 L370,50 L375,40 L380,50 L390,50 L400,50" stroke="#FF0000" fill="none" stroke-width="2" />
  </svg>`
};

interface QuizQuestion {
  rhythm: ECGRhythm;
  options: string[];
  correctAnswer: string;
}

export function ECGRhythmGame({ onComplete, onClose }: ECGRhythmGameProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [gameMode, setGameMode] = useState<'quiz' | 'study'>('quiz');
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30); // 30 seconds per question
  const [gameState, setGameState] = useState<'playing' | 'checking' | 'results'>('playing');
  const [filteredRhythms, setFilteredRhythms] = useState<ECGRhythm[]>(ecgRhythms);
  const [currentStudyIndex, setCurrentStudyIndex] = useState(0);
  const [difficultyFilter, setDifficultyFilter] = useState<'all' | 'beginner' | 'intermediate' | 'advanced'>('all');
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [incorrectAnswers, setIncorrectAnswers] = useState(0);
  
  // Initialize the game
  useEffect(() => {
    // Generate quiz questions by creating choices for each rhythm
    const generateQuizQuestions = () => {
      const questions: QuizQuestion[] = ecgRhythms.map(rhythm => {
        // Generate 3 random options that don't include the correct answer
        const otherRhythms = ecgRhythms.filter(r => r.id !== rhythm.id);
        const shuffledOthers = [...otherRhythms].sort(() => Math.random() - 0.5);
        const distractors = shuffledOthers.slice(0, 3).map(r => r.name);
        
        // Combine correct answer with distractors and shuffle
        const options = [rhythm.name, ...distractors].sort(() => Math.random() - 0.5);
        
        return {
          rhythm,
          options,
          correctAnswer: rhythm.name
        };
      });
      
      // Shuffle the questions
      return questions.sort(() => Math.random() - 0.5);
    };
    
    setQuizQuestions(generateQuizQuestions());
    
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Update filtered rhythms when difficulty filter changes
  useEffect(() => {
    if (difficultyFilter === 'all') {
      setFilteredRhythms(ecgRhythms);
    } else {
      setFilteredRhythms(ecgRhythms.filter(r => r.difficulty === difficultyFilter));
    }
    setCurrentStudyIndex(0);
  }, [difficultyFilter]);
  
  // Timer countdown
  useEffect(() => {
    if (gameMode !== 'quiz' || gameState !== 'playing' || timeLeft <= 0) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => Math.max(0, prev - 1));
    }, 1000);
    
    if (timeLeft === 0) {
      checkAnswer();
    }
    
    return () => clearInterval(timer);
  }, [timeLeft, gameState, gameMode]);
  
  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
  };
  
  const checkAnswer = () => {
    const currentQuestion = quizQuestions[currentQuestionIndex];
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    
    setGameState('checking');
    setShowExplanation(true);
    
    if (isCorrect) {
      setScore(score + 10);
      setCorrectAnswers(correctAnswers + 1);
    } else {
      setIncorrectAnswers(incorrectAnswers + 1);
    }
  };
  
  const nextQuestion = () => {
    if (currentQuestionIndex === quizQuestions.length - 1) {
      // Game complete
      setGameState('results');
      if (onComplete) {
        onComplete(score);
      }
      return;
    }
    
    // Reset for next question
    setSelectedAnswer(null);
    setShowExplanation(false);
    setCurrentQuestionIndex(currentQuestionIndex + 1);
    setTimeLeft(30); // Reset timer
    setGameState('playing');
  };
  
  const resetGame = () => {
    // Generate new quiz questions and shuffle
    const newQuestions = ecgRhythms.map(rhythm => {
      const otherRhythms = ecgRhythms.filter(r => r.id !== rhythm.id);
      const shuffledOthers = [...otherRhythms].sort(() => Math.random() - 0.5);
      const distractors = shuffledOthers.slice(0, 3).map(r => r.name);
      const options = [rhythm.name, ...distractors].sort(() => Math.random() - 0.5);
      
      return {
        rhythm,
        options,
        correctAnswer: rhythm.name
      };
    }).sort(() => Math.random() - 0.5);
    
    setQuizQuestions(newQuestions);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setCurrentQuestionIndex(0);
    setScore(0);
    setTimeLeft(30);
    setGameState('playing');
    setCorrectAnswers(0);
    setIncorrectAnswers(0);
  };
  
  const nextStudyRhythm = () => {
    if (currentStudyIndex < filteredRhythms.length - 1) {
      setCurrentStudyIndex(currentStudyIndex + 1);
    } else {
      setCurrentStudyIndex(0);
    }
  };
  
  const prevStudyRhythm = () => {
    if (currentStudyIndex > 0) {
      setCurrentStudyIndex(currentStudyIndex - 1);
    } else {
      setCurrentStudyIndex(filteredRhythms.length - 1);
    }
  };
  
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center justify-center min-h-[600px]">
        <MedicalSpinner size="lg" type="pulse" />
        <p className="mt-4 text-lg text-center text-gray-700">Loading ECG Rhythm Game...</p>
      </div>
    );
  }
  
  if (gameState === 'results') {
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden min-h-[600px]">
        <div className="bg-[#13294B] text-white p-4">
          <h2 className="text-xl font-bold">ECG Rhythm Quiz Results</h2>
        </div>
        
        <div className="p-6 text-center">
          <Award className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-2">Quiz Complete!</h3>
          <p className="text-lg mb-6">You've completed the ECG Rhythm Identification Quiz</p>
          
          <div className="bg-blue-50 rounded-lg p-6 mb-8 inline-block mx-auto">
            <div className="text-3xl font-bold text-blue-700 mb-2">{score}</div>
            <div className="text-sm text-blue-600">Final Score</div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md mx-auto mb-6">
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-xl font-bold text-green-700">{correctAnswers}</div>
              <div className="text-sm text-green-600">Correct Answers</div>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <div className="text-xl font-bold text-red-700">{incorrectAnswers}</div>
              <div className="text-sm text-red-600">Incorrect Answers</div>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-4">
            <button
              onClick={resetGame}
              className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors"
            >
              <ListRestart className="h-5 w-5 mr-2" />
              Retake Quiz
            </button>
            
            <button
              onClick={() => {
                setGameMode('study');
                setGameState('playing');
              }}
              className="flex items-center justify-center bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md transition-colors"
            >
              <Activity className="h-5 w-5 mr-2" />
              Study Mode
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
  
  if (gameMode === 'study') {
    const currentRhythm = filteredRhythms[currentStudyIndex];
    
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden min-h-[600px]">
        <div className="bg-[#13294B] text-white p-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">ECG Rhythm Study Guide</h2>
            <div className="flex items-center">
              <button
                onClick={() => {
                  setGameMode('quiz');
                  setGameState('playing');
                  resetGame();
                }}
                className="bg-[#0A1E3A] hover:bg-blue-800 text-white py-1 px-3 rounded-md text-sm transition-colors"
              >
                Switch to Quiz Mode
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between mt-2 text-sm">
            <div className="flex items-center">
              <Activity className="h-4 w-4 mr-1.5" />
              <span>Rhythm {currentStudyIndex + 1} of {filteredRhythms.length}</span>
            </div>
            <div>
              <select 
                className="bg-[#0A1E3A] text-white py-1 px-2 rounded-md text-sm"
                value={difficultyFilter}
                onChange={(e) => setDifficultyFilter(e.target.value as any)}
              >
                <option value="all">All Levels</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-[#13294B]">{currentRhythm.name}</h3>
              <div className={`
                text-xs font-semibold px-2 py-1 rounded-full
                ${currentRhythm.urgency === 'emergency' ? 'bg-red-100 text-red-800' : 
                  currentRhythm.urgency === 'urgent' ? 'bg-orange-100 text-orange-800' : 
                  'bg-green-100 text-green-800'}
              `}>
                {currentRhythm.urgency.charAt(0).toUpperCase() + currentRhythm.urgency.slice(1)}
              </div>
            </div>
            
            <div className="p-4 border border-gray-200 rounded-md bg-gray-50 mb-6">
              <div dangerouslySetInnerHTML={{ __html: ecgSVGs[currentRhythm.imagePath] || '' }} />
            </div>
            
            <div className="mb-6">
              <p className="text-gray-700 mb-4">{currentRhythm.description}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h4 className="font-bold text-blue-800 mb-3">Characteristics</h4>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  {currentRhythm.characteristics.map((characteristic, index) => (
                    <li key={index}>{characteristic}</li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="font-bold text-green-800 mb-3">Nursing Actions</h4>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  {currentRhythm.nursingActions.map((action, index) => (
                    <li key={index}>{action}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center space-x-4">
            <button
              onClick={prevStudyRhythm}
              className="flex items-center justify-center bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-md transition-colors"
            >
              Previous
            </button>
            <button
              onClick={nextStudyRhythm}
              className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  // Quiz mode
  const currentQuestion = quizQuestions[currentQuestionIndex];
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden min-h-[600px]">
      <div className="bg-[#13294B] text-white p-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">ECG Rhythm Identification</h2>
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
            <Activity className="h-4 w-4 mr-1.5" />
            <span>Question {currentQuestionIndex + 1} of {quizQuestions.length}</span>
          </div>
          <button
            onClick={() => setGameMode('study')}
            className="bg-[#0A1E3A] hover:bg-blue-800 text-white py-1 px-3 rounded-md text-sm transition-colors"
          >
            Switch to Study Mode
          </button>
        </div>
      </div>
      
      <div className="p-6">
        <div className="mb-6">
          <h3 className="text-lg font-bold text-[#13294B] mb-4">Identify this ECG rhythm:</h3>
          
          <div className="p-4 border border-gray-200 rounded-md bg-gray-50 mb-6">
            <div dangerouslySetInnerHTML={{ __html: ecgSVGs[currentQuestion.rhythm.imagePath] || '' }} />
          </div>
          
          <div className="grid grid-cols-1 gap-3 mb-6">
            {currentQuestion.options.map((option, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.02 }}
                className={`p-3 rounded-md cursor-pointer border-2 transition-colors ${
                  showExplanation
                    ? option === currentQuestion.correctAnswer
                      ? 'bg-green-100 border-green-300'
                      : selectedAnswer === option
                      ? 'bg-red-100 border-red-300'
                      : 'bg-gray-100 border-gray-200'
                    : selectedAnswer === option
                    ? 'bg-blue-100 border-blue-300'
                    : 'bg-gray-100 border-gray-200 hover:border-blue-300'
                }`}
                onClick={() => !showExplanation && handleAnswerSelect(option)}
              >
                <div className="flex items-center">
                  {showExplanation && (
                    option === currentQuestion.correctAnswer ? (
                      <CheckCircle2 className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
                    ) : selectedAnswer === option ? (
                      <XCircle className="h-5 w-5 text-red-600 mr-2 flex-shrink-0" />
                    ) : null
                  )}
                  <span>{option}</span>
                </div>
              </motion.div>
            ))}
          </div>
          
          {showExplanation && (
            <div className="bg-blue-50 p-4 rounded-md border border-blue-200 mb-6">
              <h4 className="font-bold text-blue-800 mb-2">Explanation:</h4>
              <p className="text-blue-700 mb-4">{currentQuestion.rhythm.description}</p>
              
              <h4 className="font-bold text-blue-800 mb-2">Key Characteristics:</h4>
              <ul className="list-disc list-inside text-blue-700 mb-4">
                {currentQuestion.rhythm.characteristics.slice(0, 3).map((characteristic, index) => (
                  <li key={index}>{characteristic}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
        
        <div className="flex justify-center">
          {!showExplanation ? (
            <button
              onClick={checkAnswer}
              disabled={!selectedAnswer}
              className={`flex items-center justify-center py-2 px-6 rounded-md transition-colors ${
                selectedAnswer
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              Check Answer
            </button>
          ) : (
            <button
              onClick={nextQuestion}
              className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-md transition-colors"
            >
              Next Question <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
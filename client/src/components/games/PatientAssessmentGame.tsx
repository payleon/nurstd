import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ListRestart, CheckCircle2, Award, XCircle, Heart, Timer, Stethoscope, ArrowRight, UserRound, ClipboardList, ThumbsUp } from 'lucide-react';
import { MedicalSpinner } from '@/components/ui/medical-spinner';

interface PatientAssessmentGameProps {
  onComplete?: (score: number) => void;
  onClose?: () => void;
}

interface PatientCase {
  id: number;
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  chiefComplaint: string;
  vitalSigns: {
    temperature: string;
    heartRate: string;
    respiratoryRate: string;
    bloodPressure: string;
    oxygenSaturation: string;
  };
  history: string;
  appearance: string;
  scenario: string;
  assessmentAreas: AssessmentArea[];
}

interface AssessmentArea {
  id: string;
  name: string;
  findings: Finding[];
}

interface Finding {
  id: string;
  technique: string; // Inspection, Palpation, Percussion, Auscultation
  description: string;
  isNormal: boolean;
  isSignificant: boolean;
}

interface AssessmentQuestion {
  id: string;
  questionText: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

// Patient case scenarios for assessment practice
const patientCases: PatientCase[] = [
  {
    id: 1,
    name: "Mr. Rodriguez",
    age: 68,
    gender: 'male',
    chiefComplaint: "Shortness of breath and chest pain",
    vitalSigns: {
      temperature: "99.1°F (37.3°C)",
      heartRate: "112 bpm",
      respiratoryRate: "24 breaths/min",
      bloodPressure: "162/94 mmHg",
      oxygenSaturation: "91% on room air"
    },
    history: "History of hypertension, smoked 1 pack daily for 40 years, quit 5 years ago",
    appearance: "Appears anxious and is using accessory muscles to breathe",
    scenario: "Mr. Rodriguez was admitted to the medical unit with exacerbation of COPD. You are performing your initial nursing assessment.",
    assessmentAreas: [
      {
        id: "respiratory",
        name: "Respiratory System",
        findings: [
          {
            id: "resp1",
            technique: "Inspection",
            description: "Using accessory muscles to breathe, barrel chest appearance",
            isNormal: false,
            isSignificant: true
          },
          {
            id: "resp2",
            technique: "Auscultation",
            description: "Diminished breath sounds in all lobes, expiratory wheezes throughout",
            isNormal: false,
            isSignificant: true
          },
          {
            id: "resp3",
            technique: "Percussion",
            description: "Hyperresonance over both lungs",
            isNormal: false,
            isSignificant: true
          }
        ]
      },
      {
        id: "cardiac",
        name: "Cardiovascular System",
        findings: [
          {
            id: "cardiac1",
            technique: "Inspection",
            description: "No visible pulsations or abnormalities",
            isNormal: true,
            isSignificant: false
          },
          {
            id: "cardiac2",
            technique: "Auscultation",
            description: "S1 and S2 present, regular rhythm, tachycardia, no murmurs/gallops/rubs",
            isNormal: false,
            isSignificant: true
          },
          {
            id: "cardiac3",
            technique: "Palpation",
            description: "No heaves or thrills, pulses strong and regular (2+)",
            isNormal: true,
            isSignificant: false
          }
        ]
      },
      {
        id: "neuro",
        name: "Neurological System",
        findings: [
          {
            id: "neuro1",
            technique: "Inspection",
            description: "Alert and oriented x3, follows commands appropriately",
            isNormal: true,
            isSignificant: false
          },
          {
            id: "neuro2",
            technique: "Assessment",
            description: "Pupils equal, round, and reactive to light (PERRL)",
            isNormal: true,
            isSignificant: false
          }
        ]
      },
      {
        id: "gi",
        name: "Gastrointestinal System",
        findings: [
          {
            id: "gi1",
            technique: "Inspection",
            description: "Abdomen flat, no visible pulsations or abnormalities",
            isNormal: true,
            isSignificant: false
          },
          {
            id: "gi2",
            technique: "Auscultation",
            description: "Bowel sounds present in all 4 quadrants",
            isNormal: true,
            isSignificant: false
          },
          {
            id: "gi3",
            technique: "Palpation",
            description: "Soft, non-tender, no masses or organomegaly",
            isNormal: true,
            isSignificant: false
          }
        ]
      }
    ]
  },
  {
    id: 2,
    name: "Mrs. Johnson",
    age: 72,
    gender: 'female',
    chiefComplaint: "Confusion and fever",
    vitalSigns: {
      temperature: "101.8°F (38.8°C)",
      heartRate: "108 bpm",
      respiratoryRate: "22 breaths/min",
      bloodPressure: "138/88 mmHg",
      oxygenSaturation: "94% on room air"
    },
    history: "History of diabetes type 2, hypertension, and early dementia",
    appearance: "Appears flushed, restless, and confused",
    scenario: "Mrs. Johnson was admitted from a nursing home with increased confusion and fever. You are conducting your initial assessment.",
    assessmentAreas: [
      {
        id: "respiratory",
        name: "Respiratory System",
        findings: [
          {
            id: "resp1",
            technique: "Inspection",
            description: "No use of accessory muscles, symmetrical chest expansion",
            isNormal: true,
            isSignificant: false
          },
          {
            id: "resp2",
            technique: "Auscultation",
            description: "Crackles in right lower lobe, otherwise clear breath sounds",
            isNormal: false,
            isSignificant: true
          }
        ]
      },
      {
        id: "cardiac",
        name: "Cardiovascular System",
        findings: [
          {
            id: "cardiac1",
            technique: "Inspection",
            description: "No visible pulsations or abnormalities",
            isNormal: true,
            isSignificant: false
          },
          {
            id: "cardiac2",
            technique: "Auscultation",
            description: "S1 and S2 present, regular rhythm, tachycardia, no murmurs/gallops/rubs",
            isNormal: false,
            isSignificant: true
          }
        ]
      },
      {
        id: "neuro",
        name: "Neurological System",
        findings: [
          {
            id: "neuro1",
            technique: "Inspection",
            description: "Disoriented to time and place, oriented to person",
            isNormal: false,
            isSignificant: true
          },
          {
            id: "neuro2",
            technique: "Assessment",
            description: "PERRL, but slow to follow commands",
            isNormal: false,
            isSignificant: true
          }
        ]
      },
      {
        id: "urinary",
        name: "Urinary System",
        findings: [
          {
            id: "urinary1",
            technique: "Inspection",
            description: "Urine appears dark and concentrated",
            isNormal: false,
            isSignificant: true
          },
          {
            id: "urinary2",
            technique: "Palpation",
            description: "Suprapubic tenderness on palpation",
            isNormal: false,
            isSignificant: true
          }
        ]
      }
    ]
  },
  {
    id: 3,
    name: "Ms. Williams",
    age: 28,
    gender: 'female',
    chiefComplaint: "Lower abdominal pain and fever",
    vitalSigns: {
      temperature: "102.2°F (39°C)",
      heartRate: "112 bpm",
      respiratoryRate: "20 breaths/min",
      bloodPressure: "124/78 mmHg",
      oxygenSaturation: "98% on room air"
    },
    history: "Sexually active, no significant past medical history",
    appearance: "In acute distress, guarding abdomen",
    scenario: "Ms. Williams presented to the ER with lower abdominal pain, fever, and vaginal discharge. You are conducting your initial assessment.",
    assessmentAreas: [
      {
        id: "respiratory",
        name: "Respiratory System",
        findings: [
          {
            id: "resp1",
            technique: "Inspection",
            description: "No use of accessory muscles, symmetrical chest expansion",
            isNormal: true,
            isSignificant: false
          },
          {
            id: "resp2",
            technique: "Auscultation",
            description: "Clear breath sounds bilaterally",
            isNormal: true,
            isSignificant: false
          }
        ]
      },
      {
        id: "cardiac",
        name: "Cardiovascular System",
        findings: [
          {
            id: "cardiac1",
            technique: "Inspection",
            description: "No visible pulsations or abnormalities",
            isNormal: true,
            isSignificant: false
          },
          {
            id: "cardiac2",
            technique: "Auscultation",
            description: "S1 and S2 present, regular rhythm, tachycardia, no murmurs/gallops/rubs",
            isNormal: false,
            isSignificant: true
          }
        ]
      },
      {
        id: "reproductive",
        name: "Reproductive System",
        findings: [
          {
            id: "repro1",
            technique: "Inspection",
            description: "Purulent vaginal discharge noted",
            isNormal: false,
            isSignificant: true
          }
        ]
      },
      {
        id: "gi",
        name: "Gastrointestinal System",
        findings: [
          {
            id: "gi1",
            technique: "Inspection",
            description: "Abdomen flat",
            isNormal: true,
            isSignificant: false
          },
          {
            id: "gi2",
            technique: "Auscultation",
            description: "Bowel sounds present in all 4 quadrants",
            isNormal: true,
            isSignificant: false
          },
          {
            id: "gi3",
            technique: "Palpation",
            description: "Severe tenderness in lower abdomen, especially right lower quadrant, with guarding and rebound tenderness",
            isNormal: false,
            isSignificant: true
          }
        ]
      }
    ]
  }
];

// Questions for each patient case
const assessmentQuestions: {[key: number]: AssessmentQuestion[]} = {
  1: [
    {
      id: "1q1",
      questionText: "Based on your respiratory assessment findings, which of the following is the most likely diagnosis?",
      options: [
        "Pneumonia",
        "Pulmonary embolism",
        "COPD exacerbation",
        "Acute asthma attack"
      ],
      correctAnswer: "COPD exacerbation",
      explanation: "The findings of barrel chest, use of accessory muscles, diminished breath sounds, expiratory wheezes, and hyperresonance on percussion are classic signs of COPD exacerbation. The patient also has a history of smoking and COPD."
    },
    {
      id: "1q2",
      questionText: "Which of the following nursing interventions would be most appropriate for this patient?",
      options: [
        "Place patient in supine position to promote comfort",
        "Administer sedatives to reduce anxiety",
        "Position patient in high Fowler's position",
        "Encourage deep breathing exercises every 15 minutes"
      ],
      correctAnswer: "Position patient in high Fowler's position",
      explanation: "High Fowler's position (sitting upright at 60-90 degrees) helps maximize chest expansion and reduces the work of breathing for patients with respiratory distress. This position uses gravity to help the diaphragm move downward, creating more room for lung expansion."
    },
    {
      id: "1q3",
      questionText: "What is the most concerning vital sign for this patient that requires immediate intervention?",
      options: [
        "Temperature of 99.1°F",
        "Heart rate of 112 bpm",
        "Blood pressure of 162/94 mmHg",
        "Oxygen saturation of 91% on room air"
      ],
      correctAnswer: "Oxygen saturation of 91% on room air",
      explanation: "For a COPD patient, an oxygen saturation of 91% on room air indicates significant hypoxemia that requires immediate intervention. While the other vital signs are also abnormal, the oxygen saturation most directly reflects the patient's compromised respiratory status and risk for tissue hypoxia."
    }
  ],
  2: [
    {
      id: "2q1",
      questionText: "Based on your assessment findings, what is the most likely cause of Mrs. Johnson's confusion?",
      options: [
        "Progression of dementia",
        "Urinary tract infection",
        "Cerebrovascular accident (stroke)",
        "Medication side effect"
      ],
      correctAnswer: "Urinary tract infection",
      explanation: "The combination of fever, altered mental status (confusion), concentrated urine, and suprapubic tenderness in an elderly patient strongly suggests a urinary tract infection. UTIs commonly present with acute confusion (delirium) in elderly patients, often without the classic symptoms of dysuria."
    },
    {
      id: "2q2",
      questionText: "Which nursing intervention should be prioritized for this patient?",
      options: [
        "Orientation to time and place every 2 hours",
        "Fluid intake encouragement and monitoring",
        "Blood glucose monitoring",
        "Pain assessment using an appropriate scale"
      ],
      correctAnswer: "Fluid intake encouragement and monitoring",
      explanation: "Given the signs of a likely UTI and concentrated urine, encouraging and monitoring fluid intake is the priority intervention. Adequate hydration will help flush bacteria from the urinary tract and improve the patient's overall condition, potentially helping with both the infection and the confusion."
    },
    {
      id: "2q3",
      questionText: "What additional assessment finding would be most helpful to confirm your suspected diagnosis?",
      options: [
        "Peripheral edema in lower extremities",
        "Urine sample for urinalysis and culture",
        "12-lead ECG",
        "Comprehensive medication review"
      ],
      correctAnswer: "Urine sample for urinalysis and culture",
      explanation: "A urine sample for urinalysis and culture would confirm the suspected urinary tract infection. The urinalysis would likely show bacteria, white blood cells, and possibly nitrites and leukocyte esterase, all indicators of a UTI. Culture would identify the specific organism and guide appropriate antibiotic therapy."
    }
  ],
  3: [
    {
      id: "3q1",
      questionText: "Based on your assessment findings, which of the following is the most likely diagnosis?",
      options: [
        "Appendicitis",
        "Pelvic inflammatory disease",
        "Ectopic pregnancy",
        "Ovarian cyst"
      ],
      correctAnswer: "Pelvic inflammatory disease",
      explanation: "The combination of lower abdominal pain, fever, purulent vaginal discharge, and being sexually active strongly suggests pelvic inflammatory disease (PID). PID is an infection of the female reproductive organs, commonly caused by sexually transmitted infections."
    },
    {
      id: "3q2",
      questionText: "Which of the following laboratory tests would be most helpful in confirming your suspected diagnosis?",
      options: [
        "Complete blood count (CBC)",
        "Pregnancy test",
        "Cervical cultures for chlamydia and gonorrhea",
        "Abdominal ultrasound"
      ],
      correctAnswer: "Cervical cultures for chlamydia and gonorrhea",
      explanation: "Cervical cultures for chlamydia and gonorrhea would be most helpful in confirming PID, as these are the most common causative organisms. While a CBC would show elevated white blood cells and a pregnancy test would rule out ectopic pregnancy, the cervical cultures provide the most specific diagnostic information."
    },
    {
      id: "3q3",
      questionText: "What is the most appropriate nursing intervention for this patient's abdominal pain?",
      options: [
        "Application of heating pad to lower abdomen",
        "Encouraging ambulation to reduce gas pain",
        "Administration of prescribed analgesics",
        "Positioning in knee-chest position"
      ],
      correctAnswer: "Administration of prescribed analgesics",
      explanation: "Administration of prescribed analgesics is the most appropriate intervention for the severe abdominal pain. The patient is in acute distress and requires pain management. Heat application might worsen inflammation, ambulation would increase pain, and the knee-chest position is not indicated for this condition."
    }
  ]
};

export function PatientAssessmentGame({ onComplete, onClose }: PatientAssessmentGameProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [currentPhase, setCurrentPhase] = useState<'review' | 'quiz'>('review');
  const [currentCaseIndex, setCurrentCaseIndex] = useState(0);
  const [expandedArea, setExpandedArea] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(180); // 3 minutes for review phase
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [incorrectAnswers, setIncorrectAnswers] = useState(0);
  const [gameState, setGameState] = useState<'playing' | 'quiz' | 'results'>('playing');
  
  // Initialize the game
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Timer countdown
  useEffect(() => {
    if (gameState === 'results' || !timeLeft) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => Math.max(0, prev - 1));
    }, 1000);
    
    if (timeLeft === 0 && currentPhase === 'review') {
      // Time's up for review, move to quiz
      startQuiz();
    }
    
    return () => clearInterval(timer);
  }, [timeLeft, currentPhase, gameState]);
  
  const toggleAreaExpansion = (areaId: string) => {
    if (expandedArea === areaId) {
      setExpandedArea(null);
    } else {
      setExpandedArea(areaId);
    }
  };
  
  const startQuiz = () => {
    setCurrentPhase('quiz');
    setQuizStarted(true);
    setTimeLeft(60); // 1 minute per question
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setGameState('quiz');
  };
  
  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
  };
  
  const checkAnswer = () => {
    const currentQuestion = assessmentQuestions[patientCases[currentCaseIndex].id][currentQuestionIndex];
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    
    setShowExplanation(true);
    
    if (isCorrect) {
      setScore(score + 10);
      setCorrectAnswers(correctAnswers + 1);
    } else {
      setIncorrectAnswers(incorrectAnswers + 1);
    }
  };
  
  const nextQuestion = () => {
    const caseQuestions = assessmentQuestions[patientCases[currentCaseIndex].id];
    
    if (currentQuestionIndex === caseQuestions.length - 1) {
      // Last question for this case
      if (currentCaseIndex === patientCases.length - 1) {
        // Last case, game complete
        finalizeGame();
      } else {
        // Move to next case
        setCurrentCaseIndex(currentCaseIndex + 1);
        setCurrentPhase('review');
        setTimeLeft(180); // Reset timer for review phase
        setExpandedArea(null);
        setGameState('playing');
      }
    } else {
      // Move to next question in current case
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
      setTimeLeft(60); // Reset timer for next question
    }
  };
  
  const finalizeGame = () => {
    setGameState('results');
    if (onComplete) {
      onComplete(score);
    }
  };
  
  const resetGame = () => {
    setCurrentCaseIndex(0);
    setCurrentPhase('review');
    setTimeLeft(180);
    setExpandedArea(null);
    setQuizStarted(false);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setScore(0);
    setCorrectAnswers(0);
    setIncorrectAnswers(0);
    setGameState('playing');
  };
  
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center justify-center min-h-[600px]">
        <MedicalSpinner size="lg" type="stethoscope" />
        <p className="mt-4 text-lg text-center text-gray-700">Loading Patient Assessment Game...</p>
      </div>
    );
  }
  
  if (gameState === 'results') {
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden min-h-[600px]">
        <div className="bg-[#13294B] text-white p-4">
          <h2 className="text-xl font-bold">Assessment Simulation Complete!</h2>
        </div>
        
        <div className="p-6 text-center">
          <Award className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-2">Congratulations!</h3>
          <p className="text-lg mb-6">You've completed the Patient Assessment Simulation</p>
          
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
          
          <div className="mb-8 max-w-2xl mx-auto">
            <h4 className="font-bold text-blue-800 mb-3">NCLEX Assessment Tips:</h4>
            <ul className="text-left text-gray-700 space-y-2">
              <li>• Always prioritize the ABCs (Airway, Breathing, Circulation) in your assessments</li>
              <li>• Look for patterns in assessment findings that point to specific conditions</li>
              <li>• Consider the patient's demographics, history, and risk factors when interpreting findings</li>
              <li>• Remember that abnormal findings are not always significant, and normal findings don't rule out all conditions</li>
              <li>• Practice connecting assessment findings to nursing diagnoses and appropriate interventions</li>
            </ul>
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
  
  const currentCase = patientCases[currentCaseIndex];
  
  if (currentPhase === 'review') {
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden min-h-[600px]">
        <div className="bg-[#13294B] text-white p-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Patient Assessment: Review Phase</h2>
            <div className="flex items-center bg-[#0A1E3A] py-1 px-3 rounded-md border border-[#4B9CD3]">
              <Timer className="h-4 w-4 mr-1.5 text-[#4B9CD3]" />
              <span className="font-mono font-semibold">{Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}</span>
            </div>
          </div>
          <div className="flex items-center mt-2 text-sm">
            <UserRound className="h-4 w-4 mr-1.5" />
            <span>Patient {currentCaseIndex + 1} of {patientCases.length}: {currentCase.name}, {currentCase.age} y.o. {currentCase.gender}</span>
          </div>
        </div>
        
        <div className="p-6">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-[#13294B] mb-2">Nursing Assessment</h3>
            <p className="text-gray-700 mb-4">{currentCase.scenario}</p>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <div className="bg-blue-50 p-4 rounded-md border border-blue-200">
                <h4 className="font-bold text-blue-800 mb-2">Patient Information</h4>
                <p className="text-blue-700 mb-2"><span className="font-medium">Chief Complaint:</span> {currentCase.chiefComplaint}</p>
                <p className="text-blue-700 mb-2"><span className="font-medium">Past Medical History:</span> {currentCase.history}</p>
                <p className="text-blue-700"><span className="font-medium">General Appearance:</span> {currentCase.appearance}</p>
              </div>
              
              <div className="bg-green-50 p-4 rounded-md border border-green-200">
                <h4 className="font-bold text-green-800 mb-2">Vital Signs</h4>
                <div className="grid grid-cols-2 gap-2">
                  <p className="text-green-700"><span className="font-medium">Temp:</span> {currentCase.vitalSigns.temperature}</p>
                  <p className="text-green-700"><span className="font-medium">HR:</span> {currentCase.vitalSigns.heartRate}</p>
                  <p className="text-green-700"><span className="font-medium">RR:</span> {currentCase.vitalSigns.respiratoryRate}</p>
                  <p className="text-green-700"><span className="font-medium">BP:</span> {currentCase.vitalSigns.bloodPressure}</p>
                  <p className="text-green-700 col-span-2"><span className="font-medium">O2 Sat:</span> {currentCase.vitalSigns.oxygenSaturation}</p>
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <h4 className="font-bold text-[#13294B] mb-4">Assessment Findings</h4>
              <div className="space-y-4">
                {currentCase.assessmentAreas.map(area => (
                  <div key={area.id} className="border rounded-md overflow-hidden">
                    <div 
                      className={`p-3 flex justify-between items-center cursor-pointer ${
                        expandedArea === area.id ? 'bg-blue-100' : 'bg-gray-50'
                      }`}
                      onClick={() => toggleAreaExpansion(area.id)}
                    >
                      <h5 className="font-medium text-gray-900">{area.name}</h5>
                      <div className={`transform transition-transform ${expandedArea === area.id ? 'rotate-180' : ''}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                    
                    {expandedArea === area.id && (
                      <div className="p-4 border-t">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left pb-2 font-medium text-gray-500">Technique</th>
                              <th className="text-left pb-2 font-medium text-gray-500">Finding</th>
                              <th className="text-left pb-2 font-medium text-gray-500">Significance</th>
                            </tr>
                          </thead>
                          <tbody>
                            {area.findings.map(finding => (
                              <tr key={finding.id} className="border-b last:border-b-0">
                                <td className="py-2 pr-4 align-top text-gray-700">{finding.technique}</td>
                                <td className="py-2 pr-4 align-top text-gray-700">{finding.description}</td>
                                <td className="py-2 align-top">
                                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                                    finding.isSignificant
                                      ? finding.isNormal
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-red-100 text-red-800'
                                      : 'bg-gray-100 text-gray-800'
                                  }`}>
                                    {finding.isSignificant
                                      ? finding.isNormal
                                        ? 'Normal & Significant'
                                        : 'Abnormal & Significant'
                                      : finding.isNormal
                                        ? 'Normal'
                                        : 'Abnormal'
                                    }
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <button
              onClick={startQuiz}
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-md transition-colors"
            >
              {timeLeft > 0 ? 'Continue to Assessment Questions' : 'Start Assessment Quiz'}
            </button>
            
            <p className="mt-3 text-sm text-gray-600">
              Review the patient information carefully to prepare for the assessment questions
            </p>
          </div>
        </div>
      </div>
    );
  }
  
  // Quiz Phase
  const currentQuestion = assessmentQuestions[currentCase.id][currentQuestionIndex];
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden min-h-[600px]">
      <div className="bg-[#13294B] text-white p-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Patient Assessment Quiz</h2>
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
          <ClipboardList className="h-4 w-4 mr-1.5" />
          <span>Question {currentQuestionIndex + 1} of {assessmentQuestions[currentCase.id].length} • Patient: {currentCase.name}</span>
        </div>
      </div>
      
      <div className="p-6">
        <div className="mb-6">
          <h3 className="text-lg font-bold text-[#13294B] mb-4">{currentQuestion.questionText}</h3>
          
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
              <p className="text-blue-700">{currentQuestion.explanation}</p>
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
              {currentQuestionIndex < assessmentQuestions[currentCase.id].length - 1
                ? 'Next Question'
                : currentCaseIndex < patientCases.length - 1
                ? 'Next Patient Case'
                : 'Complete Assessment'
              } 
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
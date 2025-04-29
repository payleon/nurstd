import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, Beaker, Brain, CheckCircle, ChevronRight, Lightbulb, SkipForward, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface LabValuesQuizProps {
  onComplete?: (score: number, totalQuestions: number) => void;
}

interface LabValue {
  name: string;
  normalRange: string;
  units: string;
  description: string;
  nursingImplications: string[];
  criticalHigh?: string;
  criticalLow?: string;
  category: 'blood' | 'cardiac' | 'electrolyte' | 'other';
}

interface QuizQuestion {
  type: 'normal-range' | 'critical-value' | 'implication' | 'assessment';
  lab: LabValue;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export function NCLEXLabValuesQuiz({ onComplete }: LabValuesQuizProps) {
  const [activeTab, setActiveTab] = useState("study");
  const [currentCategory, setCurrentCategory] = useState("all");
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [shuffledQuestions, setShuffledQuestions] = useState<QuizQuestion[]>([]);
  const [flashcardMode, setFlashcardMode] = useState<'front' | 'back'>('front');
  const [currentLabIndex, setCurrentLabIndex] = useState(0);
  
  // Common lab values that nursing students must know for NCLEX
  const labValues: LabValue[] = [
    {
      name: "Sodium (Na+)",
      normalRange: "135-145",
      units: "mEq/L",
      description: "Major extracellular cation essential for neural transmission, muscle contraction, and fluid balance.",
      nursingImplications: [
        "Hypernatremia (>145 mEq/L) may indicate dehydration or diabetes insipidus",
        "Hyponatremia (<135 mEq/L) may indicate SIADH, heart failure, or fluid overload",
        "Assess for changes in mental status, seizures, and fluid balance"
      ],
      criticalHigh: ">155",
      criticalLow: "<120",
      category: 'electrolyte'
    },
    {
      name: "Potassium (K+)",
      normalRange: "3.5-5.0",
      units: "mEq/L",
      description: "Major intracellular cation critical for cardiac function, nerve impulse transmission, and muscle contraction.",
      nursingImplications: [
        "Hyperkalemia (>5.0 mEq/L) may cause cardiac arrhythmias and requires immediate attention",
        "Hypokalemia (<3.5 mEq/L) may cause muscle weakness, cardiac arrhythmias",
        "Monitor EKG for changes (peaked T waves in hyperkalemia, flattened T waves in hypokalemia)"
      ],
      criticalHigh: ">6.5",
      criticalLow: "<2.5",
      category: 'electrolyte'
    },
    {
      name: "Blood Urea Nitrogen (BUN)",
      normalRange: "7-20",
      units: "mg/dL",
      description: "Waste product from protein metabolism filtered by kidneys; indicator of renal function.",
      nursingImplications: [
        "Elevated BUN may indicate decreased renal perfusion, renal failure, or high protein diet",
        "Low BUN may indicate malnutrition or liver failure",
        "BUN/Creatinine ratio helps differentiate prerenal from intrinsic renal failure"
      ],
      criticalHigh: ">100",
      category: 'blood'
    },
    {
      name: "Creatinine",
      normalRange: "0.6-1.2",
      units: "mg/dL",
      description: "Waste product from muscle metabolism; stable indicator of renal function.",
      nursingImplications: [
        "Elevated creatinine indicates impaired renal function",
        "Monitor fluid balance, electrolytes, and medication dosing with elevated levels",
        "Assess for symptoms of uremia when significantly elevated"
      ],
      criticalHigh: ">3.0",
      category: 'blood'
    },
    {
      name: "Hemoglobin (Hgb)",
      normalRange: "12.0-16.0 (female), 13.5-17.5 (male)",
      units: "g/dL",
      description: "Protein in red blood cells that carries oxygen from lungs to tissues.",
      nursingImplications: [
        "Low hemoglobin indicates anemia; assess for fatigue, pallor, dyspnea",
        "High hemoglobin may indicate polycythemia, dehydration, or chronic hypoxic conditions",
        "Critical values require immediate provider notification"
      ],
      criticalHigh: ">20.0",
      criticalLow: "<7.0",
      category: 'blood'
    },
    {
      name: "Hematocrit (Hct)",
      normalRange: "36-47% (female), 41-53% (male)",
      units: "%",
      description: "Percentage of blood volume occupied by red blood cells.",
      nursingImplications: [
        "Decreased values indicate anemia or hemorrhage",
        "Elevated values may indicate polycythemia or dehydration",
        "Monitor for signs of impaired tissue perfusion with low values"
      ],
      criticalHigh: ">60%",
      criticalLow: "<21%",
      category: 'blood'
    },
    {
      name: "Platelets",
      normalRange: "150,000-400,000",
      units: "/μL",
      description: "Cell fragments essential for blood clotting and hemostasis.",
      nursingImplications: [
        "Thrombocytopenia (<150,000/μL) increases bleeding risk; implement bleeding precautions",
        "Thrombocytosis (>400,000/μL) increases clotting risk; monitor for thrombosis",
        "Critical values require immediate intervention to prevent hemorrhage"
      ],
      criticalHigh: ">1,000,000",
      criticalLow: "<20,000",
      category: 'blood'
    },
    {
      name: "Glucose (fasting)",
      normalRange: "70-99",
      units: "mg/dL",
      description: "Primary energy source for cells; tightly regulated by insulin and other hormones.",
      nursingImplications: [
        "Hypoglycemia (<70 mg/dL) requires immediate intervention with glucose administration",
        "Hyperglycemia (>126 mg/dL fasting) may indicate diabetes or stress response",
        "Monitor for symptoms of hypo/hyperglycemia and adjust treatment accordingly"
      ],
      criticalHigh: ">500",
      criticalLow: "<40",
      category: 'blood'
    },
    {
      name: "Calcium (Ca++)",
      normalRange: "8.5-10.5",
      units: "mg/dL",
      description: "Essential for bone formation, muscle contraction, nerve transmission, and blood clotting.",
      nursingImplications: [
        "Hypercalcemia may cause confusion, constipation, and cardiac changes",
        "Hypocalcemia may cause tetany, prolonged QT interval, and seizures",
        "Monitor for Chvostek's and Trousseau's signs with low calcium"
      ],
      criticalHigh: ">13.0",
      criticalLow: "<6.5",
      category: 'electrolyte'
    },
    {
      name: "Magnesium (Mg++)",
      normalRange: "1.5-2.5",
      units: "mEq/L",
      description: "Cofactor for enzymatic reactions; important for neuromuscular function and protein synthesis.",
      nursingImplications: [
        "Hypomagnesemia may cause cardiac arrhythmias, neuromuscular irritability",
        "Hypermagnesemia may cause respiratory depression, hypotension, and cardiac changes",
        "Monitor for changes in deep tendon reflexes and cardiac function"
      ],
      criticalHigh: ">4.0",
      criticalLow: "<1.0",
      category: 'electrolyte'
    },
    {
      name: "Phosphorus (PO4)",
      normalRange: "2.5-4.5",
      units: "mg/dL",
      description: "Essential for bone formation, energy metabolism, and acid-base balance.",
      nursingImplications: [
        "Hyperphosphatemia often occurs with renal failure",
        "Hypophosphatemia may occur with malnutrition or refeeding syndrome",
        "Imbalances often occur alongside calcium imbalances"
      ],
      criticalHigh: ">7.0",
      criticalLow: "<1.0",
      category: 'electrolyte'
    },
    {
      name: "Troponin I",
      normalRange: "<0.04",
      units: "ng/mL",
      description: "Protein released into bloodstream when cardiac muscle is damaged; highly specific for myocardial injury.",
      nursingImplications: [
        "Elevated levels indicate myocardial injury or infarction",
        "Rises within 4-6 hours after cardiac injury, peaks at 24 hours",
        "Serial measurements help track progression of cardiac damage"
      ],
      criticalHigh: ">0.5",
      category: 'cardiac'
    },
    {
      name: "CK-MB",
      normalRange: "<3.8",
      units: "ng/mL",
      description: "Creatine kinase MB isoenzyme specific to cardiac muscle; indicator of myocardial damage.",
      nursingImplications: [
        "Elevates 4-6 hours after MI, peaks at 18-24 hours",
        "Used alongside troponin to diagnose and assess myocardial infarction",
        "Returns to normal faster than troponin (usually within 2-3 days)"
      ],
      criticalHigh: ">10.0",
      category: 'cardiac'
    },
    {
      name: "BNP (Brain Natriuretic Peptide)",
      normalRange: "<100",
      units: "pg/mL",
      description: "Hormone released by heart ventricles in response to stretching from increased volume/pressure.",
      nursingImplications: [
        "Elevated levels strongly suggest heart failure",
        "Used to differentiate cardiac vs. pulmonary causes of dyspnea",
        "Monitor trends to assess effectiveness of heart failure treatment"
      ],
      criticalHigh: ">5000",
      category: 'cardiac'
    },
    {
      name: "PT (Prothrombin Time)",
      normalRange: "11-13.5",
      units: "seconds",
      description: "Measures extrinsic and common pathways of coagulation; used to monitor warfarin therapy.",
      nursingImplications: [
        "Elevated with anticoagulant therapy, liver disease, vitamin K deficiency",
        "Implement bleeding precautions with elevated values",
        "Used to calculate INR for warfarin management"
      ],
      criticalHigh: ">35",
      category: 'blood'
    },
    {
      name: "PTT/aPTT",
      normalRange: "25-35",
      units: "seconds",
      description: "Measures intrinsic and common pathways of coagulation; used to monitor heparin therapy.",
      nursingImplications: [
        "Elevated with heparin therapy, liver disease, DIC",
        "Therapeutic range for heparin is typically 1.5-2.5 times normal",
        "Monitor for bleeding with elevated levels"
      ],
      criticalHigh: ">100",
      category: 'blood'
    }
  ];
  
  // Generate quiz questions based on lab values
  const generateQuizQuestions = (): QuizQuestion[] => {
    const questions: QuizQuestion[] = [];
    
    // Normal range questions
    labValues.forEach(lab => {
      questions.push({
        type: 'normal-range',
        lab,
        question: `What is the normal range for ${lab.name}?`,
        options: [
          lab.normalRange + ' ' + lab.units,
          // Generate plausible incorrect answers
          modifyRange(lab.normalRange, lab.units, 'higher'),
          modifyRange(lab.normalRange, lab.units, 'lower'),
          modifyRange(lab.normalRange, lab.units, 'mixed')
        ],
        correctAnswer: 0,
        explanation: `The normal range for ${lab.name} is ${lab.normalRange} ${lab.units}. ${lab.description}`
      });
    });
    
    // Critical value questions
    labValues.filter(lab => lab.criticalHigh || lab.criticalLow).forEach(lab => {
      if (lab.criticalHigh) {
        questions.push({
          type: 'critical-value',
          lab,
          question: `A patient has a ${lab.name} level of ${lab.criticalHigh} ${lab.units}. What nursing action is most appropriate?`,
          options: [
            `Notify the provider immediately, this is a critical value`,
            `Document the result and monitor the patient`,
            `Recheck the value at the next scheduled assessment`,
            `No action needed as this is within normal parameters`
          ],
          correctAnswer: 0,
          explanation: `${lab.name} of ${lab.criticalHigh} ${lab.units} is a critical high value and requires immediate provider notification. ${lab.nursingImplications[0]}`
        });
      }
      
      if (lab.criticalLow) {
        questions.push({
          type: 'critical-value',
          lab,
          question: `A patient has a ${lab.name} level of ${lab.criticalLow} ${lab.units}. What nursing action is most appropriate?`,
          options: [
            `Notify the provider immediately, this is a critical value`,
            `Document the result and monitor the patient`,
            `Recheck the value at the next scheduled assessment`,
            `No action needed as this is within normal parameters`
          ],
          correctAnswer: 0,
          explanation: `${lab.name} of ${lab.criticalLow} ${lab.units} is a critical low value and requires immediate provider notification. ${lab.nursingImplications.find(imp => imp.toLowerCase().includes("low") || imp.toLowerCase().includes("hypo")) || lab.nursingImplications[0]}`
        });
      }
    });
    
    // Nursing implications questions
    labValues.forEach(lab => {
      const implication = lab.nursingImplications[0];
      questions.push({
        type: 'implication',
        lab,
        question: `Which of the following is a correct nursing implication for abnormal ${lab.name} levels?`,
        options: [
          implication,
          generateFakeImplication(lab.name, lab.category),
          generateFakeImplication(lab.name, lab.category),
          generateFakeImplication(lab.name, lab.category)
        ],
        correctAnswer: 0,
        explanation: `${implication} is a correct nursing implication for abnormal ${lab.name} levels. ${lab.description}`
      });
    });
    
    // Assessment questions
    [
      {lab: labValues.find(l => l.name === "Potassium (K+)"), high: true},
      {lab: labValues.find(l => l.name === "Sodium (Na+)"), low: true},
      {lab: labValues.find(l => l.name === "Calcium (Ca++)"), low: true},
      {lab: labValues.find(l => l.name === "Glucose (fasting)"), low: true},
      {lab: labValues.find(l => l.name === "Hemoglobin (Hgb)"), low: true}
    ].forEach(item => {
      if (!item.lab) return;
      
      const condition = item.high ? 
        `hyper${item.lab.name.split(' ')[0].toLowerCase()}` : 
        `hypo${item.lab.name.split(' ')[0].toLowerCase()}`;
      
      const assessmentQ: QuizQuestion = {
        type: 'assessment',
        lab: item.lab,
        question: `Which assessment finding would you expect in a patient with ${condition}?`,
        options: generateAssessmentOptions(item.lab, item.high === true),
        correctAnswer: 0,
        explanation: `The correct assessment finding for ${condition} is ${generateAssessmentOptions(item.lab, item.high === true)[0]}. This relates to ${item.lab.nursingImplications.find(imp => 
          (item.high === true && (imp.toLowerCase().includes("hyper") || imp.toLowerCase().includes("high"))) || 
          (item.low === true && (imp.toLowerCase().includes("hypo") || imp.toLowerCase().includes("low")))
        ) || item.lab.nursingImplications[0]}`
      };
      
      questions.push(assessmentQ);
    });
    
    // Shuffle and return
    return shuffleArray(questions);
  };
  
  // Helper function to modify ranges for plausible incorrect answers
  const modifyRange = (range: string, units: string, type: 'higher' | 'lower' | 'mixed'): string => {
    const rangeParts = range.split('-');
    if (rangeParts.length !== 2) {
      // Handle single value (e.g., "<0.04")
      if (range.startsWith('<')) {
        const value = parseFloat(range.substring(1));
        if (type === 'higher') return `<${(value * 2).toFixed(2)}`;
        if (type === 'lower') return `<${(value / 2).toFixed(2)}`;
        return `>${value.toFixed(2)}`;
      }
      return range; // Return original if can't parse
    }
    
    const low = parseFloat(rangeParts[0]);
    const high = parseFloat(rangeParts[1]);
    
    if (isNaN(low) || isNaN(high)) return range; // Return original if can't parse
    
    const range_width = high - low;
    
    switch (type) {
      case 'higher':
        return `${(high).toFixed(1)}-${(high + range_width).toFixed(1)} ${units}`;
      case 'lower':
        return `${(low - range_width/2).toFixed(1)}-${(low).toFixed(1)} ${units}`;
      case 'mixed':
        return `${(low - range_width/4).toFixed(1)}-${(high + range_width/4).toFixed(1)} ${units}`;
      default:
        return range;
    }
  };
  
  // Helper function to generate fake nursing implications
  const generateFakeImplication = (labName: string, category: string): string => {
    const fakeCauses: string[] = [
      "excessive physical activity",
      "sleep disturbances",
      "dehydration",
      "overhydration",
      "nutritional deficiencies",
      "medication interactions",
      "stress response",
      "endocrine disorders"
    ];
    
    const fakeFindings: string[] = [
      "increased respiratory rate",
      "changes in urinary output",
      "fluctuations in blood pressure",
      "altered level of consciousness",
      "impaired wound healing",
      "metabolic imbalances",
      "fluid shifts",
      "electrolyte disturbances"
    ];
    
    const fakeCause = fakeCauses[Math.floor(Math.random() * fakeCauses.length)];
    const fakeFinding = fakeFindings[Math.floor(Math.random() * fakeFindings.length)];
    
    // Randomize the structure
    if (Math.random() > 0.5) {
      return `${labName} abnormalities may be caused by ${fakeCause}, leading to ${fakeFinding}`;
    } else {
      return `Monitor for ${fakeFinding} when ${labName} levels change due to ${fakeCause}`;
    }
  };
  
  // Helper function to generate assessment options
  const generateAssessmentOptions = (lab: LabValue, high: boolean): string[] => {
    const assessments: Record<string, {high: string[], low: string[]}> = {
      'Potassium (K+)': {
        high: ['Peaked T waves on ECG', 'Muscle weakness and paralysis', 'Cardiac arrhythmias'],
        low: ['U waves on ECG', 'Muscle cramps', 'Weakness and fatigue']
      },
      'Sodium (Na+)': {
        high: ['Extreme thirst and dry mucous membranes', 'Agitation and irritability', 'Fever and flushed skin'],
        low: ['Confusion and headache', 'Muscle cramps and weakness', 'Nausea and vomiting']
      },
      'Calcium (Ca++)': {
        high: ['Confusion and lethargy', 'Constipation', 'Shortened QT interval on ECG'],
        low: ['Positive Chvostek\'s sign', 'Tetany and muscle cramping', 'Prolonged QT interval on ECG']
      },
      'Glucose (fasting)': {
        high: ['Polyuria and polydipsia', 'Fruity breath odor', 'Kussmaul respirations'],
        low: ['Diaphoresis and shakiness', 'Confusion and irritability', 'Tachycardia']
      },
      'Hemoglobin (Hgb)': {
        high: ['Ruddy complexion', 'Headache and dizziness', 'Thrombosis risk'],
        low: ['Fatigue and weakness', 'Pale conjunctiva and nail beds', 'Shortness of breath with exertion']
      }
    };
    
    const correctOptions = assessments[lab.name]?.[high ? 'high' : 'low'] || [];
    if (correctOptions.length === 0) return ['Data not available'];
    
    // Generate distractors from other lab values or opposite condition
    const distractors: string[] = [];
    
    // Add opposite condition distractors
    const oppositeOptions = assessments[lab.name]?.[high ? 'low' : 'high'] || [];
    distractors.push(...oppositeOptions);
    
    // Add distractors from other lab values
    for (const [key, value] of Object.entries(assessments)) {
      if (key !== lab.name) {
        distractors.push(...value.high, ...value.low);
      }
    }
    
    // Shuffle and select distractors
    const shuffledDistractors = shuffleArray(distractors);
    const selectedDistractors = shuffledDistractors.slice(0, 3);
    
    // Return correct option + distractors
    return [correctOptions[0], ...selectedDistractors];
  };
  
  // Helper function to shuffle array
  const shuffleArray = <T,>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };
  
  // Filter lab values by category
  const filteredLabValues = currentCategory === 'all' 
    ? labValues 
    : labValues.filter(lab => lab.category === currentCategory);
  
  // Initialize quiz questions
  useEffect(() => {
    setShuffledQuestions(generateQuizQuestions());
  }, []);
  
  // Handle answer selection
  const handleSelectAnswer = (index: number) => {
    setSelectedAnswer(index);
    setShowExplanation(true);
    
    if (index === shuffledQuestions[currentQuestionIndex].correctAnswer) {
      setScore(score + 1);
    }
  };
  
  // Move to next question
  const handleNextQuestion = () => {
    if (currentQuestionIndex < shuffledQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      // Quiz completed
      if (onComplete) {
        onComplete(score, shuffledQuestions.length);
      }
    }
  };
  
  // Skip current question
  const handleSkipQuestion = () => {
    if (currentQuestionIndex < shuffledQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    }
  };
  
  // Reset quiz
  const handleResetQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setScore(0);
    setQuizStarted(false);
    setShuffledQuestions(generateQuizQuestions());
  };
  
  // Handle flipcard in study mode
  const handleFlipCard = () => {
    setFlashcardMode(flashcardMode === 'front' ? 'back' : 'front');
  };
  
  // Navigate through lab values in study mode
  const handleNextLab = () => {
    if (currentLabIndex < filteredLabValues.length - 1) {
      setCurrentLabIndex(currentLabIndex + 1);
      setFlashcardMode('front');
    } else {
      setCurrentLabIndex(0);
      setFlashcardMode('front');
    }
  };
  
  const handlePrevLab = () => {
    if (currentLabIndex > 0) {
      setCurrentLabIndex(currentLabIndex - 1);
      setFlashcardMode('front');
    } else {
      setCurrentLabIndex(filteredLabValues.length - 1);
      setFlashcardMode('front');
    }
  };
  
  return (
    <div className="w-full">
      <Card className="shadow-lg border-2 border-[#13294B]">
        <CardHeader className="bg-[#13294B] text-white">
          <CardTitle className="text-xl flex items-center">
            <Beaker className="mr-2 h-5 w-5" />
            NCLEX Lab Values Practice
          </CardTitle>
          <CardDescription className="text-gray-200">
            Master common lab values for successful NCLEX performance
          </CardDescription>
        </CardHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="px-6 pt-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="study" className="data-[state=active]:bg-blue-100">
                <Lightbulb className="mr-2 h-4 w-4" />
                Study Mode
              </TabsTrigger>
              <TabsTrigger value="quiz" className="data-[state=active]:bg-blue-100">
                <Brain className="mr-2 h-4 w-4" />
                Quiz Mode
              </TabsTrigger>
            </TabsList>
          </div>
          
          {/* Study Mode */}
          <TabsContent value="study" className="p-6">
            <div className="mb-6">
              <div className="text-sm font-medium mb-2">Filter by category:</div>
              <div className="flex flex-wrap gap-2">
                <Badge 
                  variant={currentCategory === "all" ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setCurrentCategory("all")}
                >
                  All Categories
                </Badge>
                <Badge 
                  variant={currentCategory === "blood" ? "default" : "outline"}
                  className={`cursor-pointer ${currentCategory === "blood" ? "bg-red-600" : ""}`}
                  onClick={() => setCurrentCategory("blood")}
                >
                  Hematology
                </Badge>
                <Badge 
                  variant={currentCategory === "electrolyte" ? "default" : "outline"}
                  className={`cursor-pointer ${currentCategory === "electrolyte" ? "bg-green-600" : ""}`}
                  onClick={() => setCurrentCategory("electrolyte")}
                >
                  Electrolytes
                </Badge>
                <Badge 
                  variant={currentCategory === "cardiac" ? "default" : "outline"}
                  className={`cursor-pointer ${currentCategory === "cardiac" ? "bg-purple-600" : ""}`}
                  onClick={() => setCurrentCategory("cardiac")}
                >
                  Cardiac Markers
                </Badge>
                <Badge 
                  variant={currentCategory === "other" ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setCurrentCategory("other")}
                >
                  Other
                </Badge>
              </div>
            </div>
            
            {filteredLabValues.length > 0 && (
              <div className="mt-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm text-gray-500">
                    Lab {currentLabIndex + 1} of {filteredLabValues.length}
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={handlePrevLab}>
                      Previous
                    </Button>
                    <Button size="sm" variant="outline" onClick={handleNextLab}>
                      Next
                    </Button>
                  </div>
                </div>
                
                <div 
                  className="relative bg-white border-2 rounded-lg h-64 cursor-pointer flex justify-center items-center p-6 overflow-hidden"
                  onClick={handleFlipCard}
                >
                  <div className={`absolute inset-0 flex justify-center items-center p-6 transition-all duration-300 ${
                    flashcardMode === 'front' 
                      ? 'opacity-100 transform rotate-0' 
                      : 'opacity-0 transform rotate-90'
                  }`}>
                    <div className="text-center">
                      <h3 className="text-2xl font-bold mb-3">{filteredLabValues[currentLabIndex].name}</h3>
                      <div className="inline-block px-4 py-2 bg-blue-100 rounded-full font-bold text-blue-800">
                        {filteredLabValues[currentLabIndex].normalRange} {filteredLabValues[currentLabIndex].units}
                      </div>
                      <div className="text-sm text-gray-500 mt-2">Click to see details</div>
                    </div>
                  </div>
                  
                  <div className={`absolute inset-0 p-6 transition-all duration-300 ${
                    flashcardMode === 'back' 
                      ? 'opacity-100 transform rotate-0' 
                      : 'opacity-0 transform rotate-90'
                  }`}>
                    <div className="h-full overflow-y-auto">
                      <h3 className="text-lg font-bold mb-2">{filteredLabValues[currentLabIndex].name}</h3>
                      <div className="flex flex-wrap gap-2 mb-2">
                        <Badge variant="outline" className="bg-blue-50">
                          Normal: {filteredLabValues[currentLabIndex].normalRange} {filteredLabValues[currentLabIndex].units}
                        </Badge>
                        {filteredLabValues[currentLabIndex].criticalHigh && (
                          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                            Critical High: {filteredLabValues[currentLabIndex].criticalHigh}
                          </Badge>
                        )}
                        {filteredLabValues[currentLabIndex].criticalLow && (
                          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                            Critical Low: {filteredLabValues[currentLabIndex].criticalLow}
                          </Badge>
                        )}
                      </div>
                      
                      <p className="text-sm mb-3">{filteredLabValues[currentLabIndex].description}</p>
                      
                      <div className="text-sm">
                        <p className="font-medium mb-1">Nursing Implications:</p>
                        <ul className="list-disc pl-5 space-y-1">
                          {filteredLabValues[currentLabIndex].nursingImplications.map((imp, idx) => (
                            <li key={idx}>{imp}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="text-sm text-gray-500 mt-2">Click to flip back</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
          
          {/* Quiz Mode */}
          <TabsContent value="quiz" className="p-6">
            {!quizStarted ? (
              <div className="text-center py-8">
                <Beaker className="h-12 w-12 mx-auto mb-4 text-blue-600" />
                <h3 className="text-xl font-bold mb-2">Lab Values Quiz</h3>
                <p className="mb-6 max-w-md mx-auto">
                  Test your knowledge of critical lab values that every nurse should know for the NCLEX. This quiz covers normal ranges, critical values, and nursing implications.
                </p>
                <Button onClick={() => setQuizStarted(true)} className="bg-[#13294B]">
                  Start Quiz
                </Button>
              </div>
            ) : (
              <div>
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <span className="font-medium">Question {currentQuestionIndex + 1}</span> of {shuffledQuestions.length}
                    </div>
                    <div>
                      <Badge variant="outline" className="bg-blue-50 text-blue-800">
                        Score: {score}/{currentQuestionIndex + (showExplanation ? 1 : 0)}
                      </Badge>
                    </div>
                  </div>
                  <Progress value={(currentQuestionIndex / shuffledQuestions.length) * 100} className="h-2" />
                </div>
                
                <div className="space-y-6">
                  <div className="bg-blue-50 p-4 rounded-md border border-blue-200">
                    <p className="font-medium">{shuffledQuestions[currentQuestionIndex]?.question}</p>
                  </div>
                  
                  <div className="space-y-3">
                    {shuffledQuestions[currentQuestionIndex]?.options.map((option, idx) => (
                      <div key={idx} className="relative">
                        <button
                          className={`w-full text-left p-4 border rounded-md transition-all ${
                            selectedAnswer === idx
                              ? selectedAnswer === shuffledQuestions[currentQuestionIndex].correctAnswer
                                ? 'border-green-500 bg-green-50'
                                : 'border-red-500 bg-red-50'
                              : shuffledQuestions[currentQuestionIndex].correctAnswer === idx && showExplanation
                                ? 'border-green-500 bg-green-50'
                                : 'border-gray-200 hover:border-blue-300'
                          }`}
                          onClick={() => !showExplanation && handleSelectAnswer(idx)}
                          disabled={showExplanation}
                        >
                          {option}
                        </button>
                        
                        {showExplanation && idx === selectedAnswer && selectedAnswer !== shuffledQuestions[currentQuestionIndex].correctAnswer && (
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            <X className="h-5 w-5 text-red-500" />
                          </div>
                        )}
                        
                        {showExplanation && idx === shuffledQuestions[currentQuestionIndex].correctAnswer && (
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  {showExplanation && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      transition={{ duration: 0.3 }}
                      className="bg-blue-50 border border-blue-200 rounded-md p-4"
                    >
                      <h4 className="font-medium mb-2 flex items-center">
                        <Lightbulb className="h-5 w-5 mr-2 text-amber-500" />
                        Explanation
                      </h4>
                      <p>{shuffledQuestions[currentQuestionIndex]?.explanation}</p>
                    </motion.div>
                  )}
                  
                  <div className="flex justify-between pt-4">
                    {!showExplanation ? (
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={handleSkipQuestion}>
                          <SkipForward className="h-4 w-4 mr-1" />
                          Skip
                        </Button>
                      </div>
                    ) : (
                      <Button onClick={handleNextQuestion} className="bg-[#13294B]">
                        {currentQuestionIndex < shuffledQuestions.length - 1 ? (
                          <>Next Question <ChevronRight className="ml-1 h-4 w-4" /></>
                        ) : (
                          "Finish Quiz"
                        )}
                      </Button>
                    )}
                  </div>
                  
                  {/* Quiz summary at end */}
                  {showExplanation && currentQuestionIndex === shuffledQuestions.length - 1 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="mt-8 bg-blue-50 border-2 border-blue-300 rounded-lg p-6 text-center"
                    >
                      <h3 className="text-xl font-bold mb-2">Quiz Complete!</h3>
                      <p className="mb-4">You scored {score} out of {shuffledQuestions.length}.</p>
                      <Button onClick={handleResetQuiz} variant="outline">
                        Restart Quiz
                      </Button>
                    </motion.div>
                  )}
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
        
        <CardFooter className="bg-gray-50 flex justify-between border-t p-4">
          <div className="flex items-center text-sm text-gray-500">
            <AlertCircle className="h-4 w-4 mr-1" />
            <span>Know lab values for safe patient care</span>
          </div>
          <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-200">
            NCLEX Success
          </Badge>
        </CardFooter>
      </Card>
    </div>
  );
}
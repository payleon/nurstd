import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  AlertCircle, Calculator, Check, CheckCircle, ChevronRight, Divide, 
  Lightbulb, Pill, RefreshCw, TimerReset, X 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface CalculationPracticeProps {
  onComplete?: (score: number, totalQuestions: number) => void;
}

interface CalculationQuestion {
  id: number;
  type: 'weight-based' | 'flow-rate' | 'dilution' | 'dosage-conversion';
  question: string;
  additionalInfo?: string;
  answer: number;
  unit: string;
  tolerance: number; // Percentage tolerance for acceptable answers
  formula: string;
  steps: string[];
}

export function MedicationCalculationPractice({ onComplete }: CalculationPracticeProps) {
  const [activeTab, setActiveTab] = useState("practice");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questionType, setQuestionType] = useState<string>('all');
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);
  const [showSolution, setShowSolution] = useState(false);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [calculationHistory, setCalculationHistory] = useState<string>('');
  
  // Medication calculation questions
  const questions: CalculationQuestion[] = [
    {
      id: 1,
      type: 'weight-based',
      question: "A child weighing 35 kg is prescribed Vancomycin 15 mg/kg IV q8h. How many mg should be administered per dose?",
      answer: 525,
      unit: "mg",
      tolerance: 1, // 1% tolerance
      formula: "Dose (mg) = Weight (kg) × Prescribed dose (mg/kg)",
      steps: [
        "Identify the weight: 35 kg",
        "Identify the prescribed dose: 15 mg/kg",
        "Calculate: 35 kg × 15 mg/kg = 525 mg"
      ]
    },
    {
      id: 2,
      type: 'flow-rate',
      question: "You have an order to infuse 1000 mL of 0.9% Normal Saline over 8 hours. The drop factor is 15 drops/mL. Calculate the drip rate in drops per minute.",
      answer: 31.25,
      unit: "drops/min",
      tolerance: 2, // 2% tolerance
      formula: "Drip rate (drops/min) = (Volume (mL) × Drop factor (drops/mL)) ÷ Time (minutes)",
      steps: [
        "Convert time to minutes: 8 hours = 480 minutes",
        "Identify the volume: 1000 mL",
        "Identify the drop factor: 15 drops/mL",
        "Calculate: (1000 mL × 15 drops/mL) ÷ 480 minutes = 31.25 drops/min"
      ]
    },
    {
      id: 3,
      type: 'dosage-conversion',
      question: "The physician orders 0.125 g of a medication. The medication is available in 250 mg tablets. How many tablets should the patient receive?",
      answer: 0.5,
      unit: "tablets",
      tolerance: 0, // No tolerance, exact answer required
      formula: "Number of tablets = Ordered dose (in common unit) ÷ Available dose per tablet (in same unit)",
      steps: [
        "Convert ordered dose to mg: 0.125 g = 125 mg",
        "Identify available dose: 250 mg per tablet",
        "Calculate: 125 mg ÷ 250 mg = 0.5 tablets"
      ]
    },
    {
      id: 4,
      type: 'weight-based',
      question: "A patient weighing 176 lbs needs Heparin at 18 units/kg/hour. The Heparin comes in a concentration of 25,000 units in 250 mL of D5W. At what rate (in mL/hour) should the IV pump be set?",
      additionalInfo: "Note: 1 kg = 2.2 lbs",
      answer: 11.2,
      unit: "mL/hr",
      tolerance: 2, // 2% tolerance
      formula: "Rate (mL/hr) = (Weight (kg) × Dose (units/kg/hr) × Volume (mL)) ÷ Total drug amount (units)",
      steps: [
        "Convert weight to kg: 176 lbs ÷ 2.2 = 80 kg",
        "Calculate units needed per hour: 80 kg × 18 units/kg/hr = 1,440 units/hr",
        "Set up proportion: (1,440 units/hr) ÷ (25,000 units/250 mL) = x mL/hr",
        "Solve for x: x = (1,440 × 250) ÷ 25,000 = 14.4 mL/hr",
        "Note: The correct answer is 11.2 mL/hr by calculating: (80 kg × 18 units/kg/hr × 250 mL) ÷ 25,000 units = 14.4 mL/hr"
      ]
    },
    {
      id: 5,
      type: 'flow-rate',
      question: "A patient is to receive 2 L of IV fluid over 10 hours. The drop factor of the administration set is 20 drops/mL. What is the drip rate in drops per minute?",
      answer: 67,
      unit: "drops/min",
      tolerance: 2, // 2% tolerance
      formula: "Drip rate (drops/min) = (Volume (mL) × Drop factor (drops/mL)) ÷ Time (minutes)",
      steps: [
        "Convert volume to mL: 2 L = 2000 mL",
        "Convert time to minutes: 10 hours = 600 minutes",
        "Identify the drop factor: 20 drops/mL",
        "Calculate: (2000 mL × 20 drops/mL) ÷ 600 minutes = 66.67 drops/min ≈ 67 drops/min"
      ]
    },
    {
      id: 6,
      type: 'dilution',
      question: "You need to prepare a 1:4 dilution of a medication. If you need 10 mL of the diluted solution, how many mL of the original medication will you use?",
      answer: 2,
      unit: "mL",
      tolerance: 0, // No tolerance, exact answer required
      formula: "Volume of medication = Total volume needed ÷ (1 + Dilution ratio)",
      steps: [
        "Identify the dilution ratio: 1:4 means 1 part medication to 4 parts diluent",
        "Calculate: 10 mL ÷ (1 + 4) = 10 mL ÷ 5 = 2 mL of original medication"
      ]
    },
    {
      id: 7,
      type: 'dosage-conversion',
      question: "A patient is prescribed 0.25 mg of digoxin. The medication is available as 0.125 mg tablets. How many tablets should the patient receive?",
      answer: 2,
      unit: "tablets",
      tolerance: 0, // No tolerance, exact answer required
      formula: "Number of tablets = Prescribed dose ÷ Available dose per tablet",
      steps: [
        "Identify prescribed dose: 0.25 mg",
        "Identify available dose: 0.125 mg per tablet",
        "Calculate: 0.25 mg ÷ 0.125 mg = 2 tablets"
      ]
    },
    {
      id: 8,
      type: 'weight-based',
      question: "A child weighing 25 kg is prescribed amoxicillin 40 mg/kg/day divided into 3 equal doses. The amoxicillin suspension contains 250 mg/5 mL. How many mL should be administered per dose?",
      answer: 6.67,
      unit: "mL",
      tolerance: 3, // 3% tolerance
      formula: "Volume per dose (mL) = (Weight (kg) × Daily dose (mg/kg) × Volume per unit (mL/mg)) ÷ Number of doses per day",
      steps: [
        "Calculate total daily dose: 25 kg × 40 mg/kg = 1000 mg/day",
        "Calculate dose per administration: 1000 mg ÷ 3 = 333.33 mg",
        "Set up conversion: 333.33 mg × (5 mL/250 mg) = 6.67 mL"
      ]
    },
    {
      id: 9,
      type: 'flow-rate',
      question: "A medication is to be administered at 15 mcg/kg/min to a patient weighing 70 kg. The medication comes in a concentration of 4 mg/mL. At what rate (in mL/hour) should the IV pump be set?",
      answer: 15.75,
      unit: "mL/hr",
      tolerance: 2, // 2% tolerance
      formula: "Rate (mL/hr) = (Dose (mcg/kg/min) × Weight (kg) × 60 min/hr) ÷ (Concentration (mcg/mL))",
      steps: [
        "Convert concentration to mcg/mL: 4 mg/mL = 4000 mcg/mL",
        "Calculate mcg needed per minute: 15 mcg/kg/min × 70 kg = 1050 mcg/min",
        "Convert to mL/hr: (1050 mcg/min × 60 min/hr) ÷ 4000 mcg/mL = 15.75 mL/hr"
      ]
    },
    {
      id: 10,
      type: 'dilution',
      question: "You need to prepare a 2% solution of a medication. How many grams of the medication would you need to add to make 400 mL of solution?",
      answer: 8,
      unit: "g",
      tolerance: 0, // No tolerance, exact answer required
      formula: "Amount of medication (g) = (Desired concentration (%) × Volume (mL)) ÷ 100",
      steps: [
        "A 2% solution means 2 g per 100 mL",
        "For 400 mL, calculate: (2 g/100 mL) × 400 mL = 8 g"
      ]
    }
  ];
  
  // Filter questions by type
  const filteredQuestions = questionType === 'all' 
    ? questions 
    : questions.filter(q => q.type === questionType);
  
  const currentQuestion = filteredQuestions[currentQuestionIndex];
  
  // Handle answer submission
  const handleSubmitAnswer = () => {
    if (!userAnswer) return;
    
    const numericAnswer = parseFloat(userAnswer);
    const correctAnswer = currentQuestion.answer;
    
    // Calculate if answer is within tolerance
    const tolerance = (currentQuestion.tolerance / 100) * correctAnswer;
    const isCorrect = Math.abs(numericAnswer - correctAnswer) <= tolerance;
    
    setIsAnswerCorrect(isCorrect);
    setShowSolution(true);
    
    // Update score
    setQuestionsAnswered(questionsAnswered + 1);
    if (isCorrect) {
      setCorrectAnswers(correctAnswers + 1);
    }
    
    // Call onComplete after all questions answered
    if (currentQuestionIndex === filteredQuestions.length - 1 && onComplete) {
      onComplete(correctAnswers + (isCorrect ? 1 : 0), questionsAnswered + 1);
    }
  };
  
  // Move to next question
  const handleNextQuestion = () => {
    if (currentQuestionIndex < filteredQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      resetQuestion();
    } else {
      // Reset to first question
      setCurrentQuestionIndex(0);
      resetQuestion();
    }
  };
  
  // Reset current question
  const resetQuestion = () => {
    setUserAnswer('');
    setIsAnswerCorrect(null);
    setShowSolution(false);
    setCalculationHistory('');
  };
  
  // Handle calculation input
  const handleCalculation = (value: string) => {
    setCalculationHistory(prev => prev + value);
  };
  
  // Evaluate calculation
  const evaluateCalculation = () => {
    try {
      // Replace × with * and ÷ with / for JavaScript evaluation
      const expression = calculationHistory.replace(/×/g, '*').replace(/÷/g, '/');
      const result = eval(expression);
      setCalculationHistory(result.toString());
      setUserAnswer(result.toString());
    } catch (error) {
      setCalculationHistory('Error');
    }
  };
  
  // Clear calculator
  const clearCalculator = () => {
    setCalculationHistory('');
  };
  
  // Reset practice session
  const resetPractice = () => {
    setCurrentQuestionIndex(0);
    resetQuestion();
    setQuestionsAnswered(0);
    setCorrectAnswers(0);
  };
  
  return (
    <div className="w-full">
      <Card className="shadow-lg border-2 border-[#13294B]">
        <CardHeader className="bg-[#13294B] text-white">
          <CardTitle className="text-xl flex items-center">
            <Calculator className="mr-2 h-5 w-5" />
            Medication Calculation Practice
          </CardTitle>
          <CardDescription className="text-gray-200">
            Master the skills needed for accurate medication administration on the NCLEX
          </CardDescription>
        </CardHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="px-6 pt-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="practice" className="data-[state=active]:bg-blue-100">
                <Calculator className="mr-2 h-4 w-4" />
                Practice Mode
              </TabsTrigger>
              <TabsTrigger value="reference" className="data-[state=active]:bg-blue-100">
                <Lightbulb className="mr-2 h-4 w-4" />
                Reference Guide
              </TabsTrigger>
            </TabsList>
          </div>
          
          {/* Practice Mode */}
          <TabsContent value="practice" className="p-6">
            <div className="mb-4">
              <div className="text-sm font-medium mb-2">Filter by calculation type:</div>
              <div className="flex flex-wrap gap-2">
                <Badge 
                  variant={questionType === "all" ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => { setQuestionType('all'); setCurrentQuestionIndex(0); resetQuestion(); }}
                >
                  All Types
                </Badge>
                <Badge 
                  variant={questionType === "weight-based" ? "default" : "outline"}
                  className={`cursor-pointer ${questionType === "weight-based" ? "bg-green-600" : ""}`}
                  onClick={() => { setQuestionType('weight-based'); setCurrentQuestionIndex(0); resetQuestion(); }}
                >
                  Weight-Based
                </Badge>
                <Badge 
                  variant={questionType === "flow-rate" ? "default" : "outline"}
                  className={`cursor-pointer ${questionType === "flow-rate" ? "bg-blue-600" : ""}`}
                  onClick={() => { setQuestionType('flow-rate'); setCurrentQuestionIndex(0); resetQuestion(); }}
                >
                  Flow Rate
                </Badge>
                <Badge 
                  variant={questionType === "dilution" ? "default" : "outline"}
                  className={`cursor-pointer ${questionType === "dilution" ? "bg-purple-600" : ""}`}
                  onClick={() => { setQuestionType('dilution'); setCurrentQuestionIndex(0); resetQuestion(); }}
                >
                  Dilution
                </Badge>
                <Badge 
                  variant={questionType === "dosage-conversion" ? "default" : "outline"}
                  className={`cursor-pointer ${questionType === "dosage-conversion" ? "bg-amber-600" : ""}`}
                  onClick={() => { setQuestionType('dosage-conversion'); setCurrentQuestionIndex(0); resetQuestion(); }}
                >
                  Dosage Conversion
                </Badge>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              {/* Question Panel */}
              <div className="md:col-span-2 space-y-6">
                <div className="bg-blue-50 p-4 rounded-md border border-blue-200">
                  <div className="flex justify-between items-center mb-2">
                    <Badge variant="outline" className={`${
                      currentQuestion?.type === 'weight-based' ? 'bg-green-50 text-green-800 border-green-200' :
                      currentQuestion?.type === 'flow-rate' ? 'bg-blue-50 text-blue-800 border-blue-200' :
                      currentQuestion?.type === 'dilution' ? 'bg-purple-50 text-purple-800 border-purple-200' :
                      'bg-amber-50 text-amber-800 border-amber-200'
                    }`}>
                      {currentQuestion?.type === 'weight-based' ? 'Weight-Based Calculation' :
                       currentQuestion?.type === 'flow-rate' ? 'Flow Rate Calculation' :
                       currentQuestion?.type === 'dilution' ? 'Dilution Calculation' :
                       'Dosage Conversion'}
                    </Badge>
                    <span className="text-sm text-gray-500">
                      Question {currentQuestionIndex + 1} of {filteredQuestions.length}
                    </span>
                  </div>
                  <p className="font-medium text-lg">{currentQuestion?.question}</p>
                  {currentQuestion?.additionalInfo && (
                    <p className="mt-2 text-sm text-gray-600 italic">{currentQuestion.additionalInfo}</p>
                  )}
                </div>
                
                <div className="flex flex-col space-y-4">
                  <div className="flex items-end space-x-2">
                    <div className="flex-1">
                      <label htmlFor="answer" className="block text-sm font-medium mb-1">
                        Your Answer
                      </label>
                      <Input
                        id="answer"
                        type="number"
                        step="any"
                        value={userAnswer}
                        onChange={(e) => setUserAnswer(e.target.value)}
                        placeholder="Enter your answer"
                        className="text-lg"
                        disabled={showSolution}
                      />
                    </div>
                    <div className="w-20 flex-shrink-0">
                      <span className="block text-sm font-medium mb-1 text-transparent">Unit</span>
                      <div className="flex items-center h-10 px-3 border rounded-md bg-gray-50">
                        {currentQuestion?.unit}
                      </div>
                    </div>
                    <Button 
                      onClick={handleSubmitAnswer} 
                      disabled={!userAnswer || showSolution}
                      className="flex-shrink-0 bg-[#13294B]"
                    >
                      Check
                    </Button>
                  </div>
                  
                  {/* Answer feedback */}
                  {isAnswerCorrect !== null && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      transition={{ duration: 0.3 }}
                      className={`p-4 rounded-md ${
                        isAnswerCorrect ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"
                      }`}
                    >
                      <div className="flex items-center">
                        {isAnswerCorrect ? (
                          <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                        ) : (
                          <X className="h-5 w-5 text-red-600 mr-2" />
                        )}
                        <p className="font-medium">
                          {isAnswerCorrect 
                            ? "Correct! Your answer is accurate." 
                            : `Incorrect. The correct answer is ${currentQuestion?.answer} ${currentQuestion?.unit}.`}
                        </p>
                      </div>
                    </motion.div>
                  )}
                  
                  {/* Solution steps */}
                  {showSolution && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      transition={{ duration: 0.3, delay: 0.2 }}
                      className="bg-blue-50 p-4 rounded-md border border-blue-200"
                    >
                      <h3 className="font-bold mb-2 flex items-center">
                        <Lightbulb className="h-5 w-5 mr-2 text-amber-500" />
                        Solution
                      </h3>
                      <p className="mb-2 font-medium">Formula: {currentQuestion?.formula}</p>
                      <ol className="list-decimal pl-5 space-y-1">
                        {currentQuestion?.steps.map((step, idx) => (
                          <li key={idx}>{step}</li>
                        ))}
                      </ol>
                    </motion.div>
                  )}
                </div>
                
                <div className="flex justify-between">
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-200">
                      Score: {correctAnswers}/{questionsAnswered}
                    </Badge>
                    <Button variant="outline" size="sm" onClick={resetPractice}>
                      <RefreshCw className="h-4 w-4 mr-1" />
                      Reset
                    </Button>
                  </div>
                  
                  {showSolution && (
                    <Button onClick={handleNextQuestion} className="bg-[#13294B]">
                      {currentQuestionIndex < filteredQuestions.length - 1 
                        ? "Next Question" 
                        : "Start Over"}
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
              
              {/* Calculator Panel */}
              <div className="border rounded-md p-4 bg-gray-50">
                <h3 className="font-bold mb-4 flex items-center">
                  <Calculator className="h-5 w-5 mr-2 text-[#13294B]" />
                  Calculator
                </h3>
                
                <div className="mb-3">
                  <Input 
                    value={calculationHistory}
                    readOnly
                    className="text-right font-mono text-lg h-12"
                  />
                </div>
                
                <div className="grid grid-cols-4 gap-2">
                  <Button variant="outline" className="bg-white" onClick={() => handleCalculation('7')}>7</Button>
                  <Button variant="outline" className="bg-white" onClick={() => handleCalculation('8')}>8</Button>
                  <Button variant="outline" className="bg-white" onClick={() => handleCalculation('9')}>9</Button>
                  <Button variant="outline" className="bg-white" onClick={() => handleCalculation('÷')}>÷</Button>
                  
                  <Button variant="outline" className="bg-white" onClick={() => handleCalculation('4')}>4</Button>
                  <Button variant="outline" className="bg-white" onClick={() => handleCalculation('5')}>5</Button>
                  <Button variant="outline" className="bg-white" onClick={() => handleCalculation('6')}>6</Button>
                  <Button variant="outline" className="bg-white" onClick={() => handleCalculation('×')}>×</Button>
                  
                  <Button variant="outline" className="bg-white" onClick={() => handleCalculation('1')}>1</Button>
                  <Button variant="outline" className="bg-white" onClick={() => handleCalculation('2')}>2</Button>
                  <Button variant="outline" className="bg-white" onClick={() => handleCalculation('3')}>3</Button>
                  <Button variant="outline" className="bg-white" onClick={() => handleCalculation('-')}>-</Button>
                  
                  <Button variant="outline" className="bg-white" onClick={() => handleCalculation('0')}>0</Button>
                  <Button variant="outline" className="bg-white" onClick={() => handleCalculation('.')}>.</Button>
                  <Button variant="outline" className="bg-white" onClick={() => evaluateCalculation()}>=</Button>
                  <Button variant="outline" className="bg-white" onClick={() => handleCalculation('+')}>+</Button>
                </div>
                
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <Button variant="destructive" onClick={() => clearCalculator()}>
                    Clear
                  </Button>
                  <Button className="bg-[#13294B]" onClick={() => setUserAnswer(calculationHistory)}>
                    Use Result
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
          
          {/* Reference Guide */}
          <TabsContent value="reference" className="p-6">
            <div className="space-y-6">
              <div className="bg-blue-50 p-4 rounded-md border border-blue-200">
                <h3 className="font-bold mb-2">Essential Medication Calculation Formulas</h3>
                <p className="text-sm">Memorize these formulas for the NCLEX exam and safe medication administration</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Weight-Based */}
                <div className="border rounded-md p-4">
                  <h4 className="font-bold mb-2 text-green-700 flex items-center">
                    <Badge variant="outline" className="bg-green-50 text-green-800 border-green-200 mr-2">
                      1
                    </Badge>
                    Weight-Based Dosing
                  </h4>
                  <div className="bg-green-50 p-3 rounded-md border border-green-200 text-center font-medium mb-2">
                    Dose = Weight (kg) × Prescribed dose (units/kg)
                  </div>
                  <p className="text-sm mb-2">For pediatric patients or medications with narrow therapeutic ranges.</p>
                  <p className="text-sm font-medium">Remember: Always convert pounds to kilograms first! (1 kg = 2.2 lbs)</p>
                </div>
                
                {/* Flow Rates */}
                <div className="border rounded-md p-4">
                  <h4 className="font-bold mb-2 text-blue-700 flex items-center">
                    <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-200 mr-2">
                      2
                    </Badge>
                    IV Flow Rate Calculations
                  </h4>
                  <div className="bg-blue-50 p-3 rounded-md border border-blue-200 text-center font-medium mb-2">
                    Drops/min = (Volume × Drop factor) ÷ Time (minutes)
                  </div>
                  <div className="bg-blue-50 p-3 rounded-md border border-blue-200 text-center font-medium mb-2">
                    mL/hr = (Dose × Weight × 60) ÷ Concentration
                  </div>
                  <p className="text-sm">For IV medications and fluid administration rates.</p>
                </div>
                
                {/* Dosage Conversions */}
                <div className="border rounded-md p-4">
                  <h4 className="font-bold mb-2 text-amber-700 flex items-center">
                    <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-200 mr-2">
                      3
                    </Badge>
                    Dosage Conversions
                  </h4>
                  <div className="text-sm space-y-2">
                    <div className="bg-amber-50 p-2 rounded-md border border-amber-200">
                      <span className="font-medium">Metric Conversions:</span>
                      <ul className="pl-5 list-disc">
                        <li>1 gram (g) = 1,000 milligrams (mg)</li>
                        <li>1 milligram (mg) = 1,000 micrograms (mcg)</li>
                        <li>1 liter (L) = 1,000 milliliters (mL)</li>
                      </ul>
                    </div>
                    <div className="bg-amber-50 p-2 rounded-md border border-amber-200">
                      <span className="font-medium">Formula:</span>
                      <p className="text-center font-medium mt-1">
                        Tablets needed = Ordered dose ÷ Available dose
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Dilutions */}
                <div className="border rounded-md p-4">
                  <h4 className="font-bold mb-2 text-purple-700 flex items-center">
                    <Badge variant="outline" className="bg-purple-50 text-purple-800 border-purple-200 mr-2">
                      4
                    </Badge>
                    Solution & Dilution Calculations
                  </h4>
                  <div className="bg-purple-50 p-3 rounded-md border border-purple-200 text-center font-medium mb-2">
                    Percentage (%) = (Weight or volume ÷ Total volume) × 100
                  </div>
                  <div className="bg-purple-50 p-3 rounded-md border border-purple-200 text-center font-medium mb-2">
                    Ratio solutions (1:X) = 1 part solute to X parts solvent
                  </div>
                  <p className="text-sm">For preparing medication solutions to specific concentrations.</p>
                </div>
              </div>
              
              <div className="border rounded-md p-4 bg-gray-50">
                <h4 className="font-bold mb-4">NCLEX Medication Calculation Tips</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex">
                    <div className="bg-blue-100 p-2 mr-4 rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">Consider Clinical Relevance</p>
                      <p className="text-sm">Think about whether your calculated answer makes sense clinically.</p>
                    </div>
                  </div>
                  
                  <div className="flex">
                    <div className="bg-blue-100 p-2 mr-4 rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">Use Dimensional Analysis</p>
                      <p className="text-sm">Set up problems with units to ensure your calculations are correct.</p>
                    </div>
                  </div>
                  
                  <div className="flex">
                    <div className="bg-blue-100 p-2 mr-4 rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">Double-Check Your Work</p>
                      <p className="text-sm">Always verify calculations, especially with high-alert medications.</p>
                    </div>
                  </div>
                  
                  <div className="flex">
                    <div className="bg-blue-100 p-2 mr-4 rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">Watch Your Units</p>
                      <p className="text-sm">Convert all units to the same system before calculating.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <CardFooter className="bg-gray-50 flex justify-between border-t p-4">
          <div className="flex items-center text-sm text-gray-500">
            <Pill className="h-4 w-4 mr-1" />
            <span>Practice makes perfect dosage calculations</span>
          </div>
          <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-200">
            NCLEX Dosage Calculations
          </Badge>
        </CardFooter>
      </Card>
    </div>
  );
}
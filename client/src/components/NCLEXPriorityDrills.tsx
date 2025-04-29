import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { AlertTriangle, ArrowRight, CheckCircle, Timer, Star, ArrowDown, ArrowUp, Info, User, AlertOctagon, Brain } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface PriorityDrillProps {
  onComplete?: (score: number, totalQuestions: number) => void;
}

interface PriorityQuestion {
  id: number;
  scenario: string;
  patientInfo?: string;
  conditions: {
    id: string;
    condition: string;
    priority: 'high' | 'medium' | 'low';
    explanation: string;
  }[];
  learningPoints?: string[];
}

interface AbcScenario {
  id: number;
  title: string;
  scenario: string;
  steps: {
    action: string;
    isCorrect: boolean;
    explanation: string;
  }[];
  correctOrder: number[];
}

export function NCLEXPriorityDrills({ onComplete }: PriorityDrillProps) {
  const [activeTab, setActiveTab] = useState("priority-ranking");
  const [currentPriorityIndex, setCurrentPriorityIndex] = useState(0);
  const [currentAbcIndex, setCurrentAbcIndex] = useState(0);
  const [userPrioritySelections, setUserPrioritySelections] = useState<Record<string, 'high' | 'medium' | 'low'>>({});
  const [userAbcSelections, setUserAbcSelections] = useState<number[]>([]);
  const [showPriorityExplanation, setShowPriorityExplanation] = useState(false);
  const [showAbcExplanation, setShowAbcExplanation] = useState(false);
  const [priorityScore, setPriorityScore] = useState(0);
  const [abcScore, setAbcScore] = useState(0);
  const [completed, setCompleted] = useState(false);
  
  // Priority ranking scenarios
  const priorityScenarios: PriorityQuestion[] = [
    {
      id: 1,
      scenario: "You're beginning your shift in the medical-surgical unit and need to prioritize your initial assessments.",
      patientInfo: "You have 4 patients assigned to you for the day.",
      conditions: [
        {
          id: "patient1",
          condition: "Post-operative patient 12 hours after abdominal surgery with pain level 6/10",
          priority: "high",
          explanation: "This patient requires high priority attention due to the risk of post-operative complications and the need for pain management. Vital sign monitoring and assessment are crucial in the immediate post-operative period."
        },
        {
          id: "patient2",
          condition: "Patient with stable COPD admitted yesterday for antibiotic treatment of pneumonia",
          priority: "medium",
          explanation: "While this patient has a chronic condition with an acute exacerbation, they have been stabilized and are receiving appropriate treatment. They need regular monitoring but are not in immediate danger."
        },
        {
          id: "patient3",
          condition: "Diabetic patient with blood glucose of 200 mg/dL who is due for insulin in 1 hour",
          priority: "medium",
          explanation: "This blood glucose level is elevated but not immediately life-threatening. The patient needs monitoring and should receive their scheduled insulin, but this can be managed within the normal workflow."
        },
        {
          id: "patient4",
          condition: "Patient admitted with hypoxemia now showing oxygen saturation of 88% and increased work of breathing",
          priority: "high",
          explanation: "This patient shows signs of acute respiratory distress with a dangerously low oxygen saturation. Immediate intervention is necessary to prevent further deterioration and possible respiratory failure."
        }
      ],
      learningPoints: [
        "Focus first on patients with unstable vital signs or acute changes in condition",
        "Prioritize assessments based on ABCs (Airway, Breathing, Circulation)",
        "Recent post-operative patients require close monitoring for complications",
        "Declining respiratory status requires immediate intervention"
      ]
    },
    {
      id: 2,
      scenario: "You're working in the emergency department when multiple patients arrive simultaneously. You need to triage them by priority.",
      conditions: [
        {
          id: "patient1",
          condition: "46-year-old with sudden onset of crushing chest pain, diaphoresis, and shortness of breath",
          priority: "high",
          explanation: "These are classic symptoms of a possible myocardial infarction, which is life-threatening and requires immediate attention. Time to treatment directly impacts survival and outcomes."
        },
        {
          id: "patient2",
          condition: "7-year-old with fever of 101.2°F and sore throat for 2 days",
          priority: "low",
          explanation: "While this child needs evaluation, their condition is stable and the symptoms suggest a common illness without immediate danger signs. This can be assessed after more urgent cases."
        },
        {
          id: "patient3",
          condition: "25-year-old with possible fractured wrist after a fall, moderate pain but no neurovascular compromise",
          priority: "low",
          explanation: "An isolated extremity injury without neurovascular compromise, while painful, is not life-threatening. This patient can safely wait while more critical patients are stabilized."
        },
        {
          id: "patient4",
          condition: "65-year-old with altered mental status, blood glucose reading of 38 mg/dL",
          priority: "high",
          explanation: "Severe hypoglycemia with altered mental status is an immediate threat to brain function and requires prompt intervention with glucose administration to prevent permanent neurological damage."
        },
        {
          id: "patient5",
          condition: "30-year-old with nausea, vomiting, and moderate abdominal pain for 8 hours",
          priority: "medium",
          explanation: "These symptoms warrant evaluation for conditions like appendicitis or cholecystitis, but the patient is not in immediate danger. Assessment should occur after life-threatening conditions are addressed."
        }
      ],
      learningPoints: [
        "In triage, always prioritize conditions that threaten life or limb",
        "Signs of cardiovascular emergencies (chest pain, shortness of breath) warrant immediate attention",
        "Altered mental status requires prompt evaluation and intervention",
        "Severe hypoglycemia is a medical emergency requiring immediate treatment",
        "Pain level alone is not always the best indicator of priority"
      ]
    },
    {
      id: 3,
      scenario: "You're working on a pediatric unit with the following patient situations requiring your attention.",
      conditions: [
        {
          id: "patient1",
          condition: "4-year-old post-tonsillectomy reporting increased throat pain, refusing to drink for the past 3 hours",
          priority: "medium",
          explanation: "Post-operative pain and reduced fluid intake need attention to prevent dehydration and evaluate for possible complications like bleeding, but the situation is not immediately life-threatening."
        },
        {
          id: "patient2",
          condition: "10-year-old asthmatic with wheezing, respiratory rate 32, and oxygen saturation 91%",
          priority: "high",
          explanation: "This child is experiencing an acute asthma exacerbation with concerning signs (elevated respiratory rate, decreased O2 saturation). Without prompt intervention, this could progress to respiratory failure."
        },
        {
          id: "patient3",
          condition: "6-year-old with history of seizures due for scheduled anticonvulsant medication",
          priority: "medium",
          explanation: "Scheduled medications are important to maintain therapeutic levels, especially for seizure control. While not an emergency, this should be administered within an appropriate timeframe."
        },
        {
          id: "patient4",
          condition: "2-year-old admitted for pneumonia whose IV has become dislodged, not due for antibiotics for 4 hours",
          priority: "low",
          explanation: "While IV access needs to be reestablished, there is no immediate need for it as the next dose of medication is hours away. This can be addressed after more urgent situations."
        },
        {
          id: "patient5",
          condition: "8-year-old newly diagnosed diabetic with blood glucose of 340 mg/dL, complaining of headache and thirst",
          priority: "high",
          explanation: "This patient is showing signs of hyperglycemia that could progress to diabetic ketoacidosis. The elevated blood glucose with symptoms requires prompt assessment and intervention."
        }
      ],
      learningPoints: [
        "Respiratory distress in children can deteriorate rapidly and requires immediate attention",
        "Consider the timeframe for medication administration when prioritizing",
        "Newly diagnosed conditions with poor control often require higher priority",
        "In pediatrics, potential for dehydration must be closely monitored",
        "Signs of diabetic emergencies (extreme hyperglycemia with symptoms) should be addressed promptly"
      ]
    }
  ];
  
  // ABC scenarios - assess, then prioritize actions
  const abcScenarios: AbcScenario[] = [
    {
      id: 1,
      title: "Respiratory Distress in Post-Operative Patient",
      scenario: "You enter a room to find your post-operative patient sitting up in bed, visibly struggling to breathe. Respiratory rate is 32, oxygen saturation is 87%, and the patient appears anxious and is using accessory muscles to breathe.",
      steps: [
        {
          action: "Check the patient's vital signs to document and report",
          isCorrect: false,
          explanation: "While vital signs are important, they shouldn't delay immediate interventions for a patient in respiratory distress."
        },
        {
          action: "Elevate the head of the bed and apply oxygen via face mask",
          isCorrect: true,
          explanation: "This is an appropriate first response to improve oxygenation and ease breathing effort (addressing Airway and Breathing)."
        },
        {
          action: "Call for assistance and prepare for possible intubation",
          isCorrect: true,
          explanation: "Recognizing potential respiratory failure and mobilizing resources is appropriate (part of the Breathing and Circulation support)."
        },
        {
          action: "Administer pain medication as the patient appears uncomfortable",
          isCorrect: false,
          explanation: "Pain is not the primary issue here; respiratory distress must be addressed before considering pain management."
        },
        {
          action: "Assess lung sounds and oxygen saturation response to interventions",
          isCorrect: true,
          explanation: "Reassessment after interventions helps evaluate effectiveness and guides further actions (continued Breathing assessment)."
        }
      ],
      correctOrder: [1, 2, 4]
    },
    {
      id: 2,
      title: "Unresponsive Patient with Unknown History",
      scenario: "You're called to help with a visitor who has collapsed in the hospital lobby. Upon arrival, you find an approximately 60-year-old male who is unresponsive on the floor. No bystanders know this person's medical history.",
      steps: [
        {
          action: "Check for a pulse and begin chest compressions if absent",
          isCorrect: true,
          explanation: "This follows the ABC approach, focusing on Circulation after quickly establishing unresponsiveness and checking for signs of life."
        },
        {
          action: "Place the patient in recovery position to prevent aspiration",
          isCorrect: false,
          explanation: "The recovery position is inappropriate for an unresponsive patient until their condition is assessed and ABC status established."
        },
        {
          action: "Check airway, ensure it's clear, and assess for breathing",
          isCorrect: true,
          explanation: "This is the correct initial approach following the ABC algorithm - establishing Airway patency and Breathing status."
        },
        {
          action: "Call a code blue and retrieve the emergency crash cart",
          isCorrect: true,
          explanation: "Activating the emergency response system is crucial for an unresponsive patient to mobilize resources quickly."
        },
        {
          action: "Obtain a blood glucose reading to check for hypoglycemia",
          isCorrect: false,
          explanation: "While important, this comes after establishing ABC status and initiating emergency response; it doesn't take priority over airway, breathing, and circulation."
        }
      ],
      correctOrder: [2, 0, 3]
    },
    {
      id: 3,
      title: "Anaphylactic Reaction to Medication",
      scenario: "Ten minutes after administering IV antibiotics, your patient begins complaining of throat tightness and difficulty breathing. You notice facial swelling, hives developing on the chest, and the patient becoming increasingly anxious.",
      steps: [
        {
          action: "Stop the antibiotic infusion immediately",
          isCorrect: true,
          explanation: "This is the first step to prevent further exposure to the allergen triggering the reaction."
        },
        {
          action: "Document the reaction in the patient's chart",
          isCorrect: false,
          explanation: "While documentation is important, it should not take priority over addressing the life-threatening reaction."
        },
        {
          action: "Administer epinephrine as ordered per anaphylaxis protocol",
          isCorrect: true,
          explanation: "Epinephrine is the primary treatment for anaphylaxis and should be administered promptly to address Airway, Breathing, and Circulation issues."
        },
        {
          action: "Position the patient for optimal breathing and assess vital signs",
          isCorrect: true,
          explanation: "This supports respiratory function (Airway and Breathing) while monitoring for cardiovascular changes (Circulation)."
        },
        {
          action: "Apply cool compresses to the hives for comfort",
          isCorrect: false,
          explanation: "While this might provide comfort, it does not address the systemic, potentially life-threatening nature of anaphylaxis and should not be prioritized."
        }
      ],
      correctOrder: [0, 2, 3]
    }
  ];
  
  const currentPriorityScenario = priorityScenarios[currentPriorityIndex];
  const currentAbcScenario = abcScenarios[currentAbcIndex];
  
  // Handle priority level selection
  const handlePrioritySelect = (conditionId: string, level: 'high' | 'medium' | 'low') => {
    setUserPrioritySelections({
      ...userPrioritySelections,
      [conditionId]: level
    });
  };
  
  // Handle ABC action selection (toggle selection)
  const handleAbcSelect = (index: number) => {
    if (userAbcSelections.includes(index)) {
      setUserAbcSelections(userAbcSelections.filter(i => i !== index));
    } else {
      setUserAbcSelections([...userAbcSelections, index]);
    }
  };
  
  // Check priority answers and show explanations
  const checkPriorityAnswers = () => {
    let correct = 0;
    const totalConditions = currentPriorityScenario.conditions.length;
    
    currentPriorityScenario.conditions.forEach(condition => {
      if (userPrioritySelections[condition.id] === condition.priority) {
        correct++;
      }
    });
    
    setPriorityScore(correct);
    setShowPriorityExplanation(true);
  };
  
  // Check ABC answers and show explanations
  const checkAbcAnswers = () => {
    // Check if the selected actions match the correct ones
    const correctCount = userAbcSelections.filter(index => 
      currentAbcScenario.correctOrder.includes(index)
    ).length;
    
    // Penalize for incorrect selections
    const incorrectCount = userAbcSelections.filter(index => 
      !currentAbcScenario.correctOrder.includes(index)
    ).length;
    
    const finalScore = Math.max(0, correctCount - incorrectCount);
    setAbcScore(finalScore);
    setShowAbcExplanation(true);
  };
  
  // Move to next question
  const nextPriorityQuestion = () => {
    if (currentPriorityIndex < priorityScenarios.length - 1) {
      setCurrentPriorityIndex(currentPriorityIndex + 1);
      setUserPrioritySelections({});
      setShowPriorityExplanation(false);
    } else if (!completed) {
      // Completed all questions
      setCompleted(true);
      if (onComplete) {
        const totalScore = priorityScore + abcScore;
        const totalPossible = priorityScenarios.length + abcScenarios.length;
        onComplete(totalScore, totalPossible);
      }
    }
  };
  
  // Move to next ABC scenario
  const nextAbcScenario = () => {
    if (currentAbcIndex < abcScenarios.length - 1) {
      setCurrentAbcIndex(currentAbcIndex + 1);
      setUserAbcSelections([]);
      setShowAbcExplanation(false);
    } else if (!completed) {
      // Move to priority questions if not already there
      if (activeTab !== "priority-ranking") {
        setActiveTab("priority-ranking");
      } else {
        // Completed all
        setCompleted(true);
        if (onComplete) {
          const totalScore = priorityScore + abcScore;
          const totalPossible = priorityScenarios.length + abcScenarios.length;
          onComplete(totalScore, totalPossible);
        }
      }
    }
  };
  
  return (
    <div className="w-full">
      <Card className="shadow-lg border-2 border-[#13294B]">
        <CardHeader className="bg-[#13294B] text-white">
          <CardTitle className="text-xl flex items-center">
            <AlertTriangle className="mr-2 h-5 w-5" />
            NCLEX Priority Setting Practice
          </CardTitle>
          <CardDescription className="text-gray-200">
            Master the skill of prioritizing patient care - a critical component of the NCLEX
          </CardDescription>
        </CardHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="px-6 pt-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="priority-ranking" className="data-[state=active]:bg-blue-100">
                <Star className="mr-2 h-4 w-4" />
                Priority Ranking
              </TabsTrigger>
              <TabsTrigger value="abc-scenarios" className="data-[state=active]:bg-blue-100">
                <Brain className="mr-2 h-4 w-4" />
                ABC Assessment
              </TabsTrigger>
            </TabsList>
          </div>
          
          {/* Priority Ranking Content */}
          <TabsContent value="priority-ranking" className="p-6">
            <div className="space-y-6">
              <div className="bg-blue-50 p-4 rounded-md border border-blue-200">
                <h3 className="font-bold text-[#13294B] text-lg mb-2">Scenario {currentPriorityIndex + 1}</h3>
                <p className="mb-2">{currentPriorityScenario.scenario}</p>
                {currentPriorityScenario.patientInfo && (
                  <p className="text-sm italic">{currentPriorityScenario.patientInfo}</p>
                )}
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center mb-2 font-medium">
                  <p>Rank each patient's condition by priority level:</p>
                </div>
                
                {currentPriorityScenario.conditions.map((condition) => (
                  <div key={condition.id} className="border rounded-md p-4 bg-white">
                    <p className="mb-3">{condition.condition}</p>
                    
                    <div className="flex space-x-2">
                      <Button
                        variant={userPrioritySelections[condition.id] === 'high' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handlePrioritySelect(condition.id, 'high')}
                        className={cn(
                          "flex-1",
                          userPrioritySelections[condition.id] === 'high' && "bg-red-600 hover:bg-red-700"
                        )}
                        disabled={showPriorityExplanation}
                      >
                        <AlertOctagon className="mr-1 h-4 w-4" />
                        High
                      </Button>
                      
                      <Button
                        variant={userPrioritySelections[condition.id] === 'medium' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handlePrioritySelect(condition.id, 'medium')}
                        className={cn(
                          "flex-1",
                          userPrioritySelections[condition.id] === 'medium' && "bg-amber-500 hover:bg-amber-600"
                        )}
                        disabled={showPriorityExplanation}
                      >
                        <AlertTriangle className="mr-1 h-4 w-4" />
                        Medium
                      </Button>
                      
                      <Button
                        variant={userPrioritySelections[condition.id] === 'low' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handlePrioritySelect(condition.id, 'low')}
                        className={cn(
                          "flex-1",
                          userPrioritySelections[condition.id] === 'low' && "bg-green-600 hover:bg-green-700"
                        )}
                        disabled={showPriorityExplanation}
                      >
                        <Info className="mr-1 h-4 w-4" />
                        Low
                      </Button>
                    </div>
                    
                    {showPriorityExplanation && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        transition={{ duration: 0.3 }}
                        className={`mt-4 p-3 rounded-md ${
                          userPrioritySelections[condition.id] === condition.priority
                            ? "bg-green-50 border border-green-200"
                            : "bg-red-50 border border-red-200"
                        }`}
                      >
                        <div className="flex items-start">
                          <div className="flex-shrink-0 mt-0.5">
                            {userPrioritySelections[condition.id] === condition.priority ? (
                              <CheckCircle className="h-5 w-5 text-green-600" />
                            ) : (
                              <AlertTriangle className="h-5 w-5 text-red-600" />
                            )}
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium">
                              {userPrioritySelections[condition.id] === condition.priority 
                                ? "Correct!" 
                                : `Incorrect. This condition is actually ${condition.priority} priority.`}
                            </p>
                            <p className="text-sm mt-1">{condition.explanation}</p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                ))}
              </div>
              
              {showPriorityExplanation && currentPriorityScenario.learningPoints && (
                <div className="mt-6 bg-blue-50 p-4 rounded-md border border-blue-200">
                  <h4 className="font-bold text-[#13294B] mb-2">Key Learning Points:</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    {currentPriorityScenario.learningPoints.map((point, idx) => (
                      <li key={idx} className="text-sm">{point}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              <div className="flex justify-between pt-4">
                {!showPriorityExplanation ? (
                  <Button onClick={checkPriorityAnswers} className="bg-[#13294B]" disabled={Object.keys(userPrioritySelections).length !== currentPriorityScenario.conditions.length}>
                    Check Answers
                  </Button>
                ) : (
                  <div className="flex space-x-4 items-center">
                    <div>
                      <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-200 px-3 py-1">
                        Score: {priorityScore}/{currentPriorityScenario.conditions.length}
                      </Badge>
                    </div>
                    <Button onClick={nextPriorityQuestion} className="bg-[#13294B]">
                      {currentPriorityIndex < priorityScenarios.length - 1 ? (
                        <>Next Scenario <ArrowRight className="ml-2 h-4 w-4" /></>
                      ) : (
                        "Complete Activity"
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
          
          {/* ABC Assessment Content */}
          <TabsContent value="abc-scenarios" className="p-6">
            <div className="space-y-6">
              <div className="bg-blue-50 p-4 rounded-md border border-blue-200">
                <div className="flex justify-between">
                  <h3 className="font-bold text-[#13294B] text-lg mb-2">{currentAbcScenario.title}</h3>
                  <Badge variant="outline" className="bg-purple-50 text-purple-800 border-purple-200">
                    <Brain className="mr-1 h-4 w-4" />
                    ABC Assessment Drill
                  </Badge>
                </div>
                <p className="mb-2">{currentAbcScenario.scenario}</p>
              </div>
              
              <div>
                <p className="font-medium mb-3">Select the correct actions in priority order based on the ABC approach:</p>
                <div className="space-y-3">
                  {currentAbcScenario.steps.map((step, index) => (
                    <div key={index} className="relative">
                      <div 
                        className={`border rounded-md p-4 cursor-pointer transition-all ${
                          userAbcSelections.includes(index)
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-blue-300'
                        } ${showAbcExplanation ? 'pointer-events-none' : ''}`}
                        onClick={() => !showAbcExplanation && handleAbcSelect(index)}
                      >
                        <div className="flex items-center">
                          {userAbcSelections.includes(index) && (
                            <div className="h-6 w-6 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center mr-2 font-bold text-sm">
                              {userAbcSelections.indexOf(index) + 1}
                            </div>
                          )}
                          <p>{step.action}</p>
                        </div>
                        
                        {showAbcExplanation && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            transition={{ duration: 0.3 }}
                            className={`mt-3 p-3 rounded-md ${
                              step.isCorrect
                                ? "bg-green-50 border border-green-200"
                                : "bg-red-50 border border-red-200"
                            }`}
                          >
                            <div className="flex items-start">
                              <div className="flex-shrink-0 mt-0.5">
                                {step.isCorrect ? (
                                  <CheckCircle className="h-5 w-5 text-green-600" />
                                ) : (
                                  <AlertTriangle className="h-5 w-5 text-red-600" />
                                )}
                              </div>
                              <div className="ml-3">
                                <p className="text-sm font-medium">
                                  {step.isCorrect ? "Correct Action" : "Incorrect Action"}
                                </p>
                                <p className="text-sm mt-1">{step.explanation}</p>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-between pt-4">
                {!showAbcExplanation ? (
                  <Button 
                    onClick={checkAbcAnswers} 
                    className="bg-[#13294B]"
                    disabled={userAbcSelections.length === 0}
                  >
                    Check Answers
                  </Button>
                ) : (
                  <div className="flex space-x-4 items-center">
                    <div>
                      <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-200 px-3 py-1">
                        Score: {abcScore}/{currentAbcScenario.correctOrder.length}
                      </Badge>
                    </div>
                    <Button onClick={nextAbcScenario} className="bg-[#13294B]">
                      {currentAbcIndex < abcScenarios.length - 1 ? (
                        <>Next Scenario <ArrowRight className="ml-2 h-4 w-4" /></>
                      ) : (
                        "Complete Activity"
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <CardFooter className="bg-gray-50 flex justify-between border-t p-4">
          <div className="flex items-center text-sm text-gray-500">
            <Timer className="h-4 w-4 mr-1" />
            <span>Focus on quick, accurate nursing judgment</span>
          </div>
          <div className="flex items-center">
            <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-200">
              NCLEX Critical Thinking
            </Badge>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
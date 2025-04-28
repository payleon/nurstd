import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, Info, CheckCircle2, XCircle, HelpCircle } from 'lucide-react';

type QuestionType = 'multiple-choice' | 'select-all' | 'fill-blank' | 'hotspot' | 'ordered-response' | 'chart-exhibit';

interface TutorialStep {
  title: string;
  content: React.ReactNode;
  tips?: string[];
}

export function NCLEXTutorial() {
  const [questionType, setQuestionType] = useState<QuestionType>('multiple-choice');
  const [currentStep, setCurrentStep] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, any>>({});
  const [showExplanation, setShowExplanation] = useState(false);
  
  // Define tutorials for each question type
  const tutorials: Record<QuestionType, TutorialStep[]> = {
    'multiple-choice': [
      {
        title: 'Introduction to Multiple Choice Questions',
        content: (
          <div className="space-y-4">
            <p className="text-base">Multiple choice questions are the most common type on the NCLEX. They consist of:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>A stem (the question)</li>
              <li>4 options (possible answers)</li>
              <li>Only one correct answer</li>
            </ul>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="p-4 bg-blue-50 rounded-md border border-blue-200"
            >
              <p className="font-medium text-blue-800">Key Strategy:</p>
              <p className="text-blue-800">Read each question carefully and consider what it's really asking before looking at the options.</p>
            </motion.div>
          </div>
        ),
        tips: [
          'Look for keywords like "first," "best," "most appropriate," or "priority"',
          'Eliminate obviously incorrect options',
          'Apply nursing process: Assessment, Diagnosis, Planning, Implementation, Evaluation'
        ]
      },
      {
        title: 'Try a Multiple Choice Question',
        content: (
          <div className="space-y-4">
            <p className="text-base font-medium">Question:</p>
            <p className="mb-3">A client with type 1 diabetes mellitus has a blood glucose level of 60 mg/dL. Which of the following interventions should the nurse implement first?</p>
            
            <div className="space-y-2">
              {['Administer 10-15 g of carbohydrates', 
                'Administer regular insulin', 
                'Check vital signs', 
                'Notify the healthcare provider'].map((option, index) => (
                <div key={index} className="flex items-start">
                  <div 
                    className={`w-5 h-5 rounded-full border ${
                      userAnswers.multipleChoice === index 
                        ? 'bg-blue-500 border-blue-500' 
                        : 'border-gray-300'
                    } mr-2 flex-shrink-0 mt-1 cursor-pointer`}
                    onClick={() => setUserAnswers({...userAnswers, multipleChoice: index})}
                  />
                  <p>{String.fromCharCode(65 + index)}. {option}</p>
                </div>
              ))}
            </div>
            
            {showExplanation && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-4 bg-green-50 rounded-md border border-green-200"
              >
                <p className="font-medium">Correct Answer: A. Administer 10-15 g of carbohydrates</p>
                <p className="mt-2">Explanation: A blood glucose level of 60 mg/dL indicates hypoglycemia. The priority intervention is to raise the client's blood glucose level by administering 10-15 g of carbohydrates. This is a rapid intervention that addresses the immediate problem. The other options are either inappropriate (giving insulin would worsen hypoglycemia) or not the priority first step.</p>
              </motion.div>
            )}
          </div>
        )
      },
      {
        title: 'Multiple Choice Success Strategies',
        content: (
          <div className="space-y-4">
            <p className="text-base">Remember these strategies when answering multiple choice questions:</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="border-green-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Use the ABCs</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">Prioritize based on Airway, Breathing, Circulation, and Safety first.</p>
                </CardContent>
              </Card>
              
              <Card className="border-green-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Maslow's Hierarchy</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">Physiological needs generally take priority over psychosocial needs.</p>
                </CardContent>
              </Card>
              
              <Card className="border-green-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Look for Themes</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">Group answer choices by theme to help narrow down possibilities.</p>
                </CardContent>
              </Card>
              
              <Card className="border-green-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Watch for Absolutes</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">Be cautious of options with "always" or "never" - they're often incorrect.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        )
      }
    ],
    'select-all': [
      {
        title: 'Introduction to Select All That Apply',
        content: (
          <div className="space-y-4">
            <p className="text-base">Select All That Apply (SATA) questions require you to identify ALL correct options. They are considered more difficult because:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>You must determine multiple correct answers</li>
              <li>There's no partial credit on the NCLEX</li>
              <li>Any combination of options could be correct (from 0 to all options)</li>
            </ul>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="p-4 bg-blue-50 rounded-md border border-blue-200"
            >
              <p className="font-medium text-blue-800">Key Strategy:</p>
              <p className="text-blue-800">Evaluate each option independently against the question, treating each like a true/false statement.</p>
            </motion.div>
          </div>
        )
      },
      {
        title: 'Try a Select All That Apply Question',
        content: (
          <div className="space-y-4">
            <p className="text-base font-medium">Question:</p>
            <p className="mb-3">A nurse is caring for a patient with a diagnosis of heart failure. Which assessment findings should the nurse expect to find? Select all that apply.</p>
            
            <div className="space-y-2">
              {['Pulmonary crackles', 
                'Jugular venous distention', 
                'Decreased blood pressure', 
                'Peripheral edema',
                'Increased urinary output',
                'Productive cough'].map((option, index) => (
                <div key={index} className="flex items-start">
                  <div 
                    className={`w-5 h-5 border ${
                      userAnswers.selectAll?.includes(index) 
                        ? 'bg-blue-500 border-blue-500 flex items-center justify-center' 
                        : 'border-gray-300'
                    } mr-2 flex-shrink-0 mt-1 cursor-pointer`}
                    onClick={() => {
                      const currentSelections = userAnswers.selectAll || [];
                      let newSelections;
                      
                      if (currentSelections.includes(index)) {
                        newSelections = currentSelections.filter((i: number) => i !== index);
                      } else {
                        newSelections = [...currentSelections, index];
                      }
                      
                      setUserAnswers({...userAnswers, selectAll: newSelections});
                    }}
                  >
                    {userAnswers.selectAll?.includes(index) && 
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    }
                  </div>
                  <p>{String.fromCharCode(65 + index)}. {option}</p>
                </div>
              ))}
            </div>
            
            {showExplanation && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-4 bg-green-50 rounded-md border border-green-200"
              >
                <p className="font-medium">Correct Answers: A, B, D, F</p>
                <p className="mt-2">Explanation:</p>
                <ul className="list-disc pl-5 space-y-1 mt-2">
                  <li>Pulmonary crackles: Correct - Fluid buildup in the lungs causes these sounds</li>
                  <li>Jugular venous distention: Correct - Results from increased central venous pressure</li>
                  <li>Decreased blood pressure: Incorrect - HF often causes increased BP or normal BP</li>
                  <li>Peripheral edema: Correct - Fluid retention causes swelling in extremities</li>
                  <li>Increased urinary output: Incorrect - HF causes decreased urinary output</li>
                  <li>Productive cough: Correct - Due to pulmonary congestion</li>
                </ul>
              </motion.div>
            )}
          </div>
        )
      },
      {
        title: 'Select All That Apply Success Strategies',
        content: (
          <div className="space-y-4">
            <p className="text-base">Remember these strategies when answering SATA questions:</p>
            
            <div className="space-y-3">
              <div className="flex">
                <div className="bg-green-100 p-2 mr-4 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium">Consider Each Option Independently</p>
                  <p className="text-sm">Evaluate each option as true or false on its own merit.</p>
                </div>
              </div>
              
              <div className="flex">
                <div className="bg-green-100 p-2 mr-4 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium">Be Thorough</p>
                  <p className="text-sm">Don't stop after finding a few correct answers; carefully evaluate all options.</p>
                </div>
              </div>
              
              <div className="flex">
                <div className="bg-green-100 p-2 mr-4 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium">Don't Assume a "Normal" Number of Answers</p>
                  <p className="text-sm">Any number of options can be correct, from zero to all of them.</p>
                </div>
              </div>
              
              <div className="flex">
                <div className="bg-green-100 p-2 mr-4 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium">Watch for Opposites</p>
                  <p className="text-sm">If two options directly contradict each other, at least one must be incorrect.</p>
                </div>
              </div>
            </div>
          </div>
        )
      }
    ],
    'fill-blank': [
      {
        title: 'Introduction to Fill-in-the-Blank Questions',
        content: (
          <div className="space-y-4">
            <p className="text-base">Fill-in-the-blank questions require you to calculate a numerical answer. On the NCLEX, these questions usually involve:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Medication dosage calculations</li>
              <li>IV drip rate calculations</li>
              <li>Intake and output calculations</li>
              <li>Other mathematical nursing tasks</li>
            </ul>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="p-4 bg-blue-50 rounded-md border border-blue-200"
            >
              <p className="font-medium text-blue-800">Key Strategy:</p>
              <p className="text-blue-800">Double-check your work, especially unit conversions. Make sure your answer is in the requested unit of measurement.</p>
            </motion.div>
          </div>
        ),
        tips: [
          'Create a systematic approach to solving dosage calculations',
          'Always include the unit of measurement if appropriate',
          'Break complex problems into simpler steps',
          'Pay attention to rounding instructions'
        ]
      },
      {
        title: 'Try a Fill-in-the-Blank Question',
        content: (
          <div className="space-y-4">
            <p className="text-base font-medium">Question:</p>
            <p className="mb-3">The healthcare provider orders morphine sulfate 4 mg IV. The medication label reads 2 mg/mL. How many mL should the nurse administer?</p>
            
            <div className="flex items-center">
              <input 
                type="text" 
                className="border border-gray-300 rounded-md px-3 py-2 w-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={userAnswers.fillBlank || ''}
                onChange={(e) => setUserAnswers({...userAnswers, fillBlank: e.target.value})}
              />
              <span className="ml-2">mL</span>
            </div>
            
            {showExplanation && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-4 bg-green-50 rounded-md border border-green-200"
              >
                <p className="font-medium">Correct Answer: 2 mL</p>
                <p className="mt-2">Explanation:</p>
                <p className="mt-1">We use the formula: Dose ordered ÷ Dose on hand = Volume to administer</p>
                <div className="bg-white p-3 rounded border border-gray-200 mt-2">
                  <p>4 mg ÷ 2 mg/mL = 2 mL</p>
                </div>
                <p className="mt-2">Therefore, the nurse should administer 2 mL of the morphine solution.</p>
              </motion.div>
            )}
          </div>
        )
      },
      {
        title: 'Common Medication Calculation Formulas',
        content: (
          <div className="space-y-4">
            <p className="text-base">Here are essential formulas for medication calculations:</p>
            
            <div className="grid grid-cols-1 gap-4">
              <Card className="border-blue-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Basic Dose Formula</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-white p-3 rounded border border-gray-200">
                    <p className="font-medium">Dose ordered ÷ Dose on hand = Volume to administer</p>
                  </div>
                  <p className="text-sm mt-2">Example: 50 mg ordered, 25 mg/mL available</p>
                  <p className="text-sm">50 mg ÷ 25 mg/mL = 2 mL</p>
                </CardContent>
              </Card>
              
              <Card className="border-blue-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">IV Flow Rate (in drops/min)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-white p-3 rounded border border-gray-200">
                    <p className="font-medium">Total volume (mL) × Drop factor (gtt/mL) ÷ Time (minutes) = Flow rate (gtt/min)</p>
                  </div>
                  <p className="text-sm mt-2">Example: 1000 mL over 8 hours with a drop factor of 15 gtt/mL</p>
                  <p className="text-sm">1000 mL × 15 gtt/mL ÷ (8 × 60 min) = 31.25 or 31 gtt/min</p>
                </CardContent>
              </Card>
              
              <Card className="border-blue-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Weight-Based Calculations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-white p-3 rounded border border-gray-200">
                    <p className="font-medium">Dose ordered × Patient weight (kg) = Total dose</p>
                  </div>
                  <p className="text-sm mt-2">Example: 5 mg/kg ordered for a 60 kg patient</p>
                  <p className="text-sm">5 mg/kg × 60 kg = 300 mg</p>
                </CardContent>
              </Card>
            </div>
          </div>
        )
      }
    ],
    'hotspot': [
      {
        title: 'Introduction to Hot Spot Questions',
        content: (
          <div className="space-y-4">
            <p className="text-base">Hot spot questions require you to identify a specific location on an image by clicking on it. These questions test:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Anatomical knowledge</li>
              <li>Proper placement of medical devices</li>
              <li>Physical assessment locations</li>
              <li>Interpreting medical imagery</li>
            </ul>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="p-4 bg-blue-50 rounded-md border border-blue-200"
            >
              <p className="font-medium text-blue-800">Key Strategy:</p>
              <p className="text-blue-800">Read the question carefully to understand exactly what location you're being asked to identify.</p>
            </motion.div>
          </div>
        )
      },
      {
        title: 'Try a Hot Spot Question',
        content: (
          <div className="space-y-4">
            <p className="text-base font-medium">Question:</p>
            <p className="mb-3">Identify the area where the nurse should auscultate to best assess the mitral valve.</p>
            
            <div className="relative w-full h-64 bg-blue-50 border border-gray-300 rounded-md overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-48 h-72 bg-slate-200 rounded-t-full">
                  {/* Stylized chest diagram */}
                  <div className="absolute w-full h-1/2 border-b border-slate-400 top-1/4"></div>
                  <div className="absolute w-1/2 h-3/4 border-r border-slate-400 left-0 top-1/4"></div>
                  
                  {/* Heart landmark areas */}
                  <div 
                    className="absolute w-6 h-6 rounded-full cursor-pointer hover:bg-blue-200 transition-colors"
                    style={{ top: '40%', left: '30%' }}
                    onClick={() => setUserAnswers({...userAnswers, hotspot: 'aortic'})}
                  >
                    {userAnswers.hotspot === 'aortic' && (
                      <div className="absolute inset-0 bg-red-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">1</span>
                      </div>
                    )}
                  </div>
                  
                  <div 
                    className="absolute w-6 h-6 rounded-full cursor-pointer hover:bg-blue-200 transition-colors"
                    style={{ top: '40%', left: '60%' }}
                    onClick={() => setUserAnswers({...userAnswers, hotspot: 'pulmonic'})}
                  >
                    {userAnswers.hotspot === 'pulmonic' && (
                      <div className="absolute inset-0 bg-red-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">2</span>
                      </div>
                    )}
                  </div>
                  
                  <div 
                    className="absolute w-6 h-6 rounded-full cursor-pointer hover:bg-blue-200 transition-colors"
                    style={{ top: '55%', left: '60%' }}
                    onClick={() => setUserAnswers({...userAnswers, hotspot: 'tricuspid'})}
                  >
                    {userAnswers.hotspot === 'tricuspid' && (
                      <div className="absolute inset-0 bg-red-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">3</span>
                      </div>
                    )}
                  </div>
                  
                  <div 
                    className="absolute w-6 h-6 rounded-full cursor-pointer hover:bg-blue-200 transition-colors"
                    style={{ top: '55%', left: '30%' }}
                    onClick={() => setUserAnswers({...userAnswers, hotspot: 'mitral'})}
                  >
                    {userAnswers.hotspot === 'mitral' && (
                      <div className="absolute inset-0 bg-red-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">4</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <p className="text-center text-sm text-gray-500">Click on the area where you would auscultate the mitral valve.</p>
            
            {showExplanation && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-4 bg-green-50 rounded-md border border-green-200"
              >
                <p className="font-medium">Correct Answer: Position 4 (Fifth intercostal space at the midclavicular line)</p>
                <p className="mt-2">Explanation: The mitral valve is best auscultated at the fifth intercostal space at the midclavicular line, also known as the apical area or the apex of the heart. This is where the sound of blood flowing through the mitral valve is most clearly heard during auscultation.</p>
                <div className="mt-3">
                  <p className="text-sm font-medium">Heart Valve Auscultation Locations:</p>
                  <ul className="list-disc pl-5 text-sm">
                    <li>Aortic valve (Position 1): Second intercostal space, right sternal border</li>
                    <li>Pulmonic valve (Position 2): Second intercostal space, left sternal border</li>
                    <li>Tricuspid valve (Position 3): Fourth intercostal space, left sternal border</li>
                    <li>Mitral valve (Position 4): Fifth intercostal space, midclavicular line</li>
                  </ul>
                </div>
              </motion.div>
            )}
          </div>
        )
      },
      {
        title: 'Hot Spot Success Strategies',
        content: (
          <div className="space-y-4">
            <p className="text-base">When answering hot spot questions, keep these strategies in mind:</p>
            
            <div className="space-y-3">
              <div className="flex">
                <div className="bg-blue-100 p-2 mr-4 rounded-full flex items-center justify-center flex-shrink-0">
                  <Info className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">Know Anatomical Landmarks</p>
                  <p className="text-sm">Understand basic anatomical landmarks like intercostal spaces, abdominal quadrants, and dermatomes.</p>
                </div>
              </div>
              
              <div className="flex">
                <div className="bg-blue-100 p-2 mr-4 rounded-full flex items-center justify-center flex-shrink-0">
                  <Info className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">Be Precise</p>
                  <p className="text-sm">Click exactly where the question asks - precision matters for these questions.</p>
                </div>
              </div>
              
              <div className="flex">
                <div className="bg-blue-100 p-2 mr-4 rounded-full flex items-center justify-center flex-shrink-0">
                  <Info className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">Study Visual References</p>
                  <p className="text-sm">Practice with anatomical diagrams to build visual recognition skills.</p>
                </div>
              </div>
              
              <div className="flex">
                <div className="bg-blue-100 p-2 mr-4 rounded-full flex items-center justify-center flex-shrink-0">
                  <Info className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">Review Common Hot Spot Topics</p>
                  <p className="text-sm">Focus on cardiac landmarks, abdomen assessment, lung fields, and injection sites.</p>
                </div>
              </div>
            </div>
          </div>
        )
      }
    ],
    'ordered-response': [
      {
        title: 'Introduction to Ordered Response Questions',
        content: (
          <div className="space-y-4">
            <p className="text-base">Ordered response questions (also called drag-and-drop) require you to arrange steps or actions in the correct sequence. These questions test:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Procedural knowledge</li>
              <li>Prioritization skills</li>
              <li>Understanding of care sequences</li>
              <li>Critical thinking about nursing processes</li>
            </ul>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="p-4 bg-blue-50 rounded-md border border-blue-200"
            >
              <p className="font-medium text-blue-800">Key Strategy:</p>
              <p className="text-blue-800">Use principles like airway-breathing-circulation, Maslow's hierarchy, and the nursing process to determine proper sequencing.</p>
            </motion.div>
          </div>
        )
      },
      {
        title: 'Try an Ordered Response Question',
        content: (
          <div className="space-y-4">
            <p className="text-base font-medium">Question:</p>
            <p className="mb-3">Place the following steps for inserting a urinary catheter in the correct order:</p>
            
            <div className="space-y-2">
              {[
                'Clean the urethral meatus',
                'Inflate the balloon',
                'Perform hand hygiene',
                'Insert the catheter',
                'Apply sterile drapes'
              ].map((step, index) => (
                <div 
                  key={index} 
                  className="p-3 bg-gray-50 border border-gray-300 rounded-md cursor-pointer flex justify-between items-center"
                  onClick={() => {
                    const currentOrder = [...(userAnswers.orderedResponse || [])];
                    if (currentOrder.includes(index)) {
                      // Remove if already in the list
                      const newOrder = currentOrder.filter(i => i !== index);
                      setUserAnswers({...userAnswers, orderedResponse: newOrder});
                    } else {
                      // Add to the list
                      setUserAnswers({...userAnswers, orderedResponse: [...currentOrder, index]});
                    }
                  }}
                >
                  <span>{step}</span>
                  {userAnswers.orderedResponse?.includes(index) && (
                    <span className="bg-blue-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">
                      {userAnswers.orderedResponse.indexOf(index) + 1}
                    </span>
                  )}
                </div>
              ))}
            </div>
            
            {showExplanation && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-4 bg-green-50 rounded-md border border-green-200"
              >
                <p className="font-medium">Correct Order:</p>
                <ol className="list-decimal pl-5 space-y-1 mt-2">
                  <li>Perform hand hygiene</li>
                  <li>Apply sterile drapes</li>
                  <li>Clean the urethral meatus</li>
                  <li>Insert the catheter</li>
                  <li>Inflate the balloon</li>
                </ol>
                <p className="mt-3">Explanation: This sequence follows the proper order of a sterile procedure for urinary catheterization. Always start with hand hygiene, then establish the sterile field with drapes, clean the area, perform the procedure (insertion), and finally secure the catheter by inflating the balloon.</p>
              </motion.div>
            )}
          </div>
        )
      },
      {
        title: 'Ordered Response Success Strategies',
        content: (
          <div className="space-y-4">
            <p className="text-base">When answering ordered response questions, remember these frameworks for prioritization:</p>
            
            <div className="grid grid-cols-1 gap-4">
              <Card className="border-purple-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Nursing Process</CardTitle>
                </CardHeader>
                <CardContent>
                  <ol className="list-decimal pl-5 space-y-1">
                    <li>Assessment</li>
                    <li>Diagnosis</li>
                    <li>Planning</li>
                    <li>Implementation</li>
                    <li>Evaluation</li>
                  </ol>
                </CardContent>
              </Card>
              
              <Card className="border-purple-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">ABC Priority Framework</CardTitle>
                </CardHeader>
                <CardContent>
                  <ol className="list-decimal pl-5 space-y-1">
                    <li>Airway</li>
                    <li>Breathing</li>
                    <li>Circulation</li>
                    <li>Disability</li>
                    <li>Exposure</li>
                  </ol>
                </CardContent>
              </Card>
              
              <Card className="border-purple-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Procedural Logic</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>General to specific</li>
                    <li>Clean to dirty</li>
                    <li>Proximal to distal</li>
                    <li>Preparation before action</li>
                    <li>Assessment before intervention</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        )
      }
    ],
    'chart-exhibit': [
      {
        title: 'Introduction to Chart/Exhibit Questions',
        content: (
          <div className="space-y-4">
            <p className="text-base">Chart/Exhibit questions require you to analyze information from a chart, lab results, or other clinical data before answering. These questions test:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Critical thinking and clinical judgment</li>
              <li>Data interpretation skills</li>
              <li>Understanding of normal vs. abnormal findings</li>
              <li>Ability to prioritize interventions based on data</li>
            </ul>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="p-4 bg-blue-50 rounded-md border border-blue-200"
            >
              <p className="font-medium text-blue-800">Key Strategy:</p>
              <p className="text-blue-800">Carefully read and analyze all the information provided before making a decision. Focus on abnormal findings.</p>
            </motion.div>
          </div>
        )
      },
      {
        title: 'Try a Chart/Exhibit Question',
        content: (
          <div className="space-y-4">
            <p className="text-base font-medium">Question:</p>
            <p className="mb-3">Refer to the following lab results for a 72-year-old patient:</p>
            
            <div className="p-4 bg-white border border-gray-300 rounded-md mb-4">
              <p className="font-bold mb-2">Laboratory Results</p>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left pb-2">Test</th>
                    <th className="text-left pb-2">Result</th>
                    <th className="text-left pb-2">Reference Range</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-200">
                    <td className="py-2">Sodium</td>
                    <td className="py-2">134 mEq/L</td>
                    <td className="py-2 text-gray-600">135-145 mEq/L</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-2">Potassium</td>
                    <td className="py-2 text-red-600 font-bold">3.0 mEq/L</td>
                    <td className="py-2 text-gray-600">3.5-5.0 mEq/L</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-2">Chloride</td>
                    <td className="py-2">98 mEq/L</td>
                    <td className="py-2 text-gray-600">96-106 mEq/L</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-2">BUN</td>
                    <td className="py-2">22 mg/dL</td>
                    <td className="py-2 text-gray-600">7-20 mg/dL</td>
                  </tr>
                  <tr>
                    <td className="py-2">Creatinine</td>
                    <td className="py-2">1.1 mg/dL</td>
                    <td className="py-2 text-gray-600">0.6-1.2 mg/dL</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <p className="mb-3">Which lab value requires immediate nursing intervention?</p>
            <div className="space-y-2">
              {['Sodium', 'Potassium', 'Chloride', 'BUN'].map((option, index) => (
                <div key={index} className="flex items-start">
                  <div 
                    className={`w-5 h-5 rounded-full border ${
                      userAnswers.chartExhibit === index 
                        ? 'bg-blue-500 border-blue-500' 
                        : 'border-gray-300'
                    } mr-2 flex-shrink-0 mt-1 cursor-pointer`}
                    onClick={() => setUserAnswers({...userAnswers, chartExhibit: index})}
                  />
                  <p>{String.fromCharCode(65 + index)}. {option}</p>
                </div>
              ))}
            </div>
            
            {showExplanation && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-4 bg-green-50 rounded-md border border-green-200"
              >
                <p className="font-medium">Correct Answer: B. Potassium</p>
                <p className="mt-2">Explanation: The patient's potassium level is 3.0 mEq/L, which is below the normal range of 3.5-5.0 mEq/L. This indicates hypokalemia, which requires immediate attention because low potassium can lead to cardiac arrhythmias and muscle weakness. While the sodium is slightly low and BUN is slightly elevated, the potassium level presents the most immediate concern.</p>
                <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                  <p className="text-sm font-medium">Potential complications of hypokalemia include:</p>
                  <ul className="list-disc pl-5 text-sm mt-1">
                    <li>Cardiac arrhythmias</li>
                    <li>Muscle weakness and cramps</li>
                    <li>Fatigue</li>
                    <li>Paralysis</li>
                    <li>Respiratory depression</li>
                  </ul>
                </div>
              </motion.div>
            )}
          </div>
        )
      },
      {
        title: 'Chart/Exhibit Success Strategies',
        content: (
          <div className="space-y-4">
            <p className="text-base">When approaching chart/exhibit questions, use these strategies:</p>
            
            <div className="space-y-3">
              <div className="flex">
                <div className="bg-purple-100 p-2 mr-4 rounded-full flex items-center justify-center flex-shrink-0">
                  <HelpCircle className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium">Look for Abnormal Values First</p>
                  <p className="text-sm">Identify values outside the reference range - they're usually the key to the question.</p>
                </div>
              </div>
              
              <div className="flex">
                <div className="bg-purple-100 p-2 mr-4 rounded-full flex items-center justify-center flex-shrink-0">
                  <HelpCircle className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium">Consider the Patient's Condition</p>
                  <p className="text-sm">Relate lab values to the patient's underlying health issues and risk factors.</p>
                </div>
              </div>
              
              <div className="flex">
                <div className="bg-purple-100 p-2 mr-4 rounded-full flex items-center justify-center flex-shrink-0">
                  <HelpCircle className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium">Look for Patterns</p>
                  <p className="text-sm">Multiple abnormal values might indicate a specific condition or syndrome.</p>
                </div>
              </div>
              
              <div className="flex">
                <div className="bg-purple-100 p-2 mr-4 rounded-full flex items-center justify-center flex-shrink-0">
                  <HelpCircle className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium">Know Your Critical Values</p>
                  <p className="text-sm">Memorize ranges that require immediate intervention vs. those that need monitoring.</p>
                </div>
              </div>
              
              <div className="flex">
                <div className="bg-purple-100 p-2 mr-4 rounded-full flex items-center justify-center flex-shrink-0">
                  <HelpCircle className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium">Prioritize Life-Threatening Issues</p>
                  <p className="text-sm">Focus on values that could lead to immediate physiological compromise.</p>
                </div>
              </div>
            </div>
          </div>
        )
      }
    ]
  };
  
  // Get current tutorial steps based on question type
  const currentTutorial = tutorials[questionType] || [];
  const totalSteps = currentTutorial.length;
  
  // Reset user answers when changing question type
  const handleQuestionTypeChange = (type: QuestionType) => {
    setQuestionType(type);
    setCurrentStep(0);
    setUserAnswers({});
    setShowExplanation(false);
  };
  
  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
      setShowExplanation(false);
    }
  };
  
  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setShowExplanation(false);
    }
  };
  
  const handleShowExplanation = () => {
    setShowExplanation(true);
  };
  
  return (
    <div className="w-full max-w-5xl mx-auto">
      <Tabs defaultValue="multiple-choice" className="w-full" onValueChange={(value) => handleQuestionTypeChange(value as QuestionType)}>
        <TabsList className="mb-6 flex flex-wrap">
          <TabsTrigger value="multiple-choice" className="mr-1 mb-1">Multiple Choice</TabsTrigger>
          <TabsTrigger value="select-all" className="mr-1 mb-1">Select All That Apply</TabsTrigger>
          <TabsTrigger value="fill-blank" className="mr-1 mb-1">Fill-in-the-Blank</TabsTrigger>
          <TabsTrigger value="hotspot" className="mr-1 mb-1">Hot Spot</TabsTrigger>
          <TabsTrigger value="ordered-response" className="mr-1 mb-1">Ordered Response</TabsTrigger>
          <TabsTrigger value="chart-exhibit" className="mr-1 mb-1">Chart/Exhibit</TabsTrigger>
        </TabsList>
        
        {Object.keys(tutorials).map((type) => (
          <TabsContent key={type} value={type} className="w-full">
            <Card className="w-full bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <CardHeader className="border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>
                      {type === 'multiple-choice' && 'Multiple Choice Questions'}
                      {type === 'select-all' && 'Select All That Apply Questions'}
                      {type === 'fill-blank' && 'Fill-in-the-Blank Questions'}
                      {type === 'hotspot' && 'Hot Spot Questions'}
                      {type === 'ordered-response' && 'Ordered Response Questions'}
                      {type === 'chart-exhibit' && 'Chart/Exhibit Questions'}
                    </CardTitle>
                    <CardDescription>
                      Step {currentStep + 1} of {totalSteps}: {currentTutorial[currentStep]?.title}
                    </CardDescription>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handlePrev}
                      disabled={currentStep === 0}
                    >
                      <ArrowLeft className="mr-1 h-4 w-4" />
                      Previous
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleNext}
                      disabled={currentStep === totalSteps - 1}
                    >
                      Next
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${questionType}-${currentStep}`}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    {currentTutorial[currentStep]?.content}
                  </motion.div>
                </AnimatePresence>
                
                {currentTutorial[currentStep]?.tips && (
                  <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                    <p className="font-medium mb-2">Tips:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      {currentTutorial[currentStep]?.tips?.map((tip, index) => (
                        <li key={index}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
              
              {currentStep === 1 && !showExplanation && (
                <CardFooter className="border-t border-gray-200 flex justify-center">
                  <Button 
                    onClick={handleShowExplanation}
                    className="mt-4"
                  >
                    Check Answer & Show Explanation
                  </Button>
                </CardFooter>
              )}
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
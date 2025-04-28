import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { 
  AlarmClock, 
  X, 
  Clock, 
  Brain, 
  BookOpen, 
  FileText, 
  Check, 
  PlayCircle, 
  Sparkles,
  Lightbulb
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface StudyTimerOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

// Study focus areas
const studyAreas = [
  { value: "medical-surgical", label: "Medical-Surgical", icon: "🏥" },
  { value: "fundamentals", label: "Fundamentals", icon: "📚" },
  { value: "pharmacology", label: "Pharmacology", icon: "💊" },
  { value: "pediatrics", label: "Pediatrics", icon: "👶" },
  { value: "obstetrics", label: "Obstetrics", icon: "🤰" },
  { value: "mental-health", label: "Mental Health", icon: "🧠" },
];

// Duration options
const durationOptions = [
  { value: 10, label: "10 minutes (Quick Review)" },
  { value: 15, label: "15 minutes (Short Session)" },
  { value: 25, label: "25 minutes (Pomodoro)" },
  { value: 30, label: "30 minutes (Focused Work)" },
  { value: 45, label: "45 minutes (Deep Study)" },
  { value: 60, label: "60 minutes (Full Session)" },
];

export function StudyTimerOverlay({ isOpen, onClose }: StudyTimerOverlayProps) {
  const [, setLocation] = useLocation();
  const [duration, setDuration] = useState<number>(25);
  const [focusArea, setFocusArea] = useState<string>("medical-surgical");
  const [energy, setEnergy] = useState<number>(75);
  const [studyPlan, setStudyPlan] = useState<string[]>([]);
  const [animate, setAnimate] = useState(false);
  const { toast } = useToast();

  // Handle study area change
  const handleAreaChange = (value: string) => {
    setFocusArea(value);
    generateStudyPlan(duration, value, energy);
  };

  // Handle duration change
  const handleDurationChange = (value: string) => {
    setDuration(parseInt(value, 10));
    generateStudyPlan(parseInt(value, 10), focusArea, energy);
  };

  // Handle energy level change
  const handleEnergyChange = (value: number[]) => {
    setEnergy(value[0]);
    generateStudyPlan(duration, focusArea, value[0]);
  };

  // Generate a study plan based on the selected duration, area, and energy level
  const generateStudyPlan = (duration: number, area: string, energy: number) => {
    const plans: Record<string, Record<string, string[]>> = {
      "medical-surgical": {
        "high": [
          "Review complex cardiac disease concepts",
          "Practice respiratory disorder questions",
          "Create a mind map of shock classifications",
          "Summarize fluid & electrolyte imbalances"
        ],
        "medium": [
          "Review basic cardiac rhythm strips",
          "Practice NCLEX-style med-surg questions",
          "Review common surgical complications",
          "Study common lab value abnormalities"
        ],
        "low": [
          "Watch a short video on cardiac function",
          "Review flashcards on basic concepts",
          "Read a summary of common conditions",
          "Take short quiz on core concepts"
        ]
      },
      "fundamentals": {
        "high": [
          "Practice nursing process application",
          "Study advanced infection control protocols",
          "Create concept maps for patient assessment",
          "Review complex care planning scenarios"
        ],
        "medium": [
          "Practice vital sign interpretation",
          "Review nursing care procedures",
          "Study patient safety protocols",
          "Take practice questions on fundamentals"
        ],
        "low": [
          "Review basic nursing terminology",
          "Watch a video on nursing assessments",
          "Study simple care procedures",
          "Review nursing ethics principles"
        ]
      },
      "pharmacology": {
        "high": [
          "Practice drug calculations and conversions",
          "Study high-risk medications in detail",
          "Review drug interactions for common medications",
          "Create a comparison chart of similar drug classes"
        ],
        "medium": [
          "Review common drug classifications",
          "Practice identifying medication side effects",
          "Study medication administration procedures",
          "Take practice questions on pharmacology"
        ],
        "low": [
          "Review basic medication terminology",
          "Match medications to their common uses",
          "Watch a video on safe medication administration",
          "Study the top 20 most common medications"
        ]
      },
      "pediatrics": {
        "high": [
          "Review complex pediatric diseases",
          "Study pediatric dosage calculations",
          "Practice developmental assessment scenarios",
          "Review pediatric emergency protocols"
        ],
        "medium": [
          "Study normal pediatric development milestones",
          "Review common childhood illnesses",
          "Practice pediatric assessment techniques",
          "Take practice questions on pediatrics"
        ],
        "low": [
          "Review basic pediatric vital sign ranges",
          "Watch a video on pediatric assessment",
          "Study simple childhood disease management",
          "Review family-centered care principles"
        ]
      },
      "obstetrics": {
        "high": [
          "Review complicated pregnancy scenarios",
          "Study obstetric emergencies in detail",
          "Practice fetal monitoring interpretation",
          "Review postpartum complications"
        ],
        "medium": [
          "Study normal labor stages and assessments",
          "Review routine antepartum care",
          "Practice basic fetal heart rate interpretation",
          "Take practice questions on obstetrics"
        ],
        "low": [
          "Review basic pregnancy terminology",
          "Watch a video on normal delivery process",
          "Study simple pregnancy complications",
          "Review newborn care basics"
        ]
      },
      "mental-health": {
        "high": [
          "Practice complex therapeutic communication",
          "Study severe psychiatric disorders in detail",
          "Review psychopharmacology and interactions",
          "Analyze complex patient behavior scenarios"
        ],
        "medium": [
          "Study common psychiatric disorders",
          "Review mental health assessment techniques",
          "Practice therapeutic communication skills",
          "Take practice questions on mental health"
        ],
        "low": [
          "Review basic psychiatric terminology",
          "Watch a video on mental health assessment",
          "Study simple therapeutic communication techniques",
          "Review mental health medication categories"
        ]
      }
    };

    // Determine energy level category
    let energyLevel = "medium";
    if (energy > 70) energyLevel = "high";
    else if (energy < 40) energyLevel = "low";

    // Get relevant study plan for the area and energy level
    const relevantPlans = plans[area]?.[energyLevel] || plans["medical-surgical"]["medium"];
    
    // Adapt plan based on duration
    let planCount = 2; // Default for 25-30 mins
    if (duration <= 15) planCount = 1;
    else if (duration >= 45) planCount = 3;
    
    // Shuffle and select appropriate number of items
    const shuffled = [...relevantPlans].sort(() => 0.5 - Math.random());
    setStudyPlan(shuffled.slice(0, planCount));
  };

  // Start study session
  const startSession = () => {
    toast({
      title: "Study Session Started",
      description: `${duration}-minute session on ${studyAreas.find(a => a.value === focusArea)?.label}. Good luck!`,
    });
    
    // Animate the button before redirecting
    setAnimate(true);
    setTimeout(() => {
      setLocation("/study-timer");
      onClose();
      setAnimate(false);
    }, 800);
  };

  // Generate study plan when component mounts
  useEffect(() => {
    if (isOpen) {
      generateStudyPlan(duration, focusArea, energy);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay Background */}
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center"
        onClick={onClose}
      >
        {/* Overlay Content */}
        <div 
          className="bg-white rounded-xl shadow-2xl w-11/12 max-w-xl overflow-auto max-h-[90vh] border-2 border-[#13294B]"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#13294B] to-[#4B9CD3] p-4 flex justify-between items-center text-white">
            <div className="flex items-center">
              <AlarmClock className="h-6 w-6 mr-2" />
              <h2 className="text-xl font-bold">Study Session Planner</h2>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-white hover:bg-blue-800/50" 
              onClick={onClose}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          {/* Body */}
          <div className="p-4 space-y-4">
            {/* Session Duration */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="font-medium flex items-center">
                  <Clock className="mr-2 h-5 w-5 text-blue-600" />
                  Session Duration
                </label>
                <Badge variant="outline" className="ml-2 px-2 py-1 font-semibold">
                  {duration} minutes
                </Badge>
              </div>
              <Select
                value={duration.toString()}
                onValueChange={handleDurationChange}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  {durationOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value.toString()}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Study Area */}
            <div className="space-y-2">
              <label className="font-medium flex items-center">
                <BookOpen className="mr-2 h-5 w-5 text-blue-600" />
                Focus Area
              </label>
              <div className="grid grid-cols-3 gap-1">
                {studyAreas.map((area) => (
                  <div
                    key={area.value}
                    className={`p-2 border rounded-lg cursor-pointer text-center transition-all ${
                      focusArea === area.value 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                    onClick={() => handleAreaChange(area.value)}
                  >
                    <div className="text-lg">{area.icon}</div>
                    <div className="text-xs font-medium">{area.label}</div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Energy Level */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="font-medium flex items-center">
                  <Brain className="mr-2 h-5 w-5 text-blue-600" />
                  Current Energy Level
                </label>
                <div className="flex items-center">
                  <div className={`
                    text-sm font-semibold px-2 py-0.5 rounded-full
                    ${energy > 70 ? 'bg-green-100 text-green-800' : 
                      energy > 40 ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-red-100 text-red-800'}
                  `}>
                    {energy > 70 ? 'High Energy' : 
                     energy > 40 ? 'Medium Energy' : 
                     'Low Energy'}
                  </div>
                </div>
              </div>
              <div className="py-4 px-2">
                <Slider 
                  defaultValue={[75]} 
                  max={100} 
                  step={5}
                  value={[energy]}
                  onValueChange={handleEnergyChange}
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Low</span>
                  <span>Medium</span>
                  <span>High</span>
                </div>
              </div>
            </div>
            
            {/* Recommended Study Plan */}
            <div className="space-y-2 border-t border-gray-200 pt-4">
              <h3 className="font-medium flex items-center">
                <FileText className="mr-2 h-5 w-5 text-blue-600" />
                Recommended Study Plan
              </h3>
              <div className="bg-blue-50 rounded-lg p-4 space-y-2">
                {studyPlan.map((item, index) => (
                  <div key={index} className="flex items-start">
                    <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <p className="ml-2 text-sm text-gray-800">{item}</p>
                  </div>
                ))}
                <div className="flex items-start pt-2">
                  <Lightbulb className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
                  <p className="ml-2 text-sm text-gray-600 italic">
                    Adjust energy level and duration for personalized recommendations.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Footer */}
          <div className="border-t border-gray-200 p-4 flex justify-between items-center bg-gray-50">
            <div className="flex items-center text-sm text-gray-600">
              <Sparkles className="h-4 w-4 mr-1 text-yellow-500" />
              <span>Complete to earn focus badges!</span>
            </div>
            <Button
              className={`bg-blue-600 hover:bg-blue-700 text-white ${animate ? 'animate-pulse' : ''}`}
              onClick={startSession}
            >
              <PlayCircle className="mr-2 h-5 w-5" />
              Start Session
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
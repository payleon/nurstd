import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Check, BookOpen, Brain, Lightbulb, Target, Calendar, Clock, Star } from 'lucide-react';
import { ProgressIndicator } from '@/components/ui/progress-indicator';
import { shuffleArray } from '@/lib/utils';
import { useStudyProgress } from '@/hooks/useStudyProgress';

// Define types for recommendations
interface Recommendation {
  id: string;
  title: string;
  description: string;
  category: string;
  completed: boolean;
}

// Define study tips
const STUDY_TIPS = [
  {
    id: 'tip1',
    title: 'Practice Questions Daily',
    description: 'Complete at least 50-75 practice questions daily to improve test-taking skills and identify knowledge gaps.',
    category: 'technique',
  },
  {
    id: 'tip2',
    title: 'Review ALL Rationales',
    description: 'Study the rationales for both correct and incorrect answers to understand the thinking process behind each question.',
    category: 'technique',
  },
  {
    id: 'tip3',
    title: 'Create Study Groups',
    description: 'Form a small study group to discuss complex concepts and challenge each other with practice questions.',
    category: 'technique',
  },
  {
    id: 'tip4',
    title: 'Use Visualization Techniques',
    description: 'Create concept maps, diagrams, or flowcharts to visualize complex processes and relationships between concepts.',
    category: 'technique',
  },
  {
    id: 'tip5',
    title: 'Take Scheduled Breaks',
    description: 'Implement the Pomodoro technique: 25 minutes of focused study followed by a 5-minute break to maintain concentration.',
    category: 'planning',
  },
  {
    id: 'tip6',
    title: 'Create a Realistic Schedule',
    description: 'Develop a study plan with specific daily goals but build in flexibility for unexpected life events.',
    category: 'planning',
  },
  {
    id: 'tip7',
    title: 'Focus on Understanding Rationales',
    description: 'Always review the rationale for every question, even ones you got right, to reinforce your knowledge and critical thinking.',
    category: 'technique',
  },
  {
    id: 'tip8',
    title: 'Utilize the NCLEX Test Plan',
    description: 'Study the official NCLEX test plan to understand the exam\'s structure and focus your preparation appropriately.',
    category: 'planning',
  },
  {
    id: 'tip9',
    title: 'Simulate Test Day Conditions',
    description: 'Take practice tests under timed conditions in a quiet environment to build testing endurance and reduce anxiety.',
    category: 'planning',
  },
  {
    id: 'tip10',
    title: 'Prioritize Client Safety',
    description: 'When answering questions, remember that safety is the top priority in nursing care. Apply Maslow\'s hierarchy and the ABC framework.',
    category: 'content',
  },
  {
    id: 'tip11',
    title: 'Master Lab Values',
    description: 'Know normal ranges for common lab values and understand the clinical significance of abnormal results.',
    category: 'content',
  },
  {
    id: 'tip12',
    title: 'Study Pharmacology Systematically',
    description: 'Group medications by class, focusing on mechanisms of action, side effects, and nursing implications rather than memorizing every drug.',
    category: 'content',
  },
];

// Define strategies for passing the NCLEX
const NCLEX_FORMULA = [
  { 
    title: "Content Mastery", 
    description: "Build a solid foundation of nursing knowledge across all specialties.",
    icon: <BookOpen className="h-5 w-5 text-blue-600" />
  },
  { 
    title: "Critical Thinking", 
    description: "Learn to analyze situations and apply nursing knowledge to make clinical judgments.",
    icon: <Brain className="h-5 w-5 text-indigo-600" />
  },
  { 
    title: "Test-Taking Strategy", 
    description: "Understand question structure and eliminate answer choices methodically.",
    icon: <Lightbulb className="h-5 w-5 text-amber-600" />
  },
  { 
    title: "Question Practice", 
    description: "Complete at least 2,000 practice questions before your exam date.",
    icon: <Target className="h-5 w-5 text-red-600" />
  },
  { 
    title: "Consistent Schedule", 
    description: "Study regularly and build stamina for the 5-hour exam experience.",
    icon: <Calendar className="h-5 w-5 text-green-600" />
  },
  { 
    title: "Time Management", 
    description: "Spend 1-2 minutes per question and learn when to move on.",
    icon: <Clock className="h-5 w-5 text-purple-600" />
  },
];

// Official NCLEX resources
const OFFICIAL_RESOURCES = [
  {
    name: "NCSBN NCLEX Practice Exam",
    description: "Official practice questions from the exam creators",
    url: "https://www.ncsbn.org/exams/nclex-exam/prepare.page"
  },
  {
    name: "NCSBN NCLEX Test Plan",
    description: "Detailed breakdown of exam content and structure",
    url: "https://www.ncsbn.org/exams/nclex-exam/nclex-rn-test-plan.page"
  },
  {
    name: "NCSBN Learning Extension",
    description: "Review courses and practice materials",
    url: "https://learningext.com/"
  }
];

export function EnhancedStudyTipsDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [activeTab, setActiveTab] = useState('tips');
  const [completedTips, setCompletedTips] = useState<string[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const { studyAreas, updateConfidence } = useStudyProgress();
  
  // Generate personalized recommendations based on study progress
  useEffect(() => {
    const weakAreas = Object.entries(studyAreas)
      .filter(([_, area]) => area.confidenceLevel === 1)
      .map(([name]) => name);
    
    const newRecommendations: Recommendation[] = [];
    
    // Add area-specific recommendations
    weakAreas.forEach(area => {
      newRecommendations.push({
        id: `rec-${area.toLowerCase()}-1`,
        title: `Focus on ${area} Content`,
        description: `Schedule dedicated study time for ${area} concepts and complete at least 50 practice questions in this area.`,
        category: 'content',
        completed: false
      });
      
      newRecommendations.push({
        id: `rec-${area.toLowerCase()}-2`,
        title: `Create ${area} Concept Maps`,
        description: `Visualize the relationships between key concepts in ${area} to strengthen your understanding.`,
        category: 'technique',
        completed: false
      });
    });
    
    // Add general recommendations if needed
    if (newRecommendations.length < 3) {
      const generalTips = shuffleArray(STUDY_TIPS).slice(0, 5);
      generalTips.forEach(tip => {
        newRecommendations.push({
          id: tip.id,
          title: tip.title,
          description: tip.description,
          category: tip.category,
          completed: false
        });
      });
    }
    
    // Persist completed state for recommendations
    const storedCompletedTips = localStorage.getItem('nclexCompletedTips');
    if (storedCompletedTips) {
      const completed = JSON.parse(storedCompletedTips);
      setCompletedTips(completed);
      
      // Update completion status in recommendations
      newRecommendations.forEach(rec => {
        if (completed.includes(rec.id)) {
          rec.completed = true;
        }
      });
    }
    
    setRecommendations(newRecommendations);
  }, [studyAreas]);
  
  // Handle marking a recommendation as complete
  const toggleRecommendation = (id: string) => {
    setRecommendations(prev => 
      prev.map(rec => 
        rec.id === id ? { ...rec, completed: !rec.completed } : rec
      )
    );
    
    setCompletedTips(prev => {
      const newCompleted = prev.includes(id)
        ? prev.filter(tipId => tipId !== id)
        : [...prev, id];
      
      // Save to localStorage
      localStorage.setItem('nclexCompletedTips', JSON.stringify(newCompleted));
      return newCompleted;
    });
  };
  
  // Calculate completion percentage for recommendations
  const completionPercentage = recommendations.length > 0
    ? (recommendations.filter(rec => rec.completed).length / recommendations.length) * 100
    : 0;
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-[#13294B]">NCLEX Study Tips</DialogTitle>
          <DialogDescription>
            Expert advice to help you succeed in your NCLEX preparation.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="tips" value={activeTab} onValueChange={setActiveTab} className="mt-2">
          <TabsList className="grid grid-cols-3 w-full border">
            <TabsTrigger value="tips">Study Tips</TabsTrigger>
            <TabsTrigger value="strategy">Success Formula</TabsTrigger>
            <TabsTrigger value="recommendations">Personalized Plan</TabsTrigger>
          </TabsList>
          
          {/* Study Tips Tab */}
          <TabsContent value="tips" className="border rounded-md p-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {STUDY_TIPS.map((tip) => (
                <div 
                  key={tip.id} 
                  className="border rounded-md p-3 shadow-sm hover:shadow-md transition-shadow bg-white"
                >
                  <h3 className="font-semibold text-lg text-[#13294B]">{tip.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{tip.description}</p>
                  <div className="mt-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {tip.category === 'technique' ? 'Study Technique' : 
                        tip.category === 'planning' ? 'Planning Strategy' : 'Content Focus'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          
          {/* NCLEX Success Formula Tab */}
          <TabsContent value="strategy" className="border rounded-md p-4 mt-4">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-[#13294B] mb-3">NCLEX Success Formula</h3>
              <p className="text-gray-600 mb-4">
                Success on the NCLEX requires a balanced approach across these six key areas:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {NCLEX_FORMULA.map((item, index) => (
                  <div key={index} className="flex items-start p-3 border rounded-md bg-white">
                    <div className="mr-3 mt-1">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold text-md">{item.title}</h4>
                      <p className="text-sm text-gray-600">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-bold text-[#13294B] mb-3">Official NCLEX Resources</h3>
              <div className="grid grid-cols-1 gap-3">
                {OFFICIAL_RESOURCES.map((resource, index) => (
                  <div key={index} className="p-3 border rounded-md bg-white">
                    <h4 className="font-semibold text-[#4B9CD3]">{resource.name}</h4>
                    <p className="text-sm text-gray-600 mb-2">{resource.description}</p>
                    <a 
                      href={resource.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Visit Resource →
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
          
          {/* Personalized Recommendations Tab */}
          <TabsContent value="recommendations" className="border rounded-md p-4 mt-4">
            <div className="mb-4">
              <h3 className="text-xl font-bold text-[#13294B] mb-2">Your Personal Study Plan</h3>
              
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Track your progress:</p>
                <ProgressIndicator value={completionPercentage} color="primary" />
              </div>
              
              <div className="mb-6">
                <h4 className="font-semibold text-gray-700 mb-2">Self-Assessment</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Rate your confidence in these nursing areas to get personalized recommendations:
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {Object.entries(studyAreas).map(([area, data]) => (
                    <div key={area} className="p-3 border rounded-md bg-white">
                      <h5 className="font-medium text-[#13294B]">{area}</h5>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => updateConfidence(area, 1)}
                          className={`w-full py-1 px-2 rounded text-xs font-medium border ${
                            data.confidenceLevel === 1 
                              ? 'bg-red-100 border-red-300 text-red-700' 
                              : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100'
                          }`}
                        >
                          Low
                        </button>
                        <button
                          onClick={() => updateConfidence(area, 2)}
                          className={`w-full py-1 px-2 rounded text-xs font-medium border ${
                            data.confidenceLevel === 2
                              ? 'bg-amber-100 border-amber-300 text-amber-700'
                              : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100'
                          }`}
                        >
                          Medium
                        </button>
                        <button
                          onClick={() => updateConfidence(area, 3)}
                          className={`w-full py-1 px-2 rounded text-xs font-medium border ${
                            data.confidenceLevel === 3
                              ? 'bg-green-100 border-green-300 text-green-700'
                              : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100'
                          }`}
                        >
                          High
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-700 mb-3">Personalized Recommendations</h4>
                
                {recommendations.length === 0 ? (
                  <div className="p-4 border border-dashed rounded-md text-center">
                    <p className="text-gray-500">Rate your confidence levels above to get personalized recommendations</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recommendations.map((rec, index) => (
                      <div 
                        key={rec.id} 
                        className={`border rounded-md p-3 flex items-start gap-3 hover:bg-gray-50 transition-colors ${
                          rec.completed ? 'bg-green-50 border-green-200' : 'bg-white'
                        }`}
                      >
                        <button
                          onClick={() => toggleRecommendation(rec.id)}
                          className={`flex-shrink-0 w-6 h-6 rounded-full mt-0.5 flex items-center justify-center ${
                            rec.completed 
                              ? 'bg-green-500 text-white' 
                              : 'border-2 border-gray-300 text-transparent hover:border-gray-400'
                          }`}
                        >
                          <Check className="h-4 w-4" />
                        </button>
                        <div>
                          <h5 className={`font-medium ${rec.completed ? 'text-green-800' : 'text-[#13294B]'}`}>
                            {rec.title}
                          </h5>
                          <p className="text-sm text-gray-600 mt-1">{rec.description}</p>
                          <div className="mt-2">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                              {rec.category === 'technique' ? 'Study Technique' : 
                                rec.category === 'planning' ? 'Planning Strategy' : 'Content Focus'}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
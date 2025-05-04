import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { 
  Check, 
  ChevronRight, 
  Book, 
  Calendar, 
  Brain, 
  Zap, 
  ArrowLeft,
  Loader2 
} from 'lucide-react';
import { generateLearningPath } from '@/api/learning-path';
import { LearningPathPreferences, StudyArea, TimeCommitment, LearningStyle, DifficultyLevel } from '@/lib/learning-path';

// Learning styles
const learningStyles: { value: LearningStyle; label: string; description: string; icon: JSX.Element }[] = [
  { 
    value: 'visual', 
    label: 'Visual', 
    description: 'Learn best through images, diagrams, and videos', 
    icon: <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
  },
  { 
    value: 'auditory', 
    label: 'Auditory', 
    description: 'Learn best through listening and speaking',
    icon: <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.465a5 5 0 001.06-7.001l4.293-4.293a1 1 0 011.414 0l4.293 4.293a5 5 0 01-7.07 7.07L5.586 15.465z" /></svg>
  },
  { 
    value: 'reading', 
    label: 'Reading/Writing', 
    description: 'Learn best through written words and texts',
    icon: <Book className="h-5 w-5" />
  },
  { 
    value: 'kinesthetic', 
    label: 'Kinesthetic', 
    description: 'Learn best through hands-on practice',
    icon: <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" /></svg>
  }
];

// Time commitment options
const timeCommitments: { value: TimeCommitment; label: string; description: string; icon: JSX.Element }[] = [
  { 
    value: 'minimal', 
    label: 'Minimal (1-3 hours/week)', 
    description: 'For busy schedules with limited study time',
    icon: <Calendar className="h-5 w-5" />
  },
  { 
    value: 'moderate', 
    label: 'Moderate (4-10 hours/week)', 
    description: 'Balanced approach for steady progress',
    icon: <Calendar className="h-5 w-5" />
  },
  { 
    value: 'intensive', 
    label: 'Intensive (10+ hours/week)', 
    description: 'Accelerated learning for quick results',
    icon: <Calendar className="h-5 w-5" />
  }
];

// Difficulty level options
const difficultyLevels: { value: DifficultyLevel; label: string; description: string; icon: JSX.Element }[] = [
  { 
    value: 'beginner', 
    label: 'Beginner', 
    description: 'Foundational concepts and basic principles',
    icon: <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
  },
  { 
    value: 'intermediate', 
    label: 'Intermediate', 
    description: 'More complex topics requiring prior knowledge',
    icon: <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
  },
  { 
    value: 'advanced', 
    label: 'Advanced', 
    description: 'Advanced concepts and critical thinking',
    icon: <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
  }
];

// Study areas
const studyAreas: { value: StudyArea; label: string }[] = [
  { value: 'med-surg', label: 'Medical-Surgical Nursing' },
  { value: 'pediatrics', label: 'Pediatric Nursing' },
  { value: 'obstetrics', label: 'Obstetrics & Women\'s Health' },
  { value: 'psych', label: 'Psychiatric/Mental Health' },
  { value: 'pharmacology', label: 'Pharmacology' },
  { value: 'fundamentals', label: 'Nursing Fundamentals' },
  { value: 'critical-care', label: 'Critical Care Nursing' },
  { value: 'emergency', label: 'Emergency Nursing' },
  { value: 'community-health', label: 'Community Health' },
  { value: 'leadership', label: 'Leadership & Management' },
  { value: 'ethics', label: 'Ethics & Legal Issues' },
  { value: 'pathophysiology', label: 'Pathophysiology' }
];

// Local Link component that works with wouter
const Link = ({ href, children }: { href: string; children: React.ReactNode }) => {
  const [_, setLocation] = useLocation();
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setLocation(href);
  };
  
  return (
    <a href={href} onClick={handleClick}>
      {children}
    </a>
  );
};

export function LearningPathForm() {
  const [_, setLocation] = useLocation();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [preferences, setPreferences] = useState<LearningPathPreferences>({
    learningStyle: 'visual',
    timeCommitment: 'moderate',
    strengthAreas: [],
    weaknessAreas: [],
    daysUntilExam: 30,
    difficultyLevel: 'intermediate',
    title: '',
    description: '',
    focusAreas: []
  });

  // Handle form field changes
  const handleChange = (field: keyof LearningPathPreferences, value: any) => {
    setPreferences(prev => ({ ...prev, [field]: value }));
  };

  // Toggle study areas in arrays
  const toggleArea = (field: 'strengthAreas' | 'weaknessAreas' | 'focusAreas', area: StudyArea) => {
    setPreferences(prev => {
      const currentAreas = [...prev[field]];
      const index = currentAreas.indexOf(area);
      
      if (index === -1) {
        // Add the area if not already present
        return { ...prev, [field]: [...currentAreas, area] };
      } else {
        // Remove the area if already selected
        return { 
          ...prev, 
          [field]: currentAreas.filter(a => a !== area)
        };
      }
    });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      
      // Validate form data
      if (!preferences.title || preferences.title.trim() === '') {
        alert('Please enter a title for your learning path');
        setIsSubmitting(false);
        return;
      }
      
      if (preferences.focusAreas.length === 0) {
        alert('Please select at least one focus area');
        setIsSubmitting(false);
        return;
      }
      
      // Call API to generate learning path
      const response = await generateLearningPath(preferences);
      
      // Redirect to the new learning path
      setLocation(`/learning-path/${response.id}`);
      
    } catch (error) {
      console.error('Error creating learning path:', error);
      alert(`Failed to create learning path: ${(error as Error).message}`);
      setIsSubmitting(false);
    }
  };

  // Form step navigation
  const goToNextStep = () => {
    // Add validation per step if needed
    if (currentStep === 1) {
      if (!preferences.learningStyle) {
        alert('Please select a learning style');
        return;
      }
    } else if (currentStep === 2) {
      if (preferences.strengthAreas.length === 0 && preferences.weaknessAreas.length === 0) {
        alert('Please select at least one strength or weakness area');
        return;
      }
    } else if (currentStep === 3) {
      if (preferences.timeCommitment === undefined) {
        alert('Please select a time commitment level');
        return;
      }
      if (preferences.daysUntilExam <= 0) {
        alert('Please enter a valid number of days until your exam');
        return;
      }
    } else if (currentStep === 4) {
      if (preferences.focusAreas.length === 0) {
        alert('Please select at least one focus area');
        return;
      }
    }
    
    setCurrentStep(prev => Math.min(prev + 1, 5));
  };

  const goToPreviousStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200">
      <Link href="/learning-paths">
        <div className="text-gray-600 hover:text-blue-600 flex items-center mb-6 cursor-pointer">
          <ArrowLeft className="h-5 w-5 mr-1" />
          <span>Back to Learning Paths</span>
        </div>
      </Link>
      
      <h1 className="text-3xl font-bold text-[#13294B] mb-2">Create Personalized Learning Path</h1>
      <p className="text-gray-600 mb-8">
        Generate a customized learning path tailored to your specific needs, learning style, and exam timeline.
      </p>
      
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium text-blue-600">Step {currentStep} of 5</span>
          <span className="text-sm font-medium text-gray-500">{currentStep * 20}% Complete</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
            style={{ width: `${currentStep * 20}%` }}
          ></div>
        </div>
      </div>
      
      <form onSubmit={handleSubmit}>
        {/* Step 1: Learning Style */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Brain className="h-5 w-5 mr-2 text-blue-600" />
                Select Your Learning Style
              </h2>
              <p className="text-gray-600 mb-4">
                This helps us customize your learning path with the most effective content types for your learning preferences.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {learningStyles.map((style) => (
                  <div 
                    key={style.value}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      preferences.learningStyle === style.value 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleChange('learningStyle', style.value)}
                  >
                    <div className="flex items-start">
                      <div className={`h-6 w-6 rounded-full flex items-center justify-center mr-3 ${
                        preferences.learningStyle === style.value 
                          ? 'bg-blue-500 text-white' 
                          : 'bg-gray-100'
                      }`}>
                        {preferences.learningStyle === style.value ? (
                          <Check className="h-4 w-4" />
                        ) : null}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center">
                          {style.icon}
                          <h3 className="font-semibold ml-2">{style.label}</h3>
                        </div>
                        <p className="text-gray-600 text-sm mt-1">{style.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {/* Step 2: Strengths and Weaknesses */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Zap className="h-5 w-5 mr-2 text-blue-600" />
                Identify Your Strengths & Weaknesses
              </h2>
              <p className="text-gray-600 mb-4">
                Select areas where you feel confident and areas where you need more support.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Strengths */}
                <div>
                  <h3 className="font-semibold text-green-700 mb-3">Your Strengths</h3>
                  <div className="space-y-2">
                    {studyAreas.map((area) => (
                      <div 
                        key={`strength-${area.value}`}
                        className={`flex items-center p-2 border rounded cursor-pointer ${
                          preferences.strengthAreas.includes(area.value)
                            ? 'border-green-500 bg-green-50'
                            : 'border-gray-200 hover:bg-gray-50'
                        }`}
                        onClick={() => toggleArea('strengthAreas', area.value)}
                      >
                        <div className={`h-5 w-5 rounded flex items-center justify-center mr-2 ${
                          preferences.strengthAreas.includes(area.value)
                            ? 'bg-green-500 text-white'
                            : 'border border-gray-300'
                        }`}>
                          {preferences.strengthAreas.includes(area.value) && (
                            <Check className="h-3 w-3" />
                          )}
                        </div>
                        <span>{area.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Weaknesses */}
                <div>
                  <h3 className="font-semibold text-orange-600 mb-3">Areas to Improve</h3>
                  <div className="space-y-2">
                    {studyAreas.map((area) => (
                      <div 
                        key={`weakness-${area.value}`}
                        className={`flex items-center p-2 border rounded cursor-pointer ${
                          preferences.weaknessAreas.includes(area.value)
                            ? 'border-orange-500 bg-orange-50'
                            : 'border-gray-200 hover:bg-gray-50'
                        }`}
                        onClick={() => toggleArea('weaknessAreas', area.value)}
                      >
                        <div className={`h-5 w-5 rounded flex items-center justify-center mr-2 ${
                          preferences.weaknessAreas.includes(area.value)
                            ? 'bg-orange-500 text-white'
                            : 'border border-gray-300'
                        }`}>
                          {preferences.weaknessAreas.includes(area.value) && (
                            <Check className="h-3 w-3" />
                          )}
                        </div>
                        <span>{area.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Step 3: Time Commitment and Exam Timeline */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-blue-600" />
                Time Commitment & Exam Timeline
              </h2>
              <p className="text-gray-600 mb-4">
                Let us know how much time you can dedicate to studying and when your exam is scheduled.
              </p>
              
              <div className="space-y-6">
                {/* Time Commitment Selection */}
                <div>
                  <h3 className="font-semibold mb-3">Weekly Time Commitment</h3>
                  <div className="space-y-3">
                    {timeCommitments.map((option) => (
                      <div 
                        key={option.value}
                        className={`p-3 border rounded-lg cursor-pointer transition-all ${
                          preferences.timeCommitment === option.value 
                            ? 'border-blue-500 bg-blue-50' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => handleChange('timeCommitment', option.value)}
                      >
                        <div className="flex items-center">
                          <div className={`h-5 w-5 rounded-full flex items-center justify-center mr-3 ${
                            preferences.timeCommitment === option.value 
                              ? 'bg-blue-500 text-white' 
                              : 'border border-gray-300'
                          }`}>
                            {preferences.timeCommitment === option.value && (
                              <Check className="h-3 w-3" />
                            )}
                          </div>
                          <div>
                            <span className="font-medium">{option.label}</span>
                            <p className="text-sm text-gray-600">{option.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Days Until Exam */}
                <div>
                  <h3 className="font-semibold mb-3">Days Until Your Exam</h3>
                  <div className="flex items-center space-x-4">
                    <input 
                      type="number" 
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="1"
                      max="365"
                      value={preferences.daysUntilExam}
                      onChange={(e) => handleChange('daysUntilExam', parseInt(e.target.value) || 0)}
                    />
                    <span className="text-gray-600">days</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">This helps us prioritize content based on your timeline.</p>
                </div>
                
                {/* Difficulty Level */}
                <div>
                  <h3 className="font-semibold mb-3">Preferred Difficulty Level</h3>
                  <div className="flex space-x-4">
                    {difficultyLevels.map((level) => (
                      <div 
                        key={level.value}
                        className={`flex-1 p-3 border rounded-lg cursor-pointer text-center transition-all ${
                          preferences.difficultyLevel === level.value 
                            ? 'border-blue-500 bg-blue-50' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => handleChange('difficultyLevel', level.value)}
                      >
                        <div className="flex flex-col items-center">
                          <div className={`h-6 w-6 rounded-full flex items-center justify-center mb-2 ${
                            preferences.difficultyLevel === level.value 
                              ? 'bg-blue-500 text-white' 
                              : 'bg-gray-100'
                          }`}>
                            {preferences.difficultyLevel === level.value ? (
                              <Check className="h-4 w-4" />
                            ) : null}
                          </div>
                          <span className="font-medium">{level.label}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Step 4: Focus Areas */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Book className="h-5 w-5 mr-2 text-blue-600" />
                Select Your Focus Areas
              </h2>
              <p className="text-gray-600 mb-4">
                Choose specific areas you want to focus on in your learning path. These will be prioritized in your study plan.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {studyAreas.map((area) => (
                  <div 
                    key={`focus-${area.value}`}
                    className={`p-3 border rounded-lg cursor-pointer transition-all ${
                      preferences.focusAreas.includes(area.value) 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => toggleArea('focusAreas', area.value)}
                  >
                    <div className="flex items-center">
                      <div className={`h-5 w-5 rounded-full flex items-center justify-center mr-2 ${
                        preferences.focusAreas.includes(area.value) 
                          ? 'bg-blue-500 text-white' 
                          : 'border border-gray-300'
                      }`}>
                        {preferences.focusAreas.includes(area.value) && (
                          <Check className="h-3 w-3" />
                        )}
                      </div>
                      <span>{area.label}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {/* Step 5: Final Details */}
        {currentStep === 5 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Check className="h-5 w-5 mr-2 text-blue-600" />
                Final Details
              </h2>
              <p className="text-gray-600 mb-4">
                Name your learning path and provide any additional notes that might help us customize it for you.
              </p>
              
              <div className="space-y-4">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Learning Path Title <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., My NCLEX Preparation Plan"
                    value={preferences.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    required
                  />
                </div>
                
                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description (Optional)
                  </label>
                  <textarea 
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                    placeholder="Briefly describe the goals or focus of this learning path..."
                    value={preferences.description || ''}
                    onChange={(e) => handleChange('description', e.target.value)}
                  />
                </div>
                
                {/* Additional Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Additional Notes (Optional)
                  </label>
                  <textarea 
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                    placeholder="Any specific topics or areas you'd like to emphasize? Any special requirements or challenges?"
                    value={preferences.additionalNotes || ''}
                    onChange={(e) => handleChange('additionalNotes', e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          {currentStep > 1 ? (
            <button
              type="button"
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 flex items-center"
              onClick={goToPreviousStep}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </button>
          ) : (
            <div>{/* Empty div to maintain flex spacing */}</div>
          )}
          
          {currentStep < 5 ? (
            <button
              type="button"
              className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
              onClick={goToNextStep}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </button>
          ) : (
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Create Learning Path
                </>
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
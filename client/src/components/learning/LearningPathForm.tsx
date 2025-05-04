import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { 
  Brain, 
  Clock, 
  BookOpen, 
  Ban, 
  Calendar, 
  AlertTriangle, 
  Award, 
  Loader2 
} from 'lucide-react';
import { generateLearningPath, LearningPathPreferences } from '@/api/learning-path';

// Learning styles
const learningStyles = [
  { id: 'visual', label: 'Visual', icon: <Brain className="h-4 w-4 mr-2" />, description: 'You learn best from diagrams, charts, and videos' },
  { id: 'auditory', label: 'Auditory', icon: <Brain className="h-4 w-4 mr-2" />, description: 'You learn best from listening to explanations and discussions' },
  { id: 'reading', label: 'Reading/Writing', icon: <Brain className="h-4 w-4 mr-2" />, description: 'You learn best from reading texts and writing notes' },
  { id: 'kinesthetic', label: 'Kinesthetic', icon: <Brain className="h-4 w-4 mr-2" />, description: 'You learn best through hands-on activities and practical exercises' },
];

// Time commitment options
const timeCommitments = [
  { id: 'minimal', label: 'Minimal (3-5 hours/week)', icon: <Clock className="h-4 w-4 mr-2" /> },
  { id: 'moderate', label: 'Moderate (5-10 hours/week)', icon: <Clock className="h-4 w-4 mr-2" /> },
  { id: 'intensive', label: 'Intensive (10+ hours/week)', icon: <Clock className="h-4 w-4 mr-2" /> },
];

// Difficulty levels
const difficultyLevels = [
  { id: 'beginner', label: 'Beginner', icon: <BookOpen className="h-4 w-4 mr-2" /> },
  { id: 'intermediate', label: 'Intermediate', icon: <BookOpen className="h-4 w-4 mr-2" /> },
  { id: 'advanced', label: 'Advanced', icon: <BookOpen className="h-4 w-4 mr-2" /> },
];

// Nursing focus areas
const nursingFocusAreas = [
  'Fundamentals of Nursing',
  'Medical-Surgical Nursing',
  'Pediatric Nursing',
  'Maternity Nursing',
  'Psychiatric Nursing',
  'Pharmacology',
  'Pathophysiology',
  'Health Assessment',
  'Critical Care',
  'Emergency Nursing',
  'Gerontological Nursing',
  'Community Health',
  'Leadership & Management',
  'Ethics & Legal Issues',
];

export function LearningPathForm() {
  const [_, setLocation] = useLocation();
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form state
  const [preferences, setPreferences] = useState<LearningPathPreferences>({
    learningStyle: 'visual',
    timeCommitment: 'moderate',
    difficulty: 'intermediate',
    focusAreas: ['Medical-Surgical Nursing'], // Default to Med-Surg
    excludedAreas: [],
    weakAreas: [],
    strongAreas: [],
  });
  
  // Days until exam (optional)
  const [daysUntilExam, setDaysUntilExam] = useState<number | undefined>(undefined);
  
  // Handle learning style selection
  const handleLearningStyleChange = (style: 'visual' | 'auditory' | 'reading' | 'kinesthetic') => {
    setPreferences(prev => ({ ...prev, learningStyle: style }));
  };
  
  // Handle time commitment selection
  const handleTimeCommitmentChange = (commitment: 'minimal' | 'moderate' | 'intensive') => {
    setPreferences(prev => ({ ...prev, timeCommitment: commitment }));
  };
  
  // Handle difficulty level selection
  const handleDifficultyChange = (difficulty: 'beginner' | 'intermediate' | 'advanced') => {
    setPreferences(prev => ({ ...prev, difficulty }));
  };
  
  // Toggle focus area selection
  const toggleFocusArea = (area: string) => {
    setPreferences(prev => {
      const focusAreas = [...prev.focusAreas];
      
      if (focusAreas.includes(area)) {
        // Remove area if already selected
        return { 
          ...prev, 
          focusAreas: focusAreas.filter(a => a !== area) 
        };
      } else {
        // Add area if not already selected
        return { 
          ...prev, 
          focusAreas: [...focusAreas, area] 
        };
      }
    });
  };
  
  // Toggle excluded area selection
  const toggleExcludedArea = (area: string) => {
    setPreferences(prev => {
      const excludedAreas = [...(prev.excludedAreas || [])];
      
      if (excludedAreas.includes(area)) {
        // Remove area if already excluded
        return { 
          ...prev, 
          excludedAreas: excludedAreas.filter(a => a !== area) 
        };
      } else {
        // Add area to excluded list if not already included
        return { 
          ...prev, 
          excludedAreas: [...excludedAreas, area] 
        };
      }
    });
  };
  
  // Toggle weak area selection
  const toggleWeakArea = (area: string) => {
    setPreferences(prev => {
      const weakAreas = [...(prev.weakAreas || [])];
      
      if (weakAreas.includes(area)) {
        // Remove area if already in weak areas
        return { 
          ...prev, 
          weakAreas: weakAreas.filter(a => a !== area) 
        };
      } else {
        // Add area to weak areas if not already included
        return { 
          ...prev, 
          weakAreas: [...weakAreas, area] 
        };
      }
    });
  };
  
  // Toggle strong area selection
  const toggleStrongArea = (area: string) => {
    setPreferences(prev => {
      const strongAreas = [...(prev.strongAreas || [])];
      
      if (strongAreas.includes(area)) {
        // Remove area if already in strong areas
        return { 
          ...prev, 
          strongAreas: strongAreas.filter(a => a !== area) 
        };
      } else {
        // Add area to strong areas if not already included
        return { 
          ...prev, 
          strongAreas: [...strongAreas, area] 
        };
      }
    });
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (preferences.focusAreas.length === 0) {
      setError('Please select at least one focus area');
      return;
    }
    
    // Add days until exam if provided
    const fullPreferences = {
      ...preferences,
      daysUntilExam: daysUntilExam,
    };
    
    try {
      setIsGenerating(true);
      setError(null);
      
      // Call API to generate learning path
      const generatedPath = await generateLearningPath(fullPreferences);
      
      // Redirect to the new learning path page
      setLocation(`/learning-path/${generatedPath.id}`);
    } catch (error) {
      console.error('Error generating learning path:', error);
      setError((error as Error).message || 'Failed to generate learning path. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-md mb-6 border border-red-200">
          <div className="flex items-center mb-1">
            <AlertTriangle className="h-5 w-5 mr-2" />
            <h3 className="font-semibold">Error</h3>
          </div>
          <p>{error}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        {/* Learning Style Selection */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-[#13294B]">Learning Style</h2>
          <p className="text-gray-600 mb-4">How do you prefer to learn new information?</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {learningStyles.map(style => (
              <div
                key={style.id}
                className={`
                  border rounded-lg p-4 cursor-pointer transition-all
                  ${preferences.learningStyle === style.id
                    ? 'bg-blue-50 border-blue-300 ring-2 ring-blue-300 ring-opacity-50'
                    : 'border-gray-200 hover:border-blue-200 hover:bg-blue-50/30'}
                `}
                onClick={() => handleLearningStyleChange(style.id as any)}
              >
                <div className="flex items-center">
                  {style.icon}
                  <h3 className="font-medium">{style.label}</h3>
                </div>
                <p className="text-gray-600 text-sm mt-2">{style.description}</p>
              </div>
            ))}
          </div>
        </div>
        
        {/* Time Commitment Selection */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-[#13294B]">Time Commitment</h2>
          <p className="text-gray-600 mb-4">How much time can you dedicate to studying each week?</p>
          
          <div className="flex flex-col space-y-3">
            {timeCommitments.map(commitment => (
              <div
                key={commitment.id}
                className={`
                  flex items-center border rounded-lg p-3 cursor-pointer transition-all
                  ${preferences.timeCommitment === commitment.id
                    ? 'bg-blue-50 border-blue-300 ring-2 ring-blue-300 ring-opacity-50'
                    : 'border-gray-200 hover:border-blue-200 hover:bg-blue-50/30'}
                `}
                onClick={() => handleTimeCommitmentChange(commitment.id as any)}
              >
                {commitment.icon}
                <span>{commitment.label}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Difficulty Level Selection */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-[#13294B]">Difficulty Level</h2>
          <p className="text-gray-600 mb-4">Select your current knowledge level:</p>
          
          <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-4">
            {difficultyLevels.map(level => (
              <div
                key={level.id}
                className={`
                  flex-1 flex items-center justify-center border rounded-lg p-3 cursor-pointer transition-all
                  ${preferences.difficulty === level.id
                    ? 'bg-blue-50 border-blue-300 ring-2 ring-blue-300 ring-opacity-50'
                    : 'border-gray-200 hover:border-blue-200 hover:bg-blue-50/30'}
                `}
                onClick={() => handleDifficultyChange(level.id as any)}
              >
                {level.icon}
                <span>{level.label}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Days Until Exam (Optional) */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-[#13294B]">Exam Timeline (Optional)</h2>
          <p className="text-gray-600 mb-4">If you're preparing for an exam, how many days do you have until the test?</p>
          
          <div className="flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-gray-500" />
            <input
              type="number"
              min="1"
              max="365"
              placeholder="Days until exam"
              value={daysUntilExam || ''}
              onChange={(e) => setDaysUntilExam(e.target.value ? parseInt(e.target.value) : undefined)}
              className="border border-gray-300 rounded-md px-3 py-2 w-40 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>
        </div>
        
        {/* Focus Areas Selection */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-[#13294B]">Focus Areas</h2>
          <p className="text-gray-600 mb-4">Select the nursing topics you want to focus on: <span className="font-medium text-blue-600">(at least one required)</span></p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {nursingFocusAreas.map(area => (
              <div
                key={`focus-${area}`}
                className={`
                  flex items-center border rounded-lg p-3 cursor-pointer transition-all
                  ${preferences.focusAreas.includes(area) 
                    ? 'bg-green-50 border-green-300 ring-1 ring-green-300' 
                    : 'border-gray-200 hover:border-green-200 hover:bg-green-50/30'}
                `}
                onClick={() => toggleFocusArea(area)}
              >
                <BookOpen className="h-4 w-4 mr-2 text-green-600" />
                <span>{area}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Optional Sections - Excluded Areas */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-[#13294B]">Excluded Areas (Optional)</h2>
          <p className="text-gray-600 mb-4">Select topics you want to exclude from your learning path:</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {nursingFocusAreas.filter(area => !preferences.focusAreas.includes(area)).map(area => (
              <div
                key={`exclude-${area}`}
                className={`
                  flex items-center border rounded-lg p-3 cursor-pointer transition-all
                  ${preferences.excludedAreas?.includes(area) 
                    ? 'bg-red-50 border-red-300 ring-1 ring-red-300' 
                    : 'border-gray-200 hover:border-red-200 hover:bg-red-50/30'}
                `}
                onClick={() => toggleExcludedArea(area)}
              >
                <Ban className="h-4 w-4 mr-2 text-red-600" />
                <span>{area}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Weak Areas */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-[#13294B]">Weak Areas (Optional)</h2>
          <p className="text-gray-600 mb-4">Select topics you feel less confident in:</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {nursingFocusAreas.filter(area => !preferences.excludedAreas?.includes(area)).map(area => (
              <div
                key={`weak-${area}`}
                className={`
                  flex items-center border rounded-lg p-3 cursor-pointer transition-all
                  ${preferences.weakAreas?.includes(area) 
                    ? 'bg-yellow-50 border-yellow-300 ring-1 ring-yellow-300' 
                    : 'border-gray-200 hover:border-yellow-200 hover:bg-yellow-50/30'}
                `}
                onClick={() => toggleWeakArea(area)}
              >
                <AlertTriangle className="h-4 w-4 mr-2 text-yellow-600" />
                <span>{area}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Strong Areas */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-[#13294B]">Strong Areas (Optional)</h2>
          <p className="text-gray-600 mb-4">Select topics you already feel confident in:</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {nursingFocusAreas.filter(area => !preferences.excludedAreas?.includes(area)).map(area => (
              <div
                key={`strong-${area}`}
                className={`
                  flex items-center border rounded-lg p-3 cursor-pointer transition-all
                  ${preferences.strongAreas?.includes(area) 
                    ? 'bg-purple-50 border-purple-300 ring-1 ring-purple-300' 
                    : 'border-gray-200 hover:border-purple-200 hover:bg-purple-50/30'}
                `}
                onClick={() => toggleStrongArea(area)}
              >
                <Award className="h-4 w-4 mr-2 text-purple-600" />
                <span>{area}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Submit Button */}
        <div className="mt-10">
          <button
            type="submit"
            disabled={isGenerating || preferences.focusAreas.length === 0}
            className={`
              w-full md:w-auto px-8 py-3 rounded-lg text-white font-medium 
              ${isGenerating || preferences.focusAreas.length === 0
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-[#4B9CD3] hover:bg-[#3d7eaa]'}
              transition-colors flex items-center justify-center
            `}
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Generating Your Learning Path...
              </>
            ) : (
              'Generate Learning Path'
            )}
          </button>
          {preferences.focusAreas.length === 0 && (
            <p className="text-red-600 text-sm mt-2">Please select at least one focus area</p>
          )}
        </div>
      </form>
    </div>
  );
}
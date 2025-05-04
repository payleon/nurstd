import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { Loader2 } from 'lucide-react';
import { useStudyProgress } from '@/hooks/useStudyProgress';
import { generateLearningPath } from '@/api/learning-path';
import { Badge } from '@/components/ui/badge';

// Learning style options
const learningStyles = [
  { value: 'visual', label: 'Visual', description: 'Prefer diagrams, videos, charts, and color-coded materials' },
  { value: 'auditory', label: 'Auditory', description: 'Prefer listening to lectures, discussions, and verbal explanations' },
  { value: 'reading', label: 'Reading', description: 'Prefer text-based resources, articles, and note-taking' },
  { value: 'kinesthetic', label: 'Kinesthetic', description: 'Prefer hands-on activities, simulations, and practice scenarios' },
];

// Time commitment options
const timeCommitments = [
  { value: 'minimal', label: 'Minimal', description: '1-2 hours per week' },
  { value: 'moderate', label: 'Moderate', description: '3-6 hours per week' },
  { value: 'intensive', label: 'Intensive', description: '7+ hours per week' },
];

// Difficulty level options
const difficultyLevels = [
  { value: 'beginner', label: 'Beginner', description: 'New to nursing or need a refresher' },
  { value: 'intermediate', label: 'Intermediate', description: 'Comfortable with basic concepts, need targeted practice' },
  { value: 'advanced', label: 'Advanced', description: 'Looking for challenging scenarios and complex problems' },
];

// Available study areas
const studyAreas = [
  { value: 'fundamentals', label: 'Fundamentals of Nursing' },
  { value: 'med-surg', label: 'Medical-Surgical Nursing' },
  { value: 'pediatrics', label: 'Pediatric Nursing' },
  { value: 'maternal', label: 'Maternal-Newborn Nursing' },
  { value: 'mental-health', label: 'Mental Health Nursing' },
  { value: 'pharmacology', label: 'Pharmacology' },
  { value: 'health-assessment', label: 'Health Assessment' },
  { value: 'community', label: 'Community Health Nursing' },
  { value: 'leadership', label: 'Leadership & Management' },
  { value: 'critical-care', label: 'Critical Care Nursing' },
];

export function LearningPathForm() {
  const [_, setLocation] = useLocation();
  const { getWeakAreas, getStrongAreas } = useStudyProgress();
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form state
  const [learningStyle, setLearningStyle] = useState<string>('visual');
  const [timeCommitment, setTimeCommitment] = useState<string>('moderate');
  const [difficulty, setDifficulty] = useState<string>('intermediate');
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const [excludedAreas, setExcludedAreas] = useState<string[]>([]);
  const [daysUntilExam, setDaysUntilExam] = useState<number | undefined>(undefined);
  const [includeWeakAreas, setIncludeWeakAreas] = useState(true);
  const [includeStrongAreas, setIncludeStrongAreas] = useState(false);
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      setError(null);
      
      // Prepare the preferences object
      const preferences = {
        learningStyle: learningStyle as 'visual' | 'auditory' | 'reading' | 'kinesthetic',
        timeCommitment: timeCommitment as 'minimal' | 'moderate' | 'intensive',
        difficulty: difficulty as 'beginner' | 'intermediate' | 'advanced',
        focusAreas: selectedAreas,
        excludedAreas: excludedAreas.length > 0 ? excludedAreas : undefined,
        daysUntilExam: daysUntilExam || undefined,
        weakAreas: includeWeakAreas ? getWeakAreas() : undefined,
        strongAreas: includeStrongAreas ? getStrongAreas() : undefined,
      };
      
      // Generate the learning path
      const learningPath = await generateLearningPath(preferences);
      
      // Navigate to the learning path view
      setLocation(`/learning-path/${learningPath.id}`);
    } catch (error) {
      console.error('Error creating learning path:', error);
      setError((error as Error).message || 'Failed to create learning path');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Toggle a study area in the selected areas list
  const toggleArea = (area: string) => {
    if (selectedAreas.includes(area)) {
      setSelectedAreas(selectedAreas.filter(a => a !== area));
    } else {
      setSelectedAreas([...selectedAreas, area]);
    }
  };
  
  // Toggle a study area in the excluded areas list
  const toggleExcludedArea = (area: string) => {
    if (excludedAreas.includes(area)) {
      setExcludedAreas(excludedAreas.filter(a => a !== area));
    } else {
      setExcludedAreas([...excludedAreas, area]);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6 text-[#13294B]">Create Your Personalized Learning Path</h2>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        {/* Learning Style Selection */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">How do you learn best?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {learningStyles.map(style => (
              <div 
                key={style.value}
                className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                  learningStyle === style.value ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                }`}
                onClick={() => setLearningStyle(style.value)}
              >
                <div className="font-medium mb-1">{style.label}</div>
                <div className="text-sm text-gray-600">{style.description}</div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Time Commitment */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">How much time can you commit weekly?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {timeCommitments.map(time => (
              <div 
                key={time.value}
                className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                  timeCommitment === time.value ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                }`}
                onClick={() => setTimeCommitment(time.value)}
              >
                <div className="font-medium mb-1">{time.label}</div>
                <div className="text-sm text-gray-600">{time.description}</div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Difficulty Level */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">What difficulty level would you prefer?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {difficultyLevels.map(level => (
              <div 
                key={level.value}
                className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                  difficulty === level.value ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                }`}
                onClick={() => setDifficulty(level.value)}
              >
                <div className="font-medium mb-1">{level.label}</div>
                <div className="text-sm text-gray-600">{level.description}</div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Focus Areas */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Which areas would you like to focus on?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {studyAreas.map(area => (
              <div 
                key={area.value}
                className={`border rounded-lg p-3 cursor-pointer transition-colors flex items-center ${
                  selectedAreas.includes(area.value) ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                }`}
                onClick={() => toggleArea(area.value)}
              >
                <input 
                  type="checkbox" 
                  checked={selectedAreas.includes(area.value)} 
                  onChange={() => toggleArea(area.value)}
                  className="mr-3 h-5 w-5 text-blue-600"
                />
                <span>{area.label}</span>
              </div>
            ))}
          </div>
          {selectedAreas.length === 0 && (
            <p className="text-sm text-amber-600 mt-2">
              Please select at least one focus area
            </p>
          )}
        </div>
        
        {/* Areas to Exclude */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Any areas you'd like to exclude?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {studyAreas.map(area => (
              <div 
                key={area.value}
                className={`border rounded-lg p-3 cursor-pointer transition-colors flex items-center ${
                  excludedAreas.includes(area.value) ? 'border-red-300 bg-red-50' : 'border-gray-200'
                } ${selectedAreas.includes(area.value) ? 'opacity-50 pointer-events-none' : ''}`}
                onClick={() => toggleExcludedArea(area.value)}
              >
                <input 
                  type="checkbox" 
                  checked={excludedAreas.includes(area.value)} 
                  onChange={() => toggleExcludedArea(area.value)}
                  disabled={selectedAreas.includes(area.value)}
                  className="mr-3 h-5 w-5 text-red-500"
                />
                <span className={selectedAreas.includes(area.value) ? 'line-through' : ''}>{area.label}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Days Until Exam */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Days until your exam (optional)</h3>
          <input 
            type="number" 
            min="1"
            max="365"
            value={daysUntilExam || ''}
            onChange={(e) => setDaysUntilExam(e.target.value ? parseInt(e.target.value) : undefined)}
            placeholder="Enter number of days"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
          <p className="text-sm text-gray-500 mt-2">
            Providing this helps us optimize your study schedule
          </p>
        </div>
        
        {/* Include Study Performance */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Include your study performance?</h3>
          <div className="flex flex-col gap-3">
            <div className="flex items-center">
              <input 
                type="checkbox" 
                id="include-weak-areas"
                checked={includeWeakAreas}
                onChange={() => setIncludeWeakAreas(!includeWeakAreas)}
                className="mr-3 h-5 w-5 text-blue-600"
              />
              <label htmlFor="include-weak-areas" className="cursor-pointer">
                Include my weak areas in the recommendations
              </label>
            </div>
            <div className="flex items-center">
              <input 
                type="checkbox" 
                id="include-strong-areas"
                checked={includeStrongAreas}
                onChange={() => setIncludeStrongAreas(!includeStrongAreas)}
                className="mr-3 h-5 w-5 text-blue-600"
              />
              <label htmlFor="include-strong-areas" className="cursor-pointer">
                Include my strong areas in the recommendations
              </label>
            </div>
          </div>
        </div>
        
        {/* Submit Button */}
        <div className="mt-8">
          <button
            type="submit"
            disabled={isLoading || selectedAreas.length === 0}
            className={`w-full py-3 rounded-lg font-medium text-white flex items-center justify-center
              ${isLoading || selectedAreas.length === 0 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-[#4B9CD3] hover:bg-[#3d7eaa]'
              }`}
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin mr-2 h-5 w-5" />
                Generating your learning path...
              </>
            ) : (
              'Create My Learning Path'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
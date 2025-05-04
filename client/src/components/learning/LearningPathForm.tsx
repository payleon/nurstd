import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useStudyProgress } from '@/hooks/useStudyProgress';
import { 
  generateLearningPath, 
  LearningPreferences, 
  LearningStyle, 
  TimeCommitment, 
  DifficultyLevel
} from '@/lib/learning-path';

// Form validation schema
const formSchema = z.object({
  learningStyle: z.enum(['visual', 'auditory', 'reading', 'kinesthetic']),
  timeCommitment: z.enum(['minimal', 'moderate', 'intensive']),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
  focusAreas: z.array(z.string()).min(1, "Select at least one focus area"),
  excludedAreas: z.array(z.string()).optional(),
  daysUntilExam: z.number().min(1).max(365).optional(),
});

// Learning style options
const learningStyleOptions = [
  { value: 'visual', label: 'Visual', description: 'Learn best through images, videos, and visual aids' },
  { value: 'auditory', label: 'Auditory', description: 'Learn best through listening and discussion' },
  { value: 'reading', label: 'Reading/Writing', description: 'Learn best through reading and note-taking' },
  { value: 'kinesthetic', label: 'Kinesthetic', description: 'Learn best through practice and hands-on activities' },
];

// Time commitment options
const timeCommitmentOptions = [
  { value: 'minimal', label: 'Minimal (4 hrs/week)', description: 'For those with very limited study time' },
  { value: 'moderate', label: 'Moderate (7 hrs/week)', description: 'Balanced approach to study' },
  { value: 'intensive', label: 'Intensive (12+ hrs/week)', description: 'For dedicated, intensive study sessions' },
];

// Study area options
const studyAreaOptions = [
  { value: 'fundamentals', label: 'Nursing Fundamentals' },
  { value: 'pharmacology', label: 'Pharmacology' },
  { value: 'med-surg', label: 'Medical-Surgical' },
  { value: 'pediatrics', label: 'Pediatrics' },
  { value: 'obstetrics', label: 'Obstetrics' },
  { value: 'psychiatric', label: 'Psychiatric' },
  { value: 'prioritization', label: 'Prioritization & Delegation' },
  { value: 'leadership', label: 'Leadership & Management' },
];

// Difficulty level options
const difficultyOptions = [
  { value: 'beginner', label: 'Beginner', description: 'Foundational content for new learners' },
  { value: 'intermediate', label: 'Intermediate', description: 'Standard difficulty for most students' },
  { value: 'advanced', label: 'Advanced', description: 'Challenging content for experienced students' },
];

export function LearningPathForm() {
  const [selectedLearningStyle, setSelectedLearningStyle] = useState<LearningStyle | null>(null);
  const [selectedTimeCommitment, setSelectedTimeCommitment] = useState<TimeCommitment | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel | null>(null);
  const [selectedFocusAreas, setSelectedFocusAreas] = useState<string[]>([]);
  const [selectedExcludedAreas, setSelectedExcludedAreas] = useState<string[]>([]);
  const [daysUntilExam, setDaysUntilExam] = useState<number | ''>('');
  const [isGenerating, setIsGenerating] = useState(false);
  
  const { studyAreas } = useStudyProgress();
  const [_, navigate] = useLocation();
  
  // Handle form submission
  const handleSubmit = () => {
    if (!selectedLearningStyle || !selectedTimeCommitment || !selectedDifficulty || selectedFocusAreas.length === 0) {
      return;
    }
    
    setIsGenerating(true);
    
    // Create learning preferences object
    const preferences: LearningPreferences = {
      learningStyle: selectedLearningStyle,
      timeCommitment: selectedTimeCommitment,
      difficulty: selectedDifficulty,
      focusAreas: selectedFocusAreas,
      excludedAreas: selectedExcludedAreas.length > 0 ? selectedExcludedAreas : undefined,
      daysUntilExam: daysUntilExam !== '' ? Number(daysUntilExam) : undefined,
    };
    
    try {
      // Generate learning path
      const learningPath = generateLearningPath(preferences, studyAreas);
      
      // Store the learning path in localStorage
      const existingPaths = JSON.parse(localStorage.getItem('learningPaths') || '[]');
      localStorage.setItem('learningPaths', JSON.stringify([...existingPaths, learningPath]));
      
      // Set current path ID
      localStorage.setItem('currentLearningPathId', learningPath.id);
      
      // Navigate to learning path view
      navigate('/learning-path');
    } catch (error) {
      console.error('Error generating learning path:', error);
      setIsGenerating(false);
    }
  };
  
  // Helper to determine if form is valid
  const isFormValid = 
    selectedLearningStyle !== null && 
    selectedTimeCommitment !== null && 
    selectedDifficulty !== null && 
    selectedFocusAreas.length > 0;
  
  // Toggle focus area selection
  const toggleFocusArea = (area: string) => {
    if (selectedFocusAreas.includes(area)) {
      setSelectedFocusAreas(selectedFocusAreas.filter(a => a !== area));
      
      // Remove from excluded if deselected from focus
      if (selectedExcludedAreas.includes(area)) {
        setSelectedExcludedAreas(selectedExcludedAreas.filter(a => a !== area));
      }
    } else {
      setSelectedFocusAreas([...selectedFocusAreas, area]);
    }
  };
  
  // Toggle excluded area selection
  const toggleExcludedArea = (area: string) => {
    if (!selectedFocusAreas.includes(area)) {
      return; // Can't exclude an area that's not selected
    }
    
    if (selectedExcludedAreas.includes(area)) {
      setSelectedExcludedAreas(selectedExcludedAreas.filter(a => a !== area));
    } else {
      setSelectedExcludedAreas([...selectedExcludedAreas, area]);
    }
  };
  
  return (
    <div className="space-y-8">
      {/* Learning Style Selection */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-[#13294B]">1. Your Learning Style</h2>
        <p className="text-gray-600">Select how you prefer to learn new information</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {learningStyleOptions.map((style) => (
            <div
              key={style.value}
              className={`border rounded-md p-4 cursor-pointer transition-colors ${
                selectedLearningStyle === style.value
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-200'
              }`}
              onClick={() => setSelectedLearningStyle(style.value as LearningStyle)}
            >
              <h3 className="font-medium">{style.label}</h3>
              <p className="text-sm text-gray-600 mt-1">{style.description}</p>
            </div>
          ))}
        </div>
      </div>
      
      {/* Time Commitment */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-[#13294B]">2. Your Time Commitment</h2>
        <p className="text-gray-600">How much time can you dedicate to studying each week?</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {timeCommitmentOptions.map((option) => (
            <div
              key={option.value}
              className={`border rounded-md p-4 cursor-pointer transition-colors ${
                selectedTimeCommitment === option.value
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-200'
              }`}
              onClick={() => setSelectedTimeCommitment(option.value as TimeCommitment)}
            >
              <h3 className="font-medium">{option.label}</h3>
              <p className="text-sm text-gray-600 mt-1">{option.description}</p>
            </div>
          ))}
        </div>
      </div>
      
      {/* Focus Areas */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-[#13294B]">3. Focus Areas</h2>
        <p className="text-gray-600">Select the nursing areas you want to focus on</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {studyAreaOptions.map((area) => {
            const isSelected = selectedFocusAreas.includes(area.value);
            const isExcluded = isSelected && selectedExcludedAreas.includes(area.value);
            
            return (
              <div
                key={area.value}
                className={`border rounded-md p-4 transition-colors ${
                  isSelected
                    ? isExcluded
                      ? 'border-yellow-400 bg-yellow-50'
                      : 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-200'
                }`}
              >
                <div className="flex justify-between">
                  <h3 className="font-medium">{area.label}</h3>
                  
                  <div className="space-x-2">
                    <button
                      type="button"
                      className={`px-2 py-1 text-xs rounded-md ${
                        isSelected
                          ? 'bg-blue-500 text-white hover:bg-blue-600'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                      onClick={() => toggleFocusArea(area.value)}
                    >
                      {isSelected ? 'Selected' : 'Select'}
                    </button>
                    
                    {isSelected && (
                      <button
                        type="button"
                        className={`px-2 py-1 text-xs rounded-md ${
                          isExcluded
                            ? 'bg-yellow-400 text-white hover:bg-yellow-500'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                        onClick={() => toggleExcludedArea(area.value)}
                      >
                        {isExcluded ? 'Low Priority' : 'Normal'}
                      </button>
                    )}
                  </div>
                </div>
                
                {studyAreas[area.value] && (
                  <div className="mt-2 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Confidence:</span>
                      <span className={`px-2 py-0.5 rounded text-xs ${
                        studyAreas[area.value].confidenceLevel === 1 ? 'bg-red-100 text-red-700' :
                        studyAreas[area.value].confidenceLevel === 2 ? 'bg-yellow-100 text-yellow-700' :
                        studyAreas[area.value].confidenceLevel === 3 ? 'bg-green-100 text-green-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {studyAreas[area.value].confidenceLevel === 1 ? 'Low' :
                         studyAreas[area.value].confidenceLevel === 2 ? 'Medium' :
                         studyAreas[area.value].confidenceLevel === 3 ? 'High' : 'Not Rated'}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        {selectedFocusAreas.length === 0 && (
          <p className="text-red-500 text-sm">Please select at least one focus area</p>
        )}
      </div>
      
      {/* Difficulty Level */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-[#13294B]">4. Difficulty Level</h2>
        <p className="text-gray-600">Select the overall difficulty level for your learning path</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {difficultyOptions.map((option) => (
            <div
              key={option.value}
              className={`border rounded-md p-4 cursor-pointer transition-colors ${
                selectedDifficulty === option.value
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-200'
              }`}
              onClick={() => setSelectedDifficulty(option.value as DifficultyLevel)}
            >
              <h3 className="font-medium">{option.label}</h3>
              <p className="text-sm text-gray-600 mt-1">{option.description}</p>
            </div>
          ))}
        </div>
      </div>
      
      {/* Days Until Exam (Optional) */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-[#13294B]">5. Days Until Your Exam (Optional)</h2>
        <p className="text-gray-600">Enter the number of days until your exam to better pace your learning</p>
        
        <div className="max-w-xs">
          <input
            type="number"
            min="1"
            max="365"
            value={daysUntilExam}
            onChange={(e) => setDaysUntilExam(e.target.value === '' ? '' : Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Number of days (optional)"
          />
        </div>
      </div>
      
      {/* Submit Button */}
      <div className="pt-4">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!isFormValid || isGenerating}
          className={`px-6 py-3 rounded-md text-white font-medium ${
            isFormValid && !isGenerating
              ? 'bg-blue-600 hover:bg-blue-700'
              : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          {isGenerating ? 'Generating...' : 'Create Learning Path'}
        </button>
      </div>
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import { Slider } from './ui/slider';
import { fetchQuizQuestions } from '../utils/api';
import { QuestionsResponse } from '../types/question';
import { MedicalSpinner } from './ui/medical-spinner';
import { Input } from './ui/input';
import { Switch } from './ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

const questionCategories = [
  'Fundamentals',
  'Medical-Surgical',
  'Cardiovascular',
  'Respiratory',
  'Neurological',
  'Gastrointestinal',
  'Renal',
  'Endocrine',
  'Hematologic',
  'Oncology',
  'Infectious Disease',
  'Pediatric',
  'Obstetric',
  'Maternity',
  'Mental Health',
  'Pharmacology',
  'Critical Care',
  'Emergency',
  'Geriatric',
  'Community Health',
  'Leadership',
  'Ethics',
  'Prioritization'
];

// Define an interface for saved quiz config
interface SavedQuizConfig {
  id: string;
  name: string;
  categories: string[];
  questionCount: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  questionTypes: string[];
  timeLimit: number | null;
  created: number; // timestamp
}

export function QuizGenerator() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [questionCount, setQuestionCount] = useState(10);
  const [difficultyLevel, setDifficultyLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('intermediate');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [, setLocation] = useLocation();
  
  // New state variables
  const [quizName, setQuizName] = useState<string>('');
  const [timeLimit, setTimeLimit] = useState<number | null>(null);
  const [enableTimeLimit, setEnableTimeLimit] = useState<boolean>(false);
  const [savedQuizzes, setSavedQuizzes] = useState<SavedQuizConfig[]>([]);
  const [selectedQuestionTypes, setSelectedQuestionTypes] = useState<string[]>(['mc', 'sata', 'hotspot', 'ordered-response']);
  const [activeTab, setActiveTab] = useState<string>('create');
  const [selectedSavedQuiz, setSelectedSavedQuiz] = useState<string | null>(null);

  // Load saved quizzes from localStorage on component mount
  useEffect(() => {
    const savedQuizzesJson = localStorage.getItem('savedQuizzes');
    if (savedQuizzesJson) {
      try {
        const parsedQuizzes = JSON.parse(savedQuizzesJson);
        if (Array.isArray(parsedQuizzes)) {
          setSavedQuizzes(parsedQuizzes);
        }
      } catch (e) {
        console.error('Failed to parse saved quizzes:', e);
      }
    }
  }, []);

  // Handle checkbox change for categories
  const handleCategoryChange = (category: string, checked: boolean) => {
    if (checked) {
      setSelectedCategories(prev => [...prev, category]);
    } else {
      setSelectedCategories(prev => prev.filter(c => c !== category));
    }
  };

  // Handle question count change
  const handleCountChange = (value: number[]) => {
    setQuestionCount(value[0]);
  };
  
  // Handle question type selection
  const handleQuestionTypeChange = (type: string, checked: boolean) => {
    if (checked) {
      setSelectedQuestionTypes(prev => [...prev, type]);
    } else {
      setSelectedQuestionTypes(prev => prev.filter(t => t !== type));
    }
  };
  
  // Handle time limit toggle
  const handleTimeLimitToggle = (checked: boolean) => {
    setEnableTimeLimit(checked);
    if (!checked) {
      setTimeLimit(null);
    } else {
      setTimeLimit(30); // Default 30 minutes
    }
  };
  
  // Handle time limit change
  const handleTimeLimitChange = (value: string) => {
    const minutes = parseInt(value);
    if (!isNaN(minutes) && minutes > 0) {
      setTimeLimit(minutes);
    }
  };
  
  // Save current quiz configuration
  const saveQuizConfig = () => {
    if (!quizName.trim()) {
      setError('Please provide a name for your quiz.');
      return;
    }
    
    if (selectedCategories.length === 0) {
      setError('Please select at least one category.');
      return;
    }
    
    // Create quiz config
    const newQuizConfig: SavedQuizConfig = {
      id: Date.now().toString(),
      name: quizName.trim(),
      categories: selectedCategories,
      questionCount,
      difficulty: difficultyLevel,
      questionTypes: selectedQuestionTypes,
      timeLimit: enableTimeLimit ? timeLimit : null,
      created: Date.now()
    };
    
    // Add to saved quizzes
    const updatedQuizzes = [...savedQuizzes, newQuizConfig];
    setSavedQuizzes(updatedQuizzes);
    
    // Save to localStorage
    localStorage.setItem('savedQuizzes', JSON.stringify(updatedQuizzes));
    
    // Clear form
    setQuizName('');
    setError(null);
  };
  
  // Load a saved quiz configuration
  const loadSavedQuiz = (quizId: string) => {
    const savedQuiz = savedQuizzes.find(quiz => quiz.id === quizId);
    if (savedQuiz) {
      setSelectedCategories(savedQuiz.categories);
      setQuestionCount(savedQuiz.questionCount);
      setDifficultyLevel(savedQuiz.difficulty);
      setSelectedQuestionTypes(savedQuiz.questionTypes);
      
      if (savedQuiz.timeLimit) {
        setEnableTimeLimit(true);
        setTimeLimit(savedQuiz.timeLimit);
      } else {
        setEnableTimeLimit(false);
        setTimeLimit(null);
      }
      
      setError(null);
      setSelectedSavedQuiz(quizId);
      setActiveTab('create');
    }
  };
  
  // Delete a saved quiz
  const deleteSavedQuiz = (quizId: string) => {
    const updatedQuizzes = savedQuizzes.filter(quiz => quiz.id !== quizId);
    setSavedQuizzes(updatedQuizzes);
    localStorage.setItem('savedQuizzes', JSON.stringify(updatedQuizzes));
    
    if (selectedSavedQuiz === quizId) {
      setSelectedSavedQuiz(null);
    }
  };
  
  // Generate quiz
  const handleGenerateQuiz = async () => {
    try {
      // If no categories selected, show error
      if (selectedCategories.length === 0) {
        setError('Please select at least one category.');
        return;
      }
      
      if (selectedQuestionTypes.length === 0) {
        setError('Please select at least one question type.');
        return;
      }
      
      setIsGenerating(true);
      setError(null);

      // Fetch questions based on selected categories, count, and difficulty level
      const quizData = await fetchQuizQuestions(selectedCategories, questionCount, difficultyLevel);

      if (!quizData.questions || quizData.questions.length === 0) {
        setError('No questions found for the selected categories. Please try different categories or count.');
        setIsGenerating(false);
        return;
      }
      
      // Filter questions by type if specific types are selected
      if (selectedQuestionTypes.length > 0 && selectedQuestionTypes.length < 5) {
        quizData.questions = quizData.questions.filter(q => 
          selectedQuestionTypes.includes(q.type)
        );
        
        // If no questions left after filtering, show error
        if (quizData.questions.length === 0) {
          setError('No questions found for the selected types. Try selecting more question types.');
          setIsGenerating(false);
          return;
        }
      }

      // Store the quiz data in session storage for retrieval on the next page
      sessionStorage.setItem('customQuiz', JSON.stringify(quizData));
      
      // If time limit is enabled, store it too
      if (enableTimeLimit && timeLimit) {
        sessionStorage.setItem('quizTimeLimit', timeLimit.toString());
      } else {
        sessionStorage.removeItem('quizTimeLimit');
      }

      // Navigate to a custom quiz page with the generated quiz
      setLocation('/custom-quiz');
    } catch (error) {
      console.error('Error generating quiz:', error);
      setError('Failed to generate quiz. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="quiz-generator-container">
      <div className="bg-white rounded-lg shadow-md p-6 border-2 border-[#e2e8f0]">
        <h2 className="text-2xl font-bold text-[#13294B] mb-4">Custom Quiz Generator</h2>
        
        {/* Tabs for Create/Saved quizzes */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="create" className="text-base">Create Quiz</TabsTrigger>
            <TabsTrigger value="saved" className="text-base">Saved Quizzes {savedQuizzes.length > 0 && `(${savedQuizzes.length})`}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="create">
            {/* Quiz name for saving */}
            <div className="mb-6">
              <Label htmlFor="quiz-name" className="block mb-2 font-medium">
                Quiz Name (optional, for saving)
              </Label>
              <Input
                id="quiz-name"
                value={quizName}
                onChange={(e) => setQuizName(e.target.value)}
                placeholder="NCLEX Practice Quiz"
                className="w-full"
              />
              {quizName && (
                <div className="flex justify-end mt-2">
                  <Button 
                    size="sm" 
                    onClick={saveQuizConfig}
                    className="text-sm bg-gray-100 text-gray-800 hover:bg-gray-200"
                  >
                    Save Configuration
                  </Button>
                </div>
              )}
            </div>
            
            {/* Question Types */}
            <div className="mb-6">
              <Label className="block mb-3 font-medium text-base">
                Question Types
              </Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 border rounded-md p-3">
                <div className="flex items-center space-x-2 hover:bg-gray-50 p-2 rounded-md">
                  <Checkbox 
                    id="mc-type" 
                    checked={selectedQuestionTypes.includes('mc')}
                    onCheckedChange={(checked) => handleQuestionTypeChange('mc', checked === true)}
                  />
                  <Label htmlFor="mc-type" className="cursor-pointer">
                    Multiple Choice
                  </Label>
                </div>
                <div className="flex items-center space-x-2 hover:bg-gray-50 p-2 rounded-md">
                  <Checkbox 
                    id="sata-type" 
                    checked={selectedQuestionTypes.includes('sata')}
                    onCheckedChange={(checked) => handleQuestionTypeChange('sata', checked === true)}
                  />
                  <Label htmlFor="sata-type" className="cursor-pointer">
                    Select All That Apply
                  </Label>
                </div>
                <div className="flex items-center space-x-2 hover:bg-gray-50 p-2 rounded-md">
                  <Checkbox 
                    id="hotspot-type" 
                    checked={selectedQuestionTypes.includes('hotspot')}
                    onCheckedChange={(checked) => handleQuestionTypeChange('hotspot', checked === true)}
                  />
                  <Label htmlFor="hotspot-type" className="cursor-pointer">
                    Hotspot
                  </Label>
                </div>
                <div className="flex items-center space-x-2 hover:bg-gray-50 p-2 rounded-md">
                  <Checkbox 
                    id="ordered-type" 
                    checked={selectedQuestionTypes.includes('ordered-response')}
                    onCheckedChange={(checked) => handleQuestionTypeChange('ordered-response', checked === true)}
                  />
                  <Label htmlFor="ordered-type" className="cursor-pointer">
                    Ordered Response
                  </Label>
                </div>
              </div>
            </div>
            
            {/* Time Limit */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <Label htmlFor="time-limit-toggle" className="font-medium text-base">
                  Set Time Limit
                </Label>
                <Switch 
                  id="time-limit-toggle" 
                  checked={enableTimeLimit}
                  onCheckedChange={handleTimeLimitToggle}
                />
              </div>
              {enableTimeLimit && (
                <div className="flex items-center space-x-3">
                  <Select 
                    value={timeLimit?.toString() || "30"}
                    onValueChange={handleTimeLimitChange}
                  >
                    <SelectTrigger className="w-36">
                      <SelectValue placeholder="Time Limit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="45">45 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                      <SelectItem value="90">1.5 hours</SelectItem>
                      <SelectItem value="120">2 hours</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="text-sm text-gray-500">
                    {timeLimit === 60 ? '1 hour' : 
                      timeLimit === 90 ? '1.5 hours' : 
                      timeLimit === 120 ? '2 hours' : 
                      `${timeLimit} minutes`}
                  </div>
                </div>
              )}
            </div>
          
            <div className="mb-6">
              <Label className="block mb-3 font-medium text-base">
                Select Categories
              </Label>
              
              <div className="border rounded-md p-2 mb-4">
                <div className="font-medium mb-2 text-[#13294B]">
                  Core Nursing
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  {['Fundamentals', 'Medical-Surgical', 'Pharmacology', 'Leadership'].map((category) => (
                    <div key={category} className="flex items-center space-x-2 hover:bg-gray-50 p-2 rounded-md">
                      <Checkbox 
                        id={category} 
                        checked={selectedCategories.includes(category)}
                        onCheckedChange={(checked) => handleCategoryChange(category, checked === true)}
                      />
                      <Label htmlFor={category} className="cursor-pointer">
                        {category}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="border rounded-md p-2 mb-4">
                <div className="font-medium mb-2 text-[#13294B]">
                  Specialty Areas
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  {['Cardiovascular', 'Respiratory', 'Neurological', 'Gastrointestinal', 'Renal', 'Endocrine', 'Hematologic', 'Oncology', 'Infectious Disease'].map((category) => (
                    <div key={category} className="flex items-center space-x-2 hover:bg-gray-50 p-2 rounded-md">
                      <Checkbox 
                        id={category} 
                        checked={selectedCategories.includes(category)}
                        onCheckedChange={(checked) => handleCategoryChange(category, checked === true)}
                      />
                      <Label htmlFor={category} className="cursor-pointer">
                        {category}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="border rounded-md p-2 mb-4">
                <div className="font-medium mb-2 text-[#13294B]">
                  Population Focus
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  {['Pediatric', 'Obstetric', 'Maternity', 'Mental Health', 'Geriatric', 'Community Health'].map((category) => (
                    <div key={category} className="flex items-center space-x-2 hover:bg-gray-50 p-2 rounded-md">
                      <Checkbox 
                        id={category} 
                        checked={selectedCategories.includes(category)}
                        onCheckedChange={(checked) => handleCategoryChange(category, checked === true)}
                      />
                      <Label htmlFor={category} className="cursor-pointer">
                        {category}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="border rounded-md p-2">
                <div className="font-medium mb-2 text-[#13294B]">
                  Practice Focus
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  {['Critical Care', 'Emergency', 'Ethics', 'Prioritization'].map((category) => (
                    <div key={category} className="flex items-center space-x-2 hover:bg-gray-50 p-2 rounded-md">
                      <Checkbox 
                        id={category} 
                        checked={selectedCategories.includes(category)}
                        onCheckedChange={(checked) => handleCategoryChange(category, checked === true)}
                      />
                      <Label htmlFor={category} className="cursor-pointer">
                        {category}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mb-6">
              <Label htmlFor="question-count" className="block mb-2 font-medium">
                Number of Questions: {questionCount}
              </Label>
              <Slider
                id="question-count"
                defaultValue={[10]}
                max={30}
                min={5}
                step={1}
                onValueChange={handleCountChange}
                className="mb-2"
              />
              <div className="flex justify-between text-sm text-gray-500">
                <span>5</span>
                <span>30</span>
              </div>
            </div>
            
            <div className="mb-8">
              <Label className="block mb-3 font-medium">Difficulty Level</Label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setDifficultyLevel('beginner')}
                  className={`flex flex-col items-center justify-center p-3 rounded-md transition-colors ${difficultyLevel === 'beginner' ? 'bg-green-100 border border-green-300' : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'}`}
                >
                  <div className="w-8 h-8 flex items-center justify-center text-green-600 mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"/>
                      <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
                      <line x1="9" y1="9" x2="9.01" y2="9"/>
                      <line x1="15" y1="9" x2="15.01" y2="9"/>
                    </svg>
                  </div>
                  <span className="font-medium text-sm">Beginner</span>
                  <span className="text-xs text-gray-500 mt-1">Foundation level</span>
                </button>
                
                <button
                  type="button"
                  onClick={() => setDifficultyLevel('intermediate')}
                  className={`flex flex-col items-center justify-center p-3 rounded-md transition-colors ${difficultyLevel === 'intermediate' ? 'bg-blue-100 border border-blue-300' : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'}`}
                >
                  <div className="w-8 h-8 flex items-center justify-center text-blue-600 mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="8" y1="15" x2="16" y2="15"/>
                      <line x1="9" y1="9" x2="9.01" y2="9"/>
                      <line x1="15" y1="9" x2="15.01" y2="9"/>
                    </svg>
                  </div>
                  <span className="font-medium text-sm">Intermediate</span>
                  <span className="text-xs text-gray-500 mt-1">Clinical thinking</span>
                </button>
                
                <button
                  type="button"
                  onClick={() => setDifficultyLevel('advanced')}
                  className={`flex flex-col items-center justify-center p-3 rounded-md transition-colors ${difficultyLevel === 'advanced' ? 'bg-purple-100 border border-purple-300' : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'}`}
                >
                  <div className="w-8 h-8 flex items-center justify-center text-purple-600 mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"/>
                      <path d="M16 16s-1.5-2-4-2-4 2-4 2"/>
                      <line x1="9" y1="9" x2="9.01" y2="9"/>
                      <line x1="15" y1="9" x2="15.01" y2="9"/>
                    </svg>
                  </div>
                  <span className="font-medium text-sm">Advanced</span>
                  <span className="text-xs text-gray-500 mt-1">NCLEX-level</span>
                </button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="saved">
            {savedQuizzes.length === 0 ? (
              <div className="text-center py-8">
                <div className="mb-4 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <polyline points="10 9 9 9 8 9"></polyline>
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Saved Quizzes</h3>
                <p className="text-gray-500 mb-4">Save quiz configurations to quickly create similar quizzes later.</p>
                <Button
                  onClick={() => setActiveTab('create')}
                  className="bg-[#4B9CD3] hover:bg-[#13294B]"
                >
                  Create Your First Quiz
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {savedQuizzes.map((quiz) => (
                  <div 
                    key={quiz.id} 
                    className={`p-4 border rounded-lg transition-all ${selectedSavedQuiz === quiz.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-lg">{quiz.name}</h3>
                        <div className="text-sm text-gray-500 mb-2">
                          {quiz.questionCount} questions • {quiz.difficulty} • {new Date(quiz.created).toLocaleDateString()}
                        </div>
                        <div className="flex flex-wrap gap-1 mb-3">
                          {quiz.categories.slice(0, 3).map((category) => (
                            <span key={category} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                              {category}
                            </span>
                          ))}
                          {quiz.categories.length > 3 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                              +{quiz.categories.length - 3} more
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-1 mb-2">
                          {quiz.questionTypes.map((type) => (
                            <span 
                              key={type} 
                              className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs"
                              title={
                                type === 'mc' ? 'Multiple Choice' : 
                                type === 'sata' ? 'Select All That Apply' : 
                                type === 'hotspot' ? 'Hotspot' : 
                                type === 'ordered-response' ? 'Ordered Response' : 
                                type
                              }
                            >
                              {type === 'mc' ? 'Multiple Choice' : 
                               type === 'sata' ? 'Select All' : 
                               type === 'hotspot' ? 'Hotspot' : 
                               type === 'ordered-response' ? 'Ordered' : 
                               type}
                            </span>
                          ))}
                        </div>
                        {quiz.timeLimit && (
                          <div className="text-xs text-gray-500 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                              <circle cx="12" cy="12" r="10"></circle>
                              <polyline points="12 6 12 12 16 14"></polyline>
                            </svg>
                            Time limit: {quiz.timeLimit === 60 ? '1 hour' : 
                              quiz.timeLimit === 90 ? '1.5 hours' : 
                              quiz.timeLimit === 120 ? '2 hours' : 
                              `${quiz.timeLimit} minutes`}
                          </div>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => loadSavedQuiz(quiz.id)}
                        >
                          Load
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => deleteSavedQuiz(quiz.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 border-gray-200"
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        {isGenerating ? (
          <div className="flex flex-col items-center justify-center space-y-4 py-4">
            <MedicalSpinner type="nurse" size="md" text="Preparing your nursing questions..." />
            <div className="text-sm text-gray-500">
              Selecting {questionCount} questions from {selectedCategories.length === 1 ? 
                selectedCategories[0] : 
                `${selectedCategories.length} nursing categories`}
            </div>
          </div>
        ) : (
          activeTab === 'create' && (
            <Button 
              onClick={handleGenerateQuiz} 
              disabled={isGenerating}
              className="w-full py-6 text-lg font-semibold bg-[#4B9CD3] hover:bg-[#13294B] text-white rounded-md transition-colors"
            >
              Generate Quiz {enableTimeLimit && timeLimit ? `(${timeLimit} min)` : ''}
            </Button>
          )
        )}
      </div>
    </div>
  );
}

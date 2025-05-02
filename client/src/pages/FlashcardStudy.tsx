/**
 * FlashcardStudy Page
 * 
 * A dedicated page for the spaced repetition flashcard system,
 * allowing students to conduct focused study sessions.
 */

import { useState, useEffect } from 'react';
import { useParams, useLocation } from 'wouter';
import { SpacedRepetitionDeck } from '../components/SpacedRepetitionDeck';
import { getSavedFlashcards, getFlashcardStats } from '../utils/flashcardStorage';
import { calculateLearningProgress } from '../utils/spacedRepetition';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { MedicalSpinner } from '../components/ui/medical-spinner';
import { Button } from '../components/ui/button';
import { Progress } from '../components/ui/progress';
import { Calendar } from '../components/ui/calendar';
import { Header } from '../components/ui/header';
import { Sidebar } from '../components/ui/sidebar';

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric', 
  }).format(date);
}

export default function FlashcardStudy() {
  const [params] = useParams();
  const [, setLocation] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('study');
  const [stats, setStats] = useState<any>({
    lastStudyDate: null,
    studyStreak: 0,
    totalReviewed: 0,
    studyDates: [],
  });
  const [learningProgress, setLearningProgress] = useState({
    masteryPercentage: 0,
    reviewedCount: 0,
    masteredCount: 0,
    dueCount: 0,
    averageEasinessFactor: 2.5,
  });
  const [category, setCategory] = useState<string | undefined>(undefined);
  const [categoryCounts, setCategoryCounts] = useState<{[key: string]: number}>({});
  
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        
        // Get study stats
        const studyStats = getFlashcardStats();
        setStats(studyStats);
        
        // Get flashcards
        const flashcards = getSavedFlashcards();
        
        // Calculate learning progress
        const progress = calculateLearningProgress(flashcards);
        setLearningProgress(progress);
        
        // Calculate category counts
        const counts: {[key: string]: number} = {};
        flashcards.forEach(card => {
          const category = card.category;
          counts[category] = (counts[category] || 0) + 1;
        });
        setCategoryCounts(counts);
      } catch (error) {
        console.error('Error loading flashcard data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  const handleCategorySelect = (category: string | undefined) => {
    setCategory(category);
    setActiveTab('study');
  };
  
  // Format the study dates for the calendar
  const studyDateObjects = stats.studyDates?.map((dateStr: string) => new Date(dateStr)) || [];
  
  // Loading state
  if (isLoading) {
    return (
      <div className="bg-[#f0f2f5] font-sans text-[#333333] min-h-screen neuro-noise">
        <Header toggleSidebar={toggleSidebar} />
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <div className="flex min-h-screen pt-16">
          <main className="flex-1 p-4 md:p-6 lg:pl-72 overflow-auto w-full">
            <div className="flex justify-center items-center min-h-[60vh]">
              <MedicalSpinner type="nurse" size="lg" text="Loading your flashcard data..." />
            </div>
          </main>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-[#f0f2f5] font-sans text-[#333333] min-h-screen neuro-noise">
      <Header toggleSidebar={toggleSidebar} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex min-h-screen pt-16">
        <main className="flex-1 p-4 md:p-6 lg:pl-72 overflow-auto w-full">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <h1 className="text-3xl font-bold text-[#13294B]">
                Spaced Repetition Flashcards
                {category && (
                  <span className="ml-2 text-lg font-normal text-gray-500">({category})</span>
                )}
              </h1>
              
              <div className="mt-3 md:mt-0">
                <Button 
                  onClick={() => setCategory(undefined)} 
                  variant="outline"
                  className="mr-2"
                  disabled={!category}
                >
                  All Categories
                </Button>
                <Button 
                  onClick={() => setActiveTab(activeTab === 'study' ? 'stats' : 'study')}
                  className="bg-[#4B9CD3] hover:bg-[#13294B] text-white"
                >
                  {activeTab === 'study' ? 'View Stats' : 'Study Now'}
                </Button>
              </div>
            </div>
            
            <Tabs defaultValue="study" value={activeTab} onValueChange={setActiveTab} className="mb-6">
              <TabsList className="mb-6 inline-flex flex-nowrap p-1 bg-white shadow-md rounded-lg border-2 border-[#e2e8f0] min-w-fit">
                <TabsTrigger 
                  value="study"
                  className="whitespace-nowrap px-4 py-2 font-medium text-sm rounded-md bg-gray-50 data-[state=active]:bg-[#4B9CD3] data-[state=active]:text-white"
                >
                  Study
                </TabsTrigger>
                <TabsTrigger 
                  value="stats"
                  className="whitespace-nowrap px-4 py-2 font-medium text-sm rounded-md bg-gray-50 data-[state=active]:bg-[#4B9CD3] data-[state=active]:text-white"
                >
                  Statistics
                </TabsTrigger>
                <TabsTrigger 
                  value="categories"
                  className="whitespace-nowrap px-4 py-2 font-medium text-sm rounded-md bg-gray-50 data-[state=active]:bg-[#4B9CD3] data-[state=active]:text-white"
                >
                  Categories
                </TabsTrigger>
              </TabsList>
              
              {/* Study Tab */}
              <TabsContent value="study" className="mt-0">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left Column - Today's Stats */}
                  <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                      <h3 className="text-lg font-bold text-[#13294B] mb-4">Today's Learning</h3>
                      
                      <div className="space-y-4">
                        <div className="flex items-center">
                          <div className="w-12 h-12 flex items-center justify-center bg-blue-100 rounded-full text-blue-700">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
                              <path d="m9 12 2 2 4-4"/>
                            </svg>
                          </div>
                          <div className="ml-4">
                            <p className="text-sm text-gray-500">Study Streak</p>
                            <p className="text-xl font-bold">{stats.studyStreak} days</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center">
                          <div className="w-12 h-12 flex items-center justify-center bg-green-100 rounded-full text-green-700">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M12 20V10"/>
                              <path d="m18 14-6-6-6 6"/>
                              <path d="M8 4h8"/>
                            </svg>
                          </div>
                          <div className="ml-4">
                            <p className="text-sm text-gray-500">Mastery Progress</p>
                            <p className="text-xl font-bold">{learningProgress.masteryPercentage}%</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center">
                          <div className="w-12 h-12 flex items-center justify-center bg-purple-100 rounded-full text-purple-700">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M2 18h1.4c1.3 0 2.5-.6 3.3-1.7l6.1-8.6c.7-1.1 2-1.7 3.3-1.7H22"/>
                              <path d="m18 2 4 4-4 4"/>
                              <path d="M2 6h1.9c1.5 0 2.9.9 3.6 2.2"/>
                              <path d="M22 18h-5.9c-1.3 0-2.6-.7-3.3-1.8l-.5-.8"/>
                              <path d="m18 14 4 4-4 4"/>
                            </svg>
                          </div>
                          <div className="ml-4">
                            <p className="text-sm text-gray-500">Cards to Review</p>
                            <p className="text-xl font-bold">{learningProgress.dueCount}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-6">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Overall Progress</span>
                          <span>{learningProgress.masteredCount} of {learningProgress.reviewedCount + learningProgress.dueCount}</span>
                        </div>
                        <Progress value={learningProgress.masteryPercentage} className="h-2" />
                      </div>
                    </div>
                    
                    <div className="bg-white p-6 rounded-lg shadow-md">
                      <h3 className="text-lg font-bold text-[#13294B] mb-4">Study Calendar</h3>
                      <Calendar 
                        mode="multiple"
                        selected={studyDateObjects}
                        className="rounded-md border"
                        disabled={(date) => {
                          // Disable future dates
                          return date > new Date();
                        }}
                      />
                      <p className="text-sm text-gray-500 mt-2">
                        Your study streak: {stats.studyStreak} days
                      </p>
                    </div>
                  </div>
                  
                  {/* Right Column - Flashcard Deck */}
                  <div className="lg:col-span-2">
                    <SpacedRepetitionDeck 
                      initialCategory={category}
                      limitCards={10}
                      onComplete={() => {
                        // Refresh stats after completing a session
                        const studyStats = getFlashcardStats();
                        setStats(studyStats);
                        const flashcards = getSavedFlashcards();
                        const progress = calculateLearningProgress(flashcards);
                        setLearningProgress(progress);
                      }}
                    />
                  </div>
                </div>
              </TabsContent>
              
              {/* Stats Tab */}
              <TabsContent value="stats" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <p className="text-sm text-gray-500">Total Cards</p>
                    <p className="text-2xl font-bold text-[#13294B]">
                      {learningProgress.reviewedCount + learningProgress.dueCount}
                    </p>
                  </div>
                  
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <p className="text-sm text-gray-500">Mastered Cards</p>
                    <p className="text-2xl font-bold text-green-600">
                      {learningProgress.masteredCount}
                    </p>
                  </div>
                  
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <p className="text-sm text-gray-500">Due for Review</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {learningProgress.dueCount}
                    </p>
                  </div>
                  
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <p className="text-sm text-gray-500">Study Streak</p>
                    <p className="text-2xl font-bold text-purple-600">
                      {stats.studyStreak} days
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-bold text-[#13294B] mb-4">Learning Progress</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Mastery Progress</span>
                          <span>{learningProgress.masteryPercentage}%</span>
                        </div>
                        <Progress value={learningProgress.masteryPercentage} className="h-3" />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mt-6">
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-500">Average Recall Ease</p>
                          <p className="text-xl font-bold text-[#13294B]">
                            {learningProgress.averageEasinessFactor.toFixed(1)}
                          </p>
                        </div>
                        
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-500">Total Reviewed</p>
                          <p className="text-xl font-bold text-[#13294B]">
                            {stats.totalReviewed}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-bold text-[#13294B] mb-4">Study Activity</h3>
                    
                    <div className="overflow-hidden">
                      <Calendar 
                        mode="multiple"
                        selected={studyDateObjects}
                        className="rounded-md border"
                        disabled={(date) => {
                          return date > new Date();
                        }}
                      />
                    </div>
                    
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">Study tip:</span> Consistent daily practice with spaced repetition is more effective than cramming. Try to maintain your streak!
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              {/* Categories Tab */}
              <TabsContent value="categories" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(categoryCounts).map(([category, count]) => (
                    <div key={category} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-[#13294B]">{category}</h3>
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          {count} cards
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mt-2">
                        Click to study only this category
                      </p>
                      <Button
                        onClick={() => handleCategorySelect(category)}
                        className="w-full mt-4 bg-[#4B9CD3] hover:bg-[#13294B] text-white"
                      >
                        Study {category}
                      </Button>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
}

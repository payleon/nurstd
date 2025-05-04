import { useState, lazy, Suspense, useEffect } from "react";
import { Header } from "@/components/ui/header";
import { Sidebar } from "@/components/ui/sidebar";
import { TestList } from "@/components/TestList";
import { LearningRecommendations } from "@/components/LearningRecommendations";
import { LearningAchievementsSection } from "@/components/LearningAchievementsSection";
import { LearningProgressChart } from "@/components/progress/LearningProgressChart";
import { EnhancedDashboard } from "@/components/dashboard/EnhancedDashboard";
import { Test } from "@shared/schema";
import { MessageCircle, Loader2 } from "lucide-react";
import { lazyImport } from "@/lib/lazyImport";
import { useBadges } from "@/contexts/BadgeContext";
import { SimpleTestViewer } from "@/components/SimpleTestViewer";
import { useLocation } from "wouter";
import { fetchTest } from "@/lib/api";

// Lazy load heavier components that aren't needed on initial render
const { TestView } = lazyImport(() => import("@/components/TestView"), "TestView");
const { QuestionTestView } = lazyImport(() => import("@/components/QuestionTestView"), "QuestionTestView");

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedTest, setSelectedTest] = useState<Test | null>(null);
  const [useQuestionDB, setUseQuestionDB] = useState(false);
  const [location] = useLocation();
  const [loading, setLoading] = useState(false);
  // Get user stats from the badge context
  const { userStats, unlockedBadges } = useBadges();
  
  // Check for testId in URL query parameter or path parameter and load the test if present
  useEffect(() => {
    const loadTestFromUrl = async () => {
      // Extract testId from URL path parameter (/tests/:id)
      const pathMatch = location.match(/\/tests\/(\d+|custom)/);
      
      // Extract testId from URL query parameter
      const searchParams = new URLSearchParams(window.location.search);
      const queryTestId = searchParams.get('testId');
      
      // Handle special "custom" test case
      if (pathMatch && pathMatch[1] === 'custom') {
        // Show custom test builder interface
        console.log('Loading custom test builder');
        // Here you would implement custom test creation logic
        // For now, we'll just show the test list
        return;
      }
      
      // Use path parameter first, fall back to query parameter
      const testId = pathMatch ? pathMatch[1] : queryTestId;
      
      if (testId) {
        try {
          setLoading(true);
          console.log('Loading test from URL with ID:', testId);
          const test = await fetchTest(Number(testId));
          if (test) {
            console.log('Test loaded successfully:', test);
            handleSelectTest(test);
          } else {
            console.error('Test not found with ID:', testId);
          }
        } catch (error) {
          console.error('Error loading test:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    
    loadTestFromUrl();
  }, [location]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSelectTest = (test: Test) => {
    console.log('Test selected:', test);
    setSelectedTest(test);
    // Determine view mode based on test path
    // If it ends with .json, use the QuestionTestView component
    // Otherwise use the TestView component (for HTML content)
    const shouldUseQuestionDB = test.path.endsWith('.json');
    console.log('Using QuestionDB view:', shouldUseQuestionDB, 'for path:', test.path);
    setUseQuestionDB(shouldUseQuestionDB);
    setSidebarOpen(false); // Close sidebar on mobile when a test is selected
  };

  const handleBackToList = () => {
    setSelectedTest(null);
  };

  // Show loading state while fetching test
  if (loading) {
    return (
      <div className="bg-[#f9fafb] font-sans text-[#333333] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mb-4 mx-auto text-[#4B9CD3]" />
          <h2 className="text-xl font-bold text-[#13294B]">Loading your test...</h2>
          <p className="text-gray-600 mt-2">Preparing your exam. This will only take a moment.</p>
        </div>
      </div>
    );
  }
  
  // When in exam mode, use a different layout without header or sidebar
  if (selectedTest) {
    return (
      <div className="bg-[#f9fafb] font-sans text-[#333333] min-h-screen">
        <div className="flex h-screen">
          <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
            {/* For debugging */}
            {/* <SimpleTestViewer test={selectedTest} onBack={handleBackToList} /> */}
            
            {/* Restore original components now that we've fixed the issue */}
            {selectedTest.path.endsWith('.json') ? (
              <QuestionTestView test={selectedTest} onBack={handleBackToList} />
            ) : (
              <TestView test={selectedTest} onBack={handleBackToList} />
            )}
          </main>
        </div>
      </div>
    );
  }

  // Normal layout with header and sidebar for the main dashboard
  return (
    <div className="bg-[#f0f2f5] font-sans text-[#333333] min-h-screen neuro-noise">
      <Header toggleSidebar={toggleSidebar} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex h-screen pt-16">
        <main className="flex-1 p-4 md:p-6 lg:pl-72 overflow-auto">
          <div className="max-w-7xl mx-auto">
            {/* Welcome and Test selection */}
            <div className="mb-6">
              <TestList onSelectTest={handleSelectTest} />
            </div>
            
            {/* Enhanced Dashboard Module */}
            <EnhancedDashboard 
              userStats={{
                streakDays: userStats.streakDays,
                questionsAnswered: userStats.questionsAnswered,
                questionsCorrect: userStats.questionsCorrect
              }}
              unlockedBadges={unlockedBadges}
            />
            
            {/* Legacy Components - can be removed once dashboard fully integrated */}
            <div className="grid grid-cols-1 gap-6 mb-6 mt-8 hidden">
              {/* Learning Progress Chart */}
              <div className="mb-6">
                <LearningProgressChart userStats={userStats} />
              </div>
              
              {/* Learning Achievements */}
              <LearningAchievementsSection 
                currentStreak={userStats.streakDays} 
                totalQuestions={userStats.questionsAnswered}
                correctPercentage={
                  userStats.questionsCorrect > 0 
                    ? Math.round((userStats.questionsCorrect / userStats.questionsAnswered) * 100) 
                    : 0
                }
                badgesEarned={unlockedBadges.length}
                improvementRate={12} // This is a placeholder value - in a real app this would be calculated
              />
              
              <LearningRecommendations />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

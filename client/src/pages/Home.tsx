import { useState, lazy, Suspense } from "react";
import { Header } from "@/components/ui/header";
import { Sidebar } from "@/components/ui/sidebar";
import { TestList } from "@/components/TestList";
import { LearningRecommendations } from "@/components/LearningRecommendations";
import { LearningAchievementsSection } from "@/components/LearningAchievementsSection";
import { LearningProgressChart } from "@/components/progress/LearningProgressChart";
import { Test } from "@shared/schema";
import { MessageCircle, Loader2 } from "lucide-react";
import { lazyImport } from "@/lib/lazyImport";
import { useBadges } from "@/contexts/BadgeContext";

// Lazy load heavier components that aren't needed on initial render
const { TestView } = lazyImport(() => import("@/components/TestView"), "TestView");
const { QuestionTestView } = lazyImport(() => import("@/components/QuestionTestView"), "QuestionTestView");

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedTest, setSelectedTest] = useState<Test | null>(null);
  // Determine view mode based on test path instead of hardcoding
  const [useQuestionDB, setUseQuestionDB] = useState(false);
  // Get user stats from the badge context
  const { userStats, unlockedBadges } = useBadges();

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

  // When in exam mode, use a different layout without header or sidebar
  if (selectedTest) {
    return (
      <div className="bg-[#f9fafb] font-sans text-[#333333] min-h-screen">
        <div className="flex h-screen">
          <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
            {useQuestionDB ? (
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
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 gap-6 mb-6">
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
            </div>
            
            <TestList onSelectTest={handleSelectTest} />
            <LearningRecommendations />
          </div>
        </main>
      </div>
    </div>
  );
}

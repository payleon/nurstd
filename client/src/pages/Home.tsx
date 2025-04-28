import { useState } from "react";
import { Header } from "@/components/ui/header";
import { Sidebar } from "@/components/ui/sidebar";
import { TestList } from "@/components/TestList";
import { TestView } from "@/components/TestView";
import { QuestionTestView } from "@/components/QuestionTestView";
import { Test } from "@shared/schema";
import { MessageCircle } from "lucide-react";

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedTest, setSelectedTest] = useState<Test | null>(null);
  // Determine view mode based on test path instead of hardcoding
  const [useQuestionDB, setUseQuestionDB] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSelectTest = (test: Test) => {
    setSelectedTest(test);
    // Determine view mode based on test path
    // If it contains all_questions.json, use the QuestionTestView component
    // Otherwise use the TestView component (for HTML content)
    setUseQuestionDB(test.path.includes('all_questions.json'));
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
            <TestList onSelectTest={handleSelectTest} />
          </div>
        </main>
      </div>
    </div>
  );
}

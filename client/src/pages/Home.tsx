import { useState } from "react";
import { Header } from "@/components/ui/header";
import { Sidebar } from "@/components/ui/sidebar";
import { TestList } from "@/components/TestList";
import { TestView } from "@/components/TestView";
import { Test } from "@shared/schema";
import { MessageCircle } from "lucide-react";

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedTest, setSelectedTest] = useState<Test | null>(null);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSelectTest = (test: Test) => {
    setSelectedTest(test);
    setSidebarOpen(false); // Close sidebar on mobile when a test is selected
  };

  const handleBackToList = () => {
    setSelectedTest(null);
  };

  // When in exam mode, use a different layout without header or sidebar
  if (selectedTest) {
    return (
      <div className="bg-[#f8f9fa] font-sans text-[#333333] min-h-screen">
        <div className="flex h-screen">
          <main className="flex-1 p-4 overflow-auto">
            <TestView test={selectedTest} onBack={handleBackToList} />
          </main>
        </div>
      </div>
    );
  }

  // Normal layout with header and sidebar for the main dashboard
  return (
    <div className="bg-[#f8f9fa] font-sans text-[#333333] min-h-screen">
      <Header toggleSidebar={toggleSidebar} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex h-screen pt-14">
        <main className="flex-1 p-4 lg:pl-64 overflow-auto">
          <TestList onSelectTest={handleSelectTest} />
        </main>
      </div>

      {/* Chat/Help Button */}
      <div className="fixed bottom-6 right-6 z-10">
        <button className="bg-[#4B9CD3] text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center relative">
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
            1
          </span>
          <MessageCircle className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
}

import { Switch, Route, Link } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BadgeProvider } from "@/contexts/BadgeContext";
import { useState } from "react";
import { Header } from "@/components/ui/header";
import { Sidebar } from "@/components/ui/sidebar";
import { Loader2 } from "lucide-react";

// Import all pages directly to avoid issues with code splitting for now
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Achievements from "@/pages/Achievements";
import Profile from "@/pages/Profile";
import CaseStudies from "@/pages/CaseStudies";
import CaseStudyDetail from "@/pages/CaseStudyDetail";
import QuestionBank from "@/pages/QuestionBank";
import StudyStrategies from "@/pages/StudyStrategies";
import LearningProgress from "@/pages/LearningProgress";

// Create a placeholder component for routes that aren't fully implemented yet
function PlaceholderPage({ name }: { name: string }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  return (
    <div className="bg-[#f0f2f5] font-sans text-[#333333] min-h-screen neuro-noise">
      <Header toggleSidebar={toggleSidebar} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex h-screen pt-16">
        <main className="flex-1 p-4 md:p-6 lg:pl-72 overflow-auto">
          <div className="max-w-5xl mx-auto">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl mx-auto text-center mt-8">
              <h1 className="text-2xl font-bold text-[#13294B] mb-4">{name}</h1>
              <p className="text-gray-600 mb-6">
                This section is coming soon! We're working hard to bring you the best learning resources for your nursing exam preparation.
              </p>
              <Link href="/" className="inline-block bg-[#4B9CD3] text-white px-4 py-2 rounded-md font-medium hover:bg-[#3d7eaa] transition-colors cursor-pointer">
                Return to Practice Exams
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/achievements" component={Achievements} />
      <Route path="/profile" component={Profile} />
      
      {/* Study Materials */}
      <Route path="/question-bank" component={QuestionBank} />
      <Route path="/case-studies" component={CaseStudies} />
      <Route path="/case-study/:id" component={CaseStudyDetail} />
      <Route path="/nclex-questions" component={QuestionBank} />
      <Route path="/study-strategies" component={StudyStrategies} />
      <Route path="/learning-progress" component={LearningProgress} />
      
      {/* Content Review */}
      <Route path="/content/medical-surgical">
        {() => <PlaceholderPage name="Medical-Surgical Review" />}
      </Route>
      <Route path="/content/obstetrics">
        {() => <PlaceholderPage name="Obstetrics Review" />}
      </Route>
      <Route path="/content/pediatrics">
        {() => <PlaceholderPage name="Pediatrics Review" />}
      </Route>
      <Route path="/content/pharmacology">
        {() => <PlaceholderPage name="Pharmacology Review" />}
      </Route>
      
      {/* Resources */}
      <Route path="/resources/videos">
        {() => <PlaceholderPage name="Video Tutorials" />}
      </Route>
      <Route path="/resources/planner">
        {() => <PlaceholderPage name="Study Planner" />}
      </Route>
      
      {/* Catch-all for not found */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BadgeProvider>
          <Toaster />
          <Router />
        </BadgeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

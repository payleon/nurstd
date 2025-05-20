import { Switch, Route, Link } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import * as RadixTooltip from '@radix-ui/react-tooltip';
import { BadgeProvider } from "@/contexts/BadgeContext";

import { useState, Suspense, lazy, useEffect } from "react";
import { Header } from "@/components/ui/header";
import { Sidebar } from "@/components/ui/sidebar";
import { Loader2 } from "lucide-react";
import { LazyRoute } from "@/components/LazyRoute";
import PerformanceOptimizer from "@/components/performance/PerformanceOptimizer";

// Lazy load page components
const Home = lazy(() => import("@/pages/Home"));
const NotFound = lazy(() => import("@/pages/not-found"));
const Achievements = lazy(() => import("@/pages/Achievements"));
const Profile = lazy(() => import("@/pages/Profile"));
const ExamsAndStudies = lazy(() => import("@/pages/ExamsAndStudies"));
const CaseStudyDetail = lazy(() => import("@/pages/CaseStudyDetail"));
const StudyStrategies = lazy(() => import("@/pages/StudyStrategies"));
const StudyTimer = lazy(() => import("@/pages/StudyTimer"));
const Games = lazy(() => import("@/pages/Games"));
const LearningProgress = lazy(() => import("@/pages/LearningProgress"));
const TooltipDemo = lazy(() => import("@/pages/TooltipDemo"));
const FlashcardStudy = lazy(() => import("@/pages/FlashcardStudy"));
const LearningPaths = lazy(() => import("@/pages/learning-paths"));
const CreateLearningPath = lazy(() => import("@/pages/create-learning-path"));
const LearningPath = lazy(() => import("@/pages/learning-path"));
const AdvancedExamPage = lazy(() => import("@/pages/AdvancedExamPage"));

// Importing the CustomQuizView component
const CustomQuizView = lazy(() => import("@/components/CustomQuizView").then(module => ({ default: module.CustomQuizView })));

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
      {/* Critical paths should be preloaded */}
      <LazyRoute path="/" component={Home} preload={true} />
      <LazyRoute path="/achievements" component={Achievements} />
      <LazyRoute path="/profile" component={Profile} />
      
      {/* Study Materials */}
      <LazyRoute path="/case-studies" component={ExamsAndStudies} preload={true} />
      <LazyRoute path="/exams-and-studies" component={ExamsAndStudies} preload={true} />
      <LazyRoute path="/case-study/:id" component={CaseStudyDetail} />
      <LazyRoute path="/tests/:id" component={Home} preload={true} />
      <LazyRoute path="/advanced-exam/:id" component={AdvancedExamPage} />
      {/* Redirects from old paths to new path */}
      <Route path="/question-bank">
        {() => {
          // Redirect to unified exams and studies page
          window.location.href = '/exams-and-studies';
          return null;
        }}
      </Route>
      <Route path="/nclex-questions">
        {() => {
          // Redirect to unified exams and studies page
          window.location.href = '/exams-and-studies';
          return null;
        }}
      </Route>
      <LazyRoute path="/study-strategies" component={StudyStrategies} />
      <LazyRoute path="/study-timer" component={StudyTimer} />
      <LazyRoute path="/games" component={Games} preload={true} />
      <LazyRoute path="/learning-progress" component={LearningProgress} />
      <LazyRoute path="/tooltip-demo" component={TooltipDemo} />
      <LazyRoute path="/custom-quiz" component={CustomQuizView} />
      <LazyRoute path="/flashcards" component={FlashcardStudy} />
      <LazyRoute path="/learning-paths" component={LearningPaths} />
      <LazyRoute path="/create-learning-path" component={CreateLearningPath} />
      <LazyRoute path="/learning-path/:id" component={LearningPath} />
      
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
      <LazyRoute path="/:rest*" component={NotFound} />
    </Switch>
  );
}

function App() {
  // Performance optimizations for production build
  const isProduction = process.env.NODE_ENV === 'production';

  return (
    <QueryClientProvider client={queryClient}>
      <RadixTooltip.Provider delayDuration={300}>
        <BadgeProvider>
          {/* Apply performance optimizations in production */}
          {isProduction && <PerformanceOptimizer />}
          <Toaster />
          <Router />
        </BadgeProvider>
      </RadixTooltip.Provider>
    </QueryClientProvider>
  );
}

export default App;

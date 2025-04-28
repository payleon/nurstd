import { Switch, Route, Link } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BadgeProvider } from "@/contexts/BadgeContext";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Achievements from "@/pages/Achievements";

// Create a placeholder component for routes that aren't fully implemented yet
function PlaceholderPage({ name }: { name: string }) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#f0f2f5]">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-[#13294B] mb-4">{name}</h1>
        <p className="text-gray-600 mb-6">
          This section is coming soon! We're working hard to bring you the best learning resources for your nursing exam preparation.
        </p>
        <Link href="/" className="inline-block bg-[#4B9CD3] text-white px-4 py-2 rounded-md font-medium hover:bg-[#3d7eaa] transition-colors cursor-pointer">
          Return Home
        </Link>
      </div>
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/achievements" component={Achievements} />
      
      {/* Study Materials */}
      <Route path="/questions">
        {() => <PlaceholderPage name="Question Bank" />}
      </Route>
      <Route path="/case-studies">
        {() => <PlaceholderPage name="Case Studies" />}
      </Route>
      <Route path="/nclex-questions">
        {() => <PlaceholderPage name="NCLEX-Style Questions" />}
      </Route>
      <Route path="/study-strategies">
        {() => <PlaceholderPage name="Study Strategies" />}
      </Route>
      
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

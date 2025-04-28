import React, { useState } from 'react';
import { useRoute, useLocation } from 'wouter';
import { CaseStudyViewer } from '../components/CaseStudyViewer';
import { Header } from '../components/ui/header';
import { Sidebar } from '../components/ui/sidebar';

export default function CaseStudyDetail() {
  const [, params] = useRoute('/case-study/:id');
  const [, setLocation] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const caseStudyId = params?.id || '';
  
  const handleBack = () => {
    setLocation('/case-studies');
  };
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  return (
    <div className="bg-[#f0f2f5] font-sans text-[#333333] min-h-screen neuro-noise">
      <Header toggleSidebar={toggleSidebar} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex h-screen pt-16">
        <main className="flex-1 p-4 md:p-6 lg:pl-72 overflow-auto">
          <CaseStudyViewer caseStudyId={caseStudyId} onBack={handleBack} />
        </main>
      </div>
    </div>
  );
}
import React, { useState } from 'react';
import { PageHeader, PageHeaderHeading, PageHeaderDescription } from '@/components/ui/page-header';
import { LearningPathView } from '@/components/learning/LearningPathView';
import { Sidebar } from '@/components/ui/sidebar';
import { Header } from '@/components/ui/header';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';

export default function LearningPath() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [_, navigate] = useLocation();
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  const handleCreateNew = () => {
    navigate('/create-learning-path');
  };
  
  return (
    <div className="bg-[#f0f2f5] font-sans text-[#333333] min-h-screen neuro-noise">
      <Header toggleSidebar={toggleSidebar} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex h-screen pt-16">
        <main className="flex-1 p-4 md:p-6 lg:pl-72 overflow-auto">
          <div className="max-w-5xl mx-auto space-y-6">
            <div className="flex justify-between items-center mb-8">
              <PageHeader>
                <PageHeaderHeading>Your Learning Path</PageHeaderHeading>
                <PageHeaderDescription>
                  Follow your personalized study plan optimized for your learning style and goals
                </PageHeaderDescription>
              </PageHeader>
              
              <Button onClick={handleCreateNew} className="whitespace-nowrap">
                Create New Path
              </Button>
            </div>
            
            <LearningPathView />
          </div>
        </main>
      </div>
    </div>
  );
}
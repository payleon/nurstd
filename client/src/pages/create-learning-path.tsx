import React, { useState } from 'react';
import { PageHeader, PageHeaderHeading, PageHeaderDescription } from '@/components/ui/page-header';
import { LearningPathForm } from '@/components/learning/LearningPathForm';
import { Sidebar } from '@/components/ui/sidebar';
import { Header } from '@/components/ui/header';

export default function CreateLearningPath() {
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
          <div className="max-w-5xl mx-auto space-y-6">
            <PageHeader className="mb-8">
              <PageHeaderHeading>Personalized Learning Path</PageHeaderHeading>
              <PageHeaderDescription>
                Create a custom learning path based on your preferences, learning style, and study goals
              </PageHeaderDescription>
            </PageHeader>
            
            <LearningPathForm />
          </div>
        </main>
      </div>
    </div>
  );
}
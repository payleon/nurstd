import React, { useState } from 'react';
import { Header } from '@/components/ui/header';
import { Sidebar } from '@/components/ui/sidebar';
import { NCLEXGameHub } from '@/components/games/NCLEXGameHub';

export default function Games() {
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
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-[#13294B]">NCLEX Learning Games</h1>
              <p className="text-gray-600 mt-2">
                Interactive games to make your NCLEX preparation more engaging and effective.
              </p>
            </div>
            
            <NCLEXGameHub />
          </div>
        </main>
      </div>
    </div>
  );
}
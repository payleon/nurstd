import React from 'react';
import { cn } from "@/lib/utils";

interface ContentContainerProps {
  children: React.ReactNode;
  isSidebarOpen: boolean;
  className?: string;
}

export function ContentContainer({ 
  children, 
  isSidebarOpen, 
  className = "" 
}: ContentContainerProps) {
  return (
    <div className="flex h-screen pt-16">
      <main 
        className={cn(
          "flex-1 p-4 md:p-6 overflow-auto transition-all duration-300 ease-in-out",
          isSidebarOpen ? "lg:pl-72" : "lg:pl-8",
          className
        )}
      >
        <div className="max-w-5xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
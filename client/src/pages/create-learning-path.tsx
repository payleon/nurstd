import React from 'react';
import { useLocation } from 'wouter';
import { ArrowLeft } from 'lucide-react';
import { LearningPathForm } from '@/components/learning/LearningPathForm';

// Local Link component that works with wouter
const Link = ({ href, children }: { href: string; children: React.ReactNode }) => {
  const [_, setLocation] = useLocation();
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setLocation(href);
  };
  
  return (
    <a href={href} onClick={handleClick}>
      {children}
    </a>
  );
};

export default function CreateLearningPathPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="mb-6">
        <Link href="/learning-paths">
          <a className="text-gray-600 hover:text-blue-600 flex items-center">
            <ArrowLeft className="h-5 w-5 mr-1" />
            <span>Back to Learning Paths</span>
          </a>
        </Link>
        
        <h1 className="text-3xl font-bold mt-4 text-[#13294B]">Create Learning Path</h1>
        <p className="text-gray-600 mt-1">
          Customize your learning experience by creating a personalized study path based on your preferences
        </p>
      </div>
      
      <LearningPathForm />
    </div>
  );
}
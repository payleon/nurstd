import React from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { LearningPathForm } from '@/components/learning/LearningPathForm';

export default function CreateLearningPathPage() {
  return (
    <div className="container mx-auto px-4 py-6">
      <PageHeader 
        title="Create Personalized Learning Path" 
        description="Create a personalized NCLEX learning path based on your preferences, learning style, and study needs."
        showBackButton={true}
        backButtonUrl="/learning-path"
      />
      <div className="mt-8">
        <LearningPathForm />
      </div>
    </div>
  );
}
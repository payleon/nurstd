import React from 'react';
import { PageHeader, PageHeaderDescription, PageHeaderHeading } from '@/components/ui/page-header';
import { LearningPathForm } from '@/components/learning/LearningPathForm';

export default function CreateLearningPathPage() {
  return (
    <div className="container py-8 max-w-6xl">
      <PageHeader className="mb-8">
        <PageHeaderHeading>Create Learning Path</PageHeaderHeading>
        <PageHeaderDescription>
          Design a personalized learning path that matches your learning style and study goals.
        </PageHeaderDescription>
      </PageHeader>
      
      <LearningPathForm />
    </div>
  );
}
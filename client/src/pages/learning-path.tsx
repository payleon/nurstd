import React from 'react';
import { PageHeader, PageHeaderDescription, PageHeaderHeading } from '@/components/ui/page-header';
import { LearningPathView } from '@/components/learning/LearningPathView';

export default function LearningPathPage() {
  return (
    <div className="container py-8 max-w-6xl">
      <PageHeader className="mb-8">
        <PageHeaderHeading>Your Learning Path</PageHeaderHeading>
        <PageHeaderDescription>
          Track your progress through your personalized NCLEX study journey
        </PageHeaderDescription>
      </PageHeader>
      
      <LearningPathView />
    </div>
  );
}
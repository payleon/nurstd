import React from 'react';
import { Dumbbell, Clock, Target, CheckCircle2, TrendingUp, Trophy } from 'lucide-react';
import { ProgressIndicator } from '@/components/ui/progress-indicator';
import { calculateStudyMetrics } from '@/lib/study-metrics';
import { useStudyProgress } from '@/hooks/useStudyProgress';

export function StudyProgressSummary() {
  const { studyAreas } = useStudyProgress();
  
  // Create a placeholder lastActivity for metrics calculation
  const lastActivity = new Date();
  
  const metrics = calculateStudyMetrics(studyAreas, lastActivity);
  
  return (
    <div className="border-2 border-black bg-white">
      <div className="bg-[#13294B] text-white p-2">
        <h3 className="font-bold text-lg">Your Study Progress</h3>
      </div>
      
      <div className="p-4">
        <div className="mb-4">
          <ProgressIndicator 
            value={metrics.overallProgress} 
            color="primary" 
            size="lg" 
            showLabel 
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="border border-gray-200 rounded-md p-3 bg-gray-50">
            <div className="flex items-center mb-2 gap-2 text-[#13294B]">
              <Target className="h-5 w-5" />
              <span className="font-medium">Questions Attempted</span>
            </div>
            <div className="text-xl font-bold">{metrics.questionsAttempted}</div>
          </div>
          
          <div className="border border-gray-200 rounded-md p-3 bg-gray-50">
            <div className="flex items-center mb-2 gap-2 text-[#13294B]">
              <CheckCircle2 className="h-5 w-5" />
              <span className="font-medium">Correct Rate</span>
            </div>
            <div className="text-xl font-bold">{metrics.correctRate}%</div>
          </div>
        </div>
        
        {/* Focus Areas */}
        {metrics.areasOfFocus.length > 0 && (
          <div className="mb-4">
            <div className="font-medium text-[#13294B] mb-2 flex items-center gap-2">
              <Target className="h-4 w-4" />
              Focus Areas
            </div>
            <div className="flex flex-wrap gap-2">
              {metrics.areasOfFocus.map((area, index) => (
                <span key={index} className="bg-amber-100 text-amber-800 px-2 py-1 rounded text-sm border border-amber-200">
                  {area}
                </span>
              ))}
            </div>
          </div>
        )}
        
        {/* Strong Areas */}
        {metrics.strongAreas.length > 0 && (
          <div className="mb-4">
            <div className="font-medium text-[#13294B] mb-2 flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              Strong Areas
            </div>
            <div className="flex flex-wrap gap-2">
              {metrics.strongAreas.map((area, index) => (
                <span key={index} className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm border border-green-200">
                  {area}
                </span>
              ))}
            </div>
          </div>
        )}
        
        <div className="bg-[#F5F8FF] border border-[#D0DCFF] rounded-md p-3 text-sm text-gray-700">
          <p>
            {metrics.areasOfFocus.length > 0 
              ? `Based on your self-assessment, focus on ${metrics.areasOfFocus.join(', ')} to improve your NCLEX readiness.` 
              : "Complete the self-assessment above to get personalized study recommendations."}
          </p>
        </div>
      </div>
    </div>
  );
}
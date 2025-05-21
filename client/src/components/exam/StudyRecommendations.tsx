import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { BookOpen, Brain, AlertCircle, BookMarked, Award, Layers } from 'lucide-react';
import { Progress } from '../ui/progress';

interface StudyRecommendationsProps {
  weakAreas?: {
    category: string;
    score: number;
    questionCount: number;
  }[];
  examHistory?: {
    examId: number;
    examTitle: string;
    score: number;
    date: string;
  }[];
  timeUntilExam?: number; // days until exam
}

export function StudyRecommendations({
  weakAreas = [],
  examHistory = [],
  timeUntilExam
}: StudyRecommendationsProps) {
  // Sort weak areas by score (ascending)
  const sortedWeakAreas = [...weakAreas].sort((a, b) => a.score - b.score);
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };
  
  // Get study plan based on time until exam
  const getStudyPlan = () => {
    if (!timeUntilExam) return null;
    
    let planType: 'emergency' | 'focused' | 'comprehensive' = 'comprehensive';
    
    if (timeUntilExam <= 7) {
      planType = 'emergency';
    } else if (timeUntilExam <= 30) {
      planType = 'focused';
    }
    
    const plans = {
      emergency: {
        title: 'Emergency Study Plan',
        description: 'One week intensive review focused on high-yield content',
        steps: [
          'Take daily practice exams focusing on your weakest areas',
          'Review rationales for all missed questions',
          'Focus on test-taking strategies and prioritization questions',
          'Memorize critical lab values and medication information',
          'Practice with NCLEX-style questions for 4-6 hours daily'
        ]
      },
      focused: {
        title: 'Focused Study Plan',
        description: '30-day targeted review with structured approach',
        steps: [
          'Take a practice exam every 5 days to track progress',
          'Focus on 1-2 content areas per week, starting with weakest areas',
          'Complete 75-100 practice questions daily',
          'Review content summaries for areas scoring below 70%',
          'Practice prioritization and delegation questions regularly'
        ]
      },
      comprehensive: {
        title: 'Comprehensive Study Plan',
        description: 'Long-term structured approach for thorough preparation',
        steps: [
          'Begin with content review of all major nursing areas',
          'Take weekly practice exams to identify knowledge gaps',
          'Gradually increase question practice from 30 to 100 per day',
          'Use varied question formats including SATA, ordered response, and exhibits',
          'Schedule regular review sessions for previously mastered content'
        ]
      }
    };
    
    return plans[planType];
  };
  
  const studyPlan = getStudyPlan();
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[#13294B]">Study Recommendations</h2>
      
      {/* Study Plan */}
      {studyPlan && (
        <Card className="bg-white border-2 border-blue-100 shadow-md">
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-xl font-bold text-blue-800">{studyPlan.title}</CardTitle>
                <CardDescription className="text-blue-600">{studyPlan.description}</CardDescription>
              </div>
              <Badge className="bg-blue-100 text-blue-800 px-3 py-1 text-xs font-medium border border-blue-200">
                {timeUntilExam} {timeUntilExam === 1 ? 'day' : 'days'} until exam
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {studyPlan.steps.map((step, index) => (
                <li key={index} className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center mr-3 font-medium">
                    {index + 1}
                  </div>
                  <span className="text-gray-700">{step}</span>
                </li>
              ))}
            </ul>
            
            <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700">
              Generate Detailed Study Plan
            </Button>
          </CardContent>
        </Card>
      )}
      
      {/* Focus Areas */}
      {sortedWeakAreas.length > 0 && (
        <Card className="bg-white border-2 border-amber-100 shadow-md">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-bold text-amber-800">
                <AlertCircle className="inline-block mr-2 h-5 w-5" />
                Focus Areas
              </CardTitle>
              <Button variant="outline" className="text-sm border-amber-200 text-amber-800">
                View All
              </Button>
            </div>
            <CardDescription className="text-amber-600">
              Prioritize these topics based on your recent exam performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sortedWeakAreas.slice(0, 3).map((area, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between items-center">
                    <h4 className="font-semibold text-gray-800">{area.category}</h4>
                    <span className="text-sm font-medium text-red-600">{area.score}%</span>
                  </div>
                  <Progress value={area.score} className="h-2 [&>div]:bg-red-500" />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{area.questionCount} questions attempted</span>
                    <span>Target: 75%+</span>
                  </div>
                </div>
              ))}
              
              <div className="pt-2">
                <Button variant="outline" className="w-full border-amber-200 text-amber-800 hover:bg-amber-50">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Start Focused Review
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Recent Exam History */}
      {examHistory.length > 0 && (
        <Card className="bg-white border-2 border-purple-100 shadow-md">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-bold text-purple-800">
                <Layers className="inline-block mr-2 h-5 w-5" />
                Recent Exams
              </CardTitle>
            </div>
            <CardDescription className="text-purple-600">
              Your recent exam history and performance trends
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {examHistory.slice(0, 4).map((exam, index) => (
                <div key={index} className="flex items-center justify-between border-b border-gray-100 pb-2">
                  <div className="flex items-center">
                    <div className={`w-2 h-8 rounded-full mr-3 ${exam.score >= 70 ? 'bg-green-500' : 'bg-amber-500'}`}></div>
                    <div>
                      <h4 className="font-medium text-gray-800">{exam.examTitle}</h4>
                      <span className="text-xs text-gray-500">{formatDate(exam.date)}</span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className={`font-bold text-lg ${exam.score >= 70 ? 'text-green-600' : 'text-amber-600'}`}>
                      {exam.score}%
                    </span>
                    <Button variant="ghost" size="sm" className="ml-2 text-purple-600 h-7 px-2">
                      Review
                    </Button>
                  </div>
                </div>
              ))}
              
              <Button variant="outline" className="w-full mt-2 border-purple-200 text-purple-800 hover:bg-purple-50">
                <Award className="h-4 w-4 mr-2" />
                View All Performance
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Recommended Resources */}
      <Card className="bg-white border-2 border-green-100 shadow-md">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold text-green-800">
              <BookMarked className="inline-block mr-2 h-5 w-5" />
              Recommended Resources
            </CardTitle>
          </div>
          <CardDescription className="text-green-600">
            Curated study materials based on your performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start p-3 bg-green-50 rounded-lg border border-green-100">
              <Brain className="h-5 w-5 text-green-600 mt-1 mr-3 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-gray-800">Prioritization & Delegation Practice</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Focus on clinical judgment and decision-making with 150+ prioritization scenarios.
                </p>
                <Button size="sm" className="mt-2 bg-green-600 hover:bg-green-700 h-8">
                  Start Practice
                </Button>
              </div>
            </div>
            
            <div className="flex items-start p-3 bg-blue-50 rounded-lg border border-blue-100">
              <BookOpen className="h-5 w-5 text-blue-600 mt-1 mr-3 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-gray-800">Med-Surg Concept Review</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Comprehensive content review covering your weak areas in Medical-Surgical nursing.
                </p>
                <Button size="sm" className="mt-2 bg-blue-600 hover:bg-blue-700 h-8">
                  View Content
                </Button>
              </div>
            </div>
            
            <div className="flex items-start p-3 bg-purple-50 rounded-lg border border-purple-100">
              <Layers className="h-5 w-5 text-purple-600 mt-1 mr-3 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-gray-800">Chart/Exhibit Question Practice</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Practice interpreting lab values, medication records, and assessment findings.
                </p>
                <Button size="sm" className="mt-2 bg-purple-600 hover:bg-purple-700 h-8">
                  Start Practice
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
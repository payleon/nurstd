import React, { useState } from 'react';
import { Link } from 'wouter';
import { BookOpen, Brain, ClipboardCheck, Clock, CheckCircle2, ListChecks, BadgeInfo } from 'lucide-react';

export function LearningRecommendations() {
  const [activeTab, setActiveTab] = useState<'weak' | 'daily' | 'principles'>('weak');

  const weaknessAreas = [
    { id: 1, area: 'Pharmacology', progress: 35, icon: <div className="p-2 bg-red-100 rounded-full"><BookOpen className="h-4 w-4 text-red-600" /></div> },
    { id: 2, area: 'Critical Care', progress: 42, icon: <div className="p-2 bg-amber-100 rounded-full"><Brain className="h-4 w-4 text-amber-600" /></div> },
    { id: 3, area: 'Maternal Health', progress: 47, icon: <div className="p-2 bg-amber-100 rounded-full"><ClipboardCheck className="h-4 w-4 text-amber-600" /></div> },
  ];

  const dailyTasks = [
    { id: 1, title: 'Practice 25 Pharmacology Questions', time: '30 mins', completed: false },
    { id: 2, title: 'Review Critical Thinking Principles', time: '15 mins', completed: false },
    { id: 3, title: 'Complete Maternal Health Flashcards', time: '20 mins', completed: false },
    { id: 4, title: 'Study Test-Taking Strategies', time: '15 mins', completed: true },
  ];

  const learningPrinciples = [
    {
      id: 1,
      title: 'Active Recall',
      description: 'Testing yourself is more effective than re-reading material. Try to recall information before checking answers.',
      icon: <Brain className="h-5 w-5 text-blue-600" />
    },
    {
      id: 2,
      title: 'Spaced Repetition',
      description: 'Reviewing material at increasing intervals improves long-term retention. Space out your practice sessions.',
      icon: <Clock className="h-5 w-5 text-blue-600" />
    },
    {
      id: 3,
      title: 'Deliberate Practice',
      description: 'Focus on your weakest areas and practice with purpose. Quality of practice matters more than quantity.',
      icon: <ListChecks className="h-5 w-5 text-blue-600" />
    },
  ];

  return (
    <div className="neuro-card neuro-noise overflow-hidden mt-6">
      <div className="bg-[#13294B] text-white py-3 px-4 uppercase font-bold text-xl neuro-header flex items-center">
        <BadgeInfo className="h-5 w-5 mr-2" />
        Learning Recommendations
      </div>
      
      <div className="bg-white p-4">
        <div className="flex border-b border-gray-200 mb-4">
          <button
            onClick={() => setActiveTab('weak')}
            className={`py-2 px-4 font-medium ${
              activeTab === 'weak' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Improvement Areas
          </button>
          <button
            onClick={() => setActiveTab('daily')}
            className={`py-2 px-4 font-medium ${
              activeTab === 'daily' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Daily Study Plan
          </button>
          <button
            onClick={() => setActiveTab('principles')}
            className={`py-2 px-4 font-medium ${
              activeTab === 'principles' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Learning Principles
          </button>
        </div>
        
        {activeTab === 'weak' && (
          <div>
            <p className="mb-4 text-gray-700">
              Focus on these areas to improve your overall performance. We've analyzed your question history to identify where you need the most help.
            </p>
            <div className="space-y-4">
              {weaknessAreas.map(area => (
                <div key={area.id} className="border-2 border-black p-4 bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      {area.icon}
                      <span className="ml-2 font-bold">{area.area}</span>
                    </div>
                    <span className="text-sm font-medium">{area.progress}% Mastery</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className={`h-2.5 rounded-full ${
                        area.progress < 40 ? 'bg-red-600' : area.progress < 70 ? 'bg-amber-500' : 'bg-green-600'
                      }`} 
                      style={{ width: `${area.progress}%` }}
                    ></div>
                  </div>
                  <div className="mt-3 text-right">
                    <Link href="/question-bank">
                      <button className="bg-[#4B9CD3] text-white px-3 py-1 text-sm font-medium rounded border border-black">
                        Practice Questions
                      </button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 text-center">
              <Link href="/learning-progress">
                <button className="neuro-button-primary">
                  View Full Progress Report
                </button>
              </Link>
            </div>
          </div>
        )}
        
        {activeTab === 'daily' && (
          <div>
            <p className="mb-4 text-gray-700">
              Here is your recommended study plan for today. Complete these tasks to stay on track for your exam preparation.
            </p>
            <div className="space-y-3">
              {dailyTasks.map(task => (
                <div key={task.id} className="flex items-center border-2 border-black p-3 bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  <div className={`flex-shrink-0 h-5 w-5 ${task.completed ? 'text-green-500' : 'text-gray-400'}`}>
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <div className="ml-3 flex-grow">
                    <p className={`font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                      {task.title}
                    </p>
                  </div>
                  <div className="flex-shrink-0 text-sm text-gray-500">
                    {task.time}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-5 text-center">
              <Link href="/study-strategies">
                <button className="neuro-button-primary">
                  Create Personalized Study Plan
                </button>
              </Link>
            </div>
          </div>
        )}
        
        {activeTab === 'principles' && (
          <div>
            <p className="mb-4 text-gray-700">
              These evidence-based learning methods will help you study more effectively and retain information longer.
            </p>
            <div className="space-y-4">
              {learningPrinciples.map(principle => (
                <div key={principle.id} className="border-2 border-black p-4 bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  <div className="flex items-center mb-2">
                    {principle.icon}
                    <h3 className="ml-2 font-bold text-[#13294B]">{principle.title}</h3>
                  </div>
                  <p className="text-gray-700">{principle.description}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 text-center">
              <Link href="/study-strategies">
                <button className="neuro-button-primary">
                  Learn More Study Techniques
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
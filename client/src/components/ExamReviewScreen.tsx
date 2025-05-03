import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { 
  Bar, 
  BarChart, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  Legend
} from "recharts";
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Award, 
  Flag, 
  Printer, 
  Download, 
  ChevronDown, 
  ChevronRight,
  BarChart2,
  PieChart as PieChartIcon,
  ListChecks,
  BookOpen,
  ArrowLeft,
  Share2
} from "lucide-react";
import type { Question } from "../types/question";
import { QuestionRenderer } from "./QuestionRenderer";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";

interface CategoryPerformance {
  category: string;
  correct: number;
  incorrect: number;
  total: number;
  percentage: number;
}

interface ExamReviewScreenProps {
  score: number;
  totalQuestions: number;
  questions: Question[];
  userAnswers: Record<number, string | string[]>;
  answerCorrectness: Record<number, boolean>;
  timeTaken: string;
  onBack: () => void;
  onRetakeExam?: () => void;
}

export function ExamReviewScreen({
  score,
  totalQuestions,
  questions,
  userAnswers,
  answerCorrectness,
  timeTaken,
  onBack,
  onRetakeExam
}: ExamReviewScreenProps) {
  const [selectedQuestionId, setSelectedQuestionId] = useState<number | null>(null);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  
  // Calculate performance metrics
  const percentage = Math.round((score / totalQuestions) * 100);
  const correctAnswers = score;
  const incorrectAnswers = totalQuestions - score;
  const unansweredCount = totalQuestions - Object.keys(userAnswers).length;
  
  // Calculate time metrics
  const timeComponents = timeTaken.split(':');
  const hours = parseInt(timeComponents[0]);
  const minutes = parseInt(timeComponents[1]);
  const seconds = parseInt(timeComponents[2]);
  const totalMinutes = hours * 60 + minutes + seconds / 60;
  const avgTimePerQuestion = totalMinutes / totalQuestions;
  
  // Parse categories from questions and calculate category performance
  const categoryPerformance: Record<string, CategoryPerformance> = {};
  
  questions.forEach((question) => {
    const category = question.category || "Uncategorized";
    
    if (!categoryPerformance[category]) {
      categoryPerformance[category] = {
        category,
        correct: 0,
        incorrect: 0,
        total: 0,
        percentage: 0
      };
    }
    
    categoryPerformance[category].total += 1;
    
    if (answerCorrectness[question.id]) {
      categoryPerformance[category].correct += 1;
    } else if (userAnswers[question.id] !== undefined) {
      categoryPerformance[category].incorrect += 1;
    }
  });
  
  // Calculate percentages for each category
  Object.values(categoryPerformance).forEach((category) => {
    category.percentage = Math.round((category.correct / category.total) * 100);
  });
  
  const sortedCategoryPerformance = Object.values(categoryPerformance).sort(
    (a, b) => b.percentage - a.percentage
  );
  
  // Create data for charts
  const scoreChartData = [
    { name: "Correct", value: correctAnswers, color: "#4ade80" },
    { name: "Incorrect", value: incorrectAnswers, color: "#f87171" },
    { name: "Unanswered", value: unansweredCount, color: "#94a3b8" }
  ];
  
  const categoryChartData = sortedCategoryPerformance.map((category) => ({
    name: category.category,
    correct: category.correct,
    incorrect: category.incorrect,
    unanswered: category.total - category.correct - category.incorrect
  }));
  
  // Determine pass/fail status
  const passingThreshold = 65; // 65% is typically passing for NCLEX
  const isPassing = percentage >= passingThreshold;
  
  // Get strengths and weaknesses (top 2 and bottom 2 categories)
  const strengths = sortedCategoryPerformance.slice(0, 2);
  const weaknesses = [...sortedCategoryPerformance].sort((a, b) => a.percentage - b.percentage).slice(0, 2);
  
  // Find questions by category
  const getQuestionsByCategory = (category: string) => {
    return questions.filter(q => (q.category || "Uncategorized") === category);
  };
  
  // Handle question selection
  const handleQuestionSelect = (questionId: number) => {
    setSelectedQuestionId(questionId === selectedQuestionId ? null : questionId);
  };
  
  // Format time in a user-friendly way
  const formatTime = (time: string) => {
    const [hours, minutes, seconds] = time.split(':').map(Number);
    if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s`;
    }
    return `${minutes}m ${seconds}s`;
  };
  
  return (
    <div className="max-w-7xl mx-auto">
      {/* Header with summary stats */}
      <div className="bg-white rounded-lg border-2 border-gray-200 shadow-md mb-6 overflow-hidden">
        <div className="bg-[#13294B] text-white p-4 flex justify-between items-center">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onBack}
              className="mr-2 text-white hover:bg-[#0A1E3A] hover:text-white"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h2 className="text-xl font-bold">Exam Performance Review</h2>
          </div>
          
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" className="bg-transparent border-white text-white hover:bg-[#0A1E3A] hover:text-white">
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
            <Button variant="outline" size="sm" className="bg-transparent border-white text-white hover:bg-[#0A1E3A] hover:text-white">
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
            <Button variant="outline" size="sm" className="bg-transparent border-white text-white hover:bg-[#0A1E3A] hover:text-white">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {/* Overall Score */}
            <div className="md:col-span-2 flex flex-col items-center justify-center p-6 bg-gray-50 rounded-lg border border-gray-200">
              <div className="text-6xl font-bold mb-2 text-center">
                {percentage}%
              </div>
              <div className="text-sm text-gray-500 mb-3">Overall Score</div>
              
              <div className="w-full max-w-xs mb-4">
                <Progress 
                  value={percentage} 
                  className="h-3"
                  indicatorClassName={isPassing ? "bg-green-500" : "bg-amber-500"}
                />
              </div>
              
              <div className="flex items-center text-sm">
                <Badge variant={isPassing ? "success" : "warning"} className="mr-2">
                  {isPassing ? "PASSING" : "NEEDS IMPROVEMENT"}
                </Badge>
                <span className="text-gray-600">
                  {passingThreshold}% passing threshold
                </span>
              </div>
            </div>
            
            {/* Key Stats */}
            <div className="md:col-span-3">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 rounded-lg border border-blue-100 p-4 flex flex-col items-center justify-center">
                  <div className="text-blue-600 mb-1">
                    <Award className="h-6 w-6" />
                  </div>
                  <div className="text-2xl font-bold text-blue-700">{correctAnswers}</div>
                  <div className="text-xs text-blue-600 mt-1">Correct Answers</div>
                </div>
                
                <div className="bg-red-50 rounded-lg border border-red-100 p-4 flex flex-col items-center justify-center">
                  <div className="text-red-600 mb-1">
                    <XCircle className="h-6 w-6" />
                  </div>
                  <div className="text-2xl font-bold text-red-700">{incorrectAnswers}</div>
                  <div className="text-xs text-red-600 mt-1">Incorrect Answers</div>
                </div>
                
                <div className="bg-amber-50 rounded-lg border border-amber-100 p-4 flex flex-col items-center justify-center">
                  <div className="text-amber-600 mb-1">
                    <Flag className="h-6 w-6" />
                  </div>
                  <div className="text-2xl font-bold text-amber-700">{unansweredCount}</div>
                  <div className="text-xs text-amber-600 mt-1">Unanswered</div>
                </div>
                
                <div className="bg-purple-50 rounded-lg border border-purple-100 p-4 flex flex-col items-center justify-center">
                  <div className="text-purple-600 mb-1">
                    <Clock className="h-6 w-6" />
                  </div>
                  <div className="text-2xl font-bold text-purple-700">{formatTime(timeTaken)}</div>
                  <div className="text-xs text-purple-600 mt-1">Time Taken</div>
                </div>
                
                {/* Additional stats in second row */}
                <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 col-span-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Average Time Per Question</p>
                      <p className="text-xl font-bold text-gray-900">{avgTimePerQuestion.toFixed(1)} minutes</p>
                    </div>
                    <div className="text-gray-400">
                      <Clock className="h-8 w-8" />
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 col-span-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Categories Tested</p>
                      <p className="text-xl font-bold text-gray-900">{Object.keys(categoryPerformance).length}</p>
                    </div>
                    <div className="text-gray-400">
                      <ListChecks className="h-8 w-8" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Detailed Analysis Tabs */}
      <Tabs defaultValue="performance" className="mb-6">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="performance" className="flex items-center justify-center">
            <BarChart2 className="h-4 w-4 mr-2" />
            Performance
          </TabsTrigger>
          <TabsTrigger value="categories" className="flex items-center justify-center">
            <PieChartIcon className="h-4 w-4 mr-2" />
            Categories
          </TabsTrigger>
          <TabsTrigger value="questions" className="flex items-center justify-center">
            <ListChecks className="h-4 w-4 mr-2" />
            Questions
          </TabsTrigger>
          <TabsTrigger value="recommendations" className="flex items-center justify-center">
            <BookOpen className="h-4 w-4 mr-2" />
            Study Plan
          </TabsTrigger>
        </TabsList>
        
        {/* Performance Tab */}
        <TabsContent value="performance" className="p-6 bg-white rounded-lg border-2 border-gray-200 shadow-md mt-4">
          <h3 className="text-xl font-bold mb-6">Overall Performance Analysis</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Score Distribution */}
            <Card className="p-4">
              <h4 className="text-lg font-medium mb-4">Score Distribution</h4>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={scoreChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {scoreChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} questions`, '']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Card>
            
            {/* Time Analysis */}
            <Card className="p-4">
              <h4 className="text-lg font-medium mb-4">Time Performance</h4>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Total Time Spent</p>
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 mr-2 text-purple-600" />
                    <span className="text-2xl font-bold">{formatTime(timeTaken)}</span>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <p className="text-sm text-gray-500 mb-1">Average Time per Question</p>
                  <div className="flex items-center">
                    <span className="text-2xl font-bold">{avgTimePerQuestion.toFixed(1)} minutes</span>
                    <span className="text-sm text-gray-500 ml-2">
                      ({Math.round(avgTimePerQuestion * 60)} seconds)
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Recommended: 1-2 minutes per question for NCLEX-style exams
                  </p>
                </div>
                
                <Separator />
                
                <div>
                  <p className="text-sm text-gray-500 mb-1">Time Efficiency</p>
                  <div className="flex items-center">
                    <span className="text-xl font-bold">
                      {avgTimePerQuestion <= 2 ? "Good" : avgTimePerQuestion <= 3 ? "Average" : "Needs Improvement"}
                    </span>
                    {avgTimePerQuestion <= 2 ? (
                      <CheckCircle2 className="h-5 w-5 ml-2 text-green-600" />
                    ) : (
                      <Flag className="h-5 w-5 ml-2 text-amber-600" />
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {avgTimePerQuestion <= 2 
                      ? "You're managing time well!" 
                      : "Try to improve your time management skills"}
                  </p>
                </div>
              </div>
            </Card>
            
            {/* Strengths */}
            <Card className="p-4">
              <h4 className="text-lg font-medium mb-4 flex items-center">
                <CheckCircle2 className="h-5 w-5 mr-2 text-green-600" />
                Strengths
              </h4>
              <div className="space-y-4">
                {strengths.length > 0 ? (
                  strengths.map((category) => (
                    <div key={category.category} className="bg-green-50 border border-green-100 rounded-lg p-3">
                      <div className="flex justify-between items-center mb-1">
                        <h5 className="font-medium text-green-800">{category.category}</h5>
                        <Badge variant="success">{category.percentage}%</Badge>
                      </div>
                      <div className="flex items-center text-sm text-green-700">
                        <span>{category.correct} correct</span>
                        <span className="mx-2">•</span>
                        <span>{category.incorrect} incorrect</span>
                        <span className="mx-2">•</span>
                        <span>{category.total} total</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 italic">No strengths identified</p>
                )}
              </div>
            </Card>
            
            {/* Areas for Improvement */}
            <Card className="p-4">
              <h4 className="text-lg font-medium mb-4 flex items-center">
                <Flag className="h-5 w-5 mr-2 text-amber-600" />
                Areas for Improvement
              </h4>
              <div className="space-y-4">
                {weaknesses.length > 0 ? (
                  weaknesses.map((category) => (
                    <div key={category.category} className="bg-amber-50 border border-amber-100 rounded-lg p-3">
                      <div className="flex justify-between items-center mb-1">
                        <h5 className="font-medium text-amber-800">{category.category}</h5>
                        <Badge variant="warning">{category.percentage}%</Badge>
                      </div>
                      <div className="flex items-center text-sm text-amber-700">
                        <span>{category.correct} correct</span>
                        <span className="mx-2">•</span>
                        <span>{category.incorrect} incorrect</span>
                        <span className="mx-2">•</span>
                        <span>{category.total} total</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 italic">No weaknesses identified</p>
                )}
              </div>
            </Card>
          </div>
        </TabsContent>
        
        {/* Categories Tab */}
        <TabsContent value="categories" className="p-6 bg-white rounded-lg border-2 border-gray-200 shadow-md mt-4">
          <h3 className="text-xl font-bold mb-6">Performance by Category</h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Category Chart */}
            <div className="lg:col-span-3">
              <Card className="p-4">
                <h4 className="text-lg font-medium mb-4">Category Comparison</h4>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart
                    data={categoryChartData}
                    layout="vertical"
                    margin={{ top: 20, right: 30, left: 100, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" domain={[0, 'dataMax']} />
                    <YAxis type="category" dataKey="name" width={100} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="correct" stackId="a" fill="#4ade80" name="Correct" />
                    <Bar dataKey="incorrect" stackId="a" fill="#f87171" name="Incorrect" />
                    <Bar dataKey="unanswered" stackId="a" fill="#94a3b8" name="Unanswered" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </div>
            
            {/* Category List */}
            <div className="lg:col-span-2">
              <Card className="p-4">
                <h4 className="text-lg font-medium mb-4">Category Breakdown</h4>
                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                  {sortedCategoryPerformance.map((category) => (
                    <div 
                      key={category.category}
                      className="bg-gray-50 border border-gray-200 rounded-lg p-3 cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => setExpandedCategory(
                        expandedCategory === category.category ? null : category.category
                      )}
                    >
                      <div className="flex justify-between items-center">
                        <h5 className="font-medium text-gray-800 flex items-center">
                          {expandedCategory === category.category ? (
                            <ChevronDown className="h-4 w-4 mr-1 text-gray-600" />
                          ) : (
                            <ChevronRight className="h-4 w-4 mr-1 text-gray-600" />
                          )}
                          {category.category}
                        </h5>
                        <Badge 
                          variant={
                            category.percentage >= 80 ? "success" : 
                            category.percentage >= 65 ? "default" : 
                            "warning"
                          }
                        >
                          {category.percentage}%
                        </Badge>
                      </div>
                      
                      <div className="mt-2">
                        <Progress 
                          value={category.percentage} 
                          className="h-2"
                          indicatorClassName={
                            category.percentage >= 80 ? "bg-green-500" : 
                            category.percentage >= 65 ? "bg-blue-500" : 
                            "bg-amber-500"
                          }
                        />
                      </div>
                      
                      <AnimatePresence>
                        {expandedCategory === category.category && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="mt-3 pt-3 border-t border-gray-200 overflow-hidden"
                          >
                            <div className="grid grid-cols-3 gap-2 text-center text-sm">
                              <div className="bg-green-50 p-2 rounded">
                                <div className="font-medium text-green-700">{category.correct}</div>
                                <div className="text-xs text-green-600">Correct</div>
                              </div>
                              <div className="bg-red-50 p-2 rounded">
                                <div className="font-medium text-red-700">{category.incorrect}</div>
                                <div className="text-xs text-red-600">Incorrect</div>
                              </div>
                              <div className="bg-gray-100 p-2 rounded">
                                <div className="font-medium text-gray-700">{category.total}</div>
                                <div className="text-xs text-gray-600">Total</div>
                              </div>
                            </div>
                            
                            <div className="mt-3">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="w-full text-xs"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  // Simulate going to a study plan for this category
                                }}
                              >
                                Review {category.category} Questions
                              </Button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        {/* Questions Tab */}
        <TabsContent value="questions" className="p-6 bg-white rounded-lg border-2 border-gray-200 shadow-md mt-4">
          <h3 className="text-xl font-bold mb-6">Question Analysis</h3>
          
          <Accordion type="single" collapsible className="mb-6">
            <AccordionItem value="missed-questions">
              <AccordionTrigger className="text-lg font-medium">
                <div className="flex items-center">
                  <XCircle className="h-5 w-5 mr-2 text-red-600" /> 
                  <span>Missed Questions ({incorrectAnswers})</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="mt-2 space-y-4">
                  {questions.filter(q => answerCorrectness[q.id] === false).map((question) => (
                    <div 
                      key={question.id}
                      className={`p-4 border ${selectedQuestionId === question.id ? 'border-blue-300 bg-blue-50' : 'border-gray-200 bg-gray-50'} rounded-lg cursor-pointer`}
                      onClick={() => handleQuestionSelect(question.id)}
                    >
                      <div className="flex items-start">
                        <div className="flex-shrink-0 mr-3">
                          <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
                            <XCircle className="h-5 w-5 text-red-600" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <h5 className="font-medium text-gray-900 mb-1">
                            {question.title}
                          </h5>
                          <div className="text-sm text-gray-500 mb-2">
                            {question.category || "Uncategorized"} • Question #{question.id}
                          </div>
                          
                          {selectedQuestionId === question.id && (
                            <div className="mt-4 border-t border-gray-200 pt-4">
                              <QuestionRenderer
                                question={question}
                                onAnswer={() => {}}
                                userAnswer={userAnswers[question.id]}
                                showRationale={true}
                                isCorrect={false}
                                hideSubmitButton={true}
                              />
                            </div>
                          )}
                        </div>
                        <div className="flex-shrink-0 ml-2">
                          <ChevronDown className={`h-5 w-5 text-gray-500 transition-transform ${selectedQuestionId === question.id ? 'rotate-180' : ''}`} />
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {questions.filter(q => answerCorrectness[q.id] === false).length === 0 && (
                    <div className="text-center p-6 text-gray-500">
                      No missed questions - great job!
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="correct-questions">
              <AccordionTrigger className="text-lg font-medium">
                <div className="flex items-center">
                  <CheckCircle2 className="h-5 w-5 mr-2 text-green-600" /> 
                  <span>Correct Questions ({correctAnswers})</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="mt-2 space-y-4">
                  {questions.filter(q => answerCorrectness[q.id] === true).map((question) => (
                    <div 
                      key={question.id}
                      className={`p-4 border ${selectedQuestionId === question.id ? 'border-blue-300 bg-blue-50' : 'border-gray-200 bg-gray-50'} rounded-lg cursor-pointer`}
                      onClick={() => handleQuestionSelect(question.id)}
                    >
                      <div className="flex items-start">
                        <div className="flex-shrink-0 mr-3">
                          <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <h5 className="font-medium text-gray-900 mb-1">
                            {question.title}
                          </h5>
                          <div className="text-sm text-gray-500 mb-2">
                            {question.category || "Uncategorized"} • Question #{question.id}
                          </div>
                          
                          {selectedQuestionId === question.id && (
                            <div className="mt-4 border-t border-gray-200 pt-4">
                              <QuestionRenderer
                                question={question}
                                onAnswer={() => {}}
                                userAnswer={userAnswers[question.id]}
                                showRationale={true}
                                isCorrect={true}
                                hideSubmitButton={true}
                              />
                            </div>
                          )}
                        </div>
                        <div className="flex-shrink-0 ml-2">
                          <ChevronDown className={`h-5 w-5 text-gray-500 transition-transform ${selectedQuestionId === question.id ? 'rotate-180' : ''}`} />
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {questions.filter(q => answerCorrectness[q.id] === true).length === 0 && (
                    <div className="text-center p-6 text-gray-500">
                      No correct questions yet - keep practicing!
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="unanswered-questions">
              <AccordionTrigger className="text-lg font-medium">
                <div className="flex items-center">
                  <Flag className="h-5 w-5 mr-2 text-amber-600" /> 
                  <span>Unanswered Questions ({unansweredCount})</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="mt-2 space-y-4">
                  {questions.filter(q => userAnswers[q.id] === undefined).map((question) => (
                    <div 
                      key={question.id}
                      className={`p-4 border ${selectedQuestionId === question.id ? 'border-blue-300 bg-blue-50' : 'border-gray-200 bg-gray-50'} rounded-lg cursor-pointer`}
                      onClick={() => handleQuestionSelect(question.id)}
                    >
                      <div className="flex items-start">
                        <div className="flex-shrink-0 mr-3">
                          <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center">
                            <Flag className="h-5 w-5 text-amber-600" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <h5 className="font-medium text-gray-900 mb-1">
                            {question.title}
                          </h5>
                          <div className="text-sm text-gray-500 mb-2">
                            {question.category || "Uncategorized"} • Question #{question.id}
                          </div>
                          
                          {selectedQuestionId === question.id && (
                            <div className="mt-4 border-t border-gray-200 pt-4">
                              <QuestionRenderer
                                question={question}
                                onAnswer={() => {}}
                                showRationale={true}
                                hideSubmitButton={true}
                              />
                            </div>
                          )}
                        </div>
                        <div className="flex-shrink-0 ml-2">
                          <ChevronDown className={`h-5 w-5 text-gray-500 transition-transform ${selectedQuestionId === question.id ? 'rotate-180' : ''}`} />
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {questions.filter(q => userAnswers[q.id] === undefined).length === 0 && (
                    <div className="text-center p-6 text-gray-500">
                      No unanswered questions - you attempted all questions!
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          
          {/* Question by Category */}
          <div className="mt-8">
            <h4 className="text-lg font-medium mb-4">Questions by Category</h4>
            
            {sortedCategoryPerformance.map((category) => (
              <Accordion key={category.category} type="single" collapsible className="mb-2">
                <AccordionItem value={category.category}>
                  <AccordionTrigger>
                    <div className="flex items-center justify-between w-full pr-4">
                      <div className="flex items-center">
                        <span className="font-medium">{category.category}</span>
                        <div className="ml-3 flex items-center space-x-3 text-sm">
                          <span className="text-green-600">{category.correct} correct</span>
                          <span className="text-red-600">{category.incorrect} incorrect</span>
                          <span className="text-gray-600">{category.total} total</span>
                        </div>
                      </div>
                      <Badge
                        variant={
                          category.percentage >= 80 ? "success" : 
                          category.percentage >= 65 ? "default" : 
                          "warning"
                        }
                      >
                        {category.percentage}%
                      </Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="mt-2 space-y-4">
                      {getQuestionsByCategory(category.category).map((question) => (
                        <div 
                          key={question.id}
                          className={`p-4 border ${selectedQuestionId === question.id ? 'border-blue-300 bg-blue-50' : 'border-gray-200'} rounded-lg cursor-pointer`}
                          onClick={() => handleQuestionSelect(question.id)}
                        >
                          <div className="flex items-start">
                            <div className="flex-shrink-0 mr-3">
                              {answerCorrectness[question.id] === true ? (
                                <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                                </div>
                              ) : answerCorrectness[question.id] === false ? (
                                <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
                                  <XCircle className="h-5 w-5 text-red-600" />
                                </div>
                              ) : (
                                <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                                  <Flag className="h-5 w-5 text-gray-600" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1">
                              <h5 className="font-medium text-gray-900 mb-1">
                                {question.title}
                              </h5>
                              <div className="text-sm text-gray-500 mb-2">
                                Question #{question.id} • Type: {question.type}
                              </div>
                              
                              {selectedQuestionId === question.id && (
                                <div className="mt-4 border-t border-gray-200 pt-4">
                                  <QuestionRenderer
                                    question={question}
                                    onAnswer={() => {}}
                                    userAnswer={userAnswers[question.id]}
                                    showRationale={true}
                                    isCorrect={answerCorrectness[question.id] || false}
                                    hideSubmitButton={true}
                                  />
                                </div>
                              )}
                            </div>
                            <div className="flex-shrink-0 ml-2">
                              <ChevronDown className={`h-5 w-5 text-gray-500 transition-transform ${selectedQuestionId === question.id ? 'rotate-180' : ''}`} />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            ))}
          </div>
        </TabsContent>
        
        {/* Study Plan Tab */}
        <TabsContent value="recommendations" className="p-6 bg-white rounded-lg border-2 border-gray-200 shadow-md mt-4">
          <h3 className="text-xl font-bold mb-6">Personalized Study Plan</h3>
          
          <div className="space-y-6">
            {/* Overall Recommendation */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-5">
              <h4 className="text-lg font-medium text-blue-800 mb-2">Performance Summary</h4>
              <p className="text-blue-700 mb-4">
                {percentage >= 80 
                  ? "Excellent work! You're demonstrating strong nursing knowledge. Focus on maintaining your strengths while improving the few weak areas." 
                  : percentage >= 65 
                    ? "Good job! You're on the right track. Continue focusing on your weaker areas to improve your overall performance." 
                    : "You're making progress, but need more focused study to improve your performance. Don't get discouraged – consistent practice will help you succeed!"}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="bg-white rounded-lg p-3 border border-blue-100">
                  <h5 className="font-medium text-blue-800 mb-1">Strong Areas</h5>
                  <ul className="list-disc text-sm text-blue-700 pl-4 space-y-1">
                    {strengths.slice(0, 3).map(area => (
                      <li key={area.category}>{area.category}</li>
                    ))}
                    {strengths.length === 0 && <li>Not enough data</li>}
                  </ul>
                </div>
                
                <div className="bg-white rounded-lg p-3 border border-blue-100">
                  <h5 className="font-medium text-blue-800 mb-1">Focus Areas</h5>
                  <ul className="list-disc text-sm text-blue-700 pl-4 space-y-1">
                    {weaknesses.slice(0, 3).map(area => (
                      <li key={area.category}>{area.category}</li>
                    ))}
                    {weaknesses.length === 0 && <li>Not enough data</li>}
                  </ul>
                </div>
                
                <div className="bg-white rounded-lg p-3 border border-blue-100">
                  <h5 className="font-medium text-blue-800 mb-1">Study Time</h5>
                  <p className="text-sm text-blue-700">
                    Recommended: {weaknesses.length > 0 ? 
                      `${Math.max(3, weaknesses.length * 2)} hours this week` : 
                      "3-5 hours this week"}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Priority Study Topics */}
            <Card className="p-5">
              <h4 className="text-lg font-medium mb-4">Priority Study Topics</h4>
              
              <div className="space-y-4">
                {weaknesses.slice(0, 3).map((category, index) => (
                  <div key={category.category} className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="bg-gray-50 p-3 flex items-center">
                      <div className="bg-amber-100 text-amber-800 rounded-full h-8 w-8 flex items-center justify-center mr-3">
                        {index + 1}
                      </div>
                      <div>
                        <h5 className="font-medium">{category.category}</h5>
                        <div className="text-sm text-gray-500">
                          {category.percentage}% correct ({category.correct}/{category.total})
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <h6 className="font-medium text-sm mb-2">Recommended Resources:</h6>
                      <ul className="text-sm space-y-2">
                        <li className="flex items-start">
                          <BookOpen className="h-4 w-4 mr-2 text-blue-600 mt-0.5" />
                          <span>Review textbook chapters on {category.category}</span>
                        </li>
                        <li className="flex items-start">
                          <ListChecks className="h-4 w-4 mr-2 text-green-600 mt-0.5" />
                          <span>Practice {Math.min(category.incorrect * 3, 30)} questions focused on {category.category}</span>
                        </li>
                        <li className="flex items-start">
                          <Award className="h-4 w-4 mr-2 text-purple-600 mt-0.5" />
                          <span>Complete the {category.category} mini-assessment</span>
                        </li>
                      </ul>
                      
                      <div className="mt-4">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full"
                          onClick={() => {
                            // Navigate to practice questions for this category
                          }}
                        >
                          Practice {category.category} Questions
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                
                {weaknesses.length === 0 && (
                  <div className="text-center p-6 text-gray-500">
                    No specific weak areas identified yet. Keep practicing to get personalized recommendations!
                  </div>
                )}
              </div>
            </Card>
            
            {/* Weekly Study Schedule */}
            <Card className="p-5">
              <h4 className="text-lg font-medium mb-4">Suggested Weekly Study Schedule</h4>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="border border-gray-200 rounded-lg p-3">
                    <h5 className="font-medium border-b pb-2 mb-2">Day 1-2</h5>
                    <ul className="text-sm space-y-2">
                      <li className="flex items-start">
                        <div className="bg-blue-100 text-blue-800 rounded-full h-5 w-5 flex items-center justify-center mr-2 flex-shrink-0">
                          1
                        </div>
                        <span>
                          Focus on {weaknesses[0]?.category || "your lowest scoring area"} 
                          (60-90 minutes)
                        </span>
                      </li>
                      <li className="flex items-start">
                        <div className="bg-blue-100 text-blue-800 rounded-full h-5 w-5 flex items-center justify-center mr-2 flex-shrink-0">
                          2
                        </div>
                        <span>
                          Review missed questions from this exam
                          (30 minutes)
                        </span>
                      </li>
                      <li className="flex items-start">
                        <div className="bg-blue-100 text-blue-800 rounded-full h-5 w-5 flex items-center justify-center mr-2 flex-shrink-0">
                          3
                        </div>
                        <span>
                          Practice 20-30 focused questions
                          (30 minutes)
                        </span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg p-3">
                    <h5 className="font-medium border-b pb-2 mb-2">Day 3-4</h5>
                    <ul className="text-sm space-y-2">
                      <li className="flex items-start">
                        <div className="bg-blue-100 text-blue-800 rounded-full h-5 w-5 flex items-center justify-center mr-2 flex-shrink-0">
                          1
                        </div>
                        <span>
                          Study {weaknesses[1]?.category || "your second lowest area"}
                          (60 minutes)
                        </span>
                      </li>
                      <li className="flex items-start">
                        <div className="bg-blue-100 text-blue-800 rounded-full h-5 w-5 flex items-center justify-center mr-2 flex-shrink-0">
                          2
                        </div>
                        <span>
                          Complete content review for challenging concepts
                          (45 minutes)
                        </span>
                      </li>
                      <li className="flex items-start">
                        <div className="bg-blue-100 text-blue-800 rounded-full h-5 w-5 flex items-center justify-center mr-2 flex-shrink-0">
                          3
                        </div>
                        <span>
                          Take a mini-assessment on this topic
                          (30 minutes)
                        </span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg p-3">
                    <h5 className="font-medium border-b pb-2 mb-2">Day 5-7</h5>
                    <ul className="text-sm space-y-2">
                      <li className="flex items-start">
                        <div className="bg-blue-100 text-blue-800 rounded-full h-5 w-5 flex items-center justify-center mr-2 flex-shrink-0">
                          1
                        </div>
                        <span>
                          Review all weak areas and take notes
                          (60 minutes)
                        </span>
                      </li>
                      <li className="flex items-start">
                        <div className="bg-blue-100 text-blue-800 rounded-full h-5 w-5 flex items-center justify-center mr-2 flex-shrink-0">
                          2
                        </div>
                        <span>
                          Practice mixed question sets
                          (45 minutes)
                        </span>
                      </li>
                      <li className="flex items-start">
                        <div className="bg-blue-100 text-blue-800 rounded-full h-5 w-5 flex items-center justify-center mr-2 flex-shrink-0">
                          3
                        </div>
                        <span>
                          Take another full practice exam
                          (60-90 minutes)
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </Card>
            
            {/* Next Steps */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
              <h4 className="text-lg font-medium mb-4">Next Steps</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-gray-700 mb-4">
                    Ready to continue improving your nursing knowledge? Here are your next recommended actions:
                  </p>
                  
                  <div className="space-y-3">
                    <Button 
                      className="w-full justify-start bg-[#13294B] hover:bg-[#0A1E3A]"
                      onClick={onRetakeExam}
                    >
                      <Award className="mr-2 h-5 w-5" />
                      Retake This Exam
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => {
                        // Navigate to practice questions for weak areas
                      }}
                    >
                      <ListChecks className="mr-2 h-5 w-5 text-blue-600" />
                      Practice Weak Areas
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => {
                        // Navigate to take a different exam
                      }}
                    >
                      <BookOpen className="mr-2 h-5 w-5 text-green-600" />
                      Take Different Exam
                    </Button>
                    
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={onBack}
                    >
                      <ArrowLeft className="mr-2 h-5 w-5 text-gray-600" />
                      Return to Dashboard
                    </Button>
                  </div>
                </div>
                
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                  <h5 className="font-medium text-blue-800 mb-2">Success Tip</h5>
                  <p className="text-blue-700 text-sm mb-3">
                    Research shows that students who follow a structured study plan and regularly review weak areas 
                    score 30-40% higher on their NCLEX exams than those who study without a plan.
                  </p>
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-blue-200">
                    <div className="text-sm text-blue-700">
                      <span className="font-bold">
                        {isPassing ? "You're on track!" : "Keep practicing!"}
                      </span>
                    </div>
                    <Badge variant={isPassing ? "success" : "warning"}>
                      {percentage}% Score
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Action Buttons */}
      <div className="flex justify-between bg-white rounded-lg border-2 border-gray-200 shadow-md p-4 mb-6">
        <Button
          variant="outline"
          onClick={onBack}
          className="flex items-center"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Return to Dashboard
        </Button>
        
        <div className="space-x-3">
          <Button
            variant="outline"
            className="text-indigo-700 border-indigo-300 hover:bg-indigo-50"
            onClick={() => {
              // Logic to view all questions
            }}
          >
            <ListChecks className="mr-2 h-4 w-4" />
            View All Questions
          </Button>
          
          <Button
            className="bg-[#13294B] hover:bg-[#0A1E3A]"
            onClick={onRetakeExam}
          >
            <Award className="mr-2 h-4 w-4" />
            Retake Exam
          </Button>
        </div>
      </div>
    </div>
  );
}
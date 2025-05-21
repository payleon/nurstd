import { useState } from "react";
import { Link } from "wouter";
import { FlashcardReview } from "@/components/flashcards/FlashcardReview";
import { NURSING_FLASHCARDS } from "@/data/flashcards";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  BookOpen, 
  Brain, 
  Clock, 
  RotateCcw, 
  Settings, 
  BarChart,
  ArrowLeft
} from "lucide-react";

// Get unique categories from flashcards
const categories = ['all', ...Array.from(new Set(NURSING_FLASHCARDS.map(c => c.category)))];

export default function QuickReview() {
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<'easy' | 'medium' | 'hard' | 'all'>('all');
  const [cardCount, setCardCount] = useState<number>(10);
  const [showSettings, setShowSettings] = useState<boolean>(true);
  const [reviewComplete, setReviewComplete] = useState<boolean>(false);
  const [reviewStats, setReviewStats] = useState<any>(null);

  // Cards due for review today
  const getDueCards = () => {
    const today = new Date();
    return NURSING_FLASHCARDS.filter(card => {
      // If no next review date, it's due now
      if (!card.nextReviewDate) return true;
      
      // Check if the card is due today or earlier
      const reviewDate = new Date(card.nextReviewDate);
      return reviewDate <= today;
    });
  };
  
  const dueCards = getDueCards();
  
  const handleReviewComplete = (results: any) => {
    setReviewComplete(true);
    setReviewStats(results);
    // In a real app, we would persist the updated flashcards to storage here
  };
  
  const startNewSession = () => {
    setReviewComplete(false);
    setShowSettings(true);
    setReviewStats(null);
  };
  
  const beginReview = () => {
    setShowSettings(false);
  };

  if (reviewComplete && reviewStats) {
    return (
      <div className="bg-[#f9fafb] min-h-screen p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Link href="/">
              <Button variant="ghost" className="flex items-center text-blue-600">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold mb-2">Review Complete!</h1>
              <p className="text-gray-600">
                Great job! You've completed your flashcard review session.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <BookOpen className="h-5 w-5 mr-2 text-green-600" />
                    Cards Reviewed
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{reviewStats.totalReviewed}</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <Brain className="h-5 w-5 mr-2 text-blue-600" />
                    Knowledge Level
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full" 
                        style={{ width: `${(reviewStats.easyCount / reviewStats.totalReviewed) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">
                      {Math.round((reviewStats.easyCount / reviewStats.totalReviewed) * 100)}%
                    </span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <BarChart className="h-5 w-5 mr-2 text-purple-600" />
                    Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-1 text-xs">
                    <div>
                      <span className="block font-medium text-green-600">{reviewStats.easyCount}</span>
                      <span className="text-gray-500">Easy</span>
                    </div>
                    <div>
                      <span className="block font-medium text-yellow-600">{reviewStats.mediumCount}</span>
                      <span className="text-gray-500">Medium</span>
                    </div>
                    <div>
                      <span className="block font-medium text-red-600">{reviewStats.hardCount}</span>
                      <span className="text-gray-500">Hard</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="flex justify-center gap-3">
              <Button onClick={startNewSession} className="flex items-center">
                <RotateCcw className="h-4 w-4 mr-2" />
                Start New Session
              </Button>
              <Button variant="outline" asChild>
                <Link href="/" className="flex items-center">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Return to Dashboard
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (showSettings) {
    return (
      <div className="bg-[#f9fafb] min-h-screen p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Link href="/">
              <Button variant="ghost" className="flex items-center text-blue-600">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold mb-2">Quick Review Mode</h1>
              <p className="text-gray-600">
                Customize your flashcard review session to focus on what you need to learn
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <BookOpen className="h-5 w-5 mr-2 text-green-600" />
                    Total Flashcards
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{NURSING_FLASHCARDS.length}</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <Brain className="h-5 w-5 mr-2 text-blue-600" />
                    Due for Review
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{dueCards.length}</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <Clock className="h-5 w-5 mr-2 text-purple-600" />
                    Study Categories
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{categories.length - 1}</p>
                </CardContent>
              </Card>
            </div>
            
            <div className="mb-8">
              <h3 className="text-lg font-medium mb-4">Session Settings</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category} value={category} className="capitalize">
                          {category === 'all' ? 'All Categories' : category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-500 mt-1">
                    {categoryFilter === 'all' 
                      ? 'Reviewing all categories' 
                      : `Focusing on ${categoryFilter} cards`}
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Difficulty
                  </label>
                  <Select value={difficultyFilter} onValueChange={(value: any) => setDifficultyFilter(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Difficulties</SelectItem>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-500 mt-1">
                    {difficultyFilter === 'all' 
                      ? 'Including all difficulty levels' 
                      : `Only ${difficultyFilter} cards`}
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cards per Session
                  </label>
                  <Select 
                    value={cardCount.toString()} 
                    onValueChange={(value) => setCardCount(parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Number of cards" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5 cards</SelectItem>
                      <SelectItem value="10">10 cards</SelectItem>
                      <SelectItem value="15">15 cards</SelectItem>
                      <SelectItem value="20">20 cards</SelectItem>
                      <SelectItem value="25">25 cards</SelectItem>
                      <SelectItem value="30">30 cards</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-500 mt-1">
                    Review {cardCount} cards in this session
                  </p>
                </div>
              </div>
            </div>
            
            <div>
              <Button onClick={beginReview} size="lg" className="w-full md:w-auto">
                Start Review Session
              </Button>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium mb-4">Spaced Repetition Explained</h3>
            
            <div className="prose max-w-none">
              <p>
                Our flashcard system uses <strong>spaced repetition</strong>, a proven learning technique that 
                adjusts the review schedule for each card based on how well you know it.
              </p>
              
              <ul className="mt-4 space-y-2">
                <li className="flex items-start">
                  <span className="bg-green-100 text-green-800 rounded-full w-6 h-6 flex items-center justify-center mr-2 flex-shrink-0 mt-0.5">E</span>
                  <span>
                    <strong>Easy:</strong> Cards you know well are scheduled for review further in the future, 
                    saving you time and focusing your efforts.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="bg-yellow-100 text-yellow-800 rounded-full w-6 h-6 flex items-center justify-center mr-2 flex-shrink-0 mt-0.5">M</span>
                  <span>
                    <strong>Medium:</strong> Cards you're somewhat familiar with will be shown again sooner to 
                    reinforce the knowledge.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="bg-red-100 text-red-800 rounded-full w-6 h-6 flex items-center justify-center mr-2 flex-shrink-0 mt-0.5">H</span>
                  <span>
                    <strong>Hard:</strong> Cards you find difficult will be scheduled for immediate review, 
                    helping you focus on your weak areas.
                  </span>
                </li>
              </ul>
              
              <p className="mt-4">
                This system adapts to your personal learning pace, ensuring efficient and effective study sessions.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Review mode - show flashcards
  return (
    <div className="bg-[#f9fafb] min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            className="flex items-center text-blue-600"
            onClick={() => setShowSettings(true)}
          >
            <Settings className="h-4 w-4 mr-2" />
            Session Settings
          </Button>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <FlashcardReview 
            initialCards={NURSING_FLASHCARDS}
            maxCards={cardCount}
            categoryFilter={categoryFilter}
            difficultyFilter={difficultyFilter}
            onComplete={handleReviewComplete}
          />
        </div>
      </div>
    </div>
  );
}
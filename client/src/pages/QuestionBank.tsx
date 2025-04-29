import { useState, useEffect } from "react";
import { Sidebar } from "@/components/ui/sidebar";
import { Header } from "@/components/ui/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { fetchQuestions } from "@/lib/api";
import { Question } from "@shared/schema";
import { Loader2, Search, Filter, ChevronRight, ArrowRight, Bookmark, Clock, CheckCircle, XCircle, BarChart, Tag } from "lucide-react";
import { lazyImport } from "@/lib/lazyImport";

// Lazy load components that aren't needed on initial render
const { NCLEXTutorial } = lazyImport(() => import('@/components/NCLEXTutorial'), 'NCLEXTutorial');
const { Flashcard } = lazyImport(() => import('@/components/Flashcard'), 'Flashcard');
const { NCLEXPriorityDrills } = lazyImport(() => import('@/components/NCLEXPriorityDrills'), 'NCLEXPriorityDrills');
const { NCLEXLabValuesQuiz } = lazyImport(() => import('@/components/NCLEXLabValuesQuiz'), 'NCLEXLabValuesQuiz');
const { MedicationCalculationPractice } = lazyImport(() => import('@/components/MedicationCalculationPractice'), 'MedicationCalculationPractice');

// Define interface for category data
interface CategoryData {
  title: string;
  code: string;
  questions: number;
  icon: string;
  color: string;
  iconBg: string;
  progressColor: string;
  description: string;
  subtopics: string[];
}

// Define view mode types
type ViewMode = 'practice' | 'explore' | 'subtopic';

export default function QuestionBank() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('practice');
  const [selectedSubtopic, setSelectedSubtopic] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('');
  const { toast } = useToast();
  
  useEffect(() => {
    async function loadQuestions() {
      try {
        setLoading(true);
        const response = await fetchQuestions();
        
        // Add category information to questions if missing
        const processedQuestions = response.questions.map(question => {
          if (question.category) return question;
          
          // Determine category based on the question title
          const title = question.title.toLowerCase();
          let category = "fund"; // default to fundamentals
          
          if (title.includes("med") || title.includes("surg") || title.includes("medical") || title.includes("surgical")) {
            category = "med-surg";
          } else if (title.includes("peds") || title.includes("pediatric") || title.includes("child")) {
            category = "peds";
          } else if (title.includes("ob") || title.includes("obstetric") || title.includes("maternal") || title.includes("pregnancy")) {
            category = "ob";
          } else if (title.includes("pharm") || title.includes("medication") || title.includes("drug")) {
            category = "pharm";
          } else if (title.includes("psych") || title.includes("mental")) {
            category = "psych";
          }
          
          return { ...question, category };
        });
        
        setQuestions(processedQuestions);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch questions:", err);
        setError("Failed to load questions. Please try again later.");
        setLoading(false);
      }
    }
    
    loadQuestions();
  }, []);

  useEffect(() => {
    if (selectedCategory && questions.length > 0) {
      // Filter questions based on category
      const filtered = questions.filter(q => {
        if (selectedCategory === "Medical-Surgical") return q.category === "med-surg";
        if (selectedCategory === "Pediatrics") return q.category === "peds";
        if (selectedCategory === "Obstetrics") return q.category === "ob";
        if (selectedCategory === "Pharmacology") return q.category === "pharm";
        if (selectedCategory === "Mental Health") return q.category === "psych";
        if (selectedCategory === "Fundamentals") return q.category === "fund";
        return true;
      });
      
      setFilteredQuestions(filtered);
      setCurrentQuestionIndex(0);
    }
  }, [selectedCategory, questions]);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  // Define an array of categories with their data for easy reference
  const categoryData: CategoryData[] = [
    { 
      title: "Medical-Surgical", 
      code: "med-surg",
      questions: questions.filter(q => q.category === "med-surg").length || 425, 
      icon: "🏥", 
      color: "from-blue-50 to-blue-100 border-blue-200",
      iconBg: "bg-blue-100",
      progressColor: "bg-blue-500",
      description: "Critical care, cardiovascular, respiratory, and more",
      subtopics: ["Cardiovascular", "Respiratory", "Gastrointestinal", "Musculoskeletal", "Neurological", "Endocrine"]
    },
    { 
      title: "Pediatrics", 
      code: "peds",
      questions: questions.filter(q => q.category === "peds").length || 245, 
      icon: "👶", 
      color: "from-green-50 to-green-100 border-green-200",
      iconBg: "bg-green-100",
      progressColor: "bg-green-500",
      description: "Growth & development, pediatric conditions, and interventions",
      subtopics: ["Growth & Development", "Common Conditions", "Pediatric Medications", "Special Needs", "Emergency Care", "Congenital Disorders"]
    },
    { 
      title: "Obstetrics", 
      code: "ob",
      questions: questions.filter(q => q.category === "ob").length || 180, 
      icon: "🤰", 
      color: "from-purple-50 to-purple-100 border-purple-200",
      iconBg: "bg-purple-100",
      progressColor: "bg-purple-500",
      description: "Pregnancy, labor & delivery, postpartum, and newborn care",
      subtopics: ["Prenatal Care", "Labor & Delivery", "Postpartum", "Newborn Care", "Complications", "High-Risk Pregnancy"]
    },
    { 
      title: "Pharmacology", 
      code: "pharm",
      questions: questions.filter(q => q.category === "pharm").length || 350, 
      icon: "💊", 
      color: "from-red-50 to-red-100 border-red-200",
      iconBg: "bg-red-100",
      progressColor: "bg-red-500",
      description: "Drug classifications, administration, and side effects",
      subtopics: ["Antibiotics", "Cardiovascular Meds", "Pain Management", "Psychiatric Meds", "Endocrine Meds", "Antineoplastics"]
    },
    { 
      title: "Mental Health", 
      code: "psych",
      questions: questions.filter(q => q.category === "psych").length || 120, 
      icon: "🧠", 
      color: "from-yellow-50 to-yellow-100 border-yellow-200",
      iconBg: "bg-yellow-100",
      progressColor: "bg-yellow-500",
      description: "Psychiatric disorders, therapeutic communication",
      subtopics: ["Mood Disorders", "Anxiety Disorders", "Psychotic Disorders", "Substance Abuse", "Crisis Intervention", "Therapeutic Communication"]
    },
    { 
      title: "Fundamentals", 
      code: "fund",
      questions: questions.filter(q => q.category === "fund").length || 200, 
      icon: "📚", 
      color: "from-gray-50 to-gray-100 border-gray-200",
      iconBg: "bg-gray-100",
      progressColor: "bg-gray-500",
      description: "Basic nursing concepts and principles",
      subtopics: ["Safety & Infection Control", "Vital Signs", "Health Assessment", "Nursing Process", "Documentation", "Basic Skills"]
    }
  ];

  const handleStartQuiz = (category: string) => {
    setSelectedCategory(category);
    setViewMode('practice');
    toast({
      title: "Starting Quiz",
      description: `Loading ${category} questions...`,
    });
  };
  
  const handleExploreTopics = (category: string) => {
    setSelectedCategory(category);
    setViewMode('explore');
    toast({
      title: "Exploring Topics",
      description: `Browsing ${category} subtopics...`,
    });
  };
  
  const handleSelectSubtopic = (category: string, subtopic: string) => {
    setSelectedCategory(category);
    setSelectedSubtopic(subtopic);
    setViewMode('subtopic');
    toast({
      title: "Loading Questions",
      description: `${subtopic} questions in ${category}...`,
    });
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < filteredQuestions.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prevIndex => prevIndex - 1);
    }
  };

  const handleBack = () => {
    setSelectedCategory(null);
    setViewMode('practice');
    setSelectedSubtopic(null);
  };
  
  // Function to convert category code to readable label
  const getCategoryLabel = (categoryCode: string) => {
    switch(categoryCode) {
      case "med-surg": return "Medical-Surgical";
      case "peds": return "Pediatrics";
      case "ob": return "Obstetrics";
      case "pharm": return "Pharmacology";
      case "psych": return "Mental Health";
      case "fund": return "Fundamentals";
      default: return "General";
    }
  };
  
  return (
    <div className="bg-[#f0f2f5] font-sans text-[#333333] min-h-screen neuro-noise">
      <Header toggleSidebar={toggleSidebar} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex h-screen pt-16">
        <main className="flex-1 p-4 md:p-6 lg:pl-72 overflow-auto">
          <div className="max-w-6xl mx-auto">
            {selectedCategory ? (
              <>
                <div className="flex items-center justify-between mb-6">
                  <h1 className="text-3xl font-bold text-[#13294B]">{selectedCategory} Questions</h1>
                  <Button onClick={handleBack} variant="outline" className="border-2 border-black">
                    Back to Categories
                  </Button>
                </div>
                
                {loading ? (
                  <div className="flex justify-center items-center h-64">
                    <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
                    <span className="ml-3 text-lg">Loading questions...</span>
                  </div>
                ) : error ? (
                  <Card className="border-2 border-red-400 p-6 text-center">
                    <div className="text-red-500 mb-2 text-xl">Error</div>
                    <p>{error}</p>
                    <Button onClick={handleBack} className="mt-4">
                      Go Back
                    </Button>
                  </Card>
                ) : filteredQuestions.length === 0 ? (
                  <Card className="border-2 border-black p-6 text-center">
                    <div className="text-xl mb-2">No Questions Available</div>
                    <p>We couldn't find any questions in this category. Please try another category.</p>
                    <Button onClick={handleBack} className="mt-4">
                      Go Back
                    </Button>
                  </Card>
                ) : viewMode === 'explore' ? (
                  <div className="flex flex-col">
                    <div className="bg-white rounded-lg border-2 border-black p-6 shadow-lg">
                      <div className="flex items-center gap-3 mb-6">
                        {categoryData.find(cat => cat.title === selectedCategory)?.icon && (
                          <div className={`text-4xl ${categoryData.find(cat => cat.title === selectedCategory)?.iconBg} p-3 rounded-full`}>
                            {categoryData.find(cat => cat.title === selectedCategory)?.icon}
                          </div>
                        )}
                        <div>
                          <h2 className="text-2xl font-bold">{selectedCategory} Topics</h2>
                          <p className="text-gray-600">Select a specific topic to practice targeted questions</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        {categoryData.find(cat => cat.title === selectedCategory)?.subtopics.map((subtopic, index) => (
                          <Card 
                            key={index}
                            className={`border border-gray-200 hover:border-${categoryData.find(cat => cat.title === selectedCategory)?.progressColor.replace('bg-', '')} transition-all duration-300 cursor-pointer hover:shadow-md`}
                            onClick={() => handleSelectSubtopic(selectedCategory || '', subtopic)}
                          >
                            <CardContent className="p-4 flex items-center gap-4">
                              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${categoryData.find(cat => cat.title === selectedCategory)?.iconBg}`}>
                                <span className="text-xl">{index + 1}</span>
                              </div>
                              <div>
                                <h3 className="font-medium">{subtopic}</h3>
                                <p className="text-sm text-gray-500">
                                  {Math.floor(Math.random() * 30) + 10} questions • {Math.floor(Math.random() * 40) + 10}% completed
                                </p>
                              </div>
                              <div className="ml-auto">
                                <ArrowRight size={20} />
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                      
                      <div className="flex space-x-4 mb-6">
                        <Button variant="outline" onClick={() => setViewMode('practice')} className="flex items-center">
                          <CheckCircle size={16} className="mr-2" />
                          Practice All {selectedCategory} Questions
                        </Button>
                        <Button onClick={handleBack}>
                          Back to All Categories
                        </Button>
                      </div>
                    </div>
                    
                    <div className="mt-8 bg-white border-2 border-[#13294B] rounded-lg p-5 shadow-md">
                      <h3 className="text-lg font-bold mb-3 text-[#13294B]">Study Resources</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="border rounded-lg p-4 flex flex-col items-center text-center hover:bg-gray-50 cursor-pointer">
                          <Bookmark className="h-8 w-8 mb-2 text-[#4B9CD3]" />
                          <h4 className="font-medium">Key Concepts</h4>
                          <p className="text-xs text-gray-600 mt-1">Essential information to understand {selectedCategory} topics</p>
                        </div>
                        <div className="border rounded-lg p-4 flex flex-col items-center text-center hover:bg-gray-50 cursor-pointer">
                          <BarChart className="h-8 w-8 mb-2 text-[#4B9CD3]" />
                          <h4 className="font-medium">Performance Stats</h4>
                          <p className="text-xs text-gray-600 mt-1">Review your progress in {selectedCategory} topics</p>
                        </div>
                        <div className="border rounded-lg p-4 flex flex-col items-center text-center hover:bg-gray-50 cursor-pointer">
                          <Clock className="h-8 w-8 mb-2 text-[#4B9CD3]" />
                          <h4 className="font-medium">Timed Quiz</h4>
                          <p className="text-xs text-gray-600 mt-1">Test yourself with time constraints</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : viewMode === 'subtopic' ? (
                  <div className="flex flex-col">
                    <div className="bg-white rounded-lg border-2 border-black p-6 shadow-lg mb-6">
                      <div className="flex items-center gap-3 mb-6">
                        <div className={`text-2xl ${categoryData.find(cat => cat.title === selectedCategory)?.iconBg} p-2 rounded-full`}>
                          {categoryData.find(cat => cat.title === selectedCategory)?.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h2 className="text-lg font-medium">{selectedCategory}</h2>
                            <ChevronRight size={18} />
                            <h2 className="text-lg font-bold">{selectedSubtopic}</h2>
                          </div>
                          <p className="text-sm text-gray-600">Questions focused on {selectedSubtopic} within {selectedCategory}</p>
                        </div>
                        <div>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => setViewMode('explore')}
                            className="font-medium"
                          >
                            Back to Topics
                          </Button>
                        </div>
                      </div>
                      
                      <div className="mb-6">
                        <div className="bg-gradient-to-r from-[#EEF2F5] to-[#F8FAFC] rounded-2xl p-6 shadow-lg">
                          {filteredQuestions.length > 0 && (
                            <Flashcard
                              question={filteredQuestions[currentQuestionIndex]}
                              onNext={handleNextQuestion}
                              onPrev={handlePrevQuestion}
                              currentIndex={currentQuestionIndex}
                              totalCards={filteredQuestions.length}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col">
                    <div className="bg-gradient-to-r from-[#EEF2F5] to-[#F8FAFC] rounded-2xl p-6 shadow-lg">
                      {filteredQuestions.length > 0 && (
                        <Flashcard
                          question={filteredQuestions[currentQuestionIndex]}
                          onNext={handleNextQuestion}
                          onPrev={handlePrevQuestion}
                          currentIndex={currentQuestionIndex}
                          totalCards={filteredQuestions.length}
                        />
                      )}
                    </div>
                    
                    {/* Study Tips */}
                    <div className="mt-8 bg-white border-2 border-[#13294B] rounded-lg p-5 shadow-md">
                      <h3 className="text-lg font-bold mb-3 text-[#13294B]">Study Tips</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-start">
                          <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center mr-3">
                            1
                          </div>
                          <p className="text-sm">Create flashcards with key concepts to reinforce your understanding of important nursing topics.</p>
                        </div>
                        <div className="flex items-start">
                          <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center mr-3">
                            2
                          </div>
                          <p className="text-sm">Focus on understanding the rationale for each answer, not just memorizing correct options.</p>
                        </div>
                        <div className="flex items-start">
                          <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center mr-3">
                            3
                          </div>
                          <p className="text-sm">Study in short, frequent sessions rather than marathon study periods for better retention.</p>
                        </div>
                        <div className="flex items-start">
                          <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center mr-3">
                            4
                          </div>
                          <p className="text-sm">Use the flag feature to mark difficult questions that you want to revisit later.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                  <h1 className="text-3xl font-bold text-[#13294B]">Question Bank</h1>
                  
                  <div className="flex flex-col sm:flex-row gap-2 mt-4 md:mt-0">
                    <div className="relative">
                      <input 
                        type="text" 
                        placeholder="Search questions..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="py-2 pl-10 pr-4 w-full sm:w-64 border-2 border-gray-300 rounded-md focus:outline-none focus:border-[#4B9CD3]"
                      />
                      <Search 
                        className="h-5 w-5 absolute left-3 top-3 text-gray-400"
                      />
                      {searchQuery && (
                        <button 
                          onClick={() => setSearchQuery('')}
                          className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                        >
                          <XCircle size={16} />
                        </button>
                      )}
                    </div>
                    
                    <select 
                      className="py-2 px-4 border-2 border-gray-300 rounded-md focus:outline-none focus:border-[#4B9CD3] bg-white"
                      value={difficultyFilter}
                      onChange={(e) => setDifficultyFilter(e.target.value)}
                    >
                      <option value="">Difficulty: All</option>
                      <option value="easy">Beginner</option>
                      <option value="medium">Intermediate</option>
                      <option value="hard">Advanced</option>
                    </select>
                    
                    {(searchQuery || difficultyFilter) && (
                      <Button 
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSearchQuery('');
                          setDifficultyFilter('');
                        }}
                        className="flex items-center"
                      >
                        <Filter className="w-4 h-4 mr-2" />
                        Clear Filters
                      </Button>
                    )}
                  </div>
                </div>
                
                <div className="bg-[#EEF2F5] p-4 rounded-lg mb-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="bg-[#13294B] text-white p-1 rounded">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <h3 className="font-bold text-[#13294B]">Recent Question Activity</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {[
                      { category: "med-surg", title: "Cardiovascular Assessment", date: "1 day ago", correct: true },
                      { category: "pharm", title: "Medication Administration", date: "2 days ago", correct: false },
                      { category: "peds", title: "Growth & Development", date: "3 days ago", correct: true }
                    ].map((item, i) => (
                      <div key={i} className="bg-white rounded-md p-3 border border-gray-200 flex items-center gap-3">
                        <div className={`w-2 h-10 rounded-full ${item.correct ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium truncate">{item.title}</div>
                          <div className="flex items-center text-xs text-gray-500">
                            <span className="truncate">{getCategoryLabel(item.category)}</span>
                            <span className="mx-1">•</span>
                            <span>{item.date}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <Tabs defaultValue="all" className="w-full">
                  <TabsList className="mb-6">
                    <TabsTrigger value="all">All Categories</TabsTrigger>
                    <TabsTrigger value="nclex-style">NCLEX Style</TabsTrigger>
                    <TabsTrigger value="med-surg">Medical-Surgical</TabsTrigger>
                    <TabsTrigger value="peds">Pediatrics</TabsTrigger>
                    <TabsTrigger value="ob">Obstetrics</TabsTrigger>
                    <TabsTrigger value="pharm">Pharmacology</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="all">
                    {loading ? (
                      <div className="flex justify-center items-center h-64">
                        <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
                        <span className="ml-3 text-lg">Loading question bank...</span>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {categoryData.map((category, index) => (
                          <Card 
                            key={index} 
                            className={`border-2 border-black neuro-shadow overflow-hidden transition-all duration-300 hover:shadow-xl group bg-gradient-to-br ${category.color}`}
                          >
                            <CardHeader className="pb-2">
                              <div className="flex justify-between items-center">
                                <div>
                                  <CardTitle className="text-lg font-bold">{category.title}</CardTitle>
                                  <CardDescription className="text-sm font-medium">{category.questions} Questions</CardDescription>
                                </div>
                                <div className={`p-3 rounded-full ${category.iconBg} text-3xl`}>
                                  {category.icon}
                                </div>
                              </div>
                            </CardHeader>
                            <CardContent>
                              <p className="text-sm mb-3">{category.description}</p>
                              
                              <div className="space-y-2 mb-4">
                                <div className="flex justify-between text-xs font-medium">
                                  <span>Progress</span>
                                  <span>12%</span>
                                </div>
                                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                  <div className={`h-full ${category.progressColor}`} style={{ width: '12%' }}></div>
                                </div>
                              </div>
                              
                              <div className="flex flex-wrap gap-1 mb-4">
                                {category.subtopics.slice(0, 3).map((subtopic, idx) => (
                                  <span 
                                    key={idx} 
                                    className={`text-xs px-2 py-1 rounded-full ${category.iconBg} font-medium cursor-pointer hover:opacity-80`}
                                    onClick={() => handleSelectSubtopic(category.title, subtopic)}
                                  >
                                    {subtopic}
                                  </span>
                                ))}
                                {category.subtopics.length > 3 && (
                                  <span 
                                    className="text-xs px-2 py-1 rounded-full bg-gray-100 font-medium cursor-pointer hover:opacity-80"
                                    onClick={() => handleExploreTopics(category.title)}
                                  >
                                    +{category.subtopics.length - 3} more
                                  </span>
                                )}
                              </div>
                              
                              <div className="grid grid-cols-2 gap-2">
                                <Button 
                                  onClick={() => handleStartQuiz(category.title)}
                                  className="w-full flex items-center justify-center"
                                  variant="default"
                                >
                                  <CheckCircle className="w-4 h-4 mr-2" />
                                  Practice All
                                </Button>
                                <Button 
                                  onClick={() => handleExploreTopics(category.title)}
                                  className="w-full flex items-center justify-center"
                                  variant="outline"
                                >
                                  <Tag className="w-4 h-4 mr-2" />
                                  Explore Topics
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="nclex-style">
                    <div className="space-y-8">
                      <Card className="border-2 border-black neuro-shadow">
                        <CardHeader>
                          <CardTitle>Interactive NCLEX Question Type Tutorial</CardTitle>
                          <CardDescription>
                            Learn about and practice the various question formats on the NCLEX examination with our interactive tutorial
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="mb-6">The NCLEX uses several different question formats to test nursing knowledge. This interactive tutorial will help you understand each question type and develop strategies to approach them confidently.</p>
                          
                          <NCLEXTutorial />
                        </CardContent>
                      </Card>
                      
                      <Card className="border-2 border-black neuro-shadow">
                        <CardHeader>
                          <CardTitle>Nursing Priority Setting Practice</CardTitle>
                          <CardDescription>
                            Master the crucial skill of prioritizing patient care - a critical component of NCLEX success
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="mb-6">Priority setting is one of the most challenging aspects of the NCLEX-RN. This interactive tool helps you practice determining which patient situations require immediate attention versus those that can wait.</p>
                          
                          <NCLEXPriorityDrills 
                            onComplete={(score, total) => 
                              toast({
                                title: "Practice Complete",
                                description: `You scored ${score} out of ${total} on the priority setting practice.`
                              })
                            }
                          />
                        </CardContent>
                      </Card>
                      
                      <Card className="border-2 border-black neuro-shadow">
                        <CardHeader>
                          <CardTitle>Lab Values Quiz & Reference</CardTitle>
                          <CardDescription>
                            Master essential laboratory values for confident NCLEX performance
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="mb-6">Understanding normal ranges and nursing implications for common lab values is essential for NCLEX success. This tool provides both study materials and practice quizzes to reinforce your knowledge.</p>
                          
                          <NCLEXLabValuesQuiz 
                            onComplete={(score, total) => 
                              toast({
                                title: "Quiz Complete",
                                description: `You scored ${score} out of ${total} on the lab values quiz.`
                              })
                            }
                          />
                        </CardContent>
                      </Card>
                      
                      <Card className="border-2 border-black neuro-shadow">
                        <CardHeader>
                          <CardTitle>Medication Calculation Practice</CardTitle>
                          <CardDescription>
                            Build confidence in dosage calculations with interactive practice exercises
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="mb-6">Medication calculation is a critical nursing skill tested on the NCLEX. This tool provides practice with weight-based dosing, flow rates, dilutions, and dosage conversions to ensure you're prepared for calculation questions.</p>
                          
                          <MedicationCalculationPractice 
                            onComplete={(score, total) => 
                              toast({
                                title: "Practice Complete",
                                description: `You scored ${score} out of ${total} on the medication calculations.`
                              })
                            }
                          />
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                  
                  {["med-surg", "peds", "ob", "pharm", "psych", "fund"].map((tab) => {
                    const category = categoryData.find(cat => cat.code === tab);
                    if (!category) return null;
                    
                    return (
                      <TabsContent key={tab} value={tab}>
                        <Card className="border-2 border-black neuro-shadow">
                          <CardHeader className="pb-2">
                            <div className="flex justify-between items-center">
                              <div>
                                <CardTitle>{category.title} Questions</CardTitle>
                                <CardDescription>Practice questions specific to this category</CardDescription>
                              </div>
                              <div className={`p-3 rounded-full ${category.iconBg} text-3xl`}>
                                {category.icon}
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2 mb-4">
                              <div className="flex justify-between text-xs font-medium">
                                <span>Overall Progress</span>
                                <span>12%</span>
                              </div>
                              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div className={`h-full ${category.progressColor}`} style={{ width: '12%' }}></div>
                              </div>
                            </div>
                          
                            <p className="mb-4">Select a subtopic to begin practicing:</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {category.subtopics.map((subtopic, index) => (
                                <Button 
                                  key={index} 
                                  variant="outline" 
                                  onClick={() => handleSelectSubtopic(category.title, subtopic)}
                                  className="justify-start border-2 border-gray-200 hover:border-black h-auto py-3 group"
                                >
                                  <div className="flex items-center gap-3 w-full">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${category.iconBg} group-hover:bg-opacity-80`}>
                                      <span className="text-lg font-medium">{index + 1}</span>
                                    </div>
                                    <div className="text-left flex-1">
                                      <div className="font-medium">{subtopic}</div>
                                      <div className="text-sm text-muted-foreground">{Math.floor(Math.random() * 30) + 10} questions</div>
                                    </div>
                                    <ChevronRight size={18} className="text-gray-400 group-hover:text-black transition-colors" />
                                  </div>
                                </Button>
                              ))}
                            </div>
                            
                            <div className="mt-6 flex justify-between">
                              <Button 
                                onClick={() => handleStartQuiz(category.title)} 
                                className="flex items-center"
                                variant="default"
                              >
                                <CheckCircle size={16} className="mr-2" />
                                Practice All {category.title} Questions
                              </Button>
                              
                              <Button 
                                onClick={() => handleExploreTopics(category.title)}
                                variant="outline"
                              >
                                View Learning Resources
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </TabsContent>
                    );
                  })}
                </Tabs>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
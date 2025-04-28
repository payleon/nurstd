import { useState, useEffect } from "react";
import { Sidebar } from "@/components/ui/sidebar";
import { Header } from "@/components/ui/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { fetchQuestions } from "@/lib/api";
import { Question } from "@shared/schema";
import { Loader2 } from "lucide-react";
import { lazyImport } from "@/lib/lazyImport";

// Lazy load components that aren't needed on initial render
const { NCLEXTutorial } = lazyImport(() => import('@/components/NCLEXTutorial'), 'NCLEXTutorial');
const { Flashcard } = lazyImport(() => import('@/components/Flashcard'), 'Flashcard');

export default function QuestionBank() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);
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
  
  const handleStartQuiz = (category: string) => {
    setSelectedCategory(category);
    toast({
      title: "Starting Quiz",
      description: `Loading ${category} questions...`,
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
                <h1 className="text-3xl font-bold mb-6 text-[#13294B]">Question Bank</h1>
                
                <Tabs defaultValue="all" className="w-full">
                  <TabsList className="mb-6">
                    <TabsTrigger value="all">All Categories</TabsTrigger>
                    <TabsTrigger value="nclex-style">NCLEX Style Questions</TabsTrigger>
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
                        {[
                          { title: "Medical-Surgical", questions: questions.filter(q => q.category === "med-surg").length || 425, icon: "🏥", description: "Critical care, cardiovascular, respiratory, and more" },
                          { title: "Pediatrics", questions: questions.filter(q => q.category === "peds").length || 245, icon: "👶", description: "Growth & development, pediatric conditions, and interventions" },
                          { title: "Obstetrics", questions: questions.filter(q => q.category === "ob").length || 180, icon: "🤰", description: "Pregnancy, labor & delivery, postpartum, and newborn care" },
                          { title: "Pharmacology", questions: questions.filter(q => q.category === "pharm").length || 350, icon: "💊", description: "Drug classifications, administration, and side effects" },
                          { title: "Mental Health", questions: questions.filter(q => q.category === "psych").length || 120, icon: "🧠", description: "Psychiatric disorders, therapeutic communication" },
                          { title: "Fundamentals", questions: questions.filter(q => q.category === "fund").length || 200, icon: "📚", description: "Basic nursing concepts and principles" }
                        ].map((category, index) => (
                          <Card key={index} className="border-2 border-black neuro-shadow">
                            <CardHeader className="pb-3">
                              <div className="flex justify-between items-center">
                                <CardTitle className="text-lg">{category.title}</CardTitle>
                                <span className="text-3xl">{category.icon}</span>
                              </div>
                              <CardDescription>{category.questions} Questions</CardDescription>
                            </CardHeader>
                            <CardContent>
                              <p className="text-sm mb-4">{category.description}</p>
                              <Button 
                                onClick={() => handleStartQuiz(category.title)}
                                className="w-full"
                              >
                                Start Practice Quiz
                              </Button>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="nclex-style">
                    <Card className="border-2 border-black neuro-shadow mb-6">
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
                  </TabsContent>
                  
                  {["med-surg", "peds", "ob", "pharm"].map((tab) => (
                    <TabsContent key={tab} value={tab}>
                      <Card className="border-2 border-black neuro-shadow">
                        <CardHeader>
                          <CardTitle>
                            {tab === "med-surg" && "Medical-Surgical Questions"}
                            {tab === "peds" && "Pediatrics Questions"}
                            {tab === "ob" && "Obstetrics Questions"}
                            {tab === "pharm" && "Pharmacology Questions"}
                          </CardTitle>
                          <CardDescription>
                            Practice questions specific to this category
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="mb-4">Select a subtopic to begin practicing:</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {[1, 2, 3, 4].map((i) => (
                              <Button 
                                key={i} 
                                variant="outline" 
                                onClick={() => handleStartQuiz(`Subtopic ${i}`)}
                                className="justify-start border-2 border-black h-auto py-3"
                              >
                                <div className="text-left">
                                  <div className="font-medium">
                                    {tab === "med-surg" && [`Cardiovascular`, `Respiratory`, `Gastrointestinal`, `Musculoskeletal`][i-1]}
                                    {tab === "peds" && [`Growth & Development`, `Common Conditions`, `Pediatric Medications`, `Special Needs`][i-1]}
                                    {tab === "ob" && [`Prenatal Care`, `Labor & Delivery`, `Postpartum`, `Newborn Care`][i-1]}
                                    {tab === "pharm" && [`Antibiotics`, `Cardiovascular Meds`, `Pain Management`, `Psychiatric Meds`][i-1]}
                                  </div>
                                  <div className="text-sm text-muted-foreground">25 questions</div>
                                </div>
                              </Button>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  ))}
                </Tabs>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
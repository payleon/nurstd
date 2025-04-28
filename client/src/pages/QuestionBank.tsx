import { useState } from "react";
import { Sidebar } from "@/components/ui/sidebar";
import { Header } from "@/components/ui/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function QuestionBank() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { toast } = useToast();
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  const handleStartQuiz = (category: string) => {
    toast({
      title: "Starting Quiz",
      description: `Loading ${category} questions...`,
    });
  };
  
  return (
    <div className="bg-[#f0f2f5] font-sans text-[#333333] min-h-screen neuro-noise">
      <Header toggleSidebar={toggleSidebar} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex h-screen pt-16">
        <main className="flex-1 p-4 md:p-6 lg:pl-72 overflow-auto">
          <div className="max-w-6xl mx-auto">
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    { title: "Medical-Surgical", questions: 425, icon: "🏥", description: "Critical care, cardiovascular, respiratory, and more" },
                    { title: "Pediatrics", questions: 245, icon: "👶", description: "Growth & development, pediatric conditions, and interventions" },
                    { title: "Obstetrics", questions: 180, icon: "🤰", description: "Pregnancy, labor & delivery, postpartum, and newborn care" },
                    { title: "Pharmacology", questions: 350, icon: "💊", description: "Drug classifications, administration, and side effects" },
                    { title: "Mental Health", questions: 120, icon: "🧠", description: "Psychiatric disorders, therapeutic communication" },
                    { title: "Fundamentals", questions: 200, icon: "📚", description: "Basic nursing concepts and principles" }
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
              </TabsContent>
              
              <TabsContent value="nclex-style">
                <Card className="border-2 border-black neuro-shadow mb-6">
                  <CardHeader>
                    <CardTitle>NCLEX Question Types</CardTitle>
                    <CardDescription>
                      Learn about and practice the various question formats on the NCLEX examination
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4">The NCLEX uses several different question formats to test nursing knowledge. Below are examples of each type:</p>
                  </CardContent>
                </Card>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Multiple Choice Questions */}
                  <Card className="border-2 border-black neuro-shadow">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <span className="text-2xl">1</span>
                        <span>Multiple Choice Questions</span>
                      </CardTitle>
                      <CardDescription>Traditional format with one correct answer</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-gray-50 p-4 rounded-md mb-4 border border-gray-200">
                        <p className="font-medium mb-2">Example:</p>
                        <p className="mb-3">A client with type 1 diabetes mellitus has a blood glucose level of 60 mg/dL. Which of the following interventions should the nurse implement first?</p>
                        <div className="space-y-2 pl-4">
                          <p>A. Administer 10-15 g of carbohydrates</p>
                          <p>B. Administer regular insulin</p>
                          <p>C. Check vital signs</p>
                          <p>D. Notify the healthcare provider</p>
                        </div>
                        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
                          <p className="text-blue-800"><strong>Answer: A</strong></p>
                        </div>
                      </div>
                      <Button 
                        onClick={() => handleStartQuiz("Multiple Choice")}
                        className="w-full"
                      >
                        Practice Multiple Choice Questions
                      </Button>
                    </CardContent>
                  </Card>
                  
                  {/* Multiple Response Questions */}
                  <Card className="border-2 border-black neuro-shadow">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <span className="text-2xl">2</span>
                        <span>Multiple Response (Select All That Apply)</span>
                      </CardTitle>
                      <CardDescription>Select all correct options from the choices</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-gray-50 p-4 rounded-md mb-4 border border-gray-200">
                        <p className="font-medium mb-2">Example:</p>
                        <p className="mb-3">A nurse is caring for a patient with a diagnosis of heart failure. Which assessment findings should the nurse expect to find? Select all that apply.</p>
                        <div className="space-y-2 pl-4">
                          <p>□ A. Pulmonary crackles</p>
                          <p>□ B. Jugular venous distention</p>
                          <p>□ C. Decreased blood pressure</p>
                          <p>□ D. Peripheral edema</p>
                          <p>□ E. Increased urinary output</p>
                          <p>□ F. Productive cough</p>
                        </div>
                        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
                          <p className="text-blue-800"><strong>Answer: A, B, D, F</strong></p>
                        </div>
                      </div>
                      <Button 
                        onClick={() => handleStartQuiz("Select All That Apply")}
                        className="w-full"
                      >
                        Practice Select All That Apply Questions
                      </Button>
                    </CardContent>
                  </Card>
                  
                  {/* Fill in the Blank */}
                  <Card className="border-2 border-black neuro-shadow">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <span className="text-2xl">3</span>
                        <span>Fill-in-the-Blank Questions</span>
                      </CardTitle>
                      <CardDescription>Dosage calculations and numerical answers</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-gray-50 p-4 rounded-md mb-4 border border-gray-200">
                        <p className="font-medium mb-2">Example:</p>
                        <p className="mb-3">The healthcare provider orders morphine sulfate 4 mg IV. The medication label reads 2 mg/mL. How many mL should the nurse administer?</p>
                        <div className="mt-2 p-2 bg-white border border-gray-300 rounded">
                          <p>_________ mL</p>
                        </div>
                        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
                          <p className="text-blue-800"><strong>Answer: 2 mL</strong></p>
                        </div>
                      </div>
                      <Button 
                        onClick={() => handleStartQuiz("Fill-in-the-Blank")}
                        className="w-full"
                      >
                        Practice Fill-in-the-Blank Questions
                      </Button>
                    </CardContent>
                  </Card>
                  
                  {/* Hot Spot Questions */}
                  <Card className="border-2 border-black neuro-shadow">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <span className="text-2xl">4</span>
                        <span>Hot Spot Questions</span>
                      </CardTitle>
                      <CardDescription>Identify a specific area on an image</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-gray-50 p-4 rounded-md mb-4 border border-gray-200">
                        <p className="font-medium mb-2">Example:</p>
                        <p className="mb-3">Identify the area where the nurse should auscultate to best assess the mitral valve.</p>
                        <div className="bg-gray-200 w-full h-48 flex items-center justify-center rounded-md mb-2">
                          <p className="text-gray-600">[Image of chest with cardiac landmarks]</p>
                        </div>
                        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
                          <p className="text-blue-800"><strong>Answer: Fifth intercostal space at the midclavicular line (apex of the heart)</strong></p>
                        </div>
                      </div>
                      <Button 
                        onClick={() => handleStartQuiz("Hot Spot")}
                        className="w-full"
                      >
                        Practice Hot Spot Questions
                      </Button>
                    </CardContent>
                  </Card>
                  
                  {/* Drag and Drop / Ordered Response */}
                  <Card className="border-2 border-black neuro-shadow">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <span className="text-2xl">5</span>
                        <span>Ordered Response Questions</span>
                      </CardTitle>
                      <CardDescription>Arrange actions in the correct sequence</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-gray-50 p-4 rounded-md mb-4 border border-gray-200">
                        <p className="font-medium mb-2">Example:</p>
                        <p className="mb-3">Place the following steps for inserting a urinary catheter in the correct order:</p>
                        <div className="space-y-2 pl-4">
                          <p className="p-2 bg-white border border-gray-300 rounded mb-2">Clean the urethral meatus</p>
                          <p className="p-2 bg-white border border-gray-300 rounded mb-2">Inflate the balloon</p>
                          <p className="p-2 bg-white border border-gray-300 rounded mb-2">Perform hand hygiene</p>
                          <p className="p-2 bg-white border border-gray-300 rounded mb-2">Insert the catheter</p>
                          <p className="p-2 bg-white border border-gray-300 rounded mb-2">Apply sterile drapes</p>
                        </div>
                        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
                          <p className="text-blue-800"><strong>Correct order: Perform hand hygiene → Apply sterile drapes → Clean the urethral meatus → Insert the catheter → Inflate the balloon</strong></p>
                        </div>
                      </div>
                      <Button 
                        onClick={() => handleStartQuiz("Ordered Response")}
                        className="w-full"
                      >
                        Practice Ordered Response Questions
                      </Button>
                    </CardContent>
                  </Card>
                  
                  {/* Chart/Exhibit Questions */}
                  <Card className="border-2 border-black neuro-shadow">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <span className="text-2xl">6</span>
                        <span>Chart/Exhibit Questions</span>
                      </CardTitle>
                      <CardDescription>Analyze patient data from charts or exhibits</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-gray-50 p-4 rounded-md mb-4 border border-gray-200">
                        <p className="font-medium mb-2">Example:</p>
                        <p className="mb-3">Refer to the following lab results for a 72-year-old patient:</p>
                        <div className="p-3 bg-white border border-gray-300 rounded mb-3">
                          <p><strong>Lab Values:</strong></p>
                          <p>Sodium: 134 mEq/L</p>
                          <p>Potassium: 3.0 mEq/L</p>
                          <p>Chloride: 98 mEq/L</p>
                          <p>BUN: 22 mg/dL</p>
                          <p>Creatinine: 1.1 mg/dL</p>
                        </div>
                        <p className="mb-3">Which lab value requires immediate nursing intervention?</p>
                        <div className="space-y-2 pl-4">
                          <p>A. Sodium</p>
                          <p>B. Potassium</p>
                          <p>C. Chloride</p>
                          <p>D. BUN</p>
                        </div>
                        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
                          <p className="text-blue-800"><strong>Answer: B. Potassium (hypokalemia)</strong></p>
                        </div>
                      </div>
                      <Button 
                        onClick={() => handleStartQuiz("Chart/Exhibit")}
                        className="w-full"
                      >
                        Practice Chart/Exhibit Questions
                      </Button>
                    </CardContent>
                  </Card>
                </div>
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
          </div>
        </main>
      </div>
    </div>
  );
}
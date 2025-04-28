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
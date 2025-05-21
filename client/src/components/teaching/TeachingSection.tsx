import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Book, BookOpen, Video, FileText, PenTool, Brain, Lightbulb, ChevronRight } from "lucide-react";
import { Link } from "wouter";

interface Resource {
  id: string;
  title: string;
  description: string;
  type: "video" | "article" | "practice" | "concept";
  category: string;
  difficultyLevel: "beginner" | "intermediate" | "advanced";
  estimatedTime: number; // in minutes
  link: string;
}

const SAMPLE_RESOURCES: Resource[] = [
  {
    id: "1",
    title: "Understanding ABGs (Arterial Blood Gases)",
    description: "Learn how to interpret ABG results and identify acid-base imbalances with this comprehensive guide.",
    type: "concept",
    category: "Med-Surg",
    difficultyLevel: "intermediate",
    estimatedTime: 15,
    link: "/learning/abg-interpretation"
  },
  {
    id: "2",
    title: "Prioritization in Critical Care Nursing",
    description: "Master the skill of prioritizing patient care in high-pressure situations.",
    type: "article",
    category: "Critical Care",
    difficultyLevel: "advanced",
    estimatedTime: 20,
    link: "/learning/prioritization-critical-care"
  },
  {
    id: "3",
    title: "Medication Administration Safety",
    description: "Review the essential steps for safe medication administration with this interactive tutorial.",
    type: "practice",
    category: "Fundamentals",
    difficultyLevel: "beginner",
    estimatedTime: 10,
    link: "/learning/medication-safety"
  },
  {
    id: "4",
    title: "Heart Sounds and Murmurs",
    description: "Audio guide to identifying normal and abnormal heart sounds for accurate cardiac assessment.",
    type: "video",
    category: "Cardiac",
    difficultyLevel: "intermediate",
    estimatedTime: 25,
    link: "/learning/heart-sounds"
  },
  {
    id: "5",
    title: "Diabetes Management Updates",
    description: "Latest evidence-based practices for managing diabetes and preventing complications.",
    type: "article",
    category: "Endocrine",
    difficultyLevel: "intermediate",
    estimatedTime: 15,
    link: "/learning/diabetes-updates"
  },
  {
    id: "6",
    title: "Pediatric Medication Calculations",
    description: "Practice pediatric dosage calculations with step-by-step examples and interactive problems.",
    type: "practice",
    category: "Pediatrics",
    difficultyLevel: "intermediate",
    estimatedTime: 20,
    link: "/learning/pediatric-calculations"
  }
];

const getResourceIcon = (type: Resource["type"]) => {
  switch (type) {
    case "video":
      return <Video className="h-5 w-5 text-blue-500" />;
    case "article":
      return <FileText className="h-5 w-5 text-purple-500" />;
    case "practice":
      return <PenTool className="h-5 w-5 text-green-500" />;
    case "concept":
      return <Brain className="h-5 w-5 text-amber-500" />;
    default:
      return <Lightbulb className="h-5 w-5 text-gray-500" />;
  }
};

const getDifficultyColor = (level: Resource["difficultyLevel"]) => {
  switch (level) {
    case "beginner":
      return "bg-green-100 text-green-800";
    case "intermediate":
      return "bg-blue-100 text-blue-800";
    case "advanced":
      return "bg-purple-100 text-purple-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export function TeachingSection() {
  const [activeTab, setActiveTab] = useState("all");
  const [activeDifficulty, setActiveDifficulty] = useState<Resource["difficultyLevel"] | "all">("all");
  
  const filteredResources = SAMPLE_RESOURCES.filter(resource => {
    const matchesCategory = activeTab === "all" || resource.category.toLowerCase() === activeTab.toLowerCase();
    const matchesDifficulty = activeDifficulty === "all" || resource.difficultyLevel === activeDifficulty;
    return matchesCategory && matchesDifficulty;
  });
  
  const uniqueCategories = Array.from(new Set(SAMPLE_RESOURCES.map(r => r.category)));
  const categories = ["all", ...uniqueCategories];
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Learning Resources</h2>
        <p className="text-muted-foreground">
          Enhance your nursing knowledge with our curated educational content.
        </p>
      </div>
      
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <div className="flex items-center justify-between">
          <TabsList className="grid grid-cols-4 md:grid-cols-6 lg:w-auto lg:grid-cols-8">
            {categories.map(category => (
              <TabsTrigger 
                key={category} 
                value={category}
                className="capitalize"
              >
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
          
          <div className="hidden md:flex space-x-2">
            <Badge 
              variant={activeDifficulty === "all" ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setActiveDifficulty("all")}
            >
              All Levels
            </Badge>
            <Badge 
              variant={activeDifficulty === "beginner" ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setActiveDifficulty("beginner")}
            >
              Beginner
            </Badge>
            <Badge 
              variant={activeDifficulty === "intermediate" ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setActiveDifficulty("intermediate")}
            >
              Intermediate
            </Badge>
            <Badge 
              variant={activeDifficulty === "advanced" ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setActiveDifficulty("advanced")}
            >
              Advanced
            </Badge>
          </div>
        </div>
        
        <TabsContent value={activeTab} className="mt-6">
          {filteredResources.length === 0 ? (
            <div className="text-center py-10">
              <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium">No resources found</h3>
              <p className="text-muted-foreground mt-2">
                Try selecting a different category or difficulty level
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredResources.map(resource => (
                <Card key={resource.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      {getResourceIcon(resource.type)}
                      <Badge className={getDifficultyColor(resource.difficultyLevel)}>
                        {resource.difficultyLevel}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg mt-2">{resource.title}</CardTitle>
                    <CardDescription>{resource.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Book className="h-4 w-4 mr-1" />
                      <span>{resource.category}</span>
                      <span className="mx-2">•</span>
                      <span>{resource.estimatedTime} min</span>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full" asChild>
                      <Link href={resource.link} className="flex items-center justify-center">
                        <span>Start Learning</span>
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-center mt-6">
        <Button variant="outline" size="lg">
          View All Learning Resources
        </Button>
      </div>
    </div>
  );
}
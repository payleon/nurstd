import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Book, BookOpen, ChevronRight } from "lucide-react";
import { Link } from "wouter";
import { LEARNING_RESOURCES } from "@/data/learning-resources";
import { getResourceIcon, getDifficultyColor } from "@/lib/resource-helpers";

export function TeachingSection() {
  const [activeTab, setActiveTab] = useState("all");
  const [activeDifficulty, setActiveDifficulty] = useState<"beginner" | "intermediate" | "advanced" | "all">("all");
  
  // Show only 6 featured resources on the main page
  const displayedResources = LEARNING_RESOURCES.slice(0, 6);
  
  const filteredResources = displayedResources.filter(resource => {
    const matchesCategory = activeTab === "all" || resource.category.toLowerCase() === activeTab.toLowerCase();
    const matchesDifficulty = activeDifficulty === "all" || resource.difficultyLevel === activeDifficulty;
    return matchesCategory && matchesDifficulty;
  });
  
  const uniqueCategories = Array.from(new Set(displayedResources.map(r => r.category)));
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
        <Button variant="outline" size="lg" asChild>
          <Link href="/learning/resources">
            View All Learning Resources
          </Link>
        </Button>
      </div>
    </div>
  );
}
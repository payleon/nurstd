import { useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, Search, Book, Filter, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getResourceIcon, getDifficultyColor } from "@/lib/resource-helpers";

// Include our sample resources
import { LEARNING_RESOURCES } from "@/data/learning-resources";

export default function ResourcesIndex() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  
  // Get unique categories from resources
  const categories = ["all", ...Array.from(new Set(LEARNING_RESOURCES.map(r => r.category)))];
  
  // Filter resources based on search, category, and filters
  const filteredResources = LEARNING_RESOURCES.filter(resource => {
    const matchesSearch = searchQuery === "" || 
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = activeCategory === "all" || 
      resource.category.toLowerCase() === activeCategory.toLowerCase();
    
    const matchesDifficulty = difficultyFilter === "all" || 
      resource.difficultyLevel === difficultyFilter;
    
    const matchesType = typeFilter === "all" || 
      resource.type === typeFilter;
    
    return matchesSearch && matchesCategory && matchesDifficulty && matchesType;
  });
  
  return (
    <div className="bg-[#f9fafb] min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Navigation */}
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost" className="flex items-center text-blue-600">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Learning Resources</h1>
            <p className="text-gray-600 mt-1">
              Browse our comprehensive collection of nursing education materials
            </p>
          </div>
          
          {/* Search */}
          <div className="relative w-full md:w-auto md:min-w-[300px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Search resources..." 
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        {/* Filters & Category Tabs */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-8">
          <Tabs defaultValue="all" value={activeCategory} onValueChange={setActiveCategory}>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <TabsList className="grid grid-cols-3 md:grid-cols-6 lg:w-auto lg:grid-cols-8">
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
              
              <div className="flex flex-col md:flex-row gap-2">
                <div className="flex items-center">
                  <Filter className="h-4 w-4 mr-2 text-gray-500" />
                  <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Levels</SelectItem>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center">
                  <SlidersHorizontal className="h-4 w-4 mr-2 text-gray-500" />
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Resource Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="video">Video</SelectItem>
                      <SelectItem value="article">Article</SelectItem>
                      <SelectItem value="practice">Practice</SelectItem>
                      <SelectItem value="concept">Concept</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            
            {/* Resource Cards */}
            <TabsContent value={activeCategory} className="mt-6">
              {filteredResources.length === 0 ? (
                <div className="text-center py-16">
                  <Book className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-medium">No resources found</h3>
                  <p className="text-muted-foreground mt-2 max-w-md mx-auto">
                    Try adjusting your search terms or filters to find what you're looking for
                  </p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => {
                      setSearchQuery("");
                      setDifficultyFilter("all");
                      setTypeFilter("all");
                    }}
                  >
                    Clear Filters
                  </Button>
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
                            <ArrowLeft className="h-4 w-4 ml-1 rotate-180" />
                          </Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Resource Statistics */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">{LEARNING_RESOURCES.length}</p>
              <p className="text-sm text-gray-600">Total Resources</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">
                {LEARNING_RESOURCES.filter(r => r.difficultyLevel === "beginner").length}
              </p>
              <p className="text-sm text-gray-600">Beginner</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-amber-600">
                {LEARNING_RESOURCES.filter(r => r.difficultyLevel === "intermediate").length}
              </p>
              <p className="text-sm text-gray-600">Intermediate</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-purple-600">
                {LEARNING_RESOURCES.filter(r => r.difficultyLevel === "advanced").length}
              </p>
              <p className="text-sm text-gray-600">Advanced</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Monitor, Brain, Zap } from "lucide-react";

interface ConceptNode {
  id: string;
  title: string;
  description: string;
  related: string[];
}

// Sample concept map for nursing concepts
const NURSING_CONCEPTS: ConceptNode[] = [
  {
    id: "fluid-balance",
    title: "Fluid Balance",
    description: "Maintaining homeostasis through balanced intake and output. Connected to renal function, cardiac output, and electrolyte management.",
    related: ["abg-interpretation", "cardiac-function", "renal-function"]
  },
  {
    id: "abg-interpretation",
    title: "ABG Interpretation",
    description: "Analysis of arterial blood gases to assess respiratory and metabolic acid-base balance.",
    related: ["fluid-balance", "respiratory-function", "metabolic-disorders"]
  },
  {
    id: "cardiac-function",
    title: "Cardiac Function",
    description: "Principles of heart function, including cardiac output, preload, afterload, and contractility.",
    related: ["fluid-balance", "hemodynamics", "perfusion"]
  },
  {
    id: "perfusion",
    title: "Perfusion",
    description: "Delivery of oxygenated blood to tissues and organs. Essential for cellular metabolism and function.",
    related: ["cardiac-function", "respiratory-function", "hemodynamics"]
  },
  {
    id: "hemodynamics",
    title: "Hemodynamics",
    description: "Physical principles governing blood flow through the cardiovascular system.",
    related: ["cardiac-function", "perfusion", "shock-states"]
  },
  {
    id: "respiratory-function",
    title: "Respiratory Function",
    description: "Mechanics and control of breathing, gas exchange, and oxygen transport.",
    related: ["abg-interpretation", "perfusion", "ventilation"]
  },
  {
    id: "metabolic-disorders",
    title: "Metabolic Disorders",
    description: "Conditions affecting metabolic processes, including diabetes, electrolyte imbalances, and acid-base disorders.",
    related: ["abg-interpretation", "fluid-balance", "renal-function"]
  },
  {
    id: "renal-function",
    title: "Renal Function",
    description: "Kidney processes for filtration, reabsorption, and excretion to maintain fluid and electrolyte balance.",
    related: ["fluid-balance", "metabolic-disorders", "electrolytes"]
  },
  {
    id: "shock-states",
    title: "Shock States",
    description: "Conditions of inadequate tissue perfusion, including hypovolemic, cardiogenic, and septic shock.",
    related: ["hemodynamics", "perfusion", "fluid-balance"]
  },
  {
    id: "ventilation",
    title: "Ventilation",
    description: "Process of moving air into and out of the lungs, including mechanical ventilation principles.",
    related: ["respiratory-function", "abg-interpretation", "oxygenation"]
  },
  {
    id: "electrolytes",
    title: "Electrolyte Balance",
    description: "Management of key electrolytes including sodium, potassium, calcium, and magnesium.",
    related: ["fluid-balance", "renal-function", "metabolic-disorders"]
  },
  {
    id: "oxygenation",
    title: "Oxygenation",
    description: "Process of oxygen delivery to tissues and carbon dioxide removal.",
    related: ["ventilation", "perfusion", "respiratory-function"]
  }
];

export function ConceptVisualizer() {
  const [activeConcept, setActiveConcept] = useState<ConceptNode>(NURSING_CONCEPTS[0]);
  const [viewHistory, setViewHistory] = useState<string[]>([NURSING_CONCEPTS[0].id]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const navigateToConcept = (conceptId: string) => {
    const concept = NURSING_CONCEPTS.find(c => c.id === conceptId);
    if (concept) {
      setActiveConcept(concept);
      
      // Update history for forward/back navigation
      if (historyIndex < viewHistory.length - 1) {
        // If we're in the middle of history, trim the forward history
        setViewHistory([...viewHistory.slice(0, historyIndex + 1), conceptId]);
      } else {
        // Just add to history
        setViewHistory([...viewHistory, conceptId]);
      }
      setHistoryIndex(prevIndex => prevIndex + 1);
    }
  };

  const goBack = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      const previousConceptId = viewHistory[newIndex];
      const concept = NURSING_CONCEPTS.find(c => c.id === previousConceptId);
      if (concept) {
        setActiveConcept(concept);
        setHistoryIndex(newIndex);
      }
    }
  };

  const goForward = () => {
    if (historyIndex < viewHistory.length - 1) {
      const newIndex = historyIndex + 1;
      const nextConceptId = viewHistory[newIndex];
      const concept = NURSING_CONCEPTS.find(c => c.id === nextConceptId);
      if (concept) {
        setActiveConcept(concept);
        setHistoryIndex(newIndex);
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight flex items-center">
            <Brain className="h-6 w-6 mr-2 text-blue-600" />
            <span>Concept Explorer</span>
          </h2>
          <p className="text-muted-foreground">
            Visualize connections between essential nursing concepts
          </p>
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={goBack}
            disabled={historyIndex <= 0}
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={goForward}
            disabled={historyIndex >= viewHistory.length - 1}
          >
            Forward
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>

      <Card className="bg-blue-50 border-blue-200">
        <CardHeader className="pb-2">
          <div className="flex items-center">
            <Monitor className="h-5 w-5 mr-2 text-blue-600" />
            <CardTitle>{activeConcept.title}</CardTitle>
          </div>
          <CardDescription className="mt-2">{activeConcept.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mt-2">
            <h4 className="text-sm font-medium text-blue-800 mb-2 flex items-center">
              <Zap className="h-4 w-4 mr-1" />
              Related Concepts:
            </h4>
            <div className="flex flex-wrap gap-2">
              {activeConcept.related.map(relatedId => {
                const relatedConcept = NURSING_CONCEPTS.find(c => c.id === relatedId);
                return (
                  relatedConcept && (
                    <Button 
                      key={relatedId} 
                      variant="outline" 
                      size="sm"
                      className="bg-white hover:bg-blue-100 border-blue-200"
                      onClick={() => navigateToConcept(relatedId)}
                    >
                      {relatedConcept.title}
                    </Button>
                  )
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
        {NURSING_CONCEPTS.slice(0, 6)
          .filter(concept => concept.id !== activeConcept.id)
          .map(concept => (
            <Card 
              key={concept.id} 
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => navigateToConcept(concept.id)}
            >
              <CardHeader className="p-4">
                <CardTitle className="text-base">{concept.title}</CardTitle>
                <CardDescription className="text-xs line-clamp-2">
                  {concept.description}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
      </div>
      
      <div className="flex justify-center mt-4">
        <Button variant="outline">
          View All Concepts
        </Button>
      </div>
    </div>
  );
}
import { Video, FileText, PenTool, Brain, Lightbulb } from "lucide-react";

export type ResourceType = "video" | "article" | "practice" | "concept";
export type DifficultyLevel = "beginner" | "intermediate" | "advanced";

export function getResourceIcon(type: ResourceType) {
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
}

export function getDifficultyColor(level: DifficultyLevel) {
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
}
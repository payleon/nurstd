import React, { useState } from "react";
import { Question } from "@shared/schema";
import { cleanQuestionTitle } from "../utils/formatting";
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, Flag, Maximize2, RotateCcw, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface FlashcardProps {
  question: Question;
  onNext: () => void;
  onPrev: () => void;
  currentIndex: number;
  totalCards: number;
}

export function Flashcard({ question, onNext, onPrev, currentIndex, totalCards }: FlashcardProps) {
  const [flipped, setFlipped] = useState(false);
  const [flagged, setFlagged] = useState(false);
  const [starred, setStarred] = useState(false);

  const handleFlip = () => {
    setFlipped(!flipped);
  };

  const toggleFlag = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFlagged(!flagged);
  };

  const toggleStar = (e: React.MouseEvent) => {
    e.stopPropagation();
    setStarred(!starred);
  };

  // Get category badge color
  const getCategoryColor = () => {
    switch(question.category) {
      case "med-surg": return "bg-blue-100 text-blue-800";
      case "peds": return "bg-green-100 text-green-800";
      case "ob": return "bg-purple-100 text-purple-800";
      case "pharm": return "bg-red-100 text-red-800";
      case "psych": return "bg-yellow-100 text-yellow-800";
      case "fund": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  // Get category label
  const getCategoryLabel = () => {
    switch(question.category) {
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
    <div className="max-w-3xl mx-auto">
      {/* Flashcard Progress Bar and Counter */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">
            Card {currentIndex + 1} of {totalCards}
          </span>
          <div className="w-24 h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#4B9CD3]" 
              style={{ width: `${((currentIndex + 1) / totalCards) * 100}%` }}
            ></div>
          </div>
        </div>
        
        <div className="flex items-center space-x-1">
          <span className={cn(
            "text-xs px-2 py-0.5 rounded-full font-medium",
            getCategoryColor()
          )}>
            {getCategoryLabel()}
          </span>
          
          <button 
            onClick={toggleFlag}
            className={cn(
              "p-1 rounded-full transition-colors", 
              flagged ? "text-red-500 hover:text-red-600" : "text-gray-400 hover:text-gray-600"
            )}
            title={flagged ? "Remove flag" : "Flag for review"}
          >
            <Flag size={16} className={flagged ? "fill-red-500" : ""} />
          </button>
          
          <button 
            onClick={toggleStar} 
            className={cn(
              "p-1 rounded-full transition-colors", 
              starred ? "text-yellow-500 hover:text-yellow-600" : "text-gray-400 hover:text-gray-600"
            )}
            title={starred ? "Remove from favorites" : "Add to favorites"}
          >
            <Star size={16} className={starred ? "fill-yellow-500" : ""} />
          </button>
        </div>
      </div>

      {/* Flashcard */}
      <motion.div
        className="h-[450px] w-full perspective-1000 cursor-pointer"
        onClick={handleFlip}
        whileHover={{ scale: 1.005 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <div 
          className={`relative w-full h-full transition-transform duration-500 transform-style-preserve-3d ${
            flipped ? "rotate-y-180" : ""
          }`}
        >
          {/* Front of card (Question) */}
          <div className={`absolute w-full h-full backface-hidden ${
            flipped ? "hidden" : "block"
          }`}>
            <div className="w-full h-full bg-white rounded-xl shadow-lg border-2 border-[#4B9CD3] overflow-hidden flex flex-col">
              <div className="bg-[#13294B] text-white p-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-xl">{cleanQuestionTitle(question.title)}</h3>
                  <div className="text-xs bg-white/20 px-2 py-0.5 rounded-md">
                    {question.type === "mc" && "Multiple Choice"}
                    {question.type === "sata" && "Select All That Apply"}
                    {question.type === "fill_in_blank" && "Fill in the Blank"}
                  </div>
                </div>
              </div>
              
              <div className="p-6 flex-1 flex flex-col overflow-auto">
                <p className="text-lg leading-relaxed">
                  {question.text}
                </p>
                
                {question.type !== "fill_in_blank" && (
                  <div className="mt-6 w-full">
                    <ul className="space-y-3">
                      {question.choices?.map((choice) => (
                        <li 
                          key={choice.id} 
                          className="text-left px-4 py-3 border-2 border-gray-200 rounded-lg hover:border-[#4B9CD3] transition-colors"
                        >
                          <div className="flex items-start">
                            <span className="flex-shrink-0 w-6 h-6 bg-[#13294B] text-white rounded-full flex items-center justify-center mr-3 font-medium">
                              {choice.id}
                            </span>
                            <span>{choice.text}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                    
                    {question.type === "sata" && (
                      <p className="mt-3 text-sm text-gray-500 italic">
                        Remember to select all options that apply to this question.
                      </p>
                    )}
                  </div>
                )}
                
                {question.type === "fill_in_blank" && (
                  <div className="mt-6 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <p className="text-gray-500">Type your answer in the input field</p>
                  </div>
                )}
              </div>
              
              <div className="p-4 bg-gray-50 text-center">
                <div className="flex items-center justify-center space-x-2">
                  <RotateCcw className="h-4 w-4 text-[#4B9CD3]" />
                  <span className="font-medium text-[#13294B]">Tap to see answer</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Back of card (Answer) */}
          <div className={`absolute w-full h-full backface-hidden rotate-y-180 ${
            flipped ? "block" : "hidden"
          }`}>
            <div className="w-full h-full bg-white rounded-xl shadow-lg border-2 border-[#4B9CD3] overflow-hidden flex flex-col">
              <div className="bg-[#4B9CD3] text-white p-4">
                <h3 className="font-bold text-xl">Answer</h3>
              </div>
              
              <div className="p-6 flex-1 overflow-auto">
                <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-bold text-[#13294B] mb-2">Correct Answer:</h4>
                  {Array.isArray(question.correctAnswer) ? (
                    <ul className="space-y-2 pl-6 list-disc">
                      {question.correctAnswer.map(ans => {
                        const choice = question.choices?.find(c => c.id === ans);
                        return (
                          <li key={ans} className="font-medium">
                            <span className="inline-flex items-center">
                              <span className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center mr-2 font-medium">
                                {ans}
                              </span>
                              {choice?.text}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    <p className="font-medium">
                      {question.type === "fill_in_blank" ? (
                        <span className="text-green-700 bg-green-100 px-2 py-1 rounded">{question.correctAnswer}</span>
                      ) : (
                        <span className="inline-flex items-center">
                          <span className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center mr-2 font-medium">
                            {question.correctAnswer}
                          </span>
                          {question.choices?.find(c => c.id === question.correctAnswer)?.text}
                        </span>
                      )}
                    </p>
                  )}
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-bold text-[#13294B] mb-2">Rationale:</h4>
                  <p className="text-gray-700 leading-relaxed">
                    {question.rationale}
                  </p>
                </div>
              </div>
              
              <div className="p-4 bg-gray-50 text-center">
                <div className="flex items-center justify-center space-x-2">
                  <RotateCcw className="h-4 w-4 text-[#4B9CD3]" />
                  <span className="font-medium text-[#13294B]">Tap to see question</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Navigation buttons */}
      <div className="flex justify-between items-center mt-6">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPrev();
            setFlipped(false);
          }}
          className={cn(
            "flex items-center py-2 px-4 rounded-md transition-colors",
            currentIndex === 0 
              ? "bg-gray-200 text-gray-500 cursor-not-allowed" 
              : "bg-[#13294B] text-white hover:bg-[#0A1E3A]"
          )}
          disabled={currentIndex === 0}
        >
          <ChevronLeft className="mr-1 h-5 w-5" />
          Previous
        </button>
        
        <div className="flex space-x-2">
          <button
            onClick={(e) => e.stopPropagation()}
            className="bg-gray-200 text-gray-700 p-2 rounded-md hover:bg-gray-300 transition-colors"
            title="Full screen"
          >
            <Maximize2 size={18} />
          </button>
        </div>
        
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNext();
            setFlipped(false);
          }}
          className={cn(
            "flex items-center py-2 px-4 rounded-md transition-colors",
            currentIndex === totalCards - 1 
              ? "bg-gray-200 text-gray-500 cursor-not-allowed" 
              : "bg-[#4B9CD3] text-white hover:bg-[#3d7eaa]"
          )}
          disabled={currentIndex === totalCards - 1}
        >
          Next
          <ChevronRight className="ml-1 h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
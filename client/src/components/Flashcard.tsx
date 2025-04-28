import React, { useState } from "react";
import { Question } from "@shared/schema";
import { RotateCcw } from "lucide-react";

interface FlashcardProps {
  question: Question;
  onNext: () => void;
  onPrev: () => void;
  currentIndex: number;
  totalCards: number;
}

export function Flashcard({ question, onNext, onPrev, currentIndex, totalCards }: FlashcardProps) {
  const [flipped, setFlipped] = useState(false);

  const handleFlip = () => {
    setFlipped(!flipped);
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Card counter */}
      <div className="mb-4 text-center">
        <span className="text-sm font-medium text-gray-500">
          Card {currentIndex + 1} of {totalCards}
        </span>
      </div>

      {/* Flashcard */}
      <div
        className="h-[400px] w-full perspective-1000 cursor-pointer"
        onClick={handleFlip}
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
              <div className="bg-[#13294B] text-white p-4 text-center">
                <h3 className="font-bold text-xl">{question.title}</h3>
              </div>
              
              <div className="p-6 flex-1 flex flex-col justify-center items-center">
                <p className="text-center text-lg">
                  {question.text}
                </p>
                
                {question.type !== "fill_in_blank" && (
                  <div className="mt-6 w-full max-w-md">
                    <ul className="space-y-2">
                      {question.choices?.map((choice) => (
                        <li 
                          key={choice.id} 
                          className="text-left px-4 py-2 border border-gray-200 rounded-md"
                        >
                          <span className="font-medium">{choice.id}.</span> {choice.text}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              
              <div className="p-4 bg-gray-50 text-center text-sm text-gray-500 italic">
                Tap to see answer
                <div className="flex items-center justify-center mt-2">
                  <RotateCcw className="h-4 w-4 mr-1" />
                  <span>Flip card</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Back of card (Answer) */}
          <div className={`absolute w-full h-full backface-hidden rotate-y-180 ${
            flipped ? "block" : "hidden"
          }`}>
            <div className="w-full h-full bg-white rounded-xl shadow-lg border-2 border-[#4B9CD3] overflow-hidden flex flex-col">
              <div className="bg-[#4B9CD3] text-white p-4 text-center">
                <h3 className="font-bold text-xl">Answer</h3>
              </div>
              
              <div className="p-6 flex-1 overflow-auto">
                <div className="mb-4">
                  <h4 className="font-bold text-[#13294B] mb-2">Correct Answer:</h4>
                  {Array.isArray(question.correctAnswer) ? (
                    <ul className="list-disc pl-6 space-y-1">
                      {question.correctAnswer.map(ans => {
                        const choice = question.choices?.find(c => c.id === ans);
                        return (
                          <li key={ans} className="font-medium">
                            {ans}: {choice?.text}
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    <p className="font-medium">
                      {question.type === "fill_in_blank" ? (
                        question.correctAnswer
                      ) : (
                        <>
                          {question.correctAnswer}: {
                            question.choices?.find(c => c.id === question.correctAnswer)?.text
                          }
                        </>
                      )}
                    </p>
                  )}
                </div>
                
                <div>
                  <h4 className="font-bold text-[#13294B] mb-2">Rationale:</h4>
                  <p className="text-gray-700">
                    {question.rationale}
                  </p>
                </div>
              </div>
              
              <div className="p-4 bg-gray-50 text-center text-sm text-gray-500 italic">
                Tap to see question
                <div className="flex items-center justify-center mt-2">
                  <RotateCcw className="h-4 w-4 mr-1" />
                  <span>Flip card</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Navigation buttons */}
      <div className="flex justify-between mt-6">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPrev();
            setFlipped(false);
          }}
          className="bg-[#13294B] text-white py-2 px-6 rounded-md hover:bg-[#0A1E3A] transition-colors"
          disabled={currentIndex === 0}
        >
          Previous
        </button>
        
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNext();
            setFlipped(false);
          }}
          className="bg-[#4B9CD3] text-white py-2 px-6 rounded-md hover:bg-[#3d7eaa] transition-colors"
          disabled={currentIndex === totalCards - 1}
        >
          Next
        </button>
      </div>
    </div>
  );
}
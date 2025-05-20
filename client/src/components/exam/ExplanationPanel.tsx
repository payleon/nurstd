import React from 'react';
import { CheckCircle, AlertCircle, ExternalLink } from 'lucide-react';
import { Question } from '@shared/schema';

export interface ExplanationPanelProps {
  isVisible: boolean;
  question: Question;
  correctAnswer: string | string[];
  explanationText?: string;
}

// Define a type for enhanced question properties
interface QuestionEnhancements {
  rationale?: string;
  concepts?: string[];
  references?: string[];
}

export function ExplanationPanel({
  isVisible,
  question,
  correctAnswer,
  explanationText
}: ExplanationPanelProps) {
  if (!isVisible) return null;
  
  // Access question properties safely
  const questionAny = question as any;
  
  // Format answer for display
  const formatAnswer = (answer: string | string[]) => {
    if (Array.isArray(answer)) {
      return answer.join(', ');
    }
    return answer;
  };
  
  // Determine if this is a SATA or MC question
  const isSataQuestion = question.type === 'sata';
  const isMcQuestion = question.type === 'mc';
  
  // Get concepts and references from the question if available
  const concepts: string[] = enhancedQuestion.concepts || [];
  const references: string[] = enhancedQuestion.references || [];
  
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-blue-50 p-3 border-b border-blue-100 flex items-center">
        <CheckCircle className="text-blue-600 mr-2 h-5 w-5" />
        <h3 className="font-medium text-blue-900">Explanation</h3>
      </div>
      
      {/* Answer */}
      <div className="p-4 border-b border-gray-100">
        <h4 className="text-sm font-medium text-gray-500 mb-1">Correct Answer</h4>
        <div className="font-medium text-gray-900">
          {isMcQuestion ? (
            formatAnswer(correctAnswer)
          ) : isSataQuestion ? (
            <div>
              <p className="mb-2">Select all that apply:</p>
              <ul className="list-disc ml-5 space-y-1">
                {Array.isArray(correctAnswer) && correctAnswer.map((answer, index) => (
                  <li key={index}>{answer}</li>
                ))}
              </ul>
            </div>
          ) : (
            formatAnswer(correctAnswer)
          )}
        </div>
      </div>
      
      {/* Explanation */}
      {explanationText && (
        <div className="p-4 border-b border-gray-100">
          <h4 className="text-sm font-medium text-gray-500 mb-1">Rationale</h4>
          <div className="text-gray-700">
            <p className="whitespace-pre-line">{explanationText}</p>
          </div>
        </div>
      )}
      
      {/* Key Concepts */}
      {concepts && concepts.length > 0 && (
        <div className="p-4 border-b border-gray-100">
          <h4 className="text-sm font-medium text-gray-500 mb-2">Key Concepts</h4>
          <div className="flex flex-wrap gap-2">
            {concepts.map((concept, index) => (
              <span 
                key={index}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
              >
                {concept}
              </span>
            ))}
          </div>
        </div>
      )}
      
      {/* References */}
      {references && references.length > 0 && (
        <div className="p-4">
          <h4 className="text-sm font-medium text-gray-500 mb-2">References</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            {references.map((reference, index) => (
              <li key={index} className="flex items-start">
                <ExternalLink className="h-4 w-4 text-gray-400 mr-1 mt-0.5 flex-shrink-0" />
                <span>{reference}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {/* No concepts or references */}
      {(!concepts || concepts.length === 0) && (!references || references.length === 0) && !explanationText && (
        <div className="p-4 text-center text-gray-500 italic">
          <AlertCircle className="h-5 w-5 mx-auto mb-2" />
          <p>No additional explanation available for this question.</p>
        </div>
      )}
    </div>
  );
}
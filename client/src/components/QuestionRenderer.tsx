import React, { useState } from 'react';
import { Question } from '@shared/schema';
import { Button } from '@/components/ui/button';
import { OrderedResponseQuestion } from '@/components/exam/OrderedResponseQuestion';
import { InteractiveDiagram } from '@/components/exam/InteractiveDiagram';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Check, ChevronDown, ChevronUp } from 'lucide-react';

interface QuestionRendererProps {
  question: Question;
  onAnswer: (answer: string | string[]) => void;
  userAnswer?: string | string[];
  showRationale?: boolean;
  isCorrect?: boolean;
}

export function QuestionRenderer({
  question,
  onAnswer,
  userAnswer,
  showRationale = false,
  isCorrect
}: QuestionRendererProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(
    typeof userAnswer === 'string' ? userAnswer : null
  );
  const [selectedOptions, setSelectedOptions] = useState<string[]>(
    Array.isArray(userAnswer) ? userAnswer : []
  );
  const [orderedItems, setOrderedItems] = useState<string[]>([]);
  const [selectedHotspots, setSelectedHotspots] = useState<string[]>(
    Array.isArray(userAnswer) ? userAnswer : []
  );
  
  // Get type-specific properties safely
  const getChoices = () => {
    if ('choices' in question && Array.isArray(question.choices)) {
      return question.choices;
    }
    return [];
  };
  
  // Helper to extract choice ID
  const getChoiceId = (choice: any): string => {
    return typeof choice === 'object' && choice.id ? choice.id : choice;
  };
  
  // Helper to extract choice text
  const getChoiceText = (choice: any): string => {
    return typeof choice === 'object' && choice.text ? choice.text : choice;
  };
  
  const getItems = () => {
    if ('items' in question && Array.isArray(question.items)) {
      return question.items;
    }
    return [];
  };
  
  const getHotspots = () => {
    if ('hotspots' in question && Array.isArray(question.hotspots)) {
      return question.hotspots;
    }
    return [];
  };
  
  const getImage = () => {
    if ('image' in question && typeof question.image === 'string') {
      return question.image;
    }
    return '';
  };

  const getCorrectAnswer = () => {
    if ('correctAnswer' in question) {
      if (Array.isArray(question.correctAnswer)) {
        // If it's an array of answers (for SATA questions)
        return question.correctAnswer.map(answer => {
          return typeof answer === 'object' && answer !== null && 'id' in answer ? answer.id : answer;
        });
      }
      // For single answers
      return typeof question.correctAnswer === 'object' && question.correctAnswer !== null && 'id' in question.correctAnswer
        ? question.correctAnswer.id 
        : question.correctAnswer;
    }
    return '';
  };
  
  // Handle multiple choice selection
  const handleMcOptionSelect = (option: any) => {
    if (showRationale) return; // Prevent changing after seeing rationale
    
    const optionId = getChoiceId(option);
    setSelectedOption(optionId);
    onAnswer(optionId);
  };
  
  // Handle SATA selection
  const handleSataOptionToggle = (option: any) => {
    if (showRationale) return; // Prevent changing after seeing rationale
    
    const optionId = getChoiceId(option);
    const newSelection = selectedOptions.includes(optionId)
      ? selectedOptions.filter(opt => opt !== optionId)
      : [...selectedOptions, optionId];
    
    setSelectedOptions(newSelection);
    onAnswer(newSelection);
  };
  
  // Handle ordered response changes
  const handleOrderedResponse = (items: string[]) => {
    if (showRationale) return; // Prevent changing after seeing rationale
    
    setOrderedItems(items);
    onAnswer(items);
  };
  
  // Handle hotspot selection
  const handleHotspotClick = (id: string) => {
    if (showRationale) return; // Prevent changing after seeing rationale
    
    // For single-selection hotspot
    if (!question.allowMultipleHotspots) {
      setSelectedHotspots([id]);
      onAnswer([id]);
      return;
    }
    
    // For multi-selection hotspot
    const newSelection = selectedHotspots.includes(id)
      ? selectedHotspots.filter(hotspotId => hotspotId !== id)
      : [...selectedHotspots, id];
    
    setSelectedHotspots(newSelection);
    onAnswer(newSelection);
  };
  
  // Render question based on type
  const renderQuestionContent = () => {
    switch (question.type) {
      case 'mc':
        return (
          <div className="space-y-3">
            {getChoices().map((choice, index) => (
              <div 
                key={index} 
                className={`
                  p-4 border rounded-md cursor-pointer transition-all
                  ${selectedOption === getChoiceId(choice) ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}
                  ${showRationale && getCorrectAnswer() === getChoiceId(choice) ? 'border-green-500 bg-green-50' : ''}
                  ${showRationale && selectedOption === getChoiceId(choice) && getCorrectAnswer() !== getChoiceId(choice) ? 'border-red-500 bg-red-50' : ''}
                `}
                onClick={() => handleMcOptionSelect(choice)}
              >
                <div className="flex items-center">
                  <div className={`
                    w-5 h-5 flex-shrink-0 rounded-full border mr-3
                    ${selectedOption === getChoiceId(choice) ? 'border-blue-500 bg-blue-500' : 'border-gray-300'}
                    ${showRationale && getCorrectAnswer() === getChoiceId(choice) ? 'border-green-500 bg-green-500' : ''}
                    ${showRationale && selectedOption === getChoiceId(choice) && getCorrectAnswer() !== getChoiceId(choice) ? 'border-red-500 bg-red-500' : ''}
                  `}>
                    {(selectedOption === getChoiceId(choice) || (showRationale && getCorrectAnswer() === getChoiceId(choice))) && (
                      <Check className="text-white h-4 w-4 m-auto" />
                    )}
                  </div>
                  <div className="text-gray-800">{getChoiceText(choice)}</div>
                </div>
              </div>
            ))}
            
            {showRationale && !isCorrect && (
              <Alert className="mt-4 bg-red-50 border-red-200">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertTitle className="text-red-700">Incorrect Answer</AlertTitle>
                <AlertDescription className="text-red-600">
                  The correct answer is: {getCorrectAnswer()}
                </AlertDescription>
              </Alert>
            )}
            
            {showRationale && isCorrect && (
              <Alert className="mt-4 bg-green-50 border-green-200">
                <Check className="h-4 w-4 text-green-600" />
                <AlertTitle className="text-green-700">Correct Answer!</AlertTitle>
              </Alert>
            )}
          </div>
        );
      
      case 'sata':
        return (
          <div className="space-y-3">
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-md mb-4 text-sm">
              <p className="font-medium text-blue-700">Select All That Apply</p>
              <p className="text-blue-600">Choose all correct options.</p>
            </div>
            
            {getChoices().map((choice, index) => (
              <div 
                key={index} 
                className={`
                  p-4 border rounded-md cursor-pointer transition-all
                  ${selectedOptions.includes(getChoiceId(choice)) ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}
                  ${showRationale && Array.isArray(getCorrectAnswer()) && getCorrectAnswer().includes(getChoiceId(choice)) ? 'border-green-500 bg-green-50' : ''}
                  ${showRationale && selectedOptions.includes(getChoiceId(choice)) && Array.isArray(getCorrectAnswer()) && !getCorrectAnswer().includes(getChoiceId(choice)) ? 'border-red-500 bg-red-50' : ''}
                `}
                onClick={() => handleSataOptionToggle(choice)}
              >
                <div className="flex items-center">
                  <div className={`
                    w-5 h-5 flex-shrink-0 rounded-sm border mr-3
                    ${selectedOptions.includes(getChoiceId(choice)) ? 'border-blue-500 bg-blue-500' : 'border-gray-300'}
                    ${showRationale && Array.isArray(getCorrectAnswer()) && getCorrectAnswer().includes(getChoiceId(choice)) ? 'border-green-500 bg-green-500' : ''}
                    ${showRationale && selectedOptions.includes(getChoiceId(choice)) && Array.isArray(getCorrectAnswer()) && !getCorrectAnswer().includes(getChoiceId(choice)) ? 'border-red-500 bg-red-500' : ''}
                  `}>
                    {(selectedOptions.includes(getChoiceId(choice)) || (showRationale && Array.isArray(getCorrectAnswer()) && getCorrectAnswer().includes(getChoiceId(choice)))) && (
                      <Check className="text-white h-4 w-4 m-auto" />
                    )}
                  </div>
                  <div className="text-gray-800">{getChoiceText(choice)}</div>
                </div>
              </div>
            ))}
            
            {!showRationale && (
              <div className="flex justify-end mt-4">
                <Button 
                  onClick={() => onAnswer(selectedOptions)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Submit Answer
                </Button>
              </div>
            )}
            
            {showRationale && (
              <Alert className={`mt-4 ${isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                {isCorrect ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-600" />
                )}
                <AlertTitle className={isCorrect ? 'text-green-700' : 'text-red-700'}>
                  {isCorrect ? 'Correct Answer!' : 'Incorrect Answer'}
                </AlertTitle>
                {!isCorrect && Array.isArray(getCorrectAnswer()) && (
                  <AlertDescription className="text-red-600">
                    <p>The correct options are:</p>
                    <ul className="list-disc ml-5 mt-1">
                      {(getCorrectAnswer() as string[]).map((answerId: string, index: number) => {
                        // Find the matching choice text for this ID
                        const matchingChoice = getChoices().find(c => getChoiceId(c) === answerId);
                        return (
                          <li key={index}>{matchingChoice ? getChoiceText(matchingChoice) : answerId}</li>
                        );
                      })}
                    </ul>
                  </AlertDescription>
                )}
              </Alert>
            )}
          </div>
        );
      
      case 'ordered-response':
        return (
          <OrderedResponseQuestion
            items={getItems()}
            correctOrder={showRationale ? (Array.isArray(getCorrectAnswer()) ? getCorrectAnswer() : []) : undefined}
            onChange={handleOrderedResponse}
            userAnswer={Array.isArray(userAnswer) ? userAnswer : []}
            showFeedback={showRationale}
            disabled={showRationale}
          />
        );
      
      case 'hotspot':
        return (
          <div className="space-y-4">
            <InteractiveDiagram
              imageSrc={getImage()}
              imageAlt="Interactive diagram"
              hotspots={getHotspots()}
              onHotspotClick={handleHotspotClick}
              showFeedback={showRationale}
              selectedHotspots={selectedHotspots}
            />
            
            {!showRationale && question.allowMultipleHotspots && (
              <div className="flex justify-end mt-4">
                <Button 
                  onClick={() => onAnswer(selectedHotspots)}
                  disabled={selectedHotspots.length === 0}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Submit Answer
                </Button>
              </div>
            )}
          </div>
        );
      
      default:
        return (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-yellow-700">This question type is not supported.</p>
          </div>
        );
    }
  };
  
  return (
    <div className="question-renderer">
      {renderQuestionContent()}
    </div>
  );
}
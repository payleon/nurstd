import React from 'react';
import { Question } from '@shared/schema';

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
  isCorrect = false
}: QuestionRendererProps) {
  // Handle different question types
  switch (question.type) {
    case 'mc':
      return <MultipleChoiceQuestion 
        question={question} 
        onAnswer={onAnswer} 
        userAnswer={userAnswer as string} 
        showRationale={showRationale}
        isCorrect={isCorrect}
      />;
    case 'sata':
      return <SelectAllThatApplyQuestion 
        question={question} 
        onAnswer={onAnswer} 
        userAnswer={userAnswer as string[]} 
        showRationale={showRationale}
        isCorrect={isCorrect}
      />;
    case 'ordered-response':
      return <OrderedResponseQuestion 
        question={question} 
        onAnswer={onAnswer} 
        userAnswer={userAnswer as string[]} 
        showRationale={showRationale}
        isCorrect={isCorrect}
      />;
    case 'hotspot':
      return <HotspotQuestion 
        question={question} 
        onAnswer={onAnswer} 
        userAnswer={userAnswer as string} 
        showRationale={showRationale}
        isCorrect={isCorrect}
      />;
    default:
      return <div className="p-4 border rounded bg-red-50 text-red-800">
        Unsupported question type: {question.type}
      </div>;
  }
}

// Multiple choice question component
function MultipleChoiceQuestion({
  question,
  onAnswer,
  userAnswer,
  showRationale,
  isCorrect
}: QuestionRendererProps & { userAnswer?: string }) {
  if (question.type !== 'mc') return null;

  const handleSelect = (value: string) => {
    if (!userAnswer) {
      onAnswer(value);
    }
  };

  const getOptionClass = (option: string) => {
    if (!showRationale) {
      return userAnswer === option ? 'bg-blue-100 border-blue-300' : 'hover:bg-gray-50';
    }
    
    if ('correctAnswer' in question && question.correctAnswer === option) {
      return 'bg-green-100 border-green-300';
    } else if (userAnswer === option) {
      return 'bg-red-100 border-red-300';
    }
    
    return '';
  };

  // In the schema choices is used instead of options
  const options = 'choices' in question 
    ? question.choices.map(choice => choice.text) 
    : [];

  return (
    <div className="space-y-3">
      {options.map((option: string, index: number) => (
        <div 
          key={index} 
          onClick={() => handleSelect(option)}
          className={`p-3 border rounded-md cursor-pointer transition ${getOptionClass(option)} ${userAnswer ? '' : 'hover:border-blue-300'}`}
        >
          <div className="flex items-start">
            <div className={`flex-shrink-0 w-5 h-5 border rounded-full mr-2 flex items-center justify-center ${
              userAnswer === option ? 'bg-blue-500 border-blue-500' : 'border-gray-400'
            }`}>
              {userAnswer === option && <div className="w-2 h-2 bg-white rounded-full"></div>}
            </div>
            <div className="text-sm">{option}</div>
          </div>
        </div>
      ))}
      
      {showRationale && (
        <div className={`mt-4 p-3 border rounded-md ${isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
          <div className={`font-semibold mb-1 ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
            {isCorrect ? 'Correct!' : 'Incorrect'}
          </div>
          <div className="text-sm text-gray-700">
            {question.rationale || 'No explanation provided.'}
          </div>
        </div>
      )}
    </div>
  );
}

// Select All That Apply question component
function SelectAllThatApplyQuestion({
  question,
  onAnswer,
  userAnswer = [],
  showRationale,
  isCorrect
}: QuestionRendererProps & { userAnswer?: string[] }) {
  if (question.type !== 'sata') return null;

  const handleSelect = (value: string) => {
    if (showRationale) return; // No changes after showing rationale
    
    let newSelectedOptions: string[];
    
    if (userAnswer.includes(value)) {
      newSelectedOptions = userAnswer.filter(option => option !== value);
    } else {
      newSelectedOptions = [...userAnswer, value];
    }
    
    onAnswer(newSelectedOptions);
  };

  const getOptionClass = (option: string) => {
    const isSelected = userAnswer.includes(option);
    
    if (!showRationale) {
      return isSelected ? 'bg-blue-100 border-blue-300' : 'hover:bg-gray-50';
    }
    
    if ('correctAnswer' in question && Array.isArray(question.correctAnswer) && question.correctAnswer.includes(option)) {
      return isSelected ? 'bg-green-100 border-green-300' : 'bg-green-50 border-green-200';
    } else if (isSelected) {
      return 'bg-red-100 border-red-300';
    }
    
    return '';
  };

  const handleSubmit = () => {
    if (userAnswer.length > 0 && !showRationale) {
      onAnswer(userAnswer);
    }
  };

  // In the schema choices is used instead of options
  const options = 'choices' in question 
    ? question.choices.map(choice => choice.text) 
    : [];

  return (
    <div>
      <div className="mb-3 bg-blue-50 p-2 rounded text-sm text-blue-800">
        Select all options that apply. There may be multiple correct answers.
      </div>
      
      <div className="space-y-3 mb-4">
        {options.map((option: string, index: number) => (
          <div 
            key={index} 
            onClick={() => handleSelect(option)}
            className={`p-3 border rounded-md cursor-pointer transition ${getOptionClass(option)} ${!showRationale ? 'hover:border-blue-300' : ''}`}
          >
            <div className="flex items-start">
              <div className={`flex-shrink-0 w-5 h-5 border rounded mr-2 flex items-center justify-center ${
                userAnswer.includes(option) ? 'bg-blue-500 border-blue-500' : 'border-gray-400'
              }`}>
                {userAnswer.includes(option) && (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                )}
              </div>
              <div className="text-sm">{option}</div>
            </div>
          </div>
        ))}
      </div>
      
      {!showRationale && (
        <button 
          onClick={handleSubmit} 
          disabled={userAnswer.length === 0}
          className={`w-full py-2 px-4 bg-blue-600 text-white rounded-md ${
            userAnswer.length === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
          }`}
        >
          Submit Answer
        </button>
      )}
      
      {showRationale && (
        <div className={`mt-4 p-3 border rounded-md ${isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
          <div className={`font-semibold mb-1 ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
            {isCorrect ? 'Correct!' : 'Incorrect'}
          </div>
          <div className="text-sm text-gray-700">
            {question.rationale || 'No explanation provided.'}
          </div>
        </div>
      )}
    </div>
  );
}

// Ordered Response question component
function OrderedResponseQuestion({
  question,
  onAnswer,
  userAnswer = [],
  showRationale,
  isCorrect
}: QuestionRendererProps & { userAnswer?: string[] }) {
  if (question.type !== 'ordered-response') return null;
  
  // In schema, items might be stored as choices
  const items = 'choices' in question 
    ? question.choices.map(choice => choice.text)
    : [];
  
  const [dragOrder, setDragOrder] = React.useState<string[]>(
    userAnswer.length > 0 ? userAnswer : [...items]
  );

  React.useEffect(() => {
    if (userAnswer.length > 0) {
      setDragOrder(userAnswer);
    }
  }, [userAnswer]);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    if (showRationale) return; // No changes after showing rationale
    
    const dragIndex = Number(e.dataTransfer.getData('text/plain'));
    const newOrder = [...dragOrder];
    const draggedItem = newOrder[dragIndex];
    
    // Remove the dragged item
    newOrder.splice(dragIndex, 1);
    // Insert it at the drop position
    newOrder.splice(dropIndex, 0, draggedItem);
    
    setDragOrder(newOrder);
    onAnswer(newOrder);
  };

  const handleSubmit = () => {
    if (!showRationale) {
      onAnswer(dragOrder);
    }
  };

  return (
    <div>
      <div className="mb-3 bg-blue-50 p-2 rounded text-sm text-blue-800">
        Drag and drop the items below to arrange them in the correct order.
      </div>
      
      <div className="space-y-2 mb-4">
        {dragOrder.map((item, index) => (
          <div 
            key={index}
            draggable={!showRationale}
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, index)}
            className={`p-3 border rounded-md ${showRationale ? '' : 'cursor-move'} bg-white shadow-sm hover:shadow transition`}
          >
            <div className="flex items-center">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center mr-2">
                {index + 1}
              </div>
              <div>{item}</div>
              {!showRationale && (
                <div className="ml-auto text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <polyline points="19 12 12 19 5 12"></polyline>
                  </svg>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {!showRationale && (
        <button 
          onClick={handleSubmit}
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Submit Order
        </button>
      )}
      
      {showRationale && (
        <div className={`mt-4 p-3 border rounded-md ${isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
          <div className={`font-semibold mb-1 ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
            {isCorrect ? 'Correct order!' : 'Incorrect order'}
          </div>
          {!isCorrect && 'correctOrder' in question && (
            <div className="mb-2">
              <div className="font-medium text-sm text-gray-700">Correct order:</div>
              <ol className="pl-5 text-sm text-gray-700 list-decimal">
                {question.correctOrder.map((item: string, index: number) => (
                  <li key={index}>{item}</li>
                ))}
              </ol>
            </div>
          )}
          <div className="text-sm text-gray-700 mt-2">
            {question.rationale || 'No explanation provided.'}
          </div>
        </div>
      )}
    </div>
  );
}

// Hotspot question component (simplified)
function HotspotQuestion({
  question,
  onAnswer,
  userAnswer,
  showRationale,
  isCorrect
}: QuestionRendererProps & { userAnswer?: string }) {
  if (question.type !== 'hotspot') return null;
  
  const [selectedArea, setSelectedArea] = React.useState<string | null>(userAnswer || null);
  
  const handleAreaClick = (area: string) => {
    if (!showRationale) {
      setSelectedArea(area);
      onAnswer(area);
    }
  };
  
  // Areas can be constructed from correctAreas and distractorAreas
  const areas = 'correctAreas' in question 
    ? question.correctAreas.map(area => area.id)
    : [];
  
  return (
    <div>
      <div className="mb-3 bg-blue-50 p-2 rounded text-sm text-blue-800">
        Click on the appropriate area of the image to answer the question.
      </div>
      
      <div className="relative inline-block mb-4">
        {/* Image would go here in a real implementation */}
        <div className="bg-gray-200 w-full h-64 flex items-center justify-center text-gray-500">
          {question.imagePath ? (
            <img 
              src={question.imagePath} 
              alt="Hotspot question image" 
              className="max-w-full max-h-full"
            />
          ) : (
            "Image placeholder"
          )}
        </div>
        
        {/* Clickable areas */}
        <div className="absolute inset-0 flex flex-wrap">
          {areas.map((area: string, index: number) => (
            <div 
              key={index}
              className={`w-1/3 h-1/3 border ${
                selectedArea === area ? 'border-blue-500 bg-blue-100 bg-opacity-50' : 'border-transparent'
              } cursor-pointer hover:bg-blue-50 hover:bg-opacity-30`}
              onClick={() => handleAreaClick(area)}
            />
          ))}
        </div>
      </div>
      
      {showRationale && (
        <div className={`mt-4 p-3 border rounded-md ${isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
          <div className={`font-semibold mb-1 ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
            {isCorrect ? 'Correct area selected!' : 'Incorrect area selected'}
          </div>
          <div className="text-sm text-gray-700">
            {question.rationale || 'No explanation provided.'}
          </div>
        </div>
      )}
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import { DragDropContext, Draggable, Droppable, DropResult } from 'react-beautiful-dnd';
import { ChevronUp, ChevronDown, GripVertical, Check, X } from 'lucide-react';

export interface OrderedResponseItem {
  id: string;
  text: string;
}

export interface OrderedResponseProps {
  items: OrderedResponseItem[] | string[];
  correctOrder?: OrderedResponseItem[] | string[];
  onChange: (orderedItems: string[]) => void;
  userAnswer?: string[];
  showFeedback?: boolean;
  disabled?: boolean;
}

export function OrderedResponseQuestion({
  items,
  correctOrder,
  onChange,
  userAnswer,
  showFeedback = false,
  disabled = false
}: OrderedResponseProps) {
  const [orderedItems, setOrderedItems] = useState<string[]>([]);
  
  // Convert complex items to string IDs if needed
  const getItemId = (item: string | OrderedResponseItem): string => {
    return typeof item === 'string' ? item : item.id;
  };

  // Get the display text for an item
  const getItemText = (item: string | OrderedResponseItem): string => {
    return typeof item === 'string' ? item : item.text;
  };
  
  // Process items to get their IDs
  const getItemIds = (itemArray: (string | OrderedResponseItem)[]): string[] => {
    return itemArray.map(getItemId);
  };
  
  // Initialize with either user's previous answer or shuffled items
  useEffect(() => {
    if (userAnswer && userAnswer.length > 0) {
      setOrderedItems(userAnswer);
    } else if (orderedItems.length === 0) {
      // Initialize with shuffled items
      setOrderedItems([...getItemIds(items)].sort(() => Math.random() - 0.5));
    }
  }, [items, userAnswer]);
  
  // Handle drag end event
  const handleDragEnd = (result: DropResult) => {
    const { destination, source } = result;
    
    // If dropped outside a droppable area or same position
    if (!destination || 
        (destination.droppableId === source.droppableId && 
         destination.index === source.index)) {
      return;
    }
    
    // Reorder items
    const newItems = Array.from(orderedItems);
    const [removed] = newItems.splice(source.index, 1);
    newItems.splice(destination.index, 0, removed);
    
    setOrderedItems(newItems);
    onChange(newItems);
  };
  
  // Move item up
  const moveItemUp = (index: number) => {
    if (index === 0 || disabled) return;
    
    const newItems = [...orderedItems];
    [newItems[index - 1], newItems[index]] = [newItems[index], newItems[index - 1]];
    
    setOrderedItems(newItems);
    onChange(newItems);
  };
  
  // Move item down
  const moveItemDown = (index: number) => {
    if (index === orderedItems.length - 1 || disabled) return;
    
    const newItems = [...orderedItems];
    [newItems[index], newItems[index + 1]] = [newItems[index + 1], newItems[index]];
    
    setOrderedItems(newItems);
    onChange(newItems);
  };
  
  // Check if item is in correct position
  const isItemCorrect = (item: string, index: number): boolean => {
    if (!correctOrder) return false;
    
    const correctItem = correctOrder[index];
    const correctItemId = correctItem ? getItemId(correctItem) : '';
    
    return correctItemId === item;
  };
  
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="p-4 bg-gray-50 border-b border-gray-200">
        <h3 className="font-medium text-gray-800">
          Arrange items in the correct order
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          Drag and drop items or use the arrows to arrange them in order.
        </p>
      </div>
      
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="ordered-items" isDropDisabled={disabled}>
          {(provided) => (
            <ul
              className="p-2"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {orderedItems.map((item, index) => (
                <Draggable 
                  key={item} 
                  draggableId={item} 
                  index={index}
                  isDragDisabled={disabled}
                >
                  {(provided, snapshot) => (
                    <li
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={`flex items-center p-3 mb-2 rounded-md border ${
                        snapshot.isDragging ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'
                      } ${
                        showFeedback && isItemCorrect(item, index) 
                          ? 'border-green-300 bg-green-50' 
                          : showFeedback && !isItemCorrect(item, index)
                            ? 'border-red-300 bg-red-50'
                            : ''
                      }`}
                    >
                      <div {...provided.dragHandleProps} className="mr-3 text-gray-400 cursor-grab">
                        <GripVertical className="h-5 w-5" />
                      </div>
                      
                      <div className="flex-grow">
                        {/* Find the original item text for display */}
                        {items.find(i => getItemId(i) === item) ? 
                          getItemText(items.find(i => getItemId(i) === item) as string | OrderedResponseItem) : 
                          item}
                      </div>
                      
                      {showFeedback && (
                        <div className="ml-2 flex-shrink-0">
                          {isItemCorrect(item, index) ? (
                            <Check className="h-5 w-5 text-green-500" />
                          ) : (
                            <X className="h-5 w-5 text-red-500" />
                          )}
                        </div>
                      )}
                      
                      {!disabled && !showFeedback && (
                        <div className="flex ml-2">
                          <button
                            type="button"
                            onClick={() => moveItemUp(index)}
                            disabled={index === 0}
                            className={`p-1 rounded-full ${
                              index === 0 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-100'
                            }`}
                            aria-label="Move up"
                          >
                            <ChevronUp className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => moveItemDown(index)}
                            disabled={index === orderedItems.length - 1}
                            className={`p-1 rounded-full ${
                              index === orderedItems.length - 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-100'
                            }`}
                            aria-label="Move down"
                          >
                            <ChevronDown className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </li>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
      
      {!showFeedback && !disabled && (
        <div className="p-4 border-t border-gray-200 flex justify-end">
          <button
            onClick={() => onChange(orderedItems)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Submit Answer
          </button>
        </div>
      )}
      
      {showFeedback && correctOrder && (
        <div className="p-4 border-t border-gray-200 bg-blue-50">
          <h4 className="font-medium text-blue-800 mb-2">Correct Order:</h4>
          <ol className="list-decimal pl-5 text-blue-700">
            {correctOrder.map((item, index) => (
              <li key={index} className="mb-1">
                {getItemText(item as string | OrderedResponseItem)}
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}
import React, { useState } from 'react';

export interface ExamCalculatorProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ExamCalculator({ isOpen, onClose }: ExamCalculatorProps) {
  const [display, setDisplay] = useState('0');
  const [operation, setOperation] = useState<string | null>(null);
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [resetOnNextInput, setResetOnNextInput] = useState(false);
  
  // Handle number button clicks
  const handleNumberClick = (num: string) => {
    if (display === '0' || resetOnNextInput) {
      setDisplay(num);
      setResetOnNextInput(false);
    } else {
      setDisplay(display + num);
    }
  };
  
  // Handle decimal button click
  const handleDecimalClick = () => {
    if (resetOnNextInput) {
      setDisplay('0.');
      setResetOnNextInput(false);
      return;
    }
    
    if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };
  
  // Handle operation button clicks
  const handleOperationClick = (op: string) => {
    const current = parseFloat(display);
    
    if (previousValue === null) {
      setPreviousValue(current);
    } else if (operation) {
      const result = calculateResult();
      setPreviousValue(result);
      setDisplay(String(result));
    }
    
    setOperation(op);
    setResetOnNextInput(true);
  };
  
  // Calculate result based on operation
  const calculateResult = (): number => {
    const current = parseFloat(display);
    if (previousValue === null) return current;
    
    switch (operation) {
      case '+':
        return previousValue + current;
      case '-':
        return previousValue - current;
      case '×':
        return previousValue * current;
      case '÷':
        return previousValue / current;
      default:
        return current;
    }
  };
  
  // Handle equals button click
  const handleEqualsClick = () => {
    if (!operation || previousValue === null) return;
    
    const result = calculateResult();
    setDisplay(String(result));
    setPreviousValue(null);
    setOperation(null);
    setResetOnNextInput(true);
  };
  
  // Handle clear button click
  const handleClearClick = () => {
    setDisplay('0');
    setOperation(null);
    setPreviousValue(null);
    setResetOnNextInput(false);
  };
  
  // Handle backspace button click
  const handleBackspaceClick = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay('0');
    }
  };
  
  // Handle percentage button click
  const handlePercentageClick = () => {
    const current = parseFloat(display);
    const result = current / 100;
    setDisplay(String(result));
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg max-w-sm w-full p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Calculator</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-xl">
            &times;
          </button>
        </div>
        
        {/* Calculator display */}
        <div className="bg-gray-100 p-4 mb-4 rounded-md text-right">
          <div className="text-gray-500 text-sm mb-1">
            {previousValue !== null ? `${previousValue} ${operation}` : ''}
          </div>
          <div className="text-2xl font-medium text-gray-900 overflow-x-auto" style={{maxWidth: '100%'}}>
            {display}
          </div>
        </div>
        
        {/* Calculator buttons */}
        <div className="grid grid-cols-4 gap-2">
          {/* Row 1 */}
          <button 
            onClick={handleClearClick}
            className="py-3 rounded-md bg-red-100 text-red-700 font-medium hover:bg-red-200"
          >
            AC
          </button>
          <button 
            onClick={handleBackspaceClick}
            className="py-3 rounded-md bg-gray-200 text-gray-700 font-medium hover:bg-gray-300"
          >
            ⌫
          </button>
          <button 
            onClick={handlePercentageClick}
            className="py-3 rounded-md bg-gray-200 text-gray-700 font-medium hover:bg-gray-300"
          >
            %
          </button>
          <button 
            onClick={() => handleOperationClick('÷')}
            className="py-3 rounded-md bg-blue-100 text-blue-700 font-medium hover:bg-blue-200"
          >
            ÷
          </button>
          
          {/* Row 2 */}
          <button 
            onClick={() => handleNumberClick('7')}
            className="py-3 rounded-md bg-gray-100 text-gray-700 font-medium hover:bg-gray-200"
          >
            7
          </button>
          <button 
            onClick={() => handleNumberClick('8')}
            className="py-3 rounded-md bg-gray-100 text-gray-700 font-medium hover:bg-gray-200"
          >
            8
          </button>
          <button 
            onClick={() => handleNumberClick('9')}
            className="py-3 rounded-md bg-gray-100 text-gray-700 font-medium hover:bg-gray-200"
          >
            9
          </button>
          <button 
            onClick={() => handleOperationClick('×')}
            className="py-3 rounded-md bg-blue-100 text-blue-700 font-medium hover:bg-blue-200"
          >
            ×
          </button>
          
          {/* Row 3 */}
          <button 
            onClick={() => handleNumberClick('4')}
            className="py-3 rounded-md bg-gray-100 text-gray-700 font-medium hover:bg-gray-200"
          >
            4
          </button>
          <button 
            onClick={() => handleNumberClick('5')}
            className="py-3 rounded-md bg-gray-100 text-gray-700 font-medium hover:bg-gray-200"
          >
            5
          </button>
          <button 
            onClick={() => handleNumberClick('6')}
            className="py-3 rounded-md bg-gray-100 text-gray-700 font-medium hover:bg-gray-200"
          >
            6
          </button>
          <button 
            onClick={() => handleOperationClick('-')}
            className="py-3 rounded-md bg-blue-100 text-blue-700 font-medium hover:bg-blue-200"
          >
            -
          </button>
          
          {/* Row 4 */}
          <button 
            onClick={() => handleNumberClick('1')}
            className="py-3 rounded-md bg-gray-100 text-gray-700 font-medium hover:bg-gray-200"
          >
            1
          </button>
          <button 
            onClick={() => handleNumberClick('2')}
            className="py-3 rounded-md bg-gray-100 text-gray-700 font-medium hover:bg-gray-200"
          >
            2
          </button>
          <button 
            onClick={() => handleNumberClick('3')}
            className="py-3 rounded-md bg-gray-100 text-gray-700 font-medium hover:bg-gray-200"
          >
            3
          </button>
          <button 
            onClick={() => handleOperationClick('+')}
            className="py-3 rounded-md bg-blue-100 text-blue-700 font-medium hover:bg-blue-200"
          >
            +
          </button>
          
          {/* Row 5 */}
          <button 
            onClick={() => handleNumberClick('0')}
            className="py-3 rounded-md bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 col-span-2"
          >
            0
          </button>
          <button 
            onClick={handleDecimalClick}
            className="py-3 rounded-md bg-gray-100 text-gray-700 font-medium hover:bg-gray-200"
          >
            .
          </button>
          <button 
            onClick={handleEqualsClick}
            className="py-3 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700"
          >
            =
          </button>
        </div>
        
        {/* Medical conversions */}
        <div className="mt-4 pt-3 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Medical Conversions</h3>
          <div className="grid grid-cols-2 gap-2">
            <button className="py-1 px-2 text-xs rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200">
              kg ↔ lbs
            </button>
            <button className="py-1 px-2 text-xs rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200">
              cm ↔ inches
            </button>
            <button className="py-1 px-2 text-xs rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200">
              °C ↔ °F
            </button>
            <button className="py-1 px-2 text-xs rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200">
              mL ↔ oz
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
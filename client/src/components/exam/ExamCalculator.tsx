import React, { useState } from 'react';
import { X } from 'lucide-react';

interface ExamCalculatorProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ExamCalculator({ isOpen, onClose }: ExamCalculatorProps) {
  const [display, setDisplay] = useState('0');
  const [operation, setOperation] = useState<string | null>(null);
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [shouldReset, setShouldReset] = useState(false);

  if (!isOpen) return null;

  const handleNumber = (num: string) => {
    if (display === '0' || shouldReset) {
      setDisplay(num);
      setShouldReset(false);
    } else {
      setDisplay(display + num);
    }
  };

  const handleDecimal = () => {
    if (shouldReset) {
      setDisplay('0.');
      setShouldReset(false);
      return;
    }
    
    if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const handleOperation = (op: string) => {
    const current = parseFloat(display);
    
    if (previousValue === null) {
      setPreviousValue(current);
    } else if (operation) {
      const result = calculate(previousValue, current, operation);
      setPreviousValue(result);
      setDisplay(String(result));
    }
    
    setOperation(op);
    setShouldReset(true);
  };

  const calculate = (a: number, b: number, operation: string): number => {
    switch (operation) {
      case '+':
        return a + b;
      case '-':
        return a - b;
      case '×':
        return a * b;
      case '÷':
        return a / b;
      default:
        return b;
    }
  };

  const handleEquals = () => {
    if (previousValue === null || operation === null) return;
    
    const current = parseFloat(display);
    const result = calculate(previousValue, current, operation);
    
    setDisplay(String(result));
    setPreviousValue(null);
    setOperation(null);
    setShouldReset(true);
  };

  const handleClear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setShouldReset(false);
  };

  const handleBackspace = () => {
    if (display.length === 1 || (display.length === 2 && display.includes('-'))) {
      setDisplay('0');
    } else {
      setDisplay(display.slice(0, -1));
    }
  };

  const buttonClass = "h-12 w-12 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium";
  const operationButtonClass = "h-12 w-12 flex items-center justify-center rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-800 font-medium";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Medical Calculator</h2>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="bg-gray-50 p-3 rounded-lg mb-4 text-right">
          <div className="text-2xl font-mono">{display}</div>
        </div>
        
        <div className="grid grid-cols-4 gap-2">
          <button className={buttonClass} onClick={handleClear}>C</button>
          <button className={buttonClass} onClick={handleBackspace}>⌫</button>
          <button className={operationButtonClass} onClick={() => handleOperation('÷')}>÷</button>
          <button className={operationButtonClass} onClick={() => handleOperation('×')}>×</button>
          
          <button className={buttonClass} onClick={() => handleNumber('7')}>7</button>
          <button className={buttonClass} onClick={() => handleNumber('8')}>8</button>
          <button className={buttonClass} onClick={() => handleNumber('9')}>9</button>
          <button className={operationButtonClass} onClick={() => handleOperation('-')}>-</button>
          
          <button className={buttonClass} onClick={() => handleNumber('4')}>4</button>
          <button className={buttonClass} onClick={() => handleNumber('5')}>5</button>
          <button className={buttonClass} onClick={() => handleNumber('6')}>6</button>
          <button className={operationButtonClass} onClick={() => handleOperation('+')}>+</button>
          
          <button className={buttonClass} onClick={() => handleNumber('1')}>1</button>
          <button className={buttonClass} onClick={() => handleNumber('2')}>2</button>
          <button className={buttonClass} onClick={() => handleNumber('3')}>3</button>
          <button 
            className="h-24 w-12 flex items-center justify-center rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium row-span-2"
            onClick={handleEquals}
            >=</button>
          
          <button className={`${buttonClass} col-span-2`} onClick={() => handleNumber('0')}>0</button>
          <button className={buttonClass} onClick={handleDecimal}>.</button>
        </div>
      </div>
    </div>
  );
}
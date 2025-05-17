import React, { useState } from 'react';

interface ExamCalculatorProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ExamCalculator({ isOpen, onClose }: ExamCalculatorProps) {
  const [display, setDisplay] = useState('0');
  const [memory, setMemory] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  if (!isOpen) return null;

  const clearAll = () => {
    setDisplay('0');
    setMemory(null);
    setOperation(null);
    setWaitingForOperand(false);
  };

  const clearDisplay = () => {
    setDisplay('0');
  };

  const inputDigit = (digit: string) => {
    if (waitingForOperand) {
      setDisplay(digit);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
    }
  };

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.');
    }
  };

  const toggleSign = () => {
    const newValue = parseFloat(display) * -1;
    setDisplay(newValue.toString());
  };

  const inputPercent = () => {
    const currentValue = parseFloat(display);
    const newValue = currentValue / 100;
    setDisplay(newValue.toString());
  };

  const performOperation = (nextOperation: string) => {
    const inputValue = parseFloat(display);

    if (memory === null) {
      setMemory(inputValue);
    } else if (operation) {
      const currentValue = memory || 0;
      let newValue: number;

      switch (operation) {
        case '+':
          newValue = currentValue + inputValue;
          break;
        case '-':
          newValue = currentValue - inputValue;
          break;
        case '×':
          newValue = currentValue * inputValue;
          break;
        case '÷':
          newValue = currentValue / inputValue;
          break;
        default:
          newValue = inputValue;
      }

      setMemory(newValue);
      setDisplay(newValue.toString());
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
  };

  const performEquals = () => {
    performOperation('=');
    setOperation(null);
  };

  // Calculator button component
  const CalcButton = ({ 
    onClick, 
    className = '', 
    children 
  }: { 
    onClick: () => void; 
    className?: string; 
    children: React.ReactNode;
  }) => (
    <button
      onClick={onClick}
      className={`flex-1 h-12 text-sm font-medium border border-gray-200 rounded-md flex items-center justify-center ${className}`}
    >
      {children}
    </button>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-80 overflow-hidden">
        <div className="p-3 bg-blue-600 text-white flex justify-between items-center">
          <h3 className="font-medium">Medical Calculator</h3>
          <button 
            onClick={onClose}
            className="text-white hover:text-blue-100"
          >
            ✕
          </button>
        </div>
        
        <div className="p-4">
          {/* Display */}
          <div className="bg-gray-100 rounded-md p-3 mb-4 text-right text-xl font-medium h-14 flex items-center justify-end">
            {display}
          </div>
          
          {/* Keypad */}
          <div className="grid grid-cols-4 gap-2">
            <CalcButton onClick={clearAll} className="text-red-600">AC</CalcButton>
            <CalcButton onClick={clearDisplay} className="text-blue-600">C</CalcButton>
            <CalcButton onClick={inputPercent} className="text-blue-600">%</CalcButton>
            <CalcButton onClick={() => performOperation('÷')} className="text-blue-600">÷</CalcButton>
            
            <CalcButton onClick={() => inputDigit('7')}>7</CalcButton>
            <CalcButton onClick={() => inputDigit('8')}>8</CalcButton>
            <CalcButton onClick={() => inputDigit('9')}>9</CalcButton>
            <CalcButton onClick={() => performOperation('×')} className="text-blue-600">×</CalcButton>
            
            <CalcButton onClick={() => inputDigit('4')}>4</CalcButton>
            <CalcButton onClick={() => inputDigit('5')}>5</CalcButton>
            <CalcButton onClick={() => inputDigit('6')}>6</CalcButton>
            <CalcButton onClick={() => performOperation('-')} className="text-blue-600">−</CalcButton>
            
            <CalcButton onClick={() => inputDigit('1')}>1</CalcButton>
            <CalcButton onClick={() => inputDigit('2')}>2</CalcButton>
            <CalcButton onClick={() => inputDigit('3')}>3</CalcButton>
            <CalcButton onClick={() => performOperation('+')} className="text-blue-600">+</CalcButton>
            
            <CalcButton onClick={toggleSign}>+/−</CalcButton>
            <CalcButton onClick={() => inputDigit('0')}>0</CalcButton>
            <CalcButton onClick={inputDecimal}>.</CalcButton>
            <CalcButton onClick={performEquals} className="bg-blue-600 text-white">=</CalcButton>
          </div>
          
          {/* Medical specific functions */}
          <div className="mt-4 grid grid-cols-2 gap-2">
            <CalcButton onClick={() => {}} className="bg-blue-50 text-blue-800">
              BMI
            </CalcButton>
            <CalcButton onClick={() => {}} className="bg-blue-50 text-blue-800">
              Dosage
            </CalcButton>
          </div>
        </div>
      </div>
    </div>
  );
}
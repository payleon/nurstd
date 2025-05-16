import React, { useState } from 'react';
import { X } from 'lucide-react';

interface ExamCalculatorProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ExamCalculator({ isOpen, onClose }: ExamCalculatorProps) {
  const [display, setDisplay] = useState('');
  
  if (!isOpen) return null;
  
  const handleButtonClick = (value: string) => {
    switch (value) {
      case 'C':
        setDisplay('');
        break;
      case '=':
        try {
          // eslint-disable-next-line no-eval
          const result = eval(display);
          setDisplay(result.toString());
        } catch (error) {
          setDisplay('Error');
        }
        break;
      case '+/-':
        setDisplay(display.startsWith('-') ? display.slice(1) : `-${display}`);
        break;
      case '%':
        try {
          const result = parseFloat(display) / 100;
          setDisplay(result.toString());
        } catch (error) {
          setDisplay('Error');
        }
        break;
      default:
        setDisplay(display + value);
        break;
    }
  };

  return (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
      <div className="bg-blue-800 rounded-md w-72 p-3 shadow-lg">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-white text-base font-medium">Calculator</h3>
          <button onClick={onClose} className="text-white hover:text-gray-200">
            <X className="h-4 w-4" />
          </button>
        </div>
        
        <div className="bg-white rounded mb-3 p-2">
          <input
            type="text"
            value={display}
            readOnly
            className="w-full text-right text-lg font-medium"
          />
        </div>
        
        <div className="grid grid-cols-4 gap-2">
          {/* Row 1 */}
          <button onClick={() => handleButtonClick('C')} className="bg-red-600 text-white rounded p-2">C</button>
          <button onClick={() => handleButtonClick('+/-')} className="bg-red-600 text-white rounded p-2">+/-</button>
          <button onClick={() => handleButtonClick('%')} className="bg-red-600 text-white rounded p-2">%</button>
          <button onClick={() => handleButtonClick('/')} className="bg-red-600 text-white rounded p-2">/</button>
          
          {/* Row 2 */}
          <button onClick={() => handleButtonClick('7')} className="bg-white text-black rounded p-2">7</button>
          <button onClick={() => handleButtonClick('8')} className="bg-white text-black rounded p-2">8</button>
          <button onClick={() => handleButtonClick('9')} className="bg-white text-black rounded p-2">9</button>
          <button onClick={() => handleButtonClick('*')} className="bg-red-600 text-white rounded p-2">x</button>
          
          {/* Row 3 */}
          <button onClick={() => handleButtonClick('4')} className="bg-white text-black rounded p-2">4</button>
          <button onClick={() => handleButtonClick('5')} className="bg-white text-black rounded p-2">5</button>
          <button onClick={() => handleButtonClick('6')} className="bg-white text-black rounded p-2">6</button>
          <button onClick={() => handleButtonClick('-')} className="bg-red-600 text-white rounded p-2">-</button>
          
          {/* Row 4 */}
          <button onClick={() => handleButtonClick('1')} className="bg-white text-black rounded p-2">1</button>
          <button onClick={() => handleButtonClick('2')} className="bg-white text-black rounded p-2">2</button>
          <button onClick={() => handleButtonClick('3')} className="bg-white text-black rounded p-2">3</button>
          <button onClick={() => handleButtonClick('+')} className="bg-red-600 text-white rounded p-2">+</button>
          
          {/* Row 5 */}
          <button onClick={() => handleButtonClick('0')} className="bg-white text-black rounded p-2 col-span-2">0</button>
          <button onClick={() => handleButtonClick('.')} className="bg-white text-black rounded p-2">.</button>
          <button onClick={() => handleButtonClick('=')} className="bg-red-600 text-white rounded p-2">=</button>
        </div>
      </div>
    </div>
  );
}
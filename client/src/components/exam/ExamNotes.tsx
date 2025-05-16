import React, { useState } from 'react';
import { X, Bold, Italic, Underline, Link, Image, Code, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';

interface ExamNotesProps {
  isOpen: boolean;
  onClose: () => void;
  questionId?: number;
}

export function ExamNotes({ isOpen, onClose, questionId }: ExamNotesProps) {
  const [notes, setNotes] = useState('');
  
  if (!isOpen) return null;
  
  const saveNotes = () => {
    // Here we would implement the actual note saving functionality
    // For example, save to local storage or an API
    onClose();
  };

  return (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
      <div className="bg-white border border-gray-300 rounded w-[500px] shadow-lg flex flex-col">
        <div className="bg-blue-700 text-white p-3 flex justify-between items-center">
          <h3 className="font-medium">Notes</h3>
          <button onClick={onClose} className="text-white hover:text-gray-200">
            <X className="h-4 w-4" />
          </button>
        </div>
        
        {/* Toolbar */}
        <div className="p-2 bg-gray-50 border-b flex items-center space-x-2">
          <select className="p-1 border rounded">
            <option>Heading</option>
          </select>
          <select className="p-1 border rounded">
            <option>Sans Serif</option>
          </select>
          <button className="p-1 rounded hover:bg-gray-200"><Bold className="h-4 w-4" /></button>
          <button className="p-1 rounded hover:bg-gray-200"><Italic className="h-4 w-4" /></button>
          <button className="p-1 rounded hover:bg-gray-200"><Underline className="h-4 w-4" /></button>
          <span className="border-r border-gray-300 h-6 mx-1"></span>
          <button className="p-1 rounded hover:bg-gray-200"><AlignLeft className="h-4 w-4" /></button>
          <button className="p-1 rounded hover:bg-gray-200"><AlignCenter className="h-4 w-4" /></button>
          <button className="p-1 rounded hover:bg-gray-200"><AlignRight className="h-4 w-4" /></button>
          <span className="border-r border-gray-300 h-6 mx-1"></span>
          <button className="p-1 rounded hover:bg-gray-200"><Link className="h-4 w-4" /></button>
          <button className="p-1 rounded hover:bg-gray-200"><Image className="h-4 w-4" /></button>
          <button className="p-1 rounded hover:bg-gray-200"><Code className="h-4 w-4" /></button>
        </div>
        
        {/* Text area */}
        <textarea
          className="w-full p-3 flex-grow min-h-[200px] focus:outline-none"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Enter your notes here..."
        ></textarea>
        
        {/* Buttons */}
        <div className="p-3 bg-gray-100 flex justify-between">
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
          >
            Close
          </button>
          <button 
            onClick={saveNotes}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
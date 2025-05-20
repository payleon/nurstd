import React, { useState, useEffect } from 'react';
import { Save } from 'lucide-react';

export interface ExamNotesProps {
  isOpen: boolean;
  onClose: () => void;
  questionId?: number;
  initialNotes?: string;
  onSave?: (notes: string) => void;
}

export function ExamNotes({
  isOpen,
  onClose,
  questionId,
  initialNotes = '',
  onSave
}: ExamNotesProps) {
  const [notes, setNotes] = useState(initialNotes);
  
  // Update notes when question changes
  useEffect(() => {
    setNotes(initialNotes);
  }, [questionId, initialNotes]);
  
  const handleSave = () => {
    if (onSave) {
      onSave(notes);
    }
    onClose();
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">
            {questionId ? `Notes for Question ${questionId}` : 'Exam Notes'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-xl">
            &times;
          </button>
        </div>
        
        <div className="mb-4">
          <textarea
            className="w-full h-60 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Type your notes here..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
        
        <div className="bg-yellow-50 p-3 rounded-md mb-4 text-sm text-yellow-800">
          <p>
            <strong>Tip:</strong> Use these notes to jot down important concepts, mnemonics, or key points to remember for this question.
          </p>
        </div>
        
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Notes
          </button>
        </div>
      </div>
    </div>
  );
}
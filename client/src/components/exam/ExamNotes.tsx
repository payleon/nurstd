import React, { useState, useEffect } from 'react';

interface ExamNotesProps {
  isOpen: boolean;
  onClose: () => void;
  examId: number;
}

export function ExamNotes({ isOpen, onClose, examId }: ExamNotesProps) {
  const [notes, setNotes] = useState('');
  
  // Load saved notes on component mount
  useEffect(() => {
    const savedNotes = localStorage.getItem(`exam_notes_${examId}`);
    if (savedNotes) {
      setNotes(savedNotes);
    }
  }, [examId]);
  
  // Save notes to localStorage
  const saveNotes = () => {
    localStorage.setItem(`exam_notes_${examId}`, notes);
  };
  
  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNotes(e.target.value);
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-4/5 max-w-2xl overflow-hidden">
        <div className="p-3 bg-blue-600 text-white flex justify-between items-center">
          <h3 className="font-medium">Exam Notes</h3>
          <button 
            onClick={onClose}
            className="text-white hover:text-blue-100"
          >
            ✕
          </button>
        </div>
        
        <div className="p-4">
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">
              Use these notes to jot down key concepts or calculations during your exam. 
              Notes are saved automatically.
            </p>
            <div className="bg-blue-50 p-2 rounded text-xs text-blue-800 mb-3">
              Note: These notes will be available throughout your exam session, but they won't be 
              accessible once you submit your exam.
            </div>
            <textarea 
              className="w-full h-64 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Type your notes here..."
              value={notes}
              onChange={handleNotesChange}
              onBlur={saveNotes}
            />
          </div>
          
          <div className="flex justify-end space-x-2">
            <button 
              onClick={() => setNotes('')}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Clear All
            </button>
            <button 
              onClick={() => {
                saveNotes();
                onClose();
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Save & Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
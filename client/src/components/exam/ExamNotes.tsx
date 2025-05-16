import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';

interface ExamNotesProps {
  isOpen: boolean;
  onClose: () => void;
  questionId?: number;
}

export function ExamNotes({ isOpen, onClose, questionId }: ExamNotesProps) {
  const [notes, setNotes] = useState<Record<number, string>>({});
  const [currentNote, setCurrentNote] = useState('');
  
  // Load saved notes when the component mounts
  useEffect(() => {
    const savedNotes = localStorage.getItem('examNotes');
    if (savedNotes) {
      try {
        setNotes(JSON.parse(savedNotes));
      } catch (e) {
        console.error('Error loading saved notes', e);
      }
    }
  }, []);
  
  // Update the current note when the question changes
  useEffect(() => {
    if (questionId) {
      setCurrentNote(notes[questionId] || '');
    }
  }, [questionId, notes]);
  
  if (!isOpen || !questionId) return null;
  
  const handleSaveNotes = () => {
    const updatedNotes = {
      ...notes,
      [questionId]: currentNote
    };
    
    setNotes(updatedNotes);
    localStorage.setItem('examNotes', JSON.stringify(updatedNotes));
  };
  
  const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCurrentNote(e.target.value);
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Notes for Question {questionId}</h2>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="mb-4">
          <textarea
            value={currentNote}
            onChange={handleNoteChange}
            placeholder="Type your notes here..."
            className="w-full h-64 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>
        
        <div className="flex justify-end">
          <button
            onClick={handleSaveNotes}
            className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Notes
          </button>
        </div>
      </div>
    </div>
  );
}
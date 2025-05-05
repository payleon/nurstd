import React from 'react';
import { X } from 'lucide-react';
import { LearningPathNode } from '@/lib/learning-path';
import { LearningContent } from './LearningContent';

interface LearningNodeModalProps {
  node: LearningPathNode;
  onClose: () => void;
}

export function LearningNodeModal({ node, onClose }: LearningNodeModalProps) {
  // Close on escape key
  React.useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleEsc);
    
    // Prevent scrolling of background content
    document.body.style.overflow = 'hidden';
    
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'auto';
    };
  }, [onClose]);
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-4xl max-h-[85vh] overflow-y-auto bg-white rounded-lg shadow-xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white text-gray-500 hover:bg-gray-100 hover:text-gray-700 z-10"
        >
          <X className="h-5 w-5" />
        </button>
        
        {/* Content */}
        <div className="p-2">
          <LearningContent node={node} />
        </div>
      </div>
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import { X, LightbulbIcon, Zap, Brain, Stethoscope, Pill } from 'lucide-react';

type TipCategory = 'study' | 'nclex' | 'clinical' | 'pharmacology' | 'priority';

interface MicrolearningTip {
  id: number;
  content: string;
  category: TipCategory;
  source?: string;
}

// Collection of microlearning tips for nursing students
const nursingTips: MicrolearningTip[] = [
  {
    id: 1,
    content: "ABCs (Airway, Breathing, Circulation) always come first in prioritizing patient care.",
    category: "priority",
  },
  {
    id: 2,
    content: "Use the ADPIE process for all nursing care: Assessment, Diagnosis, Planning, Implementation, Evaluation.",
    category: "clinical",
  },
  {
    id: 3,
    content: "For NCLEX select-all-that-apply (SATA) questions, treat each option independently as true or false.",
    category: "nclex",
  },
  {
    id: 4,
    content: "Maslow's hierarchy of needs is key to prioritization: physiological needs come before safety, then love/belonging, esteem, and self-actualization.",
    category: "priority",
  },
  {
    id: 5,
    content: "Active recall is more effective than passive reading. Quiz yourself frequently on key concepts.",
    category: "study",
  },
  {
    id: 6,
    content: "When studying drug classes, focus on prototype medications and their primary side effects.",
    category: "pharmacology",
  },
  {
    id: 7,
    content: "Spaced repetition is more effective than cramming. Review material at increasing intervals.",
    category: "study",
  },
  {
    id: 8,
    content: "On NCLEX, if all options seem correct, choose the one that addresses the most immediate risk to patient safety.",
    category: "nclex",
  },
  {
    id: 9,
    content: "For acute pain management, administer analgesics before pain becomes severe - 'staying ahead of the pain.'",
    category: "clinical",
  },
  {
    id: 10,
    content: "Beta-blockers end in '-olol' (metoprolol, atenolol) and ACE inhibitors end in '-pril' (lisinopril, enalapril).",
    category: "pharmacology",
  },
  {
    id: 11,
    content: "Always check for drug interactions when a patient is on multiple medications.",
    category: "pharmacology",
  },
  {
    id: 12,
    content: "Create concept maps to connect related nursing concepts and pathophysiology.",
    category: "study",
  },
  {
    id: 13,
    content: "For NCLEX, remember that the patient's problem is often in the stem of the question.",
    category: "nclex",
  },
  {
    id: 14,
    content: "Normal saline (0.9% NaCl) is isotonic with a pH of 5.0 and osmolarity of 308 mOsm/L.",
    category: "clinical",
  },
  {
    id: 15,
    content: "Teaching moments occur throughout the day - use every patient interaction as an opportunity for health education.",
    category: "clinical",
  }
];

interface MicrolearningTipOverlayProps {
  onClose: () => void;
}

export function MicrolearningTipOverlay({ onClose }: MicrolearningTipOverlayProps) {
  const [tip, setTip] = useState<MicrolearningTip | null>(null);
  
  useEffect(() => {
    // Select a random tip when component mounts
    const randomIndex = Math.floor(Math.random() * nursingTips.length);
    setTip(nursingTips[randomIndex]);
  }, []);

  if (!tip) return null;

  const getCategoryIcon = (category: TipCategory) => {
    switch (category) {
      case 'study':
        return <Brain className="h-5 w-5 text-blue-500" />;
      case 'nclex':
        return <Zap className="h-5 w-5 text-amber-500" />;
      case 'clinical':
        return <Stethoscope className="h-5 w-5 text-green-500" />;
      case 'pharmacology':
        return <Pill className="h-5 w-5 text-red-500" />;
      case 'priority':
        return <LightbulbIcon className="h-5 w-5 text-purple-500" />;
      default:
        return <LightbulbIcon className="h-5 w-5 text-blue-500" />;
    }
  };

  const getCategoryName = (category: TipCategory) => {
    switch (category) {
      case 'study':
        return 'Study Strategy';
      case 'nclex':
        return 'NCLEX Tip';
      case 'clinical':
        return 'Clinical Practice';
      case 'pharmacology':
        return 'Pharmacology';
      case 'priority':
        return 'Priority Setting';
      default:
        return 'Quick Tip';
    }
  };

  const getCategoryClass = (category: TipCategory) => {
    switch (category) {
      case 'study':
        return 'bg-blue-100 text-blue-800';
      case 'nclex':
        return 'bg-amber-100 text-amber-800';
      case 'clinical':
        return 'bg-green-100 text-green-800';
      case 'pharmacology':
        return 'bg-red-100 text-red-800';
      case 'priority':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 animate-fadeIn">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 mb-4 sm:mb-0 overflow-hidden transform transition-all animate-slideUp">
        <div className="flex justify-between items-center p-4 border-b">
          <div className="flex items-center gap-2">
            {getCategoryIcon(tip.category)}
            <h3 className="font-semibold text-lg">Did you know?</h3>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-5 pt-4">
          <div className="mb-4">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryClass(tip.category)}`}>
              {getCategoryName(tip.category)}
            </span>
          </div>
          <p className="text-gray-700 leading-relaxed">
            {tip.content}
          </p>
          {tip.source && (
            <p className="text-gray-500 text-sm mt-3 italic">
              Source: {tip.source}
            </p>
          )}
        </div>
        <div className="bg-gray-50 p-3 flex justify-between items-center">
          <button 
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-colors"
          >
            Dismiss
          </button>
          <button 
            onClick={() => {
              const randomIndex = Math.floor(Math.random() * nursingTips.length);
              setTip(nursingTips[randomIndex]);
            }}
            className="flex items-center gap-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-colors"
          >
            <Zap className="h-4 w-4" />
            Next Tip
          </button>
        </div>
      </div>
    </div>
  );
}
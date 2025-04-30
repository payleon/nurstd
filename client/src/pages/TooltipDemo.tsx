import React, { useState } from 'react';
import { Header } from '@/components/ui/header';
import { Sidebar } from '@/components/ui/sidebar';
import { ContextualHelp } from '@/components/ui/contextual-help';
import { Tooltip } from '@/components/ui/tooltip';
import { 
  AlarmClock, 
  BookOpen, 
  Brain, 
  Calculator, 
  Check, 
  HelpCircle, 
  InfoIcon, 
  Pill, 
  Timer, 
  FlaskConical
} from 'lucide-react';

export default function TooltipDemo() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const colors = [
    { name: 'Blue', hex: '#4B9CD3', class: 'bg-blue-500' },
    { name: 'Green', hex: '#4ade80', class: 'bg-green-500' },
    { name: 'Purple', hex: '#a855f7', class: 'bg-purple-500' },
    { name: 'Pink', hex: '#FFB6C1', class: 'bg-pink-400' },
    { name: 'Amber', hex: '#f59e0b', class: 'bg-amber-500' },
  ];

  return (
    <div className="bg-[#f0f2f5] font-sans text-[#333333] min-h-screen neuro-noise">
      <Header toggleSidebar={toggleSidebar} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex h-screen pt-16">
        <main className="flex-1 p-4 md:p-6 lg:pl-72 overflow-auto">
          <div className="max-w-5xl mx-auto">
            <div className="bg-white p-8 border-3 border-black rounded-md shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] mb-8">
              <h1 className="text-3xl font-bold text-[#13294B] mb-4 flex items-center">
                Contextual Tooltips 
                <ContextualHelp 
                  content="These tooltips provide helpful context to users." 
                  type="info" 
                  className="ml-2"
                />
              </h1>
              
              <p className="mb-6">
                Tooltips help users understand functionality and context. Hover over elements to see tooltips.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Tooltip Types Section */}
                <div className="border-2 border-black p-5 rounded-md">
                  <h2 className="text-xl font-bold mb-4 flex items-center">
                    Tooltip Types
                    <ContextualHelp 
                      content="Different tooltip types convey different kinds of information" 
                      type="help" 
                      className="ml-2"
                    />
                  </h2>
                  
                  <div className="flex flex-col space-y-4">
                    <div className="flex items-center">
                      <ContextualHelp 
                        content="Information tooltips provide general help and information about features." 
                        type="info" 
                      />
                      <span className="ml-3">Information Tooltip</span>
                    </div>
                    
                    <div className="flex items-center">
                      <ContextualHelp 
                        content="Help tooltips provide guidance on how to use a feature." 
                        type="help" 
                      />
                      <span className="ml-3">Help Tooltip</span>
                    </div>
                    
                    <div className="flex items-center">
                      <ContextualHelp 
                        content="Warning tooltips alert users to potential issues or requirements." 
                        type="warning" 
                      />
                      <span className="ml-3">Warning Tooltip</span>
                    </div>
                    
                    <div className="flex items-center">
                      <ContextualHelp 
                        content="Definition tooltips explain terminology and concepts." 
                        type="definition" 
                      />
                      <span className="ml-3">Definition Tooltip</span>
                    </div>
                  </div>
                </div>

                {/* Icon Tooltips */}
                <div className="border-2 border-black p-5 rounded-md">
                  <h2 className="text-xl font-bold mb-4">Medical Icons</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <Tooltip content="Medication dosage calculator">
                      <button className="p-3 border-2 border-black rounded-md flex items-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:shadow-none transition-all">
                        <Calculator className="h-5 w-5 mr-2" />
                        <span>Calculator</span>
                      </button>
                    </Tooltip>
                    
                    <Tooltip content="Study timer with Pomodoro technique">
                      <button className="p-3 border-2 border-black rounded-md flex items-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:shadow-none transition-all">
                        <Timer className="h-5 w-5 mr-2" />
                        <span>Study Timer</span>
                      </button>
                    </Tooltip>
                    
                    <Tooltip content="Pharmacology flashcards and medication guides">
                      <button className="p-3 border-2 border-black rounded-md flex items-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:shadow-none transition-all">
                        <Pill className="h-5 w-5 mr-2" />
                        <span>Pharmacology</span>
                      </button>
                    </Tooltip>
                    
                    <Tooltip content="NCLEX case studies and clinical scenarios">
                      <button className="p-3 border-2 border-black rounded-md flex items-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:shadow-none transition-all">
                        <BookOpen className="h-5 w-5 mr-2" />
                        <span>Case Studies</span>
                      </button>
                    </Tooltip>
                  </div>
                </div>
              </div>

              {/* Interactive Example */}
              <div className="border-2 border-black p-6 rounded-md mb-8">
                <h2 className="text-xl font-bold mb-4">Contextual In-Text Help</h2>
                <p className="mb-4 leading-relaxed">
                  The <strong>Central Venous Pressure</strong> 
                  <ContextualHelp 
                    content="Central Venous Pressure (CVP) is the blood pressure in the central veins that return blood to the right atrium of the heart. Normal values range from 2-6 mmHg." 
                    type="definition" 
                    inline={true}
                  /> 
                  measurement helps assess right heart function and volume status. When caring for patients with 
                  <strong> heart failure</strong>
                  <ContextualHelp 
                    content="Heart failure occurs when the heart cannot pump blood effectively to meet the body's needs. It commonly results from coronary artery disease, high blood pressure, or valve abnormalities." 
                    type="definition" 
                    inline={true}
                  />, 
                  it's important to monitor for signs of pulmonary edema
                  <ContextualHelp 
                    content="Warning: Pulmonary edema is a life-threatening emergency requiring immediate intervention." 
                    type="warning" 
                    inline={true}
                  />. 
                  Nursing interventions should include careful fluid management 
                  <ContextualHelp 
                    content="Restrict fluids as ordered, typically 1.5-2 L per day for most heart failure patients." 
                    type="info" 
                    inline={true}
                  />.
                </p>
              </div>

              {/* Colors and Positions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border-2 border-black p-5 rounded-md">
                  <h2 className="text-xl font-bold mb-4">Tooltip Positions</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <Tooltip content="Tooltip appears above the element" side="top">
                      <button className="p-3 border-2 border-black bg-[#4B9CD3] text-white rounded-md flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                        Top Position
                      </button>
                    </Tooltip>
                    
                    <Tooltip content="Tooltip appears to the right" side="right">
                      <button className="p-3 border-2 border-black bg-[#4B9CD3] text-white rounded-md flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                        Right Position
                      </button>
                    </Tooltip>
                    
                    <Tooltip content="Tooltip appears below the element" side="bottom">
                      <button className="p-3 border-2 border-black bg-[#4B9CD3] text-white rounded-md flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                        Bottom Position
                      </button>
                    </Tooltip>
                    
                    <Tooltip content="Tooltip appears to the left" side="left">
                      <button className="p-3 border-2 border-black bg-[#4B9CD3] text-white rounded-md flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                        Left Position
                      </button>
                    </Tooltip>
                  </div>
                </div>

                <div className="border-2 border-black p-5 rounded-md">
                  <h2 className="text-xl font-bold mb-4">Tooltip Colors</h2>
                  <div className="grid grid-cols-1 gap-3">
                    {colors.map((color) => (
                      <Tooltip 
                        key={color.name}
                        content={`This is a ${color.name.toLowerCase()} tooltip (${color.hex})`}
                        contentClassName={`bg-${color.name.toLowerCase()}-50 border-${color.name.toLowerCase()}-200`}
                      >
                        <div className={`p-3 rounded-md flex items-center ${color.class} text-white cursor-pointer border-2 border-black`}>
                          <div className="h-4 w-4 rounded-full bg-white mr-2 flex items-center justify-center">
                            <Check className="h-3 w-3 text-black" />
                          </div>
                          <span>{color.name} Tooltip Theme</span>
                        </div>
                      </Tooltip>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
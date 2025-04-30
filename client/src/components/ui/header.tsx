import { useState } from "react";
import { ChevronDown, Cog, User } from "lucide-react";
import { useLocation } from "wouter";

interface HeaderProps {
  toggleSidebar: () => void;
}

export function Header({ toggleSidebar }: HeaderProps) {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [, setLocation] = useLocation();

  return (
    <header className="bg-[#4B9CD3] text-white border-b-4 border-black fixed top-0 w-full z-10 flex items-center justify-between px-4 h-16 neuro-noise neuro-header">
      <div className="flex items-center">
        {/* Mobile Menu Toggle */}
        <button 
          onClick={toggleSidebar}
          className="lg:hidden mr-3 border-3 border-black p-1 bg-white text-black hover:bg-[#FFE45C] transition-colors shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]" 
          aria-label="Toggle Menu"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        
        {/* Logo */}
        <div className="flex items-center">
          <div className="h-10 w-10 bg-white border-3 border-black flex items-center justify-center mr-3 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-7 w-7 animate-flask" 
              viewBox="0 0 24 24" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              {/* Flask outline */}
              <path 
                d="M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" 
                stroke="#13294B"
                strokeWidth="2"
                fill="none"
              />
              
              {/* Blue liquid inside the flask with wave animation */}
              <path 
                className="animate-liquid"
                d="M6.5 15.5c0 0 2.286-0.975 5.5-0.5c3.214 0.475 5.5 0.5 5.5 0.5v4.5h-11v-4.5z" 
                fill="#4B9CD3" 
                opacity="0.8"
              />
              
              {/* Bubbles in the liquid with float animation */}
              <circle 
                className="animate-bubble-1" 
                cx="10" 
                cy="16" 
                r="0.6" 
                fill="#ffffff" 
                opacity="0.6"
              />
              <circle 
                className="animate-bubble-2" 
                cx="14" 
                cy="17" 
                r="0.4" 
                fill="#ffffff" 
                opacity="0.5"
              />
              <circle 
                className="animate-bubble-3" 
                cx="12" 
                cy="15.5" 
                r="0.3" 
                fill="#ffffff" 
                opacity="0.7"
              />
            </svg>
          </div>
          <span className="text-2xl font-bold tracking-tight uppercase">NURS'TD</span>
        </div>
      </div>
      
      {/* User Controls */}
      <div className="flex items-center">
        <div 
          className="ml-3 flex items-center cursor-pointer border-3 border-black px-3 py-1 bg-[#FFE45C] text-black font-bold hover:bg-white transition-colors shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
          onClick={() => setUserMenuOpen(!userMenuOpen)}
        >
          <div className="h-8 w-8 bg-white border-3 border-black text-[#13294B] flex items-center justify-center font-bold mr-2">
            R
          </div>
          <span className="hidden md:inline font-bold">Ranyn</span>
          <ChevronDown className="h-4 w-4 ml-1" />
        </div>
        
        {/* User menu dropdown */}
        {userMenuOpen && (
          <div className="absolute right-4 top-16 w-48 bg-white border-3 border-black z-50 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <div className="p-3 border-b-3 border-black">
              <p className="font-bold text-black text-lg">Ranyn</p>
              <p className="text-sm text-gray-700">Student Nurse</p>
            </div>
            <ul>
              <li className="border-b-2 border-black">
                <button
                  onClick={() => {
                    setLocation("/profile");
                    setUserMenuOpen(false);
                  }}
                  className="w-full text-left p-3 hover:bg-[#FFE45C] text-black font-medium flex items-center transition-colors"
                >
                  <User className="h-4 w-4 mr-2" /> Profile
                </button>
              </li>
              <li>
                <button
                  className="w-full text-left p-3 hover:bg-[#FFE45C] text-black font-medium flex items-center transition-colors"
                >
                  <Cog className="h-4 w-4 mr-2" /> Settings
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </header>
  );
}
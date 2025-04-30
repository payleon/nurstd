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
        {/* Logo with Menu Toggle functionality */}
        <div className="flex items-center">
          <div 
            className="h-10 w-10 bg-white border-3 border-black flex items-center justify-center mr-3 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] overflow-hidden cursor-pointer hover:bg-[#FFE45C] transition-colors"
            onClick={toggleSidebar}
            aria-label="Toggle Menu"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-7 w-7 animate-flask" 
              viewBox="0 0 24 24" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              {/* Flask glass container */}
              <defs>
                <clipPath id="flask-clip">
                  <path d="M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </clipPath>
                <linearGradient id="liquid-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#6FB7E9" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#3D8AC7" stopOpacity="0.95" />
                </linearGradient>
                <linearGradient id="liquid-surface" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#4B9CD3" stopOpacity="0.9" />
                  <stop offset="50%" stopColor="#6FB7E9" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#4B9CD3" stopOpacity="0.9" />
                </linearGradient>
                <filter id="liquid-blur">
                  <feGaussianBlur in="SourceGraphic" stdDeviation="0.3" />
                </filter>
                <mask id="flask-mask">
                  <path d="M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" fill="white" />
                </mask>
              </defs>
              
              {/* Liquid inside the flask - using mask to ensure it stays inside the outline */}
              <g mask="url(#flask-mask)">
                {/* Background fill to ensure no gaps */}
                <rect
                  x="3"
                  y="12"
                  width="18"
                  height="9"
                  fill="url(#liquid-gradient)"
                />
                
                {/* Main liquid body with slosh animation */}
                <path 
                  className="animate-liquid-body"
                  d="M2,21 L2,13 C4,12.2 6.5,13.5 8.5,12.5 C11,11.3 13.5,11 16,12 C18,12.8 20,12 22,12.5 L22,21 L2,21 Z" 
                  fill="url(#liquid-gradient)" 
                />
                
                {/* Blended waves with blur for smoother appearance */}
                <g filter="url(#liquid-blur)">
                  {/* Top wave animation with gradient */}
                  <path 
                    className="animate-liquid"
                    d="M3,12 C5,10.8 7,12.2 9,11 C11,9.8 13,11 15,10 C17,9 19,10.5 21,11 L21,13 L3,13 Z" 
                    fill="url(#liquid-surface)" 
                    opacity="0.95"
                  />
                  
                  {/* Second wave layer that overlaps slightly */}
                  <path 
                    className="animate-liquid-2"
                    d="M3,11.8 C5,11.2 7,12.8 9,11.8 C11,10.8 13,11.5 15,11 C17,10.5 19,11.5 21,11.2 L21,13.2 L3,13.2 Z" 
                    fill="#5AA7DE" 
                    opacity="0.85"
                  />
                </g>
                
                {/* Light reflection that follows the movement */}
                <path 
                  className="animate-reflection"
                  d="M6,14 L8,13.5 C9,14 10,14.8 11,14.5 C12,14.2 13,14.8 14,14.5 L16,15 L6,15.5 Z" 
                  fill="#FFFFFF" 
                  opacity="0.25"
                  filter="url(#liquid-blur)"
                />
                
                {/* Bubbles in the liquid with float animation */}
                <circle 
                  className="animate-bubble-1" 
                  cx="10" 
                  cy="16" 
                  r="0.5" 
                  fill="#ffffff" 
                  opacity="0.6"
                />
                <circle 
                  className="animate-bubble-2" 
                  cx="14" 
                  cy="17" 
                  r="0.4" 
                  fill="#ffffff" 
                  opacity="0.7"
                />
                <circle 
                  className="animate-bubble-3" 
                  cx="12" 
                  cy="15" 
                  r="0.3" 
                  fill="#ffffff" 
                  opacity="0.8"
                />
                <circle 
                  className="animate-bubble-2" 
                  cx="8" 
                  cy="17" 
                  r="0.25" 
                  fill="#ffffff" 
                  opacity="0.5"
                />
                <circle 
                  className="animate-bubble-3" 
                  cx="16" 
                  cy="14" 
                  r="0.2" 
                  fill="#ffffff" 
                  opacity="0.6"
                />
              </g>
              
              {/* Glass highlight/reflection */}
              <path 
                d="M14.5 5.5L15.5 4.5C16 6 16 7.5 15 9C14 10.5 14 12 15 13.5" 
                stroke="white" 
                strokeWidth="0.75" 
                strokeLinecap="round" 
                opacity="0.5" 
              />
              
              {/* Glass container outline - drawn last to appear on top */}
              <path 
                d="M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" 
                stroke="#13294B"
                strokeWidth="2"
                fill="none"
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
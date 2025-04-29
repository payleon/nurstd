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
          <div className="h-10 w-10 bg-white border-3 border-black flex items-center justify-center mr-3 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-7 w-7 text-[#13294B]" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor"
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
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
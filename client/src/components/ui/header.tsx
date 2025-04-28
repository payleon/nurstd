import { useState } from "react";
import { Settings, Bell, ChevronDown, Cog } from "lucide-react";

interface HeaderProps {
  toggleSidebar: () => void;
}

export function Header({ toggleSidebar }: HeaderProps) {
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <header className="bg-[#4B9CD3] text-white shadow-md h-14 fixed top-0 w-full z-10 flex items-center justify-between px-4">
      <div className="flex items-center">
        {/* Mobile Menu Toggle */}
        <button 
          onClick={toggleSidebar}
          className="lg:hidden mr-2" 
          aria-label="Toggle Menu"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        
        {/* Logo */}
        <div className="flex items-center">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-8 w-8 mr-2" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor"
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
          <span className="text-xl font-semibold">Naxlex</span>
        </div>
      </div>
      
      {/* User Controls */}
      <div className="flex items-center">
        <button className="mx-2" aria-label="Settings">
          <Cog className="h-5 w-5" />
        </button>
        <button className="mx-2" aria-label="Notifications">
          <Bell className="h-5 w-5" />
        </button>
        <div 
          className="mx-2 flex items-center cursor-pointer"
          onClick={() => setUserMenuOpen(!userMenuOpen)}
        >
          <div className="h-8 w-8 rounded-full bg-white text-[#4B9CD3] flex items-center justify-center font-semibold">
            R
          </div>
          <span className="ml-2 hidden md:inline">Ranyn</span>
          <ChevronDown className="h-4 w-4 ml-1" />
        </div>
      </div>
    </header>
  );
}

import { useState } from "react";
import { Settings, Bell, ChevronDown } from "lucide-react";

interface HeaderProps {
  toggleSidebar: () => void;
}

export function Header({ toggleSidebar }: HeaderProps) {
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <header className="bg-primary text-white shadow-md h-14 fixed top-0 w-full z-10 flex items-center justify-between px-4">
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
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <span className="text-lg font-semibold">NCLEX Study Platform</span>
        </div>
      </div>
      
      {/* User Controls */}
      <div className="flex items-center">
        <button className="mx-2" aria-label="Settings">
          <Settings className="h-5 w-5" />
        </button>
        <button className="mx-2" aria-label="Notifications">
          <Bell className="h-5 w-5" />
        </button>
        <div 
          className="mx-2 flex items-center cursor-pointer"
          onClick={() => setUserMenuOpen(!userMenuOpen)}
        >
          <div className="h-8 w-8 rounded-full bg-white text-primary flex items-center justify-center font-semibold">
            R
          </div>
          <span className="ml-2 hidden md:inline">Ranyn</span>
          <ChevronDown className="h-4 w-4 ml-1" />
        </div>
      </div>
    </header>
  );
}

import { 
  Monitor, 
  ShieldCheck, 
  FileText, 
  Files, 
  HelpCircle, 
  Lightbulb,
  Search,
  Award,
  User,
  BarChart,
  AlarmClock,
  GamepadIcon
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useLocation } from "wouter";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface MenuItem {
  title: string;
  icon: JSX.Element;
  active: boolean;
  path?: string;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const [location, setLocation] = useLocation();
  // Set initial active category based on current URL path
  const getInitialActiveCategory = () => {
    // Map paths to menu item titles
    const pathToCategoryMap: Record<string, string> = {
      "/": "Practice Exams",
      "/profile": "Profile",
      "/achievements": "Achievements",
      "/case-studies": "Case Studies",
      "/nclex-questions": "Question Bank",
      "/question-bank": "Question Bank",
      "/study-strategies": "Study Strategies",
      "/learning-progress": "Learning Progress",
      "/study-timer": "Study Timer",
      "/games": "Learning Games"
    };
    
    // Special case for exact matches
    if (pathToCategoryMap[location]) {
      return pathToCategoryMap[location];
    }
    
    // Check for partial matches (for nested routes)
    for (const [path, category] of Object.entries(pathToCategoryMap)) {
      if (location.startsWith(path) && path !== "/") {
        return category;
      }
    }
    
    return "Practice Exams"; // Default
  };
  
  const [activeCategory, setActiveCategory] = useState(getInitialActiveCategory);

  const handleMenuItemClick = (title: string, path: string = "/") => {
    if (!path) {
      console.error("Missing path for menu item:", title);
      return;
    }
    
    setActiveCategory(title);
    setLocation(path);
    onClose(); // Close the sidebar on mobile after clicking
  };

  const menuItems: MenuItem[] = [
    {
      title: "My Dashboard",
      icon: <Monitor className="h-5 w-5 mr-3" />,
      active: activeCategory === "My Dashboard",
      path: "/"
    },
    {
      title: "Practice Exams",
      icon: <ShieldCheck className="h-5 w-5 mr-3" />,
      active: activeCategory === "Practice Exams",
      path: "/"
    },
    {
      title: "Case Studies",
      icon: <Files className="h-5 w-5 mr-3" />,
      active: activeCategory === "Case Studies",
      path: "/case-studies"
    },
    {
      title: "Question Bank",
      icon: <HelpCircle className="h-5 w-5 mr-3" />,
      active: activeCategory === "Question Bank" || activeCategory === "NCLEX-Style Questions",
      path: "/question-bank"
    },
    {
      title: "Study Strategies",
      icon: <Lightbulb className="h-5 w-5 mr-3" />,
      active: activeCategory === "Study Strategies",
      path: "/study-strategies"
    },
    {
      title: "Learning Progress",
      icon: <BarChart className="h-5 w-5 mr-3" />,
      active: activeCategory === "Learning Progress",
      path: "/learning-progress"
    },
    {
      title: "Study Timer",
      icon: <AlarmClock className="h-5 w-5 mr-3" />,
      active: activeCategory === "Study Timer",
      path: "/study-timer"
    },
    {
      title: "Learning Games",
      icon: <GamepadIcon className="h-5 w-5 mr-3" />,
      active: activeCategory === "Learning Games",
      path: "/games"
    },
    {
      title: "Profile",
      icon: <User className="h-5 w-5 mr-3" />,
      active: activeCategory === "Profile",
      path: "/profile"
    },
    {
      title: "Achievements",
      icon: <Award className="h-5 w-5 mr-3" />,
      active: activeCategory === "Achievements",
      path: "/achievements"
    }
  ];

  // Mobile overlay for sidebar
  const mobileOverlay = isOpen ? (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden" 
      onClick={onClose}
    />
  ) : null;

  return (
    <>
      {mobileOverlay}
      <aside 
        className={cn(
          "w-64 bg-[#13294B] text-white h-full fixed overflow-auto transition-all duration-300 ease-in-out z-30 border-r-2 border-black",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div 
          className="p-4 border-b-2 border-black flex items-center bg-[#0A1E3A] cursor-pointer"
          onClick={() => handleMenuItemClick("My Dashboard", "/")}
        >
          <div className="h-10 w-10 bg-white border-2 border-black flex items-center justify-center mr-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
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
          <span className="text-xl font-bold uppercase tracking-tight">NURS'TD</span>
        </div>
        
        <div className="p-4 border-b-2 border-black">
          <div className="relative">
            <form onSubmit={(e) => {
              e.preventDefault();
              const input = e.currentTarget.querySelector('input');
              if (input && input.value.trim()) {
                // This would typically connect to a search API, for now just navigate to home
                alert(`Searching for: ${input.value}`);
                input.value = '';
              }
            }}>
              <input 
                type="text" 
                placeholder="Search exams..." 
                className="w-full bg-[#0A1E3A] border-2 border-black py-2 px-3 text-sm focus:outline-none neuro-input" 
              />
              <button type="submit" className="absolute right-3 top-2.5 bg-transparent border-none p-0 cursor-pointer">
                <Search className="h-4 w-4 text-gray-400" />
              </button>
            </form>
          </div>
        </div>
        
        <nav className="mt-2">
          {menuItems.map((item, index) => (
            <div 
              key={index}
              className={cn(
                "px-4 py-3 flex items-center cursor-pointer hover:bg-[#0A1E3A] border-b border-black/30",
                item.active && "bg-[#0A1E3A] text-[#4B9CD3] font-bold"
              )}
              onClick={() => handleMenuItemClick(item.title, item.path)}
            >
              {item.icon}
              <span className="font-medium">{item.title}</span>
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
}

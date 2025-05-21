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
  GamepadIcon,
  BookOpen,
  GraduationCap,
  Clock,
  FlashlightIcon
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
      "/": "My Dashboard",
      "/achievements": "Achievements",
      "/case-studies": "Exams & Studies",
      "/nclex-questions": "Exams & Studies",
      "/question-bank": "Exams & Studies",
      "/study-strategies": "Study Strategies",
      "/study-timer": "Study Timer",
      "/games": "Learning Games",
      "/learning-paths": "Learning Paths",
      "/learning-path": "Learning Paths",
      "/create-learning-path": "Learning Paths"
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
    
    return "My Dashboard"; // Default
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
      active: activeCategory === "My Dashboard" || activeCategory === "Practice Exams",
      path: "/"
    },
    {
      title: "Exams & Studies",
      icon: <Files className="h-5 w-5 mr-3" />,
      active: activeCategory === "Case Studies" || activeCategory === "Exams & Studies",
      path: "/exams-and-studies"
    },
    {
      title: "Study Dashboard",
      icon: <BarChart className="h-5 w-5 mr-3" />,
      active: activeCategory === "Study Dashboard",
      path: "/study-dashboard"
    },
    {
      title: "Quick Review",
      icon: <FlashlightIcon className="h-5 w-5 mr-3" />,
      active: activeCategory === "Quick Review",
      path: "/quick-review"
    },
    {
      title: "Learning Paths",
      icon: <GraduationCap className="h-5 w-5 mr-3" />,
      active: activeCategory === "Learning Paths",
      path: "/learning-paths"
    },
    {
      title: "Study Strategies",
      icon: <Lightbulb className="h-5 w-5 mr-3" />,
      active: activeCategory === "Study Strategies",
      path: "/study-strategies"
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
          "w-64 bg-[#13294B] text-white h-full fixed overflow-auto transition-all duration-300 ease-in-out z-30 border-r-4 border-black",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div 
          className="p-4 border-b-3 border-black flex items-center bg-[#0A1E3A] cursor-pointer"
          onClick={() => handleMenuItemClick("My Dashboard", "/")}
        >
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
          <span className="text-xl font-bold uppercase tracking-tight">NURS'TD</span>
        </div>
        
        <div className="p-4 border-b-3 border-black">
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
                className="w-full bg-white text-black border-3 border-black py-2 px-3 text-sm focus:outline-none neuro-input font-medium shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]" 
              />
              <button type="submit" className="absolute right-3 top-2.5 bg-transparent border-none p-0 cursor-pointer">
                <Search className="h-4 w-4 text-black" />
              </button>
            </form>
          </div>
        </div>
        
        <nav className="mt-2">
          {menuItems.map((item, index) => (
            <div 
              key={index}
              className={cn(
                "px-4 py-3 flex items-center cursor-pointer hover:bg-[#0A1E3A] border-b-3 border-black transition-all",
                item.active ? "bg-[#0A1E3A] text-[#FFB6C1] font-bold shadow-inner" : "border-opacity-70"
              )}
              onClick={() => handleMenuItemClick(item.title, item.path)}
            >
              {item.icon}
              <span className="font-medium">{item.title}</span>
              {item.active && (
                <div className="ml-auto w-2 h-8 bg-[#FFB6C1]"></div>
              )}
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
}

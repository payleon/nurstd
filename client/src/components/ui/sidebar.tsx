import { 
  Monitor, 
  ShieldCheck, 
  FileText, 
  Files, 
  HelpCircle, 
  Lightbulb,
  Video, 
  Calendar, 
  ChevronDown,
  Search,
  ClipboardList,
  BookOpen,
  BookCheck,
  BookCopy,
  Award
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

interface MenuSection {
  section: string;
  items: MenuItem[];
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const [, setLocation] = useLocation();
  const [activeCategory, setActiveCategory] = useState("Practice Exams");

  const handleMenuItemClick = (title: string, path: string = "/") => {
    setActiveCategory(title);
    setLocation(path);
    onClose(); // Close the sidebar on mobile after clicking
  };

  const menuItems: (MenuItem | MenuSection)[] = [
    {
      title: "My Dashboard",
      icon: <Monitor className="h-5 w-5 mr-3" />,
      active: activeCategory === "My Dashboard",
      path: "/"
    },
    {
      title: "Achievements",
      icon: <Award className="h-5 w-5 mr-3" />,
      active: activeCategory === "Achievements",
      path: "/achievements"
    },
    {
      section: "STUDY MATERIALS",
      items: [
        { 
          title: "Practice Exams", 
          icon: <ShieldCheck className="h-5 w-5 mr-3 text-[#4B9CD3]" />, 
          active: activeCategory === "Practice Exams",
          path: "/"
        },
        { 
          title: "Question Bank", 
          icon: <FileText className="h-5 w-5 mr-3" />, 
          active: activeCategory === "Question Bank",
          path: "/questions"
        },
        { 
          title: "Case Studies", 
          icon: <Files className="h-5 w-5 mr-3" />, 
          active: activeCategory === "Case Studies",
          path: "/case-studies"
        },
        { 
          title: "NCLEX-Style Questions", 
          icon: <HelpCircle className="h-5 w-5 mr-3" />, 
          active: activeCategory === "NCLEX-Style Questions",
          path: "/nclex-questions"
        },
        { 
          title: "Study Strategies", 
          icon: <Lightbulb className="h-5 w-5 mr-3" />, 
          active: activeCategory === "Study Strategies",
          path: "/study-strategies"
        }
      ]
    },
    {
      section: "CONTENT REVIEW",
      items: [
        { 
          title: "Medical-Surgical", 
          icon: <BookOpen className="h-5 w-5 mr-3" />, 
          active: activeCategory === "Medical-Surgical",
          path: "/content/medical-surgical"
        },
        { 
          title: "Obstetrics", 
          icon: <BookCheck className="h-5 w-5 mr-3" />, 
          active: activeCategory === "Obstetrics",
          path: "/content/obstetrics"
        },
        { 
          title: "Pediatrics", 
          icon: <BookCopy className="h-5 w-5 mr-3" />, 
          active: activeCategory === "Pediatrics",
          path: "/content/pediatrics"
        },
        { 
          title: "Pharmacology", 
          icon: <ClipboardList className="h-5 w-5 mr-3" />, 
          active: activeCategory === "Pharmacology",
          path: "/content/pharmacology"
        }
      ]
    },
    {
      section: "RESOURCES",
      items: [
        { 
          title: "Video Tutorials", 
          icon: <Video className="h-5 w-5 mr-3" />, 
          active: activeCategory === "Video Tutorials",
          path: "/resources/videos"
        },
        { 
          title: "Study Planner", 
          icon: <Calendar className="h-5 w-5 mr-3" />, 
          active: activeCategory === "Study Planner",
          path: "/resources/planner"
        }
      ]
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
          <span className="text-xl font-bold uppercase tracking-tight">Naxlex</span>
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
            <div key={index}>
              {/* Regular menu item (not in a section) */}
              {!('section' in item) && (
                <div 
                  className={cn(
                    "px-4 py-3 flex items-center cursor-pointer hover:bg-[#0A1E3A] border-b border-black/30",
                    item.active && "bg-[#0A1E3A] text-[#4B9CD3] font-bold"
                  )}
                  onClick={() => handleMenuItemClick(item.title, item.path)}
                >
                  {item.icon}
                  <span className="font-medium">{item.title}</span>
                </div>
              )}
              
              {/* Section with sub-items */}
              {'section' in item && (
                <>
                  <div className="mt-4 px-4 py-2 text-sm font-bold text-[#4B9CD3] bg-[#0A1E3A] border-y border-black/30">
                    {item.section}
                  </div>
                  
                  {item.items?.map((subItem, subIndex) => (
                    <div 
                      key={subIndex}
                      className={cn(
                        "px-4 py-3 flex items-center cursor-pointer hover:bg-[#0A1E3A] border-b border-black/30",
                        subItem.active && "bg-[#0A1E3A] border-l-4 border-[#4B9CD3] font-bold"
                      )}
                      onClick={() => handleMenuItemClick(subItem.title, subItem.path)}
                    >
                      {subItem.icon}
                      <span>{subItem.title}</span>
                    </div>
                  ))}
                </>
              )}
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
}

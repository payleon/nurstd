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
  BookCopy
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const menuItems = [
    {
      title: "My Dashboard",
      icon: <Monitor className="h-5 w-5 mr-3" />,
      active: false
    },
    {
      section: "STUDY MATERIALS",
      items: [
        { title: "Practice Exams", icon: <ShieldCheck className="h-5 w-5 mr-3 text-[#4B9CD3]" />, active: true },
        { title: "Question Bank", icon: <FileText className="h-5 w-5 mr-3" />, active: false },
        { title: "Case Studies", icon: <Files className="h-5 w-5 mr-3" />, active: false },
        { title: "NCLEX-Style Questions", icon: <HelpCircle className="h-5 w-5 mr-3" />, active: false },
        { title: "Study Strategies", icon: <Lightbulb className="h-5 w-5 mr-3" />, active: false }
      ]
    },
    {
      section: "CONTENT REVIEW",
      items: [
        { title: "Medical-Surgical", icon: <BookOpen className="h-5 w-5 mr-3" />, active: false },
        { title: "Obstetrics", icon: <BookCheck className="h-5 w-5 mr-3" />, active: false },
        { title: "Pediatrics", icon: <BookCopy className="h-5 w-5 mr-3" />, active: false },
        { title: "Pharmacology", icon: <ClipboardList className="h-5 w-5 mr-3" />, active: false }
      ]
    },
    {
      section: "RESOURCES",
      items: [
        { title: "Video Tutorials", icon: <Video className="h-5 w-5 mr-3" />, active: false },
        { title: "Study Planner", icon: <Calendar className="h-5 w-5 mr-3" />, active: false }
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
          "w-64 bg-[#13294B] text-white h-full fixed overflow-auto transition-all duration-300 ease-in-out z-30",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="p-4 border-b border-opacity-20 border-white flex items-center">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-8 w-8 mr-2 text-[#4B9CD3]" 
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
        
        <div className="p-4">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search exams..." 
              className="w-full bg-[#0A1E3A] border border-[#4B9CD3] rounded-md py-2 px-3 text-sm focus:outline-none" 
            />
            <Search className="absolute right-3 top-2 h-4 w-4 text-gray-400" />
          </div>
        </div>
        
        <nav className="mt-2">
          {menuItems.map((item, index) => (
            <div key={index}>
              {!item.section && (
                <div className={cn(
                  "px-4 py-2 flex items-center cursor-pointer hover:bg-[#0A1E3A]",
                  item.active && "text-[#4B9CD3]"
                )}>
                  {item.icon}
                  <span>{item.title}</span>
                </div>
              )}
              
              {item.section && (
                <>
                  <div className="mt-4 px-4 py-1 text-sm font-medium text-gray-400">
                    {item.section}
                  </div>
                  
                  {item.items?.map((subItem, subIndex) => (
                    <div 
                      key={subIndex}
                      className={cn(
                        "px-4 py-2 flex items-center cursor-pointer hover:bg-[#0A1E3A]",
                        subItem.active && "bg-[#0A1E3A] border-l-4 border-[#4B9CD3]"
                      )}
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

import type { NavItem } from "../../types";
import gogmiLogo from "../../assets/images/gogmilogo.png";

const mainNav: NavItem[] = [
  { id: "dashboard", label: "Dashboard", href: "/dashboard" },
  { id: "courses", label: "My Courses", href: "/courses" },
  { id: "catalog", label: "Course Catalog", href: "/catalog" },
  { id: "calendar", label: "Calendar", href: "/calendar" },
  { id: "assessments", label: "Assessments", href: "/assessments" },
  { id: "certificates", label: "Certificates & CPD", href: "/certificates" },
  { id: "discussions", label: "Discussions", href: "/discussions" },
  { id: "messages", label: "Messages", href: "/messages", badge: 3 },
];

const bottomNav: NavItem[] = [
  { id: "settings", label: "Settings", href: "/settings" },
  { id: "help", label: "Help Centre", href: "/help" },
];

interface SidebarProps {
  activeNav: string;
  onNavChange: (id: string) => void;
}

export default function Sidebar({ activeNav, onNavChange }: SidebarProps) {
  return (
    <aside className="fixed left-0 top-0 bottom-0 w-60 bg-brand-navy flex flex-col z-50">
      {/* Logo */}
      <div className="px-6 pt-5 pb-6 border-b border-brand-navy-light">
        <div className="flex items-center gap-3">
          <img
            src={gogmiLogo}
            alt="GoGMI"
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <div className="text-white text-[15px] font-semibold tracking-tight">
              GoGMI
            </div>
            <div className="text-gray-400 text-[11px] tracking-wide">
              Learning Management System
            </div>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <nav className="flex-1 flex flex-col px-3 py-4 gap-0.5 overflow-y-auto">
        {mainNav.map((item) => {
          const isActive = activeNav === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavChange(item.id)}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-md text-[13.5px] text-left w-full transition-colors duration-150 cursor-pointer
                ${
                  isActive
                    ? "bg-brand-navy-light text-white font-medium"
                    : "text-gray-400 hover:bg-brand-navy-light hover:text-gray-300"
                }
              `}
            >
              {item.label}
              {item.badge && (
                <span className="ml-auto bg-red-600 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded-full leading-none">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        <div className="flex-1" />

        {/* Bottom nav */}
        <div className="border-t border-brand-navy-light pt-3 mt-2 flex flex-col gap-0.5">
          {bottomNav.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavChange(item.id)}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-md text-[13.5px] text-left w-full text-gray-400 hover:bg-brand-navy-light hover:text-gray-300 transition-colors duration-150 cursor-pointer"
            >
              {item.label}
            </button>
          ))}
        </div>
      </nav>
    </aside>
  );
}
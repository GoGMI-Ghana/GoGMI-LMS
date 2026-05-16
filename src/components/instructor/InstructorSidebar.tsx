import { NavLink } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import gogmiLogo from "../../assets/images/gogmilogo.png";

const mainNav = [
  { label: "Dashboard", to: "/instructor" },
  { label: "My Courses", to: "/instructor/courses" },
  { label: "Students", to: "/instructor/students" },
  { label: "Assessments", to: "/instructor/assessments" },
  { label: "Grading", to: "/instructor/grading" },
  { label: "Discussions", to: "/instructor/discussions" },
  { label: "Announcements", to: "/instructor/announcements" },
  { label: "Analytics", to: "/instructor/analytics" },
];

const bottomNav = [
  { label: "Settings", to: "/instructor/settings" },
  { label: "Back to LMS", to: "/dashboard" },
];

export default function InstructorSidebar() {
  const { logout } = useAuth();

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-60 bg-[#1a2332] flex flex-col z-50">
      <div className="px-6 pt-5 pb-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <img src={gogmiLogo} alt="GoGMI" className="w-10 h-10 rounded-full object-cover" />
          <div>
            <div className="text-white text-[15px] font-semibold tracking-tight">GoGMI</div>
            <div className="text-brand-teal text-[11px] tracking-wide">Instructor Portal</div>
          </div>
        </div>
      </div>

      <nav className="flex-1 flex flex-col px-3 py-4 gap-0.5 overflow-y-auto">
        {mainNav.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/instructor"}
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-3 py-2.5 rounded-md text-[13.5px] text-left w-full transition-colors duration-150
              ${isActive ? "bg-brand-teal/15 text-brand-teal font-medium" : "text-gray-400 hover:bg-white/5 hover:text-gray-300"}`
            }
          >
            {item.label}
          </NavLink>
        ))}

        <div className="flex-1" />

        <div className="border-t border-white/10 pt-3 mt-2 flex flex-col gap-0.5">
          {bottomNav.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-md text-[13.5px] text-left w-full text-gray-400 hover:bg-white/5 hover:text-gray-300 transition-colors duration-150"
            >
              {item.label}
            </NavLink>
          ))}
          <button
            onClick={logout}
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-md text-[13.5px] text-left w-full text-gray-400 hover:bg-white/5 hover:text-gray-300 transition-colors duration-150 cursor-pointer mt-1"
          >
            Sign out
          </button>
        </div>
      </nav>
    </aside>
  );
}
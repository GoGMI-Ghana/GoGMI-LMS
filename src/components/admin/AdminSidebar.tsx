import { NavLink } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import gogmiLogo from "../../assets/images/gogmilogo.png";

const mainNav = [
  { label: "Overview", to: "/admin", icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>' },
  { label: "Users", to: "/admin/users", icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>' },
  { label: "Courses", to: "/admin/courses", icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>' },
  { label: "Enrollments", to: "/admin/enrollments", icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><polyline points="17 11 19 13 23 9"/></svg>' },
  { label: "Payments", to: "/admin/payments", icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>' },
  { label: "Announcements", to: "/admin/announcements", icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>' },
  { label: "Reports", to: "/admin/reports", icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>' },
];

function Icon({ svg }: { svg: string }) {
  return <span className="shrink-0 opacity-70" dangerouslySetInnerHTML={{ __html: svg }} />;
}

export default function AdminSidebar() {
  const { logout } = useAuth();

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-60 bg-gray-900 flex flex-col z-50">
      <div className="px-6 pt-5 pb-6 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <img src={gogmiLogo} alt="GoGMI" className="w-10 h-10 rounded-full object-cover" />
          <div>
            <div className="text-white text-[15px] font-semibold tracking-tight">GoGMI</div>
            <div className="text-gray-500 text-[11px] tracking-wide">Administration</div>
          </div>
        </div>
      </div>

      <nav className="flex-1 flex flex-col px-3 py-4 gap-0.5 overflow-y-auto">
        {mainNav.map(item => (
          <NavLink key={item.to} to={item.to} end={item.to === "/admin"}
            className={({ isActive }) => `flex items-center gap-2.5 px-3 py-2.5 rounded-md text-[13.5px] text-left w-full transition-colors duration-150 ${isActive ? "bg-white/10 text-white font-medium" : "text-gray-400 hover:bg-white/5 hover:text-gray-300"}`}>
            <Icon svg={item.icon} />
            {item.label}
          </NavLink>
        ))}
        <div className="flex-1" />
        <div className="border-t border-gray-800 pt-3 mt-2 flex flex-col gap-0.5">
          <NavLink to="/dashboard" className="flex items-center gap-2.5 px-3 py-2.5 rounded-md text-[13.5px] text-left w-full text-gray-400 hover:bg-white/5 hover:text-gray-300 transition-colors duration-150">
            <span className="shrink-0 opacity-70"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg></span>
            Back to LMS
          </NavLink>
          <button onClick={logout} className="flex items-center gap-2.5 px-3 py-2.5 rounded-md text-[13.5px] text-left w-full text-gray-400 hover:bg-white/5 hover:text-gray-300 transition-colors duration-150 cursor-pointer mt-1">
            <span className="shrink-0 opacity-70"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg></span>
            Sign out
          </button>
        </div>
      </nav>
    </aside>
  );
}
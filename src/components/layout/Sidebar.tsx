import { NavLink } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import gogmiLogo from "../../assets/images/gogmilogo.png";

const mainNav = [
  { label: "Dashboard", to: "/dashboard", icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>' },
  { label: "My Courses", to: "/courses", icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>' },
  { label: "Course Catalog", to: "/catalog", icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>' },
  { label: "Calendar", to: "/calendar", icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>' },
  { label: "Assessments", to: "/assessments", icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>' },
  { label: "Certificates & CPD", to: "/certificates", icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>' },
  { label: "Discussions", to: "/discussions", icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>' },
  { label: "Messages", to: "/messages", icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>', badge: 3 },
];

const bottomNav = [
  { label: "Settings", to: "/settings", icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>' },
  { label: "Help Centre", to: "/help", icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>' },
];

function Icon({ svg }: { svg: string }) {
  return <span className="shrink-0 opacity-70" dangerouslySetInnerHTML={{ __html: svg }} />;
}

export default function Sidebar() {
  const { logout, user } = useAuth();

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-60 bg-brand-navy flex flex-col z-50">
      <div className="px-6 pt-5 pb-6 border-b border-brand-navy-light">
        <div className="flex items-center gap-3">
          <img src={gogmiLogo} alt="GoGMI" className="w-10 h-10 rounded-full object-cover" />
          <div>
            <div className="text-white text-[15px] font-semibold tracking-tight">Gulf of Guinea Maritime Institute</div>
            <div className="text-gray-400 text-[11px] tracking-wide">Learning Platform</div>
          </div>
        </div>
      </div>

      <nav className="flex-1 flex flex-col px-3 py-4 gap-0.5 overflow-y-auto">
        {mainNav.map(item => (
          <NavLink key={item.to} to={item.to}
            className={({ isActive }) => `flex items-center gap-2.5 px-3 py-2.5 rounded-md text-[13.5px] text-left w-full transition-colors duration-150 ${isActive ? "bg-brand-navy-light text-white font-medium" : "text-gray-400 hover:bg-brand-navy-light hover:text-gray-300"}`}>
            <Icon svg={item.icon} />
            {item.label}
            {"badge" in item && item.badge && <span className="ml-auto bg-red-600 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded-full leading-none">{item.badge}</span>}
          </NavLink>
        ))}

        <div className="flex-1" />

        <div className="border-t border-brand-navy-light pt-3 mt-2 flex flex-col gap-0.5">
          {user?.role === "INSTRUCTOR" && (
            <NavLink to="/instructor" className="flex items-center gap-2.5 px-3 py-2.5 rounded-md text-[13.5px] text-left w-full text-brand-teal hover:bg-brand-navy-light transition-colors duration-150">
              <span className="shrink-0 opacity-70"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg></span>
              Facilitator Portal
            </NavLink>
          )}
          {user?.role === "ADMIN" && (
            <>
              <NavLink to="/instructor" className="flex items-center gap-2.5 px-3 py-2.5 rounded-md text-[13.5px] text-left w-full text-brand-teal hover:bg-brand-navy-light transition-colors duration-150">
                <span className="shrink-0 opacity-70"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg></span>
                Facilitator Portal
              </NavLink>
              <NavLink to="/admin" className="flex items-center gap-2.5 px-3 py-2.5 rounded-md text-[13.5px] text-left w-full text-brand-teal hover:bg-brand-navy-light transition-colors duration-150">
                <span className="shrink-0 opacity-70"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg></span>
                Admin Panel
              </NavLink>
            </>
          )}
          {bottomNav.map(item => (
            <NavLink key={item.to} to={item.to}
              className={({ isActive }) => `flex items-center gap-2.5 px-3 py-2.5 rounded-md text-[13.5px] text-left w-full transition-colors duration-150 ${isActive ? "bg-brand-navy-light text-white font-medium" : "text-gray-400 hover:bg-brand-navy-light hover:text-gray-300"}`}>
              <Icon svg={item.icon} />
              {item.label}
            </NavLink>
          ))}
          <button onClick={logout} className="flex items-center gap-2.5 px-3 py-2.5 rounded-md text-[13.5px] text-left w-full text-gray-400 hover:bg-brand-navy-light hover:text-gray-300 transition-colors duration-150 cursor-pointer mt-1">
            <span className="shrink-0 opacity-70"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg></span>
            Sign out
          </button>
        </div>
      </nav>
    </aside>
  );
}
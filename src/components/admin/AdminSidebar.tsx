import { NavLink } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import gogmiLogo from "../../assets/images/gogmilogo.png";

interface NavItem {
  label: string;
  to: string;
  badge?: number;
}

const mainNav: NavItem[] = [
  { label: "Overview", to: "/admin" },
  { label: "Users", to: "/admin/users" },
  { label: "Courses", to: "/admin/courses" },
  { label: "Enrollments", to: "/admin/enrollments" },
  { label: "Assessments", to: "/admin/assessments" },
  { label: "Certificates", to: "/admin/certificates" },
  { label: "Payments", to: "/admin/payments" },
  { label: "Announcements", to: "/admin/announcements" },
  { label: "Reports", to: "/admin/reports" },
];

const bottomNav: NavItem[] = [
  { label: "Settings", to: "/admin/settings" },
  { label: "Back to LMS", to: "/dashboard" },
];

function AdminSidebarLink({ item }: { item: NavItem }) {
  return (
    <NavLink
      to={item.to}
      end={item.to === "/admin"}
      className={({ isActive }) =>
        `flex items-center gap-2.5 px-3 py-2.5 rounded-md text-[13.5px] text-left w-full transition-colors duration-150
        ${isActive
          ? "bg-white/10 text-white font-medium"
          : "text-gray-400 hover:bg-white/5 hover:text-gray-300"
        }`
      }
    >
      {item.label}
      {item.badge && (
        <span className="ml-auto bg-red-600 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded-full leading-none">
          {item.badge}
        </span>
      )}
    </NavLink>
  );
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
          <AdminSidebarLink key={item.to} item={item} />
        ))}

        <div className="flex-1" />

        <div className="border-t border-gray-800 pt-3 mt-2 flex flex-col gap-0.5">
          {bottomNav.map(item => (
            <AdminSidebarLink key={item.to} item={item} />
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
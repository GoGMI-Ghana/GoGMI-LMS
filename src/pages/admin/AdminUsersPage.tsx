import { useState, useMemo } from "react";

interface UserRecord {
  id: string;
  name: string;
  email: string;
  role: "student" | "instructor" | "admin";
  organization: string;
  status: "active" | "suspended" | "pending";
  enrolledCourses: number;
  joinedDate: string;
}

const users: UserRecord[] = [
  { id: "u1", name: "Kwame Asante", email: "k.asante@example.com", role: "student", organization: "Ghana Maritime Authority", status: "active", enrolledCourses: 2, joinedDate: "Jan 10, 2026" },
  { id: "u2", name: "Ama Serwaa Mensah", email: "a.mensah@gma.gov.gh", role: "student", organization: "Ghana Maritime Authority", status: "active", enrolledCourses: 1, joinedDate: "Mar 5, 2026" },
  { id: "u3", name: "Kofi Asante Boateng", email: "k.boateng@navy.mil.gh", role: "student", organization: "Ghana Navy", status: "active", enrolledCourses: 2, joinedDate: "Feb 20, 2026" },
  { id: "u4", name: "Fatima Ibrahim", email: "f.ibrahim@nimasa.gov.ng", role: "student", organization: "NIMASA", status: "active", enrolledCourses: 1, joinedDate: "Apr 1, 2026" },
  { id: "u5", name: "Emmanuel Tetteh", email: "e.tetteh@tema-port.com", role: "student", organization: "Tema Port", status: "active", enrolledCourses: 1, joinedDate: "Mar 15, 2026" },
  { id: "u6", name: "Nana Agyeman", email: "n.agyeman@mofad.gov.gh", role: "student", organization: "Ministry of Fisheries", status: "active", enrolledCourses: 1, joinedDate: "Apr 10, 2026" },
  { id: "u7", name: "James Owusu", email: "j.owusu@ucc.edu.gh", role: "student", organization: "University of Cape Coast", status: "active", enrolledCourses: 1, joinedDate: "Feb 1, 2026" },
  { id: "u8", name: "Dr. Aisha Bello", email: "a.bello@nimasa.gov.ng", role: "student", organization: "NIMASA", status: "pending", enrolledCourses: 0, joinedDate: "Apr 25, 2026" },
  { id: "u9", name: "Prof. Jeffrey Landsman", email: "j.landsman@gogmi.org", role: "instructor", organization: "GoGMI", status: "active", enrolledCourses: 0, joinedDate: "Jan 1, 2026" },
  { id: "u10", name: "Lawrence Dogli", email: "l.dogli@gogmi.org.gh", role: "admin", organization: "GoGMI", status: "active", enrolledCourses: 0, joinedDate: "Jan 1, 2026" },
  { id: "u11", name: "Akua Konadu", email: "a.konadu@navy.mil.gh", role: "student", organization: "Ghana Navy", status: "suspended", enrolledCourses: 1, joinedDate: "Feb 15, 2026" },
];

const statusStyles: Record<string, string> = {
  active: "bg-green-50 text-green-700",
  suspended: "bg-red-50 text-red-600",
  pending: "bg-brand-amber-light text-brand-amber",
};

const roleStyles: Record<string, string> = {
  student: "bg-blue-50 text-brand-navy-muted",
  instructor: "bg-brand-teal-light text-brand-teal",
  admin: "bg-gray-100 text-gray-700",
};

export default function AdminUsersPage() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);

  const filtered = useMemo(() => {
    let result = [...users];
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(u => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.organization.toLowerCase().includes(q));
    }
    if (roleFilter !== "all") result = result.filter(u => u.role === roleFilter);
    if (statusFilter !== "all") result = result.filter(u => u.status === statusFilter);
    return result;
  }, [search, roleFilter, statusFilter]);

  return (
    <div>
      <div className="flex justify-between items-start mb-7">
        <div>
          <h1 className="text-[22px] font-semibold text-gray-800 mb-1">User Management</h1>
          <p className="text-[14px] text-gray-500">{users.length} users registered on the platform.</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-gray-900 text-white rounded-md px-4 py-2.5 text-[13px] font-medium cursor-pointer hover:bg-gray-800 transition-colors"
        >
          Create user
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-5">
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3.5 py-2 flex-1 max-w-sm">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-gray-400 shrink-0"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search users..." className="border-none outline-none bg-transparent text-[13.5px] text-gray-700 w-full placeholder:text-gray-400" />
        </div>
        <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)} className="bg-white border border-gray-200 rounded-md px-3 py-2 text-[13px] text-gray-600 outline-none cursor-pointer">
          <option value="all">All roles</option>
          <option value="student">Students</option>
          <option value="instructor">Instructors</option>
          <option value="admin">Admins</option>
        </select>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="bg-white border border-gray-200 rounded-md px-3 py-2 text-[13px] text-gray-600 outline-none cursor-pointer">
          <option value="all">All statuses</option>
          <option value="active">Active</option>
          <option value="pending">Pending</option>
          <option value="suspended">Suspended</option>
        </select>
        <span className="text-[13px] text-gray-400 ml-auto">{filtered.length} user{filtered.length !== 1 ? "s" : ""}</span>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left px-5 py-3 text-[12px] font-medium text-gray-500 uppercase tracking-wider">User</th>
              <th className="text-left px-5 py-3 text-[12px] font-medium text-gray-500 uppercase tracking-wider">Organisation</th>
              <th className="text-left px-5 py-3 text-[12px] font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th className="text-left px-5 py-3 text-[12px] font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="text-left px-5 py-3 text-[12px] font-medium text-gray-500 uppercase tracking-wider">Courses</th>
              <th className="text-left px-5 py-3 text-[12px] font-medium text-gray-500 uppercase tracking-wider">Joined</th>
              <th className="text-right px-5 py-3 text-[12px] font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(user => (
              <tr key={user.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-[11px] font-semibold text-gray-600">
                      {user.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                    </div>
                    <div>
                      <div className="text-[13px] font-medium text-gray-800">{user.name}</div>
                      <div className="text-[11.5px] text-gray-400">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3.5 text-[13px] text-gray-600">{user.organization}</td>
                <td className="px-5 py-3.5">
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded capitalize ${roleStyles[user.role]}`}>{user.role}</span>
                </td>
                <td className="px-5 py-3.5">
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded capitalize ${statusStyles[user.status]}`}>{user.status}</span>
                </td>
                <td className="px-5 py-3.5 text-[13px] text-gray-600">{user.enrolledCourses}</td>
                <td className="px-5 py-3.5 text-[13px] text-gray-500">{user.joinedDate}</td>
                <td className="px-5 py-3.5 text-right">
                  <button className="text-[12px] text-brand-teal font-medium hover:underline cursor-pointer">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Simple create user modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[100]" onClick={() => setShowCreateModal(false)}>
          <div className="bg-white rounded-lg w-full max-w-md p-6 shadow-xl" onClick={e => e.stopPropagation()}>
            <h2 className="text-[18px] font-semibold text-gray-800 mb-1">Create New User</h2>
            <p className="text-[13px] text-gray-500 mb-5">The user will receive login credentials via email.</p>
            <div className="flex flex-col gap-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[13px] font-medium text-gray-700 mb-1">First name</label>
                  <input type="text" className="w-full bg-white border border-gray-200 rounded-md px-3 py-2 text-[14px] text-gray-800 outline-none focus:border-brand-teal transition-colors" />
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-gray-700 mb-1">Last name</label>
                  <input type="text" className="w-full bg-white border border-gray-200 rounded-md px-3 py-2 text-[14px] text-gray-800 outline-none focus:border-brand-teal transition-colors" />
                </div>
              </div>
              <div>
                <label className="block text-[13px] font-medium text-gray-700 mb-1">Email</label>
                <input type="email" className="w-full bg-white border border-gray-200 rounded-md px-3 py-2 text-[14px] text-gray-800 outline-none focus:border-brand-teal transition-colors" />
              </div>
              <div>
                <label className="block text-[13px] font-medium text-gray-700 mb-1">Organisation</label>
                <input type="text" className="w-full bg-white border border-gray-200 rounded-md px-3 py-2 text-[14px] text-gray-800 outline-none focus:border-brand-teal transition-colors" />
              </div>
              <div>
                <label className="block text-[13px] font-medium text-gray-700 mb-1">Role</label>
                <select className="w-full bg-white border border-gray-200 rounded-md px-3 py-2 text-[14px] text-gray-800 outline-none focus:border-brand-teal transition-colors cursor-pointer">
                  <option value="student">Student</option>
                  <option value="instructor">Instructor</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowCreateModal(false)} className="flex-1 border border-gray-200 rounded-md py-2 text-[13px] font-medium text-gray-600 cursor-pointer hover:bg-gray-50 transition-colors">Cancel</button>
                <button onClick={() => setShowCreateModal(false)} className="flex-1 bg-gray-900 text-white rounded-md py-2 text-[13px] font-medium cursor-pointer hover:bg-gray-800 transition-colors">Create user</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
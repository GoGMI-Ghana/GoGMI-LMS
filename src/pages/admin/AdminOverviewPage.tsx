import { useNavigate } from "react-router-dom";
import { useApi } from "../../hooks/useApi";
import { LoadingSpinner } from "../../components/common";

interface Overview {
  stats: { totalUsers: number; totalStudents: number; totalInstructors: number; pendingInstructors: number; totalCourses: number; totalEnrollments: number; activeEnrollments: number; completedEnrollments: number; totalSubmissions: number; pendingSubmissions: number; };
  recentUsers: { id: string; firstName: string; lastName: string; email: string; role: string; status: string; createdAt: string }[];
  recentEnrollments: { student: string; course: string; enrolledAt: string }[];
}

export default function AdminOverviewPage() {
  const navigate = useNavigate();
  const { data, isLoading } = useApi<Overview>("/admin/overview");
  if (isLoading) return <LoadingSpinner />;
  const s = data?.stats;
  const statusColors: Record<string, string> = { ACTIVE: "bg-green-50 text-green-700", PENDING: "bg-amber-50 text-amber-700", SUSPENDED: "bg-red-50 text-red-600" };
  const roleColors: Record<string, string> = { ADMIN: "bg-gray-800 text-white", INSTRUCTOR: "bg-teal-600 text-white", STUDENT: "bg-gray-100 text-gray-600" };

  return (
    <div>
      <div className="mb-7"><h1 className="text-[22px] font-semibold text-gray-800 mb-1">Overview</h1><p className="text-[14px] text-gray-500">Platform dashboard</p></div>

      <div className="grid grid-cols-4 gap-4 mb-7">
        {[
          { label: "Total Users", value: s?.totalUsers || 0, sub: s?.totalStudents + " students, " + s?.totalInstructors + " instructors", color: "border-l-blue-500" },
          { label: "Enrollments", value: s?.totalEnrollments || 0, sub: s?.activeEnrollments + " active, " + s?.completedEnrollments + " completed", color: "border-l-green-500" },
          { label: "Courses", value: s?.totalCourses || 0, sub: "Published courses", color: "border-l-purple-500" },
          { label: "Pending", value: (s?.pendingInstructors || 0) + (s?.pendingSubmissions || 0), sub: s?.pendingInstructors + " instructors, " + s?.pendingSubmissions + " submissions", color: "border-l-amber-500" },
        ].map(c => (
          <div key={c.label} className={"bg-white border border-gray-200 border-l-4 " + c.color + " rounded-lg px-5 py-5"}>
            <div className="text-[12px] font-medium text-gray-500 uppercase tracking-wider mb-2">{c.label}</div>
            <div className="text-[28px] font-semibold text-gray-800 leading-none mb-1">{c.value}</div>
            <div className="text-[12px] text-gray-400">{c.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg">
          <div className="flex justify-between items-center px-5 py-4 border-b border-gray-100">
            <h2 className="text-[15px] font-semibold text-gray-800">Recent Users</h2>
            <button onClick={() => navigate("/admin/users")} className="text-[13px] text-teal-600 font-medium hover:underline cursor-pointer">View all</button>
          </div>
          <div className="divide-y divide-gray-50">
            {(data?.recentUsers || []).map(u => (
              <div key={u.id} className="px-5 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-[11px] font-semibold text-gray-600">{(u.firstName[0] + u.lastName[0]).toUpperCase()}</div>
                  <div><div className="text-[13px] font-medium text-gray-800">{u.firstName} {u.lastName}</div><div className="text-[11px] text-gray-400">{u.email}</div></div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={"text-[10px] font-semibold px-2 py-0.5 rounded " + (roleColors[u.role] || "bg-gray-100 text-gray-600")}>{u.role}</span>
                  <span className={"text-[10px] font-semibold px-2 py-0.5 rounded " + (statusColors[u.status] || "bg-gray-100 text-gray-600")}>{u.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg">
          <div className="flex justify-between items-center px-5 py-4 border-b border-gray-100">
            <h2 className="text-[15px] font-semibold text-gray-800">Recent Enrollments</h2>
            <button onClick={() => navigate("/admin/enrollments")} className="text-[13px] text-teal-600 font-medium hover:underline cursor-pointer">View all</button>
          </div>
          <div className="divide-y divide-gray-50">
            {(data?.recentEnrollments || []).map((e, i) => (
              <div key={i} className="px-5 py-3">
                <div className="text-[13px] text-gray-800"><span className="font-medium">{e.student}</span> enrolled in <span className="font-medium">{e.course}</span></div>
                <div className="text-[11px] text-gray-400 mt-0.5">{new Date(e.enrolledAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</div>
              </div>
            ))}
            {(data?.recentEnrollments || []).length === 0 && <div className="px-5 py-8 text-center text-[13px] text-gray-400">No enrollments yet</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
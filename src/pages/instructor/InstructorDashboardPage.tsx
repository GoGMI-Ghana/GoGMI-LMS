import { useAuth } from "../../contexts/AuthContext";
import { useApi } from "../../hooks/useApi";
import { LoadingSpinner } from "../../components/common";
import { useNavigate } from "react-router-dom";

interface DashboardData {
  stats: { totalCourses: number; totalStudents: number; pendingGrades: number; avgProgress: number; activeLearners: number };
  courses: { id: string; title: string; thumbnailCode: string; students: number }[];
  pendingSubmissions: { id: string; student: string; email: string; assignment: string; type: string; course: string; submittedAt: string }[];
  upcomingAssessments: { id: string; title: string; type: string; dueDate: string; course: string }[];
}

export default function InstructorDashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data, isLoading } = useApi<DashboardData>("/instructor/dashboard");

  if (!user) return null;
  if (isLoading) return <LoadingSpinner />;

  const stats = data?.stats;
  const pending = data?.pendingSubmissions || [];
  const upcoming = data?.upcomingAssessments || [];

  return (
    <div>
      <div className="bg-[#1a2332] rounded-xl p-7 mb-7 relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-[24px] font-semibold text-white mb-1">Welcome, {user.firstName}</h1>
          <p className="text-white/60 text-[14px]">
            {pending.length > 0
              ? "You have " + pending.length + " submission" + (pending.length !== 1 ? "s" : "") + " to review" + (upcoming.length > 0 ? " and " + upcoming.length + " upcoming assessment" + (upcoming.length !== 1 ? "s" : "") : "") + "."
              : "All caught up. No pending submissions."}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-4 mb-7">
        {[
          { label: "Courses", value: stats?.totalCourses || 0, sub: "Active courses" },
          { label: "Students", value: stats?.totalStudents || 0, sub: "Total enrolled" },
          { label: "Pending Grades", value: stats?.pendingGrades || 0, sub: "To review" },
          { label: "Active Learners", value: stats?.activeLearners || 0, sub: "This week" },
          { label: "Avg. Progress", value: (stats?.avgProgress || 0) + "%", sub: "Across courses" },
        ].map(s => (
          <div key={s.label} className="bg-white border border-gray-200 rounded-lg px-5 py-5">
            <div className="text-[12px] font-medium text-gray-500 uppercase tracking-wider mb-2">{s.label}</div>
            <div className="text-[28px] font-semibold text-gray-800 leading-none">{s.value}</div>
            <div className="text-[12.5px] text-gray-500 mt-1.5">{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-[1fr_380px] gap-6">
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-[15px] font-semibold text-gray-800">Pending Submissions</h2>
            <button onClick={() => navigate("/instructor/grading")} className="text-[13px] font-medium text-brand-teal hover:underline cursor-pointer">View all</button>
          </div>
          {pending.length > 0 ? (
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead><tr className="border-b border-gray-100">
                  <th className="text-left px-5 py-3 text-[12px] font-medium text-gray-500 uppercase tracking-wider">Student</th>
                  <th className="text-left px-5 py-3 text-[12px] font-medium text-gray-500 uppercase tracking-wider">Assignment</th>
                  <th className="text-left px-5 py-3 text-[12px] font-medium text-gray-500 uppercase tracking-wider">Submitted</th>
                  <th className="text-right px-5 py-3 text-[12px] font-medium text-gray-500 uppercase tracking-wider">Action</th>
                </tr></thead>
                <tbody>{pending.map(s => (
                  <tr key={s.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3.5"><div className="text-[13px] font-medium text-gray-800">{s.student}</div><div className="text-[11.5px] text-gray-400">{s.course}</div></td>
                    <td className="px-5 py-3.5 text-[13px] text-gray-600">{s.assignment}</td>
                    <td className="px-5 py-3.5 text-[13px] text-gray-500">{s.submittedAt ? new Date(s.submittedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "—"}</td>
                    <td className="px-5 py-3.5 text-right"><button onClick={() => navigate("/instructor/grading")} className="text-[12px] text-brand-teal font-medium hover:underline cursor-pointer">Grade</button></td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-lg py-12 flex flex-col items-center">
              <p className="text-[14px] text-gray-500">No pending submissions.</p>
            </div>
          )}
        </div>

        <div>
          <h2 className="text-[15px] font-semibold text-gray-800 mb-4">Upcoming Assessments</h2>
          {upcoming.length > 0 ? (
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <div className="flex flex-col">{upcoming.map((a, i) => (
                <div key={a.id} className={`py-3 ${i > 0 ? "border-t border-gray-100" : ""}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${a.type === "QUIZ" ? "bg-blue-50 text-blue-700" : a.type === "EXAM" ? "bg-red-50 text-red-600" : "bg-brand-amber-light text-brand-amber"}`}>{a.type}</span>
                  </div>
                  <div className="text-[13px] font-medium text-gray-800">{a.title}</div>
                  <div className="text-[12px] text-gray-500 mt-0.5">{a.course} · Due {new Date(a.dueDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</div>
                </div>
              ))}</div>
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-lg py-10 flex items-center justify-center">
              <p className="text-[13px] text-gray-400">No upcoming assessments.</p>
            </div>
          )}

          <h2 className="text-[15px] font-semibold text-gray-800 mb-4 mt-6">My Courses</h2>
          <div className="flex flex-col gap-2">
            {(data?.courses || []).map(c => (
              <div key={c.id} onClick={() => navigate("/instructor/courses/" + c.id)} className="bg-white border border-gray-200 rounded-lg p-4 flex items-center gap-3 cursor-pointer hover:border-gray-300 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-brand-navy flex items-center justify-center text-[12px] font-bold text-white/70 shrink-0">{c.thumbnailCode}</div>
                <div><div className="text-[13px] font-medium text-gray-800">{c.title}</div><div className="text-[11.5px] text-gray-500">{c.students} students</div></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
import { useAuth } from "../../contexts/AuthContext";

export default function InstructorDashboardPage() {
  const { user } = useAuth();
  if (!user) return null;

  const stats = [
    { label: "Courses", value: 1, sub: "Active courses" },
    { label: "Students", value: 24, sub: "Total enrolled" },
    { label: "Pending Grades", value: 3, sub: "Submissions to review" },
    { label: "Avg. Completion", value: "32%", sub: "Across courses" },
  ];

  const upcomingSessions = [
    { title: "Module 3: Strategy Development Process", date: "May 14, 2026", time: "10:00 AM GMT", type: "Live" },
    { title: "Module 4: Interagency Coordination", date: "May 15, 2026", time: "10:00 AM GMT", type: "Live" },
    { title: "SWOT Activity Deadline", date: "May 16, 2026", time: "11:59 PM GMT", type: "Assignment" },
  ];

  const pendingSubmissions = [
    { student: "Babiker Alayas Osman", assignment: "SWOT Analysis Activity", submitted: "May 10, 2026", course: "Maritime Governance" },
    { student: "Atari Emmanuel Afri", assignment: "SWOT Analysis Activity", submitted: "May 11, 2026", course: "Maritime Governance" },
    { student: "Ama Serwaa Mensah", assignment: "Vision Statement Draft", submitted: "May 11, 2026", course: "Maritime Governance" },
  ];

  return (
    <div>
      <div className="bg-[#1a2332] rounded-xl p-7 mb-7 relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-[24px] font-semibold text-white mb-1">Welcome, {user.firstName}</h1>
          <p className="text-white/60 text-[14px]">You have {pendingSubmissions.length} submissions to review and {upcomingSessions.length} upcoming sessions this week.</p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-7">
        {stats.map(s => (
          <div key={s.label} className="bg-white border border-gray-200 rounded-lg px-5 py-5">
            <div className="text-[12px] font-medium text-gray-500 uppercase tracking-wider mb-2">{s.label}</div>
            <div className="text-[28px] font-semibold text-gray-800 leading-none">{s.value}</div>
            <div className="text-[12.5px] text-gray-500 mt-1.5">{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-[1fr_380px] gap-6">
        <div>
          <h2 className="text-[15px] font-semibold text-gray-800 mb-4">Pending Submissions</h2>
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left px-5 py-3 text-[12px] font-medium text-gray-500 uppercase tracking-wider">Student</th>
                  <th className="text-left px-5 py-3 text-[12px] font-medium text-gray-500 uppercase tracking-wider">Assignment</th>
                  <th className="text-left px-5 py-3 text-[12px] font-medium text-gray-500 uppercase tracking-wider">Submitted</th>
                  <th className="text-right px-5 py-3 text-[12px] font-medium text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody>
                {pendingSubmissions.map((s, i) => (
                  <tr key={i} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3.5 text-[13px] font-medium text-gray-800">{s.student}</td>
                    <td className="px-5 py-3.5 text-[13px] text-gray-600">{s.assignment}</td>
                    <td className="px-5 py-3.5 text-[13px] text-gray-500">{s.submitted}</td>
                    <td className="px-5 py-3.5 text-right">
                      <button className="text-[12px] text-brand-teal font-medium hover:underline cursor-pointer">Grade</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h2 className="text-[15px] font-semibold text-gray-800 mb-4">Upcoming Sessions</h2>
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <div className="flex flex-col">
              {upcomingSessions.map((s, i) => (
                <div key={i} className={`py-3 ${i > 0 ? "border-t border-gray-100" : ""}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${s.type === "Live" ? "bg-green-50 text-green-700" : "bg-brand-amber-light text-brand-amber"}`}>{s.type}</span>
                  </div>
                  <div className="text-[13px] font-medium text-gray-800">{s.title}</div>
                  <div className="text-[12px] text-gray-500 mt-0.5">{s.date} · {s.time}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
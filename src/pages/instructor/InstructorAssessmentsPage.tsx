export default function InstructorAssessmentsPage() {
  const assessments = [
    { title: "SWOT Analysis Activity", type: "Assignment", course: "Maritime Governance", dueDate: "May 16, 2026", submissions: 2, total: 24, avgScore: null, status: "active" },
    { title: "Vision Statement Draft", type: "Assignment", course: "Maritime Governance", dueDate: "May 20, 2026", submissions: 1, total: 24, avgScore: null, status: "active" },
    { title: "Module 1 Quiz", type: "Quiz", course: "Maritime Governance", dueDate: "May 12, 2026", submissions: 18, total: 24, avgScore: 78, status: "closed" },
    { title: "Stakeholder Analysis Exercise", type: "Assignment", course: "Maritime Governance", dueDate: "May 22, 2026", submissions: 0, total: 24, avgScore: null, status: "upcoming" },
    { title: "Case Study Group Report", type: "Assignment", course: "Maritime Governance", dueDate: "May 28, 2026", submissions: 0, total: 24, avgScore: null, status: "upcoming" },
    { title: "Final Course Assessment", type: "Exam", course: "Maritime Governance", dueDate: "May 30, 2026", submissions: 0, total: 24, avgScore: null, status: "upcoming" },
  ];

  const statusColors: Record<string, string> = { active: "bg-green-50 text-green-700", closed: "bg-gray-100 text-gray-600", upcoming: "bg-blue-50 text-blue-600" };
  const typeColors: Record<string, string> = { Assignment: "bg-brand-amber-light text-brand-amber", Quiz: "bg-blue-50 text-blue-700", Exam: "bg-red-50 text-red-600" };

  return (
    <div>
      <div className="flex justify-between items-start mb-7">
        <div><h1 className="text-[22px] font-semibold text-gray-800 mb-1">Assessments</h1><p className="text-[14px] text-gray-500">Manage assignments, quizzes, and exams across your courses.</p></div>
        <button className="bg-[#1a2332] text-white rounded-md px-4 py-2.5 text-[13px] font-medium cursor-pointer hover:bg-[#243044] transition-colors">Create Assessment</button>
      </div>
      <div className="flex flex-col gap-3">
        {assessments.map((a, i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-lg p-5 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${typeColors[a.type]}`}>{a.type}</span>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${statusColors[a.status]}`}>{a.status}</span>
              </div>
              <div className="text-[14px] font-medium text-gray-800">{a.title}</div>
              <div className="text-[12px] text-gray-500 mt-0.5">Due: {a.dueDate} · {a.submissions}/{a.total} submitted{a.avgScore !== null ? " · Avg: " + a.avgScore + "%" : ""}</div>
            </div>
            <button className="border border-gray-200 rounded-md px-3.5 py-1.5 text-[12.5px] font-medium text-gray-600 cursor-pointer hover:bg-gray-50 transition-colors">Manage</button>
          </div>
        ))}
      </div>
    </div>
  );
}
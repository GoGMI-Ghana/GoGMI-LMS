import { useState } from "react";

const submissions = [
  { id: "s1", student: "Babiker Alayas Osman", assignment: "SWOT Analysis Activity", submitted: "May 10, 2026", status: "pending" as const, score: null, course: "Maritime Governance" },
  { id: "s2", student: "Atari Emmanuel Afri", assignment: "SWOT Analysis Activity", submitted: "May 11, 2026", status: "pending" as const, score: null, course: "Maritime Governance" },
  { id: "s3", student: "Ama Serwaa Mensah", assignment: "Vision Statement Draft", submitted: "May 11, 2026", status: "pending" as const, score: null, course: "Maritime Governance" },
  { id: "s4", student: "Kofi Asante Boateng", assignment: "Module 1 Quiz", submitted: "May 8, 2026", status: "graded" as const, score: 85, course: "Maritime Governance" },
  { id: "s5", student: "Ama Serwaa Mensah", assignment: "Module 1 Quiz", submitted: "May 7, 2026", status: "graded" as const, score: 92, course: "Maritime Governance" },
];

const statusStyles: Record<string, string> = { pending: "bg-brand-amber-light text-brand-amber", graded: "bg-green-50 text-green-700" };

export default function InstructorGradingPage() {
  const [filter, setFilter] = useState<"all" | "pending" | "graded">("all");
  const [showGradeModal, setShowGradeModal] = useState<string | null>(null);

  const filtered = filter === "all" ? submissions : submissions.filter(s => s.status === filter);
  const pendingCount = submissions.filter(s => s.status === "pending").length;

  return (
    <div>
      <div className="mb-7">
        <h1 className="text-[22px] font-semibold text-gray-800 mb-1">Grading</h1>
        <p className="text-[14px] text-gray-500">{pendingCount} submission{pendingCount !== 1 ? "s" : ""} pending review.</p>
      </div>

      <div className="flex gap-1.5 mb-5">
        {(["all", "pending", "graded"] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-md text-[13px] font-medium transition-colors cursor-pointer capitalize ${filter === f ? "bg-[#1a2332] text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"}`}>{f === "all" ? "All" : f}</button>
        ))}
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead><tr className="border-b border-gray-100">
            <th className="text-left px-5 py-3 text-[12px] font-medium text-gray-500 uppercase tracking-wider">Student</th>
            <th className="text-left px-5 py-3 text-[12px] font-medium text-gray-500 uppercase tracking-wider">Assignment</th>
            <th className="text-left px-5 py-3 text-[12px] font-medium text-gray-500 uppercase tracking-wider">Submitted</th>
            <th className="text-left px-5 py-3 text-[12px] font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="text-left px-5 py-3 text-[12px] font-medium text-gray-500 uppercase tracking-wider">Score</th>
            <th className="text-right px-5 py-3 text-[12px] font-medium text-gray-500 uppercase tracking-wider">Action</th>
          </tr></thead>
          <tbody>{filtered.map(s => (
            <tr key={s.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
              <td className="px-5 py-3.5 text-[13px] font-medium text-gray-800">{s.student}</td>
              <td className="px-5 py-3.5 text-[13px] text-gray-600">{s.assignment}</td>
              <td className="px-5 py-3.5 text-[13px] text-gray-500">{s.submitted}</td>
              <td className="px-5 py-3.5"><span className={`text-[11px] font-semibold px-2 py-0.5 rounded capitalize ${statusStyles[s.status]}`}>{s.status}</span></td>
              <td className="px-5 py-3.5 text-[13px] text-gray-700 font-medium">{s.score !== null ? s.score + "/100" : "—"}</td>
              <td className="px-5 py-3.5 text-right">
                <button onClick={() => setShowGradeModal(s.id)} className="text-[12px] text-brand-teal font-medium hover:underline cursor-pointer">{s.status === "pending" ? "Grade" : "Review"}</button>
              </td>
            </tr>
          ))}</tbody>
        </table>
      </div>

      {showGradeModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[100]" onClick={() => setShowGradeModal(null)}>
          <div className="bg-white rounded-lg w-full max-w-md p-6 shadow-xl" onClick={e => e.stopPropagation()}>
            <h2 className="text-[18px] font-semibold text-gray-800 mb-5">Grade Submission</h2>
            <div className="flex flex-col gap-3.5">
              <div><label className="block text-[13px] font-medium text-gray-700 mb-1">Score (out of 100)</label><input type="number" max={100} min={0} className="w-full bg-white border border-gray-200 rounded-md px-3 py-2 text-[14px] text-gray-800 outline-none focus:border-brand-teal transition-colors" /></div>
              <div><label className="block text-[13px] font-medium text-gray-700 mb-1">Feedback</label><textarea rows={4} placeholder="Provide feedback to the student..." className="w-full bg-white border border-gray-200 rounded-md px-3 py-2 text-[14px] text-gray-800 outline-none focus:border-brand-teal transition-colors resize-none" /></div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowGradeModal(null)} className="flex-1 border border-gray-200 rounded-md py-2 text-[13px] font-medium text-gray-600 cursor-pointer hover:bg-gray-50 transition-colors">Cancel</button>
                <button onClick={() => setShowGradeModal(null)} className="flex-1 bg-[#1a2332] text-white rounded-md py-2 text-[13px] font-medium cursor-pointer hover:bg-[#243044] transition-colors">Submit Grade</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
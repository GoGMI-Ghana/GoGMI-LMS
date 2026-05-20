import { useNavigate } from "react-router-dom";
import { useApi } from "../../hooks/useApi";
import { LoadingSpinner } from "../../components/common";

interface Assessment { id: string; title: string; type: string; dueDate: string | null; maxScore: number; course: string; courseId: string; status: string; score: number | null; submittedAt: string | null; }

export default function AssessmentsPage() {
  const navigate = useNavigate();
  const { data, isLoading } = useApi<Assessment[]>("/courses/student/assessments");
  if (isLoading) return <LoadingSpinner />;

  const upcoming = (data || []).filter(a => a.status === "PENDING" || a.status === "NOT_SUBMITTED");
  const completed = (data || []).filter(a => a.status === "GRADED" || a.status === "SUBMITTED");
  const typeColors: Record<string, string> = { QUIZ: "bg-blue-50 text-blue-700", ASSIGNMENT: "bg-amber-50 text-amber-700", EXAM: "bg-red-50 text-red-600" };

  return (
    <div>
      <div className="mb-7"><h1 className="text-[22px] font-semibold text-gray-800 mb-1">Assessments</h1><p className="text-[14px] text-gray-500">Your assignments, quizzes, and exams.</p></div>

      {upcoming.length > 0 && (
        <div className="mb-6">
          <h2 className="text-[15px] font-semibold text-gray-800 mb-3">Upcoming</h2>
          <div className="flex flex-col gap-3">{upcoming.map(a => (
            <div key={a.id} className="bg-white border border-gray-200 rounded-lg p-5 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1"><span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${typeColors[a.type] || "bg-gray-100 text-gray-600"}`}>{a.type}</span></div>
                <div className="text-[14px] font-medium text-gray-800">{a.title}</div>
                <div className="text-[12px] text-gray-500 mt-0.5">{a.course} · {a.dueDate ? "Due " + new Date(a.dueDate).toLocaleDateString("en-GB", { day: "numeric", month: "short" }) : "No due date"} · {a.maxScore} points</div>
              </div>
              <button onClick={() => navigate("/courses/" + a.courseId + "/content")} className="bg-brand-navy text-white rounded-md px-4 py-2 text-[12px] font-medium cursor-pointer hover:bg-brand-navy-light">View</button>
            </div>
          ))}</div>
        </div>
      )}

      {completed.length > 0 && (
        <div className="mb-6">
          <h2 className="text-[15px] font-semibold text-gray-800 mb-3">Completed</h2>
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full"><thead><tr className="border-b border-gray-100">
              <th className="text-left px-5 py-3 text-[12px] font-medium text-gray-500 uppercase">Assessment</th>
              <th className="text-left px-5 py-3 text-[12px] font-medium text-gray-500 uppercase">Course</th>
              <th className="text-left px-5 py-3 text-[12px] font-medium text-gray-500 uppercase">Type</th>
              <th className="text-right px-5 py-3 text-[12px] font-medium text-gray-500 uppercase">Score</th>
              <th className="text-right px-5 py-3 text-[12px] font-medium text-gray-500 uppercase">Status</th>
            </tr></thead><tbody>{completed.map(a => (
              <tr key={a.id} className="border-b border-gray-50 last:border-0">
                <td className="px-5 py-3 text-[13px] font-medium text-gray-800">{a.title}</td>
                <td className="px-5 py-3 text-[13px] text-gray-600">{a.course}</td>
                <td className="px-5 py-3"><span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${typeColors[a.type] || "bg-gray-100 text-gray-600"}`}>{a.type}</span></td>
                <td className="px-5 py-3 text-right"><span className={`text-[13px] font-semibold ${a.score !== null && a.score >= 70 ? "text-green-600" : a.score !== null && a.score >= 50 ? "text-amber-600" : "text-red-600"}`}>{a.score !== null ? a.score + "%" : "—"}</span></td>
                <td className="px-5 py-3 text-right"><span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${a.status === "GRADED" ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"}`}>{a.status}</span></td>
              </tr>
            ))}</tbody></table>
          </div>
        </div>
      )}

      {(data || []).length === 0 && (
        <div className="bg-white border border-gray-200 rounded-lg py-16 flex flex-col items-center">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-300 mb-3"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
          <h3 className="text-[15px] font-semibold text-gray-800 mb-1">No assessments yet</h3>
          <p className="text-[13px] text-gray-500">Assessments will appear here when your facilitators create them.</p>
        </div>
      )}
    </div>
  );
}
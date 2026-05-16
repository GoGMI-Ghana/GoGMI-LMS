import { useState } from "react";
import { useApi } from "../../hooks/useApi";
import { api } from "../../services/api";
import { LoadingSpinner } from "../../components/common";

interface Submission {
  id: string; student: string; studentEmail: string; assignment: string; type: string;
  course: string; maxScore: number; status: string; score: number | null;
  feedback: string | null; submittedAt: string | null; gradedAt: string | null;
}

export default function InstructorGradingPage() {
  const { data: submissions, isLoading, refetch } = useApi<Submission[]>("/instructor/submissions");
  const [filter, setFilter] = useState<"all" | "SUBMITTED" | "GRADED">("all");
  const [gradeModal, setGradeModal] = useState<Submission | null>(null);
  const [score, setScore] = useState("");
  const [feedback, setFeedback] = useState("");
  const [grading, setGrading] = useState(false);
  const [gradeError, setGradeError] = useState("");

  if (isLoading) return <LoadingSpinner />;

  const filtered = filter === "all" ? (submissions || []) : (submissions || []).filter(s => s.status === filter);
  const pendingCount = (submissions || []).filter(s => s.status === "SUBMITTED").length;

  const handleGrade = async () => {
    if (!gradeModal) return;
    setGradeError("");
    const scoreNum = parseInt(score);
    if (isNaN(scoreNum) || scoreNum < 0 || scoreNum > gradeModal.maxScore) { setGradeError("Score must be between 0 and " + gradeModal.maxScore); return; }
    setGrading(true);
    try {
      await api.patch("/instructor/submissions/" + gradeModal.id + "/grade", { score: scoreNum, feedback: feedback || undefined });
      setGradeModal(null); setScore(""); setFeedback("");
      refetch();
    } catch (err) { setGradeError(err instanceof Error ? err.message : "Failed to grade"); }
    finally { setGrading(false); }
  };

  return (
    <div>
      <div className="mb-7"><h1 className="text-[22px] font-semibold text-gray-800 mb-1">Grading</h1><p className="text-[14px] text-gray-500">{pendingCount} submission{pendingCount !== 1 ? "s" : ""} pending review.</p></div>

      <div className="flex gap-1.5 mb-5">
        {([["all", "All"], ["SUBMITTED", "Pending"], ["GRADED", "Graded"]] as const).map(([val, label]) => (
          <button key={val} onClick={() => setFilter(val)} className={`px-3 py-1.5 rounded-md text-[13px] font-medium transition-colors cursor-pointer ${filter === val ? "bg-[#1a2332] text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"}`}>{label}</button>
        ))}
      </div>

      {filtered.length > 0 ? (
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
                <td className="px-5 py-3.5"><div className="text-[13px] font-medium text-gray-800">{s.student}</div><div className="text-[11.5px] text-gray-400">{s.course}</div></td>
                <td className="px-5 py-3.5 text-[13px] text-gray-600">{s.assignment}</td>
                <td className="px-5 py-3.5 text-[13px] text-gray-500">{s.submittedAt ? new Date(s.submittedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" }) : "—"}</td>
                <td className="px-5 py-3.5"><span className={`text-[11px] font-semibold px-2 py-0.5 rounded capitalize ${s.status === "SUBMITTED" ? "bg-brand-amber-light text-brand-amber" : s.status === "GRADED" ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-600"}`}>{s.status.toLowerCase()}</span></td>
                <td className="px-5 py-3.5 text-[13px] font-medium text-gray-700">{s.score !== null ? s.score + "/" + s.maxScore : "—"}</td>
                <td className="px-5 py-3.5 text-right"><button onClick={() => { setGradeModal(s); setScore(s.score !== null ? String(s.score) : ""); setFeedback(s.feedback || ""); }} className="text-[12px] text-brand-teal font-medium hover:underline cursor-pointer">{s.status === "SUBMITTED" ? "Grade" : "Review"}</button></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg py-12 flex items-center justify-center">
          <p className="text-[14px] text-gray-500">No submissions found.</p>
        </div>
      )}

      {gradeModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[100]" onClick={() => setGradeModal(null)}>
          <div className="bg-white rounded-lg w-full max-w-md p-6 shadow-xl" onClick={e => e.stopPropagation()}>
            <h2 className="text-[18px] font-semibold text-gray-800 mb-1">Grade Submission</h2>
            <p className="text-[13px] text-gray-500 mb-5">{gradeModal.student} — {gradeModal.assignment}</p>
            {gradeError && <div className="bg-red-50 border border-red-200 rounded-md px-4 py-3 mb-4"><p className="text-[13px] text-red-700">{gradeError}</p></div>}
            <div className="flex flex-col gap-3.5">
              <div><label className="block text-[13px] font-medium text-gray-700 mb-1">Score (out of {gradeModal.maxScore})</label><input type="number" max={gradeModal.maxScore} min={0} value={score} onChange={e => setScore(e.target.value)} className="w-full bg-white border border-gray-200 rounded-md px-3 py-2 text-[14px] text-gray-800 outline-none focus:border-brand-teal transition-colors" /></div>
              <div><label className="block text-[13px] font-medium text-gray-700 mb-1">Feedback</label><textarea rows={4} value={feedback} onChange={e => setFeedback(e.target.value)} placeholder="Provide feedback..." className="w-full bg-white border border-gray-200 rounded-md px-3 py-2 text-[14px] text-gray-800 outline-none focus:border-brand-teal transition-colors resize-none" /></div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setGradeModal(null)} className="flex-1 border border-gray-200 rounded-md py-2 text-[13px] font-medium text-gray-600 cursor-pointer hover:bg-gray-50 transition-colors">Cancel</button>
                <button onClick={handleGrade} disabled={grading} className="flex-1 bg-[#1a2332] text-white rounded-md py-2 text-[13px] font-medium cursor-pointer hover:bg-[#243044] transition-colors">{grading ? "Saving..." : "Submit Grade"}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
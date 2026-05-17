import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApi } from "../../hooks/useApi";
import { api } from "../../services/api";
import { LoadingSpinner } from "../../components/common";

interface Course { id: string; title: string; assessments: { id: string; title: string; type: string; dueDate: string | null; maxScore: number; submissions: number; totalStudents: number; avgScore: number | null; pendingCount: number; }[]; }

export default function InstructorAssessmentsPage() {
  const navigate = useNavigate();
  const { data: courses, isLoading, refetch } = useApi<Course[]>("/instructor/courses");

  const [showCreate, setShowCreate] = useState(false);
  const [courseId, setCourseId] = useState("");
  const [title, setTitle] = useState("");
  const [type, setType] = useState("ASSIGNMENT");
  const [dueDate, setDueDate] = useState("");
  const [maxScore, setMaxScore] = useState(100);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  if (isLoading) return <LoadingSpinner />;

  // Flatten all assessments across courses
  const allAssessments = (courses || []).flatMap(c =>
    (c.assessments || []).map(a => ({ ...a, courseTitle: c.title, courseId: c.id }))
  );

  const handleCreate = async () => {
    setError("");
    if (!courseId || !title.trim()) { setError("Course and title are required."); return; }
    setCreating(true);
    try {
      await api.post("/instructor/assessments", { courseId, title, type, dueDate: dueDate || undefined, maxScore });
      setShowCreate(false); setTitle(""); setType("ASSIGNMENT"); setDueDate(""); setMaxScore(100); setCourseId("");
      setSuccessMsg("Assessment created"); setTimeout(() => setSuccessMsg(""), 3000);
      refetch();
    } catch (err) { setError(err instanceof Error ? err.message : "Failed"); }
    finally { setCreating(false); }
  };

  const statusColors: Record<string, string> = { ASSIGNMENT: "bg-brand-amber-light text-brand-amber", QUIZ: "bg-blue-50 text-blue-700", EXAM: "bg-red-50 text-red-600" };

  return (
    <div>
      <div className="flex justify-between items-start mb-7">
        <div><h1 className="text-[22px] font-semibold text-gray-800 mb-1">Assessments</h1><p className="text-[14px] text-gray-500">Manage assignments, quizzes, and exams across your courses.</p></div>
        <button onClick={() => setShowCreate(true)} className="bg-[#1a2332] text-white rounded-md px-4 py-2.5 text-[13px] font-medium cursor-pointer hover:bg-[#243044] transition-colors">Create Assessment</button>
      </div>

      {successMsg && <div className="bg-green-50 border border-green-200 rounded-md px-4 py-3 mb-4"><p className="text-[13px] text-green-700">{successMsg}</p></div>}

      {allAssessments.length > 0 ? (
        <div className="flex flex-col gap-3">
          {allAssessments.map(a => {
            const isPast = a.dueDate && new Date(a.dueDate) < new Date();
            return (
              <div key={a.id} className="bg-white border border-gray-200 rounded-lg p-5 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${statusColors[a.type] || "bg-gray-100 text-gray-600"}`}>{a.type}</span>
                    {isPast && <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-gray-100 text-gray-600">Closed</span>}
                    {a.pendingCount > 0 && <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-brand-amber-light text-brand-amber">{a.pendingCount} to grade</span>}
                  </div>
                  <div className="text-[14px] font-medium text-gray-800">{a.title}</div>
                  <div className="text-[12px] text-gray-500 mt-0.5">
                    {a.courseTitle} · {a.dueDate ? "Due " + new Date(a.dueDate).toLocaleDateString("en-GB", { day: "numeric", month: "short" }) : "No due date"}
                    {" · "}{a.submissions}/{a.totalStudents} submitted
                    {a.avgScore !== null && " · Avg: " + a.avgScore + "%"}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => navigate("/instructor/assessments/" + a.id + "/questions")} className="border border-gray-200 rounded-md px-3.5 py-1.5 text-[12.5px] font-medium text-gray-600 cursor-pointer hover:bg-gray-50 transition-colors">Questions</button>
                  <button onClick={() => navigate("/instructor/grading")} className="border border-gray-200 rounded-md px-3.5 py-1.5 text-[12.5px] font-medium text-gray-600 cursor-pointer hover:bg-gray-50 transition-colors">Grade</button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg py-16 flex flex-col items-center">
          <h3 className="text-[15px] font-semibold text-gray-800 mb-1">No assessments yet</h3>
          <p className="text-[13px] text-gray-500 mb-4">Create your first assessment.</p>
          <button onClick={() => setShowCreate(true)} className="bg-[#1a2332] text-white rounded-md px-5 py-2 text-[13px] font-medium cursor-pointer">Create Assessment</button>
        </div>
      )}

      {showCreate && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[100]" onClick={() => setShowCreate(false)}>
          <div className="bg-white rounded-lg w-full max-w-md p-6 shadow-xl" onClick={e => e.stopPropagation()}>
            <h2 className="text-[18px] font-semibold text-gray-800 mb-5">Create Assessment</h2>
            {error && <div className="bg-red-50 border border-red-200 rounded-md px-4 py-3 mb-4"><p className="text-[13px] text-red-700">{error}</p></div>}
            <div className="flex flex-col gap-3.5">
              <div><label className="block text-[13px] font-medium text-gray-700 mb-1">Course</label><select value={courseId} onChange={e => setCourseId(e.target.value)} className="w-full bg-white border border-gray-200 rounded-md px-3 py-2 text-[14px] text-gray-800 outline-none cursor-pointer"><option value="">Select course</option>{(courses || []).map(c => <option key={c.id} value={c.id}>{c.title}</option>)}</select></div>
              <div><label className="block text-[13px] font-medium text-gray-700 mb-1">Title</label><input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-white border border-gray-200 rounded-md px-3 py-2 text-[14px] text-gray-800 outline-none focus:border-brand-teal transition-colors" /></div>
              <div><label className="block text-[13px] font-medium text-gray-700 mb-1">Type</label><select value={type} onChange={e => setType(e.target.value)} className="w-full bg-white border border-gray-200 rounded-md px-3 py-2 text-[14px] text-gray-800 outline-none cursor-pointer"><option value="ASSIGNMENT">Assignment</option><option value="QUIZ">Quiz</option><option value="EXAM">Exam</option></select></div>
              <div><label className="block text-[13px] font-medium text-gray-700 mb-1">Due Date</label><input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className="w-full bg-white border border-gray-200 rounded-md px-3 py-2 text-[14px] text-gray-800 outline-none cursor-pointer" /></div>
              <div><label className="block text-[13px] font-medium text-gray-700 mb-1">Max Score</label><input type="number" value={maxScore} onChange={e => setMaxScore(parseInt(e.target.value) || 100)} className="w-24 bg-white border border-gray-200 rounded-md px-3 py-2 text-[14px] text-gray-800 outline-none" /></div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowCreate(false)} className="flex-1 border border-gray-200 rounded-md py-2 text-[13px] font-medium text-gray-600 cursor-pointer hover:bg-gray-50">Cancel</button>
                <button onClick={handleCreate} disabled={creating} className="flex-1 bg-[#1a2332] text-white rounded-md py-2 text-[13px] font-medium cursor-pointer hover:bg-[#243044]">{creating ? "Creating..." : "Create"}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
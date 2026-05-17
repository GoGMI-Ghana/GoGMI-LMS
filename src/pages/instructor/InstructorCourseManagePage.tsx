import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useApi } from "../../hooks/useApi";
import { api } from "../../services/api";
import { LoadingSpinner } from "../../components/common";

interface Lesson { id: string; title: string; facilitator: string; duration: string; contentType: string | null; contentUrl: string | null; order: number; }
interface Module { id: string; title: string; order: number; lessons: Lesson[]; }
interface Student { id: string; firstName: string; lastName: string; email: string; organization: string | null; country: string | null; progress: number; status: string; enrolledAt: string; lastAccessAt: string | null; }
interface Assessment { id: string; title: string; type: string; dueDate: string | null; maxScore: number; submissions: number; totalStudents: number; avgScore: number | null; pendingCount: number; }
interface CourseDetail {
  id: string; title: string; subtitle: string; category: string; level: string; duration: string; published: boolean; price: number;
  modules: Module[]; students: Student[]; assessments: Assessment[];
}

export default function InstructorCourseManagePage() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { data: course, isLoading, refetch } = useApi<CourseDetail>("/instructor/courses/" + courseId);

  const [activeTab, setActiveTab] = useState<"content" | "students" | "assessments">("content");
  const [expandedModule, setExpandedModule] = useState<number | null>(0);

  // Content editing
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [contentType, setContentType] = useState("");
  const [contentUrl, setContentUrl] = useState("");
  const [savingContent, setSavingContent] = useState(false);

  // Create assessment
  const [showCreateAssessment, setShowCreateAssessment] = useState(false);
  const [assessTitle, setAssessTitle] = useState("");
  const [assessType, setAssessType] = useState("ASSIGNMENT");
  const [assessDueDate, setAssessDueDate] = useState("");
  const [assessMaxScore, setAssessMaxScore] = useState(100);
  const [creatingAssessment, setCreatingAssessment] = useState(false);
  const [formError, setFormError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Student search
  const [studentSearch, setStudentSearch] = useState("");

  if (isLoading) return <LoadingSpinner />;
  if (!course) return <div className="bg-white border border-gray-200 rounded-lg py-16 flex flex-col items-center"><p className="text-gray-500">Course not found</p></div>;

  const totalSessions = course.modules.reduce((s, m) => s + m.lessons.length, 0);
  const filteredStudents = studentSearch.trim()
    ? course.students.filter(s => (s.firstName + " " + s.lastName).toLowerCase().includes(studentSearch.toLowerCase()) || s.email.toLowerCase().includes(studentSearch.toLowerCase()))
    : course.students;

  const handleSaveContent = async () => {
    if (!editingLesson) return;
    setSavingContent(true);
    try {
      await api.patch("/instructor/lessons/" + editingLesson.id, { contentType: contentType || null, contentUrl: contentUrl || null });
      setEditingLesson(null); setContentType(""); setContentUrl("");
      setSuccessMsg("Content updated"); setTimeout(() => setSuccessMsg(""), 3000);
      refetch();
    } catch (err) { setFormError(err instanceof Error ? err.message : "Failed to save"); }
    finally { setSavingContent(false); }
  };

  const handleCreateAssessment = async () => {
    setFormError("");
    if (!assessTitle.trim()) { setFormError("Title is required"); return; }
    setCreatingAssessment(true);
    try {
      await api.post("/instructor/assessments", { courseId: course.id, title: assessTitle, type: assessType, dueDate: assessDueDate || undefined, maxScore: assessMaxScore });
      setShowCreateAssessment(false); setAssessTitle(""); setAssessType("ASSIGNMENT"); setAssessDueDate(""); setAssessMaxScore(100);
      setSuccessMsg("Assessment created"); setTimeout(() => setSuccessMsg(""), 3000);
      refetch();
    } catch (err) { setFormError(err instanceof Error ? err.message : "Failed to create"); }
    finally { setCreatingAssessment(false); }
  };

  const getContentIcon = (type: string | null) => {
    if (type === "video") return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-purple-500"><polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" ry="2" /></svg>;
    if (type === "document") return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-red-500"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>;
    if (type === "zoom") return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-blue-500"><path d="M15 10l4.553-2.276A1 1 0 0 1 21 8.618v6.764a1 1 0 0 1-1.447.894L15 14" /><rect x="1" y="6" width="14" height="12" rx="2" ry="2" /></svg>;
    return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-gray-400"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>;
  };

  const statusColors: Record<string, string> = { ASSIGNMENT: "bg-brand-amber-light text-brand-amber", QUIZ: "bg-blue-50 text-blue-700", EXAM: "bg-red-50 text-red-600" };

  return (
    <div>
      <button onClick={() => navigate("/instructor/courses")} className="flex items-center gap-1.5 text-[13px] text-gray-500 hover:text-gray-700 cursor-pointer mb-5 transition-colors">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="15 18 9 12 15 6" /></svg>Back to courses
      </button>

      <div className="flex justify-between items-start mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${course.published ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-600"}`}>{course.published ? "Active" : "Draft"}</span>
            <span className="text-[11px] text-gray-500">{course.category} · {course.level}</span>
          </div>
          <h1 className="text-[22px] font-semibold text-gray-800 mb-1">{course.title}</h1>
          <p className="text-[14px] text-gray-500">{course.modules.length} modules · {totalSessions} sessions · {course.students.length} students</p>
        </div>
      </div>

      {successMsg && <div className="bg-green-50 border border-green-200 rounded-md px-4 py-3 mb-4"><p className="text-[13px] text-green-700">{successMsg}</p></div>}

      {/* Tabs */}
      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="flex border-b border-gray-200">
          {(["content", "students", "assessments"] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`px-6 py-3.5 text-[14px] font-medium capitalize transition-colors cursor-pointer ${activeTab === tab ? "text-brand-teal border-b-2 border-brand-teal" : "text-gray-500 hover:text-gray-700"}`}>
              {tab} {tab === "students" && <span className="text-[11px] ml-1 text-gray-400">({course.students.length})</span>}
              {tab === "assessments" && <span className="text-[11px] ml-1 text-gray-400">({course.assessments.length})</span>}
            </button>
          ))}
        </div>

        <div className="p-6">
          {/* ─── Content Tab ─── */}
          {activeTab === "content" && (
            <div>
              <h2 className="text-[15px] font-semibold text-gray-800 mb-4">Course Modules & Content</h2>
              <div className="flex flex-col gap-2">
                {course.modules.map((mod, i) => (
                  <div key={mod.id} className="border border-gray-100 rounded-md overflow-hidden">
                    <button onClick={() => setExpandedModule(expandedModule === i ? null : i)} className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer">
                      <div className="flex items-center gap-3 text-left">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-semibold ${mod.lessons.every(l => l.contentUrl) ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                          {mod.lessons.every(l => l.contentUrl) ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12" /></svg> : i + 1}
                        </div>
                        <div>
                          <div className="text-[14px] font-medium text-gray-800">Module {i + 1}: {mod.title}</div>
                          <div className="text-[12px] text-gray-500">{mod.lessons.length} sessions · {mod.lessons.filter(l => l.contentUrl).length} with content</div>
                        </div>
                      </div>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`text-gray-400 transition-transform ${expandedModule === i ? "rotate-180" : ""}`}><polyline points="6 9 12 15 18 9" /></svg>
                    </button>
                    {expandedModule === i && (
                      <div className="px-4 pb-3 pt-1 border-t border-gray-100">
                        {mod.lessons.map((lesson, j) => (
                          <div key={lesson.id} className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
                            <div className="flex items-center gap-3">
                              <span className="text-[11px] text-gray-400 w-5 text-center">{j + 1}</span>
                              {getContentIcon(lesson.contentType)}
                              <div>
                                <div className="text-[13px] text-gray-700">{lesson.title}</div>
                                <div className="text-[11px] text-gray-400">{lesson.facilitator} · {lesson.duration}</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {lesson.contentUrl && <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-green-50 text-green-700">Has content</span>}
                              <button onClick={() => { setEditingLesson(lesson); setContentType(lesson.contentType || ""); setContentUrl(lesson.contentUrl || ""); setFormError(""); }}
                                className="border border-gray-200 rounded-md px-3 py-1 text-[12px] font-medium text-gray-600 cursor-pointer hover:bg-gray-50 transition-colors">
                                {lesson.contentUrl ? "Edit" : "Add Content"}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ─── Students Tab ─── */}
          {activeTab === "students" && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-[15px] font-semibold text-gray-800">{course.students.length} Enrolled Students</h2>
              </div>
              <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-md px-3 py-2 mb-4 max-w-sm">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                <input type="text" value={studentSearch} onChange={e => setStudentSearch(e.target.value)} placeholder="Search students..." className="border-none outline-none bg-transparent text-[13px] text-gray-700 w-full placeholder:text-gray-400" />
              </div>
              {filteredStudents.length > 0 ? (
                <table className="w-full">
                  <thead><tr className="border-b border-gray-100">
                    <th className="text-left px-4 py-3 text-[12px] font-medium text-gray-500 uppercase tracking-wider">Student</th>
                    <th className="text-left px-4 py-3 text-[12px] font-medium text-gray-500 uppercase tracking-wider">Organisation</th>
                    <th className="text-left px-4 py-3 text-[12px] font-medium text-gray-500 uppercase tracking-wider">Country</th>
                    <th className="text-left px-4 py-3 text-[12px] font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                    <th className="text-left px-4 py-3 text-[12px] font-medium text-gray-500 uppercase tracking-wider">Last Active</th>
                  </tr></thead>
                  <tbody>{filteredStudents.map(s => (
                    <tr key={s.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3.5"><div className="flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-[11px] font-semibold text-gray-600">{(s.firstName[0] + s.lastName[0]).toUpperCase()}</div><div><div className="text-[13px] font-medium text-gray-800">{s.firstName} {s.lastName}</div><div className="text-[11.5px] text-gray-400">{s.email}</div></div></div></td>
                      <td className="px-4 py-3.5 text-[13px] text-gray-600">{s.organization || "—"}</td>
                      <td className="px-4 py-3.5 text-[13px] text-gray-600">{s.country || "—"}</td>
                      <td className="px-4 py-3.5"><div className="flex items-center gap-2"><div className="w-20 h-1.5 rounded-full bg-gray-200"><div className="h-full rounded-full bg-brand-teal" style={{ width: s.progress + "%" }} /></div><span className="text-[12px] text-gray-600">{s.progress}%</span></div></td>
                      <td className="px-4 py-3.5 text-[13px] text-gray-500">{s.lastAccessAt ? new Date(s.lastAccessAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" }) : "Never"}</td>
                    </tr>
                  ))}</tbody>
                </table>
              ) : (
                <div className="py-10 text-center"><p className="text-[13px] text-gray-400">{studentSearch ? "No students match your search." : "No students enrolled yet."}</p></div>
              )}
            </div>
          )}

          {/* ─── Assessments Tab ─── */}
          {activeTab === "assessments" && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-[15px] font-semibold text-gray-800">Assessments</h2>
                <button onClick={() => { setShowCreateAssessment(true); setFormError(""); }} className="bg-[#1a2332] text-white rounded-md px-4 py-2 text-[13px] font-medium cursor-pointer hover:bg-[#243044] transition-colors">Create Assessment</button>
              </div>
              {course.assessments.length > 0 ? (
                <div className="flex flex-col gap-3">
                  {course.assessments.map(a => {
                    const isPast = a.dueDate && new Date(a.dueDate) < new Date();
                    return (
                      <div key={a.id} className="border border-gray-100 rounded-md px-5 py-4 flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${statusColors[a.type] || "bg-gray-100 text-gray-600"}`}>{a.type}</span>
                            {isPast && <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-gray-100 text-gray-600">Closed</span>}
                            {a.pendingCount > 0 && <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-brand-amber-light text-brand-amber">{a.pendingCount} pending</span>}
                          </div>
                          <div className="text-[14px] font-medium text-gray-800">{a.title}</div>
                          <div className="text-[12px] text-gray-500 mt-0.5">
                            {a.dueDate ? "Due: " + new Date(a.dueDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "No due date"}
                            {" · "}{a.submissions}/{a.totalStudents} submitted
                            {a.avgScore !== null && " · Avg: " + a.avgScore + "%"}
                            {" · "}{a.maxScore} points
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => navigate("/instructor/assessments/" + a.id + "/questions")} className="border border-gray-200 rounded-md px-3 py-1.5 text-[12px] font-medium text-gray-600 cursor-pointer hover:bg-gray-50 transition-colors">Questions</button>
                          <button onClick={() => navigate("/instructor/grading")} className="border border-gray-200 rounded-md px-3 py-1.5 text-[12px] font-medium text-gray-600 cursor-pointer hover:bg-gray-50 transition-colors">Submissions</button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-10 text-center">
                  <p className="text-[13px] text-gray-400 mb-3">No assessments yet.</p>
                  <button onClick={() => setShowCreateAssessment(true)} className="bg-[#1a2332] text-white rounded-md px-5 py-2 text-[13px] font-medium cursor-pointer">Create First Assessment</button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Edit Lesson Content Modal */}
      {editingLesson && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[100]" onClick={() => setEditingLesson(null)}>
          <div className="bg-white rounded-lg w-full max-w-md p-6 shadow-xl" onClick={e => e.stopPropagation()}>
            <h2 className="text-[18px] font-semibold text-gray-800 mb-1">Edit Content</h2>
            <p className="text-[13px] text-gray-500 mb-5">{editingLesson.title}</p>
            {formError && <div className="bg-red-50 border border-red-200 rounded-md px-4 py-3 mb-4"><p className="text-[13px] text-red-700">{formError}</p></div>}
            <div className="flex flex-col gap-3.5">
              <div>
                <label className="block text-[13px] font-medium text-gray-700 mb-1">Content Type</label>
                <select value={contentType} onChange={e => setContentType(e.target.value)} className="w-full bg-white border border-gray-200 rounded-md px-3 py-2 text-[14px] text-gray-800 outline-none cursor-pointer">
                  <option value="">None</option>
                  <option value="video">Video Recording</option>
                  <option value="document">PDF Document</option>
                  <option value="zoom">Zoom Link</option>
                  <option value="slides">Presentation</option>
                  <option value="external">External Resource</option>
                </select>
              </div>
              <div>
                <label className="block text-[13px] font-medium text-gray-700 mb-1">URL / Link</label>
                <input type="text" value={contentUrl} onChange={e => setContentUrl(e.target.value)} placeholder="https://..." className="w-full bg-white border border-gray-200 rounded-md px-3 py-2 text-[14px] text-gray-800 outline-none focus:border-brand-teal transition-colors" />
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setEditingLesson(null)} className="flex-1 border border-gray-200 rounded-md py-2 text-[13px] font-medium text-gray-600 cursor-pointer hover:bg-gray-50 transition-colors">Cancel</button>
                <button onClick={handleSaveContent} disabled={savingContent} className="flex-1 bg-[#1a2332] text-white rounded-md py-2 text-[13px] font-medium cursor-pointer hover:bg-[#243044] transition-colors">{savingContent ? "Saving..." : "Save"}</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Assessment Modal */}
      {showCreateAssessment && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[100]" onClick={() => setShowCreateAssessment(false)}>
          <div className="bg-white rounded-lg w-full max-w-md p-6 shadow-xl" onClick={e => e.stopPropagation()}>
            <h2 className="text-[18px] font-semibold text-gray-800 mb-5">Create Assessment</h2>
            {formError && <div className="bg-red-50 border border-red-200 rounded-md px-4 py-3 mb-4"><p className="text-[13px] text-red-700">{formError}</p></div>}
            <div className="flex flex-col gap-3.5">
              <div><label className="block text-[13px] font-medium text-gray-700 mb-1">Title</label><input type="text" value={assessTitle} onChange={e => setAssessTitle(e.target.value)} placeholder="e.g. Module 1 Quiz" className="w-full bg-white border border-gray-200 rounded-md px-3 py-2 text-[14px] text-gray-800 outline-none focus:border-brand-teal transition-colors" /></div>
              <div><label className="block text-[13px] font-medium text-gray-700 mb-1">Type</label><select value={assessType} onChange={e => setAssessType(e.target.value)} className="w-full bg-white border border-gray-200 rounded-md px-3 py-2 text-[14px] text-gray-800 outline-none cursor-pointer"><option value="ASSIGNMENT">Assignment</option><option value="QUIZ">Quiz</option><option value="EXAM">Exam</option></select></div>
              <div><label className="block text-[13px] font-medium text-gray-700 mb-1">Due Date</label><input type="date" value={assessDueDate} onChange={e => setAssessDueDate(e.target.value)} className="w-full bg-white border border-gray-200 rounded-md px-3 py-2 text-[14px] text-gray-800 outline-none focus:border-brand-teal transition-colors cursor-pointer" /></div>
              <div><label className="block text-[13px] font-medium text-gray-700 mb-1">Max Score</label><input type="number" value={assessMaxScore} onChange={e => setAssessMaxScore(parseInt(e.target.value) || 100)} className="w-24 bg-white border border-gray-200 rounded-md px-3 py-2 text-[14px] text-gray-800 outline-none focus:border-brand-teal transition-colors" /></div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowCreateAssessment(false)} className="flex-1 border border-gray-200 rounded-md py-2 text-[13px] font-medium text-gray-600 cursor-pointer hover:bg-gray-50 transition-colors">Cancel</button>
                <button onClick={handleCreateAssessment} disabled={creatingAssessment} className="flex-1 bg-[#1a2332] text-white rounded-md py-2 text-[13px] font-medium cursor-pointer hover:bg-[#243044] transition-colors">{creatingAssessment ? "Creating..." : "Create"}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
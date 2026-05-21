import { useState, useRef } from "react";
import { useApi } from "../../hooks/useApi";
import { getAccessToken } from "../../services/api";
import { LoadingSpinner } from "../../components/common";

const API_BASE = import.meta.env.VITE_API_URL?.replace(/\/api$/, "") || "http://localhost:3001";

interface Submission { id: string; status: string; score: number | null; feedback: string | null; answerFileUrl: string | null; submittedAt: string | null; }
interface Assessment { id: string; title: string; type: string; mode: string; groupName: string | null; questionFileUrl: string | null; dueDate: string | null; maxScore: number; submission: Submission | null; }
interface Group { id: string; name: string; }
interface AssessmentData { groups: Group[]; assessments: Assessment[]; }
interface Enrollment { courseId: string; course: { id: string; title: string; }; }
interface DashData { enrollments: Enrollment[]; }

export default function AssessmentsPage() {
  const { data: dashData } = useApi<DashData>("/courses/dashboard/student");
  const courseId = dashData?.enrollments?.[0]?.courseId;
  const { data, isLoading, refetch } = useApi<AssessmentData>(courseId ? "/groups/my-assessments/" + courseId : "");

  const [submittingId, setSubmittingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  if (isLoading || !dashData) return <LoadingSpinner />;

  const myGroup = data?.groups?.[0];
  const groupAssessments = (data?.assessments || []).filter(a => a.mode === "GROUP");
  const individualAssessments = (data?.assessments || []).filter(a => a.mode === "INDIVIDUAL");

  const handleSubmit = async (assessmentId: string, file: File) => {
    setUploading(true); setErrorMsg("");
    try {
      const formData = new FormData();
      formData.append("answerFile", file);
      const token = getAccessToken();
      const res = await fetch(API_BASE + "/api/groups/submit/" + assessmentId, {
        method: "POST", body: formData, credentials: "include",
        headers: token ? { "Authorization": "Bearer " + token } : {},
      });
      if (!res.ok) { const err = await res.json(); throw new Error(err.error || "Submit failed"); }
      setSuccessMsg("Answer submitted successfully!"); setTimeout(() => setSuccessMsg(""), 4000);
      setSubmittingId(null);
      refetch();
    } catch (err) { setErrorMsg(err instanceof Error ? err.message : "Submit failed"); }
    finally { setUploading(false); }
  };

  const isPastDeadline = (d: string | null) => d ? new Date(d) < new Date() : false;

  const renderAssessment = (a: Assessment) => {
    const past = isPastDeadline(a.dueDate);
    const fileUrl = a.questionFileUrl ? (a.questionFileUrl.startsWith("/api/") ? API_BASE + a.questionFileUrl : a.questionFileUrl) : null;

    return (
      <div key={a.id} className="bg-white border border-gray-200 rounded-lg p-5">
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${a.mode === "GROUP" ? "bg-purple-50 text-purple-700" : "bg-blue-50 text-blue-700"}`}>{a.mode}</span>
              {a.groupName && <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-gray-100 text-gray-600">{a.groupName}</span>}
              {a.submission?.status === "GRADED" && <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-green-50 text-green-700">Graded</span>}
              {a.submission?.status === "SUBMITTED" && <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-50 text-amber-700">Submitted</span>}
              {past && !a.submission && <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-red-50 text-red-600">Deadline Passed</span>}
            </div>
            <h3 className="text-[15px] font-semibold text-gray-800">{a.title}</h3>
            <div className="text-[12px] text-gray-500 mt-1">
              {a.dueDate && "Due: " + new Date(a.dueDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
              {" · "}{a.maxScore} points
            </div>
          </div>
          {a.submission?.score !== null && a.submission?.score !== undefined && (
            <div className="text-right">
              <div className={`text-[24px] font-bold ${a.submission.score >= 70 ? "text-green-600" : a.submission.score >= 50 ? "text-amber-600" : "text-red-600"}`}>{a.submission.score}%</div>
              <div className="text-[11px] text-gray-400">out of {a.maxScore}</div>
            </div>
          )}
        </div>

        {/* Feedback */}
        {a.submission?.feedback && (
          <div className="bg-blue-50 border border-blue-200 rounded-md px-4 py-3 mb-3">
            <div className="text-[11px] font-semibold text-blue-700 mb-1">Facilitator Feedback</div>
            <p className="text-[13px] text-blue-800">{a.submission.feedback}</p>
          </div>
        )}

        {/* Download question file */}
        {fileUrl && (
          <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-md px-4 py-3 mb-3">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-blue-500"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
            <span className="text-[13px] text-gray-700 flex-1">Assignment Questions</span>
            <a href={fileUrl} target="_blank" rel="noopener noreferrer" download className="bg-brand-navy text-white rounded-md px-4 py-1.5 text-[12px] font-medium hover:bg-brand-navy-light inline-flex items-center gap-1.5">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Download
            </a>
          </div>
        )}

        {/* Submitted answer */}
        {a.submission?.answerFileUrl && (
          <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-md px-4 py-3 mb-3">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round"><polyline points="20 6 9 17 4 12" /></svg>
            <span className="text-[13px] text-green-800 flex-1">Your answer submitted {a.submission.submittedAt ? new Date(a.submission.submittedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }) : ""}</span>
          </div>
        )}

        {/* Submit answer */}
        {!past && !a.submission?.answerFileUrl && (
          <div>
            {submittingId === a.id ? (
              <div>
                <input ref={fileRef} type="file" accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.zip" onChange={e => { const f = e.target.files?.[0]; if (f) handleSubmit(a.id, f); }} className="hidden" />
                <button onClick={() => fileRef.current?.click()} disabled={uploading} className="w-full border-2 border-dashed border-gray-300 rounded-md py-5 flex flex-col items-center gap-2 cursor-pointer hover:border-brand-teal hover:bg-brand-teal/5 transition-colors">
                  {uploading ? <span className="text-[13px] text-gray-500">Uploading...</span> : (
                    <>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-400"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
                      <span className="text-[13px] text-gray-600">Click to upload your answer</span>
                      <span className="text-[11px] text-gray-400">PDF, Word, PowerPoint (max 50MB)</span>
                    </>
                  )}
                </button>
                <button onClick={() => setSubmittingId(null)} className="text-[12px] text-gray-500 hover:underline cursor-pointer mt-2">Cancel</button>
              </div>
            ) : (
              <button onClick={() => { setSubmittingId(a.id); setErrorMsg(""); }} className="bg-brand-navy text-white rounded-md px-5 py-2 text-[13px] font-medium cursor-pointer hover:bg-brand-navy-light">Submit Answer</button>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      <div className="mb-7">
        <h1 className="text-[22px] font-semibold text-gray-800 mb-1">Assessments</h1>
        <p className="text-[14px] text-gray-500">
          {myGroup ? "You are in " + myGroup.name + "." : "Your assignments, quizzes, and exams."}
        </p>
      </div>

      {successMsg && <div className="bg-green-50 border border-green-200 rounded-md px-4 py-3 mb-4"><p className="text-[13px] text-green-700">{successMsg}</p></div>}
      {errorMsg && <div className="bg-red-50 border border-red-200 rounded-md px-4 py-3 mb-4"><p className="text-[13px] text-red-700">{errorMsg}</p></div>}

      {groupAssessments.length > 0 && (
        <div className="mb-6">
          <h2 className="text-[15px] font-semibold text-gray-800 mb-3">Group Assessments</h2>
          <div className="flex flex-col gap-3">{groupAssessments.map(renderAssessment)}</div>
        </div>
      )}

      {individualAssessments.length > 0 && (
        <div className="mb-6">
          <h2 className="text-[15px] font-semibold text-gray-800 mb-3">Individual Assessments</h2>
          <div className="flex flex-col gap-3">{individualAssessments.map(renderAssessment)}</div>
        </div>
      )}

      {(data?.assessments || []).length === 0 && (
        <div className="bg-white border border-gray-200 rounded-lg py-16 flex flex-col items-center">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-300 mb-3"><polyline points="9 11 12 14 22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></svg>
          <h3 className="text-[15px] font-semibold text-gray-800 mb-1">No assessments yet</h3>
          <p className="text-[13px] text-gray-500">Assessments will appear here when facilitators create them.</p>
        </div>
      )}
    </div>
  );
}
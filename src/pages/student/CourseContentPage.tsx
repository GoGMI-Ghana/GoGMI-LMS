import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useApi } from "../../hooks/useApi";
import { api } from "../../services/api";
import { ProgressBar, LoadingSpinner } from "../../components/common";

const API_BASE = import.meta.env.VITE_API_URL?.replace(/\/api$/, "") || "http://localhost:3001";

interface Lesson { id: string; title: string; facilitator: string; duration: string; contentType: string | null; contentUrl: string | null; order: number; }
interface Module { id: string; title: string; order: number; lessons: Lesson[]; }
interface Course { id: string; title: string; subtitle: string; category: string; format: string; modules: Module[]; }
interface AccessCheck { hasAccess: boolean; enrollment: { progress: number; status: string } | null; }

function getYouTubeId(url: string): string | null {
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([^?&#]+)/);
  return m ? m[1] : null;
}

export default function CourseContentPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { data: course, isLoading } = useApi<Course>("/courses/" + courseId);
  const { data: access, refetch: refetchAccess } = useApi<AccessCheck>("/courses/" + courseId + "/access");

  const [activeModuleIdx, setActiveModuleIdx] = useState(0);
  const [activeLessonIdx, setActiveLessonIdx] = useState(0);
  const [marking, setMarking] = useState(false);
  const [showComplete, setShowComplete] = useState(false);
  const [completed, setCompleted] = useState<string[]>([]);
  const [loadedCompletions, setLoadedCompletions] = useState(false);

  // Load completions once
  if (!loadedCompletions && courseId) {
    setLoadedCompletions(true);
    api.get<string[]>("/courses/" + courseId + "/completions").then(data => setCompleted(data)).catch(() => {});
  }

  if (isLoading) return <LoadingSpinner />;
  if (!course) return <div className="bg-white border border-gray-200 rounded-lg py-16 flex flex-col items-center"><p className="text-gray-500">Course not found</p></div>;

  if (access && !access.hasAccess) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg py-16 flex flex-col items-center">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-300 mb-3"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
        <h2 className="text-[16px] font-semibold text-gray-800 mb-1">Enroll to access content</h2>
        <p className="text-[13px] text-gray-500 mb-4">You need to be enrolled in this course.</p>
        <button onClick={() => navigate("/catalog/" + courseId)} className="bg-brand-navy text-white rounded-md px-5 py-2 text-[13px] font-medium cursor-pointer hover:bg-brand-navy-light">View Course Details</button>
      </div>
    );
  }

  const activeModule = course.modules[activeModuleIdx];
  const activeLesson = activeModule?.lessons[activeLessonIdx];
  const isLessonDone = activeLesson ? completed.includes(activeLesson.id) : false;

  const zoomMatch = course.format?.match(/https:\/\/us\d+web\.zoom\.us\/j\/\d+[^\s|]*/);
  const meetingIdMatch = course.format?.match(/Meeting ID:\s*([\d\s]+)/);
  const passcodeMatch = course.format?.match(/Passcode:\s*(\w+)/);

  const totalLessons = course.modules.reduce((s, m) => s + m.lessons.length, 0);
  const completedCount = completed.length;
  const progress = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  const goToLesson = (mIdx: number, lIdx: number) => { setActiveModuleIdx(mIdx); setActiveLessonIdx(lIdx); window.scrollTo({ top: 0, behavior: "smooth" }); };

  const goNext = () => {
    if (activeModule && activeLessonIdx < activeModule.lessons.length - 1) setActiveLessonIdx(activeLessonIdx + 1);
    else if (activeModuleIdx < course.modules.length - 1) { setActiveModuleIdx(activeModuleIdx + 1); setActiveLessonIdx(0); }
  };

  const goPrev = () => {
    if (activeLessonIdx > 0) setActiveLessonIdx(activeLessonIdx - 1);
    else if (activeModuleIdx > 0) { setActiveModuleIdx(activeModuleIdx - 1); setActiveLessonIdx(course.modules[activeModuleIdx - 1].lessons.length - 1); }
  };

  let globalIdx = 0;
  for (let m = 0; m < activeModuleIdx; m++) globalIdx += course.modules[m].lessons.length;
  globalIdx += activeLessonIdx;

  const handleMarkComplete = async () => {
    if (!activeLesson) return;
    setMarking(true);
    setCompleted(prev => [...prev, activeLesson.id]);
    try {
      const result = await api.post<{ progress: number; courseCompleted: boolean }>("/courses/lessons/" + activeLesson.id + "/complete");
      refetchAccess();
      if (result.courseCompleted) setShowComplete(true);
      else setTimeout(() => goNext(), 600);
    } catch { setCompleted(prev => prev.filter(id => id !== activeLesson.id)); }
    finally { setMarking(false); }
  };

  const handleUndoComplete = async () => {
    if (!activeLesson) return;
    setMarking(true);
    setCompleted(prev => prev.filter(id => id !== activeLesson.id));
    try {
      await api.delete("/courses/lessons/" + activeLesson.id + "/complete");
      refetchAccess();
    } catch { setCompleted(prev => [...prev, activeLesson.id]); }
    finally { setMarking(false); }
  };

  const renderContent = () => {
    if (!activeLesson) return null;
    if (!activeLesson.contentUrl) {
      return (
        <div className="bg-gray-50 border border-gray-200 rounded-lg py-16 flex flex-col items-center">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-300 mb-3"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          <p className="text-[14px] text-gray-500 mb-1">No content available yet</p>
          <p className="text-[12px] text-gray-400">The facilitator has not uploaded content for this session.</p>
        </div>
      );
    }
    if (activeLesson.contentType === "video") {
      const ytId = getYouTubeId(activeLesson.contentUrl);
      if (ytId) return <div className="bg-black rounded-lg overflow-hidden" style={{ aspectRatio: "16/9" }}><iframe src={"https://www.youtube.com/embed/" + ytId + "?rel=0"} className="w-full h-full" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen /></div>;
      return <div className="bg-gray-50 border border-gray-200 rounded-lg p-6"><a href={activeLesson.contentUrl} target="_blank" rel="noopener noreferrer" className="text-brand-teal hover:underline">Open video</a></div>;
    }
    if (activeLesson.contentType === "document" || activeLesson.contentType === "slides") {
      const fileUrl = activeLesson.contentUrl.startsWith("/api/files/") ? API_BASE + activeLesson.contentUrl : activeLesson.contentUrl;
      const isPdf = activeLesson.contentUrl.toLowerCase().includes(".pdf");
      return (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          {isPdf && <div style={{ height: "600px" }}><iframe src={fileUrl} className="w-full h-full" title={activeLesson.title} /></div>}
          <div className="p-5 flex items-center justify-between border-t border-gray-100">
            <div className="flex items-center gap-3">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-blue-500"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
              <div><div className="text-[14px] font-medium text-gray-800">{activeLesson.title}</div><div className="text-[12px] text-gray-500">{activeLesson.contentType === "slides" ? "Presentation" : "Document"}</div></div>
            </div>
            <a href={fileUrl} target="_blank" rel="noopener noreferrer" download className="bg-brand-navy text-white rounded-md px-4 py-2 text-[13px] font-medium hover:bg-brand-navy-light inline-flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Download
            </a>
          </div>
        </div>
      );
    }
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <a href={activeLesson.contentUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-blue-600 text-white rounded-md px-5 py-2.5 text-[13px] font-medium hover:bg-blue-700">Open Link</a>
      </div>
    );
  };

  return (
    <div>
      <button onClick={() => navigate("/catalog/" + courseId)} className="flex items-center gap-1.5 text-[13px] text-gray-500 hover:text-gray-700 cursor-pointer mb-5">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>Back to course
      </button>

      <div className="grid grid-cols-[1fr_320px] gap-6">
        <div>
          {zoomMatch && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue-600"><path d="M15 10l4.553-2.276A1 1 0 0 1 21 8.618v6.764a1 1 0 0 1-1.447.894L15 14"/><rect x="1" y="6" width="14" height="12" rx="2" ry="2"/></svg>
                <span className="text-[13px] text-gray-700">Live sessions daily</span>
                {meetingIdMatch && <span className="text-[12px] text-gray-500 ml-2">ID: {meetingIdMatch[1].trim()}</span>}
                {passcodeMatch && <span className="text-[12px] text-gray-500">Pass: {passcodeMatch[1]}</span>}
              </div>
              <a href={zoomMatch[0]} target="_blank" rel="noopener noreferrer" className="bg-blue-600 text-white rounded-md px-4 py-1.5 text-[12px] font-medium hover:bg-blue-700">Join Zoom</a>
            </div>
          )}

          {activeLesson && (
            <div className="mb-4">
              <div className="text-[12px] text-brand-teal font-medium uppercase tracking-wider mb-1">
                {activeModule?.title.includes("Supplementary") ? "📚 Extra Reading" : "Module " + (activeModuleIdx + 1)} · Session {activeLessonIdx + 1}
              </div>
              <h1 className="text-[20px] font-semibold text-gray-800 mb-1">{activeLesson.title}</h1>
              <div className="text-[13px] text-gray-500">{activeLesson.facilitator} · {activeLesson.duration}</div>
            </div>
          )}

          {renderContent()}

          {activeLesson && (
            <div className="mt-4">
              {isLessonDone ? (
                <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg px-5 py-3">
                  <div className="flex items-center gap-2">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                    <span className="text-[14px] font-medium text-green-700">Completed</span>
                  </div>
                  <button onClick={handleUndoComplete} disabled={marking} className="text-[12px] text-green-600 hover:underline cursor-pointer">Undo</button>
                </div>
              ) : (
                <button onClick={handleMarkComplete} disabled={marking} className="w-full bg-brand-teal text-white rounded-lg py-3 text-[14px] font-medium cursor-pointer hover:bg-brand-teal/90 transition-colors flex items-center justify-center gap-2">
                  {marking ? "Saving..." : <><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>Mark as Complete</>}
                </button>
              )}
            </div>
          )}

          <div className="flex justify-between items-center mt-5">
            <button onClick={goPrev} disabled={globalIdx === 0} className={`flex items-center gap-1.5 text-[13px] font-medium cursor-pointer ${globalIdx === 0 ? "text-gray-300" : "text-gray-600 hover:text-gray-800"}`}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>Previous
            </button>
            <span className="text-[12px] text-gray-400">{globalIdx + 1} of {totalLessons}</span>
            <button onClick={goNext} disabled={globalIdx === totalLessons - 1} className={`flex items-center gap-1.5 text-[13px] font-medium cursor-pointer ${globalIdx === totalLessons - 1 ? "text-gray-300" : "text-gray-600 hover:text-gray-800"}`}>
              Next<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden sticky top-20 max-h-[calc(100vh-120px)] overflow-y-auto">
          <div className="p-4 border-b border-gray-100">
            <h2 className="text-[14px] font-semibold text-gray-800 mb-1">{course.title}</h2>
            <div className="text-[12px] text-gray-500 mb-2">{completedCount}/{totalLessons} sessions completed</div>
            <ProgressBar value={progress} height="h-[4px]" />
            <div className="text-[11px] text-gray-400 mt-1">{progress}% complete</div>
          </div>
          <div>
            {course.modules.map((mod, mIdx) => (
              <div key={mod.id}>
                <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-100">
                  <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">{mod.title.includes("Supplementary") || mod.title.includes("Additional") ? "📚 Extra" : "Module " + (mIdx + 1)}</div>
                  <div className="text-[13px] font-medium text-gray-800">{mod.title}</div>
                </div>
                {mod.lessons.map((lesson, lIdx) => {
                  const isActive = mIdx === activeModuleIdx && lIdx === activeLessonIdx;
                  const isDone = completed.includes(lesson.id);
                  const hasContent = !!lesson.contentUrl;
                  return (
                    <button key={lesson.id} onClick={() => goToLesson(mIdx, lIdx)} className={`w-full text-left px-4 py-2.5 flex items-center gap-3 border-b border-gray-50 cursor-pointer transition-colors ${isActive ? "bg-brand-teal/5 border-l-2 border-l-brand-teal" : "hover:bg-gray-50"}`}>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-semibold shrink-0 ${isDone ? "bg-green-500 text-white" : hasContent ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-400"}`}>
                        {isDone ? <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg> : lIdx + 1}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className={`text-[12px] truncate ${isActive ? "font-semibold text-gray-800" : isDone ? "text-green-600" : "text-gray-700"}`}>{lesson.title}</div>
                        <div className="text-[10px] text-gray-400">{lesson.duration}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {showComplete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]">
          <div className="bg-white rounded-xl w-full max-w-md p-8 text-center shadow-2xl">
            <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-5">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <h2 className="text-[24px] font-bold text-gray-800 mb-2">Course Completed! 🎉</h2>
            <p className="text-[14px] text-gray-500 mb-6">Congratulations! You have completed all sessions in {course.title}.</p>
            <div className="flex gap-3">
              <button onClick={() => { setShowComplete(false); navigate("/certificates"); }} className="flex-1 bg-brand-navy text-white rounded-md py-2.5 text-[13px] font-medium cursor-pointer hover:bg-brand-navy-light">View Certificates</button>
              <button onClick={() => setShowComplete(false)} className="flex-1 border border-gray-200 rounded-md py-2.5 text-[13px] font-medium text-gray-600 cursor-pointer hover:bg-gray-50">Stay Here</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
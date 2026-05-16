import { useState } from "react";
import { useApi } from "../../hooks/useApi";
import { api } from "../../services/api";
import { LoadingSpinner } from "../../components/common";

interface Announcement {
  id: string; title: string; content: string; audience: string;
  courseId: string | null; author: string; createdAt: string;
}

interface Course {
  id: string; title: string;
}

export default function InstructorAnnouncementsPage() {
  const { data: announcements, isLoading, refetch } = useApi<Announcement[]>("/instructor/announcements");
  const { data: courses } = useApi<Course[]>("/instructor/courses");
  const [showCreate, setShowCreate] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [courseId, setCourseId] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  if (isLoading) return <LoadingSpinner />;

  const handleCreate = async () => {
    setError("");
    if (!title.trim() || !content.trim() || !courseId) { setError("Please fill in all fields."); return; }
    setCreating(true);
    try {
      await api.post("/instructor/announcements", { courseId, title, content });
      setShowCreate(false); setTitle(""); setContent(""); setCourseId("");
      refetch();
    } catch (err) { setError(err instanceof Error ? err.message : "Failed to create."); }
    finally { setCreating(false); }
  };

  return (
    <div>
      <div className="flex justify-between items-start mb-7">
        <div><h1 className="text-[22px] font-semibold text-gray-800 mb-1">Announcements</h1><p className="text-[14px] text-gray-500">Post updates for your course participants.</p></div>
        <button onClick={() => setShowCreate(true)} className="bg-[#1a2332] text-white rounded-md px-4 py-2.5 text-[13px] font-medium cursor-pointer hover:bg-[#243044] transition-colors">New Announcement</button>
      </div>

      {(announcements?.length || 0) > 0 ? (
        <div className="flex flex-col gap-3">
          {announcements!.map(a => (
            <div key={a.id} className="bg-white border border-gray-200 rounded-lg p-5">
              <div className="text-[11px] text-gray-500 mb-1">{a.author} · {new Date(a.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</div>
              <h3 className="text-[14.5px] font-semibold text-gray-800 mb-1">{a.title}</h3>
              <p className="text-[13px] text-gray-500 leading-relaxed">{a.content}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg py-12 flex items-center justify-center">
          <p className="text-[14px] text-gray-500">No announcements yet.</p>
        </div>
      )}

      {showCreate && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[100]" onClick={() => setShowCreate(false)}>
          <div className="bg-white rounded-lg w-full max-w-lg p-6 shadow-xl" onClick={e => e.stopPropagation()}>
            <h2 className="text-[18px] font-semibold text-gray-800 mb-5">New Announcement</h2>
            {error && <div className="bg-red-50 border border-red-200 rounded-md px-4 py-3 mb-4"><p className="text-[13px] text-red-700">{error}</p></div>}
            <div className="flex flex-col gap-3.5">
              <div><label className="block text-[13px] font-medium text-gray-700 mb-1">Course</label><select value={courseId} onChange={e => setCourseId(e.target.value)} className="w-full bg-white border border-gray-200 rounded-md px-3 py-2 text-[14px] text-gray-800 outline-none cursor-pointer"><option value="">Select course</option>{(courses || []).map(c => <option key={c.id} value={c.id}>{c.title}</option>)}</select></div>
              <div><label className="block text-[13px] font-medium text-gray-700 mb-1">Title</label><input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-white border border-gray-200 rounded-md px-3 py-2 text-[14px] text-gray-800 outline-none focus:border-brand-teal transition-colors" /></div>
              <div><label className="block text-[13px] font-medium text-gray-700 mb-1">Message</label><textarea rows={4} value={content} onChange={e => setContent(e.target.value)} className="w-full bg-white border border-gray-200 rounded-md px-3 py-2 text-[14px] text-gray-800 outline-none focus:border-brand-teal transition-colors resize-none" /></div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowCreate(false)} className="flex-1 border border-gray-200 rounded-md py-2 text-[13px] font-medium text-gray-600 cursor-pointer hover:bg-gray-50 transition-colors">Cancel</button>
                <button onClick={handleCreate} disabled={creating} className="flex-1 bg-[#1a2332] text-white rounded-md py-2 text-[13px] font-medium cursor-pointer hover:bg-[#243044] transition-colors">{creating ? "Publishing..." : "Publish"}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
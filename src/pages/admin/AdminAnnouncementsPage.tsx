import { useState } from "react";
import { useApi } from "../../hooks/useApi";
import { api } from "../../services/api";
import { LoadingSpinner } from "../../components/common";

interface Course { id: string; title: string; }
interface Announcement { id: string; title: string; content: string; author: string; audience: string; courseId: string | null; createdAt: string; }

export default function AdminAnnouncementsPage() {
  const { data: announcements, isLoading, refetch } = useApi<Announcement[]>("/admin/announcements");
  const { data: courses } = useApi<Course[]>("/courses");

  const [showCreate, setShowCreate] = useState(false);
  const [courseId, setCourseId] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleCreate = async () => {
    setError("");
    if (!title.trim() || !content.trim()) { setError("Title and content required"); return; }
    setCreating(true);
    try {
      await api.post("/admin/announcements", { courseId: courseId || undefined, title, content });
      setShowCreate(false); setTitle(""); setContent(""); setCourseId("");
      setSuccess("Announcement posted"); setTimeout(() => setSuccess(""), 3000);
      refetch();
    } catch (err) { setError(err instanceof Error ? err.message : "Failed"); }
    finally { setCreating(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this announcement?")) return;
    try { await api.delete("/admin/announcements/" + id); refetch(); } catch {}
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      <div className="flex justify-between items-start mb-7">
        <div><h1 className="text-[22px] font-semibold text-gray-800 mb-1">Announcements</h1><p className="text-[14px] text-gray-500">{(announcements || []).length} announcements</p></div>
        <button onClick={() => setShowCreate(true)} className="bg-gray-900 text-white rounded-md px-4 py-2.5 text-[13px] font-medium cursor-pointer hover:bg-gray-800">New Announcement</button>
      </div>

      {success && <div className="bg-green-50 border border-green-200 rounded-md px-4 py-3 mb-4"><p className="text-[13px] text-green-700">{success}</p></div>}

      {(announcements || []).length > 0 ? (
        <div className="flex flex-col gap-3">
          {(announcements || []).map(a => (
            <div key={a.id} className="bg-white border border-gray-200 rounded-lg p-5">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={"text-[10px] font-semibold px-2 py-0.5 rounded " + (a.audience === "all" ? "bg-blue-50 text-blue-700" : "bg-gray-100 text-gray-600")}>{a.audience === "all" ? "All Users" : "Course"}</span>
                  </div>
                  <h3 className="text-[15px] font-semibold text-gray-800 mb-1">{a.title}</h3>
                  <p className="text-[13px] text-gray-500 leading-relaxed">{a.content}</p>
                  <div className="text-[12px] text-gray-400 mt-2">{a.author} · {new Date(a.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</div>
                </div>
                <button onClick={() => handleDelete(a.id)} className="text-[12px] text-red-500 font-medium hover:underline cursor-pointer shrink-0 ml-4">Delete</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg py-16 flex flex-col items-center">
          <h3 className="text-[15px] font-semibold text-gray-800 mb-1">No announcements</h3>
          <p className="text-[13px] text-gray-500 mb-4">Post an announcement for students or instructors.</p>
          <button onClick={() => setShowCreate(true)} className="bg-gray-900 text-white rounded-md px-5 py-2 text-[13px] font-medium cursor-pointer">Create Announcement</button>
        </div>
      )}

      {showCreate && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[100]" onClick={() => setShowCreate(false)}>
          <div className="bg-white rounded-lg w-full max-w-lg p-6 shadow-xl" onClick={e => e.stopPropagation()}>
            <h2 className="text-[18px] font-semibold text-gray-800 mb-5">New Announcement</h2>
            {error && <div className="bg-red-50 border border-red-200 rounded-md px-4 py-3 mb-4"><p className="text-[13px] text-red-700">{error}</p></div>}
            <div className="flex flex-col gap-3.5">
              <div><label className="block text-[13px] font-medium text-gray-700 mb-1">Audience</label><select value={courseId} onChange={e => setCourseId(e.target.value)} className="w-full bg-white border border-gray-200 rounded-md px-3 py-2 text-[14px] text-gray-800 outline-none cursor-pointer"><option value="">All Users</option>{(courses || []).map(c => <option key={c.id} value={c.id}>{c.title}</option>)}</select></div>
              <div><label className="block text-[13px] font-medium text-gray-700 mb-1">Title</label><input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-white border border-gray-200 rounded-md px-3 py-2 text-[14px] text-gray-800 outline-none focus:border-teal-500" /></div>
              <div><label className="block text-[13px] font-medium text-gray-700 mb-1">Content</label><textarea value={content} onChange={e => setContent(e.target.value)} rows={4} className="w-full bg-white border border-gray-200 rounded-md px-3 py-2 text-[14px] text-gray-800 outline-none focus:border-teal-500 resize-none" /></div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowCreate(false)} className="flex-1 border border-gray-200 rounded-md py-2 text-[13px] font-medium text-gray-600 cursor-pointer hover:bg-gray-50">Cancel</button>
                <button onClick={handleCreate} disabled={creating} className="flex-1 bg-gray-900 text-white rounded-md py-2 text-[13px] font-medium cursor-pointer hover:bg-gray-800">{creating ? "Posting..." : "Post Announcement"}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
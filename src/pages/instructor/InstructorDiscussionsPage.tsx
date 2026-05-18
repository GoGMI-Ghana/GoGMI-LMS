import { useState } from "react";
import { useApi } from "../../hooks/useApi";
import { api } from "../../services/api";
import { LoadingSpinner } from "../../components/common";

interface Thread {
  id: string; title: string; content: string; pinned: boolean; courseId: string;
  courseName: string; author: string; authorRole: string; authorId: string;
  replies: number; createdAt: string; lastActivity: string;
}

interface Reply {
  id: string; content: string; author: string; authorRole: string; authorId: string; createdAt: string;
}

interface ThreadDetail extends Omit<Thread, 'replies' | 'lastActivity'> {
  replies: Reply[];
}

interface Course { id: string; title: string; }

function timeAgo(date: string): string {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return mins <= 1 ? "just now" : mins + " min ago";
  const hours = Math.floor(mins / 60);
  if (hours < 24) return hours + "h ago";
  const days = Math.floor(hours / 24);
  if (days < 7) return days + "d ago";
  return new Date(date).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

function roleBadge(role: string) {
  if (role === "ADMIN") return <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-gray-800 text-white ml-1">Admin</span>;
  if (role === "INSTRUCTOR") return <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-brand-teal text-white ml-1">Instructor</span>;
  return null;
}

export default function InstructorDiscussionsPage() {
  const { data: threads, isLoading, refetch } = useApi<Thread[]>("/discussions");
  const { data: courses } = useApi<Course[]>("/instructor/courses");

  const [selectedThread, setSelectedThread] = useState<ThreadDetail | null>(null);
  const [loadingThread, setLoadingThread] = useState(false);

  // Create thread
  const [showCreate, setShowCreate] = useState(false);
  const [newCourseId, setNewCourseId] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [creating, setCreating] = useState(false);

  // Reply
  const [replyContent, setReplyContent] = useState("");
  const [replying, setReplying] = useState(false);

  const [error, setError] = useState("");

  if (isLoading) return <LoadingSpinner />;

  const openThread = async (id: string) => {
    setLoadingThread(true);
    try {
      const data = await api.get<ThreadDetail>("/discussions/" + id);
      setSelectedThread(data);
    } catch {}
    finally { setLoadingThread(false); }
  };

  const handleCreate = async () => {
    setError("");
    if (!newCourseId || !newTitle.trim() || !newContent.trim()) { setError("All fields are required."); return; }
    setCreating(true);
    try {
      await api.post("/discussions", { courseId: newCourseId, title: newTitle, content: newContent });
      setShowCreate(false); setNewTitle(""); setNewContent(""); setNewCourseId("");
      refetch();
    } catch (err) { setError(err instanceof Error ? err.message : "Failed"); }
    finally { setCreating(false); }
  };

  const handleReply = async () => {
    if (!selectedThread || !replyContent.trim()) return;
    setReplying(true);
    try {
      const reply = await api.post<Reply>("/discussions/" + selectedThread.id + "/replies", { content: replyContent });
      setSelectedThread({ ...selectedThread, replies: [...selectedThread.replies, reply] });
      setReplyContent("");
      refetch();
    } catch {}
    finally { setReplying(false); }
  };

  const handlePin = async (id: string) => {
    try {
      await api.patch("/discussions/" + id + "/pin", {});
      refetch();
      if (selectedThread?.id === id) setSelectedThread({ ...selectedThread, pinned: !selectedThread.pinned });
    } catch {}
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this discussion?")) return;
    try {
      await api.delete("/discussions/" + id);
      if (selectedThread?.id === id) setSelectedThread(null);
      refetch();
    } catch {}
  };

  return (
    <div>
      <div className="flex justify-between items-start mb-7">
        <div><h1 className="text-[22px] font-semibold text-gray-800 mb-1">Discussions</h1><p className="text-[14px] text-gray-500">Moderate and participate in course discussion threads.</p></div>
        <button onClick={() => setShowCreate(true)} className="bg-[#1a2332] text-white rounded-md px-4 py-2.5 text-[13px] font-medium cursor-pointer hover:bg-[#243044] transition-colors">New Discussion</button>
      </div>

      <div className="grid grid-cols-[1fr_420px] gap-6">
        {/* Thread list */}
        <div>
          {(threads || []).length > 0 ? (
            <div className="flex flex-col gap-2">
              {(threads || []).map(t => (
                <div key={t.id} onClick={() => openThread(t.id)} className={`bg-white border rounded-lg p-4 cursor-pointer transition-all hover:border-gray-300 ${selectedThread?.id === t.id ? "border-brand-teal shadow-sm" : "border-gray-200"}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {t.pinned && <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-brand-amber-light text-brand-amber">Pinned</span>}
                        <span className="text-[11px] text-gray-500">{t.courseName}</span>
                      </div>
                      <h3 className="text-[14px] font-medium text-gray-800 mb-1 truncate">{t.title}</h3>
                      <div className="text-[12px] text-gray-500">
                        {t.author}{roleBadge(t.authorRole)} · {t.replies} {t.replies === 1 ? "reply" : "replies"} · {timeAgo(t.lastActivity)}
                      </div>
                    </div>
                    <div className="flex gap-1 shrink-0 ml-3">
                      <button onClick={e => { e.stopPropagation(); handlePin(t.id); }} className="border border-gray-200 rounded px-2 py-1 text-[11px] font-medium text-gray-500 cursor-pointer hover:bg-gray-50" title={t.pinned ? "Unpin" : "Pin"}>{t.pinned ? "Unpin" : "Pin"}</button>
                      <button onClick={e => { e.stopPropagation(); handleDelete(t.id); }} className="border border-red-200 rounded px-2 py-1 text-[11px] font-medium text-red-500 cursor-pointer hover:bg-red-50">Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-lg py-16 flex flex-col items-center">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-300 mb-3"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              <h3 className="text-[15px] font-semibold text-gray-800 mb-1">No discussions yet</h3>
              <p className="text-[13px] text-gray-500 mb-4">Start a conversation with your students.</p>
              <button onClick={() => setShowCreate(true)} className="bg-[#1a2332] text-white rounded-md px-5 py-2 text-[13px] font-medium cursor-pointer">Start Discussion</button>
            </div>
          )}
        </div>

        {/* Thread detail / replies */}
        <div>
          {loadingThread && <div className="bg-white border border-gray-200 rounded-lg p-6 flex justify-center"><LoadingSpinner /></div>}
          {!loadingThread && selectedThread && (
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden sticky top-20">
              <div className="p-5 border-b border-gray-100">
                <div className="flex items-center gap-2 mb-2">
                  {selectedThread.pinned && <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-brand-amber-light text-brand-amber">Pinned</span>}
                  <span className="text-[11px] text-gray-500">{selectedThread.courseName}</span>
                </div>
                <h2 className="text-[16px] font-semibold text-gray-800 mb-2">{selectedThread.title}</h2>
                <p className="text-[13px] text-gray-600 leading-relaxed mb-3">{selectedThread.content}</p>
                <div className="text-[12px] text-gray-400">
                  {selectedThread.author}{roleBadge(selectedThread.authorRole)} · {new Date(selectedThread.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                </div>
              </div>

              {/* Replies */}
              <div className="max-h-[400px] overflow-y-auto">
                {selectedThread.replies.length > 0 ? (
                  <div className="divide-y divide-gray-50">
                    {selectedThread.replies.map(r => (
                      <div key={r.id} className="px-5 py-4">
                        <div className="flex items-center gap-2 mb-1.5">
                          <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-semibold text-gray-600">{r.author.split(" ").map(n => n[0]).join("").slice(0, 2)}</div>
                          <span className="text-[12px] font-medium text-gray-700">{r.author}</span>
                          {roleBadge(r.authorRole)}
                          <span className="text-[11px] text-gray-400 ml-auto">{timeAgo(r.createdAt)}</span>
                        </div>
                        <p className="text-[13px] text-gray-600 leading-relaxed ml-9">{r.content}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="px-5 py-8 text-center"><p className="text-[12px] text-gray-400">No replies yet</p></div>
                )}
              </div>

              {/* Reply input */}
              <div className="p-4 border-t border-gray-100">
                <div className="flex gap-2">
                  <input type="text" value={replyContent} onChange={e => setReplyContent(e.target.value)} placeholder="Write a reply..." onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) handleReply(); }} className="flex-1 bg-gray-50 border border-gray-200 rounded-md px-3 py-2 text-[13px] text-gray-800 outline-none focus:border-brand-teal transition-colors" />
                  <button onClick={handleReply} disabled={replying || !replyContent.trim()} className="bg-[#1a2332] text-white rounded-md px-4 py-2 text-[13px] font-medium cursor-pointer hover:bg-[#243044] transition-colors shrink-0">{replying ? "..." : "Reply"}</button>
                </div>
              </div>
            </div>
          )}
          {!loadingThread && !selectedThread && (
            <div className="bg-white border border-gray-200 rounded-lg py-16 flex flex-col items-center">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-300 mb-3"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              <p className="text-[13px] text-gray-400">Select a discussion to view</p>
            </div>
          )}
        </div>
      </div>

      {/* Create Discussion Modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[100]" onClick={() => setShowCreate(false)}>
          <div className="bg-white rounded-lg w-full max-w-lg p-6 shadow-xl" onClick={e => e.stopPropagation()}>
            <h2 className="text-[18px] font-semibold text-gray-800 mb-5">Start a Discussion</h2>
            {error && <div className="bg-red-50 border border-red-200 rounded-md px-4 py-3 mb-4"><p className="text-[13px] text-red-700">{error}</p></div>}
            <div className="flex flex-col gap-3.5">
              <div><label className="block text-[13px] font-medium text-gray-700 mb-1">Course</label><select value={newCourseId} onChange={e => setNewCourseId(e.target.value)} className="w-full bg-white border border-gray-200 rounded-md px-3 py-2 text-[14px] text-gray-800 outline-none cursor-pointer"><option value="">Select course</option>{(courses || []).map(c => <option key={c.id} value={c.id}>{c.title}</option>)}</select></div>
              <div><label className="block text-[13px] font-medium text-gray-700 mb-1">Title</label><input type="text" value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="Discussion topic..." className="w-full bg-white border border-gray-200 rounded-md px-3 py-2 text-[14px] text-gray-800 outline-none focus:border-brand-teal transition-colors" /></div>
              <div><label className="block text-[13px] font-medium text-gray-700 mb-1">Content</label><textarea value={newContent} onChange={e => setNewContent(e.target.value)} rows={4} placeholder="Share your thoughts..." className="w-full bg-white border border-gray-200 rounded-md px-3 py-2 text-[14px] text-gray-800 outline-none focus:border-brand-teal transition-colors resize-none" /></div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowCreate(false)} className="flex-1 border border-gray-200 rounded-md py-2 text-[13px] font-medium text-gray-600 cursor-pointer hover:bg-gray-50">Cancel</button>
                <button onClick={handleCreate} disabled={creating} className="flex-1 bg-[#1a2332] text-white rounded-md py-2 text-[13px] font-medium cursor-pointer hover:bg-[#243044]">{creating ? "Posting..." : "Post Discussion"}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
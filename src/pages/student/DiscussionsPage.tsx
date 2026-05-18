import { useState } from "react";
import { useApi } from "../../hooks/useApi";
import { api } from "../../services/api";
import { LoadingSpinner } from "../../components/common";

interface Thread {
  id: string; title: string; content: string; pinned: boolean;
  courseName: string; author: string; authorRole: string;
  replies: number; createdAt: string; lastActivity: string;
}

interface Reply {
  id: string; content: string; author: string; authorRole: string; createdAt: string;
}

interface ThreadDetail {
  id: string; title: string; content: string; pinned: boolean;
  courseName: string; author: string; authorRole: string; createdAt: string;
  replies: Reply[];
}

function timeAgo(date: string): string {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return mins <= 1 ? "just now" : mins + " min ago";
  const hours = Math.floor(mins / 60);
  if (hours < 24) return hours + "h ago";
  const days = Math.floor(hours / 24);
  return days < 7 ? days + "d ago" : new Date(date).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

function roleBadge(role: string) {
  if (role === "ADMIN") return <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-gray-800 text-white ml-1">Admin</span>;
  if (role === "INSTRUCTOR") return <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-brand-teal text-white ml-1">Instructor</span>;
  return null;
}

export default function DiscussionsPage() {
  const { data: threads, isLoading, refetch } = useApi<Thread[]>("/discussions");
  const [selectedThread, setSelectedThread] = useState<ThreadDetail | null>(null);
  const [loadingThread, setLoadingThread] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [replying, setReplying] = useState(false);

  if (isLoading) return <LoadingSpinner />;

  const openThread = async (id: string) => {
    setLoadingThread(true);
    try { setSelectedThread(await api.get<ThreadDetail>("/discussions/" + id)); } catch {}
    finally { setLoadingThread(false); }
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

  return (
    <div>
      <div className="mb-7"><h1 className="text-[22px] font-semibold text-gray-800 mb-1">Discussions</h1><p className="text-[14px] text-gray-500">Join course conversations with instructors and fellow learners.</p></div>

      <div className="grid grid-cols-[1fr_420px] gap-6">
        <div>
          {(threads || []).length > 0 ? (
            <div className="flex flex-col gap-2">
              {(threads || []).map(t => (
                <div key={t.id} onClick={() => openThread(t.id)} className={`bg-white border rounded-lg p-4 cursor-pointer transition-all hover:border-gray-300 ${selectedThread?.id === t.id ? "border-brand-teal shadow-sm" : "border-gray-200"}`}>
                  <div className="flex items-center gap-2 mb-1">
                    {t.pinned && <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-brand-amber-light text-brand-amber">Pinned</span>}
                    <span className="text-[11px] text-gray-500">{t.courseName}</span>
                  </div>
                  <h3 className="text-[14px] font-medium text-gray-800 mb-1">{t.title}</h3>
                  <div className="text-[12px] text-gray-500">{t.author}{roleBadge(t.authorRole)} · {t.replies} {t.replies === 1 ? "reply" : "replies"} · {timeAgo(t.lastActivity)}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-lg py-16 flex flex-col items-center">
              <h3 className="text-[15px] font-semibold text-gray-800 mb-1">No discussions yet</h3>
              <p className="text-[13px] text-gray-500">Discussions will appear here when instructors start conversations.</p>
            </div>
          )}
        </div>

        <div>
          {loadingThread && <div className="bg-white border border-gray-200 rounded-lg p-6 flex justify-center"><LoadingSpinner /></div>}
          {!loadingThread && selectedThread && (
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden sticky top-20">
              <div className="p-5 border-b border-gray-100">
                <div className="flex items-center gap-2 mb-2">{selectedThread.pinned && <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-brand-amber-light text-brand-amber">Pinned</span>}<span className="text-[11px] text-gray-500">{selectedThread.courseName}</span></div>
                <h2 className="text-[16px] font-semibold text-gray-800 mb-2">{selectedThread.title}</h2>
                <p className="text-[13px] text-gray-600 leading-relaxed mb-3">{selectedThread.content}</p>
                <div className="text-[12px] text-gray-400">{selectedThread.author}{roleBadge(selectedThread.authorRole)} · {new Date(selectedThread.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</div>
              </div>
              <div className="max-h-[400px] overflow-y-auto">
                {selectedThread.replies.length > 0 ? (
                  <div className="divide-y divide-gray-50">{selectedThread.replies.map(r => (
                    <div key={r.id} className="px-5 py-4">
                      <div className="flex items-center gap-2 mb-1.5">
                        <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-semibold text-gray-600">{r.author.split(" ").map(n => n[0]).join("").slice(0, 2)}</div>
                        <span className="text-[12px] font-medium text-gray-700">{r.author}</span>{roleBadge(r.authorRole)}
                        <span className="text-[11px] text-gray-400 ml-auto">{timeAgo(r.createdAt)}</span>
                      </div>
                      <p className="text-[13px] text-gray-600 leading-relaxed ml-9">{r.content}</p>
                    </div>
                  ))}</div>
                ) : <div className="px-5 py-8 text-center"><p className="text-[12px] text-gray-400">No replies yet</p></div>}
              </div>
              <div className="p-4 border-t border-gray-100">
                <div className="flex gap-2">
                  <input type="text" value={replyContent} onChange={e => setReplyContent(e.target.value)} placeholder="Write a reply..." onKeyDown={e => { if (e.key === "Enter") handleReply(); }} className="flex-1 bg-gray-50 border border-gray-200 rounded-md px-3 py-2 text-[13px] text-gray-800 outline-none focus:border-brand-teal transition-colors" />
                  <button onClick={handleReply} disabled={replying || !replyContent.trim()} className="bg-brand-navy text-white rounded-md px-4 py-2 text-[13px] font-medium cursor-pointer hover:bg-brand-navy-light transition-colors shrink-0">{replying ? "..." : "Reply"}</button>
                </div>
              </div>
            </div>
          )}
          {!loadingThread && !selectedThread && (
            <div className="bg-white border border-gray-200 rounded-lg py-16 flex flex-col items-center">
              <p className="text-[13px] text-gray-400">Select a discussion to view</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
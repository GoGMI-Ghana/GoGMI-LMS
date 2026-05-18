import { useState } from "react";
import { useApi } from "../../hooks/useApi";
import { api } from "../../services/api";
import { LoadingSpinner } from "../../components/common";

interface Conversation { id: string; subject: string; lastMessage: string; lastDate: string; otherUser: { id: string; name: string; role: string }; unread: number; messageCount: number; }
interface ThreadMessage { id: string; content: string; sender: { id: string; name: string; role: string }; isOwn: boolean; createdAt: string; }
interface Thread { threadId: string; subject: string; messages: ThreadMessage[]; }
interface UserResult { id: string; name: string; role: string; }

function timeAgo(date: string): string {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return mins <= 1 ? "just now" : mins + "m";
  const hours = Math.floor(mins / 60);
  if (hours < 24) return hours + "h";
  const days = Math.floor(hours / 24);
  return days < 7 ? days + "d" : new Date(date).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

function roleBadge(role: string) {
  if (role === "ADMIN") return <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-gray-800 text-white ml-1">Admin</span>;
  if (role === "INSTRUCTOR") return <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-brand-teal text-white ml-1">Instructor</span>;
  return null;
}

export default function MessagesPage() {
  const { data: conversations, isLoading, refetch } = useApi<Conversation[]>("/messages");
  const [selectedThread, setSelectedThread] = useState<Thread | null>(null);
  const [loadingThread, setLoadingThread] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [replying, setReplying] = useState(false);

  // Compose
  const [showCompose, setShowCompose] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<UserResult[]>([]);
  const [selectedRecipient, setSelectedRecipient] = useState<UserResult | null>(null);
  const [newSubject, setNewSubject] = useState("");
  const [newContent, setNewContent] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  if (isLoading) return <LoadingSpinner />;

  const openThread = async (id: string) => {
    setLoadingThread(true);
    try {
      const data = await api.get<Thread>("/messages/" + id);
      setSelectedThread(data);
      refetch();
    } catch {}
    finally { setLoadingThread(false); }
  };

  const handleReply = async () => {
    if (!selectedThread || !replyContent.trim()) return;
    setReplying(true);
    try {
      const msg = await api.post<ThreadMessage>("/messages/" + selectedThread.threadId + "/reply", { content: replyContent });
      setSelectedThread({ ...selectedThread, messages: [...selectedThread.messages, msg] });
      setReplyContent("");
      refetch();
    } catch {}
    finally { setReplying(false); }
  };

  const searchUsers = async (q: string) => {
    setSearchQuery(q);
    if (q.length < 2) { setSearchResults([]); return; }
    try {
      const results = await api.get<UserResult[]>("/messages/users/search?q=" + encodeURIComponent(q));
      setSearchResults(results);
    } catch {}
  };

  const handleSend = async () => {
    setError("");
    if (!selectedRecipient) { setError("Select a recipient."); return; }
    if (!newSubject.trim()) { setError("Enter a subject."); return; }
    if (!newContent.trim()) { setError("Enter a message."); return; }
    setSending(true);
    try {
      await api.post("/messages", { recipientId: selectedRecipient.id, subject: newSubject, content: newContent });
      setShowCompose(false); setSelectedRecipient(null); setNewSubject(""); setNewContent(""); setSearchQuery(""); setSearchResults([]);
      refetch();
    } catch (err) { setError(err instanceof Error ? err.message : "Failed to send"); }
    finally { setSending(false); }
  };

  const totalUnread = (conversations || []).reduce((s, c) => s + c.unread, 0);

  return (
    <div>
      <div className="flex justify-between items-start mb-7">
        <div>
          <h1 className="text-[22px] font-semibold text-gray-800 mb-1">Messages</h1>
          <p className="text-[14px] text-gray-500">{totalUnread > 0 ? totalUnread + " unread message" + (totalUnread !== 1 ? "s" : "") : "Your inbox"}</p>
        </div>
        <button onClick={() => setShowCompose(true)} className="bg-brand-navy text-white rounded-md px-4 py-2.5 text-[13px] font-medium cursor-pointer hover:bg-brand-navy-light transition-colors">New Message</button>
      </div>

      <div className="grid grid-cols-[340px_1fr] gap-5 min-h-[500px]">
        {/* Conversation list */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          {(conversations || []).length > 0 ? (
            <div className="divide-y divide-gray-100">
              {(conversations || []).map(c => (
                <div key={c.id} onClick={() => openThread(c.id)} className={`px-4 py-3.5 cursor-pointer transition-colors ${selectedThread?.threadId === c.id ? "bg-blue-50 border-l-2 border-brand-teal" : "hover:bg-gray-50"}`}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[13px] font-medium ${c.unread > 0 ? "text-gray-800" : "text-gray-600"}`}>{c.otherUser.name}</span>
                      {roleBadge(c.otherUser.role)}
                    </div>
                    <span className="text-[11px] text-gray-400">{timeAgo(c.lastDate)}</span>
                  </div>
                  <div className={`text-[13px] mb-0.5 truncate ${c.unread > 0 ? "font-semibold text-gray-800" : "text-gray-700"}`}>{c.subject}</div>
                  <div className="text-[12px] text-gray-400 truncate">{c.lastMessage}</div>
                  {c.unread > 0 && <span className="inline-block mt-1 bg-brand-teal text-white text-[10px] font-semibold px-1.5 py-0.5 rounded-full">{c.unread}</span>}
                </div>
              ))}
            </div>
          ) : (
            <div className="py-16 flex flex-col items-center">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-300 mb-3"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              <p className="text-[13px] text-gray-400">No messages yet</p>
            </div>
          )}
        </div>

        {/* Thread view */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden flex flex-col">
          {loadingThread && <div className="flex-1 flex items-center justify-center"><LoadingSpinner /></div>}
          {!loadingThread && selectedThread && (
            <>
              <div className="px-5 py-4 border-b border-gray-100">
                <h2 className="text-[16px] font-semibold text-gray-800">{selectedThread.subject}</h2>
              </div>
              <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4 max-h-[400px]">
                {selectedThread.messages.map(m => (
                  <div key={m.id} className={`flex ${m.isOwn ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[75%] ${m.isOwn ? "bg-brand-navy text-white" : "bg-gray-100 text-gray-800"} rounded-lg px-4 py-3`}>
                      {!m.isOwn && (
                        <div className="flex items-center gap-1 mb-1">
                          <span className="text-[11px] font-semibold">{m.sender.name}</span>
                          {roleBadge(m.sender.role)}
                        </div>
                      )}
                      <p className="text-[13px] leading-relaxed">{m.content}</p>
                      <div className={`text-[10px] mt-1.5 ${m.isOwn ? "text-white/50" : "text-gray-400"}`}>{new Date(m.createdAt).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })} · {new Date(m.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 border-t border-gray-100">
                <div className="flex gap-2">
                  <input type="text" value={replyContent} onChange={e => setReplyContent(e.target.value)} placeholder="Type a reply..." onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) handleReply(); }} className="flex-1 bg-gray-50 border border-gray-200 rounded-md px-3.5 py-2.5 text-[13px] text-gray-800 outline-none focus:border-brand-teal transition-colors" />
                  <button onClick={handleReply} disabled={replying || !replyContent.trim()} className="bg-brand-navy text-white rounded-md px-5 py-2.5 text-[13px] font-medium cursor-pointer hover:bg-brand-navy-light transition-colors shrink-0">{replying ? "..." : "Send"}</button>
                </div>
              </div>
            </>
          )}
          {!loadingThread && !selectedThread && (
            <div className="flex-1 flex flex-col items-center justify-center">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-300 mb-3"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              <p className="text-[14px] text-gray-400">Select a conversation to read</p>
            </div>
          )}
        </div>
      </div>

      {/* Compose Modal */}
      {showCompose && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[100]" onClick={() => setShowCompose(false)}>
          <div className="bg-white rounded-lg w-full max-w-lg p-6 shadow-xl" onClick={e => e.stopPropagation()}>
            <h2 className="text-[18px] font-semibold text-gray-800 mb-5">New Message</h2>
            {error && <div className="bg-red-50 border border-red-200 rounded-md px-4 py-3 mb-4"><p className="text-[13px] text-red-700">{error}</p></div>}
            <div className="flex flex-col gap-3.5">
              {/* Recipient search */}
              <div>
                <label className="block text-[13px] font-medium text-gray-700 mb-1">To</label>
                {selectedRecipient ? (
                  <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-md px-3 py-2">
                    <span className="text-[14px] text-gray-800">{selectedRecipient.name}</span>
                    {roleBadge(selectedRecipient.role)}
                    <button onClick={() => { setSelectedRecipient(null); setSearchQuery(""); }} className="ml-auto text-gray-400 hover:text-gray-600 cursor-pointer"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg></button>
                  </div>
                ) : (
                  <div className="relative">
                    <input type="text" value={searchQuery} onChange={e => searchUsers(e.target.value)} placeholder="Search by name or email..." className="w-full bg-white border border-gray-200 rounded-md px-3 py-2 text-[14px] text-gray-800 outline-none focus:border-brand-teal transition-colors" />
                    {searchResults.length > 0 && (
                      <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md mt-1 shadow-lg z-10 max-h-40 overflow-y-auto">
                        {searchResults.map(u => (
                          <button key={u.id} onClick={() => { setSelectedRecipient(u); setSearchResults([]); setSearchQuery(""); }} className="w-full text-left px-3 py-2.5 text-[13px] hover:bg-gray-50 cursor-pointer flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-semibold text-gray-600">{u.name.split(" ").map(n => n[0]).join("").slice(0, 2)}</div>
                            <span className="text-gray-800">{u.name}</span>
                            {roleBadge(u.role)}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div><label className="block text-[13px] font-medium text-gray-700 mb-1">Subject</label><input type="text" value={newSubject} onChange={e => setNewSubject(e.target.value)} className="w-full bg-white border border-gray-200 rounded-md px-3 py-2 text-[14px] text-gray-800 outline-none focus:border-brand-teal transition-colors" /></div>
              <div><label className="block text-[13px] font-medium text-gray-700 mb-1">Message</label><textarea value={newContent} onChange={e => setNewContent(e.target.value)} rows={5} className="w-full bg-white border border-gray-200 rounded-md px-3 py-2 text-[14px] text-gray-800 outline-none focus:border-brand-teal transition-colors resize-none" /></div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowCompose(false)} className="flex-1 border border-gray-200 rounded-md py-2.5 text-[13px] font-medium text-gray-600 cursor-pointer hover:bg-gray-50">Cancel</button>
                <button onClick={handleSend} disabled={sending} className="flex-1 bg-brand-navy text-white rounded-md py-2.5 text-[13px] font-medium cursor-pointer hover:bg-brand-navy-light">{sending ? "Sending..." : "Send Message"}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
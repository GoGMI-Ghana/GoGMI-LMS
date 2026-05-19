import { useState } from "react";
import { useApi } from "../../hooks/useApi";
import { api } from "../../services/api";
import { LoadingSpinner } from "../../components/common";

interface User { id: string; firstName: string; lastName: string; email: string; phone: string | null; organization: string | null; country: string | null; role: string; status: string; jobTitle: string | null; bio: string | null; createdAt: string; }
interface Course { id: string; title: string; }

export default function AdminUsersPage() {
  const { data: users, isLoading, refetch } = useApi<User[]>("/admin/users");
  const { data: courses } = useApi<Course[]>("/courses");
  const [filter, setFilter] = useState<"all" | "PENDING" | "ACTIVE" | "SUSPENDED">("all");
  const [search, setSearch] = useState("");
  const [approveModal, setApproveModal] = useState<User | null>(null);
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [processing, setProcessing] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  if (isLoading) return <LoadingSpinner />;

  const pendingInstructors = (users || []).filter(u => u.role === "INSTRUCTOR" && u.status === "PENDING");
  const filtered = (users || []).filter(u => {
    if (filter !== "all" && u.status !== filter) return false;
    if (search.trim()) { const q = search.toLowerCase(); return (u.firstName + " " + u.lastName).toLowerCase().includes(q) || u.email.toLowerCase().includes(q); }
    return true;
  });

  const handleApprove = async () => {
    if (!approveModal) return;
    setProcessing(true);
    try {
      await api.patch("/admin/users/" + approveModal.id + "/approve", { courseIds: selectedCourses });
      setApproveModal(null); setSelectedCourses([]);
      setSuccessMsg(approveModal.firstName + " approved and email sent!"); setTimeout(() => setSuccessMsg(""), 5000);
      refetch();
    } catch {}
    finally { setProcessing(false); }
  };

  const handleReject = async (userId: string) => {
    if (!confirm("Reject this application?")) return;
    try { await api.patch("/admin/users/" + userId + "/reject", {}); refetch(); } catch {}
  };

  const handleStatusChange = async (userId: string, status: string) => {
    try { await api.patch("/admin/users/" + userId, { status }); refetch(); } catch {}
  };

  const statusColors: Record<string, string> = { ACTIVE: "bg-green-50 text-green-700", PENDING: "bg-brand-amber-light text-brand-amber", SUSPENDED: "bg-red-50 text-red-600" };
  const roleColors: Record<string, string> = { ADMIN: "bg-gray-800 text-white", INSTRUCTOR: "bg-brand-teal text-white", STUDENT: "bg-gray-100 text-gray-600" };

  return (
    <div>
      <div className="flex justify-between items-start mb-7">
        <div><h1 className="text-[22px] font-semibold text-gray-800 mb-1">Users</h1><p className="text-[14px] text-gray-500">{(users || []).length} total users</p></div>
      </div>

      {successMsg && <div className="bg-green-50 border border-green-200 rounded-md px-4 py-3 mb-5"><p className="text-[13px] text-green-700">{successMsg}</p></div>}

      {/* Pending Instructor Applications */}
      {pendingInstructors.length > 0 && (
        <div className="bg-brand-amber-light/30 border border-brand-amber/30 rounded-lg p-5 mb-6">
          <h2 className="text-[15px] font-semibold text-gray-800 mb-1">Pending Instructor Applications ({pendingInstructors.length})</h2>
          <p className="text-[13px] text-gray-500 mb-4">These instructors are waiting for approval.</p>
          <div className="flex flex-col gap-3">
            {pendingInstructors.map(u => (
              <div key={u.id} className="bg-white border border-gray-200 rounded-lg p-4 flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-brand-teal/10 flex items-center justify-center text-[12px] font-semibold text-brand-teal shrink-0">{(u.firstName[0] + u.lastName[0]).toUpperCase()}</div>
                  <div>
                    <div className="text-[14px] font-semibold text-gray-800">{u.firstName} {u.lastName}</div>
                    <div className="text-[12px] text-gray-500">{u.email}</div>
                    {u.organization && <div className="text-[12px] text-gray-500 mt-0.5">{u.organization} · {u.country}</div>}
                    {u.jobTitle && <div className="text-[12px] text-brand-teal mt-1">Expertise: {u.jobTitle}</div>}
                    {u.bio && <p className="text-[12px] text-gray-400 mt-1 line-clamp-2">{u.bio}</p>}
                    <div className="text-[11px] text-gray-400 mt-1">Applied {new Date(u.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</div>
                  </div>
                </div>
                <div className="flex gap-2 shrink-0 ml-4">
                  <button onClick={() => { setApproveModal(u); setSelectedCourses([]); }} className="bg-green-600 text-white rounded-md px-4 py-2 text-[12px] font-medium cursor-pointer hover:bg-green-700 transition-colors">Approve</button>
                  <button onClick={() => handleReject(u.id)} className="border border-red-200 text-red-600 rounded-md px-4 py-2 text-[12px] font-medium cursor-pointer hover:bg-red-50 transition-colors">Reject</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex items-center gap-4 mb-5">
        <div className="flex gap-1.5">
          {(["all", "ACTIVE", "PENDING", "SUSPENDED"] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-md text-[13px] font-medium transition-colors cursor-pointer capitalize ${filter === f ? "bg-gray-900 text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"}`}>{f === "all" ? "All" : f.toLowerCase()}</button>
          ))}
        </div>
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-md px-3 py-1.5 max-w-xs flex-1">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." className="border-none outline-none bg-transparent text-[13px] text-gray-700 w-full placeholder:text-gray-400" />
        </div>
      </div>

      {/* Users table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead><tr className="border-b border-gray-100">
            <th className="text-left px-5 py-3 text-[12px] font-medium text-gray-500 uppercase tracking-wider">User</th>
            <th className="text-left px-5 py-3 text-[12px] font-medium text-gray-500 uppercase tracking-wider">Role</th>
            <th className="text-left px-5 py-3 text-[12px] font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="text-left px-5 py-3 text-[12px] font-medium text-gray-500 uppercase tracking-wider">Organisation</th>
            <th className="text-left px-5 py-3 text-[12px] font-medium text-gray-500 uppercase tracking-wider">Joined</th>
            <th className="text-right px-5 py-3 text-[12px] font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr></thead>
          <tbody>{filtered.map(u => (
            <tr key={u.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
              <td className="px-5 py-3.5"><div className="flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-[11px] font-semibold text-gray-600">{(u.firstName[0] + u.lastName[0]).toUpperCase()}</div><div><div className="text-[13px] font-medium text-gray-800">{u.firstName} {u.lastName}</div><div className="text-[11.5px] text-gray-400">{u.email}</div></div></div></td>
              <td className="px-5 py-3.5"><span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${roleColors[u.role] || "bg-gray-100 text-gray-600"}`}>{u.role}</span></td>
              <td className="px-5 py-3.5"><span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${statusColors[u.status] || "bg-gray-100 text-gray-600"}`}>{u.status}</span></td>
              <td className="px-5 py-3.5 text-[13px] text-gray-600">{u.organization || "—"}</td>
              <td className="px-5 py-3.5 text-[13px] text-gray-500">{new Date(u.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}</td>
              <td className="px-5 py-3.5 text-right">
                {u.status === "PENDING" && u.role === "INSTRUCTOR" && (
                  <button onClick={() => { setApproveModal(u); setSelectedCourses([]); }} className="text-[12px] text-green-600 font-medium hover:underline cursor-pointer mr-3">Approve</button>
                )}
                {u.status === "ACTIVE" && u.role !== "ADMIN" && (
                  <button onClick={() => handleStatusChange(u.id, "SUSPENDED")} className="text-[12px] text-red-500 font-medium hover:underline cursor-pointer">Suspend</button>
                )}
                {u.status === "SUSPENDED" && (
                  <button onClick={() => handleStatusChange(u.id, "ACTIVE")} className="text-[12px] text-green-600 font-medium hover:underline cursor-pointer">Activate</button>
                )}
              </td>
            </tr>
          ))}</tbody>
        </table>
      </div>

      {/* Approve Modal — assign to courses */}
      {approveModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[100]" onClick={() => setApproveModal(null)}>
          <div className="bg-white rounded-lg w-full max-w-md p-6 shadow-xl" onClick={e => e.stopPropagation()}>
            <h2 className="text-[18px] font-semibold text-gray-800 mb-1">Approve Instructor</h2>
            <p className="text-[13px] text-gray-500 mb-5">Approve <strong>{approveModal.firstName} {approveModal.lastName}</strong> and assign them to courses.</p>

            <div className="mb-4">
              <div className="bg-gray-50 rounded-md p-3 mb-4">
                <div className="text-[12px] text-gray-500 mb-1">Email: <span className="text-gray-700">{approveModal.email}</span></div>
                {approveModal.organization && <div className="text-[12px] text-gray-500">Organisation: <span className="text-gray-700">{approveModal.organization}</span></div>}
                {approveModal.jobTitle && <div className="text-[12px] text-gray-500 mt-1">Expertise: <span className="text-brand-teal font-medium">{approveModal.jobTitle}</span></div>}
              </div>

              <label className="block text-[13px] font-medium text-gray-700 mb-2">Assign to Courses</label>
              <div className="flex flex-col gap-2">
                {(courses || []).map(c => (
                  <button key={c.id} type="button" onClick={() => setSelectedCourses(prev => prev.includes(c.id) ? prev.filter(id => id !== c.id) : [...prev, c.id])}
                    className={`flex items-center gap-3 px-3.5 py-3 rounded-md border text-left transition-colors cursor-pointer ${selectedCourses.includes(c.id) ? "border-brand-teal bg-brand-teal/5" : "border-gray-200 hover:bg-gray-50"}`}>
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${selectedCourses.includes(c.id) ? "border-brand-teal bg-brand-teal" : "border-gray-300"}`}>
                      {selectedCourses.includes(c.id) && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12" /></svg>}
                    </div>
                    <span className="text-[13px] text-gray-800">{c.title}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setApproveModal(null)} className="flex-1 border border-gray-200 rounded-md py-2.5 text-[13px] font-medium text-gray-600 cursor-pointer hover:bg-gray-50">Cancel</button>
              <button onClick={handleApprove} disabled={processing} className="flex-1 bg-green-600 text-white rounded-md py-2.5 text-[13px] font-medium cursor-pointer hover:bg-green-700 transition-colors">{processing ? "Approving..." : "Approve & Notify"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
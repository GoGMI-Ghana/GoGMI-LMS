import { useState } from "react";
import { useApi } from "../../hooks/useApi";
import { LoadingSpinner } from "../../components/common";

interface Enrollment { id: string; student: string; email: string; organization: string | null; country: string | null; course: string; courseId: string; progress: number; status: string; enrolledAt: string; certificateId: string | null; }

export default function AdminEnrollmentsPage() {
  const { data: enrollments, isLoading } = useApi<Enrollment[]>("/admin/enrollments");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  if (isLoading) return <LoadingSpinner />;

  const filtered = (enrollments || []).filter(e => {
    if (filter !== "all" && e.status !== filter) return false;
    if (search.trim()) { const q = search.toLowerCase(); return e.student.toLowerCase().includes(q) || e.email.toLowerCase().includes(q) || e.course.toLowerCase().includes(q); }
    return true;
  });

  const statusColors: Record<string, string> = { ACTIVE: "bg-green-50 text-green-700", COMPLETED: "bg-blue-50 text-blue-700", DROPPED: "bg-red-50 text-red-600" };

  return (
    <div>
      <div className="mb-7"><h1 className="text-[22px] font-semibold text-gray-800 mb-1">Enrollments</h1><p className="text-[14px] text-gray-500">{(enrollments || []).length} total enrollments</p></div>

      <div className="flex items-center gap-4 mb-5">
        <div className="flex gap-1.5">
          {["all", "ACTIVE", "COMPLETED"].map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-md text-[13px] font-medium cursor-pointer capitalize ${filter === f ? "bg-gray-900 text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"}`}>{f === "all" ? "All" : f.toLowerCase()}</button>
          ))}
        </div>
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-md px-3 py-1.5 max-w-xs flex-1">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." className="border-none outline-none bg-transparent text-[13px] text-gray-700 w-full placeholder:text-gray-400" />
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead><tr className="border-b border-gray-100">
            <th className="text-left px-5 py-3 text-[12px] font-medium text-gray-500 uppercase tracking-wider">Student</th>
            <th className="text-left px-5 py-3 text-[12px] font-medium text-gray-500 uppercase tracking-wider">Course</th>
            <th className="text-left px-5 py-3 text-[12px] font-medium text-gray-500 uppercase tracking-wider">Progress</th>
            <th className="text-left px-5 py-3 text-[12px] font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="text-left px-5 py-3 text-[12px] font-medium text-gray-500 uppercase tracking-wider">Certificate ID</th>
            <th className="text-left px-5 py-3 text-[12px] font-medium text-gray-500 uppercase tracking-wider">Enrolled</th>
          </tr></thead>
          <tbody>{filtered.map(e => (
            <tr key={e.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50">
              <td className="px-5 py-3.5"><div><div className="text-[13px] font-medium text-gray-800">{e.student}</div><div className="text-[11px] text-gray-400">{e.email}</div></div></td>
              <td className="px-5 py-3.5 text-[13px] text-gray-600">{e.course}</td>
              <td className="px-5 py-3.5"><div className="flex items-center gap-2"><div className="w-16 h-1.5 rounded-full bg-gray-200"><div className="h-full rounded-full bg-teal-500" style={{ width: e.progress + "%" }} /></div><span className="text-[12px] text-gray-600">{e.progress}%</span></div></td>
              <td className="px-5 py-3.5"><span className={"text-[10px] font-semibold px-2 py-0.5 rounded " + (statusColors[e.status] || "bg-gray-100 text-gray-600")}>{e.status}</span></td>
              <td className="px-5 py-3.5 text-[12px] font-mono text-gray-500">{e.certificateId || "—"}</td>
              <td className="px-5 py-3.5 text-[13px] text-gray-500">{new Date(e.enrolledAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</td>
            </tr>
          ))}</tbody>
        </table>
        {filtered.length === 0 && <div className="py-12 text-center text-[13px] text-gray-400">No enrollments found</div>}
      </div>
    </div>
  );
}
import { useState, useMemo } from "react";
import { useApi } from "../../hooks/useApi";
import { LoadingSpinner } from "../../components/common";

interface Student {
  id: string; name: string; email: string; organization: string | null;
  country: string | null; course: string; progress: number; status: string;
  enrolledAt: string; lastAccessAt: string | null;
}

export default function InstructorStudentsPage() {
  const { data: students, isLoading } = useApi<Student[]>("/instructor/students");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!students) return [];
    if (!search.trim()) return students;
    const q = search.toLowerCase();
    return students.filter(s => s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q) || (s.organization || "").toLowerCase().includes(q));
  }, [students, search]);

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      <div className="flex justify-between items-start mb-7">
        <div><h1 className="text-[22px] font-semibold text-gray-800 mb-1">Students</h1><p className="text-[14px] text-gray-500">{students?.length || 0} students enrolled across your courses.</p></div>
      </div>
      <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3.5 py-2 mb-5 max-w-sm">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
        <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search students..." className="border-none outline-none bg-transparent text-[13.5px] text-gray-700 w-full placeholder:text-gray-400" />
      </div>
      {filtered.length > 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead><tr className="border-b border-gray-100">
              <th className="text-left px-5 py-3 text-[12px] font-medium text-gray-500 uppercase tracking-wider">Student</th>
              <th className="text-left px-5 py-3 text-[12px] font-medium text-gray-500 uppercase tracking-wider">Course</th>
              <th className="text-left px-5 py-3 text-[12px] font-medium text-gray-500 uppercase tracking-wider">Organisation</th>
              <th className="text-left px-5 py-3 text-[12px] font-medium text-gray-500 uppercase tracking-wider">Progress</th>
              <th className="text-left px-5 py-3 text-[12px] font-medium text-gray-500 uppercase tracking-wider">Last Active</th>
            </tr></thead>
            <tbody>{filtered.map((s, i) => (
              <tr key={s.id + "-" + i} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                <td className="px-5 py-3.5"><div className="flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-[11px] font-semibold text-gray-600">{s.name.split(" ").map(n => n[0]).join("").slice(0, 2)}</div><div><div className="text-[13px] font-medium text-gray-800">{s.name}</div><div className="text-[11.5px] text-gray-400">{s.email}</div></div></div></td>
                <td className="px-5 py-3.5 text-[13px] text-gray-600">{s.course}</td>
                <td className="px-5 py-3.5 text-[13px] text-gray-600">{s.organization || "—"}</td>
                <td className="px-5 py-3.5"><div className="flex items-center gap-2"><div className="w-20 h-1.5 rounded-full bg-gray-200"><div className="h-full rounded-full bg-brand-teal" style={{ width: s.progress + "%" }} /></div><span className="text-[12px] text-gray-600">{s.progress}%</span></div></td>
                <td className="px-5 py-3.5 text-[13px] text-gray-500">{s.lastAccessAt ? new Date(s.lastAccessAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" }) : "Never"}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg py-12 flex flex-col items-center">
          <p className="text-[14px] text-gray-500">{search ? "No students match your search." : "No students enrolled yet."}</p>
        </div>
      )}
    </div>
  );
}
// ─── InstructorStudentsPage ─────────────────────────────────
// This file exports a page showing all students across the instructor's courses

import { useState } from "react";

const allStudents = [
  { name: "Babiker Alayas Osman", email: "babikeralyas@yahoo.com", course: "Maritime Governance", progress: 45, country: "Sudan", institution: "Center of Research", lastActive: "2 hours ago" },
  { name: "Atari Emmanuel Afri", email: "atariafri@yahoo.com", course: "Maritime Governance", progress: 38, country: "Nigeria", institution: "Private", lastActive: "1 day ago" },
  { name: "Ama Serwaa Mensah", email: "a.mensah@gma.gov.gh", course: "Maritime Governance", progress: 52, country: "Ghana", institution: "Ghana Maritime Authority", lastActive: "3 hours ago" },
  { name: "Kofi Asante Boateng", email: "k.boateng@navy.mil.gh", course: "Maritime Governance", progress: 28, country: "Ghana", institution: "Ghana Navy", lastActive: "2 days ago" },
];

export default function InstructorStudentsPage() {
  const [search, setSearch] = useState("");
  const filtered = search.trim() ? allStudents.filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || s.email.toLowerCase().includes(search.toLowerCase())) : allStudents;

  return (
    <div>
      <div className="flex justify-between items-start mb-7">
        <div><h1 className="text-[22px] font-semibold text-gray-800 mb-1">Students</h1><p className="text-[14px] text-gray-500">{allStudents.length} students enrolled across your courses.</p></div>
        <button className="border border-gray-200 rounded-md px-4 py-2 text-[13px] font-medium text-gray-600 cursor-pointer hover:bg-gray-50 transition-colors">Export CSV</button>
      </div>
      <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3.5 py-2 mb-5 max-w-sm">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
        <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search students..." className="border-none outline-none bg-transparent text-[13.5px] text-gray-700 w-full placeholder:text-gray-400" />
      </div>
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead><tr className="border-b border-gray-100">
            <th className="text-left px-5 py-3 text-[12px] font-medium text-gray-500 uppercase tracking-wider">Student</th>
            <th className="text-left px-5 py-3 text-[12px] font-medium text-gray-500 uppercase tracking-wider">Institution</th>
            <th className="text-left px-5 py-3 text-[12px] font-medium text-gray-500 uppercase tracking-wider">Country</th>
            <th className="text-left px-5 py-3 text-[12px] font-medium text-gray-500 uppercase tracking-wider">Progress</th>
            <th className="text-left px-5 py-3 text-[12px] font-medium text-gray-500 uppercase tracking-wider">Last Active</th>
          </tr></thead>
          <tbody>{filtered.map((s, i) => (
            <tr key={i} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
              <td className="px-5 py-3.5"><div className="text-[13px] font-medium text-gray-800">{s.name}</div><div className="text-[11.5px] text-gray-400">{s.email}</div></td>
              <td className="px-5 py-3.5 text-[13px] text-gray-600">{s.institution}</td>
              <td className="px-5 py-3.5 text-[13px] text-gray-600">{s.country}</td>
              <td className="px-5 py-3.5"><div className="flex items-center gap-2"><div className="w-20 h-1.5 rounded-full bg-gray-200"><div className="h-full rounded-full bg-brand-teal" style={{ width: s.progress + "%" }} /></div><span className="text-[12px] text-gray-600">{s.progress}%</span></div></td>
              <td className="px-5 py-3.5 text-[13px] text-gray-500">{s.lastActive}</td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}
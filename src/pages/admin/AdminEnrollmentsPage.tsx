import { useState } from "react";

const enrollments = [
  { id: "e1", student: "Kwame Asante", email: "k.asante@example.com", course: "Maritime Governance", status: "active" as const, progress: 45, enrolledDate: "Jan 12, 2026", lastAccess: "2 hours ago" },
  { id: "e2", student: "Kwame Asante", email: "k.asante@example.com", course: "Marine Casualty Investigation", status: "active" as const, progress: 12, enrolledDate: "Mar 20, 2026", lastAccess: "Yesterday" },
  { id: "e3", student: "Ama Serwaa Mensah", email: "a.mensah@gma.gov.gh", course: "Maritime Governance", status: "active" as const, progress: 72, enrolledDate: "Mar 5, 2026", lastAccess: "3 hours ago" },
  { id: "e4", student: "Kofi Asante Boateng", email: "k.boateng@navy.mil.gh", course: "Maritime Governance", status: "active" as const, progress: 60, enrolledDate: "Feb 20, 2026", lastAccess: "1 day ago" },
  { id: "e5", student: "Kofi Asante Boateng", email: "k.boateng@navy.mil.gh", course: "Marine Casualty Investigation", status: "active" as const, progress: 8, enrolledDate: "Apr 15, 2026", lastAccess: "3 days ago" },
  { id: "e6", student: "Fatima Ibrahim", email: "f.ibrahim@nimasa.gov.ng", course: "Maritime Governance", status: "active" as const, progress: 30, enrolledDate: "Apr 1, 2026", lastAccess: "5 hours ago" },
  { id: "e7", student: "Emmanuel Tetteh", email: "e.tetteh@tema-port.com", course: "Marine Casualty Investigation", status: "active" as const, progress: 5, enrolledDate: "Apr 22, 2026", lastAccess: "2 days ago" },
  { id: "e8", student: "James Owusu", email: "j.owusu@ucc.edu.gh", course: "Maritime Governance", status: "completed" as const, progress: 100, enrolledDate: "Jan 5, 2026", lastAccess: "Apr 20, 2026" },
];

const statusStyles: Record<string, string> = {
  active: "bg-green-50 text-green-700",
  completed: "bg-blue-50 text-brand-navy-muted",
  dropped: "bg-red-50 text-red-600",
};

export default function AdminEnrollmentsPage() {
  const [courseFilter, setCourseFilter] = useState("all");

  const filtered = courseFilter === "all" ? enrollments : enrollments.filter(e => e.course === courseFilter);

  return (
    <div>
      <div className="flex justify-between items-start mb-7">
        <div>
          <h1 className="text-[22px] font-semibold text-gray-800 mb-1">Enrollments</h1>
          <p className="text-[14px] text-gray-500">{enrollments.length} total enrollments across all courses.</p>
        </div>
        <button className="bg-gray-900 text-white rounded-md px-4 py-2.5 text-[13px] font-medium cursor-pointer hover:bg-gray-800 transition-colors">
          Enroll student
        </button>
      </div>

      <div className="flex gap-1.5 mb-5">
        {["all", "Maritime Governance", "Marine Casualty Investigation"].map(f => (
          <button key={f} onClick={() => setCourseFilter(f)} className={`px-3 py-1.5 rounded-md text-[13px] font-medium transition-colors cursor-pointer ${courseFilter === f ? "bg-gray-900 text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
            {f === "all" ? "All Courses" : f}
          </button>
        ))}
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left px-5 py-3 text-[12px] font-medium text-gray-500 uppercase tracking-wider">Student</th>
              <th className="text-left px-5 py-3 text-[12px] font-medium text-gray-500 uppercase tracking-wider">Course</th>
              <th className="text-left px-5 py-3 text-[12px] font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="text-left px-5 py-3 text-[12px] font-medium text-gray-500 uppercase tracking-wider">Progress</th>
              <th className="text-left px-5 py-3 text-[12px] font-medium text-gray-500 uppercase tracking-wider">Enrolled</th>
              <th className="text-left px-5 py-3 text-[12px] font-medium text-gray-500 uppercase tracking-wider">Last access</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(e => (
              <tr key={e.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                <td className="px-5 py-3.5">
                  <div className="text-[13px] font-medium text-gray-800">{e.student}</div>
                  <div className="text-[11.5px] text-gray-400">{e.email}</div>
                </td>
                <td className="px-5 py-3.5 text-[13px] text-gray-600">{e.course}</td>
                <td className="px-5 py-3.5"><span className={`text-[11px] font-semibold px-2 py-0.5 rounded capitalize ${statusStyles[e.status]}`}>{e.status}</span></td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-1.5 rounded-full bg-gray-200"><div className="h-full rounded-full bg-brand-teal" style={{ width: `${e.progress}%` }} /></div>
                    <span className="text-[12px] text-gray-600">{e.progress}%</span>
                  </div>
                </td>
                <td className="px-5 py-3.5 text-[13px] text-gray-500">{e.enrolledDate}</td>
                <td className="px-5 py-3.5 text-[13px] text-gray-500">{e.lastAccess}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
const stats = [
  { label: "Total Users", value: "342", change: "+18 this month", up: true },
  { label: "Active Courses", value: "2", change: "Maritime Governance, Marine Casualty", up: true },
  { label: "Total Enrollments", value: "98", change: "+12 this week", up: true },
  { label: "Revenue (GHS)", value: "21,000", change: "+4,500 this month", up: true },
  { label: "Completion Rate", value: "68%", change: "+3% from last cohort", up: true },
  { label: "Avg. Rating", value: "4.8", change: "Across all courses", up: true },
];

const recentEnrollments = [
  { name: "Ama Serwaa Mensah", email: "a.mensah@gma.gov.gh", course: "Maritime Governance", date: "Apr 25, 2026" },
  { name: "Kofi Asante Boateng", email: "k.boateng@navy.mil.gh", course: "Marine Casualty Investigation", date: "Apr 24, 2026" },
  { name: "Fatima Ibrahim", email: "f.ibrahim@nimasa.gov.ng", course: "Maritime Governance", date: "Apr 24, 2026" },
  { name: "Emmanuel Tetteh", email: "e.tetteh@tema-port.com", course: "Marine Casualty Investigation", date: "Apr 23, 2026" },
  { name: "Nana Agyeman", email: "n.agyeman@mofad.gov.gh", course: "Maritime Governance", date: "Apr 22, 2026" },
];

const recentActivity = [
  { action: "New enrollment", detail: "Ama Serwaa enrolled in Maritime Governance", time: "2 hours ago" },
  { action: "Assignment submitted", detail: "Kofi Boateng submitted SWOT Analysis Activity", time: "4 hours ago" },
  { action: "Course updated", detail: "Marine Casualty Investigation syllabus updated by admin", time: "6 hours ago" },
  { action: "Certificate issued", detail: "Certificate issued to James Owusu for Intro to Maritime", time: "1 day ago" },
  { action: "Payment received", detail: "GHS 500 from Emmanuel Tetteh for Marine Casualty", time: "1 day ago" },
  { action: "New user created", detail: "Account created for Dr. Aisha Bello (NIMASA)", time: "2 days ago" },
];

export default function AdminOverviewPage() {
  return (
    <div>
      <div className="mb-7">
        <h1 className="text-[22px] font-semibold text-gray-800 mb-1">Admin Dashboard</h1>
        <p className="text-[14px] text-gray-500">Overview of platform activity and key metrics.</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-3 gap-4 mb-7">
        {stats.map(stat => (
          <div key={stat.label} className="bg-white border border-gray-200 rounded-lg px-5 py-5">
            <div className="text-[12px] font-medium text-gray-500 uppercase tracking-wider mb-2">{stat.label}</div>
            <div className="text-[28px] font-semibold text-gray-800 leading-none">{stat.value}</div>
            <div className="text-[12.5px] text-green-600 mt-1.5">{stat.change}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-[1fr_380px] gap-6">
        {/* Recent enrollments table */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-[15px] font-semibold text-gray-800">Recent Enrollments</h2>
            <NavButton to="/admin/enrollments" label="View all" />
          </div>
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left px-5 py-3 text-[12px] font-medium text-gray-500 uppercase tracking-wider">Student</th>
                  <th className="text-left px-5 py-3 text-[12px] font-medium text-gray-500 uppercase tracking-wider">Course</th>
                  <th className="text-left px-5 py-3 text-[12px] font-medium text-gray-500 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentEnrollments.map((e, i) => (
                  <tr key={i} className="border-b border-gray-50 last:border-0">
                    <td className="px-5 py-3">
                      <div className="text-[13px] font-medium text-gray-800">{e.name}</div>
                      <div className="text-[11.5px] text-gray-400">{e.email}</div>
                    </td>
                    <td className="px-5 py-3 text-[13px] text-gray-600">{e.course}</td>
                    <td className="px-5 py-3 text-[13px] text-gray-500">{e.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Activity feed */}
        <div>
          <h2 className="text-[15px] font-semibold text-gray-800 mb-4">Recent Activity</h2>
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <div className="flex flex-col">
              {recentActivity.map((a, i) => (
                <div key={i} className={`py-3 ${i > 0 ? "border-t border-gray-100" : ""}`}>
                  <div className="text-[13px] font-medium text-gray-800">{a.action}</div>
                  <div className="text-[12.5px] text-gray-500 mt-0.5">{a.detail}</div>
                  <div className="text-[11px] text-gray-400 mt-1">{a.time}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Small inline component to avoid importing NavLink at page level for a simple text link
function NavButton({ to, label }: { to: string; label: string }) {
  return (
    <a href={to} className="text-[13px] font-medium text-brand-teal hover:underline">{label}</a>
  );
}
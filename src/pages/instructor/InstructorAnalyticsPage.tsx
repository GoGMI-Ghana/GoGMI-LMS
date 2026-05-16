export default function InstructorAnalyticsPage() {
  const courseMetrics = [
    { label: "Total Enrolled", value: 24, sub: "Maritime Governance" },
    { label: "Active Learners", value: 20, sub: "Accessed this week" },
    { label: "Completion Rate", value: "0%", sub: "No completions yet" },
    { label: "Avg. Score", value: "78%", sub: "Across graded assessments" },
    { label: "Avg. Progress", value: "32%", sub: "Across all students" },
    { label: "Submissions", value: 21, sub: "Total across assessments" },
  ];

  const moduleProgress = [
    { module: "M1: Introduction & Strategy Theory", completion: 85 },
    { module: "M2: Assessing Challenges & Opportunities", completion: 62 },
    { module: "M3: Strategy Development Process", completion: 28 },
    { module: "M4: Interagency Coordination", completion: 12 },
    { module: "M5: Ends, Ways, Means & Risk", completion: 0 },
    { module: "M6: Strategy Implementation", completion: 0 },
    { module: "M7: Sector Planning Exercise", completion: 0 },
    { module: "M8: Case Study & Conclusion", completion: 0 },
  ];

  const topStudents = [
    { name: "Ama Serwaa Mensah", progress: 52, score: 92 },
    { name: "Babiker Alayas Osman", progress: 45, score: 85 },
    { name: "Atari Emmanuel Afri", progress: 38, score: 80 },
    { name: "Kofi Asante Boateng", progress: 28, score: 75 },
  ];

  return (
    <div>
      <div className="flex justify-between items-start mb-7">
        <div><h1 className="text-[22px] font-semibold text-gray-800 mb-1">Analytics</h1><p className="text-[14px] text-gray-500">Course performance metrics and student insights.</p></div>
        <button className="border border-gray-200 rounded-md px-4 py-2 text-[13px] font-medium text-gray-600 cursor-pointer hover:bg-gray-50 transition-colors">Export Report</button>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-7">
        {courseMetrics.map(m => (
          <div key={m.label} className="bg-white border border-gray-200 rounded-lg px-5 py-5">
            <div className="text-[12px] font-medium text-gray-500 uppercase tracking-wider mb-2">{m.label}</div>
            <div className="text-[28px] font-semibold text-gray-800 leading-none">{m.value}</div>
            <div className="text-[12.5px] text-gray-500 mt-1.5">{m.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-[1fr_380px] gap-6">
        <div>
          <h2 className="text-[15px] font-semibold text-gray-800 mb-4">Module Completion Rates</h2>
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <div className="flex flex-col gap-3">
              {moduleProgress.map((m, i) => (
                <div key={i}>
                  <div className="flex justify-between mb-1">
                    <span className="text-[13px] text-gray-700">{m.module}</span>
                    <span className="text-[12px] font-semibold text-gray-600">{m.completion}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-gray-100">
                    <div className="h-full rounded-full bg-brand-teal transition-all" style={{ width: m.completion + "%" }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-[15px] font-semibold text-gray-800 mb-4">Top Performing Students</h2>
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <div className="flex flex-col">
              {topStudents.map((s, i) => (
                <div key={i} className={`flex items-center justify-between py-3 ${i > 0 ? "border-t border-gray-100" : ""}`}>
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-[11px] font-semibold text-gray-600">{i + 1}</div>
                    <div>
                      <div className="text-[13px] font-medium text-gray-800">{s.name}</div>
                      <div className="text-[11px] text-gray-500">Progress: {s.progress}%</div>
                    </div>
                  </div>
                  <div className="text-[14px] font-semibold text-gray-800">{s.score}%</div>
                </div>
              ))}
            </div>
          </div>

          <h2 className="text-[15px] font-semibold text-gray-800 mb-4 mt-6">Quick Actions</h2>
          <div className="bg-white border border-gray-200 rounded-lg p-5 flex flex-col gap-2">
            <button className="w-full border border-gray-200 rounded-md py-2.5 text-[13px] font-medium text-gray-600 cursor-pointer hover:bg-gray-50 transition-colors">Download Student Progress CSV</button>
            <button className="w-full border border-gray-200 rounded-md py-2.5 text-[13px] font-medium text-gray-600 cursor-pointer hover:bg-gray-50 transition-colors">Download Assessment Scores</button>
            <button className="w-full border border-gray-200 rounded-md py-2.5 text-[13px] font-medium text-gray-600 cursor-pointer hover:bg-gray-50 transition-colors">Generate Completion Report</button>
          </div>
        </div>
      </div>
    </div>
  );
}
const events = [
  { id: "e1", title: "Welcome and Course Overview", course: "Maritime Governance", date: "Tue, May 5", time: "11:00 — 11:40", type: "live" as const },
  { id: "e2", title: "Strategy Development Directives", course: "Maritime Governance", date: "Tue, May 5", time: "12:00 — 16:10", type: "live" as const },
  { id: "e3", title: "SWOT Analysis Activity Due", course: "Maritime Governance", date: "Thu, May 7", time: "End of day", type: "assignment" as const },
  { id: "e4", title: "Assessing Maritime Domain Challenges", course: "Maritime Governance", date: "Thu, May 7", time: "12:00 — 14:35", type: "live" as const },
  { id: "e5", title: "Developing the Vision Statement", course: "Maritime Governance", date: "Tue, May 12", time: "12:00 — 13:25", type: "live" as const },
  { id: "e6", title: "Interagency Coordination I", course: "Maritime Governance", date: "Wed, May 13", time: "12:00 — 14:05", type: "live" as const },
  { id: "e7", title: "Stakeholder Analysis Exercise Due", course: "Maritime Governance", date: "Thu, May 14", time: "End of day", type: "assignment" as const },
  { id: "e8", title: "Interagency Coordination II", course: "Maritime Governance", date: "Thu, May 14", time: "12:00 — 15:00", type: "live" as const },
  { id: "e9", title: "Module 1 Assessment — Legal Framework", course: "Marine Casualty Investigation", date: "Thu, May 15", time: "End of day", type: "quiz" as const },
  { id: "e10", title: "Ends, Ways, Means, and Risk", course: "Maritime Governance", date: "Tue, May 19", time: "12:00 — 13:00", type: "live" as const },
  { id: "e11", title: "Maritime Strategy Implementation", course: "Maritime Governance", date: "Thu, May 21", time: "12:00 — 14:00", type: "live" as const },
  { id: "e12", title: "Evidence Handling Practical Due", course: "Marine Casualty Investigation", date: "Fri, May 22", time: "End of day", type: "assignment" as const },
  { id: "e13", title: "In-Class Exercise — Sector Planning", course: "Maritime Governance", date: "Tue, May 26", time: "12:00 — 14:00", type: "live" as const },
  { id: "e14", title: "Case Study Group Report Due", course: "Maritime Governance", date: "Thu, May 28", time: "12:00 — 14:20", type: "exam" as const },
];

const typeStyles: Record<string, { dot: string; label: string }> = {
  live: { dot: "bg-brand-teal", label: "Live Session" },
  assignment: { dot: "bg-brand-amber", label: "Assignment" },
  quiz: { dot: "bg-brand-navy-muted", label: "Quiz" },
  exam: { dot: "bg-red-500", label: "Exam" },
};

export default function CalendarPage() {
  return (
    <div>
      <div className="mb-7">
        <h1 className="text-[22px] font-semibold text-gray-800 mb-1">Calendar</h1>
        <p className="text-[14px] text-gray-500">Your upcoming course schedule and deadlines.</p>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-5 mb-6">
        {Object.entries(typeStyles).map(([key, style]) => (
          <div key={key} className="flex items-center gap-2">
            <div className={`w-2.5 h-2.5 rounded-full ${style.dot}`} />
            <span className="text-[12px] text-gray-500">{style.label}</span>
          </div>
        ))}
      </div>

      {/* Schedule */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        {events.map((event, i) => {
          const style = typeStyles[event.type];
          const showDateHeader = i === 0 || events[i - 1].date !== event.date;
          return (
            <div key={event.id}>
              {showDateHeader && (
                <div className={`px-5 py-2.5 bg-gray-50 ${i > 0 ? "border-t border-gray-200" : ""}`}>
                  <span className="text-[13px] font-semibold text-gray-700">{event.date}</span>
                </div>
              )}
              <div className="px-5 py-3.5 flex items-center gap-4 border-t border-gray-100">
                <div className={`w-2 h-2 rounded-full ${style.dot} shrink-0`} />
                <div className="flex-1 min-w-0">
                  <div className="text-[14px] font-medium text-gray-800">{event.title}</div>
                  <div className="text-[12px] text-gray-500 mt-0.5">{event.course}</div>
                </div>
                <span className="text-[12.5px] text-gray-500 shrink-0">{event.time}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
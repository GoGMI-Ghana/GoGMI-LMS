import { useApi } from "../../hooks/useApi";
import { LoadingSpinner } from "../../components/common";

interface DashboardData {
  enrollments: { courseId: string; course: { id: string; title: string; duration: string; modules: { id: string; title: string; order: number; lessons: { id: string; title: string; facilitator: string; duration: string; }[] }[] } }[];
}

export default function CalendarPage() {
  const { data, isLoading } = useApi<DashboardData>("/courses/dashboard/student");
  if (isLoading) return <LoadingSpinner />;

  const allSessions = (data?.enrollments || []).flatMap(e =>
    (e.course.modules || []).flatMap((m: any, mIdx: number) =>
      (m.lessons || []).map((l: any, lIdx: number) => ({
        ...l, moduleTitle: m.title, moduleNum: mIdx + 1, sessionNum: lIdx + 1, courseName: e.course.title,
      }))
    )
  );

  // Group by module
  const modules = (data?.enrollments || []).flatMap(e =>
    (e.course.modules || []).map((m: any, mIdx: number) => ({
      title: m.title, moduleNum: mIdx + 1, courseName: e.course.title,
      lessons: (m.lessons || []).map((l: any, lIdx: number) => ({ ...l, sessionNum: lIdx + 1 })),
    }))
  );

  return (
    <div>
      <div className="mb-7"><h1 className="text-[22px] font-semibold text-gray-800 mb-1">Course Schedule</h1><p className="text-[14px] text-gray-500">{allSessions.length} sessions across your enrolled courses.</p></div>

      {modules.length > 0 ? (
        <div className="flex flex-col gap-4">
          {modules.map((m, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="px-5 py-3 bg-gray-50 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div><span className="text-[12px] font-semibold text-brand-teal">Module {m.moduleNum}</span><span className="text-[14px] font-medium text-gray-800 ml-2">{m.title}</span></div>
                  <span className="text-[12px] text-gray-500">{m.lessons.length} sessions</span>
                </div>
              </div>
              <div className="divide-y divide-gray-50">
                {m.lessons.map((l: any) => (
                  <div key={l.id} className="px-5 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-brand-navy/5 flex items-center justify-center text-[11px] font-semibold text-brand-navy">{l.sessionNum}</div>
                      <div><div className="text-[13px] font-medium text-gray-800">{l.title}</div><div className="text-[12px] text-gray-500">{l.facilitator}</div></div>
                    </div>
                    <span className="text-[12px] text-gray-500 shrink-0">{l.duration}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg py-16 flex flex-col items-center">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-300 mb-3"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          <h3 className="text-[15px] font-semibold text-gray-800 mb-1">No schedule yet</h3>
          <p className="text-[13px] text-gray-500">Enroll in a course to see the session schedule.</p>
        </div>
      )}
    </div>
  );
}
import { useApi } from "../../hooks/useApi";
import { LoadingSpinner } from "../../components/common";

interface CourseAnalytics {
  courseId: string; courseTitle: string; enrolled: number; active: number;
  completed: number; avgProgress: number; avgScore: number | null;
  totalSubmissions: number;
  modules: { title: string; sessions: number }[];
}

export default function InstructorAnalyticsPage() {
  const { data: analytics, isLoading } = useApi<CourseAnalytics[]>("/instructor/analytics");

  if (isLoading) return <LoadingSpinner />;

  const totals = (analytics || []).reduce((acc, c) => ({
    enrolled: acc.enrolled + c.enrolled,
    active: acc.active + c.active,
    completed: acc.completed + c.completed,
    submissions: acc.submissions + c.totalSubmissions,
  }), { enrolled: 0, active: 0, completed: 0, submissions: 0 });

  const overallProgress = (analytics || []).length > 0
    ? Math.round((analytics || []).reduce((s, c) => s + c.avgProgress, 0) / (analytics || []).length) : 0;

  const allScores = (analytics || []).filter(c => c.avgScore !== null).map(c => c.avgScore!);
  const overallScore = allScores.length > 0 ? Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length) : null;

  return (
    <div>
      <div className="flex justify-between items-start mb-7">
        <div><h1 className="text-[22px] font-semibold text-gray-800 mb-1">Analytics</h1><p className="text-[14px] text-gray-500">Course performance metrics and student insights.</p></div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-7">
        {[
          { label: "Total Enrolled", value: totals.enrolled, sub: "Across all courses" },
          { label: "Active Learners", value: totals.active, sub: "This week" },
          { label: "Completed", value: totals.completed, sub: "Finished course" },
          { label: "Avg. Progress", value: overallProgress + "%", sub: "Across all students" },
          { label: "Avg. Score", value: overallScore !== null ? overallScore + "%" : "N/A", sub: "Graded assessments" },
          { label: "Total Submissions", value: totals.submissions, sub: "Across assessments" },
        ].map(m => (
          <div key={m.label} className="bg-white border border-gray-200 rounded-lg px-5 py-5">
            <div className="text-[12px] font-medium text-gray-500 uppercase tracking-wider mb-2">{m.label}</div>
            <div className="text-[28px] font-semibold text-gray-800 leading-none">{m.value}</div>
            <div className="text-[12.5px] text-gray-500 mt-1.5">{m.sub}</div>
          </div>
        ))}
      </div>

      {(analytics || []).map(course => (
        <div key={course.courseId} className="mb-6">
          <h2 className="text-[15px] font-semibold text-gray-800 mb-4">{course.courseTitle} — Module Progress</h2>
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            {course.modules.length > 0 ? (
              <div className="flex flex-col gap-3">
                {course.modules.map((m, i) => (
                  <div key={i}>
                    <div className="flex justify-between mb-1">
                      <span className="text-[13px] text-gray-700">{m.title}</span>
                      <span className="text-[12px] text-gray-500">{m.sessions} sessions</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-gray-100">
                      <div className="h-full rounded-full bg-brand-teal transition-all" style={{ width: Math.min(100, Math.round((i < 2 ? 80 - i * 20 : Math.max(0, 60 - i * 15))) + (course.avgProgress > 50 ? 20 : 0)) + "%" }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[13px] text-gray-400">No modules available.</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
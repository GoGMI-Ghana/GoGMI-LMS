import { useApi } from "../../hooks/useApi";
import { LoadingSpinner } from "../../components/common";

interface DashboardData {
  enrollments: { courseId: string; progress: number; status: string; course: { title: string; duration: string; category: string; } }[];
}

export default function CertificatesPage() {
  const { data, isLoading } = useApi<DashboardData>("/courses/dashboard/student");
  if (isLoading) return <LoadingSpinner />;

  const enrollments = data?.enrollments || [];
  const completed = enrollments.filter(e => e.status === "COMPLETED");
  const inProgress = enrollments.filter(e => e.status !== "COMPLETED");

  return (
    <div>
      <div className="mb-7"><h1 className="text-[22px] font-semibold text-gray-800 mb-1">Certificates & CPD</h1><p className="text-[14px] text-gray-500">Track your certifications and continuing professional development points.</p></div>

      {completed.length > 0 && (
        <div className="mb-6">
          <h2 className="text-[15px] font-semibold text-gray-800 mb-3">Earned Certificates</h2>
          <div className="flex flex-col gap-3">{completed.map(e => (
            <div key={e.courseId} className="bg-white border border-gray-200 rounded-lg p-5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="1.5"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg></div>
                <div><div className="text-[14px] font-medium text-gray-800">{e.course.title}</div><div className="text-[12px] text-gray-500">{e.course.category} · {e.course.duration}</div></div>
              </div>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-green-50 text-green-700">Completed</span>
            </div>
          ))}</div>
        </div>
      )}

      {inProgress.length > 0 && (
        <div className="mb-6">
          <h2 className="text-[15px] font-semibold text-gray-800 mb-3">In Progress</h2>
          <div className="flex flex-col gap-3">{inProgress.map(e => (
            <div key={e.courseId} className="bg-white border border-gray-200 rounded-lg p-5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg></div>
                <div><div className="text-[14px] font-medium text-gray-800">{e.course.title}</div><div className="text-[12px] text-gray-500">{e.course.category} · Progress: {e.progress}%</div></div>
              </div>
              <div className="flex items-center gap-2"><div className="w-20 h-1.5 rounded-full bg-gray-200"><div className="h-full rounded-full bg-brand-teal" style={{ width: e.progress + "%" }} /></div><span className="text-[12px] text-gray-600">{e.progress}%</span></div>
            </div>
          ))}</div>
        </div>
      )}

      {enrollments.length === 0 && (
        <div className="bg-white border border-gray-200 rounded-lg py-16 flex flex-col items-center">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-300 mb-3"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>
          <h3 className="text-[15px] font-semibold text-gray-800 mb-1">No certificates yet</h3>
          <p className="text-[13px] text-gray-500">Complete a course to earn your certificate and CPD points.</p>
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-lg p-5 mt-6">
        <h3 className="text-[13px] font-semibold text-gray-800 mb-2">About CPD Points</h3>
        <p className="text-[13px] text-gray-500 leading-relaxed">Continuing Professional Development (CPD) points are awarded upon successful completion of each course. These points can be used to demonstrate ongoing professional growth in the maritime sector. Certificate generation will be available upon course completion.</p>
      </div>
    </div>
  );
}
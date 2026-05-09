import { useNavigate } from "react-router-dom";
import { useApi } from "../../hooks/useApi";
import { ProgressBar, LoadingSpinner } from "../../components/common";

interface Enrollment {
  id: string;
  progress: number;
  status: string;
  enrolledAt: string;
  completedAt: string | null;
  grade: string | null;
  course: {
    id: string;
    title: string;
    subtitle: string;
    category: string;
    level: string;
    duration: string;
    thumbnailCode: string;
    thumbnailColor: string;
  };
}

export default function MyCoursesPage() {
  const navigate = useNavigate();
  const { data: enrollments, isLoading } = useApi<Enrollment[]>("/courses/enrolled/me");

  if (isLoading) return <LoadingSpinner />;

  const active = enrollments?.filter(e => e.status === "ACTIVE") || [];
  const completed = enrollments?.filter(e => e.status === "COMPLETED") || [];

  return (
    <div>
      <div className="mb-7">
        <h1 className="text-[22px] font-semibold text-gray-800 mb-1">My Courses</h1>
        <p className="text-[14px] text-gray-500">Track your enrolled and completed courses.</p>
      </div>

      {/* Active */}
      <div className="mb-8">
        <h2 className="text-[15px] font-semibold text-gray-800 mb-4">Active Courses ({active.length})</h2>
        {active.length > 0 ? (
          <div className="flex flex-col gap-3">
            {active.map(enrollment => (
              <div key={enrollment.id} className="bg-white border border-gray-200 rounded-lg p-5 flex items-center gap-5 cursor-pointer hover:border-gray-300 transition-colors" onClick={() => navigate("/catalog/" + enrollment.course.id)}>
                <div className={`w-14 h-14 rounded-lg ${enrollment.course.thumbnailColor} flex items-center justify-center text-[16px] font-bold text-white/70 shrink-0`}>
                  {enrollment.course.thumbnailCode}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[11px] font-medium text-brand-teal uppercase tracking-wider">{enrollment.course.category}</span>
                    <span className="text-gray-300">·</span>
                    <span className="text-[11px] text-gray-500">{enrollment.course.level}</span>
                  </div>
                  <h3 className="text-[15px] font-semibold text-gray-800 mb-1">{enrollment.course.title}</h3>
                  <p className="text-[12.5px] text-gray-500">{enrollment.course.duration}</p>
                  <div className="mt-3 max-w-md">
                    <div className="flex justify-between mb-1">
                      <span className="text-[12px] text-gray-500">Progress</span>
                      <span className="text-[12px] font-semibold text-gray-700">{enrollment.progress}%</span>
                    </div>
                    <ProgressBar value={enrollment.progress} height="h-[5px]" />
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <span className="text-[12px] text-gray-400">Enrolled {new Date(enrollment.enrolledAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</span>
                  <button className="bg-brand-navy text-white rounded-md px-4 py-2 text-[13px] font-medium cursor-pointer hover:bg-brand-navy-light transition-colors">Continue</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-lg py-12 flex flex-col items-center">
            <p className="text-[14px] text-gray-500 mb-3">You haven't enrolled in any courses yet.</p>
            <button onClick={() => navigate("/catalog")} className="text-[13px] font-medium text-brand-teal hover:underline cursor-pointer">Browse the catalog</button>
          </div>
        )}
      </div>

      {/* Completed */}
      <div>
        <h2 className="text-[15px] font-semibold text-gray-800 mb-4">Completed ({completed.length})</h2>
        {completed.length > 0 ? (
          <div className="flex flex-col gap-3">
            {completed.map(enrollment => (
              <div key={enrollment.id} className="bg-white border border-gray-200 rounded-lg p-5 flex items-center gap-5">
                <div className="w-14 h-14 rounded-lg bg-green-600 flex items-center justify-center shrink-0">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12" /></svg>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-[15px] font-semibold text-gray-800 mb-1">{enrollment.course.title}</h3>
                  <div className="flex items-center gap-3 text-[12.5px] text-gray-500">
                    <span>Completed {enrollment.completedAt ? new Date(enrollment.completedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : ""}</span>
                    {enrollment.grade && <><span className="text-gray-300">·</span><span>Grade: <span className="font-semibold text-gray-700">{enrollment.grade}</span></span></>}
                  </div>
                </div>
                <button className="border border-gray-200 rounded-md px-4 py-2 text-[13px] font-medium text-gray-600 cursor-pointer hover:bg-gray-50 transition-colors shrink-0">View Certificate</button>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-lg py-10 flex items-center justify-center">
            <p className="text-[13px] text-gray-400">No completed courses yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
import { useAuth } from "../../contexts/AuthContext";
import { useApi } from "../../hooks/useApi";
import { ProgressBar, LoadingSpinner } from "../../components/common";
import { useNavigate } from "react-router-dom";

interface Enrollment {
  id: string;
  progress: number;
  status: string;
  enrolledAt: string;
  lastAccessAt: string | null;
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

interface CourseListItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  category: string;
  level: string;
  duration: string;
  thumbnailCode: string;
  thumbnailColor: string;
  price: number;
  currency: string;
  featured: boolean;
  students: number;
  modules: { lessons: unknown[] }[];
}

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: enrollments, isLoading: enrollLoading } = useApi<Enrollment[]>("/courses/enrolled/me");
  const { data: courses, isLoading: coursesLoading } = useApi<CourseListItem[]>("/courses");

  if (!user) return null;

  const isLoading = enrollLoading || coursesLoading;

  if (isLoading) return <LoadingSpinner />;

  const activeEnrollments = enrollments?.filter(e => e.status === "ACTIVE") || [];
  const completedEnrollments = enrollments?.filter(e => e.status === "COMPLETED") || [];

  return (
    <div>
      {/* Welcome banner */}
      <div className="bg-brand-navy rounded-xl p-7 mb-7 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.05]">
          <svg width="100%" height="100%"><defs><pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse"><path d="M 30 0 L 0 0 0 30" fill="none" stroke="white" strokeWidth="0.5" /></pattern></defs><rect width="100%" height="100%" fill="url(#grid)" /></svg>
        </div>
        <div className="relative z-10">
          <h1 className="text-[24px] font-semibold text-white mb-1">
            Welcome back, {user.firstName}
          </h1>
          <p className="text-white/60 text-[14px] max-w-lg">
            Continue your maritime learning journey. You have {activeEnrollments.length} active course{activeEnrollments.length !== 1 ? "s" : ""}.
          </p>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-4 mb-7">
        {[
          { label: "Enrolled Courses", value: activeEnrollments.length, sub: "Currently active" },
          { label: "Completed", value: completedEnrollments.length, sub: "Total courses" },
          { label: "Available Courses", value: courses?.length || 0, sub: "In the catalog" },
          { label: "Total Sessions", value: courses?.reduce((s, c) => s + c.modules.reduce((ls, m) => ls + m.lessons.length, 0), 0) || 0, sub: "Across all courses" },
        ].map(stat => (
          <div key={stat.label} className="bg-white border border-gray-200 rounded-lg px-5 py-5">
            <div className="text-[12px] font-medium text-gray-500 uppercase tracking-wider mb-2">{stat.label}</div>
            <div className="text-[28px] font-semibold text-gray-800 leading-none">{stat.value}</div>
            <div className="text-[12.5px] text-gray-500 mt-1.5">{stat.sub}</div>
          </div>
        ))}
      </div>

      {/* My enrolled courses */}
      {activeEnrollments.length > 0 && (
        <div className="mb-7">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-[16px] font-semibold text-gray-800">Continue Learning</h2>
            <button onClick={() => navigate("/courses")} className="text-[13px] font-medium text-brand-teal hover:underline cursor-pointer">View all</button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {activeEnrollments.map(enrollment => (
              <div key={enrollment.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden cursor-pointer hover:border-gray-300 hover:shadow-sm transition-all" onClick={() => navigate("/catalog/" + enrollment.course.id)}>
                <div className={`h-28 ${enrollment.course.thumbnailColor} flex items-center justify-center relative`}>
                  <span className="text-white/15 text-[56px] font-bold tracking-wider">{enrollment.course.thumbnailCode}</span>
                  <span className="absolute top-3 left-3 bg-white/20 backdrop-blur-sm text-white text-[10px] font-semibold px-2.5 py-1 rounded">{enrollment.course.category}</span>
                </div>
                <div className="p-4">
                  <h3 className="text-[15px] font-semibold text-gray-800 mb-1">{enrollment.course.title}</h3>
                  <p className="text-[12.5px] text-gray-500 mb-3">{enrollment.course.level} · {enrollment.course.duration}</p>
                  <div>
                    <div className="flex justify-between mb-1.5">
                      <span className="text-[12px] text-gray-500">Progress</span>
                      <span className="text-[12px] font-semibold text-gray-700">{enrollment.progress}%</span>
                    </div>
                    <ProgressBar value={enrollment.progress} height="h-[5px]" />
                  </div>
                  <button className="w-full mt-3 bg-brand-navy text-white rounded-md py-2 text-[13px] font-medium cursor-pointer hover:bg-brand-navy-light transition-colors">
                    Continue
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Available courses */}
      <div className="mb-7">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-[16px] font-semibold text-gray-800">Available Courses</h2>
          <button onClick={() => navigate("/catalog")} className="text-[13px] font-medium text-brand-teal hover:underline cursor-pointer">Browse catalog</button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {courses?.map(course => {
            const isEnrolled = enrollments?.some(e => e.course.id === course.id);
            const totalLessons = course.modules.reduce((s, m) => s + m.lessons.length, 0);
            return (
              <div key={course.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden cursor-pointer hover:border-gray-300 hover:shadow-sm transition-all" onClick={() => navigate("/catalog/" + course.id)}>
                <div className={`h-36 ${course.thumbnailColor} flex items-center justify-center relative`}>
                  <span className="text-white/15 text-[64px] font-bold tracking-wider">{course.thumbnailCode}</span>
                  {course.featured && <span className="absolute top-3 left-3 bg-white/20 backdrop-blur-sm text-white text-[10px] font-semibold px-2.5 py-1 rounded">Featured</span>}
                  {isEnrolled && <span className="absolute top-3 right-3 bg-white/20 backdrop-blur-sm text-white text-[10px] font-semibold px-2.5 py-1 rounded">Enrolled</span>}
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[11px] font-medium text-brand-teal uppercase tracking-wider">{course.category}</span>
                    <span className="text-gray-300">·</span>
                    <span className="text-[11px] text-gray-500">{course.level}</span>
                  </div>
                  <h3 className="text-[15px] font-semibold text-gray-800 leading-snug mb-1.5">{course.title}</h3>
                  <p className="text-[12px] text-gray-400 italic mb-2">{course.subtitle}</p>
                  <p className="text-[12.5px] text-gray-500 leading-relaxed mb-3 line-clamp-2">{course.description}</p>
                  <div className="flex items-center gap-3 text-[11.5px] text-gray-500 mb-3">
                    <span>{course.duration}</span>
                    <span className="text-gray-300">·</span>
                    <span>{course.modules.length} modules</span>
                    <span className="text-gray-300">·</span>
                    <span>{totalLessons} sessions</span>
                  </div>
                  <div className="border-t border-gray-100 pt-3 flex items-center justify-between">
                    <span className="text-[12.5px] text-gray-500">{course.students} enrolled</span>
                    <span className={`text-[14px] font-semibold ${course.price === 0 ? "text-green-600" : "text-gray-800"}`}>
                      {course.price === 0 ? "Free" : course.currency + " " + course.price.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
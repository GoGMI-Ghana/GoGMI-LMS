import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useApi } from "../../hooks/useApi";
import { ProgressBar, LoadingSpinner } from "../../components/common";

interface Enrollment {
  courseId: string; progress: number; status: string; enrolledAt: string;
  course: { id: string; title: string; subtitle: string; category: string; thumbnailImage: string | null; thumbnailCode: string; thumbnailColor: string; duration: string; totalLessons: number; facilitator: string; };
}

interface Assessment { id: string; title: string; type: string; dueDate: string; maxScore: number; course: string; }
interface Score { title: string; score: number; maxScore: number; }
interface Announcement { id: string; title: string; content: string; author: string; createdAt: string; }

interface DashboardData {
  stats: { enrolledCourses: number; completedCourses: number; avgProgress: number; totalAssessments: number; upcomingDeadlines: number; };
  enrollments: Enrollment[];
  upcomingAssessments: Assessment[];
  recentScores: Score[];
  announcements: Announcement[];
}

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data, isLoading } = useApi<DashboardData>("/courses/dashboard/student");

  if (!user) return null;
  if (isLoading) return <LoadingSpinner />;

  const stats = data?.stats;
  const enrollments = data?.enrollments || [];
  const upcoming = data?.upcomingAssessments || [];
  const scores = data?.recentScores || [];
  const announcements = data?.announcements || [];

  const typeColors: Record<string, string> = { QUIZ: "bg-blue-50 text-blue-700", ASSIGNMENT: "bg-brand-amber-light text-brand-amber", EXAM: "bg-red-50 text-red-600" };

  return (
    <div>
      {/* Welcome banner */}
      <div className="bg-brand-navy rounded-xl p-7 mb-7 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]"><svg width="100%" height="100%"><defs><pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" /></pattern></defs><rect width="100%" height="100%" fill="url(#grid)" /></svg></div>
        <div className="relative z-10">
          <h1 className="text-[24px] font-semibold text-white mb-1">Welcome back, {user.firstName}</h1>
          <p className="text-white/60 text-[14px]">
            {enrollments.length > 0
              ? "You're enrolled in " + enrollments.length + " course" + (enrollments.length !== 1 ? "s" : "") + ". Keep up the great work!"
              : "Browse the course catalog to find your next maritime course."}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-7">
        {[
          { label: "Enrolled Courses", value: stats?.enrolledCourses || 0, icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>' },
          { label: "Avg. Progress", value: (stats?.avgProgress || 0) + "%", icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>' },
          { label: "Assessments Done", value: stats?.totalAssessments || 0, icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>' },
          { label: "Upcoming Deadlines", value: stats?.upcomingDeadlines || 0, icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>' },
        ].map(s => (
          <div key={s.label} className="bg-white border border-gray-200 rounded-lg px-5 py-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[12px] font-medium text-gray-500 uppercase tracking-wider">{s.label}</span>
              <span className="text-brand-teal opacity-60" dangerouslySetInnerHTML={{ __html: s.icon }} />
            </div>
            <div className="text-[28px] font-semibold text-gray-800 leading-none">{s.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-[1fr_360px] gap-6">
        {/* Main content */}
        <div>
          {/* Continue Learning */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-[15px] font-semibold text-gray-800">
              {enrollments.length > 0 ? "Continue Learning" : "Get Started"}
            </h2>
            {enrollments.length > 0 && (
              <button onClick={() => navigate("/courses")} className="text-[13px] font-medium text-brand-teal hover:underline cursor-pointer">View all</button>
            )}
          </div>

          {enrollments.length > 0 ? (
            <div className="flex flex-col gap-3">
              {enrollments.slice(0, 4).map(e => (
                <div key={e.courseId} onClick={() => navigate("/catalog/" + e.courseId)} className="bg-white border border-gray-200 rounded-lg p-4 flex items-center gap-4 cursor-pointer hover:border-gray-300 transition-all">
                  {e.course.thumbnailImage ? (
                    <div className="w-20 h-16 rounded-md overflow-hidden shrink-0"><img src={e.course.thumbnailImage} alt="" className="w-full h-full object-cover" /></div>
                  ) : (
                    <div className={`w-20 h-16 rounded-md ${e.course.thumbnailColor || "bg-brand-navy"} flex items-center justify-center shrink-0`}><span className="text-white/20 text-[18px] font-bold">{e.course.thumbnailCode}</span></div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[11px] font-medium text-brand-teal uppercase tracking-wider">{e.course.category}</span>
                    </div>
                    <h3 className="text-[14px] font-medium text-gray-800 truncate">{e.course.title}</h3>
                    <div className="text-[12px] text-gray-500 mt-0.5">{e.course.facilitator} · {e.course.totalLessons} sessions</div>
                  </div>
                  <div className="w-28 shrink-0">
                    <div className="flex justify-between text-[11px] mb-1"><span className="text-gray-500">Progress</span><span className="font-semibold text-gray-700">{e.progress}%</span></div>
                    <ProgressBar value={e.progress} height="h-[4px]" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-lg py-12 flex flex-col items-center">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-300 mb-3"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
              <h3 className="text-[15px] font-semibold text-gray-800 mb-1">No courses yet</h3>
              <p className="text-[13px] text-gray-500 mb-4">Browse available courses and enroll to get started.</p>
              <button onClick={() => navigate("/catalog")} className="bg-brand-navy text-white rounded-md px-5 py-2 text-[13px] font-medium cursor-pointer hover:bg-brand-navy-light transition-colors">Browse Courses</button>
            </div>
          )}

          {/* Recent Scores */}
          {scores.length > 0 && (
            <div className="mt-6">
              <h2 className="text-[15px] font-semibold text-gray-800 mb-4">Recent Scores</h2>
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead><tr className="border-b border-gray-100">
                    <th className="text-left px-5 py-3 text-[12px] font-medium text-gray-500 uppercase tracking-wider">Assessment</th>
                    <th className="text-right px-5 py-3 text-[12px] font-medium text-gray-500 uppercase tracking-wider">Score</th>
                  </tr></thead>
                  <tbody>{scores.map((s, i) => (
                    <tr key={i} className="border-b border-gray-50 last:border-0">
                      <td className="px-5 py-3 text-[13px] text-gray-800">{s.title}</td>
                      <td className="px-5 py-3 text-right">
                        <span className={`text-[13px] font-semibold ${s.score >= 70 ? "text-green-600" : s.score >= 50 ? "text-brand-amber" : "text-red-600"}`}>{s.score}%</span>
                        <span className="text-[11px] text-gray-400 ml-1">/ {s.maxScore}</span>
                      </td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-5">
          {/* Upcoming Assessments */}
          <div>
            <h2 className="text-[15px] font-semibold text-gray-800 mb-4">Upcoming Deadlines</h2>
            {upcoming.length > 0 ? (
              <div className="bg-white border border-gray-200 rounded-lg p-5">
                <div className="flex flex-col">{upcoming.map((a, i) => (
                  <div key={a.id} className={`py-3 ${i > 0 ? "border-t border-gray-100" : ""}`}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${typeColors[a.type] || "bg-gray-100 text-gray-600"}`}>{a.type}</span>
                    </div>
                    <div className="text-[13px] font-medium text-gray-800">{a.title}</div>
                    <div className="text-[12px] text-gray-500 mt-0.5">{a.course} · Due {new Date(a.dueDate).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}</div>
                  </div>
                ))}</div>
              </div>
            ) : (
              <div className="bg-white border border-gray-200 rounded-lg py-8 flex items-center justify-center">
                <p className="text-[13px] text-gray-400">No upcoming deadlines</p>
              </div>
            )}
          </div>

          {/* Announcements */}
          <div>
            <h2 className="text-[15px] font-semibold text-gray-800 mb-4">Announcements</h2>
            {announcements.length > 0 ? (
              <div className="bg-white border border-gray-200 rounded-lg p-5">
                <div className="flex flex-col">{announcements.map((a, i) => (
                  <div key={a.id} className={`py-3 ${i > 0 ? "border-t border-gray-100" : ""}`}>
                    <div className="text-[13px] font-semibold text-gray-800 mb-0.5">{a.title}</div>
                    <p className="text-[12px] text-gray-500 leading-relaxed line-clamp-2">{a.content}</p>
                    <div className="text-[11px] text-gray-400 mt-1">{a.author} · {new Date(a.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}</div>
                  </div>
                ))}</div>
              </div>
            ) : (
              <div className="bg-white border border-gray-200 rounded-lg py-8 flex items-center justify-center">
                <p className="text-[13px] text-gray-400">No announcements</p>
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <h3 className="text-[13px] font-semibold text-gray-800 mb-3">Quick Links</h3>
            <div className="flex flex-col gap-2">
              {[
                { label: "Browse Courses", to: "/catalog" },
                { label: "My Courses", to: "/courses" },
                { label: "Discussions", to: "/discussions" },
                { label: "Certificates & CPD", to: "/certificates" },
              ].map(link => (
                <button key={link.to} onClick={() => navigate(link.to)} className="text-left text-[13px] text-brand-teal font-medium hover:underline cursor-pointer">{link.label}</button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
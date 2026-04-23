import {
  StatCard, CourseCard, UpcomingPanel, AnnouncementsPanel, CPDWidget,
} from "../../components/dashboard";
import { currentUser, enrolledCourses, upcomingItems, announcements } from "../../data/mock";

export default function DashboardPage() {
  const avgProgress = enrolledCourses.length > 0
    ? Math.round(enrolledCourses.reduce((sum, c) => sum + c.progress, 0) / enrolledCourses.length)
    : 0;

  return (
    <>
      <div className="mb-7">
        <h1 className="text-[22px] font-semibold text-gray-800 mb-1">Welcome back, {currentUser.firstName}</h1>
        <p className="text-[14px] text-gray-500">Here's what's happening with your learning today.</p>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-7">
        <StatCard label="Enrolled Courses" value={currentUser.enrolledCount} sub="Currently active" />
        <StatCard label="Completed" value={currentUser.completedCount} sub="Total courses" />
        <StatCard label="CPD Points" value={currentUser.cpdPoints} sub={`of ${currentUser.cpdTarget} target`} />
        <StatCard label="Avg. Progress" value={`${avgProgress}%`} sub="Across active courses" />
      </div>

      <div className="grid grid-cols-[1fr_380px] gap-6">
        <div className="flex flex-col gap-6">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-[16px] font-semibold text-gray-800">My Courses</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {enrolledCourses.map(course => <CourseCard key={course.id} course={course} />)}
            </div>
          </div>
          <AnnouncementsPanel items={announcements} />
        </div>
        <div className="flex flex-col gap-5">
          <CPDWidget current={currentUser.cpdPoints} target={currentUser.cpdTarget} />
          <UpcomingPanel items={upcomingItems} />
        </div>
      </div>
    </>
  );
}
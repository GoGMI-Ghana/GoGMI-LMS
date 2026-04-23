import { ProgressBar } from "../../components/common";
import { enrolledCourses, catalogCourses } from "../../data/mock";

export default function MyCoursesPage() {
  const completed = [
    { id: "crs_000", title: "Introduction to the Maritime Industry", instructor: "Hassanatu Abdulai", completedDate: "Jan 15, 2026", grade: "92%", cpdPoints: 5 },
  ];

  return (
    <div>
      <div className="mb-7">
        <h1 className="text-[22px] font-semibold text-gray-800 mb-1">My Courses</h1>
        <p className="text-[14px] text-gray-500">Track your enrolled and completed courses.</p>
      </div>

      {/* Active Courses */}
      <div className="mb-8">
        <h2 className="text-[15px] font-semibold text-gray-800 mb-4">Active Courses ({enrolledCourses.length})</h2>
        <div className="flex flex-col gap-3">
          {enrolledCourses.map(course => {
            const catalog = catalogCourses.find(c => c.id === course.id);
            return (
              <div key={course.id} className="bg-white border border-gray-200 rounded-lg p-5 flex items-center gap-5">
                <div className={`w-14 h-14 rounded-lg ${course.category === "Governance" ? "bg-brand-navy" : "bg-brand-teal"} flex items-center justify-center text-[16px] font-bold text-white/70 shrink-0`}>
                  {course.thumbnail}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[11px] font-medium text-brand-teal uppercase tracking-wider">{course.category}</span>
                    {catalog && <><span className="text-gray-300">·</span><span className="text-[11px] text-gray-500">{catalog.level}</span></>}
                  </div>
                  <h3 className="text-[15px] font-semibold text-gray-800 mb-1">{course.title}</h3>
                  <p className="text-[13px] text-gray-500">{course.instructor}</p>
                  <div className="mt-3 max-w-md">
                    <div className="flex justify-between mb-1">
                      <span className="text-[12px] text-gray-500">Progress</span>
                      <span className="text-[12px] font-semibold text-gray-700">{course.progress}%</span>
                    </div>
                    <ProgressBar value={course.progress} height="h-[5px]" />
                  </div>
                  <div className="text-[12.5px] text-gray-400 mt-2">
                    Next: <span className="text-gray-600">{course.nextLesson}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <span className="text-[12px] text-gray-400">{course.lastAccessed}</span>
                  <button className="bg-brand-navy text-white rounded-md px-4 py-2 text-[13px] font-medium cursor-pointer hover:bg-brand-navy-light transition-colors">
                    Continue
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Completed */}
      <div>
        <h2 className="text-[15px] font-semibold text-gray-800 mb-4">Completed ({completed.length})</h2>
        <div className="flex flex-col gap-3">
          {completed.map(course => (
            <div key={course.id} className="bg-white border border-gray-200 rounded-lg p-5 flex items-center gap-5">
              <div className="w-14 h-14 rounded-lg bg-green-600 flex items-center justify-center shrink-0">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12" /></svg>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-[15px] font-semibold text-gray-800 mb-1">{course.title}</h3>
                <p className="text-[13px] text-gray-500">{course.instructor}</p>
                <div className="flex items-center gap-4 mt-2 text-[12.5px] text-gray-500">
                  <span>Completed {course.completedDate}</span>
                  <span className="text-gray-300">·</span>
                  <span>Grade: <span className="font-semibold text-gray-700">{course.grade}</span></span>
                  <span className="text-gray-300">·</span>
                  <span>CPD: <span className="font-semibold text-brand-teal">{course.cpdPoints} points</span></span>
                </div>
              </div>
              <button className="border border-gray-200 rounded-md px-4 py-2 text-[13px] font-medium text-gray-600 cursor-pointer hover:bg-gray-50 transition-colors shrink-0">
                View Certificate
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
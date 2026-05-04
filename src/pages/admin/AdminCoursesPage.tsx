import { catalogCourses } from "../../data/mock";

export default function AdminCoursesPage() {
  return (
    <div>
      <div className="flex justify-between items-start mb-7">
        <div>
          <h1 className="text-[22px] font-semibold text-gray-800 mb-1">Course Management</h1>
          <p className="text-[14px] text-gray-500">{catalogCourses.length} courses on the platform.</p>
        </div>
        <button className="bg-gray-900 text-white rounded-md px-4 py-2.5 text-[13px] font-medium cursor-pointer hover:bg-gray-800 transition-colors">
          Create course
        </button>
      </div>

      <div className="flex flex-col gap-4">
        {catalogCourses.map(course => (
          <div key={course.id} className="bg-white border border-gray-200 rounded-lg p-5 flex items-center gap-5">
            <div className={`w-14 h-14 rounded-lg ${course.thumbnailColor} flex items-center justify-center text-[16px] font-bold text-white/70 shrink-0`}>
              {course.thumbnailCode}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[11px] font-medium text-brand-teal uppercase tracking-wider">{course.category}</span>
                <span className="text-gray-300">·</span>
                <span className="text-[11px] text-gray-500">{course.level}</span>
                {course.featured && <span className="ml-1 bg-brand-amber-light text-brand-amber text-[10px] font-semibold px-1.5 py-0.5 rounded">Featured</span>}
              </div>
              <h3 className="text-[15px] font-semibold text-gray-800 mb-1">{course.title}</h3>
              <div className="flex items-center gap-4 text-[12.5px] text-gray-500">
                <span>{course.instructor}</span>
                <span className="text-gray-300">·</span>
                <span>{course.modules} modules</span>
                <span className="text-gray-300">·</span>
                <span>{course.students} enrolled</span>
                <span className="text-gray-300">·</span>
                <span>{course.duration}</span>
                <span className="text-gray-300">·</span>
                <span className={course.price === 0 ? "text-green-600 font-medium" : ""}>{course.price === 0 ? "Free" : `GHS ${course.price}`}</span>
              </div>
            </div>
            <div className="flex gap-2 shrink-0">
              <button className="border border-gray-200 rounded-md px-3.5 py-1.5 text-[12.5px] font-medium text-gray-600 cursor-pointer hover:bg-gray-50 transition-colors">Edit</button>
              <button className="border border-gray-200 rounded-md px-3.5 py-1.5 text-[12.5px] font-medium text-gray-600 cursor-pointer hover:bg-gray-50 transition-colors">Manage</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
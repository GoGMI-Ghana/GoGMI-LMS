import { useNavigate } from "react-router-dom";

const courses = [
  {
    id: "crs_maritime_governance",
    title: "Maritime Governance",
    subtitle: "Maritime Security Strategy Development and Implementation",
    students: 24,
    modules: 8,
    sessions: 27,
    progress: 32,
    status: "active" as const,
    nextSession: "Module 3: Strategy Development Process — May 14, 2026",
  },
];

export default function InstructorCoursesPage() {
  const navigate = useNavigate();

  return (
    <div>
      <div className="mb-7">
        <h1 className="text-[22px] font-semibold text-gray-800 mb-1">My Courses</h1>
        <p className="text-[14px] text-gray-500">Courses you facilitate. Click to manage content, students, and assessments.</p>
      </div>

      <div className="flex flex-col gap-4">
        {courses.map(course => (
          <div key={course.id} onClick={() => navigate("/instructor/courses/" + course.id)} className="bg-white border border-gray-200 rounded-lg p-6 cursor-pointer hover:border-gray-300 hover:shadow-sm transition-all">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${course.status === "active" ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-600"}`}>{course.status === "active" ? "Active" : "Draft"}</span>
                </div>
                <h2 className="text-[18px] font-semibold text-gray-800 mb-0.5">{course.title}</h2>
                <p className="text-[13px] text-gray-400 italic">{course.subtitle}</p>
              </div>
              <button className="border border-gray-200 rounded-md px-4 py-2 text-[13px] font-medium text-gray-600 cursor-pointer hover:bg-gray-50 transition-colors">Manage</button>
            </div>
            <div className="grid grid-cols-4 gap-4 mb-4">
              {[
                { label: "Students", value: course.students },
                { label: "Modules", value: course.modules },
                { label: "Sessions", value: course.sessions },
                { label: "Avg. Progress", value: course.progress + "%" },
              ].map(s => (
                <div key={s.label} className="bg-gray-50 rounded-md px-4 py-3">
                  <div className="text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1">{s.label}</div>
                  <div className="text-[20px] font-semibold text-gray-800">{s.value}</div>
                </div>
              ))}
            </div>
            <div className="bg-blue-50 rounded-md px-4 py-3">
              <div className="text-[11px] font-medium text-blue-600 uppercase tracking-wider mb-0.5">Next Session</div>
              <div className="text-[13px] text-gray-800">{course.nextSession}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
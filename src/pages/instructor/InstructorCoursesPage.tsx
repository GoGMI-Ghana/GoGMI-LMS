import { useNavigate } from "react-router-dom";
import { useApi } from "../../hooks/useApi";
import { LoadingSpinner } from "../../components/common";

interface Course {
  id: string; title: string; subtitle: string; category: string; level: string;
  duration: string; thumbnailCode: string; thumbnailColor: string; published: boolean;
  students: number; assessmentCount: number; totalSessions: number; avgProgress: number;
  modules: { id: string; title: string; order: number; _count: { lessons: number } }[];
}

export default function InstructorCoursesPage() {
  const navigate = useNavigate();
  const { data: courses, isLoading } = useApi<Course[]>("/instructor/courses");

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      <div className="mb-7">
        <h1 className="text-[22px] font-semibold text-gray-800 mb-1">My Courses</h1>
        <p className="text-[14px] text-gray-500">Courses you facilitate. Click to manage content, students, and assessments.</p>
      </div>

      {(courses?.length || 0) > 0 ? (
        <div className="flex flex-col gap-4">
          {courses!.map(course => (
            <div key={course.id} onClick={() => navigate("/instructor/courses/" + course.id)} className="bg-white border border-gray-200 rounded-lg p-6 cursor-pointer hover:border-gray-300 hover:shadow-sm transition-all">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${course.published ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-600"}`}>{course.published ? "Active" : "Draft"}</span>
                    <span className="text-[11px] text-gray-500">{course.category} · {course.level}</span>
                  </div>
                  <h2 className="text-[18px] font-semibold text-gray-800 mb-0.5">{course.title}</h2>
                  {course.subtitle && <p className="text-[13px] text-gray-400 italic">{course.subtitle}</p>}
                </div>
                <button className="border border-gray-200 rounded-md px-4 py-2 text-[13px] font-medium text-gray-600 cursor-pointer hover:bg-gray-50 transition-colors" onClick={e => { e.stopPropagation(); navigate("/instructor/courses/" + course.id); }}>Manage</button>
              </div>
              <div className="grid grid-cols-4 gap-4">
                {[
                  { label: "Students", value: course.students },
                  { label: "Modules", value: course.modules.length },
                  { label: "Sessions", value: course.totalSessions },
                  { label: "Avg. Progress", value: course.avgProgress + "%" },
                ].map(s => (
                  <div key={s.label} className="bg-gray-50 rounded-md px-4 py-3">
                    <div className="text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1">{s.label}</div>
                    <div className="text-[20px] font-semibold text-gray-800">{s.value}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg py-16 flex flex-col items-center">
          <h3 className="text-[15px] font-semibold text-gray-800 mb-1">No courses assigned</h3>
          <p className="text-[13px] text-gray-500">Courses will appear here once assigned by an administrator.</p>
        </div>
      )}
    </div>
  );
}
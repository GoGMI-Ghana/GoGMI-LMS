import { useApi } from "../../hooks/useApi";
import { api } from "../../services/api";
import { LoadingSpinner } from "../../components/common";

interface Course { id: string; title: string; category: string; level: string; published: boolean; price: number; currency: string; duration: string; thumbnailCode: string; thumbnailColor: string; students: number; assessments: number; modules: number; instructor: string | null; }

export default function AdminCoursesPage() {
  const { data: courses, isLoading, refetch } = useApi<Course[]>("/admin/courses");
  if (isLoading) return <LoadingSpinner />;

  const togglePublish = async (id: string, published: boolean) => {
    try { await api.patch("/admin/courses/" + id, { published: !published }); refetch(); } catch {}
  };

  return (
    <div>
      <div className="mb-7"><h1 className="text-[22px] font-semibold text-gray-800 mb-1">Courses</h1><p className="text-[14px] text-gray-500">{(courses || []).length} courses on the platform</p></div>
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead><tr className="border-b border-gray-100">
            <th className="text-left px-5 py-3 text-[12px] font-medium text-gray-500 uppercase tracking-wider">Course</th>
            <th className="text-left px-5 py-3 text-[12px] font-medium text-gray-500 uppercase tracking-wider">Category</th>
            <th className="text-left px-5 py-3 text-[12px] font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="text-left px-5 py-3 text-[12px] font-medium text-gray-500 uppercase tracking-wider">Students</th>
            <th className="text-left px-5 py-3 text-[12px] font-medium text-gray-500 uppercase tracking-wider">Modules</th>
            <th className="text-left px-5 py-3 text-[12px] font-medium text-gray-500 uppercase tracking-wider">Price</th>
            <th className="text-right px-5 py-3 text-[12px] font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr></thead>
          <tbody>{(courses || []).map(c => (
            <tr key={c.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50">
              <td className="px-5 py-3.5">
                <div className="flex items-center gap-3">
                  <div className={"w-10 h-10 rounded-md flex items-center justify-center text-[11px] font-bold text-white/40 " + (c.thumbnailColor || "bg-gray-800")}>{c.thumbnailCode}</div>
                  <div><div className="text-[13px] font-medium text-gray-800">{c.title}</div>{c.instructor && <div className="text-[11px] text-gray-400">Instructor: {c.instructor}</div>}</div>
                </div>
              </td>
              <td className="px-5 py-3.5 text-[13px] text-gray-600">{c.category}</td>
              <td className="px-5 py-3.5"><span className={"text-[10px] font-semibold px-2 py-0.5 rounded " + (c.published ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-600")}>{c.published ? "Published" : "Draft"}</span></td>
              <td className="px-5 py-3.5 text-[13px] text-gray-600">{c.students}</td>
              <td className="px-5 py-3.5 text-[13px] text-gray-600">{c.modules}</td>
              <td className="px-5 py-3.5 text-[13px] font-medium text-gray-800">{c.currency} {c.price}</td>
              <td className="px-5 py-3.5 text-right">
                <button onClick={() => togglePublish(c.id, c.published)} className={"text-[12px] font-medium cursor-pointer hover:underline " + (c.published ? "text-red-500" : "text-green-600")}>{c.published ? "Unpublish" : "Publish"}</button>
              </td>
            </tr>
          ))}</tbody>
        </table>
        {(courses || []).length === 0 && <div className="py-12 text-center text-[13px] text-gray-400">No courses yet</div>}
      </div>
    </div>
  );
}
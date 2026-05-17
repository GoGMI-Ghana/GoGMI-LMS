import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useApi } from "../../hooks/useApi";
import { LoadingSpinner } from "../../components/common";


interface Course {
  id: string; title: string; subtitle: string; description: string; category: string;
  level: string; duration: string; thumbnailCode: string; thumbnailColor: string;
  thumbnailImage: string | null; price: number; currency: string; featured: boolean;
  students: number; tags: string[];
  facilitators: { name: string; title: string }[];
  modules: { id: string; title: string; lessons: unknown[] }[];
}

export default function CatalogPage() {
  const navigate = useNavigate();
  const { data: courses, isLoading } = useApi<Course[]>("/courses");
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = useMemo(() => {
    if (!courses) return ["All"];
    return ["All", ...new Set(courses.map(c => c.category))];
  }, [courses]);

  const filtered = useMemo(() => {
    if (!courses) return [];
    let result = [...courses];
    if (search.trim()) { const q = search.toLowerCase(); result = result.filter(c => c.title.toLowerCase().includes(q) || c.description.toLowerCase().includes(q) || c.tags.some(t => t.toLowerCase().includes(q))); }
    if (selectedCategory !== "All") result = result.filter(c => c.category === selectedCategory);
    return result;
  }, [courses, search, selectedCategory]);

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-[22px] font-semibold text-gray-800 mb-1">Course Catalog</h1>
        <p className="text-[14px] text-gray-500">Browse available courses from the Gulf of Guinea Maritime Institute.</p>
      </div>

      <div className="mb-5">
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-4 py-2.5 w-full max-w-xl">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-gray-400 shrink-0"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search courses..." className="border-none outline-none bg-transparent text-[14px] text-gray-700 w-full placeholder:text-gray-400" />
          {search && <button onClick={() => setSearch("")} className="text-gray-400 hover:text-gray-600 cursor-pointer"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg></button>}
        </div>
      </div>

      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-1.5">
          {categories.map(cat => (
            <button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-3 py-1.5 rounded-md text-[13px] font-medium transition-colors cursor-pointer ${selectedCategory === cat ? "bg-brand-navy text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"}`}>{cat}</button>
          ))}
        </div>
        <span className="text-[13px] text-gray-400 ml-auto">{filtered.length} course{filtered.length !== 1 ? "s" : ""}</span>
      </div>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-2 gap-5">
          {filtered.map(course => {
            const totalLessons = course.modules.reduce((s, m) => s + m.lessons.length, 0);
            return (
              <div key={course.id} onClick={() => navigate("/catalog/" + course.id)} className="bg-white border border-gray-200 rounded-lg overflow-hidden cursor-pointer hover:border-gray-300 hover:shadow-md transition-all flex flex-col">
                <div className="relative">
                  {course.thumbnailImage ? (
                    <div className="h-44 overflow-hidden"><img src={course.thumbnailImage} alt={course.title} className="w-full h-full object-cover" /></div>
                  ) : (
                    <div className={`h-44 ${course.thumbnailColor} flex items-center justify-center`}><span className="text-white/15 text-[64px] font-bold tracking-wider">{course.thumbnailCode}</span></div>
                  )}
                  {course.featured && <span className="absolute top-3 left-3 bg-white/90 text-gray-800 text-[10px] font-semibold px-2.5 py-1 rounded shadow-sm">Featured</span>}
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[11px] font-medium text-brand-teal uppercase tracking-wider">{course.category}</span>
                    <span className="text-gray-300">·</span>
                    <span className="text-[11px] text-gray-500">{course.level}</span>
                  </div>
                  <h3 className="text-[15px] font-semibold text-gray-800 leading-snug mb-1.5">{course.title}</h3>
                  <p className="text-[12px] text-gray-400 italic mb-2">{course.subtitle}</p>
                  <p className="text-[12.5px] text-gray-500 leading-relaxed mb-4 line-clamp-2 flex-1">{course.description}</p>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-semibold text-gray-600">
                      {course.facilitators[0]?.name.split(" ").filter(n => n.length > 1).map(n => n[0]).join("").slice(0, 2) || "GI"}
                    </div>
                    <span className="text-[12px] font-medium text-gray-700">{course.facilitators[0]?.name || "GoGMI Faculty"}</span>
                  </div>
                  <div className="flex items-center gap-3 text-[11.5px] text-gray-500 mb-3">
                    <span>{course.duration}</span><span className="text-gray-300">·</span><span>{course.modules.length} modules</span><span className="text-gray-300">·</span><span>{totalLessons} sessions</span>
                  </div>
                  <div className="border-t border-gray-100 pt-3 mt-auto flex items-center justify-between">
                    <span className="text-[12.5px] text-gray-500">{course.students} enrolled</span>
                    <span className="text-[14px] font-semibold text-gray-800">{course.currency} {course.price.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg py-16 flex flex-col items-center">
          <h3 className="text-[15px] font-semibold text-gray-800 mb-1">No courses found</h3>
          <p className="text-[13px] text-gray-500 mb-4">Try adjusting your search or filters.</p>
          <button onClick={() => { setSearch(""); setSelectedCategory("All"); }} className="text-[13px] font-medium text-brand-teal hover:underline cursor-pointer">Clear filters</button>
        </div>
      )}
    </div>
  );
}
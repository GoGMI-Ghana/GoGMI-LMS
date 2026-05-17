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
  modules: { id: string; title: string; order: number; lessons: { id: string }[] }[];
}

export default function CatalogPage() {
  const navigate = useNavigate();
  const { data: courses, isLoading } = useApi<Course[]>("/courses");
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = useMemo(() => {
    if (!courses) return ["All"];
    const cats = [...new Set(courses.map(c => c.category))];
    return ["All", ...cats];
  }, [courses]);

  const filtered = useMemo(() => {
    if (!courses) return [];
    let result = courses;
    if (activeCategory !== "All") result = result.filter(c => c.category === activeCategory);
    if (search.trim()) { const q = search.toLowerCase(); result = result.filter(c => c.title.toLowerCase().includes(q) || c.description.toLowerCase().includes(q)); }
    return result;
  }, [courses, search, activeCategory]);

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      <div className="mb-7">
        <h1 className="text-[22px] font-semibold text-gray-800 mb-1">Course Catalog</h1>
        <p className="text-[14px] text-gray-500">Browse available courses from the Gulf of Guinea Maritime Institute.</p>
      </div>

      <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3.5 py-2.5 mb-5">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
        <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search courses..." className="border-none outline-none bg-transparent text-[13.5px] text-gray-700 w-full placeholder:text-gray-400" />
      </div>

      <div className="flex items-center justify-between mb-5">
        <div className="flex gap-1.5">
          {categories.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-3 py-1.5 rounded-md text-[13px] font-medium transition-colors cursor-pointer ${activeCategory === cat ? "bg-brand-navy text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"}`}>{cat}</button>
          ))}
        </div>
        <span className="text-[13px] text-gray-500">{filtered.length} course{filtered.length !== 1 ? "s" : ""}</span>
      </div>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-2 gap-5">
          {filtered.map(course => {
            const totalLessons = course.modules.reduce((s, m) => s + m.lessons.length, 0);
            const thumbnailSrc = course.thumbnailImage || null;
            const lead = course.facilitators[0];

            return (
              <div key={course.id} onClick={() => navigate("/catalog/" + course.id)} className="bg-white border border-gray-200 rounded-lg overflow-hidden cursor-pointer hover:border-gray-300 hover:shadow-sm transition-all">
                {thumbnailSrc ? (
                  <div className="h-44 overflow-hidden relative">
                    <img src={thumbnailSrc} alt={course.title} className="w-full h-full object-cover" />
                    {course.featured && <span className="absolute top-3 left-3 bg-brand-amber-light text-brand-amber text-[10px] font-semibold px-2 py-0.5 rounded">Featured</span>}
                  </div>
                ) : (
                  <div className={`h-36 ${course.thumbnailColor || "bg-brand-navy"} flex items-center justify-center relative`}>
                    <span className="text-white/15 text-[64px] font-bold tracking-wider">{course.thumbnailCode}</span>
                    {course.featured && <span className="absolute top-3 left-3 bg-brand-amber-light text-brand-amber text-[10px] font-semibold px-2 py-0.5 rounded">Featured</span>}
                  </div>
                )}
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[11px] font-medium text-brand-teal uppercase tracking-wider">{course.category}</span>
                    <span className="text-gray-300">·</span>
                    <span className="text-[11px] text-gray-500">{course.level}</span>
                  </div>
                  <h3 className="text-[16px] font-semibold text-gray-800 mb-0.5 leading-snug">{course.title}</h3>
                  <p className="text-[12.5px] text-gray-400 italic mb-3">{course.subtitle}</p>
                  <p className="text-[13px] text-gray-500 leading-relaxed mb-4 line-clamp-2">{course.description}</p>
                  {lead && (
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-semibold text-gray-600">{lead.name.split(" ").filter(n => n.length > 1 && !n.includes("(")).map(n => n[0]).join("").slice(0, 2)}</div>
                      <span className="text-[12.5px] text-gray-600">{lead.name}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-3 text-[12px] text-gray-500">
                      <span>{course.duration}</span><span className="text-gray-300">·</span><span>{course.modules.length} modules</span><span className="text-gray-300">·</span><span>{totalLessons} sessions</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-[12px] text-gray-500">{course.students} enrolled</span>
                    <span className="text-[16px] font-semibold text-gray-800">{course.currency} {course.price.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg py-16 flex flex-col items-center">
          <p className="text-[14px] text-gray-500">{search ? "No courses match your search." : "No courses available yet."}</p>
        </div>
      )}
    </div>
  );
}
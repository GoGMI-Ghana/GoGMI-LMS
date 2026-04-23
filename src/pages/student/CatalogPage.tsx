import { useState, useMemo } from "react";
import { CatalogCourseCard } from "../../components/courses";
import { catalogCourses, catalogCategories, catalogLevels } from "../../data/mock";

interface Props {
  onSelectCourse: (id: string) => void;
}

export default function CatalogPage({ onSelectCourse }: Props) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedLevel, setSelectedLevel] = useState("All Levels");

  const filteredCourses = useMemo(() => {
    let courses = [...catalogCourses];
    if (search.trim()) {
      const q = search.toLowerCase();
      courses = courses.filter(c => c.title.toLowerCase().includes(q) || c.instructor.toLowerCase().includes(q) || c.description.toLowerCase().includes(q) || c.tags.some(t => t.toLowerCase().includes(q)));
    }
    if (selectedCategory !== "All") courses = courses.filter(c => c.category === selectedCategory);
    if (selectedLevel !== "All Levels") courses = courses.filter(c => c.level === selectedLevel);
    return courses;
  }, [search, selectedCategory, selectedLevel]);

  const clearFilters = () => { setSearch(""); setSelectedCategory("All"); setSelectedLevel("All Levels"); };
  const hasActiveFilters = search.trim() !== "" || selectedCategory !== "All" || selectedLevel !== "All Levels";

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-[22px] font-semibold text-gray-800 mb-1">Course Catalog</h1>
        <p className="text-[14px] text-gray-500">Browse available courses from the Gulf of Guinea Maritime Institute.</p>
      </div>

      <div className="mb-5">
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-4 py-2.5 w-full max-w-xl">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-gray-400 shrink-0"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search courses..." className="border-none outline-none bg-transparent text-[14px] text-gray-700 w-full placeholder:text-gray-400" />
          {search && <button onClick={() => setSearch("")} className="text-gray-400 hover:text-gray-600 cursor-pointer"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg></button>}
        </div>
      </div>

      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <div className="flex items-center gap-1.5 flex-wrap">
          {catalogCategories.map(cat => (
            <button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-3 py-1.5 rounded-md text-[13px] font-medium transition-colors cursor-pointer ${selectedCategory === cat ? "bg-brand-navy text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"}`}>{cat}</button>
          ))}
        </div>
        <div className="w-px h-8 bg-gray-200 mx-1" />
        <select value={selectedLevel} onChange={(e) => setSelectedLevel(e.target.value)} className="bg-white border border-gray-200 rounded-md px-3 py-1.5 text-[13px] text-gray-600 outline-none cursor-pointer">
          {catalogLevels.map(lvl => <option key={lvl} value={lvl}>{lvl}</option>)}
        </select>
        {hasActiveFilters && <button onClick={clearFilters} className="text-[13px] text-brand-teal font-medium hover:underline cursor-pointer ml-1">Clear filters</button>}
        <span className="text-[13px] text-gray-400 ml-auto">{filteredCourses.length} course{filteredCourses.length !== 1 ? "s" : ""}</span>
      </div>

      {filteredCourses.length > 0 ? (
        <div className="grid grid-cols-2 gap-5">
          {filteredCourses.map(course => <CatalogCourseCard key={course.id} course={course} onSelect={onSelectCourse} />)}
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg py-16 flex flex-col items-center justify-center">
          <h3 className="text-[15px] font-semibold text-gray-800 mb-1">No courses found</h3>
          <p className="text-[13px] text-gray-500 mb-4">Try adjusting your search or filters.</p>
          <button onClick={clearFilters} className="text-[13px] font-medium text-brand-teal hover:underline cursor-pointer">Clear all filters</button>
        </div>
      )}
    </div>
  );
}
import { useState } from "react";
import type { CatalogCourse } from "../../data/mock";

interface Props {
  course: CatalogCourse;
  onSelect: (id: string) => void;
}

export default function CatalogCourseCard({ course, onSelect }: Props) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onClick={() => onSelect(course.id)}
      className={`bg-white border rounded-lg overflow-hidden cursor-pointer transition-all duration-150 flex flex-col ${hovered ? "border-gray-300 shadow-md" : "border-gray-200"}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Thumbnail */}
      <div className={`h-40 ${course.thumbnailColor} flex flex-col items-center justify-center relative`}>
        <span className="text-white/20 text-[64px] font-bold leading-none tracking-wider">{course.thumbnailCode}</span>
        {course.featured && <span className="absolute top-3 left-3 bg-white/20 backdrop-blur-sm text-white text-[10px] font-semibold px-2.5 py-1 rounded">Featured</span>}
        {course.enrolled && <span className="absolute top-3 right-3 bg-white/20 backdrop-blur-sm text-white text-[10px] font-semibold px-2.5 py-1 rounded">Enrolled</span>}
      </div>

      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[11px] font-medium text-brand-teal uppercase tracking-wider">{course.category}</span>
          <span className="text-gray-300">·</span>
          <span className="text-[11px] text-gray-500">{course.level}</span>
        </div>

        <h3 className="text-[15px] font-semibold text-gray-800 leading-snug mb-1.5">{course.title}</h3>
        <p className="text-[12px] text-gray-400 mb-3 italic">{course.subtitle}</p>
        <p className="text-[12.5px] text-gray-500 leading-relaxed mb-4 line-clamp-2 flex-1">{course.description}</p>

        <div className="flex items-center gap-2 mb-3">
          <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-semibold text-gray-600">
            {course.instructor.split(" ").filter(n => n.length > 1).map(n => n[0]).join("").slice(0, 2)}
          </div>
          <div>
            <div className="text-[12px] font-medium text-gray-700">{course.instructor}</div>
            <div className="text-[11px] text-gray-400">{course.instructorTitle}</div>
          </div>
        </div>

        <div className="flex items-center gap-3 text-[11.5px] text-gray-500 mb-3">
          <span>{course.duration}</span>
          {course.modules > 0 && (
            <>
              <span className="text-gray-300">·</span>
              <span>{course.modules} modules</span>
            </>
          )}
          {course.students > 0 && (
            <>
              <span className="text-gray-300">·</span>
              <span>{course.students} enrolled</span>
            </>
          )}
        </div>

        <div className="border-t border-gray-100 pt-3 mt-auto flex items-center justify-between">
          {course.rating > 0 ? (
            <div className="flex items-center gap-1.5">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map(star => (
                  <svg key={star} width="12" height="12" viewBox="0 0 24 24" fill={star <= Math.floor(course.rating) ? "#D4920B" : "none"} stroke="#D4920B" strokeWidth="2">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                ))}
              </div>
              <span className="text-[12px] font-medium text-gray-700 ml-0.5">{course.rating}</span>
              <span className="text-[11px] text-gray-400">({course.reviews})</span>
            </div>
          ) : (
            <span className="text-[12px] text-gray-400">Coming soon</span>
          )}
          <span className={`text-[14px] font-semibold ${course.price === 0 ? "text-green-600" : "text-gray-800"}`}>
            {course.price === 0 ? "Free" : `${course.currency} ${course.price.toLocaleString()}`}
          </span>
        </div>
      </div>
    </div>
  );
}
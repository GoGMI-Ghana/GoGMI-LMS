import { useState } from "react";
import { ProgressBar } from "../common";
import type { Course } from "../../types";

interface CourseCardProps {
  course: Course;
}

export default function CourseCard({ course }: CourseCardProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={`bg-white border rounded-lg p-5 cursor-pointer transition-all duration-150
        ${hovered ? "border-gray-300 shadow-sm" : "border-gray-200"}
      `}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-3.5">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-lg bg-gray-100 flex items-center justify-center text-xl">
            {course.thumbnail}
          </div>
          <div>
            <span className="text-[11px] font-medium text-brand-teal uppercase tracking-wider">
              {course.category}
            </span>
            <h3 className="text-[14.5px] font-semibold text-gray-800 mt-0.5 leading-snug">
              {course.title}
            </h3>
          </div>
        </div>
        <span className="text-[12px] text-gray-400 whitespace-nowrap mt-0.5">
          {course.lastAccessed}
        </span>
      </div>

      {/* Instructor */}
      <div className="text-[13px] text-gray-500 mb-1">{course.instructor}</div>

      {/* Progress */}
      <div className="mt-3.5">
        <div className="flex justify-between mb-1.5">
          <span className="text-[12.5px] text-gray-500">Progress</span>
          <span className="text-[12.5px] font-semibold text-gray-700">
            {course.progress}%
          </span>
        </div>
        <ProgressBar value={course.progress} height="h-[5px]" />
      </div>

      {/* Next lesson + Continue */}
      <div className="mt-3.5 pt-3.5 border-t border-gray-100 flex justify-between items-center">
        <div className="text-[12.5px] text-gray-500 min-w-0 truncate pr-3">
          Next:{" "}
          <span className="text-gray-700 font-medium">
            {course.nextLesson}
          </span>
        </div>
        <button className="bg-brand-navy text-white rounded-md px-3.5 py-1.5 text-[12.5px] font-medium cursor-pointer hover:bg-brand-navy-light transition-colors shrink-0">
          Continue
        </button>
      </div>
    </div>
  );
}
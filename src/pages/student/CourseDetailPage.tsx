import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ProgressBar } from "../../components/common";
import { catalogCourses, enrolledCourses } from "../../data/mock";

export default function CourseDetailPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const course = catalogCourses.find(c => c.id === courseId);
  const enrolled = enrolledCourses.find(c => c.id === courseId);
  const [expandedModule, setExpandedModule] = useState<number | null>(0);
  const [activeTab, setActiveTab] = useState<"overview" | "syllabus" | "facilitators">("overview");

  if (!course) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg py-16 flex flex-col items-center">
        <h2 className="text-[16px] font-semibold text-gray-800 mb-1">Course not found</h2>
        <button onClick={() => navigate("/catalog")} className="text-[13px] text-brand-teal font-medium hover:underline cursor-pointer mt-2">Back to catalog</button>
      </div>
    );
  }

  const totalLessons = course.syllabus.reduce((sum, m) => sum + m.lessons.length, 0);

  return (
    <div>
      <button onClick={() => navigate("/catalog")} className="flex items-center gap-1.5 text-[13px] text-gray-500 hover:text-gray-700 cursor-pointer mb-5 transition-colors">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="15 18 9 12 15 6" /></svg>
        Back to catalog
      </button>

      <div className="grid grid-cols-[1fr_360px] gap-6">
        <div className="flex flex-col gap-5">
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className={`h-44 ${course.thumbnailColor} flex items-center justify-center`}>
              <span className="text-white/15 text-[80px] font-bold tracking-wider">{course.thumbnailCode}</span>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[11px] font-medium text-brand-teal uppercase tracking-wider">{course.category}</span>
                <span className="text-gray-300">·</span>
                <span className="text-[11px] text-gray-500">{course.level}</span>
                {course.featured && <span className="ml-2 bg-brand-amber-light text-brand-amber text-[10px] font-semibold px-2 py-0.5 rounded">Featured</span>}
              </div>
              <h1 className="text-[22px] font-semibold text-gray-800 mb-1 leading-tight">{course.title}</h1>
              <p className="text-[13px] text-gray-400 italic mb-4">{course.subtitle}</p>
              <div className="flex items-center gap-4 text-[13px] text-gray-500 flex-wrap">
                <span>{course.duration}</span>
                {course.modules > 0 && <><span className="text-gray-300">·</span><span>{course.modules} modules</span></>}
                {totalLessons > 0 && <><span className="text-gray-300">·</span><span>{totalLessons} sessions</span></>}
                {course.students > 0 && <><span className="text-gray-300">·</span><span>{course.students} enrolled</span></>}
              </div>
              {course.rating > 0 && (
                <div className="flex items-center gap-2 mt-3">
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map(star => (
                      <svg key={star} width="14" height="14" viewBox="0 0 24 24" fill={star <= Math.floor(course.rating) ? "#D4920B" : "none"} stroke="#D4920B" strokeWidth="2">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-[13px] font-medium text-gray-700">{course.rating}</span>
                  <span className="text-[12px] text-gray-400">({course.reviews} reviews)</span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="flex border-b border-gray-200">
              {(["overview", "syllabus", "facilitators"] as const).map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)} className={`px-5 py-3 text-[13.5px] font-medium capitalize transition-colors cursor-pointer ${activeTab === tab ? "text-brand-navy border-b-2 border-brand-navy" : "text-gray-500 hover:text-gray-700"}`}>{tab}</button>
              ))}
            </div>
            <div className="p-6">
              {activeTab === "overview" && (
                <div>
                  <h2 className="text-[15px] font-semibold text-gray-800 mb-3">About this course</h2>
                  <p className="text-[14px] text-gray-600 leading-relaxed mb-5">{course.description}</p>
                  {course.targetGroup && <div className="mb-5"><h3 className="text-[13px] font-semibold text-gray-800 mb-2">Who is this for</h3><p className="text-[13px] text-gray-500 leading-relaxed">{course.targetGroup}</p></div>}
                  {course.format && <div className="mb-5"><h3 className="text-[13px] font-semibold text-gray-800 mb-2">Format & Delivery</h3><p className="text-[13px] text-gray-500 leading-relaxed">{course.format}</p></div>}
                  {course.outcomes.length > 0 && (
                    <div><h3 className="text-[13px] font-semibold text-gray-800 mb-2">Expected Outcomes</h3><div className="flex flex-col gap-2">{course.outcomes.map((o, i) => (
                      <div key={i} className="flex items-start gap-2.5"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-brand-teal shrink-0 mt-0.5"><polyline points="20 6 9 17 4 12" /></svg><span className="text-[13px] text-gray-600">{o}</span></div>
                    ))}</div></div>
                  )}
                </div>
              )}
              {activeTab === "syllabus" && (
                <div>
                  <h2 className="text-[15px] font-semibold text-gray-800 mb-4">Course Syllabus</h2>
                  {course.syllabus.length === 0 ? <p className="text-[13px] text-gray-500">Syllabus details coming soon.</p> : (
                    <div className="flex flex-col gap-1">{course.syllabus.map((module, i) => (
                      <div key={i} className="border border-gray-100 rounded-md overflow-hidden">
                        <button onClick={() => setExpandedModule(expandedModule === i ? null : i)} className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer">
                          <div className="flex items-center gap-3 text-left"><span className="text-[12px] font-medium text-gray-400 w-12 shrink-0">M{i + 1}</span><span className="text-[14px] font-medium text-gray-800">{module.title}</span></div>
                          <div className="flex items-center gap-3 shrink-0"><span className="text-[12px] text-gray-500">{module.lessons.length} session{module.lessons.length !== 1 ? "s" : ""}</span><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`text-gray-400 transition-transform ${expandedModule === i ? "rotate-180" : ""}`}><polyline points="6 9 12 15 18 9" /></svg></div>
                        </button>
                        {expandedModule === i && (
                          <div className="px-4 pb-3 pt-1 border-t border-gray-100">{module.lessons.map((lesson, j) => (
                            <div key={j} className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
                              <div className="flex items-center gap-3"><span className="text-[11px] text-gray-400 w-5 text-center">{j + 1}</span><div><div className="text-[13px] text-gray-700">{lesson.title}</div><div className="text-[11px] text-gray-400">{lesson.facilitator}</div></div></div>
                              <span className="text-[11.5px] text-gray-400 shrink-0 ml-4">{lesson.duration}</span>
                            </div>
                          ))}</div>
                        )}
                      </div>
                    ))}</div>
                  )}
                </div>
              )}
              {activeTab === "facilitators" && (
                <div>
                  <h2 className="text-[15px] font-semibold text-gray-800 mb-4">Course Facilitators</h2>
                  <div className="flex flex-col gap-3">{course.facilitators.map((f, i) => (
                    <div key={i} className="flex items-center gap-3 py-2">
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-[12px] font-semibold text-gray-600">{f.split(" ").filter(n => n.length > 1 && !n.includes("(")).map(n => n[0]).join("").slice(0, 2)}</div>
                      <div className="text-[14px] font-medium text-gray-800">{f}</div>
                    </div>
                  ))}</div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <div className="bg-white border border-gray-200 rounded-lg p-5 sticky top-20">
            <div className="text-center mb-4">
              <span className={`text-[28px] font-semibold ${course.price === 0 ? "text-green-600" : "text-gray-800"}`}>{course.price === 0 ? "Free" : `GHS ${course.price.toLocaleString()}`}</span>
            </div>
            {enrolled ? (
              <div>
                <button className="w-full bg-brand-teal text-white rounded-md py-2.5 text-[14px] font-medium cursor-pointer hover:bg-brand-teal/90 transition-colors mb-3">Continue Learning</button>
                <div className="mt-2"><div className="flex justify-between text-[12.5px] mb-1.5"><span className="text-gray-500">Your progress</span><span className="font-semibold text-gray-700">{enrolled.progress}%</span></div><ProgressBar value={enrolled.progress} height="h-[5px]" /></div>
              </div>
            ) : (
              <button className="w-full bg-brand-navy text-white rounded-md py-2.5 text-[14px] font-medium cursor-pointer hover:bg-brand-navy-light transition-colors">{course.price === 0 ? "Enroll for Free" : "Enroll Now"}</button>
            )}
            <div className="mt-5 pt-5 border-t border-gray-100">
              <h3 className="text-[13px] font-semibold text-gray-800 mb-3">This course includes</h3>
              <div className="flex flex-col gap-2.5">
                {[course.modules > 0 ? `${course.modules} modules, ${totalLessons} sessions` : null, course.duration !== "TBA" ? `${course.duration} duration` : null, "Certificate of completion", "CPD points upon completion", "Recorded sessions for review"].filter(Boolean).map((item, i) => (
                  <div key={i} className="flex items-center gap-2.5"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-brand-teal shrink-0"><polyline points="20 6 9 17 4 12" /></svg><span className="text-[13px] text-gray-600">{item}</span></div>
                ))}
              </div>
            </div>
          </div>
          {course.tags.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-lg p-5"><h3 className="text-[13px] font-semibold text-gray-800 mb-3">Topics</h3><div className="flex flex-wrap gap-2">{course.tags.map(tag => <span key={tag} className="bg-gray-100 text-gray-600 text-[12px] px-2.5 py-1 rounded-md">{tag}</span>)}</div></div>
          )}
        </div>
      </div>
    </div>
  );
}
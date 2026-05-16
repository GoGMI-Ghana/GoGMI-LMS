import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const courseData = {
  title: "Maritime Governance",
  modules: [
    { title: "Introduction and Maritime Strategy Theory", sessions: 7, completed: true },
    { title: "Assessing Maritime Domain Challenges & Opportunities", sessions: 3, completed: true },
    { title: "Strategy Development Process", sessions: 2, completed: false },
    { title: "Interagency Coordination and Stakeholder Analysis", sessions: 3, completed: false },
    { title: "Ends, Ways, Means & Risk", sessions: 2, completed: false },
    { title: "Maritime Strategy Implementation", sessions: 3, completed: false },
    { title: "Maritime Strategy Sector Planning — In-Class Exercise", sessions: 3, completed: false },
    { title: "Case Study Reports and Course Conclusion", sessions: 4, completed: false },
  ],
};

const students = [
  { name: "Babiker Alayas Osman", email: "babikeralyas@yahoo.com", progress: 45, lastActive: "2 hours ago", country: "Sudan" },
  { name: "Atari Emmanuel Afri", email: "atariafri@yahoo.com", progress: 38, lastActive: "1 day ago", country: "Nigeria" },
  { name: "Ama Serwaa Mensah", email: "a.mensah@gma.gov.gh", progress: 52, lastActive: "3 hours ago", country: "Ghana" },
  { name: "Kofi Asante Boateng", email: "k.boateng@navy.mil.gh", progress: 28, lastActive: "2 days ago", country: "Ghana" },
];

const assessments = [
  { title: "SWOT Analysis Activity", type: "Assignment", dueDate: "May 16, 2026", submissions: 2, total: 24, status: "active" },
  { title: "Vision Statement Draft", type: "Assignment", dueDate: "May 20, 2026", submissions: 1, total: 24, status: "active" },
  { title: "Module 1 Quiz", type: "Quiz", dueDate: "May 12, 2026", submissions: 18, total: 24, status: "closed" },
  { title: "Case Study Group Report", type: "Assignment", dueDate: "May 28, 2026", submissions: 0, total: 24, status: "upcoming" },
];

export default function InstructorCourseManagePage() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"content" | "students" | "assessments">("content");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showCreateAssessment, setShowCreateAssessment] = useState(false);

  return (
    <div>
      <button onClick={() => navigate("/instructor/courses")} className="flex items-center gap-1.5 text-[13px] text-gray-500 hover:text-gray-700 cursor-pointer mb-5 transition-colors">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="15 18 9 12 15 6" /></svg>
        Back to courses
      </button>

      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-[22px] font-semibold text-gray-800 mb-1">{courseData.title}</h1>
          <p className="text-[14px] text-gray-500">Manage course content, students, and assessments.</p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="flex border-b border-gray-200">
          {(["content", "students", "assessments"] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`px-6 py-3.5 text-[14px] font-medium capitalize transition-colors cursor-pointer ${activeTab === tab ? "text-brand-teal border-b-2 border-brand-teal" : "text-gray-500 hover:text-gray-700"}`}>{tab}</button>
          ))}
        </div>

        <div className="p-6">
          {/* Content tab */}
          {activeTab === "content" && (
            <div>
              <div className="flex justify-between items-center mb-5">
                <h2 className="text-[15px] font-semibold text-gray-800">Course Modules & Content</h2>
                <button onClick={() => setShowUploadModal(true)} className="bg-[#1a2332] text-white rounded-md px-4 py-2 text-[13px] font-medium cursor-pointer hover:bg-[#243044] transition-colors">Upload Material</button>
              </div>
              <div className="flex flex-col gap-2">
                {courseData.modules.map((mod, i) => (
                  <div key={i} className="border border-gray-100 rounded-md px-5 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-semibold ${mod.completed ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                        {mod.completed ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12" /></svg> : i + 1}
                      </div>
                      <div>
                        <div className="text-[14px] font-medium text-gray-800">Module {i + 1}: {mod.title}</div>
                        <div className="text-[12px] text-gray-500">{mod.sessions} sessions</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="border border-gray-200 rounded-md px-3 py-1.5 text-[12px] font-medium text-gray-600 cursor-pointer hover:bg-gray-50 transition-colors">Add Content</button>
                      <button className="border border-gray-200 rounded-md px-3 py-1.5 text-[12px] font-medium text-gray-600 cursor-pointer hover:bg-gray-50 transition-colors">Edit</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Students tab */}
          {activeTab === "students" && (
            <div>
              <div className="flex justify-between items-center mb-5">
                <h2 className="text-[15px] font-semibold text-gray-800">{students.length} Enrolled Students</h2>
                <button className="border border-gray-200 rounded-md px-4 py-2 text-[13px] font-medium text-gray-600 cursor-pointer hover:bg-gray-50 transition-colors">Export CSV</button>
              </div>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left px-4 py-3 text-[12px] font-medium text-gray-500 uppercase tracking-wider">Student</th>
                    <th className="text-left px-4 py-3 text-[12px] font-medium text-gray-500 uppercase tracking-wider">Country</th>
                    <th className="text-left px-4 py-3 text-[12px] font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                    <th className="text-left px-4 py-3 text-[12px] font-medium text-gray-500 uppercase tracking-wider">Last Active</th>
                    <th className="text-right px-4 py-3 text-[12px] font-medium text-gray-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((s, i) => (
                    <tr key={i} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-[11px] font-semibold text-gray-600">{s.name.split(" ").map(n => n[0]).join("").slice(0, 2)}</div>
                          <div>
                            <div className="text-[13px] font-medium text-gray-800">{s.name}</div>
                            <div className="text-[11.5px] text-gray-400">{s.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-[13px] text-gray-600">{s.country}</td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-1.5 rounded-full bg-gray-200"><div className="h-full rounded-full bg-brand-teal" style={{ width: s.progress + "%" }} /></div>
                          <span className="text-[12px] text-gray-600">{s.progress}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-[13px] text-gray-500">{s.lastActive}</td>
                      <td className="px-4 py-3.5 text-right">
                        <button className="text-[12px] text-brand-teal font-medium hover:underline cursor-pointer">View</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Assessments tab */}
          {activeTab === "assessments" && (
            <div>
              <div className="flex justify-between items-center mb-5">
                <h2 className="text-[15px] font-semibold text-gray-800">Assessments</h2>
                <button onClick={() => setShowCreateAssessment(true)} className="bg-[#1a2332] text-white rounded-md px-4 py-2 text-[13px] font-medium cursor-pointer hover:bg-[#243044] transition-colors">Create Assessment</button>
              </div>
              <div className="flex flex-col gap-3">
                {assessments.map((a, i) => (
                  <div key={i} className="border border-gray-100 rounded-md px-5 py-4 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${a.type === "Quiz" ? "bg-blue-50 text-blue-700" : "bg-brand-amber-light text-brand-amber"}`}>{a.type}</span>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${a.status === "active" ? "bg-green-50 text-green-700" : a.status === "closed" ? "bg-gray-100 text-gray-600" : "bg-blue-50 text-blue-600"}`}>{a.status}</span>
                      </div>
                      <div className="text-[14px] font-medium text-gray-800">{a.title}</div>
                      <div className="text-[12px] text-gray-500 mt-0.5">Due: {a.dueDate} · {a.submissions}/{a.total} submitted</div>
                    </div>
                    <div className="flex gap-2">
                      <button className="border border-gray-200 rounded-md px-3 py-1.5 text-[12px] font-medium text-gray-600 cursor-pointer hover:bg-gray-50 transition-colors">View Submissions</button>
                      <button className="border border-gray-200 rounded-md px-3 py-1.5 text-[12px] font-medium text-gray-600 cursor-pointer hover:bg-gray-50 transition-colors">Edit</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Upload Material Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[100]" onClick={() => setShowUploadModal(false)}>
          <div className="bg-white rounded-lg w-full max-w-md p-6 shadow-xl" onClick={e => e.stopPropagation()}>
            <h2 className="text-[18px] font-semibold text-gray-800 mb-5">Upload Course Material</h2>
            <div className="flex flex-col gap-3.5">
              <div>
                <label className="block text-[13px] font-medium text-gray-700 mb-1">Module</label>
                <select className="w-full bg-white border border-gray-200 rounded-md px-3 py-2 text-[14px] text-gray-800 outline-none cursor-pointer">
                  {courseData.modules.map((m, i) => <option key={i}>Module {i + 1}: {m.title}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[13px] font-medium text-gray-700 mb-1">Content Type</label>
                <select className="w-full bg-white border border-gray-200 rounded-md px-3 py-2 text-[14px] text-gray-800 outline-none cursor-pointer">
                  <option>Video Recording</option>
                  <option>PDF Document</option>
                  <option>Presentation (Slides)</option>
                  <option>Zoom Link</option>
                  <option>External Resource</option>
                </select>
              </div>
              <div>
                <label className="block text-[13px] font-medium text-gray-700 mb-1">Title</label>
                <input type="text" placeholder="e.g. Module 1 Recording" className="w-full bg-white border border-gray-200 rounded-md px-3 py-2 text-[14px] text-gray-800 outline-none focus:border-brand-teal transition-colors" />
              </div>
              <div>
                <label className="block text-[13px] font-medium text-gray-700 mb-1">File or URL</label>
                <input type="text" placeholder="Paste URL or upload file" className="w-full bg-white border border-gray-200 rounded-md px-3 py-2 text-[14px] text-gray-800 outline-none focus:border-brand-teal transition-colors" />
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowUploadModal(false)} className="flex-1 border border-gray-200 rounded-md py-2 text-[13px] font-medium text-gray-600 cursor-pointer hover:bg-gray-50 transition-colors">Cancel</button>
                <button onClick={() => setShowUploadModal(false)} className="flex-1 bg-[#1a2332] text-white rounded-md py-2 text-[13px] font-medium cursor-pointer hover:bg-[#243044] transition-colors">Upload</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Assessment Modal */}
      {showCreateAssessment && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[100]" onClick={() => setShowCreateAssessment(false)}>
          <div className="bg-white rounded-lg w-full max-w-md p-6 shadow-xl" onClick={e => e.stopPropagation()}>
            <h2 className="text-[18px] font-semibold text-gray-800 mb-5">Create Assessment</h2>
            <div className="flex flex-col gap-3.5">
              <div>
                <label className="block text-[13px] font-medium text-gray-700 mb-1">Title</label>
                <input type="text" className="w-full bg-white border border-gray-200 rounded-md px-3 py-2 text-[14px] text-gray-800 outline-none focus:border-brand-teal transition-colors" />
              </div>
              <div>
                <label className="block text-[13px] font-medium text-gray-700 mb-1">Type</label>
                <select className="w-full bg-white border border-gray-200 rounded-md px-3 py-2 text-[14px] text-gray-800 outline-none cursor-pointer">
                  <option>Assignment</option><option>Quiz</option><option>Exam</option>
                </select>
              </div>
              <div>
                <label className="block text-[13px] font-medium text-gray-700 mb-1">Due Date</label>
                <input type="date" className="w-full bg-white border border-gray-200 rounded-md px-3 py-2 text-[14px] text-gray-800 outline-none focus:border-brand-teal transition-colors cursor-pointer" />
              </div>
              <div>
                <label className="block text-[13px] font-medium text-gray-700 mb-1">Max Score</label>
                <input type="number" defaultValue={100} className="w-full bg-white border border-gray-200 rounded-md px-3 py-2 text-[14px] text-gray-800 outline-none focus:border-brand-teal transition-colors" />
              </div>
              <div>
                <label className="block text-[13px] font-medium text-gray-700 mb-1">Instructions</label>
                <textarea rows={3} className="w-full bg-white border border-gray-200 rounded-md px-3 py-2 text-[14px] text-gray-800 outline-none focus:border-brand-teal transition-colors resize-none" />
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowCreateAssessment(false)} className="flex-1 border border-gray-200 rounded-md py-2 text-[13px] font-medium text-gray-600 cursor-pointer hover:bg-gray-50 transition-colors">Cancel</button>
                <button onClick={() => setShowCreateAssessment(false)} className="flex-1 bg-[#1a2332] text-white rounded-md py-2 text-[13px] font-medium cursor-pointer hover:bg-[#243044] transition-colors">Create</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
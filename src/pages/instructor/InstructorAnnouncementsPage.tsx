import { useState } from "react";

export default function InstructorAnnouncementsPage() {
  const [showCreate, setShowCreate] = useState(false);

  const announcements = [
    { title: "Week 2 Schedule Update", content: "Please note that the Module 6 session has been moved to 2:00 PM GMT due to facilitator availability.", date: "May 11, 2026", course: "Maritime Governance" },
    { title: "SWOT Activity Submission Reminder", content: "Please submit your SWOT analysis by May 16th. Late submissions will not be accepted.", date: "May 9, 2026", course: "Maritime Governance" },
    { title: "Reading Materials for Module 3", content: "Additional reading materials for Module 3 have been uploaded. Please review before the session.", date: "May 7, 2026", course: "Maritime Governance" },
  ];

  return (
    <div>
      <div className="flex justify-between items-start mb-7">
        <div><h1 className="text-[22px] font-semibold text-gray-800 mb-1">Announcements</h1><p className="text-[14px] text-gray-500">Post updates for your course participants.</p></div>
        <button onClick={() => setShowCreate(true)} className="bg-[#1a2332] text-white rounded-md px-4 py-2.5 text-[13px] font-medium cursor-pointer hover:bg-[#243044] transition-colors">New Announcement</button>
      </div>

      <div className="flex flex-col gap-3">
        {announcements.map((a, i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-lg p-5">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-[11px] text-gray-500 mb-1">{a.course} · {a.date}</div>
                <h3 className="text-[14.5px] font-semibold text-gray-800 mb-1">{a.title}</h3>
                <p className="text-[13px] text-gray-500 leading-relaxed">{a.content}</p>
              </div>
              <div className="flex gap-2 shrink-0 ml-4">
                <button className="border border-gray-200 rounded-md px-3 py-1.5 text-[12px] font-medium text-gray-600 cursor-pointer hover:bg-gray-50 transition-colors">Edit</button>
                <button className="border border-red-200 rounded-md px-3 py-1.5 text-[12px] font-medium text-red-600 cursor-pointer hover:bg-red-50 transition-colors">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showCreate && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[100]" onClick={() => setShowCreate(false)}>
          <div className="bg-white rounded-lg w-full max-w-lg p-6 shadow-xl" onClick={e => e.stopPropagation()}>
            <h2 className="text-[18px] font-semibold text-gray-800 mb-5">New Announcement</h2>
            <div className="flex flex-col gap-3.5">
              <div><label className="block text-[13px] font-medium text-gray-700 mb-1">Course</label><select className="w-full bg-white border border-gray-200 rounded-md px-3 py-2 text-[14px] text-gray-800 outline-none cursor-pointer"><option>Maritime Governance</option></select></div>
              <div><label className="block text-[13px] font-medium text-gray-700 mb-1">Title</label><input type="text" className="w-full bg-white border border-gray-200 rounded-md px-3 py-2 text-[14px] text-gray-800 outline-none focus:border-brand-teal transition-colors" /></div>
              <div><label className="block text-[13px] font-medium text-gray-700 mb-1">Message</label><textarea rows={4} className="w-full bg-white border border-gray-200 rounded-md px-3 py-2 text-[14px] text-gray-800 outline-none focus:border-brand-teal transition-colors resize-none" /></div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowCreate(false)} className="flex-1 border border-gray-200 rounded-md py-2 text-[13px] font-medium text-gray-600 cursor-pointer hover:bg-gray-50 transition-colors">Cancel</button>
                <button onClick={() => setShowCreate(false)} className="flex-1 bg-[#1a2332] text-white rounded-md py-2 text-[13px] font-medium cursor-pointer hover:bg-[#243044] transition-colors">Publish</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
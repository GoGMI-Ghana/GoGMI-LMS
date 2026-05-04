import { useState } from "react";
import { announcements } from "../../data/mock";

export default function AdminAnnouncementsPage() {
  const [showCreate, setShowCreate] = useState(false);

  return (
    <div>
      <div className="flex justify-between items-start mb-7">
        <div>
          <h1 className="text-[22px] font-semibold text-gray-800 mb-1">Announcements</h1>
          <p className="text-[14px] text-gray-500">Manage platform-wide and course announcements.</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="bg-gray-900 text-white rounded-md px-4 py-2.5 text-[13px] font-medium cursor-pointer hover:bg-gray-800 transition-colors">
          New announcement
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {announcements.map(a => (
          <div key={a.id} className="bg-white border border-gray-200 rounded-lg p-5 flex items-start gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-[14.5px] font-semibold text-gray-800">{a.title}</h3>
              </div>
              <p className="text-[13px] text-gray-500 leading-relaxed mb-2">{a.excerpt}</p>
              <div className="flex items-center gap-3 text-[12px] text-gray-400">
                <span>{a.from}</span>
                <span className="text-gray-300">·</span>
                <span>{a.date}</span>
                <span className="text-gray-300">·</span>
                <span>All users</span>
              </div>
            </div>
            <div className="flex gap-2 shrink-0">
              <button className="border border-gray-200 rounded-md px-3 py-1.5 text-[12.5px] font-medium text-gray-600 cursor-pointer hover:bg-gray-50 transition-colors">Edit</button>
              <button className="border border-red-200 rounded-md px-3 py-1.5 text-[12.5px] font-medium text-red-600 cursor-pointer hover:bg-red-50 transition-colors">Delete</button>
            </div>
          </div>
        ))}
      </div>

      {showCreate && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[100]" onClick={() => setShowCreate(false)}>
          <div className="bg-white rounded-lg w-full max-w-lg p-6 shadow-xl" onClick={e => e.stopPropagation()}>
            <h2 className="text-[18px] font-semibold text-gray-800 mb-5">New Announcement</h2>
            <div className="flex flex-col gap-3.5">
              <div>
                <label className="block text-[13px] font-medium text-gray-700 mb-1">Title</label>
                <input type="text" className="w-full bg-white border border-gray-200 rounded-md px-3 py-2 text-[14px] text-gray-800 outline-none focus:border-brand-teal transition-colors" />
              </div>
              <div>
                <label className="block text-[13px] font-medium text-gray-700 mb-1">Message</label>
                <textarea rows={4} className="w-full bg-white border border-gray-200 rounded-md px-3 py-2 text-[14px] text-gray-800 outline-none focus:border-brand-teal transition-colors resize-none" />
              </div>
              <div>
                <label className="block text-[13px] font-medium text-gray-700 mb-1">Audience</label>
                <select className="w-full bg-white border border-gray-200 rounded-md px-3 py-2 text-[14px] text-gray-800 outline-none cursor-pointer">
                  <option>All users</option>
                  <option>Maritime Governance participants</option>
                  <option>Marine Casualty Investigation participants</option>
                  <option>Instructors only</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowCreate(false)} className="flex-1 border border-gray-200 rounded-md py-2 text-[13px] font-medium text-gray-600 cursor-pointer hover:bg-gray-50 transition-colors">Cancel</button>
                <button onClick={() => setShowCreate(false)} className="flex-1 bg-gray-900 text-white rounded-md py-2 text-[13px] font-medium cursor-pointer hover:bg-gray-800 transition-colors">Publish</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
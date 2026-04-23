import { useState } from "react";

const discussions = [
  { id: "d1", title: "How do maritime strategies align with AU's 2050 AIM Strategy?", author: "Akua Konadu", course: "Maritime Governance", replies: 8, lastActivity: "2 hours ago", pinned: true },
  { id: "d2", title: "SWOT Analysis — Sharing approaches and templates", author: "Emmanuel Tetteh", course: "Maritime Governance", replies: 12, lastActivity: "5 hours ago", pinned: false },
  { id: "d3", title: "Group 2 — Case Study Coordination Thread", author: "Fatima Ibrahim", course: "Maritime Governance", replies: 23, lastActivity: "1 hour ago", pinned: true },
  { id: "d4", title: "Resources on the Yaoundé Code of Conduct", author: "Lawrence Dogli", course: "Maritime Governance", replies: 5, lastActivity: "Yesterday", pinned: false },
  { id: "d5", title: "IMO Casualty Investigation Code — Key sections to focus on", author: "Kofi Mensah", course: "Marine Casualty Investigation", replies: 3, lastActivity: "3 hours ago", pinned: false },
  { id: "d6", title: "Volta Lake case study — background materials", author: "Ama Serwaa", course: "Marine Casualty Investigation", replies: 7, lastActivity: "Yesterday", pinned: false },
  { id: "d7", title: "Root cause analysis vs blame — discussion on investigation philosophy", author: "James Owusu", course: "Marine Casualty Investigation", replies: 15, lastActivity: "2 days ago", pinned: false },
  { id: "d8", title: "Interagency coordination challenges in Ghana — real experiences", author: "Nana Agyeman", course: "Maritime Governance", replies: 9, lastActivity: "3 days ago", pinned: false },
];

export default function DiscussionsPage() {
  const [filter, setFilter] = useState("all");

  const filtered = filter === "all"
    ? discussions
    : discussions.filter(d => d.course === (filter === "mg" ? "Maritime Governance" : "Marine Casualty Investigation"));

  return (
    <div>
      <div className="flex justify-between items-start mb-7">
        <div>
          <h1 className="text-[22px] font-semibold text-gray-800 mb-1">Discussions</h1>
          <p className="text-[14px] text-gray-500">Course forums and group discussions.</p>
        </div>
        <button className="bg-brand-navy text-white rounded-md px-4 py-2 text-[13px] font-medium cursor-pointer hover:bg-brand-navy-light transition-colors">
          New Discussion
        </button>
      </div>

      {/* Filter */}
      <div className="flex gap-1.5 mb-6">
        {[
          { key: "all", label: "All Courses" },
          { key: "mg", label: "Maritime Governance" },
          { key: "mc", label: "Marine Casualty Investigation" },
        ].map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-3 py-1.5 rounded-md text-[13px] font-medium transition-colors cursor-pointer ${filter === f.key ? "bg-brand-navy text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"}`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Threads */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        {filtered.map((d, i) => (
          <div key={d.id} className={`px-5 py-4 flex items-center gap-4 cursor-pointer hover:bg-gray-50 transition-colors ${i > 0 ? "border-t border-gray-100" : ""}`}>
            <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-[11px] font-semibold text-gray-600 shrink-0">
              {d.author.split(" ").map(n => n[0]).join("")}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                {d.pinned && <span className="text-[10px] font-semibold text-brand-amber bg-brand-amber-light px-1.5 py-0.5 rounded">Pinned</span>}
                <h3 className="text-[14px] font-medium text-gray-800 truncate">{d.title}</h3>
              </div>
              <div className="flex items-center gap-2 mt-1 text-[12px] text-gray-500">
                <span>{d.author}</span>
                <span className="text-gray-300">·</span>
                <span>{d.course}</span>
              </div>
            </div>
            <div className="text-right shrink-0">
              <div className="text-[13px] font-medium text-gray-700">{d.replies} replies</div>
              <div className="text-[11px] text-gray-400 mt-0.5">{d.lastActivity}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
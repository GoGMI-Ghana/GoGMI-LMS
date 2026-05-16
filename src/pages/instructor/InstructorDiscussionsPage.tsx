export default function InstructorDiscussionsPage() {
  const threads = [
    { title: "SWOT Analysis — What tools are most effective?", course: "Maritime Governance", author: "Ama Serwaa Mensah", replies: 8, lastActivity: "2 hours ago", pinned: true },
    { title: "Clarification on Maritime Domain Assessment scope", course: "Maritime Governance", author: "Babiker Alayas Osman", replies: 3, lastActivity: "5 hours ago", pinned: false },
    { title: "Group assignment partners", course: "Maritime Governance", author: "Kofi Asante Boateng", replies: 12, lastActivity: "1 day ago", pinned: false },
    { title: "Resources for MSSR Guide analysis", course: "Maritime Governance", author: "Atari Emmanuel Afri", replies: 5, lastActivity: "2 days ago", pinned: false },
  ];

  return (
    <div>
      <div className="mb-7">
        <h1 className="text-[22px] font-semibold text-gray-800 mb-1">Discussions</h1>
        <p className="text-[14px] text-gray-500">Moderate course discussion threads.</p>
      </div>
      <div className="flex flex-col gap-3">
        {threads.map((t, i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-lg p-5 cursor-pointer hover:border-gray-300 transition-colors">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  {t.pinned && <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-brand-amber-light text-brand-amber">Pinned</span>}
                  <span className="text-[11px] text-gray-500">{t.course}</span>
                </div>
                <h3 className="text-[14px] font-medium text-gray-800 mb-1">{t.title}</h3>
                <div className="text-[12px] text-gray-500">Started by {t.author} · {t.replies} replies · Last activity {t.lastActivity}</div>
              </div>
              <div className="flex gap-2 shrink-0 ml-4">
                <button className="border border-gray-200 rounded-md px-3 py-1.5 text-[12px] font-medium text-gray-600 cursor-pointer hover:bg-gray-50 transition-colors">{t.pinned ? "Unpin" : "Pin"}</button>
                <button className="text-[12px] text-brand-teal font-medium hover:underline cursor-pointer">Reply</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
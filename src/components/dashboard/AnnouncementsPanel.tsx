import type { Announcement } from "../../types";

interface AnnouncementsPanelProps {
  items: Announcement[];
}

export default function AnnouncementsPanel({ items }: AnnouncementsPanelProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-[15px] font-semibold text-gray-800">Announcements</h2>
        <button className="text-[13px] font-medium text-brand-teal hover:underline cursor-pointer">
          View all
        </button>
      </div>
      <div className="flex flex-col">
        {items.map((item, i) => (
          <div
            key={item.id}
            className={`py-3.5 cursor-pointer ${i > 0 ? "border-t border-gray-100" : ""}`}
          >
            <div className="flex justify-between items-start mb-1">
              <h4 className="text-[13.5px] font-medium text-gray-800">{item.title}</h4>
              <span className="text-[11.5px] text-gray-400 whitespace-nowrap ml-3">{item.date}</span>
            </div>
            <p className="text-[12.5px] text-gray-500 leading-relaxed">{item.excerpt}</p>
            <div className="text-[11.5px] text-gray-400 mt-1">{item.from}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
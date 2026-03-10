import type { UpcomingItem, UpcomingType } from "../../types";

const typeConfig: Record<UpcomingType, { label: string; className: string }> = {
  assignment: { label: "Assignment", className: "bg-brand-amber-light text-brand-amber" },
  live: { label: "Live Session", className: "bg-brand-teal-light text-brand-teal" },
  quiz: { label: "Quiz", className: "bg-blue-50 text-brand-navy-muted" },
};

interface UpcomingPanelProps {
  items: UpcomingItem[];
}

export default function UpcomingPanel({ items }: UpcomingPanelProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-[15px] font-semibold text-gray-800">Upcoming</h2>
        <button className="text-[13px] font-medium text-brand-teal hover:underline cursor-pointer">
          View calendar
        </button>
      </div>
      <div className="flex flex-col">
        {items.map((item, i) => {
          const config = typeConfig[item.type];
          return (
            <div
              key={item.id}
              className={`flex items-start gap-3 py-3.5 ${i > 0 ? "border-t border-gray-100" : ""}`}
            >
              <span className={`px-2 py-0.5 rounded text-[11px] font-semibold whitespace-nowrap mt-0.5 ${config.className}`}>
                {config.label}
              </span>
              <div className="flex-1 min-w-0">
                <div className="text-[13.5px] font-medium text-gray-800 mb-0.5">{item.title}</div>
                <div className="text-[12px] text-gray-500 truncate">{item.course}</div>
              </div>
              <div className={`text-[12px] whitespace-nowrap ${item.urgent ? "text-red-600 font-semibold" : "text-gray-500"}`}>
                {item.due}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
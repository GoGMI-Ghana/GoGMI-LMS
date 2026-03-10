import type { User } from "../../types";

interface TopBarProps {
  user: User;
}

export default function TopBar({ user }: TopBarProps) {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-40">
      {/* Search */}
      <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3.5 py-2 w-[360px]">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-gray-400 shrink-0">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="text"
          placeholder="Search courses, lessons, resources..."
          className="border-none outline-none bg-transparent text-[13.5px] text-gray-700 w-full placeholder:text-gray-400"
        />
      </div>

      {/* Right side */}
      <div className="flex items-center gap-5">
        <button className="relative p-1 cursor-pointer">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="text-gray-500">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          <span className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full bg-red-600 border-2 border-white" />
        </button>
        <div className="w-px h-8 bg-gray-200" />
        <button className="flex items-center gap-2.5 cursor-pointer">
          <div className="w-9 h-9 rounded-full bg-brand-navy flex items-center justify-center text-white text-[13px] font-semibold">
            {user.initials}
          </div>
          <div className="text-left">
            <div className="text-[13.5px] font-medium text-gray-800">
              {user.firstName} {user.lastName}
            </div>
            <div className="text-[11.5px] text-gray-500 capitalize">
              {user.role}
            </div>
          </div>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
      </div>
    </header>
  );
}
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import type { User } from "../../types";

interface AppLayoutProps {
  user: User;
  activeNav: string;
  onNavChange: (id: string) => void;
  children: React.ReactNode;
}

export default function AppLayout({ user, activeNav, onNavChange, children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar activeNav={activeNav} onNavChange={onNavChange} />
      <div className="ml-60 flex-1 min-w-0">
        <TopBar user={user} />
        <main className="px-8 py-7 pb-12">{children}</main>
      </div>
    </div>
  );
}
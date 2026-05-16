import { Outlet } from "react-router-dom";
import InstructorSidebar from "./InstructorSidebar";
import { TopBar } from "../layout";
import { ErrorBoundary } from "../common";

export default function InstructorLayout() {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <InstructorSidebar />
      <div className="ml-60 flex-1 min-w-0">
        <TopBar />
        <main className="px-8 py-7 pb-12">
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
}
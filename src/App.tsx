import { useState } from "react";
import { AppLayout } from "./components/layout";
import DashboardPage from "./pages/student/DashboardPage.tsx";
import LoginPage from "./pages/auth/LoginPage.tsx";
import { currentUser } from "./data/mock";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeNav, setActiveNav] = useState("dashboard");

  if (!isAuthenticated) {
    return <LoginPage onLogin={() => setIsAuthenticated(true)} />;
  }

  const renderPage = () => {
    switch (activeNav) {
      case "dashboard":
        return <DashboardPage />;
      default:
        return (
          <div className="bg-white border border-gray-200 rounded-lg py-16 flex flex-col items-center justify-center">
            <div className="text-4xl mb-3">🚧</div>
            <h2 className="text-[16px] font-semibold text-gray-800 mb-1">
              {activeNav.charAt(0).toUpperCase() + activeNav.slice(1)}
            </h2>
            <p className="text-[13px] text-gray-500">
              This page is coming soon.
            </p>
          </div>
        );
    }
  };

  return (
    <AppLayout user={currentUser} activeNav={activeNav} onNavChange={setActiveNav}>
      {renderPage()}
    </AppLayout>
  );
}
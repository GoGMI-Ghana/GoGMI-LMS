import { useState } from "react";
import { AppLayout } from "./components/layout";
import LoginPage from "./pages/auth/LoginPage.tsx";
import DashboardPage from "./pages/student/DashboardPage.tsx";
import CatalogPage from "./pages/student/CatalogPage.tsx";
import CourseDetailPage from "./pages/student/CourseDetailPage.tsx";
import MyCoursesPage from "./pages/student/MyCoursesPage.tsx";
import AssessmentsPage from "./pages/student/AssessmentsPage.tsx";
import CertificatesPage from "./pages/student/CertificatesPage.tsx";
import CalendarPage from "./pages/student/CalendarPage.tsx";
import DiscussionsPage from "./pages/student/DiscussionsPage.tsx";
import MessagesPage from "./pages/student/MessagesPage.tsx";
import SettingsPage from "./pages/student/SettingsPage.tsx";
import HelpPage from "./pages/student/HelpPage.tsx";
import { currentUser } from "./data/mock";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeNav, setActiveNav] = useState("dashboard");
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);

  if (!isAuthenticated) {
    return <LoginPage onLogin={() => setIsAuthenticated(true)} />;
  }

  const handleNavChange = (id: string) => {
    setActiveNav(id);
    setSelectedCourseId(null);
  };

  const renderPage = () => {
    if (selectedCourseId) {
      return <CourseDetailPage courseId={selectedCourseId} onBack={() => setSelectedCourseId(null)} />;
    }
    switch (activeNav) {
      case "dashboard":
        return <DashboardPage />;
      case "courses":
        return <MyCoursesPage />;
      case "catalog":
        return <CatalogPage onSelectCourse={(id) => setSelectedCourseId(id)} />;
      case "calendar":
        return <CalendarPage />;
      case "assessments":
        return <AssessmentsPage />;
      case "certificates":
        return <CertificatesPage />;
      case "discussions":
        return <DiscussionsPage />;
      case "messages":
        return <MessagesPage />;
      case "settings":
        return <SettingsPage />;
      case "help":
        return <HelpPage />;
      default:
        return (
          <div className="bg-white border border-gray-200 rounded-lg py-16 flex flex-col items-center justify-center">
            <h2 className="text-[16px] font-semibold text-gray-800 mb-1">
              {activeNav.charAt(0).toUpperCase() + activeNav.slice(1)}
            </h2>
            <p className="text-[13px] text-gray-500">This page is coming soon.</p>
          </div>
        );
    }
  };

  return (
    <AppLayout user={currentUser} activeNav={activeNav} onNavChange={handleNavChange}>
      {renderPage()}
    </AppLayout>
  );
}
import { lazy, Suspense } from "react";
import { createBrowserRouter, Navigate, Outlet, type RouteObject } from "react-router-dom";
import { AuthProvider } from "../contexts/AuthContext";
import { AppLayout } from "../components/layout";
import { AdminLayout } from "../components/admin";
import { InstructorLayout } from "../components/instructor";
import { ProtectedRoute, LoadingSpinner } from "../components/common";

// Auth pages
const LoginPage = lazy(() => import("../pages/auth/LoginPage"));
const RegisterPage = lazy(() => import("../pages/auth/RegisterPage"));
const ForgotPasswordPage = lazy(() => import("../pages/auth/ForgotPasswordPage"));
const ResetPasswordPage = lazy(() => import("../pages/auth/ResetPasswordPage"));

// Student pages
const DashboardPage = lazy(() => import("../pages/student/DashboardPage"));
const MyCoursesPage = lazy(() => import("../pages/student/MyCoursesPage"));
const CatalogPage = lazy(() => import("../pages/student/CatalogPage"));
const CourseDetailPage = lazy(() => import("../pages/student/CourseDetailPage"));
const CalendarPage = lazy(() => import("../pages/student/CalendarPage"));
const AssessmentsPage = lazy(() => import("../pages/student/AssessmentsPage"));
const CertificatesPage = lazy(() => import("../pages/student/CertificatesPage"));
const DiscussionsPage = lazy(() => import("../pages/student/DiscussionsPage"));
const MessagesPage = lazy(() => import("../pages/student/MessagesPage"));
const SettingsPage = lazy(() => import("../pages/student/SettingsPage"));
const HelpPage = lazy(() => import("../pages/student/HelpPage"));

// Admin pages
const AdminOverviewPage = lazy(() => import("../pages/admin/AdminOverviewPage"));
const AdminUsersPage = lazy(() => import("../pages/admin/AdminUsersPage"));
const AdminCoursesPage = lazy(() => import("../pages/admin/AdminCoursesPage"));
const AdminEnrollmentsPage = lazy(() => import("../pages/admin/AdminEnrollmentsPage"));
const AdminPaymentsPage = lazy(() => import("../pages/admin/AdminPaymentsPage"));
const AdminAnnouncementsPage = lazy(() => import("../pages/admin/AdminAnnouncementsPage"));
const AdminReportsPage = lazy(() => import("../pages/admin/AdminReportsPage"));

// Instructor pages
const InstructorDashboardPage = lazy(() => import("../pages/instructor/InstructorDashboardPage"));
const InstructorCoursesPage = lazy(() => import("../pages/instructor/InstructorCoursesPage"));
const InstructorCourseManagePage = lazy(() => import("../pages/instructor/InstructorCourseManagePage"));
const InstructorStudentsPage = lazy(() => import("../pages/instructor/InstructorStudentsPage"));
const InstructorAssessmentsPage = lazy(() => import("../pages/instructor/InstructorAssessmentsPage"));
const InstructorGradingPage = lazy(() => import("../pages/instructor/InstructorGradingPage"));
const InstructorDiscussionsPage = lazy(() => import("../pages/instructor/InstructorDiscussionsPage"));
const InstructorAnnouncementsPage = lazy(() => import("../pages/instructor/InstructorAnnouncementsPage"));
const InstructorAnalyticsPage = lazy(() => import("../pages/instructor/InstructorAnalyticsPage"));

function Lazy({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<LoadingSpinner />}>{children}</Suspense>;
}

function RootLayout() {
  return <AuthProvider><Outlet /></AuthProvider>;
}

const routes: RouteObject[] = [
  {
    element: <RootLayout />,
    children: [
      // Public
      { path: "/login", element: <Lazy><LoginPage /></Lazy> },
      { path: "/register", element: <Lazy><RegisterPage /></Lazy> },
      { path: "/forgot-password", element: <Lazy><ForgotPasswordPage /></Lazy> },
      { path: "/reset-password", element: <Lazy><ResetPasswordPage /></Lazy> },

      // Student + Admin + Instructor (everyone can browse courses)
      {
        element: <ProtectedRoute allowedRoles={["STUDENT", "ADMIN", "INSTRUCTOR"]} />,
        children: [{
          element: <AppLayout />,
          children: [
            { index: true, element: <Navigate to="/dashboard" replace /> },
            { path: "dashboard", element: <Lazy><DashboardPage /></Lazy> },
            { path: "courses", element: <Lazy><MyCoursesPage /></Lazy> },
            { path: "catalog", element: <Lazy><CatalogPage /></Lazy> },
            { path: "catalog/:courseId", element: <Lazy><CourseDetailPage /></Lazy> },
            { path: "calendar", element: <Lazy><CalendarPage /></Lazy> },
            { path: "assessments", element: <Lazy><AssessmentsPage /></Lazy> },
            { path: "certificates", element: <Lazy><CertificatesPage /></Lazy> },
            { path: "discussions", element: <Lazy><DiscussionsPage /></Lazy> },
            { path: "messages", element: <Lazy><MessagesPage /></Lazy> },
            { path: "settings", element: <Lazy><SettingsPage /></Lazy> },
            { path: "help", element: <Lazy><HelpPage /></Lazy> },
          ],
        }],
      },

      // Instructor portal
      {
        element: <ProtectedRoute allowedRoles={["INSTRUCTOR", "ADMIN"]} />,
        children: [{
          path: "instructor",
          element: <InstructorLayout />,
          children: [
            { index: true, element: <Lazy><InstructorDashboardPage /></Lazy> },
            { path: "courses", element: <Lazy><InstructorCoursesPage /></Lazy> },
            { path: "courses/:courseId", element: <Lazy><InstructorCourseManagePage /></Lazy> },
            { path: "students", element: <Lazy><InstructorStudentsPage /></Lazy> },
            { path: "assessments", element: <Lazy><InstructorAssessmentsPage /></Lazy> },
            { path: "grading", element: <Lazy><InstructorGradingPage /></Lazy> },
            { path: "discussions", element: <Lazy><InstructorDiscussionsPage /></Lazy> },
            { path: "announcements", element: <Lazy><InstructorAnnouncementsPage /></Lazy> },
            { path: "analytics", element: <Lazy><InstructorAnalyticsPage /></Lazy> },
          ],
        }],
      },

      // Admin
      {
        element: <ProtectedRoute allowedRoles={["ADMIN"]} />,
        children: [{
          path: "admin",
          element: <AdminLayout />,
          children: [
            { index: true, element: <Lazy><AdminOverviewPage /></Lazy> },
            { path: "users", element: <Lazy><AdminUsersPage /></Lazy> },
            { path: "courses", element: <Lazy><AdminCoursesPage /></Lazy> },
            { path: "enrollments", element: <Lazy><AdminEnrollmentsPage /></Lazy> },
            { path: "payments", element: <Lazy><AdminPaymentsPage /></Lazy> },
            { path: "announcements", element: <Lazy><AdminAnnouncementsPage /></Lazy> },
            { path: "reports", element: <Lazy><AdminReportsPage /></Lazy> },
          ],
        }],
      },

      { path: "*", element: <Navigate to="/dashboard" replace /> },
    ],
  },
];

export const router = createBrowserRouter(routes);
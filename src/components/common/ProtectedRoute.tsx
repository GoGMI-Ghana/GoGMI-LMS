import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import type { UserRole } from "../../types";

interface ProtectedRouteProps {
  allowedRoles?: UserRole[];
}

export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  // Not logged in → redirect to login, preserve intended destination
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // Logged in but wrong role → redirect to their own dashboard
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    const roleHome: Record<UserRole, string> = {
      student: "/dashboard",
      instructor: "/instructor",
      admin: "/admin",
    };
    return <Navigate to={roleHome[user.role]} replace />;
  }

  return <Outlet />;
}
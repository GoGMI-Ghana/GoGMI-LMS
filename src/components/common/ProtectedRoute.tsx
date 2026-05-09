import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

interface ProtectedRouteProps {
  allowedRoles?: string[];
}

export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    const roleHome: Record<string, string> = {
      STUDENT: "/dashboard",
      INSTRUCTOR: "/instructor",
      ADMIN: "/admin",
    };
    return <Navigate to={roleHome[user.role] || "/dashboard"} replace />;
  }

  return <Outlet />;
}
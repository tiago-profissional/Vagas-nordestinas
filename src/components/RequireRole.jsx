import { Navigate, Outlet } from "react-router-dom";

export default function RequireRole({ user, roles }) {
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}


 
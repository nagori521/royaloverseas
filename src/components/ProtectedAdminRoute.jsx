import { Navigate, Outlet } from 'react-router-dom';

export default function ProtectedAdminRoute() {
  const user = JSON.parse(localStorage.getItem('royalAdminUser') || '{}');
  const isAdmin =
    localStorage.getItem('royalAdminAuth') === 'true' ||
    user.role === 'admin' ||
    user.role === 'super_admin';

  if (!isAdmin) {
    return <Navigate to="/ro-panel-2026/login" replace />;
  }

  return <Outlet />;
}
